---
title: Deploy a Multi-Agent System on Railway
description: Deploy multiple AI agents as separate Railway services that communicate via Redis and Postgres. Includes working orchestrator and agent code, inter-service communication, and independent scaling.
date: "2026-04-14"
tags:
  - agents
  - multi-agent
  - python
  - workers
topic: ai
---

A multi-agent system uses multiple specialized AI agents that collaborate on tasks. Each agent has a specific role (researcher, writer, reviewer) and calls an LLM API to reason through its part of the work. Agents communicate by reading and writing shared state in a database and message queue.

This guide covers deploying a multi-agent system on Railway where each agent runs as a separate service. This lets you scale agents independently, use different LLM providers per agent, and isolate failures.

Railway is a CPU-based platform. All agents call external LLM APIs (OpenAI, Anthropic, etc.) over HTTP. No models run locally.

## Architecture overview

The system uses four types of components:

- **Orchestrator service** receives tasks via HTTP, creates subtasks, and dispatches them to agent-specific Redis queues.
- **Agent services** (one per role) pull tasks from their queue, call their assigned LLM, write results to Postgres, and push downstream tasks to the next agent's queue.
- **Postgres** stores task state, agent outputs, and final results.
- **Redis** serves as the message queue between services.

This extends the [single-agent async workers pattern](/guides/ai-agent-workers) to multiple specialized agents.

## Prerequisites

- A Railway account
- API keys for one or more LLM providers (OpenAI, Anthropic, etc.)
- Python 3.11+

## Project structure

Create a repository with the following structure:

```
multi-agent/
├── requirements.txt
├── shared.py
├── orchestrator.py
├── agents/
│   ├── __init__.py
│   ├── researcher.py
│   └── writer.py
```

### requirements.txt

```
fastapi
uvicorn
openai
redis
psycopg2-binary
```

### shared.py

Shared utilities for database and Redis connections used by all services:

```python
import os
import json
import uuid
import psycopg2
import redis

DATABASE_URL = os.environ["DATABASE_URL"]
REDIS_URL = os.environ["REDIS_URL"]

def get_db():
    return psycopg2.connect(DATABASE_URL)

def get_redis():
    return redis.from_url(REDIS_URL)

def create_task(conn, agent_role: str, input_data: dict, parent_id: str = None) -> str:
    task_id = str(uuid.uuid4())
    cur = conn.cursor()
    cur.execute(
        """INSERT INTO tasks (id, parent_task_id, agent_role, status, input)
           VALUES (%s, %s, %s, 'pending', %s)""",
        (task_id, parent_id, agent_role, json.dumps(input_data)),
    )
    conn.commit()
    cur.close()
    return task_id

def complete_task(conn, task_id: str, output_data: dict):
    cur = conn.cursor()
    cur.execute(
        "UPDATE tasks SET status = 'completed', output = %s WHERE id = %s",
        (json.dumps(output_data), task_id),
    )
    conn.commit()
    cur.close()

def get_task(conn, task_id: str) -> dict:
    cur = conn.cursor()
    cur.execute("SELECT id, agent_role, status, input, output FROM tasks WHERE id = %s", (task_id,))
    row = cur.fetchone()
    cur.close()
    if not row:
        return None
    return {"id": row[0], "agent_role": row[1], "status": row[2], "input": row[3], "output": row[4]}
```

### orchestrator.py

The orchestrator receives HTTP requests, creates tasks, and dispatches them to agent queues:

```python
import json
from fastapi import FastAPI
from shared import get_db, get_redis, create_task, get_task

app = FastAPI()

@app.post("/tasks")
async def submit_task(topic: str):
    conn = get_db()
    r = get_redis()

    # Create a research task and push it to the researcher queue
    task_id = create_task(conn, "researcher", {"topic": topic})
    r.lpush("queue:researcher", json.dumps({"task_id": task_id}))
    conn.close()

    return {"task_id": task_id}

@app.get("/tasks/{task_id}")
async def check_task(task_id: str):
    conn = get_db()
    task = get_task(conn, task_id)
    conn.close()
    if not task:
        return {"error": "not found"}, 404
    return task
```

### agents/researcher.py

The researcher agent pulls tasks from its queue, calls the LLM to research a topic, then creates a follow-up task for the writer:

```python
import os
import json
import time
from openai import OpenAI
from shared import get_db, get_redis, complete_task, create_task

client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])

startup_delay = int(os.environ.get("STARTUP_DELAY_SECONDS", "0"))
time.sleep(startup_delay)

def run():
    r = get_redis()
    print("Researcher agent started, waiting for tasks...")

    while True:
        _, message = r.brpop("queue:researcher")
        data = json.loads(message)
        task_id = data["task_id"]

        conn = get_db()
        from shared import get_task
        task = get_task(conn, task_id)
        topic = task["input"]["topic"]

        # Call the LLM to research the topic
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a research assistant. Provide detailed findings on the given topic."},
                {"role": "user", "content": f"Research this topic: {topic}"},
            ],
        )
        research = response.choices[0].message.content

        # Mark research task as complete
        complete_task(conn, task_id, {"research": research})

        # Create a writing task and push it to the writer queue
        writer_task_id = create_task(conn, "writer", {"topic": topic, "research": research}, parent_id=task_id)
        r.lpush("queue:writer", json.dumps({"task_id": writer_task_id}))
        conn.close()

        print(f"Research complete for task {task_id}, dispatched to writer")

if __name__ == "__main__":
    run()
```

