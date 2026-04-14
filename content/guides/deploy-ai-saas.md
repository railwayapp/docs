---
title: Deploy an AI-Powered SaaS App on Railway
description: Deploy a production AI-powered SaaS application on Railway with a FastAPI backend, Postgres database, and external LLM API integration. Covers API key management, request caching, rate limiting, and async processing for longer tasks.
date: "2026-04-14"
tags:
  - ai
  - saas
  - python
  - fastapi
  - postgres
topic: ai
---

This guide covers deploying a SaaS application that integrates LLM APIs on Railway. The pattern applies to any product that takes user input, processes it through an LLM, and returns or stores the result: resume builders, content generators, code reviewers, data analyzers, and similar tools.

Railway is a CPU-based platform. Your application calls external LLM APIs (OpenAI, Anthropic, etc.) over HTTP. No models run locally.

## Architecture overview

A typical AI SaaS app on Railway uses three components:

- **API service** (FastAPI, Express, etc.) handles user requests, calls the LLM API, and returns results.
- **Postgres** stores user data, cached LLM responses, and job status for async tasks.
- **Redis** (optional) provides job queuing for tasks that take longer than a few seconds.

For tasks that complete in under 30 seconds, a synchronous request/response pattern works well. For longer tasks, use the [async workers pattern](/guides/ai-agent-workers).

## Prerequisites

- A Railway account
- An API key from [OpenAI](https://platform.openai.com/api-keys) or [Anthropic](https://console.anthropic.com/)
- Application code with a web framework (FastAPI, Express, Django, etc.)

## 1. Create the project and database

1. Create a new [project](/projects) on Railway.
2. Add [PostgreSQL](/databases/postgresql): click **+ New > Database > PostgreSQL**.
3. The database will be accessible to all services in the project via [reference variables](/variables#referencing-another-services-variable).

## 2. Deploy the API service

1. Push your code to a GitHub repository.
2. In your project, click **+ New > GitHub Repo** and select your repository.
3. Set environment variables under the **Variables** tab:
   - [Reference](/variables#referencing-another-services-variable) `DATABASE_URL` from Postgres.
   - Add your LLM API key (e.g., `OPENAI_API_KEY` or `ANTHROPIC_API_KEY`).
4. Generate a [public domain](/networking/public-networking#railway-provided-domain) under **Settings > Networking > Public Networking**.
5. If your app uses database migrations, configure a [pre-deploy command](/deployments/pre-deploy-command).

## 3. Structure LLM API calls

Wrap your LLM calls in a function that handles retries and errors. LLM APIs return rate limit errors (HTTP 429) under load:

```python
import time
from openai import OpenAI

client = OpenAI()

def call_llm(prompt: str, max_retries: int = 3) -> str:
    for attempt in range(max_retries):
        try:
            response = client.chat.completions.create(
                model="gpt-4o",
                messages=[{"role": "user", "content": prompt}],
            )
            return response.choices[0].message.content
        except Exception as e:
            if "429" in str(e) and attempt < max_retries - 1:
                time.sleep(2 ** attempt)
                continue
            raise
```

## 4. Cache LLM responses

LLM API calls are slow (1-10 seconds) and expensive. Cache responses for identical or similar inputs to reduce latency and cost:

```python
import hashlib
import psycopg2
import json

def get_or_create_response(prompt: str, db_url: str) -> str:
    prompt_hash = hashlib.sha256(prompt.encode()).hexdigest()

    conn = psycopg2.connect(db_url)
    cur = conn.cursor()

    cur.execute(
        "SELECT response FROM llm_cache WHERE prompt_hash = %s",
        (prompt_hash,),
    )
    row = cur.fetchone()
    if row:
        cur.close()
        conn.close()
        return row[0]

    response = call_llm(prompt)
    cur.execute(
        "INSERT INTO llm_cache (prompt_hash, prompt, response) VALUES (%s, %s, %s)",
        (prompt_hash, prompt, response),
    )
    conn.commit()
    cur.close()
    conn.close()
    return response
```

Create the cache table:

```sql
CREATE TABLE llm_cache (
  id SERIAL PRIMARY KEY,
  prompt_hash TEXT UNIQUE NOT NULL,
  prompt TEXT NOT NULL,
  response TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

## 5. Handle longer tasks asynchronously

If some requests take more than a few seconds (batch processing, multi-step generation), return a job ID immediately and process in the background. See [Deploy an AI Agent with Async Workers](/guides/ai-agent-workers) for the full pattern.

A simpler approach for moderate workloads: use FastAPI's `BackgroundTasks`:

```python
from fastapi import BackgroundTasks, FastAPI

app = FastAPI()

@app.post("/generate")
async def generate(input: str, background_tasks: BackgroundTasks):
    job_id = create_job(input)  # Save to Postgres with status "pending"
    background_tasks.add_task(process_job, job_id)
    return {"job_id": job_id}

@app.get("/jobs/{job_id}")
async def get_job(job_id: str):
    return get_job_status(job_id)  # Read from Postgres
```

This works for single-replica services. For multiple replicas or heavy workloads, use Redis-backed workers instead.

## 6. Manage costs

LLM API costs scale with usage. Track spending by logging token counts per request:

```python
response = client.chat.completions.create(
    model="gpt-4o",
    messages=messages,
)

tokens_used = response.usage.total_tokens
# Log to Postgres or your analytics system
```

Set a per-user or per-request token budget to prevent runaway costs. Consider using smaller models (GPT-4o mini, Claude Haiku) for tasks that do not require the most capable model.

## Next steps

- [Deploy an AI Agent with Async Workers](/guides/ai-agent-workers): Full async processing pattern with Redis queues.
- [Deploy an AI Chatbot with Streaming Responses](/guides/ai-chatbot-streaming): Add a streaming chat interface.
- [Deploy a RAG Pipeline with pgvector](/guides/rag-pipeline-pgvector): Add knowledge retrieval to your app.
- [Scaling](/deployments/scaling): Configure horizontal and vertical scaling for your services.
- [PostgreSQL on Railway](/databases/postgresql): Connection pooling, backups, and configuration.
