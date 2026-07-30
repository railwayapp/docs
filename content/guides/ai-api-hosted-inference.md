---
title: Build an AI API on Hosted Inference Providers
description: Build and deploy an AI API on Railway that calls hosted inference providers for model output. Covers provider selection, OpenAI-compatible endpoints, streaming, timeouts, and provider fallback.
date: "2026-07-29"
tags:
  - ai
  - api
  - inference
  - typescript
topic: ai
---

An AI API is an HTTP service you own that takes requests from your users, calls a hosted inference provider to run the model, and returns the result. Your service handles authentication, prompts, validation, and response shaping. The provider handles the GPUs.

This split matters because Railway does not offer GPU instances. You cannot run model inference locally on a Railway service, and you should not try to serve even small models on CPU. Instead, the pattern that works is: Railway runs your API on CPU, and inference happens over HTTPS on a provider's infrastructure. This is also how most production AI products are built, regardless of host, because managing GPU capacity is its own job.

This guide builds that pattern: a small AI API in TypeScript, deployed on Railway. It also covers the operational details: which provider to use, how to stream long generations within Railway's request limits, and how to fail over when a provider has an outage.

## Which inference provider should you use?

Hosted inference providers fall into two groups.

**Proprietary model providers.** OpenAI and Anthropic serve their own models behind their own APIs. You pick these for model quality and capabilities, not price.

**Open-weights model hosts.** Together AI, Groq, Fireworks AI, and similar providers serve open-weights models (Llama, Mistral, Qwen, DeepSeek, and others) behind hosted APIs. You pick these for cost, speed, or a specific open model. If you were considering self-hosting a model, this is the alternative: the same open weights, served by someone with GPUs, billed per token.

Most open-weights hosts, and OpenAI itself, expose the OpenAI chat completions API shape. That means one SDK and one code path can target many providers by changing a base URL and a model name. The API below is written this way on purpose.

## Build the API

The service exposes one endpoint, `POST /v1/summarize`, which takes text and returns a summary. It is a deliberately small surface: your API should expose your product's operations, not a raw passthrough to the provider. If you want a general-purpose passthrough with key management and routing, build or deploy a gateway instead: see [Build an LLM Gateway in TypeScript](/guides/llm-gateway).

Create the project:

```bash
mkdir ai-api && cd ai-api
npm init -y
npm install express openai
npm install --save-dev typescript @types/express @types/node
```

Create `src/server.ts`:

```typescript
import express from "express";
import OpenAI from "openai";

type Provider = {
  name: string;
  client: OpenAI;
  model: string;
};

function buildProviders(): Provider[] {
  const providers: Provider[] = [];

  if (process.env.OPENAI_API_KEY) {
    providers.push({
      name: "openai",
      client: new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        timeout: 60_000,
        maxRetries: 2,
      }),
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
    });
  }

  if (process.env.FALLBACK_API_KEY && process.env.FALLBACK_BASE_URL) {
    providers.push({
      name: "fallback",
      client: new OpenAI({
        apiKey: process.env.FALLBACK_API_KEY,
        baseURL: process.env.FALLBACK_BASE_URL,
        timeout: 60_000,
        maxRetries: 2,
      }),
      model: process.env.FALLBACK_MODEL ?? "meta-llama/Llama-3.3-70B-Instruct-Turbo",
    });
  }

  if (providers.length === 0) {
    throw new Error("No inference provider configured. Set OPENAI_API_KEY.");
  }
  return providers;
}

const providers = buildProviders();
const app = express();
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.post("/v1/summarize", async (req, res) => {
  const text: unknown = req.body?.text;
  if (typeof text !== "string" || text.length === 0) {
    res.status(400).json({ error: "Body must include a non-empty 'text' string." });
    return;
  }
  if (text.length > 100_000) {
    res.status(400).json({ error: "Text exceeds the 100,000 character limit." });
    return;
  }

  const stream = req.body?.stream === true;
  let lastError: unknown = null;

  for (const provider of providers) {
    try {
      if (stream) {
        const completion = await provider.client.chat.completions.create({
          model: provider.model,
          stream: true,
          messages: [
            { role: "system", content: "Summarize the user's text in 3 to 5 sentences." },
            { role: "user", content: text },
          ],
        });

        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.flushHeaders();

        for await (const chunk of completion) {
          const delta = chunk.choices[0]?.delta?.content;
          if (delta) {
            res.write(`data: ${JSON.stringify({ text: delta })}\n\n`);
          }
        }
        res.write("data: [DONE]\n\n");
        res.end();
        return;
      }

      const completion = await provider.client.chat.completions.create({
        model: provider.model,
        messages: [
          { role: "system", content: "Summarize the user's text in 3 to 5 sentences." },
          { role: "user", content: text },
        ],
      });

      res.json({
        provider: provider.name,
        model: provider.model,
        summary: completion.choices[0]?.message?.content ?? "",
      });
      return;
    } catch (err) {
      lastError = err;
      console.error(`Provider ${provider.name} failed:`, err);
      if (res.headersSent) {
        // A stream already started; we cannot switch providers mid-response.
        res.end();
        return;
      }
    }
  }

  console.error("All providers failed:", lastError);
  res.status(502).json({ error: "All inference providers failed. Try again shortly." });
});

const port = Number(process.env.PORT ?? 3000);
app.listen(port, () => {
  console.log(`AI API listening on port ${port}`);
});
```

