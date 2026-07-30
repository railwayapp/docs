---
title: Autoscale a Service Horizontally Based on Load
description: Build an autoscaler on Railway that measures load in your application and adjusts replica counts through the Public API, the CLI, or a cron schedule.
date: "2026-07-29"
tags:
  - autoscaling
  - replicas
  - scaling
  - api
topic: infrastructure
---

Horizontal scaling means running more copies of your service and spreading traffic across them. On Railway those copies are called replicas. This guide builds an autoscaler: a small Node service that measures load in your application and adjusts the replica count through Railway's Public API.

Railway scales each container vertically on its own, growing CPU and memory toward your plan limits as demand rises. Instead, the replica count is a setting you control, and by default it stays where you set it. So Railway exposes it through the Public API and the CLI, letting an autoscaler change it in response to load without touching the dashboard.

If you are deciding between vertical and horizontal scaling, or you want to read metrics to find your bottleneck, start with [Scaling your application](/guides/scaling-your-application). This guide assumes you already know you want more replicas under load and fewer when things are quiet.

## How replicas behave on Railway

Before automating anything, know what a replica change does:

- Each replica is a full copy of your service with access to the full resources of your plan. Two replicas on a plan with 24 vCPU and 24 GB RAM limits can use up to 48 vCPU and 48 GB RAM combined.
- Within a single region, Railway distributes public traffic randomly across replicas. With multi-region replicas, traffic routes to the nearest region first, then randomly within it.
- Replica changes do not rebuild your app. New replicas start from the existing deployment image, and removed replicas are drained gracefully.
- There are no sticky sessions. Any request can land on any replica, so your service must be stateless: keep sessions in a database or cache, not in process memory.
- The metrics tab sums usage across all replicas. Two replicas each using 100 MB show as 200 MB.
- Railway supports a maximum of 50 total replicas across all regions.
- Every replica gets a `RAILWAY_REPLICA_ID` environment variable you can include in logs to tell instances apart.

Full details are in the [scaling reference](/deployments/scaling).

## Prerequisites

1. A stateless target service deployed on Railway.
2. A [healthcheck](/deployments/healthchecks) configured on the target service. Healthchecks guarantee zero-downtime deployments, and they matter more once traffic is spread across instances that come and go.
3. A Railway API token. A project token scoped to the target environment is the safest choice for automation. Create one from the tokens page in your project settings. Note that project tokens authenticate with the `Project-Access-Token` header, not the `Authorization: Bearer` header used by account and workspace tokens. See the [Public API docs](/integrations/api) for token types.
4. The target service ID and environment ID. Both appear in the dashboard URL when you open the service, or you can query them through the API.

## Pick a load signal

Railway does not expose per-replica utilization through the Public API, so the most reliable load signal comes from inside your application. Good candidates:

- **In-flight requests**: how many requests the process is handling right now. Simple and directly tied to capacity.
- **Queue depth**: for workers, the number of jobs waiting in your queue.
- **p95 latency**: measured by your own middleware or an external probe.

This guide uses in-flight requests. Add a counter and a small endpoint to the target service. For an Express app:

```bash
npm install express
```

```javascript
// server.js (target service)
const express = require("express");

const app = express();
let inflight = 0;

app.use((req, res, next) => {
  inflight++;
  res.once("close", () => {
    inflight--;
  });
  next();
});

app.get("/load", (req, res) => {
  res.json({ inflight, replicaId: process.env.RAILWAY_REPLICA_ID ?? null });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/", (req, res) => {
  res.send("hello");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
```

Railway distributes requests randomly across replicas, so each call to `/load` samples a single replica. The autoscaler below takes several samples and averages them, treating the result as per-replica load.

If your load endpoint should not be public, put it on a separate port and reach it over [private networking](/networking/private-networking) at `<service>.railway.internal`. Private networking is scoped per environment, so run the autoscaler in the same environment as the target.

## Build the autoscaler

The autoscaler is a small Node service with no dependencies beyond the runtime (Node 18 or later ships `fetch`). It loops forever: sample load, compute a desired replica count, clamp it, and apply it through the Public API.

