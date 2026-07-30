---
title: Build Hybrid Search with Postgres Full-Text Search and pgvector
description: Combine Postgres full-text search and pgvector similarity search in one database, then merge results with Reciprocal Rank Fusion. Includes schema, SQL, and a deployable Node API.
date: "2026-07-29"
tags:
  - postgres
  - pgvector
  - search
  - full-text-search
topic: architecture
---

In this guide we build a hybrid search API on Railway: one Postgres service running pgvector, and one Node service that ingests documents, queries both indexes, and merges the rankings with Reciprocal Rank Fusion (RRF). By the end, `POST /documents` ingests and `GET /search` returns merged results, all from one database.

Hybrid search runs two retrieval strategies over the same data and merges the results: lexical search, which matches the exact words in a query, and semantic search, which matches meaning through embedding vectors. Postgres does both. Full-text search (`tsvector`) handles the lexical side, and the pgvector extension handles the semantic side, so there is no separate search engine to run.

If you want a full retrieval-augmented generation pipeline on top of this, see [Deploy a RAG Pipeline with pgvector](/guides/rag-pipeline-pgvector). This guide focuses on the search layer itself.

## Why combine full-text and vector search

Each strategy fails in a different way.

- **Full-text search** is precise on exact terms. A query for `ERR_CONNECTION_RESET` or a product SKU finds documents containing that string. It fails on paraphrases: "reduce cloud spend" will not match a document that only says "lower infrastructure costs".
- **Vector search** matches meaning. Paraphrases score well. It fails on rare exact tokens: error codes, identifiers, and names that the embedding model has little signal for often rank below loosely related prose.

Merging both rankings gives exact-match precision and paraphrase recall in the same result list. RRF is the standard merge: it needs no score normalization, only each document's rank position in each list.

## Prerequisites

- A Railway account
- An [OpenAI API key](https://platform.openai.com/api-keys) for generating embeddings (any embedding provider works; the code isolates this in one function)
- Node.js 20+ locally for development

## 1. Deploy Postgres with pgvector

Railway's standard Postgres image does not include pgvector. Deploy the pgvector template instead:

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/deploy/3jJFCA)

After it deploys, copy the `DATABASE_URL` from the service's **Variables** tab. You will use the public URL for local development and the [private network](/networking/private-networking) URL in production.

## 2. Create the schema

Connect with `psql` (or the [database view](/databases/database-view)) and run:

```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE documents (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  embedding vector(1536),
  fts tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(content, '')), 'B')
  ) STORED
);

CREATE INDEX idx_documents_fts ON documents USING gin (fts);

CREATE INDEX idx_documents_embedding ON documents
  USING hnsw (embedding vector_cosine_ops);
```

Three details matter here:

- `fts` is a **generated column**. Postgres recomputes it on every insert and update, so the lexical index never drifts from the content.
- `setweight` ranks title matches (`A`) above body matches (`B`) in `ts_rank_cd` scoring.
- The HNSW index uses `vector_cosine_ops` to match the `<=>` cosine distance operator used in queries. Its dimension, `1536`, matches OpenAI's `text-embedding-3-small`, so change it if you use a different model.

## 3. Write the hybrid query

The query runs both searches as CTEs, takes the top 50 from each, and merges them with RRF. A document's RRF score is `1 / (k + rank)` summed across the lists it appears in, with `k = 60` as the conventional smoothing constant.

```sql
WITH lexical AS (
  SELECT id,
         row_number() OVER (ORDER BY ts_rank_cd(fts, query) DESC) AS rank
  FROM documents, websearch_to_tsquery('english', $1) AS query
  WHERE fts @@ query
  ORDER BY ts_rank_cd(fts, query) DESC
  LIMIT 50
),
semantic AS (
  SELECT id,
         row_number() OVER (ORDER BY embedding <=> $2::vector) AS rank
  FROM documents
  WHERE embedding IS NOT NULL
  ORDER BY embedding <=> $2::vector
  LIMIT 50
)
SELECT d.id,
       d.title,
       d.content,
       coalesce(1.0 / (60 + lexical.rank), 0.0) +
       coalesce(1.0 / (60 + semantic.rank), 0.0) AS score
FROM lexical
FULL OUTER JOIN semantic USING (id)
JOIN documents d USING (id)
ORDER BY score DESC
LIMIT $3;
```

The `FULL OUTER JOIN` keeps documents found by only one strategy. A document ranked first in both lists scores `2/61 ≈ 0.0328`; a document found only by vector search at rank 10 scores `1/70 ≈ 0.0143`. On the lexical side feeding that join, `websearch_to_tsquery` parses the raw search string safely, including quoted phrases and `-exclusions`, so user input needs no manual escaping into tsquery syntax.

## 4. Build the search API

Create the project:

```bash
mkdir hybrid-search && cd hybrid-search
npm init -y
npm install express pg
npm install --save-dev typescript @types/express @types/pg @types/node
npx tsc --init --strict --module nodenext --moduleResolution nodenext --rootDir src --outDir dist
```

Create `src/index.ts`:

