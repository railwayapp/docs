---
title: Ship Application Logs to a Third-Party Aggregator
description: Build a log drain on Railway with a Vector forwarder service. Apps send logs over private networking, and Vector fans them out to any aggregator.
date: "2026-07-29"
tags:
  - logging
  - observability
  - vector
  - integrations
topic: integrations
---

Railway retains logs for 7 to 90 days depending on your plan, but there is no built-in log drain setting that forwards stdout to an external intake URL. This guide builds the equivalent: a small [Vector](https://vector.dev) service that receives log events from your apps over [private networking](/networking/private-networking) and forwards them to any aggregator with an HTTP intake (Better Stack, Axiom, Grafana Loki, Datadog).

If you want to instrument your app directly with a vendor SDK or OpenTelemetry instead, see [Connect a Third-Party Observability Tool](/guides/third-party-observability).

## How the pattern works

A log drain normally sits between your app and the aggregator: the platform copies stdout to an external URL. Railway does not do that copy for you, so the forwarder pattern recreates it with two pieces:

1. Your app writes structured JSON logs to stdout as usual, so Railway's [log explorer](/observability/logs) keeps working.
2. The app also sends a copy of each log event to a Vector service in the same environment, over the private network. Vector batches the events and delivers them to your aggregator.

```
┌──────────────── Project Environment ────────────────┐
│                                                      │
│  ┌─────────┐   stdout → Railway logs                 │
│  │   app   │                                         │
│  │ service │──── http://vector.railway.internal ──┐  │
│  └─────────┘         (private network)            │  │
│                                              ┌────▼──────┐
│                                              │  vector   │──→ aggregator
│                                              │  service  │    (public internet)
│                                              └───────────┘
└──────────────────────────────────────────────────────┘
```

Routing through Vector beats posting to the aggregator from every app:

- **One credential, one egress point.** Only the Vector service holds the aggregator token and makes outbound requests.
- **Batching and retries in one place.** Vector buffers, batches, and retries deliveries. Your app fires a request to the private network and moves on.
- **Swap vendors without redeploying apps.** Changing aggregators means editing one Vector sink, not every service.
- **Free traffic inside the environment.** App-to-Vector traffic goes over private networking, which does not count toward egress billing. You pay egress only once, from Vector to the aggregator.

Private networking is scoped per environment, so deploy one Vector service per environment you want to drain.

## Deploy the Vector service

Create a directory with two files and deploy it as a new service in your project. Vector needs a config file, so deploy from a repository with a Dockerfile rather than from a bare Docker image. See [Dockerfiles](/builds/dockerfiles) for how Railway detects it.

`Dockerfile`:

```dockerfile
FROM timberio/vector:latest-alpine

COPY vector.yaml /etc/vector/vector.yaml

CMD ["--config", "/etc/vector/vector.yaml"]
```

Pin a specific Vector version tag in production instead of `latest-alpine`.

`vector.yaml`:

```yaml
sources:
  app_logs:
    type: http_server
    # "[::]" binds IPv6 (and IPv4 on dual-stack hosts).
    # Required: private networking resolves to IPv6 in legacy environments.
    address: "[::]:9000"
    decoding:
      codec: json

transforms:
  stamp:
    type: remap
    inputs:
      - app_logs
    source: |
      .received_at = now()

sinks:
  aggregator:
    type: http
    inputs:
      - stamp
    uri: "${SINK_URL}"
    encoding:
      codec: json
    batch:
      max_events: 100
      timeout_secs: 2
    request:
      headers:
        Authorization: "Bearer ${SINK_TOKEN}"
```

The `http` sink works with any aggregator that accepts JSON over HTTP. Vector also ships dedicated sinks (`loki`, `datadog_logs`, `axiom`, `elasticsearch`, and more) that handle vendor-specific formats; swap the sink block for one of those if your aggregator has one. See the <a href="https://vector.dev/docs/reference/configuration/sinks/" target="_blank">Vector sinks reference</a>.

On the Vector service, set two variables:

```
SINK_URL=https://your-aggregator.example.com/ingest
SINK_TOKEN=<your aggregator API token>
```

Vector interpolates `${SINK_URL}` and `${SINK_TOKEN}` from the environment at startup. It only needs to be reachable inside the environment, so do not add a public domain to this service.

Two notes on the port:

- Vector's own API defaults to port 8686, so this config uses 9000 for the log intake to avoid confusion.
- Private networking does not require exposing or configuring the port in Railway. Other services reach Vector at `vector.railway.internal:9000` directly.

## Send logs from your app

Your app should keep writing JSON logs to stdout and also post copies to Vector. That forwarder must never take your app down: send in the background, batch, and swallow delivery errors.

Here is a Node.js logger that does both. It uses only built-in modules, so there is nothing to install.

`logger.js`:

```javascript
const VECTOR_URL = process.env.VECTOR_URL ?? "";

const meta = {
  service: process.env.RAILWAY_SERVICE_NAME,
  environment: process.env.RAILWAY_ENVIRONMENT_NAME,
  deployment: process.env.RAILWAY_DEPLOYMENT_ID,
  replica: process.env.RAILWAY_REPLICA_ID,
};

const MAX_BATCH = 100;
const FLUSH_MS = 1000;

let queue = [];
let timer = null;

async function flush() {
  timer = null;
  if (queue.length === 0 || !VECTOR_URL) return;
  const batch = queue;
  queue = [];
  const body = batch.map((e) => JSON.stringify(e)).join("\n");
  try {
    await fetch(VECTOR_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-ndjson" },
      body,
    });
  } catch {
    // Never crash or block the app because the forwarder is unreachable.
    // stdout already has the log line, so nothing is lost from Railway logs.
  }
}

function schedule() {
  if (queue.length >= MAX_BATCH) {
    void flush();
  } else if (!timer) {
    timer = setTimeout(() => void flush(), FLUSH_MS);
    timer.unref();
  }
}

function log(level, message, fields = {}) {
  const entry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...meta,
    ...fields,
  };
  // Single-line JSON so Railway parses it as a structured log.
  process.stdout.write(JSON.stringify(entry) + "\n");
  if (VECTOR_URL) {
    queue.push(entry);
    schedule();
  }
}

export const logger = {
  debug: (msg, fields) => log("debug", msg, fields),
  info: (msg, fields) => log("info", msg, fields),
  warn: (msg, fields) => log("warn", msg, fields),
  error: (msg, fields) => log("error", msg, fields),
  flush,
};
```

Use it in a minimal HTTP server, `server.js`:

```javascript
import { createServer } from "node:http";
import { logger } from "./logger.js";

const port = Number(process.env.PORT) || 3000;

const server = createServer((req, res) => {
  logger.info("request", { method: req.method, path: req.url });
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ ok: true }));
});

server.listen(port, () => {
  logger.info("server started", { port });
});

process.on("SIGTERM", async () => {
  await logger.flush();
  server.close(() => process.exit(0));
});
```

On the app service, set:

```
VECTOR_URL=http://vector.railway.internal:9000
```

Use `http://`, not `https://`: private network traffic is already encrypted by WireGuard, and Vector is not serving TLS on that port. That URL assumes a service named `vector`; if you used a different name, adjust the hostname, since the internal DNS name is always `<service-name>.railway.internal`.

The `RAILWAY_SERVICE_NAME`, `RAILWAY_ENVIRONMENT_NAME`, `RAILWAY_DEPLOYMENT_ID`, and `RAILWAY_REPLICA_ID` values are injected automatically into every deployment. Stamping them on each event lets you filter by service and environment in the aggregator. See the [variables reference](/variables/reference) for the full list.

Any language works the same way: emit single-line JSON to stdout, and POST newline-delimited JSON to `http://vector.railway.internal:9000` in the background. In Python, for example, a `logging.Handler` that appends to a queue and a background thread that posts batches gives you the same behavior.

## Failure behavior and limits

- **stdout is the source of truth.** If Vector is down or redeploying, the app keeps logging to stdout and Railway retains those logs normally. You lose forwarding for that window, not logs.
- **Private networking is runtime only.** `vector.railway.internal` does not resolve during builds or in code that runs at build time. Only send from the running app.
- **Railway rate-limits logging at 500 log lines per second per replica.** The forwarder does not raise that limit, since events still go through stdout. If you exceed it, sample or reduce verbosity. See [logging throughput](/observability/logs#logging-throughput).
- **Egress is billed once.** App-to-Vector traffic is free. Vector-to-aggregator traffic is billed as egress at $0.05 per GB, so high log volume shows up on your bill. Vector's `batch` settings and compression options on most sinks reduce request overhead.
- **Vector is cheap to run.** A forwarder handling moderate volume idles at well under half a GB of RAM, and Railway bills resources by actual usage.

## Verify the pipeline

1. Deploy both services and confirm the Vector deploy logs show the `http_server` source listening.
2. Hit your app's public URL a few times.
3. Check the app's logs in Railway: you should see the structured `request` lines.
4. Check your aggregator: the same events should arrive within a few seconds, carrying `service`, `environment`, and `received_at` fields.

If events show up in Railway logs but not the aggregator, read the Vector service logs. Vector logs delivery errors, including bad tokens and unreachable sink URLs, to its own stdout.

## Next steps

- [Connect a Third-Party Observability Tool](/guides/third-party-observability) for the SDK and OpenTelemetry approaches to metrics and traces.
- [Deploy an OpenTelemetry Collector Stack](/guides/deploy-an-otel-collector-stack) for a self-hosted collector with Grafana dashboards.
- [Set Up a Datadog Agent in Railway](/guides/set-up-a-datadog-agent) if you are all-in on Datadog and want traces and metrics too.
- [Logs](/observability/logs) for structured logging, retention, and the log explorer.
