---
title: Schedule, Retry, and Dead-Letter Jobs with BullMQ
description: Run BullMQ on Railway with a Redis service and an always-on worker. Covers repeatable job schedules, retries with exponential backoff, and a dead-letter queue pattern.
date: "2026-07-29"
tags:
  - queues
  - workers
  - redis
  - architecture
topic: architecture
---

BullMQ is a Redis-backed job queue for Node.js. A producer adds jobs to a queue in Redis, and one or more workers pull jobs off the queue and process them. On top of that, this guide sets up the three features most production queues need: scheduled (repeatable) jobs, automatic retries with backoff, and a dead-letter queue for jobs that exhaust their retries.

On Railway, the setup is two services in one project: a Redis database and an always-on worker service. A third service (your API) usually acts as the producer.

## Set up Redis and the worker service

1. Create a project and add Redis: click **+ New → Database → Redis**. See [Redis on Railway](/databases/redis).
2. Create a [service](/services) for your worker, deployed from [GitHub](/deployments/github-autodeploys) or the [Railway CLI](/cli).
3. In the worker's variables, add a [reference variable](/variables#referencing-another-services-variable) so it can reach Redis over [private networking](/networking/private-networking):

```
REDIS_URL=${{Redis.REDIS_URL}}
```

Private networking is per environment, and services resolve each other at `<service>.railway.internal`. Traffic between the worker and Redis over the private network does not count as egress.

Do not enable [serverless](/deployments/serverless) on the worker. A queue worker needs to run continuously to pick up jobs, and a BullMQ worker's persistent Redis connection keeps the service awake anyway, so serverless would save nothing.

Install the dependencies:

```bash
npm install bullmq ioredis
```

BullMQ uses `ioredis` for its Redis connections. On Railway's private network, those connections need `family: 0` set in the options so the client can resolve both IPv6 and IPv4 endpoints. See [private networking library configuration](/networking/private-networking/library-configuration).

## Create a shared connection module

Both the producer and the worker need the same connection settings. Put them in one module.

```typescript
// connection.ts
import { RedisOptions } from "ioredis";

const redisURL = new URL(process.env.REDIS_URL!);

export const connection: RedisOptions = {
  family: 0,
  host: redisURL.hostname,
  port: Number(redisURL.port),
  username: redisURL.username || undefined,
  password: redisURL.password || undefined,
  maxRetriesPerRequest: null,
};

export const QUEUE_NAME = "emails";
export const DLQ_NAME = "emails-dlq";
```

`maxRetriesPerRequest: null` is required by BullMQ workers; it tells ioredis to keep commands queued during a reconnect instead of failing them.

## Add jobs with retry options

The producer is any process that enqueues work, typically your API service, and it can configure retries per job or as queue defaults.

```typescript
// producer.ts
import { Queue } from "bullmq";
import { connection, QUEUE_NAME } from "./connection";

export const emailQueue = new Queue(QUEUE_NAME, {
  connection,
  defaultJobOptions: {
    attempts: 5,
    backoff: {
      type: "exponential",
      delay: 3000,
    },
    removeOnComplete: { age: 3600, count: 1000 },
    removeOnFail: false,
  },
});

export async function enqueueWelcomeEmail(to: string) {
  await emailQueue.add("welcome-email", { to });
}
```

What these options do:

- `attempts: 5` runs the job up to 5 times total before marking it failed.
- `backoff` with `type: "exponential"` and `delay: 3000` waits 3s, 6s, 12s, 24s between retries.
- `removeOnComplete` prunes completed jobs so Redis memory stays bounded.
- `removeOnFail: false` keeps failed jobs in Redis so the dead-letter handler can inspect them.

## Schedule repeatable jobs

BullMQ job schedulers create repeatable jobs from a cron expression or an interval. `upsertJobScheduler` is idempotent, so it is safe to call on every deploy.

```typescript
// schedules.ts
import { emailQueue } from "./producer";

export async function registerSchedules() {
  // Every day at 08:00 UTC
  await emailQueue.upsertJobScheduler(
    "daily-digest",
    { pattern: "0 8 * * *" },
    { name: "daily-digest", data: {} }
  );

  // Every 10 minutes
  await emailQueue.upsertJobScheduler(
    "reconcile",
    { every: 10 * 60 * 1000 },
    { name: "reconcile", data: {} }
  );
}
```

Because the worker is always on, BullMQ schedules can run every few seconds. Railway's native [cron jobs](/cron-jobs) are a lighter alternative for tasks that run infrequently: the service starts on a schedule, executes, and exits, so you pay nothing between runs. Railway cron has a 5 minute minimum frequency, evaluates schedules in UTC, and skips a run if the previous one is still active. Use Railway cron for a nightly cleanup script; use BullMQ schedulers when scheduled work should flow through the same queue, retry logic, and dead-letter handling as everything else.

