---
title: Serve a Multi-Region API with Failover
description: Run one API service across multiple Railway regions with replicas, nearest-region routing, and automatic replica restarts. Covers routing behavior, health checks, and what failover Railway gives you.
date: "2026-07-29"
tags:
  - multi-region
  - replicas
  - scaling
  - architecture
topic: architecture
---

A multi-region API is a single service that runs identical copies (replicas) in more than one geographic region behind one domain. Users are routed to the nearest region, which cuts latency. If a replica crashes, the remaining replicas absorb the load while Railway restarts the failed one, so the service keeps serving traffic.

On Railway you do not run separate services per region or manage a load balancer; you assign replica counts to regions on one service, and Railway handles routing. This guide deploys a small Node.js API to three Railway regions, configures replicas as code, sets up health-checked zero-downtime deploys, and verifies which region served a request.

## How Railway routes multi-region traffic

Railway's edge network uses anycast routing. Every request enters at the edge point of presence (POP) nearest to the user, regardless of where your service is deployed. From there:

- If your service runs in multiple regions, the request is forwarded to the nearest region where it is deployed.
- Within a region, requests are distributed randomly across the replicas in that region.
- Sticky sessions are not supported. Any replica can receive any request.

Railway offers four deployment regions:

| Name | Location | Region identifier |
| --- | --- | --- |
| US West Metal | California, USA | `us-west2` |
| US East Metal | Virginia, USA | `us-east4-eqdc4a` |
| EU West Metal | Amsterdam, Netherlands | `europe-west4-drams3a` |
| Southeast Asia Metal | Singapore | `asia-southeast1-eqsg3a` |

All regions sit behind the same domain. Adding or removing regions requires no DNS changes.

## What failover you get

"Failover" covers several layers. Railway provides some automatically, and your architecture must provide the rest.

**Replica-level failover: automatic.** The default restart policy is `On Failure`. If a replica exits with a non-zero code, Railway restarts only that replica while the other replicas continue handling the workload. With two or more replicas per region, a single crash does not drop traffic.

**Deploy-time failover: automatic with a health check.** When a healthcheck path is configured, Railway routes traffic to a new deployment only after the endpoint returns HTTP 200, so a broken build does not replace a working one. Health checks are HTTP only, and Railway calls the endpoint at deploy time, not continuously after the deployment is live. For continuous uptime monitoring, run an external monitor such as the Uptime Kuma template.

**Database failover: your database's job.** A multi-region API is only as available as its data layer. Railway can convert a PostgreSQL service into a high-availability cluster (Patroni, etcd, HAProxy) that promotes a replica automatically if the primary goes down. See [PostgreSQL HA](/databases/postgresql-ha).

## Step 1: Build a stateless API

Replicas cannot be used with volumes, and any replica can receive any request. Keep all state in a database or in [storage buckets](/storage-buckets), never on local disk or in process memory.

Railway injects two variables into every replica that are useful for logging and debugging:

- `RAILWAY_REPLICA_ID`: a unique ID per replica
- `RAILWAY_REPLICA_REGION`: the region the replica runs in

Create a project:

```bash
mkdir multi-region-api && cd multi-region-api
npm init -y
npm install express@5.1.0
```

Create `server.js`:

```javascript
const express = require("express");

const app = express();
const port = process.env.PORT || 3000;

const region = process.env.RAILWAY_REPLICA_REGION || "local";
const replicaId = process.env.RAILWAY_REPLICA_ID || "local";

// Health endpoint used by Railway's deploy-time healthcheck.
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", region, replicaId });
});

// Example API endpoint. Echoes which replica and region served it.
app.get("/api/whoami", (req, res) => {
  res.json({
    region,
    replicaId,
    edge: req.get("x-railway-edge") || null,
    servedAt: new Date().toISOString(),
  });
});

app.listen(port, () => {
  console.log(`[${region}/${replicaId}] listening on ${port}`);
});
```

Two details matter for multi-region operation:

- Listen on `process.env.PORT`. Railway injects it and uses the same port for health checks.
- Log the region and replica ID. Metrics for a service are aggregated across all replicas, so structured logs are how you tell regions apart.

## Step 2: Configure regions as code

Create a `railway.json` in the repo root:

