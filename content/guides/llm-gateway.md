---
title: Build an LLM Gateway in TypeScript
description: Build and deploy an LLM gateway on Railway that issues its own API keys, enforces per-key token budgets, and tracks spend across teams. One place to hold provider keys instead of scattering them across services.
date: "2026-07-29"
tags:
  - llm
  - gateway
  - typescript
  - ai
topic: ai
---

An LLM gateway is a service that sits between your applications and LLM providers. Applications call the gateway with keys you issue; the gateway holds the real provider keys, enforces limits, records usage, and forwards the request. One service knows the provider credentials instead of every service knowing them.

In this guide we build a small gateway in TypeScript and deploy it on Railway. It does three things: authenticates callers with gateway-issued keys, enforces a daily token budget per key, and tracks what each key spends.

If you want an off-the-shelf gateway with model routing and failover across 100+ providers, deploy LiteLLM instead: see [Deploy an AI API Gateway](/guides/ai-api-proxy). Build your own when the logic you need is small and specific, and you would rather own 100 lines than operate someone else's admin UI.

## Why a gateway

Three problems show up as soon as more than one service calls an LLM:

- **Key sprawl.** Every service holds a copy of the provider key. Rotating it means touching every service.
- **No per-consumer limits.** The provider enforces one org-level rate limit. A runaway script in one team exhausts it for everyone.
- **Unattributed spend.** The provider bill is one number. Which service, team, or feature spent it is invisible.

A gateway solves all three with one move: callers get their own keys, and the provider key lives in exactly one place.

## 1. Create the gateway

```bash
mkdir llm-gateway && cd llm-gateway
npm init -y
npm install express @anthropic-ai/sdk
npm install -D typescript @types/node @types/express
npx tsc --init
```

Update `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "Node16",
    "moduleResolution": "Node16",
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

The gateway reads its key table from a `GATEWAY_KEYS` variable in the form `key:daily-token-limit`, comma-separated. That keeps the example self-contained; the upgrade path is a database table.

```typescript
// src/index.ts
import Anthropic from "@anthropic-ai/sdk";
import express from "express";

const anthropic = new Anthropic(); // reads ANTHROPIC_API_KEY

// GATEWAY_KEYS="team-a-key:200000,team-b-key:50000"
const limits = new Map<string, number>(
  (process.env.GATEWAY_KEYS ?? "").split(",").map((entry) => {
    const [key, limit] = entry.split(":");
    return [key, Number(limit)] as const;
  })
);

type Usage = { tokens: number; requests: number; resetAt: number };
const usage = new Map<string, Usage>();

function nextUtcMidnight(): number {
  const now = new Date();
  return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1);
}

function usageFor(key: string): Usage {
  const current = usage.get(key);
  if (current && current.resetAt > Date.now()) return current;
  const fresh = { tokens: 0, requests: 0, resetAt: nextUtcMidnight() };
  usage.set(key, fresh);
  return fresh;
}

const app = express();
app.use(express.json());

app.post("/v1/messages", async (req, res) => {
  const key = req.headers.authorization?.replace("Bearer ", "") ?? "";
  const limit = limits.get(key);
  if (limit === undefined) {
    res.status(401).json({ error: "unknown gateway key" });
    return;
  }

  const spent = usageFor(key);
  if (spent.tokens >= limit) {
    res.status(429).json({
      error: "daily token budget exhausted",
      resets_at: new Date(spent.resetAt).toISOString(),
    });
    return;
  }

  const { model, max_tokens, messages, system } = req.body;
  const response = await anthropic.messages.create({
    model,
    max_tokens,
    messages,
    ...(system ? { system } : {}),
  });

  spent.tokens += response.usage.input_tokens + response.usage.output_tokens;
  spent.requests += 1;

  res.json(response);
});

// Per-key spend, for dashboards and finger-pointing
app.get("/v1/usage", (req, res) => {
  const key = req.headers.authorization?.replace("Bearer ", "") ?? "";
  const limit = limits.get(key);
  if (limit === undefined) {
    res.status(401).json({ error: "unknown gateway key" });
    return;
  }
  const spent = usageFor(key);
  res.json({ tokens_used: spent.tokens, limit, requests: spent.requests });
});

const port = Number(process.env.PORT) || 3000;
app.listen(port, "0.0.0.0", () => {
  console.log(`LLM gateway listening on port ${port}`);
});
```

Add the scripts to `package.json`:

```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

## 2. Deploy on Railway

1. Push the repository to GitHub, create a new [project](/projects) on Railway, and deploy the repo. Railway detects Node and builds via [Railpack](/builds/railpack). Or skip the repository: `railway init` and `railway up` from the [CLI](/cli) deploy the directory directly.
2. Set two [variables](/variables) on the service: `ANTHROPIC_API_KEY` (the one real provider key) and `GATEWAY_KEYS` (your issued keys and their daily budgets).
3. If only your own services call the gateway, skip the public domain. Services in the same project environment reach it over [private networking](/networking/private-networking) at `http://llm-gateway.railway.internal:3000`. Generate a [public domain](/networking/domains) only if callers live outside the project.

Callers switch from the provider to the gateway by changing the URL and the key:

```bash
curl http://llm-gateway.railway.internal:3000/v1/messages \
  -H "Authorization: Bearer team-a-key" \
  -H "Content-Type: application/json" \
  -d '{"model": "claude-opus-4-8", "max_tokens": 256, "messages": [{"role": "user", "content": "Hello"}]}'
```

## What the in-memory version does not survive

The `Map` resets on every deploy and is per-replica, which means budgets reset when you ship and split when you scale. That is acceptable while you evaluate the pattern and wrong after that. The upgrade is mechanical:

- Move `usage` to [Postgres](/databases/postgresql) (one row per key per day, `UPDATE ... SET tokens = tokens + $1` on each request) or [Redis](/databases/redis) (`INCRBY` with a key that expires at midnight UTC).
- Move `limits` to a table so issuing a key does not require a redeploy.

The handlers do not change shape. Only the two lookups do.

## What to add next

- **Streaming passthrough.** Agents want tokens as they generate. Forward `anthropic.messages.stream` events through [Server-Sent Events](/guides/streaming-ai-responses); count tokens from the final message usage.
- **A second provider.** Add an OpenAI branch keyed on the model prefix. The gateway's callers never change.
- **Dollar budgets.** Multiply token usage by your per-model rates at write time and cap on spend instead of tokens.

## Next steps

- [Deploy an AI API Gateway](/guides/ai-api-proxy): the LiteLLM route, when you want routing and failover without writing code.
- [Stream AI Responses with Server-Sent Events](/guides/streaming-ai-responses): the streaming layer for the gateway.
- [Estimate the Cost of Running AI Agents](/guides/estimate-ai-agent-costs): what the workloads behind the gateway cost to run.
- [Private Networking](/networking/private-networking): keeping the gateway off the public internet.