The core mutation is `serviceInstanceUpdate` with `numReplicas`:

```graphql
mutation ($serviceId: String!, $environmentId: String!, $input: ServiceInstanceUpdateInput!) {
  serviceInstanceUpdate(serviceId: $serviceId, environmentId: $environmentId, input: $input)
}
```

Here is the complete autoscaler:

```javascript
// autoscaler.js
const API = "https://backboard.railway.com/graphql/v2";

const {
  RAILWAY_API_TOKEN,
  TARGET_SERVICE_ID,
  TARGET_ENVIRONMENT_ID,
  TARGET_LOAD_URL, // e.g. https://myapp.up.railway.app/load
} = process.env;

for (const [name, value] of Object.entries({
  RAILWAY_API_TOKEN,
  TARGET_SERVICE_ID,
  TARGET_ENVIRONMENT_ID,
  TARGET_LOAD_URL,
})) {
  if (!value) throw new Error(`Missing required env var: ${name}`);
}

// Tuning knobs
const TARGET_INFLIGHT_PER_REPLICA = 25; // scale to keep each replica near this
const MIN_REPLICAS = 1;
const MAX_REPLICAS = 10;
const POLL_INTERVAL_MS = 60_000; // evaluate once per minute
const SCALE_DOWN_COOLDOWN_MS = 5 * 60_000; // wait 5 min between scale-downs
const SAMPLES = 5; // load samples per evaluation

async function gql(query, variables) {
  const res = await fetch(API, {
    method: "POST",
    headers: {
      // Project tokens use this header. For an account or workspace
      // token, use `Authorization: Bearer <token>` instead.
      "Project-Access-Token": RAILWAY_API_TOKEN,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`API returned ${res.status}`);
  const { data, errors } = await res.json();
  if (errors) throw new Error(JSON.stringify(errors));
  return data;
}

async function getReplicas() {
  const data = await gql(
    `query ($serviceId: String!, $environmentId: String!) {
      serviceInstance(serviceId: $serviceId, environmentId: $environmentId) {
        numReplicas
      }
    }`,
    { serviceId: TARGET_SERVICE_ID, environmentId: TARGET_ENVIRONMENT_ID }
  );
  return data.serviceInstance.numReplicas ?? 1;
}

async function setReplicas(numReplicas) {
  await gql(
    `mutation ($serviceId: String!, $environmentId: String!, $input: ServiceInstanceUpdateInput!) {
      serviceInstanceUpdate(serviceId: $serviceId, environmentId: $environmentId, input: $input)
    }`,
    {
      serviceId: TARGET_SERVICE_ID,
      environmentId: TARGET_ENVIRONMENT_ID,
      input: { numReplicas },
    }
  );
}

// Each request to /load lands on one random replica, so average
// several samples to estimate per-replica load.
async function sampleLoad() {
  const samples = [];
  for (let i = 0; i < SAMPLES; i++) {
    try {
      const res = await fetch(TARGET_LOAD_URL);
      const { inflight } = await res.json();
      samples.push(inflight);
    } catch (err) {
      console.error("load sample failed:", err.message);
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  if (samples.length === 0) return null;
  return samples.reduce((a, b) => a + b, 0) / samples.length;
}

function clamp(n) {
  return Math.max(MIN_REPLICAS, Math.min(MAX_REPLICAS, n));
}

let lastScaleDownAt = 0;

async function evaluate() {
  const current = await getReplicas();
  const perReplicaLoad = await sampleLoad();
  if (perReplicaLoad === null) {
    console.warn("no load samples, skipping this cycle");
    return;
  }

  // If each replica is above target, we need proportionally more replicas.
  const desired = clamp(
    Math.ceil((perReplicaLoad / TARGET_INFLIGHT_PER_REPLICA) * current)
  );

  console.log(
    `replicas=${current} perReplicaLoad=${perReplicaLoad.toFixed(1)} desired=${desired}`
  );

  if (desired > current) {
    // Scale up immediately.
    console.log(`scaling up: ${current} -> ${desired}`);
    await setReplicas(desired);
  } else if (desired < current) {
    // Scale down slowly: one step at a time, with a cooldown.
    const now = Date.now();
    if (now - lastScaleDownAt < SCALE_DOWN_COOLDOWN_MS) {
      console.log("scale-down suppressed by cooldown");
      return;
    }
    const next = current - 1;
    console.log(`scaling down: ${current} -> ${next}`);
    await setReplicas(next);
    lastScaleDownAt = now;
  }
}

async function main() {
  console.log("autoscaler started");
  while (true) {
    try {
      await evaluate();
    } catch (err) {
      console.error("evaluation failed:", err.message);
    }
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
  }
}

main();
```

