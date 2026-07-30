---
title: Self-Host Langfuse for LLM Observability
description: Deploy Langfuse v3 on Railway with Postgres, ClickHouse, Redis, and object storage. Trace, debug, and evaluate your LLM applications on infrastructure you control.
date: "2026-07-29"
tags:
  - langfuse
  - observability
  - ai
  - self-hosted
topic: integrations
---

[Langfuse](https://langfuse.com) is an open-source LLM engineering platform: it captures traces of your LLM calls (prompts, completions, latency, token usage, cost) and layers evaluation, prompt management, and analytics on top. This guide deploys Langfuse v3 on Railway and sends it a first trace. Self-hosting it keeps all trace data, including prompts that may contain user data, inside infrastructure you control.

Langfuse v3 is a multi-service application: a web server, a background worker, Postgres for transactional data, ClickHouse for trace analytics, Redis for queues and caching, and S3-compatible object storage for raw event uploads. Railway runs each component as a separate service with shared private networking, so the whole stack fits in one project.

Langfuse only observes LLM calls; it does not run models, so it is a standard CPU workload. Railway has no GPU instances, and this stack does not need one.

## What we will set up

- Langfuse web and worker as separate Railway services
- PostgreSQL, ClickHouse, and Redis databases
- A Railway storage bucket for event uploads
- A public domain for the Langfuse UI

## One-click deploy from a template

Railway has a Langfuse v3 template that provisions all six services (web, worker, Postgres, ClickHouse, Redis, and MinIO for object storage) in one step.

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/deploy/langfuse)

After deploying, open the web service's domain, create your admin account, and skip to [Send traces from your application](#send-traces-from-your-application).

If you prefer to set things up manually, or want to use Railway's native storage buckets instead of MinIO, continue below.

## Manual deployment

### 1. Create the project and databases

1. Create a new [project](/projects) on Railway.
2. Add [PostgreSQL](/databases/postgresql): click **+ New > Database > PostgreSQL**.
3. Add [Redis](/databases/redis): click **+ New > Database > Redis**.

### 2. Deploy ClickHouse

Langfuse stores traces and observations in ClickHouse.

1. Click **+ New > Docker Image** and enter `clickhouse/clickhouse-server:24`.
2. Set these variables on the service:

| Variable | Value |
| --- | --- |
| `CLICKHOUSE_DB` | `default` |
| `CLICKHOUSE_USER` | `clickhouse` |
| `CLICKHOUSE_PASSWORD` | A random string (use `openssl rand -hex 32`) |

3. Attach a [volume](/volumes) mounted at `/var/lib/clickhouse`. Without a volume, all trace data is lost on every redeploy.

ClickHouse needs no public domain. Langfuse reaches it over [private networking](/networking/private-networking) on port 8123 (HTTP) and 9000 (native TCP, used for migrations).

### 3. Create a storage bucket

Langfuse writes every incoming trace event to object storage before the worker ingests it into ClickHouse. Railway [storage buckets](/storage-buckets) are private and S3-compatible, which is what Langfuse expects.

1. Click **+ New > Bucket** and pick a region.
2. Note the bucket's **Credentials** tab. It exposes `BUCKET`, `ACCESS_KEY_ID`, `SECRET_ACCESS_KEY`, `REGION`, and `ENDPOINT` as referenceable variables, and tells you whether the bucket uses virtual-hosted or path-style URLs.

The region is locked after creation, so create the bucket in the same region as your services.

### 4. Generate secrets

Langfuse requires three secrets. Generate them locally:

```bash
openssl rand -hex 32   # NEXTAUTH_SECRET
openssl rand -hex 32   # SALT
openssl rand -hex 32   # ENCRYPTION_KEY (must be exactly 64 hex characters)
```

### 5. Deploy the Langfuse web service

