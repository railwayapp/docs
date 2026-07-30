---
title: Instrument an App with OpenTelemetry
description: Add OpenTelemetry traces and metrics to a Node.js or Python app on Railway, and send them to a collector over the private network.
date: "2026-07-29"
tags:
  - opentelemetry
  - observability
  - tracing
  - monitoring
topic: infrastructure
---

Instrumentation is the code that makes your application emit telemetry: traces that follow a request across functions and services, metrics that count and measure what the app does, and logs with trace context attached. OpenTelemetry (OTel) is the vendor-neutral standard for producing that data, so you instrument once and point the output at any backend. This guide adds the OTel SDK to a Node.js or Python service on Railway, configures it with environment variables, and exports telemetry to an OpenTelemetry Collector over [private networking](/networking/private-networking).

This guide covers the application side. For the infrastructure side, deploying the collector and a tracing backend, see [Deploy an OpenTelemetry Collector and Backend on Railway](/guides/deploy-an-otel-collector-stack).

## Prerequisites

- A Railway project with a service you want to instrument.
- An OTLP endpoint to send telemetry to. The examples assume an OpenTelemetry Collector running as a service in the same project and environment, listening on port 4318 (OTLP over HTTP). The [collector guide](/guides/deploy-an-otel-collector-stack) sets this up, including a one-click template.

You can also skip the collector and export directly to a vendor's OTLP endpoint over the public internet. A collector is still the better default: it batches, retries, and fans out to multiple backends without app changes, and app-to-collector traffic on the private network avoids [network egress charges](/pricing/cost-control).

## Configure the SDK with environment variables

Every OpenTelemetry SDK reads the same standard environment variables. Set them on the instrumented service in Railway, under the **Variables** tab, instead of hardcoding endpoints in code:

```plaintext
OTEL_EXPORTER_OTLP_ENDPOINT=http://${{OpenTelemetry Collector.RAILWAY_PRIVATE_DOMAIN}}:4318
OTEL_SERVICE_NAME=${{RAILWAY_SERVICE_NAME}}
OTEL_RESOURCE_ATTRIBUTES=service.version=${{RAILWAY_GIT_COMMIT_SHA}},deployment.environment.name=${{RAILWAY_ENVIRONMENT_NAME}}
```

What each line does:

- `OTEL_EXPORTER_OTLP_ENDPOINT` points the exporter at the collector. `${{OpenTelemetry Collector.RAILWAY_PRIVATE_DOMAIN}}` is a [reference variable](/variables/reference) that resolves to the collector service's `<service>.railway.internal` hostname. Adjust the service name to match yours. Use `http`, not `https`: private network traffic is already encrypted in transit by Railway.
- `OTEL_SERVICE_NAME` names the service in your traces. Referencing `RAILWAY_SERVICE_NAME` keeps it in sync with the service name in Railway.
- `OTEL_RESOURCE_ATTRIBUTES` attaches key-value pairs to every span and metric. `RAILWAY_GIT_COMMIT_SHA` and `RAILWAY_ENVIRONMENT_NAME` are [Railway-provided variables](/variables/reference), so each trace records exactly which commit and environment produced it.

Private networking is scoped per environment, so the app and the collector must run in the same project and environment for the internal hostname to resolve.

## Instrument a Node.js app

Install the SDK, the auto-instrumentation bundle, and the OTLP exporters:

```bash
npm install @opentelemetry/api @opentelemetry/sdk-node \
  @opentelemetry/auto-instrumentations-node \
  @opentelemetry/exporter-trace-otlp-http \
  @opentelemetry/exporter-metrics-otlp-http \
  @opentelemetry/sdk-metrics express
```

Of these, `express` is only for the example app; the auto-instrumentation bundle detects popular libraries (Express, Fastify, `http`, `pg`, `ioredis`, and others) and creates spans for them automatically.

### Create the SDK setup file

Create `instrumentation.js` at the project root:

```javascript
// instrumentation.js
const { NodeSDK } = require("@opentelemetry/sdk-node");
const {
  getNodeAutoInstrumentations,
} = require("@opentelemetry/auto-instrumentations-node");
const {
  OTLPTraceExporter,
} = require("@opentelemetry/exporter-trace-otlp-http");
const {
  OTLPMetricExporter,
} = require("@opentelemetry/exporter-metrics-otlp-http");
const { PeriodicExportingMetricReader } = require("@opentelemetry/sdk-metrics");

// Endpoint and service name come from OTEL_EXPORTER_OTLP_ENDPOINT
// and OTEL_SERVICE_NAME, so nothing is hardcoded here.
const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter(),
  metricReader: new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter(),
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();

// Flush telemetry before the container stops.
process.on("SIGTERM", () => {
  sdk
    .shutdown()
    .catch((err) => console.error("Error shutting down OpenTelemetry", err))
    .finally(() => process.exit(0));
});
```

