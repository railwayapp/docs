---
title: Deploy a Full-Stack Next.js App with Postgres, Background Jobs, and File Uploads
description: Deploy a production Next.js application on Railway with a Postgres database, Redis-backed background workers, and file uploads via storage buckets. Covers multi-service architecture and production hardening.
date: "2026-04-14"
tags:
  - frontend
  - nextjs
  - fullstack
  - workers
topic: architecture
---

A production Next.js application often needs more than a single service. This guide walks through deploying a full-stack Next.js app on Railway with a Postgres database, a Redis-backed background worker, and file uploads via storage buckets, all in a single project.

**Best for:** SaaS applications, dashboards, and internal tools that need a database, async job processing, and file handling alongside a Next.js frontend.

## Architecture overview

This setup uses five components in one Railway project:

- **Next.js service** handles SSR, API routes, and serves the frontend.
- **Postgres** stores application data.
- **Redis** serves as the job queue backend.
- **Worker service** processes background jobs from Redis.
- **Storage bucket** stores user-uploaded files.

All services communicate over [private networking](/networking/private-networking). The Next.js service and worker share the same codebase but run different entry points.

## Prerequisites

- A Railway account
- A Next.js application (App Router or Pages Router)
- [Railway CLI](/cli) installed (optional)

## 1. Create the project and databases

1. Create a new [project](/projects) on Railway.
2. Add a [PostgreSQL](/databases/postgresql) database: click **+ New**, then **Database**, then **PostgreSQL**.
3. Add a [Redis](/databases/redis) database: click **+ New**, then **Database**, then **Redis**.

Both databases are accessible to any service in the project via [reference variables](/variables#referencing-another-services-variable).

## 2. Deploy the Next.js app

Deploy your Next.js app as the primary service. If you have not deployed Next.js on Railway before, see the [Next.js deployment guide](/guides/nextjs) for the full walkthrough.

Key configuration for production:

1. Set `output: "standalone"` in `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
};

export default nextConfig;
```

This creates a minimal production build that does not require `node_modules` at runtime.

2. Set the following [variables](/variables) on the Next.js service:

```
DATABASE_URL=${{Postgres.DATABASE_URL}}
REDIS_URL=${{Redis.REDIS_URL}}
```

3. Add a [pre-deploy command](/deployments/pre-deploy-command) for database migrations:

```bash
npx prisma migrate deploy
```

This runs migrations before the new version starts serving traffic, preventing downtime from schema changes.

## 3. Add Prisma and the database schema

Install Prisma and initialize it:

```bash
npm install prisma @prisma/client
npx prisma init
```

Define your schema in `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  jobs      Job[]
}

model Job {
  id        String   @id @default(cuid())
  type      String
  payload   Json
  status    String   @default("pending")
  result    Json?
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

Generate the client and create the initial migration locally:

```bash
npx prisma migrate dev --name init
```

Commit the migration files. Railway runs `npx prisma migrate deploy` on each deploy via the pre-deploy command.

## 4. Add file uploads via storage buckets

1. Create a [storage bucket](/storage-buckets) in your Railway project: click **+ New**, then **Bucket**.
2. Add bucket credentials to your Next.js service using [credential presets](/storage-buckets#credential-presets) or reference variables.

Create an API route that generates presigned upload URLs:

```typescript
// app/api/upload/route.ts
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3 = new S3Client({
  region: 'auto',
  endpoint: process.env.BUCKET_ENDPOINT,
  credentials: {
    accessKeyId: process.env.BUCKET_ACCESS_KEY_ID!,
    secretAccessKey: process.env.BUCKET_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: Request) {
  const { filename, contentType } = await request.json();

  const command = new PutObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: `uploads/${Date.now()}-${filename}`,
    ContentType: contentType,
  });

  const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

  return Response.json({ url });
}
```

The frontend requests a presigned URL, then uploads the file directly to the bucket. This avoids routing large files through the Next.js server. For the full pattern, see [Use Storage Buckets for Uploads](/guides/storage-buckets-guide).

## 5. Add a background worker

Background jobs handle work that should not block the HTTP response: sending emails, processing uploads, generating reports, calling external APIs.

### Set up BullMQ

Install BullMQ:

```bash
npm install bullmq
```

Create a shared queue definition:

```typescript
// lib/queue.ts
import { Queue } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
});