```json
{
  "$schema": "https://railway.com/railway.schema.json",
  "deploy": {
    "healthcheckPath": "/health",
    "multiRegionConfig": {
      "us-east4-eqdc4a": {
        "numReplicas": 2
      },
      "europe-west4-drams3a": {
        "numReplicas": 2
      },
      "asia-southeast1-eqsg3a": {
        "numReplicas": 2
      }
    },
    "restartPolicyType": "ON_FAILURE"
  }
}
```

This declares six replicas: two each in US East, EU West, and Southeast Asia. Two per region means a crashed replica in any region leaves a healthy one serving local traffic while the restart happens.

You can configure the same thing in the dashboard: open the service settings and use the Regions field in the Scale section. Creating, deleting, or reassigning replicas triggers a staged change. Applying it scales the service without a full redeploy: new replicas start from the existing deployment image, and removed replicas are drained gracefully.

## Step 3: Deploy

Push the repo to GitHub and create a new Railway project from it, or deploy directly with the [CLI](/cli):

```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

That triggers Railpack, which detects the Node.js app and builds it without a Dockerfile. Generate a public domain under the service's Settings, Networking section, or run:

```bash
railway domain
```

The service gets a single `*.up.railway.app` domain that fronts every region.

## Step 4: Verify routing and failover

### Check which region served a request

Send the `X-Railway-Debug` header. Railway adds an `X-Railway-Upstream-Zone` response header identifying the region that served the request:

```bash
curl -sI -H "X-Railway-Debug: 1" https://your-app.up.railway.app/api/whoami | grep -i x-railway
```

You will see something like:

```
x-railway-edge: ams1
x-railway-upstream-zone: railway/europe-west4-drams3a
```

`x-railway-edge` is the POP where the request entered Railway's network. `x-railway-upstream-zone` is the deployment region that served it. The response body from `/api/whoami` also reports the region and replica ID from the replica's own environment.

Test from multiple locations with a tool like globalping.io. Requests from Europe should report the EU West zone, requests from Asia the Southeast Asia zone.

### Watch a replica failover

Add a deliberate crash endpoint while testing (remove it before production):

```javascript
app.get("/api/crash", (req, res) => {
  res.json({ crashing: replicaId });
  setTimeout(() => process.exit(1), 100);
});
```

Hit `/api/crash`, then keep requesting `/api/whoami`. Responses continue from the surviving replica in that region while Railway restarts the crashed one under the `On Failure` policy. The restarted replica rejoins the pool a few moments later.

## Where to put the database

Replicas in every region connect to the same database. Run the database in the region closest to your write-heavy traffic, and reference it over [private networking](/networking/private-networking) at `<service>.railway.internal`, which keeps traffic off the public internet. Any service with a volume attached, including the database, is locked to that one region, and changing it later requires a volume migration with downtime, so plan the database region up front.

That distance still costs you: expect higher latency on database calls from replicas in regions far from the database. Patterns that keep this manageable:

- Cache read-heavy data in each region (an in-memory cache per replica, or a Redis service).
- Keep request handlers to one or two database round trips instead of many sequential queries.
- For database-level failover, convert Postgres to an [HA cluster](/databases/postgresql-ha) so a primary failure promotes a replica automatically.

## Cost of multi-region replicas

Railway bills usage per replica: memory at $10 per GB per month and CPU at $20 per vCPU per month, metered by actual consumption. That means six mostly idle replicas cost little more than one, since billing follows real usage rather than provisioned capacity. Each can also scale up to your plan's full vCPU and memory limits, so total available capacity is the per-replica limit multiplied by the replica count.

The metrics tab shows usage summed across all replicas. Per-replica breakdowns come from your logs via `RAILWAY_REPLICA_ID` and `RAILWAY_REPLICA_REGION`.

## Limitations to design around

- No sticky sessions. Store sessions in a shared database or Redis, or use stateless tokens such as JWTs.
- No volumes on replicated services. Use a database or storage buckets for persistent data. Buckets are locked to the region chosen at creation.
- Health checks run at deploy time only. Add external monitoring for continuous checks.
- Metrics are aggregated across replicas. Use structured logging for per-region visibility.

## Next steps

- [Scaling](/deployments/scaling) covers replica behavior and load balancing in detail.
- [Regions](/deployments/regions) lists region options and what happens when a service changes region.
- [Edge networking](/networking/edge-networking) explains anycast routing and the debug headers used above.
- [Health checks](/deployments/healthchecks) shows how to guarantee zero-downtime deploys.