The exporters are constructed with no arguments. They read `OTEL_EXPORTER_OTLP_ENDPOINT` and append the correct signal path (`/v1/traces`, `/v1/metrics`) themselves. That `SIGTERM` handler matters on Railway: deployments are replaced on every deploy, and flushing on shutdown prevents losing the last batch of spans.

### Add a custom span

Auto-instrumentation gives you one span per HTTP request and per database call. Add custom spans around the work you care about:

```javascript
// server.js
const express = require("express");
const { trace, SpanStatusCode } = require("@opentelemetry/api");

const tracer = trace.getTracer("checkout");
const app = express();
const port = process.env.PORT || 3000;

app.get("/checkout", async (req, res) => {
  // Create a child span inside the auto-created HTTP span.
  const total = await tracer.startActiveSpan(
    "calculate-total",
    async (span) => {
      try {
        span.setAttribute("cart.items", 3);
        const total = await calculateTotal();
        return total;
      } catch (err) {
        span.setStatus({ code: SpanStatusCode.ERROR });
        throw err;
      } finally {
        span.end();
      }
    }
  );

  res.json({ total });
});

async function calculateTotal() {
  // Stand-in for real work: a database query, an API call.
  return 3 * 999;
}

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
```

### Load the SDK before the app

The SDK must load before any library it instruments. Set a custom [start command](/builds/build-and-start-commands) on the service in Railway:

```plaintext
node --require ./instrumentation.js server.js
```

The `--require` flag loads `instrumentation.js` before `server.js` and everything it imports.

### Zero-code alternative

If you do not need custom spans, skip the setup file entirely. Install two packages:

```bash
npm install @opentelemetry/api @opentelemetry/auto-instrumentations-node
```

Then use this start command:

```plaintext
node --require @opentelemetry/auto-instrumentations-node/register server.js
```

The register module builds the SDK from environment variables alone. The same `OTEL_EXPORTER_OTLP_ENDPOINT` and `OTEL_SERVICE_NAME` variables apply.

## Instrument a Python app

Install the distro, the OTLP exporter, and Flask for the example:

```bash
pip install opentelemetry-distro opentelemetry-exporter-otlp flask
opentelemetry-bootstrap -a install
```

`opentelemetry-bootstrap` scans your installed packages and installs matching instrumentation libraries. Run it after adding dependencies, or add its output to `requirements.txt` so it runs during the Railway build.

The Python OTLP exporter defaults to gRPC on port 4317. To use the HTTP endpoint on 4318 like the Node example, add one more variable to the service:

```plaintext
OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf
```

### Add a custom span

```python
import os

from flask import Flask, jsonify
from opentelemetry import trace

tracer = trace.get_tracer("checkout")
app = Flask(__name__)


@app.route("/checkout")
def checkout():
    # Create a child span inside the auto-created request span.
    with tracer.start_as_current_span("calculate-total") as span:
        span.set_attribute("cart.items", 3)
        total = 3 * 999
    return jsonify(total=total)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 3000)))
```

### Wrap the start command

Prefix the normal start command with `opentelemetry-instrument`:

```plaintext
opentelemetry-instrument python main.py
```

For a production server, wrap that instead:

```plaintext
opentelemetry-instrument gunicorn main:app --bind 0.0.0.0:$PORT
```

`opentelemetry-instrument` configures the SDK from the same `OTEL_*` environment variables and activates every instrumentation library that `opentelemetry-bootstrap` installed.

## Verify telemetry is flowing

1. Deploy the service and send it a few requests.
2. Check the collector received the data. The collector from the [stack guide](/guides/deploy-an-otel-collector-stack) exposes a debugging UI (the zpages extension) where you can see incoming spans, or you can add the `debug` exporter to the collector config to print each received span to the service [logs](/observability/logs).
3. Open your tracing backend (Jaeger in the [collector stack guide](/guides/deploy-an-otel-collector-stack)) and search for the service name you set in `OTEL_SERVICE_NAME`. You should see one trace per request, with your custom span nested inside the HTTP span.

If nothing arrives, check three things: the reference variable resolves to the right collector service name, both services are in the same environment, and the endpoint uses `http://` with port 4318 (or 4317 for gRPC).

## Where OpenTelemetry fits with Railway observability

Railway already collects [logs](/observability/logs) and resource-level [metrics](/observability/metrics) (CPU, memory, network) for every service with no instrumentation. OpenTelemetry adds what Railway cannot see from outside the container: request-level traces, cross-service context propagation, and application-specific metrics. Use both: Railway metrics tell you a service is using 80% of its memory, and a trace tells you which endpoint and query is responsible.

## Next steps

- [Deploy an OpenTelemetry Collector and Backend on Railway](/guides/deploy-an-otel-collector-stack): the infrastructure this guide sends telemetry to.
- [Private Networking](/networking/private-networking): how `<service>.railway.internal` hostnames work.
- [Variables Reference](/variables/reference): every Railway-provided variable you can attach as a resource attribute.
- [Third-Party Observability Tools](/guides/third-party-observability): send the same telemetry to hosted backends.
