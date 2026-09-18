---
title: Tracing
description: Trace requests from Railway's edge through your services with built-in OpenTelemetry tracing, and explore them on the Traces page.
---

Tracing follows a single request from Railway's edge, through your service, and into the services it calls. Railway starts the trace at the edge, receives OpenTelemetry spans from your services through a built-in collector, and shows the result on the **Traces** page of your project.

**Note:** This is a preview feature under active development.

Railway records the edge's part of every sampled request without changes to your code. To see what happens inside your service, instrument it with an OpenTelemetry SDK or turn on [automatic instrumentation](/observability/tracing/automatic-instrumentation).

## How it works

A trace is a tree of spans. Each span records one unit of work with a start time, a duration, a status, and attributes such as the HTTP route or a database statement. Every hop that takes part in a request adds spans to the same trace, identified by a shared trace ID.

On Railway, a traced request passes through three components:

1. **Edge.** When a request for a traced service arrives at Railway's edge, the edge decides whether to sample it. For a sampled request, the edge records a server span with the method, path, response status, cache result, and upstream, and forwards a W3C `traceparent` header to your service.
2. **Proxy.** The ingress proxy in your service's region routes the request to one of its replicas and adds a span for that hop.
3. **Service.** If your app runs an OpenTelemetry SDK, the SDK reads the `traceparent` header, continues the trace, and exports its spans to Railway's collector. Requests your service makes to other services carry the same header, so their spans join the trace as well.

Railway runs an OTLP receiver on every host. Services reach it at the address in `OTEL_EXPORTER_OTLP_ENDPOINT`, and the receiver attributes each span to the service that sent it. Railway stamps the project, environment, service, deployment, and replica onto every span as resource attributes, so you can filter by them on the Traces page.

The receiver accepts traces only, over OTLP/HTTP and OTLP/gRPC. It doesn't accept metrics or logs. Railway collects [metrics](/observability/metrics) and [logs](/observability/logs) for every service without instrumentation.

## Enable tracing

Tracing is configured from the **Tracing setup** panel on the Traces page. The panel holds the project default, the sample rate, and a per-service override, and it shows for each service when the edge and the app last exported a span, so you can watch the first spans arrive.

1. Navigate to the **Traces** tab in your project's top navigation.
2. Click **Tracing setup** to open the panel. It opens on its own while the environment has no traces yet.
3. Under **Project**, toggle **Trace requests by default** on.
4. Optional: enter a **Sample rate**. Leave it empty to trace every request, Railway's default.

Once the project default is on, every service without an override is traced.

### Override a service

Each service in the panel's service table has a **Traced** switch. Moving it away from what the project default gives the service stores an override for that service; moving it back clears the override again. Use an override to trace one service while the project default is off, or to leave a noisy service out.

The same setting is on the service itself under **Settings → Tracing**, as a selector with three choices: **Project default**, **On** and **Off**. The selector shows the effective state and sample rate underneath.

The panel lists every service in the environment except databases. A service without a public domain is marked as such: the edge never sees its requests, so only the spans it exports itself appear.

### What happens when you enable tracing

