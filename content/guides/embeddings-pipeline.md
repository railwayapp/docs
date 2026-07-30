---
title: Run an Embeddings Pipeline with an External API and pgvector
description: Deploy a batch worker on Railway that generates embeddings through an external API and stores them in Postgres with pgvector. Covers schema design, safe concurrent processing, and the psycopg2 vector adaptation gotcha.
date: "2026-07-29"
tags:
  - embeddings
  - pgvector
  - workers
  - python
topic: ai
---

An embeddings pipeline on Railway needs three pieces: Postgres with the pgvector extension for storage, an external embedding API for vector generation, and a long-running Python worker between them. Rows arrive without embeddings, the worker picks them up in batches, calls the embedding API, and writes the vectors back. Search and RAG features then query those vectors with pgvector.

This guide covers the ingestion side. For the query and generation side, see the [RAG pipeline guide](/guides/rag-pipeline-pgvector).

Railway runs CPU workloads only, with no GPU support, so embedding models can't run locally. The worker instead calls an external API (OpenAI in this guide, but any embedding provider works) over HTTP. That call is I/O-bound from the worker's perspective, so a small CPU instance handles high throughput.

## How the pipeline works

The pipeline has two services in one Railway project:

- **Postgres with pgvector** stores rows and their embedding vectors. Deployed from Railway's pgvector template.
- **Batch worker** polls for rows without embeddings, calls the embedding API in batches, and writes vectors back. It runs continuously and needs no public domain.

Your application inserts rows with a `NULL` embedding. The worker fills them in asynchronously. This decouples writes from embedding latency: inserts stay fast, and API failures or rate limits don't block your application.

## Prerequisites

