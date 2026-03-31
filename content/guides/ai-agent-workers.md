---
title: Deploy an AI Agent with Async Workers
description: Run AI agent workflows on Railway with an API service, async workers via Redis queue, and Postgres for state persistence. Covers CPU-based agent patterns without GPU.
date: "2026-03-30"
tags:
  - architecture
  - ai
  - workers
  - agents
topic: architecture
---

AI agents that call LLM APIs, execute tools, and manage multi-step workflows need async processing. A single HTTP request cannot stay open long enough for an agent that takes minutes to reason through a task. This guide covers how to deploy an agent architecture on Railway using an API service, Redis-backed workers, and Postgres for state.

## Architecture overview

This pattern uses four components:

- **API service** receives requests, enqueues agent tasks, and returns status and results.
- **Worker service** dequeues tasks, runs agent loops (call LLM, parse response, execute tools, repeat), and stores results.
- **Postgres** stores conversation state, tool outputs, and task status.
- **Redis** serves as the job queue between the API and workers.

This is a CPU-based architecture. The workers call external LLM APIs (OpenAI, Anthropic, etc.) over HTTP. They do not run models locally. Railway does not offer GPU instances.

**Best for:** AI agent workflows where tasks take seconds to minutes, require multi-step LLM reasoning, and need state persistence across steps. Typical use cases include code generation agents, research assistants, data analysis pipelines, and automated customer support.

## When to use this pattern

- Agent tasks take seconds to minutes, too long for a synchronous HTTP response.
- You need to track task progress and state across steps.
- Multiple agent tasks should run concurrently.
- You want to retry failed agent steps without losing progress.

For a broader comparison of async processing patterns, see [Choose between cron jobs, workers, and queues](/guides/cron-workers-queues).

## Prerequisites

- A Railway account.
- An LLM API key (OpenAI, Anthropic, etc.).
- Application code with separate API and worker entry points.

## 1. Create the project and databases

1. Create a new [project](/projects) on Railway.
2. Add [PostgreSQL](/databases/postgresql): click **+ New → Database → PostgreSQL**.
3. Add [Redis](/databases/redis): click **+ New → Database → Redis**.

Both databases will be available to all services in the project via [reference variables](/variables#referencing-another-services-variable).

## 2. Deploy the API service

1. Deploy from [GitHub](/deployments/github-autodeploys) or the [Railway CLI](/cli).
2. Set environment variables:
   - [Reference](/variables#referencing-another-services-variable) `DATABASE_URL` from Postgres.
   - [Reference](/variables#referencing-another-services-variable) `REDIS_URL` from Redis.
   - Add your LLM API key (e.g., `OPENAI_API_KEY` or `ANTHROPIC_API_KEY`).
3. Generate a [public domain](/networking/public-networking#railway-provided-domain) under **Settings → Networking → Public Networking**.
4. Run database migrations via a [pre-deploy command](/deployments/pre-deploy-command).

### API endpoints

Your API should expose at minimum:

- `POST /tasks` creates a new agent task, enqueues it, and returns a task ID.
- `GET /tasks/:id` checks task status and retrieves results.
- `GET /tasks/:id/stream` (optional) streams agent progress via SSE.

If you use SSE for streaming progress, implement client-side reconnection. Railway has a 15-minute maximum HTTP request duration; for tasks that exceed this, the client must reconnect and resume from the last received event.

## 3. Deploy the worker service

1. Add a new service in the same project, pointing at the same repo with a different start command (e.g., `npm run worker` or `python worker.py`).
2. Reference the same `DATABASE_URL`, `REDIS_URL`, and LLM API key variables.
3. No public domain is needed. The worker communicates with Redis and Postgres over [private networking](/networking/private-networking).

Deploy the worker as an always-on service, not a cron job. Agent tasks are event-driven, not scheduled.

### Worker loop

The worker repeats the following cycle:

1. Pull a task from the Redis queue.
2. Load conversation state from Postgres.
3. Call the LLM API with the current context.
4. Parse the response for tool calls.
5. Execute tools and append results to the conversation.
6. Repeat steps 3-5 until the agent completes or hits a step limit.
7. Store the final result in Postgres.
8. Acknowledge the job in Redis.

### Handling long-running tasks

Agent tasks can take minutes. Design your worker to:

- Update task status in Postgres at each step so the API can report progress.
- Set a maximum step count to prevent infinite loops.
- Handle LLM API timeouts and rate limits with retries and exponential backoff.
- Clean up resources if the task is cancelled.

**Failure mode:** If a worker crashes mid-task, the job may be left in an incomplete state in Postgres. Design your worker to update task status at each step so the API can detect stalled tasks. Use Redis job acknowledgment to prevent the same task from being picked up twice. Consider implementing a separate cleanup cron that marks timed-out tasks as failed.

## 4. Scale workers independently

Workers are separate Railway services, so you can scale them without affecting the API:

- Increase worker replicas via [horizontal scaling](/deployments/scaling). All replicas pull from the same Redis queue, so adding replicas increases throughput.
- Adjust memory and CPU for worker services under **Settings → Resources**.
- Monitor queue depth in Redis to determine when to add or remove replicas.

## GPU availability

Railway does not currently offer GPU instances. This architecture assumes your agent calls external LLM APIs from CPU-based workers. If your workflow requires local model inference, you will need an external GPU provider for that component.

## Next steps

- [Scaling](/deployments/scaling) - Configure horizontal and vertical scaling for your services.
- [PostgreSQL on Railway](/databases/postgresql) - Connection pooling, backups, and configuration.
- [Redis on Railway](/databases/redis) - Persistence settings and memory management.
- [Choose Between SSE and WebSockets](/guides/sse-vs-websockets) - Options for streaming agent progress to clients.
