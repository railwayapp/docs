---
title: Instrument an App with OpenTelemetry
description: Enable Railway's built-in tracing, follow requests from the edge into your service, and add OpenTelemetry spans from your code with automatic instrumentation or an SDK.
date: "2026-09-18"
tags:
  - opentelemetry
  - observability
  - tracing
  - monitoring
topic: infrastructure
---

A trace follows one request from Railway's edge, through your service, and into the services it calls. Railway's built-in [tracing](/observability/tracing) starts the trace at the edge and receives OpenTelemetry spans from your services, so there is nothing to deploy and no backend to run. This guide enables tracing for a project, adds spans from inside a service with automatic instrumentation or an OpenTelemetry SDK, tunes the sample rate, and finds the trace behind a request a user reports.

**Note:** Tracing is a preview feature under active development.

## Prerequisites

- A Railway project with a service you want to trace.
- A public domain on that service. Railway's edge starts traces for requests it routes, so a service without a public domain only contributes the spans it exports itself.

## 1. Enable tracing

Tracing is configured from the **Tracing setup** panel on the Traces page.

1. Navigate to the **Traces** tab in your project's top navigation.
2. Click **Tracing setup**. The panel opens on its own while the environment has no traces yet.
3. Under **Project**, toggle **Trace requests by default** on.
4. Leave **Sample rate** empty for now. Railway traces every request by default, which is what you want while setting up.