### agents/writer.py

The writer agent takes research output and produces a finished article:

```python
import os
import json
import time
from openai import OpenAI
from shared import get_db, get_redis, complete_task

client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])

startup_delay = int(os.environ.get("STARTUP_DELAY_SECONDS", "0"))
time.sleep(startup_delay)

def run():
    r = get_redis()
    print("Writer agent started, waiting for tasks...")

    while True:
        _, message = r.brpop("queue:writer")
        data = json.loads(message)
        task_id = data["task_id"]

        conn = get_db()
        from shared import get_task
        task = get_task(conn, task_id)
        topic = task["input"]["topic"]
        research = task["input"]["research"]

        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a writer. Turn the research into a clear, well-structured article."},
                {"role": "user", "content": f"Topic: {topic}\n\nResearch:\n{research}"},
            ],
        )
        article = response.choices[0].message.content

        complete_task(conn, task_id, {"article": article})
        conn.close()

        print(f"Article written for task {task_id}")

if __name__ == "__main__":
    run()
```

## 1. Create the project and shared infrastructure

1. Create a new [project](/projects) on Railway.
2. Add [PostgreSQL](/databases/postgresql): click **+ New > Database > PostgreSQL**.
3. Add [Redis](/databases/redis): click **+ New > Database > Redis**.

Create the tasks table by connecting to Postgres and running:

```sql
CREATE TABLE tasks (
  id TEXT PRIMARY KEY,
  parent_task_id TEXT REFERENCES tasks(id),
  agent_role TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  input JSONB NOT NULL,
  output JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

## 2. Deploy the orchestrator

1. Push the code above to a GitHub repository.
2. In your project, click **+ New > GitHub Repo** and select your repository.
3. Set the [start command](/deployments/start-command) to: `uvicorn orchestrator:app --host 0.0.0.0 --port $PORT`
4. Set environment variables:
   - [Reference](/variables#referencing-another-services-variable) `DATABASE_URL` from Postgres.
   - [Reference](/variables#referencing-another-services-variable) `REDIS_URL` from Redis.
5. Generate a [public domain](/networking/public-networking#railway-provided-domain) for receiving task requests.

## 3. Deploy agent services

Each agent is a separate Railway service pointing at the same repository with a different start command:

1. Click **+ New > GitHub Repo** and select the same repository again.
2. Name the service `researcher`.
3. Set the [start command](/deployments/start-command) to: `python -m agents.researcher`
4. Set environment variables:
   - [Reference](/variables#referencing-another-services-variable) `DATABASE_URL` and `REDIS_URL` (same as the orchestrator).
   - Set `OPENAI_API_KEY` to your API key.
   - Set `STARTUP_DELAY_SECONDS` to `0`.
5. No public domain is needed. The agent communicates via Redis and Postgres over [private networking](/networking/private-networking).

Repeat for the writer agent:

1. Click **+ New > GitHub Repo** and select the same repository.
2. Name the service `writer`.
3. Set the [start command](/deployments/start-command) to: `python -m agents.writer`
4. Set the same environment variables, but set `STARTUP_DELAY_SECONDS` to `5` to stagger startup and avoid hitting LLM API rate limits.

## 4. Test the system

Send a task to the orchestrator:

```bash
curl -X POST "https://your-orchestrator.up.railway.app/tasks?topic=quantum+computing"
```

This returns a task ID. The researcher picks it up, calls the LLM, writes the research to Postgres, and dispatches a writing task. The writer picks that up and produces an article.

Check the result:

```bash
curl "https://your-orchestrator.up.railway.app/tasks/TASK_ID"
```

## 5. Scale agents independently

Each agent is a separate Railway service with its own scaling configuration:

- Add [horizontal replicas](/deployments/scaling) to high-throughput agents (e.g., 3 researcher replicas, 1 writer replica). All replicas pull from the same Redis queue.
- Adjust CPU and memory per agent under **Settings > Resources**.
- Monitor queue depth in Redis to identify bottlenecks.

## Using a framework

If you prefer a framework for agent orchestration, [CrewAI](https://crewai.com) and [AutoGen](https://microsoft.github.io/autogen/) handle agent definitions, task routing, and conversation management. Deploy the framework as your orchestrator service and let it manage agent interactions internally, or split agents into separate services for independent scaling.

## Next steps

- [Deploy an AI Agent with Async Workers](/guides/ai-agent-workers): The single-agent version of this pattern.
- [Deploy a RAG Pipeline with pgvector](/guides/rag-pipeline-pgvector): Give agents access to a knowledge base.
- [Scaling](/deployments/scaling): Configure horizontal and vertical scaling.
- [Redis on Railway](/databases/redis): Persistence settings and memory management.
