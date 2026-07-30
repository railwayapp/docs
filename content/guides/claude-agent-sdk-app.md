---
title: Deploy a Claude Agent SDK App
description: Deploy a Claude Agent SDK service on Railway that runs agent tasks over HTTP, streams progress as NDJSON, and stays inside the platform's request limits.
date: "2026-07-29"
tags:
  - ai
  - agents
  - claude
  - typescript
topic: ai
---

In this guide we deploy an HTTP service on Railway that accepts a task prompt, runs a Claude agent against it, and streams progress back while the agent works. That agent runs on the Claude Agent SDK (`@anthropic-ai/claude-agent-sdk` for TypeScript, `claude-agent-sdk` for Python), Claude Code packaged as a library. It ships the full agent harness: the reasoning loop, built-in tools for reading and writing files, running bash commands, searching code, and fetching the web, plus context management and session handling. You call `query()` with a prompt, and the SDK drives the loop against the Anthropic API until the task is done.

This is different from the plain Anthropic API SDK (`@anthropic-ai/sdk`), where you define your own tools and either write the agent loop yourself or use the SDK tool runner. The Agent SDK gives you a batteries-included coding and filesystem agent. The tradeoff is that it needs somewhere to run: a real filesystem, a shell, and a long-lived process. That is what we set up here.

This is a CPU workload: the agent calls the Anthropic API over HTTP and never runs models locally, so it needs no GPU. Railway doesn't offer GPU instances anyway, and this architecture never asks for one.

## What you will build

A TypeScript service with two endpoints:

- `GET /health` for Railway health checks.
- `POST /agent` accepts a task prompt, runs the agent, and streams progress back as newline-delimited JSON.

Streaming matters here: Railway closes an HTTP request after 5 minutes with no data transfer, but allows up to 15 minutes total as long as bytes keep flowing. An agent task can think for minutes between visible steps, so writing each SDK message to the response as it arrives keeps the connection alive for the full window.

## Prerequisites

