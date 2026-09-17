---
title: Automatic instrumentation
description: Trace Node.js, Go, Python, Ruby, and Java services on Railway without code changes using OpenTelemetry eBPF Instrumentation (OBI).
---

Automatic instrumentation traces a service's processes from outside the container, with no SDK and no code changes. Railway uses <a href="https://opentelemetry.io/docs/zero-code/obi/" target="_blank">OpenTelemetry eBPF Instrumentation (OBI)</a>, which attaches eBPF probes to your processes on the host and exports spans for the requests they handle and make.

**Note:** This is a preview feature under active development.

Automatic instrumentation is best effort. It supports Node.js, Go, Python, Ruby, and Java processes, and it captures traffic on the protocols it understands. When you need complete traces or custom spans, instrument the service with an OpenTelemetry SDK instead. See the language pages under [Tracing](/observability/tracing#instrument-your-service).

## What you get

For a supported process, automatic instrumentation exports:

- A server span for each incoming HTTP or gRPC request, with the method, route, status code, and duration
- A client span for each outgoing HTTP or gRPC request over plaintext, joined to the incoming request that caused it
- Client spans for database and cache calls on protocols OBI decodes, such as PostgreSQL, MySQL, and Redis

Spans join the trace the edge started for the request, so a trace shows the edge, the proxy, and the work inside your service.

## What you don't get

- **Outbound TLS calls.** OBI can't inject trace headers into encrypted connections, so a call to an external HTTPS API or to another service over HTTPS appears as a span, but the callee's spans don't join the trace.
- **Work behind queues.** A job picked up from a queue, a scheduled task, or work handed to a background worker starts a new trace rather than continuing the request's trace.
- **Custom spans and attributes.** OBI only sees protocol traffic. To record a span around a function or attach business attributes, use an SDK.
- **Context across every runtime.** Context propagation is complete for Go. Java and Ruby (on Puma) propagate context at the network level. Node.js and Python are best effort. Python needs the `uvloop` event loop for context to follow a request across awaits.

Enable automatic instrumentation on a service or run an SDK in it, not both. Two sources of spans for the same request produce duplicate spans.

## Enable automatic instrumentation

Automatic instrumentation is a per-service switch in the **Tracing setup** panel, and it only appears while tracing is on for the service.

1. Navigate to the **Traces** tab in your project and click **Tracing setup**.
2. [Enable tracing](/observability/tracing#enable-tracing) for the service, either through the project default or the service's own selector.
3. In the service's entry under **Services**, toggle **Best-effort automatic tracing** on.

Railway instruments the service's running processes within a minute. No redeploy is needed.

Turning the switch off stops instrumenting the service's processes. Turning tracing off for the service disables automatic instrumentation with it.

## Verify

Send a few requests to the service and open the **Traces** page. In the **Tracing setup** panel, the **App** indicator for the service shows when its last span arrived. Open a trace, and the spans exported by automatic instrumentation appear under the edge and proxy spans with your service's name.

If no spans arrive after a minute of traffic, check that the process is one of the supported runtimes and that the traffic it handles is HTTP or gRPC. A process that only consumes from a queue produces no server spans.

## Move to an SDK

Automatic instrumentation is a quick way to see inside a service. When you want more, add an OpenTelemetry SDK following the guide for your language, redeploy, and turn **Best-effort automatic tracing** off once the SDK's spans appear in the Tracing setup panel.
