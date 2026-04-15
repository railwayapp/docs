---
title: Deploy an AI-Powered SaaS App on Railway
description: Deploy a production AI-powered SaaS application on Railway with an Express backend, Postgres database, and external LLM API integration. Covers API key management, request caching, rate limiting, and async processing for longer tasks.
date: "2026-04-14"
tags:
  - saas
  - nodejs
  - express
  - postgres
topic: ai
---

This guide covers deploying a SaaS application that integrates LLM APIs on Railway. The pattern applies to any product that takes user input, processes it through an LLM, and returns or stores the result: resume builders, content generators, code reviewers, data analyzers, and similar tools.

Railway is a CPU-based platform. Your application calls external LLM APIs (OpenAI, Anthropic, etc.) over HTTP. No models run locally.

## Architecture overview

A typical AI SaaS app on Railway uses three components:

- **API service** (Express, FastAPI, etc.) handles user requests, calls the LLM API, and returns results.
- **Postgres** stores user data, cached LLM responses, and job status for async tasks.
- **Redis** (optional) provides job queuing for tasks that take longer than a few seconds.

For tasks that complete in under 30 seconds, a synchronous request/response pattern works well. For longer tasks, use the [async workers pattern](/guides/ai-agent-workers).

## Prerequisites

- A Railway account
- An API key from [OpenAI](https://platform.openai.com/api-keys) or [Anthropic](https://console.anthropic.com/)
- Node.js 18+

### Set up the project

```bash
mkdir ai-saas && cd ai-saas
npm init -y
npm install express openai pg
```

## 1. Create the project and database

1. Create a new [project](/projects) on Railway.
2. Add [PostgreSQL](/databases/postgresql): click **+ New > Database > PostgreSQL**.
3. The database will be accessible to all services in the project via [reference variables](/variables#referencing-another-services-variable).

## 2. Deploy the API service

1. Push your code to a GitHub repository.
2. In your project, click **+ New > GitHub Repo** and select your repository.
3. Set the [start command](/deployments/start-command) to: `node app.js`
4. Set environment variables under the **Variables** tab:
   - [Reference](/variables#referencing-another-services-variable) `DATABASE_URL` from Postgres.
   - Add your LLM API key (e.g., `OPENAI_API_KEY` or `ANTHROPIC_API_KEY`).
5. Generate a [public domain](/networking/public-networking#railway-provided-domain) under **Settings > Networking > Public Networking**.

## 3. Structure LLM API calls

Wrap your LLM calls in a function that handles retries and errors. LLM APIs return rate limit errors (HTTP 429) under load:

```javascript
// llm.js
const OpenAI = require("openai");

const client = new OpenAI();

async function callLLM(prompt, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await client.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
      });
      return response.choices[0].message.content;
    } catch (err) {
      if (err.status === 429 && attempt < maxRetries - 1) {
        await new Promise((r) => setTimeout(r, 2 ** attempt * 1000));
        continue;
      }
      throw err;
    }
  }
}

module.exports = { callLLM };
```

## 4. Cache LLM responses

LLM API calls are slow (1-10 seconds) and expensive. Cache responses for identical inputs to reduce latency and cost:

```javascript
// cache.js
const crypto = require("crypto");
const { Pool } = require("pg");
const { callLLM } = require("./llm");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function getOrCreateResponse(prompt) {
  const promptHash = crypto.createHash("sha256").update(prompt).digest("hex");

  const cached = await pool.query(
    "SELECT response FROM llm_cache WHERE prompt_hash = $1",
    [promptHash]
  );
  if (cached.rows.length > 0) {
    return cached.rows[0].response;
  }

  const response = await callLLM(prompt);
  await pool.query(
    "INSERT INTO llm_cache (prompt_hash, prompt, response) VALUES ($1, $2, $3)",
    [promptHash, prompt, response]
  );
  return response;
}

module.exports = { getOrCreateResponse };
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

If some requests take more than a few seconds (batch processing, multi-step generation), return a job ID immediately and process in the background. See [Deploy an AI Agent with Async Workers](/guides/ai-agent-workers) for the full pattern with Redis.

For moderate workloads, process jobs in the background within the same service:

```javascript
// app.js
const express = require("express");
const crypto = require("crypto");
const { Pool } = require("pg");
const { callLLM } = require("./llm");
const { getOrCreateResponse } = require("./cache");

const app = express();
app.use(express.json());
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Synchronous endpoint with caching
app.post("/generate", async (req, res) => {
  const { prompt } = req.body;
  const response = await getOrCreateResponse(prompt);
  res.json({ response });
});

// Async endpoint for longer tasks
app.post("/jobs", async (req, res) => {
  const jobId = crypto.randomUUID();
  const { input } = req.body;

  await pool.query(
    "INSERT INTO jobs (id, input, status) VALUES ($1, $2, 'pending')",
    [jobId, input]
  );

  // Process in background (do not await)
  processJob(jobId).catch((err) =>
    console.error(`Job ${jobId} failed:`, err)
  );

  res.json({ job_id: jobId });
});

app.get("/jobs/:id", async (req, res) => {
  const result = await pool.query(
    "SELECT id, status, output FROM jobs WHERE id = $1",
    [req.params.id]
  );
  if (result.rows.length === 0) {
    return res.status(404).json({ error: "not found" });
  }
  res.json(result.rows[0]);
});

async function processJob(jobId) {
  const result = await pool.query("SELECT input FROM jobs WHERE id = $1", [
    jobId,
  ]);
  const input = result.rows[0].input;
  const output = await callLLM(input);
  await pool.query(
    "UPDATE jobs SET status = 'completed', output = $1 WHERE id = $2",
    [output, jobId]
  );
}

const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});
```

Create the jobs table:

```sql
CREATE TABLE jobs (
  id TEXT PRIMARY KEY,
  input TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  output TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

This works for single-replica services. For multiple replicas or heavy workloads, use Redis-backed workers instead.

## 6. Manage costs

LLM API costs scale with usage. Track spending by logging token counts per request:

```javascript
const response = await client.chat.completions.create({
  model: "gpt-4o",
  messages,
});

const tokensUsed = response.usage.total_tokens;
// Log to Postgres or your analytics system
```

Set a per-user or per-request token budget to prevent runaway costs. Consider using smaller models (GPT-4o mini, Claude Haiku) for tasks that do not require the most capable model.

## Next steps

- [Deploy an AI Agent with Async Workers](/guides/ai-agent-workers): Full async processing pattern with Redis queues.
- [Deploy an AI Chatbot with Streaming Responses](/guides/ai-chatbot-streaming): Add a streaming chat interface.
- [Deploy a RAG Pipeline with pgvector](/guides/rag-pipeline-pgvector): Add knowledge retrieval to your app.
- [Scaling](/deployments/scaling): Configure horizontal and vertical scaling for your services.
- [PostgreSQL on Railway](/databases/postgresql): Connection pooling, backups, and configuration.