Three design choices are worth calling out:

- **Scale up fast, scale down slow.** Scaling up is cheap and fixes a real problem. Scaling down too eagerly causes flapping, where replicas are added and removed in a loop. The cooldown and one-step-down rule prevent that.
- **Clamp everything.** `MIN_REPLICAS` keeps you serving traffic even if the load signal breaks. `MAX_REPLICAS` caps cost if traffic spikes beyond what you planned for.
- **Fail safe.** If sampling fails, the autoscaler skips the cycle rather than scaling on bad data.

## Deploy the autoscaler on Railway

Run the autoscaler as its own service in the same project:

1. Create a new service from the repo containing `autoscaler.js`, with `node autoscaler.js` as the start command.
2. Set the environment variables: `RAILWAY_API_TOKEN`, `TARGET_SERVICE_ID`, `TARGET_ENVIRONMENT_ID`, and `TARGET_LOAD_URL`.
3. Do not add a public domain. The autoscaler makes only outbound requests.

It is a long-running worker, so leave serverless off. Its steady outbound polling would prevent sleep anyway.

Note that `numReplicas` sets the replica count for the service's configured region. If you assign replicas across multiple regions, manage the per-region counts with the dashboard or the `railway scale` CLI command instead.

## Alternative: scale on a schedule with cron

If your load is predictable, for example high during business hours and near zero overnight, you do not need a feedback loop. Deploy two [cron jobs](/cron-jobs) that call `setReplicas` with fixed values:

```javascript
// scale-up.js: run at 08:00 UTC with numReplicas = 5
// scale-down.js: run at 20:00 UTC with numReplicas = 1
```

Keep the cron constraints in mind: schedules run in UTC, the minimum interval between runs is 5 minutes, the process must exit when its work is done, and if a previous run is still going when the next is due, the new run is skipped. A scale mutation takes seconds, so none of these constraints bite in practice.

## Alternative: scale from the CLI or CI

For one-off or scripted scaling, the CLI wraps the same flow:

```bash
# Scale to 3 replicas in a region
railway scale us-east=3

# Scale across regions
railway scale us-east=2 eu-west=2

# Remove all replicas from a region
railway scale eu-west=0
```

`railway scale` commits the change as a single environment patch without a separate redeploy. See the [railway scale reference](/cli/scale) for all options.

## Verify it works

Generate load against the target service and watch the autoscaler logs. You should see `desired` climb once per-replica in-flight requests exceed your target, followed by a scale-up. In the target service's metrics tab, per-replica CPU pressure drops as replicas come online. When load stops, replicas step back down one at a time on the cooldown interval.

Two things to check if scaling seems ineffective:

- If memory is the bottleneck, replicas will not help. Every replica has the same memory ceiling. Scale vertically instead. The [rightsizing section of the scaling guide](/guides/scaling-your-application) covers how to tell which case you are in.
- If your app stores sessions or caches in process memory, users will see inconsistent behavior across replicas. Move that state to a shared database or cache first.

## Next steps

- [Scaling reference](/deployments/scaling): replica behavior, load balancing, and multi-region replicas
- [Scaling your application](/guides/scaling-your-application): vertical vs. horizontal scaling and reading metrics
- [Public API](/integrations/api): tokens, the GraphQL endpoint, and more mutations
- [Healthchecks](/deployments/healthchecks): required for zero-downtime deploys as replicas cycle
