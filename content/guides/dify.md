---
title: Self-Host Dify
description: Deploy Dify on Railway with Postgres, Redis, and persistent storage. Build AI applications, RAG pipelines, and agent workflows through Dify's visual interface.
date: "2026-04-14"
tags:
  - ai
  - dify
  - docker
  - self-hosted
topic: ai
---

[Dify](https://dify.ai) is an open-source platform for building LLM-powered applications. It provides a visual workflow editor, built-in RAG pipeline, agent framework, and API management through a web interface.

Dify is a multi-service application that requires an API server, a worker, a web frontend, Postgres, and Redis. Railway is well-suited for this type of deployment since each component runs as a separate service with shared private networking.

Dify calls external LLM APIs (OpenAI, Anthropic, etc.) for model inference. Railway is CPU-based and does not offer GPU instances.

## What you will set up

- Dify API server, worker, and web frontend as separate Railway services
- PostgreSQL and Redis databases
- Persistent storage for uploaded files
- A public domain for the Dify web interface

## One-click deploy from a template

Railway has a Dify template that provisions all services and databases in one step.

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/deploy/V1xiql)

After deploying, skip to [Configure LLM providers](#configure-llm-providers) to connect your API keys.

If you prefer to set things up manually, continue below.

## Manual deployment

### 1. Create the project and databases

1. Create a new [project](/projects) on Railway.
2. Add [PostgreSQL](/databases/postgresql): click **+ New > Database > PostgreSQL**.
3. Add [Redis](/databases/redis): click **+ New > Database > Redis**.

### 2. Deploy the API server

1. Click **+ New > Docker Image**.
2. Enter `langgenius/dify-api` as the image name.
3. Add the following environment variables, using [reference variables](/variables#referencing-another-services-variable) for database connections:

| Variable | Value |
| --- | --- |
| `MODE` | `api` |
| `DB_HOST` | `${{Postgres.PGHOST}}` |
| `DB_PORT` | `${{Postgres.PGPORT}}` |
| `DB_USERNAME` | `${{Postgres.PGUSER}}` |
| `DB_PASSWORD` | `${{Postgres.PGPASSWORD}}` |
| `DB_DATABASE` | `${{Postgres.PGDATABASE}}` |
| `REDIS_HOST` | `${{Redis.REDISHOST}}` |
| `REDIS_PORT` | `${{Redis.REDISPORT}}` |
| `REDIS_PASSWORD` | `${{Redis.REDISPASSWORD}}` |
| `SECRET_KEY` | A random string (use `openssl rand -hex 32`) |
| `STORAGE_TYPE` | `local` |
| `STORAGE_LOCAL_PATH` | `/app/api/storage` |

4. Attach a [Volume](/volumes) mounted at `/app/api/storage` for file uploads.
5. Generate a [public domain](/networking/public-networking#railway-provided-domain) for the API server.

### 3. Deploy the worker

1. Click **+ New > Docker Image**.
2. Enter `langgenius/dify-api` as the image name (same image, different mode).
3. Copy the same environment variables from the API server, but change:

| Variable | Value |
| --- | --- |
| `MODE` | `worker` |

4. No public domain is needed. The worker communicates with Postgres and Redis over [private networking](/networking/private-networking).

### 4. Deploy the web frontend

1. Click **+ New > Docker Image**.
2. Enter `langgenius/dify-web` as the image name.
3. Add the following environment variable:

| Variable | Value |
| --- | --- |
| `CONSOLE_API_URL` | The public URL of your API server (e.g., `https://dify-api-production-xxxx.up.railway.app`) |
| `APP_API_URL` | Same as `CONSOLE_API_URL` |

4. Generate a [public domain](/networking/public-networking#railway-provided-domain) for the web frontend.

## Configure LLM providers

1. Open the web frontend domain in your browser.
2. Create an admin account on first access.
3. Go to **Settings > Model Providers**.
4. Add your LLM API keys (OpenAI, Anthropic, or others).

Dify stores provider credentials encrypted in Postgres.

## Next steps

- [Manage Volumes](/volumes): Resize or back up your persistent storage.
- [Set up a custom domain](/networking/domains): Use your own domain for the Dify interface.
- [Private Networking](/networking/private-networking): How services communicate within a project.
- [Monitor your app](/observability): View logs and metrics for your Dify services.