## Process jobs and dead-letter failures

BullMQ has no built-in dead-letter queue. The standard pattern is to listen for the `failed` event and, when a job has exhausted its attempts, copy it into a second queue that no worker consumes. That queue becomes your dead-letter queue: a durable, inspectable record of permanently failed work.

```typescript
// worker.ts
import { Queue, Worker, Job } from "bullmq";
import { connection, QUEUE_NAME, DLQ_NAME } from "./connection";
import { registerSchedules } from "./schedules";

const deadLetterQueue = new Queue(DLQ_NAME, { connection });

const worker = new Worker(
  QUEUE_NAME,
  async (job: Job) => {
    switch (job.name) {
      case "welcome-email":
        await sendEmail(job.data.to);
        break;
      case "daily-digest":
        await sendDigest();
        break;
      case "reconcile":
        await reconcile();
        break;
      default:
        throw new Error(`Unknown job: ${job.name}`);
    }
  },
  { connection, concurrency: 10 }
);

worker.on("failed", async (job, err) => {
  if (!job) return;
  const maxAttempts = job.opts.attempts ?? 1;
  if (job.attemptsMade >= maxAttempts) {
    await deadLetterQueue.add(job.name, job.data, {
      jobId: `dlq-${job.id}`,
      removeOnComplete: false,
    });
    console.error(`Dead-lettered ${job.name} (${job.id}): ${err.message}`);
  }
});

worker.on("completed", (job) => {
  console.log(`Completed ${job.name} (${job.id})`);
});

async function main() {
  await registerSchedules();
  console.log("Worker started");
}

async function shutdown() {
  await worker.close();
  await deadLetterQueue.close();
  process.exit(0);
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

// Replace with your real implementations
async function sendEmail(to: string) {}
async function sendDigest() {}
async function reconcile() {}
```

Two details matter here:

- The `failed` event fires on every failed attempt, not just the last one. Checking `job.attemptsMade >= maxAttempts` ensures only terminal failures reach the dead-letter queue.
- The `SIGTERM` handler calls `worker.close()`, which waits for in-flight jobs to finish before exiting. Railway sends `SIGTERM` on redeploys, but by default the old deployment gets 0 seconds to shut down before `SIGKILL`. Set a [draining time](/deployments/deployment-teardown) (via the service settings or the `RAILWAY_DEPLOYMENT_DRAINING_SECONDS` variable) long enough for your slowest job so in-flight work can finish. Jobs that do get interrupted are marked stalled by BullMQ and retried automatically.

## Replay dead-lettered jobs

Because the dead-letter queue is a normal BullMQ queue, replaying is just moving jobs back.

```typescript
// replay.ts
import { Queue } from "bullmq";
import { connection, QUEUE_NAME, DLQ_NAME } from "./connection";

async function replay() {
  const dlq = new Queue(DLQ_NAME, { connection });
  const mainQueue = new Queue(QUEUE_NAME, { connection });

  const jobs = await dlq.getJobs(["waiting", "delayed", "failed"]);
  for (const job of jobs) {
    await mainQueue.add(job.name, job.data);
    await job.remove();
  }

  console.log(`Replayed ${jobs.length} jobs`);
  await dlq.close();
  await mainQueue.close();
  process.exit(0);
}

replay();
```

Run this as a one-off task after fixing the underlying bug. You can also wire it to a Railway [cron job](/cron-jobs) if you want periodic automatic replays; a replay script exits when done, which is what Railway cron expects.

## Operational notes

- **Redis memory is the queue's only storage.** Set `removeOnComplete` and prune the dead-letter queue, or Redis will grow until it hits its memory limit and starts evicting or rejecting writes.
- **Scale workers horizontally.** BullMQ guarantees each job is processed by one worker at a time, so you can run multiple [replicas](/deployments/scaling) of the worker service against the same queue.
- **Monitor the failed and dead-letter counts.** `queue.getJobCounts("failed", "waiting", "delayed")` gives you the numbers to export or alert on.
- **Do not run the worker as a Railway cron job.** A BullMQ worker holds an open Redis connection and never exits, which violates the cron requirement that the process terminates; subsequent cron runs would be skipped.

## Next steps

- [Choose between cron jobs, workers, and queues](/guides/cron-workers-queues) for when a queue is the right pattern at all.
- [Redis on Railway](/databases/redis) for backups and connecting externally.
- [Private networking](/networking/private-networking) for how services reach Redis without egress fees.
- [Cron jobs](/cron-jobs) for scheduled tasks that should not run through a queue.
