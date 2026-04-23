---
title: Third-party Integrations
description: Send telemetry from your Railway services to third-party observability tools using vendor SDKs or OpenTelemetry.
---

Railway's built-in [Observability Dashboard](/observability), [logs](/observability/logs), and [metrics](/observability/metrics) cover container-level health. A third-party observability tool covers cases that Railway's built-in tooling does not:

- **Distributed tracing and query-level insight.** Host metrics do not expose slow database queries, external API calls, or inter-service bottlenecks.
- **Error tracking** with stack-trace grouping, release association, and user or session linking.
- **Custom application or business metrics.** Railway [captures](/observability/metrics#provided-metrics) CPU, memory, network, and disk usage. Application-level metrics such as conversions per minute or queue depth are not collected.
- **Alerting beyond resource thresholds.** Railway's [monitors](/observability#monitors) alert on CPU, RAM, disk, and network egress. Error rate, p99 latency, and SLO-burn alerts require an external tool.
- **Longer retention.** Railway retains [logs](/observability/logs#log-retention) for 7, 30, or 90 days depending on plan and [metrics](/observability/metrics#understanding-the-metrics-graphs) for up to 30 days.

There are three ways to get telemetry off a Railway service:

- **Vendor SDK** - install the vendor's library in your app and ship directly to their SaaS.
- **OpenTelemetry (OTLP)** - instrument with OTel and export to any OTLP-compatible backend.
- **Self-hosted agent or collector** - run an agent or collector as its own Railway service.

## Vendor SDK

Install the vendor's SDK in your app, store credentials as Railway [variables](/variables), and map Railway-provided system variables to the vendor's tag names so services, releases, and replicas are labelled consistently.

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

Most vendors offer auto-instrumentation that wraps the start command, so traces and metrics are captured without code changes. Set it in the service's **Settings**, in [`railway.json`](/config-as-code), or in a `Procfile`. For example, Datadog's Node tracer:

```bash
NODE_OPTIONS="--require dd-trace/init" node server.js
```

Each vendor uses a different wrapper. Datadog on Python uses `ddtrace-run`; New Relic on Python uses `newrelic-admin run-program`; Sentry is initialized in code with `Sentry.init()`. Check your vendor's documentation for the exact command.

Vendor SDKs handle flushing on shutdown automatically.

## OpenTelemetry

<a href="https://opentelemetry.io" target="_blank">OpenTelemetry</a> is a vendor-neutral standard for emitting telemetry. Instrument your app once and point the exporter at any backend that accepts OTLP, including Datadog, New Relic, Honeycomb, Grafana Cloud, SigNoz, or a self-hosted Tempo or Jaeger stack.

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

Vendor SDKs flush on shutdown automatically and do not require this step.

## Self-hosted agent or collector

An agent or OTel Collector can run as its own Railway service to provide local batching, multi-backend fan-out, or a fully self-hosted observability stack. Railway services do not support sidecars, so the agent or collector is always a separate service.

- [Set up a Datadog Agent on Railway](/guides/set-up-a-datadog-agent) - run the Datadog Agent as a service and ship app telemetry to it.
- [Deploy an OpenTelemetry Collector stack](/guides/deploy-an-otel-collector-stack) - run the OTel Collector alongside Jaeger, Zipkin, and Prometheus.

## Log export

Railway does not have a log drain feature. There is no setting to forward stdout from a service to an external intake URL.

Most vendors support logs alongside traces and metrics, but the mechanism varies: sometimes the SDK includes log transport, sometimes a separate agent or log library is required. Sentry is primarily focused on errors rather than general logs. Check your vendor's docs for what their SDK ships out of the box. OpenTelemetry provides a Logs SDK that ships over the same OTLP endpoint. Enable logs in your chosen tool and they are sent through the same path as the rest of your telemetry.

To forward raw stdout without instrumentation, run a log forwarder such as Vector or Fluent Bit as its own Railway service.

## Networking

Railway's [private network](/networking/private-networking) uses IPv6. If your app exports to a collector running as another Railway service, the OTLP client must support IPv6. See [Library configuration](/networking/private-networking/library-configuration) for language-specific settings, including StatsD over IPv6 for the Datadog Agent.

If you export to a public IPv6-only endpoint, enable [outbound IPv6](/networking/outbound-networking#outbound-ipv6) on the service.
