---
title: Run ClickHouse for Product Analytics
description: Deploy ClickHouse on Railway from the template or the official Docker image, size its volume for event data, and ingest and query analytics events from a Node.js service.
date: "2026-07-29"
tags:
  - clickhouse
  - analytics
  - databases
  - volumes
topic: integrations
---

ClickHouse is a columnar OLAP database built for analytics. It stores each column separately, compresses aggressively, and scans billions of rows per second on modest hardware. That fits product analytics: you ingest events at high volume and aggregate across all of them cheaply. This guide deploys ClickHouse on Railway, sizes its volume for that event data, and connects a Node.js service that writes and reads those events over private networking.

## Deploy from the template

The fastest path is the [ClickHouse template](https://railway.com/deploy/clickhouse):

1. Open the template page and click **Deploy Now**.
2. Railway creates a project with a ClickHouse service, an attached volume, and generated credentials.
3. Once the deployment is live, the service's **Variables** tab holds the connection details.

The template gives you a single ClickHouse server. That is the right shape for product analytics at most scales; a single node handles billions of rows before you need anything more complicated.

## Deploy from the Docker image

If you want full control over configuration, deploy the official image directly:

1. In your project, create a new service and choose **Docker Image** as the source.
2. Enter `clickhouse/clickhouse-server` (optionally pin a version, for example `clickhouse/clickhouse-server:24.8`).
3. Set these variables on the service before the first deploy:

```bash
CLICKHOUSE_DB=analytics
CLICKHOUSE_USER=analytics_user
CLICKHOUSE_PASSWORD=<generate a strong password>
```

4. Attach a volume to the service (right-click the canvas or use the command palette) and set the mount path to `/var/lib/clickhouse`. Without a volume, all data is lost on every redeploy.

The official image listens on all interfaces by default, so it works with Railway's private networking without extra configuration. It exposes two ports that matter here:

- **8123**: the HTTP interface, used by the official language clients.
- **9000**: the native TCP protocol, used by `clickhouse-client` and some drivers.

## Connect over private networking

Services in the same project environment reach each other at `SERVICE_NAME.railway.internal`. That private network is scoped per environment, carries no egress cost, and never exposes traffic to the public internet.

If your ClickHouse service is named `clickhouse`, your application connects to:

```
http://clickhouse.railway.internal:8123
```

Set the connection details as variables on your application service, referencing the ClickHouse service:

```bash
CLICKHOUSE_URL=http://clickhouse.railway.internal:8123
CLICKHOUSE_USER=${{clickhouse.CLICKHOUSE_USER}}
CLICKHOUSE_PASSWORD=${{clickhouse.CLICKHOUSE_PASSWORD}}
CLICKHOUSE_DB=${{clickhouse.CLICKHOUSE_DB}}
```

Keep ClickHouse off the public internet. If you need external access, for example from a BI tool or a local `clickhouse-client`, enable [TCP Proxy](/networking/tcp-proxy) on port 9000 in the service's networking settings. Railway generates a public `domain:port` pair that proxies to the service.

## Size the volume

Volume sizing for analytics comes down to three numbers: events per day, bytes per event on disk, and retention.

ClickHouse compresses columnar event data well: a typical product analytics event (timestamp, user ID, event name, a handful of properties) that weighs 150 to 300 bytes as JSON usually lands at 20 to 60 bytes on disk after compression. Ratios of 5x to 10x are common for this workload.

A worked example:

- 10 million events per day at roughly 200 bytes raw is about 2 GB per day of raw data.
- At 7x compression, that is roughly 300 MB per day on disk.
- With 90-day retention, steady state is around 27 GB. Add headroom for merges and growth and provision 50 GB.

Railway volumes cost $0.15 per GB per month, and you are only charged for the storage your volume actually uses, so a 50 GB volume holding 27 GB of data bills for the 27 GB. Two operational details matter:

- Volumes can be grown on paid plans, including live resizes with zero downtime. Resizing increases capacity only, so start modest and grow when usage crosses 70 to 80 percent.
- A new volume reserves roughly 2 to 3 percent of its capacity for filesystem metadata, so it never starts at zero used.

Enforce retention inside ClickHouse with a `TTL` clause rather than manual deletes. The schema below drops rows automatically after 90 days, which keeps volume growth flat once you reach steady state.

Memory matters more than CPU for ClickHouse: aggregation queries hold intermediate state in RAM, and Railway bills memory at $10 per GB per month on usage-based pricing. Give the service enough headroom for your largest `GROUP BY`; if queries fail with memory-limit errors, raise the service's limits in settings.

## Create the events table

Connect with any ClickHouse client and create a MergeTree table. This schema covers the standard product analytics shape:

```sql
CREATE TABLE analytics.events
(
    event_time  DateTime,
    event_name  LowCardinality(String),
    user_id     String,
    session_id  String,
    properties  String
)
ENGINE = MergeTree
PARTITION BY toYYYYMM(event_time)
ORDER BY (event_name, user_id, event_time)
TTL event_time + INTERVAL 90 DAY;
```

Design notes:

- `ORDER BY` is the primary index. Leading with `event_name` makes per-event aggregations fast, and those are the queries dashboards run most.
- `LowCardinality(String)` is the right type for event names, which repeat constantly.
- `PARTITION BY` month keeps TTL drops cheap: expired partitions are removed wholesale.
- `properties` holds arbitrary JSON as a string. Extract fields at query time with `JSONExtractString(properties, 'key')`.

## Ingest and query from Node.js

Install the official client:

```bash
npm install @clickhouse/client
```

The example below inserts a batch of events and runs a daily-active-users query. ClickHouse strongly prefers batched inserts: buffer events in your application and flush every few seconds or every few thousand events rather than inserting one row at a time.

```typescript
import { createClient } from "@clickhouse/client";

const clickhouse = createClient({
  url: process.env.CLICKHOUSE_URL ?? "http://clickhouse.railway.internal:8123",
  username: process.env.CLICKHOUSE_USER ?? "analytics_user",
  password: process.env.CLICKHOUSE_PASSWORD ?? "",
  database: process.env.CLICKHOUSE_DB ?? "analytics",
});

interface AnalyticsEvent {
  event_time: string;
  event_name: string;
  user_id: string;
  session_id: string;
  properties: string;
}

export async function trackEvents(events: AnalyticsEvent[]): Promise<void> {
  await clickhouse.insert({
    table: "events",
    values: events,
    format: "JSONEachRow",
  });
}

interface DauRow {
  day: string;
  daily_active_users: string;
}

export async function dailyActiveUsers(days: number): Promise<DauRow[]> {
  const result = await clickhouse.query({
    query: `
      SELECT
        toDate(event_time) AS day,
        uniqExact(user_id) AS daily_active_users
      FROM events
      WHERE event_time >= now() - INTERVAL {days: UInt32} DAY
      GROUP BY day
      ORDER BY day
    `,
    query_params: { days },
    format: "JSONEachRow",
  });
  return result.json<DauRow>();
}

async function main(): Promise<void> {
  await trackEvents([
    {
      event_time: new Date().toISOString().replace("T", " ").slice(0, 19),
      event_name: "page_view",
      user_id: "user_123",
      session_id: "sess_abc",
      properties: JSON.stringify({ path: "/pricing", referrer: "google" }),
    },
  ]);

  const dau = await dailyActiveUsers(7);
  console.log(dau);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

Deploy this as a separate service in the same project. Because both services share the environment's private network, the insert and query traffic never leaves Railway and incurs no egress charges.

## Operational notes

- **Backups**: Railway volumes support scheduled [backups](/volumes/backups). Enable them on the ClickHouse volume before you depend on the data.
- **Redeploys**: the volume persists across redeploys and image upgrades. Pin a specific image tag and upgrade deliberately; ClickHouse upgrades are generally forward-compatible but read the release notes before jumping major versions.
- **One writer**: run a single ClickHouse replica. MergeTree tables on a single volume do not support multiple concurrent server instances.
- **Monitoring**: watch disk usage in the service's metrics. If the volume fills completely, ClickHouse stops accepting inserts and the automatic offline resize will restart the service.

## Next steps

- [Using volumes](/volumes) for mount paths, resizing, and backup details
- [Private networking](/networking/private-networking) for how internal DNS and environment isolation work
- [Right-size CPU and memory from real metrics](/guides/right-size-cpu-memory) to set limits that fit your query load
- [Deploy an OpenTelemetry collector stack](/guides/deploy-an-otel-collector-stack) to feed telemetry into your analytics pipeline