- A Railway account
- An API key from [OpenAI](https://platform.openai.com/api-keys) or another embedding provider

## 1. Deploy Postgres with pgvector

Railway's standard Postgres image does not include pgvector. Deploy the pgvector template instead:

1. Click the button below:

   [![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/deploy/3jJFCA)

2. After the template deploys, note the `DATABASE_URL` connection string in the service's **Variables** tab.

## 2. Create the schema

Connect to the database (use the **Data** tab on the service, or `psql "$DATABASE_URL"` locally) and run:

```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE items (
    id BIGSERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    embedding VECTOR(1536),
    embedded_at TIMESTAMPTZ
);

-- Partial index so the worker finds pending rows fast,
-- even when the table has millions of embedded rows.
CREATE INDEX items_pending_idx ON items (id) WHERE embedding IS NULL;
```

The `embedding` column is nullable by design: a `NULL` value means "pending". Its dimension (1536 here) must match your embedding model: `text-embedding-3-small` produces 1536 dimensions, `text-embedding-3-large` produces 3072.

Hold off on creating a vector similarity index until after the initial backfill. Building an HNSW index on a full table is much faster than maintaining it row by row during a large backfill.

## 3. Set up the worker project

Create a project directory with two files.

### requirements.txt

```
openai
psycopg2-binary
pgvector
```

Install locally with `pip install -r requirements.txt`.

### worker.py

```python
# worker.py
import os
import time

import psycopg2
from openai import OpenAI
from pgvector import Vector
from pgvector.psycopg2 import register_vector

client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
DATABASE_URL = os.environ["DATABASE_URL"]

BATCH_SIZE = 100
POLL_INTERVAL = 10  # seconds to wait when no rows are pending
EMBEDDING_MODEL = "text-embedding-3-small"


def embed(texts: list[str]) -> list[list[float]]:
    response = client.embeddings.create(model=EMBEDDING_MODEL, input=texts)
    return [item.embedding for item in response.data]


def process_batch(conn) -> int:
    with conn.cursor() as cur:
        cur.execute(
            """
            SELECT id, content FROM items
            WHERE embedding IS NULL
            ORDER BY id
            LIMIT %s
            FOR UPDATE SKIP LOCKED
            """,
            (BATCH_SIZE,),
        )
        rows = cur.fetchall()
        if not rows:
            conn.commit()
            return 0

        ids = [row[0] for row in rows]
        texts = [row[1] for row in rows]
        embeddings = embed(texts)

        for item_id, emb in zip(ids, embeddings):
            cur.execute(
                """
                UPDATE items
                SET embedding = %s, embedded_at = now()
                WHERE id = %s
                """,
                (Vector(emb), item_id),
            )
    conn.commit()
    return len(rows)


def main() -> None:
    conn = psycopg2.connect(DATABASE_URL)
    register_vector(conn)
    print("Embeddings worker started")
    while True:
        try:
            count = process_batch(conn)
        except Exception as exc:
            conn.rollback()
            print(f"Batch failed, retrying in 30s: {exc}")
            time.sleep(30)
            continue
        if count:
            print(f"Embedded {count} rows")
        else:
            time.sleep(POLL_INTERVAL)


if __name__ == "__main__":
    main()
```

A few design decisions:

- **Batching.** One API call embeds up to `BATCH_SIZE` texts. This is far cheaper in request overhead and rate-limit budget than one call per row.
- **`FOR UPDATE SKIP LOCKED`.** Each worker locks the rows it is processing and skips rows locked by others. You can scale to multiple worker replicas without double-embedding rows.
- **Claim and write in one transaction.** If the API call fails, the transaction rolls back and the rows stay pending. No row is ever marked done without a vector.
- **Failure handling.** On any error the worker rolls back, waits 30 seconds, and retries. Rate-limit errors from the API resolve themselves this way.

## The psycopg2 vector adaptation gotcha

psycopg2 does not know pgvector's `vector` type, and this fails in confusing ways.

If you pass a plain Python list as a query parameter, psycopg2 adapts it to a Postgres array (`ARRAY[0.1, 0.2, ...]`, type `double precision[]`). Plain `INSERT` and `UPDATE` statements may appear to work because pgvector defines assignment casts from arrays to `vector`. But the same list in a similarity expression fails:

```
operator does not exist: vector <=> double precision[]
```

And if you pass a numpy array without registering anything, psycopg2 raises:

```
can't adapt type 'numpy.ndarray'
```

There are two reliable fixes:

1. **Register the type (used in this guide).** Call `register_vector(conn)` from the `pgvector` package after connecting, and wrap values in `Vector(...)` when passing them as parameters. Registration also makes `SELECT` return `Vector` objects instead of strings. Note that `register_vector` adapts `Vector` objects and numpy arrays, not plain lists, which is why the worker wraps each embedding in `Vector(emb)`.
2. **Send a string.** `str(embedding)` produces `[0.1, 0.2, ...]`, which Postgres parses as an untyped literal and casts to `vector`. This works without the `pgvector` package but gives you strings back on read, and it silently masks dimension mistakes until query time.

## 4. Deploy the worker

1. Push the project to a GitHub repository.
2. In your Railway project, create a new service from that repository. Railpack detects Python from `requirements.txt` and installs dependencies automatically.
3. Set the start command to `python worker.py` in the service settings.
4. In the service's **Variables** tab:
   - Add `OPENAI_API_KEY`.
   - [Reference](/variables#referencing-another-services-variable) `DATABASE_URL` from the pgvector service: `${{Postgres.DATABASE_URL}}`. `DATABASE_URL` connects over [private networking](/networking/private-networking), so traffic stays internal and avoids egress fees; avoid `DATABASE_PUBLIC_URL`, which routes over the public TCP proxy and is billed as egress.

Do not generate a public domain for this service. The worker makes only outbound calls and exposes nothing.

To backfill existing data, deploy the worker: it drains all pending rows, then settles into polling. To process more rows per minute, raise `BATCH_SIZE` or add replicas; `SKIP LOCKED` keeps them from colliding.

### Alternative: run it as a cron job

If new rows arrive in slow trickles, a continuously running worker wastes little (Railway bills actual usage, and an idle Python process consumes a few MB of RAM), but you can run the same script as a [cron job](/cron-jobs) instead. Change the loop to exit when `process_batch` returns 0, close the database connection before exiting, and set a cron schedule on the service. The minimum interval is 5 minutes, schedules run in UTC, and if a run is still going when the next one is due, Railway skips the new run rather than terminating the old one.

## 5. Index after the backfill

Once the initial backfill finishes, create a similarity index so queries stay fast:

```sql
CREATE INDEX items_embedding_idx ON items
USING hnsw (embedding vector_cosine_ops);
```

Then query nearest neighbors from your application:

```sql
SELECT id, content, 1 - (embedding <=> %s) AS similarity
FROM items
WHERE embedding IS NOT NULL
ORDER BY embedding <=> %s
LIMIT 10;
```

Pass the query embedding as a `Vector(...)` parameter, the same way the worker writes them. The `WHERE embedding IS NOT NULL` filter excludes rows the worker has not reached yet.

## Handling model changes

Embeddings from different models are not comparable. If you switch models, re-embed everything: the pipeline already handles this. To do that, run `UPDATE items SET embedding = NULL;`, drop the HNSW index, update `EMBEDDING_MODEL` in the worker, and let it re-drain the table. If the new model has a different dimension, alter the column type first (`ALTER TABLE items ALTER COLUMN embedding TYPE VECTOR(3072);`).

## Next steps

- [Deploy a RAG Pipeline with pgvector](/guides/rag-pipeline-pgvector): add the query endpoint and LLM generation on top of these embeddings.
- [Build Hybrid Search with Postgres and pgvector](/guides/hybrid-search-postgres-pgvector): combine vector similarity with full-text search.
- [Cron Jobs, Workers, and Queues](/guides/cron-workers-queues): pick the right background-processing pattern.
- [PostgreSQL on Railway](/databases/postgresql): database management, backups, and extensions.
