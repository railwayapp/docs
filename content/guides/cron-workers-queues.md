---
title: Choose Between Cron Jobs, Background Workers, and Queues
description: When to use cron jobs, always-on workers, and message queues for background processing. Covers tradeoffs, failure modes, and how to run each pattern on Railway.
date: "2026-03-30"
tags:
  - architecture
  - cron
  - workers
  - queues
topic: architecture
---

Most applications eventually need to run work outside the request-response cycle. The three most common patterns for this are cron jobs, background workers, and message queues. Each solves a different problem, and you can combine all three in a single Railway project.

## When to use each pattern

| Pattern | Best for | Tradeoff | Railway implementation |
|---|---|---|---|
| Cron job | Scheduled, time-based tasks | No guarantee of execution order; if a run overlaps, the next is skipped | Cron service (runs on schedule, then exits) |
| Background worker | Continuous event processing | Always consumes resources, even when idle | Always-on service in your project |
| Message queue | Decoupled task distribution with retries | Adds operational complexity (broker, dead-letter handling) | Redis or RabbitMQ service + worker service |

### Cron jobs

A cron job runs a task on a fixed schedule. The service starts, executes, and exits.

Use cron jobs for work that is time-based and self-contained: report generation, data cleanup, periodic syncs, cache warming.

On Railway, you configure a cron schedule on any service. The schedule uses standard five-field crontab expressions (e.g., `*/15 * * * *` for every 15 minutes). The minimum frequency is every 5 minutes. All cron schedules are evaluated in UTC.

Railway does not guarantee execution times to the minute, as they can vary by a few minutes.

**Failure mode:** if a previous execution has not finished when the next is scheduled, the next execution is skipped. Railway does not automatically terminate the previous run. Your task code must exit when done. If the process stays running, subsequent executions will not start.

For full configuration details, see [Cron Jobs](/cron-jobs).

### Background workers

A background worker is an always-on service that processes work continuously. Unlike a cron job, it does not exit after completing a task.

Use background workers for real-time event processing, long-running computations, streaming data pipelines, or any work that needs to respond to events as they arrive.

On Railway, deploy a worker as a separate service in the same project as your API. Use [private networking](/networking/private-networking) to communicate between services over the internal network (`<service>.railway.internal`). Share database credentials across services using [reference variables](/variables#referencing-another-services-variable).

**Failure mode:** if the worker crashes, it restarts automatically based on Railway's [restart policy](/deployments/restart-policy), but in-progress work may be lost unless your application handles graceful shutdown.

For more on creating and managing services, see [Services](/services).

### Message queues

A message queue decouples the producer of work (typically your API) from the consumer (a worker). The queue broker holds jobs until a worker is ready to process them.

Use message queues when you need retry logic, load leveling, fan-out to multiple consumers, or when your workers process jobs at a different rate than your API produces them.

Common queue libraries by language:

- **Node.js:** <a href="https://docs.bullmq.io/" target="_blank">BullMQ</a> (backed by Redis)
- **Python:** <a href="https://docs.celeryq.dev/" target="_blank">Celery</a> (backed by Redis or RabbitMQ)
- **Ruby:** <a href="https://github.com/sidekiq/sidekiq" target="_blank">Sidekiq</a> (backed by Redis)

On Railway, deploy Redis as your queue backend. Your API service enqueues jobs, and your worker service dequeues and processes them. Failed jobs can be retried based on your queue library's configuration.

**Failure mode:** if a worker crashes mid-job, the message stays in the queue (or goes to a dead-letter queue) depending on your acknowledgment pattern. The broker (Redis) itself needs monitoring; if Redis runs out of memory, jobs are lost unless persistence is enabled.

For setting up Redis, see [Redis on Railway](/databases/redis).

## How to set up each pattern on Railway

### Set up a cron job

1. Create a [service](/services) in your Railway project.
2. Add your task code. The code should run to completion and then exit.
3. Go to **Settings > Cron Schedule**.
4. Enter a crontab expression (e.g., `0 */6 * * *` for every 6 hours).
5. The service starts on schedule, executes your task, and shuts down.

The service must exit when done. If it stays running, the next scheduled execution is skipped.

### Set up a background worker

1. Create a separate [service](/services) in your Railway project.
2. Deploy your worker code as an always-on process.
3. Use [private networking](/networking/private-networking) to communicate with your API service.
4. Share database credentials via [reference variables](/variables#referencing-another-services-variable).

The worker runs continuously. It does not need a public domain unless you want to expose health check endpoints.

### Set up a queue with Redis

1. Add a [Redis database](/databases/redis) to your Railway project from the **+ New** menu.
2. Reference the Redis connection string in both your API and worker services using [reference variables](/variables#referencing-another-services-variable).
3. In your API service, enqueue jobs to Redis using your chosen queue library.
4. In your worker service, dequeue and process jobs from Redis.
5. Configure retry behavior and dead-letter handling in your queue library.

## Combining patterns

You can run all three patterns in a single Railway project. A typical setup:

- **API service** handles HTTP requests and enqueues async jobs to Redis.
- **Worker service** dequeues and processes jobs from Redis continuously.
- **Cron service** runs nightly cleanup, generates reports, or triggers periodic syncs.

All three services share the same project databases and communicate over private networking.

## Next steps

- [Cron Jobs](/cron-jobs) - Configure cron schedules and crontab expressions.
- [Private Networking](/networking/private-networking) - Connect services over the internal network.
- [Redis on Railway](/databases/redis) - Deploy and configure a Redis instance.
- [Add a Database Service](/databases) - Provision databases for your project.