- The edge starts tracing requests to the service's domains right away.
- On the next deploy, Railway adds the OpenTelemetry [variables](#provided-variables) to the service. An app that runs an OpenTelemetry SDK exports spans from that deploy on.
- A service without a public domain never receives requests from the edge, so it has no edge spans. Its own spans still appear in traces that other services propagate to it over the [private network](/networking/private-networking).

## Configure the sample rate

The sample rate is the percentage of client-facing requests the edge traces. It's set once per project and applies to every traced service in it.

- Enter a value from 0 to 100 in **Sample rate** under **Project** in the Tracing setup panel. Decimals are allowed, so `0.5` traces one request in 200.
- Leave the field empty to use Railway's default, which traces 100% of requests. Lower the rate for a service with heavy traffic to stay within the span limits below and keep the Traces page focused.

The edge makes the sampling decision once per request and passes it along in the `traceparent` header. Requests the edge doesn't sample carry a header with the sampled flag cleared, so an SDK with the default parent-based sampler records nothing for them. Your service doesn't need its own sampling configuration.

The rate also applies to traces your service starts on its own: a cron job, a queue consumer, or a request over the private network that arrives without a `traceparent` header. When the project sets a rate, Railway adds `OTEL_TRACES_SAMPLER=parentbased_traceidratio` and `OTEL_TRACES_SAMPLER_ARG` with the rate as a fraction to the service's [variables](#provided-variables) on its next deploy, so the SDK samples those root spans at the same rate while still following the edge's decision for everything the edge saw. With the default rate, Railway adds neither variable, and the SDK's own default records every root span.

If a client sends its own `traceparent` header, the edge follows that header's sampled flag instead of drawing against the sample rate. A request whose header has the sampled flag set is always traced, and one whose flag is clear never is. This lets an instrumented client start a trace that continues into Railway, and lets you force a trace for a single request while debugging:

```bash
curl -H "traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01" \
  https://your-app.up.railway.app/
```

Generate a new random trace ID (the second field) for each request you force. Reusing an ID merges the requests into one trace.

## Provided variables

When tracing is enabled for a service, Railway adds these variables on the next deploy. They appear in the service's **Variables** tab with the other variables Railway provides.

| Variable | Value |
|---|---|
| `OTEL_EXPORTER_OTLP_ENDPOINT` | The address of Railway's OTLP receiver on the host running your service |
| `OTEL_EXPORTER_OTLP_PROTOCOL` | `http/protobuf` |
| `OTEL_EXPORTER_OTLP_HEADERS` | A header the receiver requires on every export |
| `OTEL_SERVICE_NAME` | The name of the service in Railway |
| `OTEL_SERVICE_VERSION` | The commit SHA of the deployment, or the deployment ID for image and CLI deployments |
| `OTEL_TRACES_SAMPLER` | `parentbased_traceidratio`. Only when the project sets its own [sample rate](#configure-the-sample-rate) |
| `OTEL_TRACES_SAMPLER_ARG` | The project's sample rate as a fraction, for example `0.25`. Only when the project sets its own sample rate |

Every OpenTelemetry SDK reads these variables, so an SDK configured without an explicit endpoint exports to Railway. Don't hardcode the endpoint or the header in your code, and don't set a different `OTEL_SERVICE_NAME` unless you want spans attributed under another name.

A variable you set yourself takes precedence. If you set `OTEL_EXPORTER_OTLP_ENDPOINT` or `OTEL_EXPORTER_OTLP_TRACES_ENDPOINT` on the service, for example to keep exporting to your own collector, Railway adds none of the tracing variables, and your app's spans don't reach the Traces page. The edge still traces requests to the service. If you set either `OTEL_TRACES_SAMPLER` or `OTEL_TRACES_SAMPLER_ARG`, Railway leaves both alone, so your sampler is never combined with Railway's rate.

Many SDKs export metrics and logs to the same endpoint by default. Railway's receiver doesn't accept them, so set these variables on the service to keep the SDK from trying:

```plaintext
OTEL_METRICS_EXPORTER=none
OTEL_LOGS_EXPORTER=none
```

The per-language pages note which SDKs need this.

## View traces

Navigate to the **Traces** tab in your project's top navigation. Like the log explorer, the Traces page is scoped to the selected environment.

The page lists the environment's traces for the selected time range, with the newest at the bottom. Each row shows when the trace started, the root span's name, the service that handled the request, the duration, and the number of spans and errors. A histogram above the list shows how traces are distributed over the time range. Toggle live updates on to see new traces as they arrive.

Click a trace to open it. The trace view shows every span in the trace as a waterfall, nested under its parent, with a timing bar and a color per service. Click a span to see its attributes, events, links, and status. The trace ID is in the panel header with a copy button, and the open trace is part of the page URL, so you can share a link to it.

### Open a trace by ID

Enter a trace ID in the **Trace ID** field at the top of the Traces page and press Enter. The field accepts the 32-character hexadecimal ID or a whole `traceparent` header, so a value copied from a client's logs or a response header pastes as is.

Traces belong to the environment their spans were exported from. Opening a trace ID from another environment shows no spans.

### Find the trace ID of a request

Railway's edge adds an `x-railway-trace-id` response header to every response it traced. Read it from a client, from the browser's developer tools, or with curl:

```bash
curl -sI https://your-app.up.railway.app/ | grep -i x-railway-trace-id
```

The header is absent when the request wasn't traced. Ask a user who reports a problem to include it, or return it from your frontend's error handling, and open the trace directly.

Inside your service, the OpenTelemetry API exposes the current trace ID. Add it to your [structured logs](/observability/logs#structured-logs) as an attribute to jump from a log line to its trace.

## Search traces

The filter on the Traces page uses the same syntax as [logs](/observability/logs#filter-syntax): keywords, `@field:value` pairs, the operators `AND`, `OR`, and `-` (negation), and parentheses for grouping. A filter matches spans, and the result lists every trace that contains a matching span. Free text matches span names.

These fields are built in:

| Field | Matches |
|---|---|
| `@trace:<id>` | Trace ID, 32 hexadecimal characters |
| `@span:<id>` | Span ID, 16 hexadecimal characters |
| `@name:<name>` | Span name. End the value with `*` for a prefix match |
| `@serviceName:<name>` | The `service.name` the exporter sent |
| `@service:<name or id>` | Railway service, by name or ID |
| `@deployment:<id>` | Deployment ID |
| `@replica:<id>` | Replica ID |
| `@component:<component>` | Which hop exported the span: `edge`, `proxy`, or `service` |
| `@kind:<kind>` | Span kind: `server`, `client`, `internal`, `producer`, or `consumer` |
| `@status:<status>` | Span status: `ok`, `error`, or `unset` |
| `@duration:<ms>` | Span duration in milliseconds, with `>`, `<`, or a range such as `100-250` |

Any other `@key` looks the key up in the span's attributes and resource attributes. The filter input suggests the attribute keys present on the spans in the selected time range, so you can filter on what your instrumentation emits without knowing the names by heart.

### Examples

Find traces that contain an error.

```text
@status:error
```

Find requests the edge served in more than a second.

```text
@component:edge AND @duration:>1000
```

Find traces in which the `api` service made an outgoing call.

```text
@service:api AND @kind:client
```

Find server errors on one route.

```text
@http.route:/checkout AND @http.response.status_code:500
```

Find traces that include a database query starting with `SELECT`.

```text
@name:SELECT*
```

Find traces from one deployment that took longer than half a second.

```text
@deployment:<deployment_id> AND @duration:>500
```

## Retention and limits

Traces are retained for the same period as logs on your plan. See [log retention](/observability/logs#log-retention).

Railway applies these limits to incoming spans:

- Each replica can export 1,000 spans per 10 seconds. Spans over the limit are rejected, and the SDK sees the rejection as an OTLP partial success.
- A span can carry 128 attributes, 128 events, and 128 links, each with 128 attributes. Attribute values are cut at 16 KiB. Excess is dropped and counted on the span rather than rejected.
- A search returns up to 500 traces. Narrow the filter or the time range to see the rest.

## Instrument your service

The edge traces a request on its own, but a trace only shows what happens inside your service once the service exports spans. Two options are available:

- [Automatic instrumentation](/observability/tracing/automatic-instrumentation) traces Node.js, Go, Python, Ruby, and Java processes without code changes, on a best-effort basis.
- An OpenTelemetry SDK gives complete traces with custom spans. See the guide for your language:
  - [Node.js](/observability/tracing/nodejs)
  - [Deno](/observability/tracing/deno)
  - [Python](/observability/tracing/python)
  - [Go](/observability/tracing/go)
  - [Java](/observability/tracing/java)
  - [Ruby](/observability/tracing/ruby)
  - [.NET](/observability/tracing/dotnet)
  - [Rust](/observability/tracing/rust)
  - [PHP](/observability/tracing/php)

## Troubleshooting

**No traces appear.** Check that tracing is on for the service in the **Tracing setup** panel, and that the service has a public domain. If you set a low sample rate on a service with little traffic, it can take a while for a request to be sampled. Force one with a `traceparent` header as shown in [Configure the sample rate](#configure-the-sample-rate).

**Edge spans appear, but the app's spans don't.** Railway adds the `OTEL_*` variables on the first deploy after you enable tracing, so redeploy the service. Check that the app loads the SDK before it starts serving requests, and that the service doesn't set its own `OTEL_EXPORTER_OTLP_ENDPOINT`. The **App** indicator in the Tracing setup panel turns green as soon as the first span from the app arrives.

**The app's spans show up as separate traces.** The SDK isn't reading the `traceparent` header. Configure the W3C Trace Context propagator, which most SDKs enable by default but the Go SDK requires you to set explicitly. If a proxy or framework in front of your handlers strips incoming headers, allow `traceparent` through.

**The SDK logs export errors for metrics or logs.** Set `OTEL_METRICS_EXPORTER=none` and `OTEL_LOGS_EXPORTER=none`. The receiver accepts traces only.

**Spans are missing from a busy service.** The service is exporting more than 1,000 spans per 10 seconds per replica. Reduce the span volume by disabling noisy instrumentations, or lower the sample rate.

## See also

- [Logs](/observability/logs) - HTTP logs record every request, sampled or not
- [Instrument an App with OpenTelemetry](/guides/instrument-app-opentelemetry) - send telemetry to your own collector instead
- [Connect a Third-Party Observability Tool](/guides/third-party-observability) - ship traces to hosted backends for longer retention