Every service without an override is now traced. To trace one service only, leave the project default off and turn the service's **Traced** switch on in the panel's service table. The same setting is on the service under **Settings → Tracing**, as a selector with **Project default**, **On**, and **Off**. See [Enable tracing](/observability/tracing#enable-tracing) for how overrides resolve.

## 2. Look at the first traces

The edge starts tracing requests to the service's domains right away, before any change to your code.

1. Send a few requests to the service's public domain.
2. Back on the **Traces** page, each request appears as a row with the time it started, the root span's name, the service, the duration, and the span count. Toggle live updates on to watch new traces arrive.
3. Click a trace. The waterfall shows an edge span with the method, path, status, and cache result, and a proxy span for the hop into your service's region.

Each traced response also carries an `x-railway-trace-id` header:

```bash
curl -sI https://your-app.up.railway.app/ | grep -i x-railway-trace-id
```

Paste that ID into the **Trace ID** field at the top of the Traces page to open the trace directly.

At this point a trace ends at the proxy. The next step adds what happens inside your service.

## 3. Add spans from inside your service

Two options: automatic instrumentation traces the process from the outside with no code changes, and an OpenTelemetry SDK gives complete traces with your own spans. Pick one per service; running both produces duplicate spans for every request.

### Option A: Automatic instrumentation

[Automatic instrumentation](/observability/tracing/automatic-instrumentation) attaches eBPF probes to your service's processes on the host and exports a server span for each incoming HTTP or gRPC request, a client span for each outgoing plaintext call, and client spans for database and cache calls on protocols it decodes. It supports Node.js, Go, Python, Ruby, and Java processes on a best-effort basis.

1. In the **Tracing setup** panel, find the service's row and pick **Automatic instrumentation**, then confirm.
2. Send a few more requests. Railway instruments the running processes within a minute, with no redeploy.
3. Open a new trace. The service's spans appear under the edge and proxy spans.

Automatic instrumentation can't see custom work inside a function, attach business attributes, or follow a request into an outbound TLS call. When you want those, move to an SDK and switch the service back to **Manual instrumentation** once the SDK's spans arrive.

### Option B: An OpenTelemetry SDK

When tracing is on for a service, Railway adds the standard `OTEL_*` variables on the next deploy: the exporter endpoint, protocol, and headers for Railway's receiver, `OTEL_SERVICE_NAME` set to the service's name, and `OTEL_SERVICE_VERSION` set to the commit SHA. They show up in the service's **Variables** tab with the other variables Railway provides, and every OpenTelemetry SDK reads them. Leave the exporter endpoint alone: an `OTEL_EXPORTER_OTLP_ENDPOINT` you set yourself takes precedence, and the spans then go wherever it points instead of to the Traces page. See [Provided variables](/observability/tracing#provided-variables) for the full list.

Railway's receiver accepts traces only, so also set these two variables on the service to keep the SDK from exporting metrics and logs to it:

```plaintext
OTEL_METRICS_EXPORTER=none
OTEL_LOGS_EXPORTER=none
```

For a Node.js app, install the auto-instrumentation bundle and load it before your code with the [start command](/builds/build-and-start-commands):

```bash
npm install @opentelemetry/api @opentelemetry/auto-instrumentations-node
```

```plaintext
node --require @opentelemetry/auto-instrumentations-node/register server.js
```

The bundle instruments the `http` module, Express, Fastify, Koa, NestJS, `pg`, `ioredis`, `mongodb`, and more, and the register module configures the SDK from the variables alone.

For a Python app, install the distribution and prefix the start command with `opentelemetry-instrument`:

```bash
pip install opentelemetry-distro opentelemetry-exporter-otlp
opentelemetry-bootstrap -a install
```

```plaintext
opentelemetry-instrument gunicorn app:app --bind 0.0.0.0:$PORT
```

Redeploy the service and send a few requests. In the **Tracing setup** panel, the **App** indicator for the service turns green when its first span arrives, and new traces show the request's server span and the library calls under it.

The per-language pages cover ESM and Next.js on [Node.js](/observability/tracing/nodejs), framework notes for [Python](/observability/tracing/python), and the setup for [Deno](/observability/tracing/deno), [Go](/observability/tracing/go), [Java](/observability/tracing/java), [Ruby](/observability/tracing/ruby), [.NET](/observability/tracing/dotnet), [Rust](/observability/tracing/rust), and [PHP](/observability/tracing/php).

### Add a custom span

Auto-instrumentation gives you one span per request and per library call. Wrap the work you care about in your own span with the OpenTelemetry API. In Node.js:

```javascript
import { trace, SpanStatusCode } from "@opentelemetry/api";

const tracer = trace.getTracer("checkout");

async function calculateTotal(cart) {
  return tracer.startActiveSpan("calculate-total", async (span) => {
    try {
      span.setAttribute("cart.items", cart.items.length);
      return await priceItems(cart);
    } catch (err) {
      span.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
      throw err;
    } finally {
      span.end();
    }
  });
}
```

The span nests under the request span that's active when the function runs. Attributes you set are searchable on the Traces page, for example with `@cart.items:>10`. The per-language pages show the same span in each language.

## 4. Follow a request across services

A request that your service makes to another service over the [private network](/networking/private-networking) carries the trace along. An SDK adds the W3C `traceparent` header to outgoing requests, and automatic instrumentation injects it into plaintext HTTP and gRPC calls. When the callee is traced as well, its spans join the same trace, and the waterfall shows the caller's client span with the callee's server span nested under it.

Enable tracing on every service that takes part in the request. A service without a public domain has no edge spans, but its own spans still appear in traces that other services propagate to it.

To find traces in which one service called another, filter on the caller's client spans:

```text
@service:api AND @kind:client
```

## 5. Tune the sample rate

Once traces flow, decide how many requests to keep. The sample rate is the percentage of client-facing requests the edge traces, set once per project.

1. Open **Tracing setup** and enter a **Sample rate** under **Project**. Decimals are allowed, so `0.5` traces one request in 200.
2. Leave it empty to keep tracing every request. Lower it for a busy service to stay within the [span limits](/observability/tracing#retention-and-limits) and keep the Traces page focused.

The edge makes the decision once per request and passes it along in the `traceparent` header, so an SDK with its default parent-based sampler records exactly the requests the edge sampled. Traces your service starts on its own, such as a cron job or a queue consumer, follow the same rate: when the project sets one, Railway adds `OTEL_TRACES_SAMPLER=parentbased_traceidratio` and `OTEL_TRACES_SAMPLER_ARG` with the rate as a fraction to the service's variables on the next deploy. See [Configure the sample rate](/observability/tracing#configure-the-sample-rate) for the details.

To trace one specific request regardless of the rate, send a `traceparent` header with the sampled flag set:

```bash
curl -H "traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01" \
  https://your-app.up.railway.app/
```

Generate a new random trace ID (the second field) for each request you force.

## 6. Find the trace behind a problem

When a user reports a slow or failed request, ask for the `x-railway-trace-id` header from the response, or return it from your frontend's error handling, and paste it into the **Trace ID** field. Without an ID, search. The filter on the Traces page uses the same syntax as [logs](/observability/logs#filter-syntax) and matches spans anywhere in the trace:

```text
@status:error
```

```text
@component:edge AND @duration:>1000
```

```text
@http.route:/checkout AND @http.response.status_code:500
```

Any attribute your instrumentation emits is a filter key, and the input suggests the keys present in the selected time range. See [Search traces](/observability/tracing#search-traces) for the built-in fields.

## If spans are missing

- **No traces at all.** Check that tracing is on for the service in **Tracing setup** and that the service has a public domain. With a low sample rate and little traffic, force a request with the `traceparent` header above.
- **Edge spans only.** Railway adds the `OTEL_*` variables on the first deploy after you enable tracing, so redeploy. Check that the SDK loads before the app starts serving and that the service doesn't set its own exporter endpoint.
- **The app's spans form their own traces.** The SDK isn't reading `traceparent`. Most SDKs enable the W3C Trace Context propagator by default; the Go SDK needs it set explicitly. Allow the header through any proxy or framework in front of your handlers.

More cases are in [Troubleshooting](/observability/tracing#troubleshooting).

## Next steps

- [Tracing](/observability/tracing): the full reference for enabling tracing, the provided variables, search fields, retention, and limits.
- [Automatic instrumentation](/observability/tracing/automatic-instrumentation): what the eBPF instrumentation captures and where it stops.
- [Debug a Production Incident with Logs, Metrics, and Traces](/guides/debug-production-incident): use traces alongside HTTP logs and metrics during an incident.
- [Connect a Third-Party Observability Tool](/guides/third-party-observability): keep traces beyond your plan's retention in a hosted backend.
