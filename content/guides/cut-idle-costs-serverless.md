---
title: Cut Idle Costs with Serverless Mode
description: Enable Serverless on Railway to sleep idle services and stop paying for compute they do not use. Covers the outbound-traffic sleep trigger and the cold boot tradeoff.
date: "2026-07-29"
tags:
  - serverless
  - cost optimization
  - scaling
  - pricing
topic: infrastructure
---

Railway bills by usage: RAM at $10 per GB per month and CPU at $20 per vCPU per month, metered by the minute. A service that runs 24/7 but only handles traffic a few hours a day still pays for every idle minute. Serverless mode fixes this by putting inactive services to sleep and waking them on the next request.

Serverless is a per-service toggle. When enabled, Railway watches the service for activity and stops it after 10 minutes of inactivity. A slept service accrues no compute charges. Its first request wakes it back up, and that wake-up cycle is what this guide covers: how the sleep trigger works, which workloads benefit, and how to write your application so it can sleep.

## How the sleep trigger works

Railway detects inactivity based on **outbound** traffic, not inbound requests. Most surprises with Serverless trace back to this detail.

If your service sends no outbound packets for 10 minutes, it is considered inactive and goes to sleep. Outbound packets include more than API responses:

- Open database connections (connection poolers keep sockets alive)
- Framework telemetry, such as Next.js phoning home
- Polling a queue, a webhook endpoint, or any external API
- Requests to other services in your project over the [private network](/networking/private-networking)
- NTP and other background network chatter

Any of these resets the 10-minute timer, so a worker that holds a persistent Postgres connection or polls a queue every 30 seconds never sleeps, even if it receives zero requests. Enabling Serverless on it changes nothing except adding cold boot risk.

One caveat: the networking graph in the metrics tab only shows public internet traffic. Private network traffic does not appear there, but it still counts as outbound and still prevents sleep. If a service refuses to sleep and the metrics graph looks quiet, look at private network calls first.

## The cold boot tradeoff

Waking is not free. When a request hits a slept service:

- The first response is delayed while the container spins up (cold boot time).
- The first request may return a 502 Bad Gateway before the service is ready. Clients should retry.
- Slept services are de-prioritized on Railway's infrastructure. In rare cases a wake requires a rebuild.

Serverless also applies across all [replicas](/deployments/scaling) of the service. You cannot keep one replica warm and sleep the rest.

## Which workloads fit

Good fits are request-driven services with real idle gaps:

- Staging and preview environments that only see traffic during work hours
- Internal dashboards and admin tools
- Low-traffic APIs, demos, and side projects
- Webhook receivers that fire a few times a day

Bad fits:

- Anything latency-sensitive on the first request (checkout flows, health-checked production APIs)
- Workers that hold database connections or poll queues (they never sleep anyway)
- Websocket servers with long-lived clients
- Databases

For scheduled work, [cron jobs](/cron-jobs) are usually a better model than a sleeping service: the service starts on a crontab schedule, runs its task, and exits. Note that Railway cron schedules run in UTC, the minimum interval is 5 minutes, and if a previous run is still active the next run is skipped, never terminated.

## Enable Serverless

1. Open your service and go to Settings > Deploy > Serverless.
2. Toggle "Enable Serverless".
3. Toggle it again to disable.

Full details are in [cost controls](/pricing/cost-control#enabling-serverless).

## Make your app sleep-friendly

Enabling the toggle is not enough if your code emits background traffic. Two changes cover most cases.

### Close idle database connections

A pooled connection that stays open counts as outbound activity. Configure your pool to release idle connections quickly and to let the process go quiet between requests. With `node-postgres`:

```bash
npm install express pg
```

```js
const express = require("express");
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Close connections after 10 seconds of inactivity so the
  // service stops emitting keepalive traffic between requests.
  idleTimeoutMillis: 10_000,
  // Allow the pool to drop to zero connections when idle.
  allowExitOnIdle: true,
});

const app = express();

app.get("/users/:id", async (req, res) => {
  // Connections are created lazily on first query, so a slept
  // service reconnects cleanly after waking.
  const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
    req.params.id,
  ]);
  if (rows.length === 0) {
    return res.status(404).json({ error: "not found" });
  }
  res.json(rows[0]);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
```

The pool creates connections on demand and closes them after 10 seconds idle. Between requests the service emits nothing, so the 10-minute sleep timer can run down.

### Disable framework telemetry

Frameworks that report telemetry generate periodic outbound requests. For Next.js, set this in your service variables:

```bash
NEXT_TELEMETRY_DISABLED=1
```

Check any SDKs you use (error trackers, analytics, feature flag clients) for background polling or heartbeat behavior. An error tracker that flushes on an interval, for instance, will keep the service awake.

## Estimate the savings

The math is direct. A service using 0.5 GB RAM and 0.25 vCPU costs about $10 per month running 24/7 (0.5 x $10 + 0.25 x $20). If it is only active 8 hours a day on weekdays, that is roughly 24% of the month, so the same service costs about $2.40 with Serverless enabled. Across five staging environments and internal tools at that profile, that is $50 a month down to about $12.

Egress is billed separately at $0.05 per GB either way; Serverless only affects compute charges.

## Next steps

- [Serverless reference](/deployments/serverless): full behavior details and caveats
- [Cost controls](/pricing/cost-control): usage limits, alerts, and resource caps
- [Scaling your application](/guides/scaling-your-application): vertical and horizontal scaling on Railway
- [Cron jobs](/cron-jobs): run scheduled tasks without an always-on service