- A Railway account and project. See the [quick start](/quick-start) if you need one.
- An Anthropic API key from the [Anthropic Console](https://platform.claude.com).
- Node.js 18 or later locally.

## Set up the project

```bash
mkdir claude-agent-service && cd claude-agent-service
npm init -y
npm install @anthropic-ai/claude-agent-sdk express
npm install --save-dev typescript @types/express @types/node
npx tsc --init
```

Set `"type": "module"` in `package.json` and add build and start scripts:

```json
{
  "type": "module",
  "scripts": {
    "build": "tsc",
    "start": "node dist/server.js"
  }
}
```

In `tsconfig.json`, target modern Node:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "rootDir": "src",
    "outDir": "dist",
    "strict": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

## Write the agent service

Create `src/server.ts`:

```typescript
import express from "express";
import { mkdirSync } from "node:fs";
import { query } from "@anthropic-ai/claude-agent-sdk";

const app = express();
app.use(express.json());

const WORKSPACE = "/tmp/agent-workspace";
mkdirSync(WORKSPACE, { recursive: true });

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.post("/agent", async (req, res) => {
  const prompt: unknown = req.body?.prompt;
  if (typeof prompt !== "string" || prompt.length === 0) {
    res.status(400).json({ error: "Body must include a 'prompt' string" });
    return;
  }

  // Stream newline-delimited JSON so the connection stays active
  // while the agent works. Railway closes requests idle for 5 minutes.
  res.setHeader("Content-Type", "application/x-ndjson");
  res.setHeader("Cache-Control", "no-cache");

  const write = (obj: Record<string, unknown>) => {
    res.write(JSON.stringify(obj) + "\n");
  };

  try {
    for await (const message of query({
      prompt,
      options: {
        model: "claude-opus-5",
        cwd: WORKSPACE,
        allowedTools: ["Read", "Write", "Edit", "Bash", "Glob", "Grep"],
        permissionMode: "bypassPermissions",
        maxTurns: 30,
      },
    })) {
      if (message.type === "assistant") {
        for (const block of message.message.content) {
          if (block.type === "text") {
            write({ type: "progress", text: block.text });
          } else if (block.type === "tool_use") {
            write({ type: "tool", name: block.name });
          }
        }
      } else if (message.type === "result") {
        write({
          type: "result",
          subtype: message.subtype,
          result: message.subtype === "success" ? message.result : null,
          turns: message.num_turns,
          cost_usd: message.total_cost_usd,
        });
      }
    }
  } catch (error) {
    write({
      type: "error",
      message: error instanceof Error ? error.message : String(error),
    });
  }

  res.end();
});

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`Agent service listening on port ${port}`);
});
```

A few decisions worth calling out:

- **`permissionMode: "bypassPermissions"`** lets the agent run tools without interactive approval, which is required for a headless service. The agent can then execute arbitrary shell commands inside your container. Only run prompts you trust, keep the service off the public internet or behind authentication, and scope `allowedTools` down to what the task needs.
- **`cwd` points at a scratch directory.** That's because Railway's container filesystem is ephemeral: everything the agent writes disappears on the next deploy or restart. If task outputs must persist, attach a [volume](/volumes) and point `cwd` at its mount path instead. Volumes are mounted at runtime only, not during builds or pre-deploy commands.
- **`maxTurns` caps the loop.** Without it, a stuck agent can burn tokens indefinitely.
- **The SDK reads `ANTHROPIC_API_KEY` from the environment.** No key appears in code.

Test locally:

```bash
export ANTHROPIC_API_KEY=sk-ant-...
npm run build && npm start
curl -N -X POST http://localhost:3000/agent \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Create a file called notes.md summarizing what tools you have available."}'
```

## Deploy to Railway

Push the project to a GitHub repository, then create a service from it:

1. In your Railway project, choose **New Service** and select the repository. Railpack detects Node.js, runs `npm install` and `npm run build`, and starts the service with `npm start`.
2. Open the service's **Variables** tab and add `ANTHROPIC_API_KEY`. Variables are made available to your service as environment variables at runtime, so the key never appears in your code or repository. See [Variables](/variables).
3. Under **Settings → Networking**, generate a public domain. Railway assigns a `*.up.railway.app` URL and routes traffic to the `PORT` your service listens on.
4. Configure `/health` as the [health check path](/deployments/healthchecks) so deploys only go live once the server is accepting traffic. Health checks are HTTP only, and a configured health check is what enables zero-downtime deploys.

Once deployed, run a task against the public URL:

```bash
curl -N -X POST https://your-service.up.railway.app/agent \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Write a haiku about deployment logs to haiku.txt, then read it back."}'
```

Progress lines stream as the agent thinks and calls tools, ending with a `result` line that includes turn count and cost.

## Handle long-running agent tasks

Agent tasks are unpredictable in duration, so plan around Railway's request lifecycle.

**Requests stream for up to 15 minutes.** As long as your response keeps transferring data, Railway holds the connection open for up to 15 minutes, and closes it after 5 minutes of silence. The NDJSON streaming above satisfies the activity requirement for most tasks. If your agent can go quiet for long stretches, write a heartbeat line every 30 to 60 seconds.

**Tasks longer than 15 minutes need a different shape.** Two options:

- **WebSockets** are exempt from the HTTP timeout. Accept the task over a WebSocket connection and push progress events for as long as the agent runs.
- **A worker pattern.** Have the HTTP endpoint enqueue the task and return an ID immediately, then run the agent in a separate worker service and poll for status. This also lets multiple tasks run concurrently without tying up request handlers. See [Deploy an AI Agent with Async Workers](/guides/ai-agent-workers).

**Leave serverless off for agent services.** Railway's [serverless mode](/deployments/serverless) sleeps a service after 10 minutes without outbound traffic and wakes it on the next request. An idle agent service sends no outbound traffic, so it will sleep, and the first task after a wake pays cold-start latency. That cold start is why agent workloads are usually better served by an always-on service, which is the default.

**Scheduled agent runs work with cron.** If the agent should run on a schedule instead of on demand, configure a [cron schedule](/cron-jobs) on a service that runs one task and exits. Cron granularity is 5 minutes at minimum, schedules are evaluated in UTC, and if a previous run is still executing when the next tick arrives, the new run is skipped rather than stacked. Long agent runs on a tight schedule will silently skip ticks, so size the interval generously.

## Control resource usage and cost

Railway bills by usage: RAM at $10 per GB-month, CPU at $20 per vCPU-month, and egress at $0.05 per GB, billed by the minute while the service runs. Within that, the Agent SDK process itself is light, typically well under 1 GB of RAM, but bash tool calls inherit the container's resources, so a task that compiles a large project consumes what that compile needs. Set [resource limits](/deployments/optimize-performance) on the service, and remember the dominant cost of an agent service is usually Anthropic API tokens, not Railway compute. The `total_cost_usd` field in each result line gives you per-task token spend to log and monitor.

For a fuller cost model covering compute, tokens, and storage together, see [Estimate AI Agent Costs](/guides/estimate-ai-agent-costs).

## Use Python instead

The same architecture works with the Python SDK. Install `claude-agent-sdk` from PyPI, wrap `query()` in a FastAPI streaming endpoint, and deploy the same way; Railpack detects Python projects automatically. The options, tool set, and message stream mirror the TypeScript API. See the [Claude Agent SDK documentation](https://code.claude.com/docs/en/agent-sdk) for the Python reference.

## Next steps

- [Deploy an AI Agent with Async Workers](/guides/ai-agent-workers) for tasks that outlive a single HTTP request.
- [Running Agents on Railway](/guides/running-agents-on-railway) for a webhook-driven autonomous agent example.
- [Estimate AI Agent Costs](/guides/estimate-ai-agent-costs) to model compute and token spend before launch.
- [Stream AI Responses](/guides/streaming-ai-responses) for streaming patterns with the plain Anthropic API.
