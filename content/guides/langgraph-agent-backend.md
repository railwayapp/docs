---
title: Deploy a LangGraph Agent Backend
description: Run a LangGraph agent as a FastAPI service on Railway with Postgres checkpointing for durable conversation state and Claude as the LLM.
date: "2026-07-29"
tags:
  - langgraph
  - agents
  - python
  - postgres
topic: ai
---

In this guide we deploy a Python LangGraph agent on Railway as an HTTP service:

- **FastAPI service** exposes the agent over HTTP.
- **Postgres** stores checkpoints, so threads are durable and multi-turn.
- **Claude** (or any hosted LLM API) does the reasoning over HTTP.

The agent itself is a LangGraph graph: a framework for building stateful agents where each node is a step (call the model, run a tool), edges define control flow, and a checkpointer persists the full graph state after every step. That last part is what makes LangGraph a good fit for a hosted backend: with a Postgres checkpointer, every conversation thread survives restarts and redeploys.

Running the model locally isn't an option here, though: Railway runs CPU workloads only, with no GPU instances, so the agent calls an external LLM API instead. That's the standard LangGraph deployment shape.

## Prerequisites

- A Railway account and project.
- An Anthropic API key (or another LLM provider key).
- Python 3.11+.

## Provision Postgres

Add a Postgres database to your project via the `ctrl / cmd + k` menu or the `+ New` button on the Project Canvas. See the [PostgreSQL guide](/databases/postgresql) for details.

