---
title: Connect a Third-Party Observability Tool
description: Send telemetry from your Railway services to third-party observability tools. Covers vendor SDKs (Datadog, New Relic, Sentry), OpenTelemetry (OTLP), and common deployment pitfalls.
date: "2026-04-23"
tags:
  - observability
  - opentelemetry
  - monitoring
topic: integrations
---

Railway's built-in Observability dashboard, logs, and metrics cover container-level health. A third-party observability tool can be useful for those that require longer retention or custom application-level insight. This guide covers two approaches to shipping telemetry off a Railway service, with tradeoffs for each.

## Choosing an approach

| Approach | Complexity | Best for |
|---|---|---|
| Vendor SDK (Datadog, New Relic, Sentry) | Low | Most users |
| OpenTelemetry (OTLP) | High | Multi-vendor flexibility, open-source backends (Jaeger, Prometheus, Tempo) or swapping vendors without re-instrumenting |

## Pattern 1: Vendor SDK

Install the vendor's SDK in your app, store credentials as Railway variables, and map Railway-provided system variables to the vendor's tag names so services, releases, and replicas are labelled consistently.

### Map Railway variables to vendor tags

Railway provides system variables like `RAILWAY_SERVICE_NAME`, `RAILWAY_DEPLOYMENT_ID`, `RAILWAY_ENVIRONMENT_NAME`, and `RAILWAY_REPLICA_ID` to every deployment. See the [Variables reference](/variables/reference#railway-provided-variables) for the full list.

Each vendor expects these values under its own variable names. Set them in your service's variables so the SDK picks them up. For example, with Datadog:

| Purpose          | Railway variable          | Datadog variable                        |
| ---------------- | ------------------------- | --------------------------------------- |
| Service name     | `RAILWAY_SERVICE_NAME`    | `DD_SERVICE=${{RAILWAY_SERVICE_NAME}}`  |
| Release          | `RAILWAY_DEPLOYMENT_ID`   | `DD_VERSION=${{RAILWAY_DEPLOYMENT_ID}}` |
| Environment      | `RAILWAY_ENVIRONMENT_NAME`| `DD_ENV=${{RAILWAY_ENVIRONMENT_NAME}}`  |
| Replica / instance | `RAILWAY_REPLICA_ID`    | `DD_TAGS=replica:${{RAILWAY_REPLICA_ID}}` |

New Relic uses `NEW_RELIC_*` variables; Sentry accepts this data through its tag and context APIs in code. Check your vendor's documentation for the exact names.

### Auto-instrumentation

Most vendors offer auto-instrumentation that wraps the start command, so traces and metrics are captured without code changes. Set it in the service's **Settings**, in `railway.json`, or in a `Procfile`. For example, Datadog's Node tracer:

```bash
NODE_OPTIONS="--require dd-trace/init" node server.js
```

Each vendor uses a different wrapper. Datadog on Python uses `ddtrace-run`; New Relic on Python uses `newrelic-admin run-program`; Sentry is initialized in code with `Sentry.init()`. Check your vendor's documentation for the exact command.

```javascript
// Sentry (Node): initialize before your app code
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.RAILWAY_ENVIRONMENT_NAME,
  release: process.env.RAILWAY_DEPLOYMENT_ID,
});
```

Vendor SDKs handle flushing on shutdown automatically.

## Pattern 2: OpenTelemetry

OpenTelemetry is a vendor-neutral standard for emitting telemetry. Instrument your app once and point the exporter at any backend that accepts OTLP, including Datadog, New Relic, Honeycomb, Grafana Cloud, SigNoz, or a self-hosted Tempo or Jaeger stack.

### Configuration

Set the following variables on your service:

```bash
OTEL_SERVICE_NAME=${{RAILWAY_SERVICE_NAME}}
OTEL_RESOURCE_ATTRIBUTES=service.instance.id=${{RAILWAY_REPLICA_ID}},deployment.environment=${{RAILWAY_ENVIRONMENT_NAME}},railway.deployment.id=${{RAILWAY_DEPLOYMENT_ID}}
OTEL_EXPORTER_OTLP_ENDPOINT=https://<backend>
OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf
OTEL_EXPORTER_OTLP_HEADERS=authorization=<token>
```

Prefer `http/protobuf` (port 4318) over gRPC (port 4317) for portability across proxies.

### Auto-instrumentation

- **Node** - `NODE_OPTIONS="--require @opentelemetry/auto-instrumentations-node/register"`
- **Python** - `opentelemetry-instrument python app.py`

### Graceful shutdown

Railway sends `SIGTERM` to the old deployment when a new one takes over. OTel SDKs do not flush automatically on shutdown. Call `shutdown()` on the tracer provider from your signal handler, otherwise the last batch of spans is dropped. See [Deployment teardown](/deployments/deployment-teardown) and, for Node-specific signal handling, [Node.js SIGTERM handling](/deployments/troubleshooting/nodejs-sigterm-handling).

```javascript
// Flush OTel spans on SIGTERM before Railway replaces the container
import { NodeSDK } from '@opentelemetry/sdk-node';

const sdk = new NodeSDK({ /* exporters, instrumentations */ });
sdk.start();

process.on('SIGTERM', async () => {
  await sdk.shutdown();
  process.exit(0);
});
```

Vendor SDKs flush on shutdown automatically and do not require this step.

## Common pitfalls

**No log drain feature.** Railway does not have a setting to forward stdout from a service to an external intake URL. Most vendors support logs alongside traces and metrics, but the mechanism varies. To forward raw stdout without instrumentation, run a log forwarder such as Vector or Fluent Bit as its own Railway service.

**IPv6 over private networking.** Railway's [private network](/networking/private-networking) uses IPv6. If your app exports to a collector running as another Railway service, the OTLP client must support IPv6. See [Library configuration](/networking/private-networking/library-configuration) for language-specific settings, including StatsD over IPv6 for the Datadog Agent.

**IPv6 over public internet.** If you export to a public IPv6-only endpoint, enable [outbound IPv6](/networking/outbound-networking#outbound-ipv6) on the service.

## See also

- [Set up a Datadog Agent on Railway](/guides/set-up-a-datadog-agent) - run the Datadog Agent as a service and ship app telemetry to it.
- [Deploy an OpenTelemetry Collector stack](/guides/deploy-an-otel-collector-stack) - run the OTel Collector alongside Jaeger, Zipkin, and Prometheus.
- [Variables reference](/variables/reference#railway-provided-variables) - full list of Railway-provided system variables.
- [Private Networking](/networking/private-networking) - connect services over IPv6.
