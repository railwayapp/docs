---
title: Deploy a RAG Pipeline with pgvector
description: Build a retrieval-augmented generation pipeline on Railway using Postgres with pgvector for vector storage, an external embedding API, and an LLM for generation. Covers document ingestion, similarity search, and deployment.
date: "2026-04-14"
tags:
  - rag
  - pgvector
  - embeddings
  - postgres
  - python
topic: ai
---

Retrieval-augmented generation (RAG) combines a vector database with an LLM to answer questions using your own data. Instead of relying only on the model's training data, the system retrieves relevant documents from a vector store and includes them in the prompt.

This guide covers deploying a RAG pipeline on Railway using Postgres with the pgvector extension for vector storage, an external embedding API for generating vectors, and an external LLM API for generation.

Railway is a CPU-based platform. Both embedding generation and text generation call external APIs (OpenAI, Cohere, etc.) over HTTP. No models run locally.

## Architecture overview

The pipeline has three components:

- **Postgres with pgvector** stores document chunks and their embedding vectors. Deployed from Railway's pgvector template.
- **API service** accepts queries, retrieves relevant documents via similarity search, and calls the LLM with the retrieved context.
- **Ingestion script** (or endpoint) chunks documents, generates embeddings via an external API, and stores them in Postgres.

## Prerequisites

- A Railway account
- An API key from [OpenAI](https://platform.openai.com/api-keys) (for both embeddings and chat completions) or separate embedding and LLM providers
- Documents to ingest (text files, markdown, or any text content)

## 1. Deploy Postgres with pgvector

Railway's standard Postgres image does not include pgvector. Use the pgvector template instead:

1. Click the button below to deploy Postgres with pgvector:

   [![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/deploy/3jJFCA)

2. After the template deploys, note the `DATABASE_URL` connection string from the service's **Variables** tab.

## 2. Create the vector table

Connect to your pgvector Postgres instance and create a table for document chunks and their embeddings:

```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE documents (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  embedding vector(1536)
);

CREATE INDEX idx_documents_embedding ON documents
  USING hnsw (embedding vector_cosine_ops);
```

The `vector(1536)` type matches OpenAI's `text-embedding-3-small` output dimension. Adjust the dimension if you use a different embedding model.

The HNSW index provides fast approximate nearest-neighbor search. For datasets under 100,000 rows, an IVFFlat index is also viable and uses less memory during index creation.

## 3. Set up the project

Create a project directory with the following files:

### requirements.txt

```
fastapi
uvicorn
openai
psycopg2-binary
```

Install dependencies locally with `pip install -r requirements.txt`.

## 4. Build the ingestion pipeline

The ingestion step chunks your documents, generates embeddings, and inserts them into Postgres:

```python
# ingest.py
import os
import psycopg2
import psycopg2.extras
from openai import OpenAI

client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
DATABASE_URL = os.environ["DATABASE_URL"]

def chunk_text(text: str, chunk_size: int = 500) -> list[str]:
    words = text.split()
    return [
        " ".join(words[i:i + chunk_size])
        for i in range(0, len(words), chunk_size)
    ]

def embed(texts: list[str]) -> list[list[float]]:
    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=texts,
    )
    return [item.embedding for item in response.data]

def ingest(text: str, metadata: dict = None):
    chunks = chunk_text(text)
    embeddings = embed(chunks)

    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()
    for chunk, emb in zip(chunks, embeddings):
        cur.execute(
            "INSERT INTO documents (content, metadata, embedding) VALUES (%s, %s, %s)",
            (chunk, psycopg2.extras.Json(metadata or {}), str(emb)),
        )
    conn.commit()
    cur.close()
    conn.close()

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("Usage: python ingest.py <file_path>")
        sys.exit(1)
    with open(sys.argv[1]) as f:
        ingest(f.read(), {"source": sys.argv[1]})
    print(f"Ingested {sys.argv[1]}")
```

Run locally with `python ingest.py my_document.txt`, or run it on Railway using the [CLI](/cli): `railway run python ingest.py my_document.txt`. For ongoing ingestion at scale, consider the [async workers pattern](/guides/ai-agent-workers).

## 5. Build the query endpoint

The query endpoint embeds the user's question, finds similar document chunks, and sends them to the LLM as context:

```python
# app.py
import os
import psycopg2
from fastapi import FastAPI
from openai import OpenAI

app = FastAPI()
client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
DATABASE_URL = os.environ["DATABASE_URL"]

@app.post("/query")
async def query(question: str):
    # 1. Embed the question
    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=question,
    )
    query_embedding = str(response.data[0].embedding)

    # 2. Retrieve similar documents
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()
    cur.execute(
        """
        SELECT content, 1 - (embedding <=> %s::vector) AS similarity
        FROM documents
        ORDER BY embedding <=> %s::vector
        LIMIT 5
        """,
        (query_embedding, query_embedding),
    )
    results = cur.fetchall()
    cur.close()
    conn.close()

    context = "\n\n".join(row[0] for row in results)

    # 3. Generate a response with context
    completion = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "system",
                "content": f"Answer based on the following context:\n\n{context}",
            },
            {"role": "user", "content": question},
        ],
    )

    return {
        "answer": completion.choices[0].message.content,
        "sources": [{"content": row[0], "similarity": row[1]} for row in results],
    }
```

## 6. Deploy the API service

1. Push your code to a GitHub repository.
2. In your Railway project (the same one with pgvector), click **+ New > GitHub Repo** and select your repository.
3. Set the [start command](/deployments/start-command) to: `uvicorn app:app --host 0.0.0.0 --port $PORT`
4. Add environment variables:
   - [Reference](/variables#referencing-another-services-variable) `DATABASE_URL` from your pgvector service.
   - Set `OPENAI_API_KEY` to your API key.
5. Generate a [public domain](/networking/public-networking#railway-provided-domain) under **Settings > Networking**.

The API service communicates with Postgres over [private networking](/networking/private-networking) automatically since both services are in the same project.

## Performance considerations

- **Embedding API costs**: OpenAI's `text-embedding-3-small` costs $0.02 per million tokens. Cache embeddings in Postgres to avoid re-embedding the same content.
- **Query latency**: The embedding API call adds 100-300ms per query. The pgvector similarity search is fast (single-digit milliseconds for datasets under 1M rows with an HNSW index).
- **Scaling**: For high query volume, add [horizontal replicas](/deployments/scaling) to the API service. All replicas share the same Postgres instance.

## Next steps

- [Deploy an AI Chatbot with Streaming Responses](/guides/ai-chatbot-streaming): Add a chat UI with streaming on top of your RAG pipeline.
- [Deploy an AI Agent with Async Workers](/guides/ai-agent-workers): Process large document ingestion jobs asynchronously.
- [PostgreSQL on Railway](/databases/postgresql): Connection pooling, backups, and configuration.
- [Scaling](/deployments/scaling): Configure horizontal and vertical scaling for your services.
