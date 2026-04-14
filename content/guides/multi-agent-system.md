---
title: Deploy a Multi-Agent System on Railway
description: Deploy multiple AI agents as separate Railway services that communicate via Redis and Postgres. Covers agent orchestration, inter-service communication, staggered scheduling, and independent scaling.
date: "2026-04-14"
tags:
  - agents
  - multi-agent
  - python
  - workers
topic: ai
---

A multi-agent system uses multiple specialized AI agents that collaborate on tasks. Each agent has a specific role (researcher, writer, reviewer, etc.) and calls an LLM API to reason through its part of the work. Agents communicate by reading and writing shared state in a database or message queue.

This guide covers deploying a multi-agent system on Railway where each agent runs as a separate service. This architecture lets you scale agents independently, use different LLM providers per agent, and isolate failures.

Railway is a CPU-based platform. All agents call external LLM APIs (OpenAI, Anthropic, etc.) over HTTP. No models run locally.

## Architecture overview

The system uses four types of components:

- **Orchestrator service** receives tasks, breaks them into subtasks, and assigns them to agents via a Redis queue or Postgres task table.
- **Agent services** (one per role) pull tasks from the queue, call their assigned LLM, and write results back to the shared state.
- **Postgres** stores task definitions, agent outputs, conversation history, and final results.
- **Redis** serves as the message queue between the orchestrator and agents.

This extends the [single-agent async workers pattern](/guides/ai-agent-workers) to multiple specialized agents.

## When to use this pattern

- A task requires different capabilities (research, analysis, writing, review) that benefit from separate prompts and models.
- You want to run agents concurrently to reduce total execution time.
- Different agents need different resource allocations or scaling behavior.
- You want to swap or update individual agents without redeploying the entire system.

For simpler use cases where a single agent with tool-calling is sufficient, see [Deploy an AI Agent with Async Workers](/guides/ai-agent-workers).

## Prerequisites

- A Railway account
- API keys for one or more LLM providers (OpenAI, Anthropic, etc.)
- Application code structured as separate agent entry points

## 1. Create the project and shared infrastructure

1. Create a new [project](/projects) on Railway.
2. Add [PostgreSQL](/databases/postgresql): click **+ New > Database > PostgreSQL**.
3. Add [Redis](/databases/redis): click **+ New > Database > Redis**.
4. Run your schema migrations via a [pre-deploy command](/deployments/pre-deploy-command) on the orchestrator service.

Create a tasks table for coordination:

```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_task_id UUID REFERENCES tasks(id),
  agent_role TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  input JSONB NOT NULL,
  output JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

## 2. Deploy the orchestrator

The orchestrator receives incoming requests, creates subtasks, and dispatches them to agent queues:

1. Deploy from [GitHub](/deployments/github-autodeploys) or the [CLI](/cli).
2. Set environment variables:
   - [Reference](/variables#referencing-another-services-variable) `DATABASE_URL` from Postgres.
   - [Reference](/variables#referencing-another-services-variable) `REDIS_URL` from Redis.
3. Generate a [public domain](/networking/public-networking#railway-provided-domain) for receiving task requests.

The orchestrator pushes tasks to agent-specific Redis queues (e.g., `queue:researcher`, `queue:writer`, `queue:reviewer`).

## 3. Deploy agent services

Each agent is a separate Railway service pointing at the same codebase with a different start command:

1. For each agent role, click **+ New > GitHub Repo** and select the same repository.
2. Set a different start command per agent:
   - Researcher: `python -m agents.researcher`
   - Writer: `python -m agents.writer`
   - Reviewer: `python -m agents.reviewer`
3. Set environment variables on each agent service:
   - [Reference](/variables#referencing-another-services-variable) `DATABASE_URL` and `REDIS_URL`.
   - Set the agent's LLM API key. Different agents can use different providers (e.g., researcher uses Anthropic, writer uses OpenAI).
4. No public domains are needed for agent services. They communicate via Redis and Postgres over [private networking](/networking/private-networking).

## 4. Handle inter-agent communication

Agents communicate through shared state, not direct calls. Two common patterns:

**Queue-based (Redis):** The orchestrator pushes tasks to per-agent queues. Each agent pulls from its queue, processes the task, writes the result to Postgres, and pushes downstream tasks to the next agent's queue.

**State-based (Postgres):** Agents poll the tasks table for tasks matching their role with status `pending`. After processing, they update the task status and output. The orchestrator or downstream agents watch for completed upstream tasks.

The queue-based approach has lower latency. The state-based approach is simpler to debug since all state is in Postgres.

## 5. Stagger agent startup to avoid rate limits

When multiple agents start simultaneously, they all hit the LLM API at once. This can trigger rate limits, especially with providers that enforce per-minute token caps.

Add a startup delay per agent using an environment variable:

```python
import os
import time

startup_delay = int(os.environ.get("STARTUP_DELAY_SECONDS", "0"))
time.sleep(startup_delay)
```

Set `STARTUP_DELAY_SECONDS` to `0`, `5`, `10`, etc. on each agent service.

## 6. Scale agents independently

Each agent is a separate Railway service with its own scaling configuration:

- Add [horizontal replicas](/deployments/scaling) to high-throughput agents (e.g., 3 researcher replicas, 1 reviewer replica).
- Adjust CPU and memory per agent under **Settings > Resources**.
- Monitor queue depth in Redis to identify bottlenecks.

## Using a framework

If you prefer a framework for agent orchestration, [CrewAI](https://crewai.com) and [AutoGen](https://microsoft.github.io/autogen/) handle agent definitions, task routing, and conversation management. Deploy the framework as your orchestrator service and let it manage agent interactions internally, or split agents into separate services for independent scaling.

## Next steps

- [Deploy an AI Agent with Async Workers](/guides/ai-agent-workers): The single-agent version of this pattern.
- [Deploy a RAG Pipeline with pgvector](/guides/rag-pipeline-pgvector): Give agents access to a knowledge base.
- [Scaling](/deployments/scaling): Configure horizontal and vertical scaling.
- [Redis on Railway](/databases/redis): Persistence settings and memory management.