export const jobQueue = new Queue('jobs', { connection });
```

### Enqueue jobs from Next.js API routes

```typescript
// app/api/jobs/route.ts
import { jobQueue } from '@/lib/queue';

export async function POST(request: Request) {
  const { type, payload } = await request.json();

  const job = await jobQueue.add(type, payload);

  return Response.json({ jobId: job.id, status: 'queued' });
}
```

### Create the worker entry point

Create a separate entry point for the worker:

```typescript
// worker.ts
import { Worker } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
});

const worker = new Worker('jobs', async (job) => {
  console.log(`Processing job ${job.id}: ${job.name}`);

  switch (job.name) {
    case 'send-email':
      // Send email logic
      break;
    case 'process-upload':
      // Process uploaded file
      break;
    default:
      throw new Error(`Unknown job type: ${job.name}`);
  }
}, { connection });

worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed:`, err);
});
```

### Deploy the worker as a separate service

1. In your Railway project, click **+ New**, then **GitHub Repo**, and select the same repository.
2. Rename the service to "Worker."
3. Set the [start command](/deployments/start-command) to `npx tsx worker.ts`.
4. Add the same database variables:

```
DATABASE_URL=${{Postgres.DATABASE_URL}}
REDIS_URL=${{Redis.REDIS_URL}}
```

The worker does not need a public domain. It connects to Redis over [private networking](/networking/private-networking) and processes jobs continuously.

For more on background processing patterns, see [Choose between cron jobs, workers, and queues](/guides/cron-workers-queues).

## 6. Wire services together

Your Railway project now has five components. Here is how they connect:

- **Next.js** reads `DATABASE_URL` and `REDIS_URL` from reference variables. It serves the frontend, handles API routes, and enqueues jobs.
- **Worker** reads the same `DATABASE_URL` and `REDIS_URL`. It dequeues and processes jobs.
- **Postgres** and **Redis** are shared by both services via reference variables.
- **Bucket** credentials are set on the Next.js service (and the worker, if it needs to read/write files).

All inter-service communication uses [private networking](/networking/private-networking). No public domains are needed for Postgres, Redis, or the worker.

## 7. Production hardening

### Health checks

Add a [health check](/deployments/healthchecks) to the Next.js service. Next.js serves a default health endpoint, or create a custom one:

```typescript
// app/api/health/route.ts
export async function GET() {
  return Response.json({ status: 'ok' });
}
```

### Restart policy

Set the [restart policy](/deployments/restart-policy) to automatically restart services that crash.

### Environment separation

Use Railway [environments](/environments) to run staging and production instances. Each environment gets its own databases and variables.

### Pre-deploy migrations

The pre-deploy command (`npx prisma migrate deploy`) runs before the new container starts serving traffic. If the migration fails, the deploy is rolled back and the old version keeps running.

## Next steps

- [Next.js deployment guide](/guides/nextjs) - Detailed deployment options for Next.js.
- [Use Storage Buckets for Uploads](/guides/storage-buckets-guide) - Full file upload patterns.
- [Choose between cron jobs, workers, and queues](/guides/cron-workers-queues) - Background processing architecture.
- [Deploy a SaaS Backend](/guides/saas-backend) - Similar architecture without Next.js.
- [Manage environment variables](/guides/frontend-environment-variables) - Handle build-time vs runtime variables.
- [Choose between SSR, SSG, and ISR](/guides/ssr-ssg-isr) - Pick the right rendering strategy.