```typescript
import express from "express";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const app = express();
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const EMBEDDING_MODEL = "text-embedding-3-small";

async function embed(text: string): Promise<number[]> {
  const res = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model: EMBEDDING_MODEL, input: text }),
  });
  if (!res.ok) {
    throw new Error(`Embedding request failed: ${res.status}`);
  }
  const data = (await res.json()) as {
    data: { embedding: number[] }[];
  };
  const first = data.data[0];
  if (!first) {
    throw new Error("Embedding response contained no data");
  }
  return first.embedding;
}

// Ingest a document: store content, tsvector is generated automatically.
app.post("/documents", async (req, res) => {
  const { title, content } = req.body as { title?: string; content?: string };
  if (!title || !content) {
    res.status(400).json({ error: "title and content are required" });
    return;
  }
  try {
    const embedding = await embed(`${title}\n\n${content}`);
    const result = await pool.query(
      `INSERT INTO documents (title, content, embedding)
       VALUES ($1, $2, $3::vector) RETURNING id`,
      [title, content, JSON.stringify(embedding)]
    );
    res.status(201).json({ id: result.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "ingestion failed" });
  }
});

// Hybrid search: full-text + vector, merged with Reciprocal Rank Fusion.
app.get("/search", async (req, res) => {
  const q = req.query.q;
  if (typeof q !== "string" || q.trim() === "") {
    res.status(400).json({ error: "q query parameter is required" });
    return;
  }
  const limit = Math.min(Number(req.query.limit) || 10, 50);
  try {
    const queryEmbedding = await embed(q);
    const result = await pool.query(
      `WITH lexical AS (
         SELECT id,
                row_number() OVER (ORDER BY ts_rank_cd(fts, query) DESC) AS rank
         FROM documents, websearch_to_tsquery('english', $1) AS query
         WHERE fts @@ query
         ORDER BY ts_rank_cd(fts, query) DESC
         LIMIT 50
       ),
       semantic AS (
         SELECT id,
                row_number() OVER (ORDER BY embedding <=> $2::vector) AS rank
         FROM documents
         WHERE embedding IS NOT NULL
         ORDER BY embedding <=> $2::vector
         LIMIT 50
       )
       SELECT d.id,
              d.title,
              left(d.content, 300) AS snippet,
              coalesce(1.0 / (60 + lexical.rank), 0.0) +
              coalesce(1.0 / (60 + semantic.rank), 0.0) AS score
       FROM lexical
       FULL OUTER JOIN semantic USING (id)
       JOIN documents d USING (id)
       ORDER BY score DESC
       LIMIT $3`,
      [q, JSON.stringify(queryEmbedding), limit]
    );
    res.json({ query: q, results: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "search failed" });
  }
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

const port = Number(process.env.PORT) || 3000;
app.listen(port, "0.0.0.0", () => {
  console.log(`Hybrid search API listening on ${port}`);
});
```

Add build and start scripts to `package.json`, and set `"type": "module"` since the compiler is configured for ES modules:

```json
{
  "type": "module",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

The embedding is passed to Postgres as a JSON string and cast with `::vector`, which pgvector accepts directly. No pgvector client library is required.

## 5. Deploy to Railway

Push the project to a GitHub repo, then in your Railway project click **Create** and select the repo. Railway detects Node and builds it with [Railpack](/builds/build-configuration).

Set two variables on the service under **Variables**:

- `DATABASE_URL`: reference the pgvector service's variable so it resolves over the private network, for example `${{Postgres.DATABASE_URL}}`. Private traffic between services in the same environment does not leave Railway.
- `OPENAI_API_KEY`: your OpenAI key.

Add a domain under **Settings → Networking** to expose the API at a `*.up.railway.app` URL. Set the [healthcheck path](/deployments/healthchecks) to `/health` so deploys only go live after the service responds.

Test it:

```bash
curl -X POST https://your-app.up.railway.app/documents \
  -H "Content-Type: application/json" \
  -d '{"title": "Lowering infrastructure costs", "content": "Strategies for reducing compute and storage spend across environments."}'

curl "https://your-app.up.railway.app/search?q=reduce+cloud+spend"
```

The query "reduce cloud spend" shares no keywords with the document, so full-text search misses it. The semantic branch finds it, and RRF surfaces it in the merged results.

## Tuning the ranking

- **Candidate depth.** The `LIMIT 50` in each CTE controls how deep each strategy contributes. Raise it for large corpora where relevant documents sit below rank 50 in one list.
- **The `k` constant.** Lower `k` (for example 10) amplifies top-ranked results; higher `k` flattens the blend. The original RRF paper uses `k = 60`; start there.
- **Weighting one side.** Multiply one branch's term, such as `1.5 * coalesce(1.0 / (60 + semantic.rank), 0.0)`, to bias toward semantic or lexical results. Tune against real queries from your own traffic.
- **Language config.** `'english'` in `to_tsvector` and `websearch_to_tsquery` controls stemming and stop words. Use the config matching your content's language, or `'simple'` to disable stemming.
- **Index recall.** HNSW is approximate. If vector recall matters more than latency, raise `hnsw.ef_search` per session: `SET hnsw.ef_search = 100;`.

## Operational notes

- Both indexes live in the same database, so ingestion is one transaction. There is no sync job between a search engine and a source of truth, which removes an entire failure class.
- Embedding calls go to an external API. Railway services are CPU-based, so run embedding remotely rather than loading a local model.
- Postgres full-text search and pgvector both scale vertically with the database. Resource usage on Railway is billed by actual consumption, so an idle search index costs only its storage.

## Next steps

- [Deploy a RAG Pipeline with pgvector](/guides/rag-pipeline-pgvector)
- [PostgreSQL on Railway](/databases/postgresql)
- [Private networking](/networking/private-networking)
- [Variables and references](/variables)