Add a `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

And set the scripts in `package.json`:

```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/server.js"
  }
}
```

Three design points:

- **The provider list is ordered.** The first configured provider is primary; the second is a fallback that only handles a request when the primary throws. The fallback targets any OpenAI-compatible base URL, so it can be an open-weights host serving a comparable model.
- **The SDK retries transient failures.** `maxRetries: 2` handles rate limits and momentary errors before the request ever falls through to the next provider.
- **Fallback cannot happen mid-stream.** Once you have written response headers, the request is committed to one provider. Failover only applies before the first byte.

## Deploy on Railway

Create a project and deploy from your repository, or use the CLI:

```bash
railway init
railway up
```

Railway detects the Node app, runs `npm run build`, and starts it with `npm start`. The service reads `PORT` from the environment, which Railway injects automatically.

Set your provider keys as service variables in the Railway dashboard, or with the CLI:

```bash
railway variables --set "OPENAI_API_KEY=sk-..." \
  --set "FALLBACK_API_KEY=..." \
  --set "FALLBACK_BASE_URL=https://api.together.xyz/v1"
```

Keys live in Railway [variables](/variables), not in code or in the repository.

Then configure two things in service settings:

1. **Healthcheck path**: set it to `/health`. Railway waits for the healthcheck to pass before routing traffic to a new deploy, which gives you [zero-downtime deployments](/deployments/healthchecks).
2. **Public networking**: generate a domain. Your API is served at `https://<service>.up.railway.app`.

If only other services in your project call this API, skip the public domain and use [private networking](/networking/private-networking) instead: services in the same environment reach it at `http://<service>.railway.internal:<PORT>` with no egress cost.

## Handle long generations

Railway closes an HTTP request after 5 minutes with no data transferred. Requests that keep transferring data can run up to 15 minutes. See [specs and limits](/networking/public-networking/specs-and-limits).

For an AI API this has one practical consequence: a long generation behind a non-streaming endpoint transfers nothing until the model finishes, so a slow request can hit the 5-minute idle cutoff. Streaming fixes this, because tokens flow as they are generated and the connection never goes idle. The `stream: true` path in the code above does this with Server-Sent Events. For frontend consumption patterns, see [Stream AI Responses to a Frontend with Server-Sent Events](/guides/streaming-ai-responses).

For jobs that run longer than 15 minutes (batch summarization, document pipelines), do not hold the HTTP request open at all. Accept the job, return an ID, process in a background worker, and let the client poll or receive a webhook. The worker pattern is covered in [Deploy an AI Agent with Async Workers](/guides/ai-agent-workers).

## What this costs

You pay two bills. The first is Railway's: compute for the API service (RAM at $10/GB-month, CPU at $20/vCPU-month, prorated by the minute) plus $0.05/GB egress, which includes the responses you send to clients. The second is the inference provider's, billed per token. For a typical AI API this second bill dominates: the Railway service is a thin I/O-bound process that idles at low CPU while waiting on provider responses, so it runs cheaply even under real traffic.

If your API has quiet periods, enable [serverless](/deployments/serverless) on the service. Railway puts the service to sleep after 10 minutes without outbound traffic and wakes it on the next request. Outbound traffic includes database connections and telemetry, which will keep a service awake.

## Common mistakes

**Trying to run the model on Railway.** There are no GPUs, and CPU inference for anything beyond trivial models is too slow to serve requests. If you want an open-weights model, use a hosted provider that serves it.

**Passing provider keys to the client.** The browser or mobile app should call your API, never the provider directly. Your API is where keys stay secret and where you enforce per-user limits.

**No timeout on provider calls.** A hung provider connection holds your request open and ties up capacity. The 60-second SDK timeout in the code above turns a hang into a fast failover.

**One provider, no fallback.** Provider outages happen. With OpenAI-compatible hosts, adding a fallback takes a base URL and a model name.

## Next steps

- [Stream AI Responses to a Frontend with Server-Sent Events](/guides/streaming-ai-responses)
- [Build an LLM Gateway in TypeScript](/guides/llm-gateway)
- [Deploy an AI Agent with Async Workers](/guides/ai-agent-workers)
- [Deploy an AI-Powered SaaS App on Railway](/guides/deploy-ai-saas)