1. Click **+ New > Docker Image** and enter `langfuse/langfuse:3`.
2. Add the following variables, using [reference variables](/variables#referencing-another-services-variable) for the databases and bucket. The examples assume services named `Postgres`, `Redis`, `ClickHouse`, and `Bucket`; adjust to your service names.

| Variable | Value |
| --- | --- |
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` |
| `CLICKHOUSE_URL` | `http://clickhouse.railway.internal:8123` |
| `CLICKHOUSE_MIGRATION_URL` | `clickhouse://clickhouse.railway.internal:9000` |
| `CLICKHOUSE_USER` | `${{ClickHouse.CLICKHOUSE_USER}}` |
| `CLICKHOUSE_PASSWORD` | `${{ClickHouse.CLICKHOUSE_PASSWORD}}` |
| `CLICKHOUSE_CLUSTER_ENABLED` | `false` |
| `REDIS_CONNECTION_STRING` | `${{Redis.REDIS_URL}}` |
| `LANGFUSE_S3_EVENT_UPLOAD_BUCKET` | `${{Bucket.BUCKET}}` |
| `LANGFUSE_S3_EVENT_UPLOAD_REGION` | `${{Bucket.REGION}}` |
| `LANGFUSE_S3_EVENT_UPLOAD_ENDPOINT` | `${{Bucket.ENDPOINT}}` |
| `LANGFUSE_S3_EVENT_UPLOAD_ACCESS_KEY_ID` | `${{Bucket.ACCESS_KEY_ID}}` |
| `LANGFUSE_S3_EVENT_UPLOAD_SECRET_ACCESS_KEY` | `${{Bucket.SECRET_ACCESS_KEY}}` |
| `LANGFUSE_S3_EVENT_UPLOAD_FORCE_PATH_STYLE` | `false` (or `true` if your bucket's Credentials tab says path-style) |
| `NEXTAUTH_URL` | The public URL of this service, e.g. `https://langfuse-production-xxxx.up.railway.app` |
| `NEXTAUTH_SECRET` | The first secret from step 4 |
| `SALT` | The second secret from step 4 |
| `ENCRYPTION_KEY` | The third secret from step 4 |

The private hostnames (`clickhouse.railway.internal`) come from the service names in your project. Private networking is scoped per environment, so the web service, worker, and databases must live in the same environment.

3. Langfuse listens on port 3000. Generate a public domain for the service in **Settings > Networking** and set `NEXTAUTH_URL` to this domain once it exists.

The web service runs Postgres and ClickHouse migrations on startup, so the first deploy takes a few minutes.

### 6. Deploy the Langfuse worker

The worker ingests events from the bucket into ClickHouse and runs evaluations.

1. Click **+ New > Docker Image** and enter `langfuse/langfuse-worker:3`.
2. Copy the same variables from the web service. `NEXTAUTH_URL` is not needed on the worker, but `SALT` and `ENCRYPTION_KEY` must match the web service exactly.
3. Do not generate a public domain. The worker listens on port 3030 for internal health checks only and talks to everything else over private networking.

### 7. Create your account

Open the web service's public domain, sign up (the first user becomes the instance admin), create an organization and a project, and copy the project's public and secret API keys from **Settings > API Keys**.

## Send traces from your application

Install the Langfuse SDK in the application you want to observe:

```bash
npm install langfuse
```

Point it at your self-hosted instance and record a trace:

```typescript
import { Langfuse } from "langfuse";

const langfuse = new Langfuse({
  baseUrl: process.env.LANGFUSE_HOST, // https://your-langfuse.up.railway.app
  publicKey: process.env.LANGFUSE_PUBLIC_KEY,
  secretKey: process.env.LANGFUSE_SECRET_KEY,
});

async function main(): Promise<void> {
  const trace = langfuse.trace({
    name: "support-answer",
    userId: "user_123",
    input: { question: "How do I reset my password?" },
  });

  const generation = trace.generation({
    name: "draft-answer",
    model: "claude-sonnet-4-5",
    input: [{ role: "user", content: "How do I reset my password?" }],
  });

  // ... call your LLM provider here ...
  const answer = "Go to Settings > Security and click Reset Password.";

  generation.end({
    output: answer,
    usage: { input: 12, output: 14 },
  });

  trace.update({ output: { answer } });

  await langfuse.flushAsync();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

If the application also runs on Railway in the same project and environment, set `LANGFUSE_HOST` to the web service's private address (`http://langfuse.railway.internal:3000`, adjusting for your service name). Trace ingestion then never leaves the private network and incurs no egress charges.

Langfuse also ships framework integrations (OpenAI SDK wrapper, LangChain callbacks, OpenTelemetry) that use the same three environment variables.

## Operational notes

- **Memory**: ClickHouse and the Langfuse web container use the most memory. Railway bills RAM by usage at $10 per GB per month; watch the metrics tab and set limits with headroom rather than guessing. The bucket is cheaper by comparison, holding raw events at $0.015 per GB per month with free egress.
- **Backups**: enable scheduled [backups](/volumes/backups) on the ClickHouse volume, and rely on the Postgres database's backups for transactional data.
- **Upgrades**: the `langfuse/langfuse:3` and `langfuse/langfuse-worker:3` tags track the v3 line. Redeploy both services together; the web service applies migrations on startup.
- **Single node**: run one ClickHouse replica with `CLICKHOUSE_CLUSTER_ENABLED=false`. A single node handles large trace volumes before clustering is worth the complexity.

## Next steps

- [Route LLM traffic through a gateway](/guides/llm-gateway) and trace it in one place
- [Run ClickHouse for product analytics](/guides/clickhouse-analytics) for volume sizing and query patterns that apply to trace data too
- [Private networking](/networking/private-networking) for how internal DNS and environment scoping work
- [Storage buckets](/storage-buckets) for presigned URLs, credentials, and S3 client configuration