The database exposes a `DATABASE_URL` variable. Your agent service will read it through a [reference variable](/variables#referencing-another-services-variable).

## Project structure

```
langgraph-agent/
├── main.py
├── requirements.txt
```

Create `requirements.txt`:

```txt
fastapi==0.115.6
uvicorn==0.34.0
langgraph==0.3.34
langgraph-checkpoint-postgres==2.0.21
langchain-anthropic==0.3.13
langchain-core==0.3.63
psycopg[binary,pool]==3.2.6
```

Install locally with:

```bash
pip install -r requirements.txt
```

## Build the agent

Create `main.py`. It defines a two-node graph (agent and tools), wires it to a Postgres checkpointer backed by a connection pool, and serves it with FastAPI:

```python
import os
from typing import Annotated

from fastapi import FastAPI
from langchain_anthropic import ChatAnthropic
from langchain_core.messages import HumanMessage
from langchain_core.tools import tool
from langgraph.checkpoint.postgres import PostgresSaver
from langgraph.graph import END, START, StateGraph
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode
from psycopg_pool import ConnectionPool
from pydantic import BaseModel
from typing_extensions import TypedDict


# --- Tools ---------------------------------------------------------------

@tool
def word_count(text: str) -> int:
    """Count the number of words in a piece of text."""
    return len(text.split())


tools = [word_count]

# --- Model ---------------------------------------------------------------

llm = ChatAnthropic(model="claude-opus-5", max_tokens=4096)
llm_with_tools = llm.bind_tools(tools)


# --- Graph ---------------------------------------------------------------

class State(TypedDict):
    messages: Annotated[list, add_messages]


def agent_node(state: State) -> State:
    response = llm_with_tools.invoke(state["messages"])
    return {"messages": [response]}


def route_after_agent(state: State) -> str:
    last_message = state["messages"][-1]
    if getattr(last_message, "tool_calls", None):
        return "tools"
    return END


builder = StateGraph(State)
builder.add_node("agent", agent_node)
builder.add_node("tools", ToolNode(tools))
builder.add_edge(START, "agent")
builder.add_conditional_edges("agent", route_after_agent, {"tools": "tools", END: END})
builder.add_edge("tools", "agent")

# --- Checkpointer --------------------------------------------------------

pool = ConnectionPool(
    conninfo=os.environ["DATABASE_URL"],
    max_size=20,
    kwargs={"autocommit": True, "prepare_threshold": 0},
)
checkpointer = PostgresSaver(pool)
checkpointer.setup()  # creates checkpoint tables on first run

graph = builder.compile(checkpointer=checkpointer)

# --- API -----------------------------------------------------------------

api = FastAPI()


class ChatRequest(BaseModel):
    thread_id: str
    message: str


@api.get("/health")
def health() -> dict:
    return {"status": "ok"}


@api.post("/chat")
def chat(req: ChatRequest) -> dict:
    config = {"configurable": {"thread_id": req.thread_id}}
    result = graph.invoke(
        {"messages": [HumanMessage(content=req.message)]},
        config,
    )
    return {
        "thread_id": req.thread_id,
        "reply": result["messages"][-1].content,
    }
```

Two details matter for a hosted deployment:

- **The checkpointer is the memory.** Every call with the same `thread_id` resumes the same conversation. State lives in Postgres, not in process memory, so redeploys and restarts lose nothing.
- **`prepare_threshold: 0` and `autocommit: True`** are required by the Postgres checkpointer when used with a psycopg connection pool.

## Deploy to Railway

1. Push the code to a GitHub repository and create a new service from it in your project, or deploy with the [CLI](/cli) using `railway up`.
2. Railway detects Python and builds the service with [Railpack](/builds).
3. Set the start command in service settings:

```bash
uvicorn main:api --host 0.0.0.0 --port $PORT
```

4. Add variables on the agent service:

```
ANTHROPIC_API_KEY=sk-ant-...
DATABASE_URL=${{Postgres.DATABASE_URL}}
```

The `${{Postgres.DATABASE_URL}}` syntax is a [reference variable](/variables#referencing-another-services-variable) that resolves to the Postgres service's connection string.

5. Generate a public domain under the service's Settings tab. Railway provides a `*.up.railway.app` domain; you can attach a [custom domain](/networking/domains) later.

## Configure a health check

Set the healthcheck path to `/health` in the service settings. That path is what enables zero-downtime deploys: Railway checks it over HTTP, and the new deployment must respond before traffic switches over. See [healthchecks](/deployments/healthchecks).

## Test it

```bash
curl -X POST https://your-service.up.railway.app/chat \
  -H "Content-Type: application/json" \
  -d '{"thread_id": "demo-1", "message": "How many words are in: the quick brown fox?"}'
```

Send a second request with the same `thread_id` and a follow-up question. The agent answers with full context from the earlier turn, loaded from the Postgres checkpoint.

## Long-running agent turns

Agent turns that chain several tool calls and model calls can take a while, and that runs up against Railway's request limits: HTTP requests can run up to 15 minutes as long as data keeps transferring, but connections close after 5 minutes of inactivity. Two ways to stay inside those limits:

- **Stream the response.** LangGraph's `graph.stream()` yields events per step; forward them as server-sent events so bytes keep flowing during long turns.
- **Move to async workers.** For turns that run longer than a request should, enqueue the job and poll for results. The [AI agent workers guide](/guides/ai-agent-workers) covers that architecture with Redis as the queue and Postgres for state, and it composes with LangGraph directly: the worker runs `graph.invoke()` instead of a hand-rolled agent loop.

## Scaling and cost notes

- Railway pricing is usage-based: RAM at $10/GB-month, CPU at $20/vCPU-month, egress at $0.05/GB. A LangGraph service is mostly I/O-bound (waiting on the LLM API), so small resource limits are enough.
- If traffic is intermittent, enable [serverless](/deployments/serverless). The service sleeps after 10 minutes without outbound traffic and wakes on the next request. Note that an open database connection pool counts as outbound traffic and prevents sleep; if you want sleep behavior, connect per-request instead of holding a pool.
- Postgres and the agent service talk over the connection string from the reference variable. For traffic between services in the same environment, [private networking](/networking/private-networking) at `<service>.railway.internal` avoids egress fees.

## Redis as an alternative state store

LangGraph also has a Redis checkpointer (`langgraph-checkpoint-redis`), and Railway's [Redis template](/databases/redis) deploys with zero configuration and exposes `REDIS_URL` if you want to swap it in. Postgres stays the better default for conversation state you want to keep and query; Redis fits short-lived threads, or cases where you already run Redis as a queue for workers.

## Next steps

- [Deploy an AI Agent with Async Workers](/guides/ai-agent-workers) - Move long agent turns off the request path with Redis-backed workers.
- [Deploy a Multi-Agent System on Railway](/guides/multi-agent-system) - Split specialized agents into separate services.
- [Estimate AI Agent Costs](/guides/estimate-ai-agent-costs) - Model compute and egress costs for agent workloads.
- [Running Agents on Railway](/guides/running-agents-on-railway) - The broader picture of hosting autonomous agents.
