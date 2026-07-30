---
title: Estimate the Cost of Running AI Agents
description: What an always-on AI agent costs to run. How to calculate LLM API spend per run, what the hosting compute actually costs on Railway's usage-based pricing, and where the money goes as you scale.
date: "2026-07-29"
tags:
  - agents
  - cost
  - pricing
  - ai
topic: ai
---

An AI agent generates two bills: the LLM provider's bill for tokens, and the hosting bill for the compute the agent runs on. For most agents the token bill dominates, often by an order of magnitude, so estimate it first and estimate it per run. The hosting bill is smaller and easier to predict, but it is the one you control by architecture.

In this guide we build the estimate for both, with Railway's actual rates for the hosting half.

## The token bill

The cost of one agent run is:

```txt
cost per run = LLM calls per run × (input tokens × input rate + output tokens × output rate)
```

Agents multiply tokens in two ways that simple chat does not. Each reasoning step is a separate LLM call, and each call re-sends the accumulated context, so input tokens grow with every step. A 10-step agent run does not cost 10× a single call; it costs more, because step 10 carries the transcript of steps 1 through 9.

A worked example, using $3 per million input tokens and $15 per million output tokens (example rates; check your provider's current pricing):

- 10 calls per run, context growing from 2K to 20K input tokens, averaging 11K
- 500 output tokens per call
- Input: 10 × 11,000 × $3/M = $0.33
- Output: 10 × 500 × $15/M = $0.075
- **≈ $0.40 per run.** At 500 runs a day, about $200 a day, or $6,000 a month.

That number is why token spend deserves caps before it deserves optimization. An [LLM gateway](/guides/llm-gateway) that enforces per-key daily budgets turns a runaway agent from a bill into a 429.

## The hosting bill

Railway bills compute by [usage](/pricing/plans): $10 per GB of RAM per month and $20 per vCPU per month, metered per minute, plus $0.05 per GB of network egress. You are charged for what the service actually consumes, not what it could consume.

This matters for agents specifically, because an agent worker's profile is spiky: it holds memory constantly but burns CPU only while a run is active. The RAM line is usually the bigger one.

A typical always-on agent worker:

- 300 MB resident memory: 0.3 GB × $10 = $3.00/month
- Averaging 0.05 vCPU across idle and active periods: 0.05 × $20 = $1.00/month
- **≈ $4 a month** to keep one worker alive around the clock.

The supporting cast, at the same rates:

- A small API service in front: another $3 to $5 a month.
- [Postgres](/databases/postgresql) for run state: its own service consuming RAM and CPU, plus [volume storage](/volumes) at $0.15 per GB-month.
- Artifacts in a [storage bucket](/storage-buckets): $0.015 per GB-month, with free egress and free API operations. Storing a thousand 1 MB reports costs about a cent and a half a month.

A complete agent stack (API, worker, Postgres, Redis, bucket) commonly lands in the $10 to $30 a month range while the [Hobby plan includes $5](/pricing/plans) and the Pro plan includes $20 of usage in the subscription.

## Where the estimate goes wrong

Three things break naive estimates, all in the same direction:

- **Concurrency.** One worker at $4 a month becomes ten replicas at $40 when you [scale horizontally](/deployments/scaling). Worker replicas scale with queue depth, and queue depth scales with success. Estimate at target load, not launch load.
- **Context bloat.** Agents accumulate tools, system prompts, and memory files. The per-run input token count drifts up over months. Re-measure it; do not trust the number from the design doc.
- **Retries.** Failed runs that retry pay full token price for each attempt. A 10% failure rate with 3 retries adds roughly 30% to the token bill.

## Cutting the idle cost

If your agent is bursty rather than always-listening, [Serverless](/deployments/serverless) puts the service to sleep after 10 minutes without outbound traffic and wakes it on the next request, so a nightly agent does not pay for a day of idling. Note the trigger is *outbound* traffic: a worker holding open a database connection or polling a queue never goes idle by this definition, so serverless fits request-driven agents, not queue-pollers.

For everything else, the levers are the standard ones: [cost controls](/pricing/cost-control) with usage limits and alerts at the workspace level, response caching in front of the LLM, and pruning context before it snowballs.

## A worksheet

For a monthly estimate, fill in six numbers:

```txt
runs per day × cost per run × 30            = token bill
worker GB × $10 + worker avg vCPU × $20     = per-worker compute
  × replica count                            = worker bill
+ API/database services (measure, ~$5-15)   = base services
+ artifact GB × $0.015 + volume GB × $0.15  = storage
+ egress GB × $0.05                          = egress
```

Run the agent for a week, read the real numbers from the [usage page](/pricing/understanding-your-bill) and your provider dashboard, and replace the estimate. The measured number is the estimate that matters.

## Next steps

- [Build an LLM Gateway](/guides/llm-gateway): per-key budgets that cap the token bill before the invoice does.
- [Cost Controls](/pricing/cost-control): usage limits, alerts, and serverless configuration.
- [Deploy an AI Agent with Async Workers](/guides/ai-agent-workers): the architecture these numbers describe.
- [Understanding Your Bill](/pricing/understanding-your-bill): reading actual usage per service.
