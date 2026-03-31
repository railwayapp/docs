---
title: Deploy a SaaS Backend with Postgres, Workers, and Webhooks
description: Set up a production SaaS backend on Railway with an API service, Postgres database, background worker, and cron job for webhook processing.
date: "2026-03-30"
tags:
  - architecture
  - saas
  - postgres
  - workers
topic: architecture
---

A typical SaaS backend needs an API, a database, background processing, and scheduled tasks. This guide walks through deploying that architecture on Railway as a single project.

## Architecture overview

This setup uses four components:

- **API service** handles HTTP requests and serves your application.
- **Postgres** stores application data.
- **Worker service** processes background jobs from a Redis queue.
- **Cron service** runs scheduled tasks such as webhook retries and data cleanup.

All four run in one Railway project and communicate over [private networking](/networking/private-networking). The API and worker share a Redis instance for job dispatch. No direct connection between the API and worker is required.

## Prerequisites

- A Railway account
- Application code with separate entry points for the API and worker
- [Railway CLI](/cli) installed (optional)

## 1. Create the project and database

1. Create a new [project](/projects) on Railway.
2. Add a [PostgreSQL](/databases/postgresql) database: click **+ New**, then **Database**, then **PostgreSQL**.
3. Add a [Redis](/databases/redis) database for the job queue: click **+ New**, then **Database**, then **Redis**.

Both databases are available to any service in the project via [reference variables](/variables#referencing-another-services-variable).

## 2. Deploy the API service

1. Deploy from [GitHub](/deployments/github-autodeploys) or the [CLI](/cli).
2. Add reference variables for `DATABASE_URL` (from Postgres) and `REDIS_URL` (from Redis). See [reference variables](/variables#referencing-another-services-variable).
3. Generate a public domain under **Settings > Networking > [Public Networking](/networking/public-networking#railway-provided-domain)**.
4. Configure a [pre-deploy command](/deployments/pre-deploy-command) to run database migrations before each deployment.

## 3. Deploy the worker service

1. Add another service to the project: click **+ New**, then select your GitHub repo or a Docker image.
2. Point it at the same repo but set a different [start command](/deployments/start-command) (e.g., `node worker.js` or `python worker.py`).
3. Add the same `DATABASE_URL` and `REDIS_URL` reference variables.
4. Do not assign a public domain. The worker communicates via Redis and private networking only.

### Configuring the start command

If your API and worker share the same repository, differentiate them with the start command:

- **API service**: `node server.js` (or your framework's start command)
- **Worker service**: `node worker.js`

Set the start command in **Settings > Deploy > Start Command** for each service.

## 4. Add a cron job for scheduled tasks

1. Add another service to the project.
2. Set the start command to your scheduled task script (e.g., `node cron/retry-webhooks.js`).
3. Go to **Settings > [Cron Schedule](/cron-jobs)** and set a crontab expression (e.g., `*/5 * * * *` for every 5 minutes). The minimum cron frequency is every 5 minutes, and all schedules are evaluated in UTC.
4. Add the same `DATABASE_URL` and `REDIS_URL` reference variables.

The cron service starts on schedule, executes the task, and exits. See [Cron Jobs](/cron-jobs) for details on scheduling and failure behavior.

## 5. Configure webhook processing

A common SaaS pattern is receiving webhooks from third-party services (Stripe, GitHub, etc.), enqueuing them for background processing, and retrying failures on a schedule.

The flow:

1. Your API receives an incoming webhook POST request.
2. It validates the webhook signature.
3. It enqueues the payload in Redis.
4. It returns a `200` response immediately.
5. The worker picks up the job and processes it.
6. The cron service retries failed webhooks on a schedule.

This pattern keeps webhook processing out of the request path so your API stays responsive. Failed webhooks are retried automatically without manual intervention.

## How the services connect

| Service | Connects to | Via |
|---------|------------|-----|
| API | Postgres | `DATABASE_URL` reference variable |
| API | Redis | `REDIS_URL` reference variable |
| Worker | Postgres | `DATABASE_URL` reference variable |
| Worker | Redis | `REDIS_URL` reference variable |
| Cron | Postgres | `DATABASE_URL` reference variable |
| Cron | Redis | `REDIS_URL` reference variable |
| API | Worker | Redis queue (no direct connection needed) |

All inter-service database connections use Railway's [private networking](/networking/private-networking) automatically when services are in the same project.

## Next steps

- [Cron Jobs](/cron-jobs) - Scheduling, failure modes, and crontab expressions
- [PostgreSQL on Railway](/databases/postgresql) - Provisioning and connection details
- [Redis on Railway](/databases/redis) - Provisioning and connection details
- [Private Networking](/networking/private-networking) - How services communicate internally
- [Pre-deploy Command](/deployments/pre-deploy-command) - Running migrations before deployment
