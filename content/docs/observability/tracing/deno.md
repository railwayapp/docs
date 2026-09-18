---
title: Tracing for Deno
description: Export OpenTelemetry traces from a Deno service on Railway using the runtime's built-in OpenTelemetry support.
---

Deno has OpenTelemetry built into the runtime. One environment variable turns on spans for `Deno.serve` requests and `fetch` calls, with export over OTLP to Railway's collector. No packages are needed.

Before you start, [enable tracing](/observability/tracing#enable-tracing) for the service. Railway adds the `OTEL_*` variables on the next deploy, and Deno reads them.

## Enable OpenTelemetry in Deno

Set this variable on the service:

```plaintext
OTEL_DENO=true
```

Deno reads `OTEL_EXPORTER_OTLP_ENDPOINT`, `OTEL_EXPORTER_OTLP_PROTOCOL`, `OTEL_EXPORTER_OTLP_HEADERS`, and `OTEL_SERVICE_NAME` from the variables Railway provides, and exports over OTLP/HTTP.

By default, Deno also exports every `console.*` call as a log record. Railway's receiver accepts traces only, and Railway already captures your service's standard output as [logs](/observability/logs), so turn the export off:

```plaintext
OTEL_DENO_CONSOLE=ignore
```

## What Deno instruments

With OpenTelemetry enabled, Deno creates spans without any code changes for:

- Incoming requests handled by `Deno.serve`
- Outgoing `fetch` requests, with the trace context injected into the request headers
- `node:http2` traffic
- `Deno.cron` invocations

Deno propagates W3C Trace Context, so a request the edge traced continues in the same trace inside your service, and a `fetch` to another Railway service carries the trace onward.

## Add a custom span

Use the `@opentelemetry/api` package from npm to create spans. Deno's runtime provides the tracer behind the API, so the package is the only dependency:

```typescript
import { trace, SpanStatusCode } from "npm:@opentelemetry/api@1";

const tracer = trace.getTracer("checkout");

async function calculateTotal(cart: Cart) {
  return tracer.startActiveSpan("calculate-total", async (span) => {
    try {
      span.setAttribute("cart.items", cart.items.length);
      return await priceItems(cart);
    } catch (err) {
      span.setStatus({ code: SpanStatusCode.ERROR });
      throw err;
    } finally {
      span.end();
    }
  });
}
```

## Verify

1. Deploy the service and send it a few requests.
2. Open the **Traces** page. In the **Tracing setup** panel, the **App** indicator for the service turns green when its first span arrives.
3. Open a trace. The `Deno.serve` span and any `fetch` spans appear under the edge and proxy spans.

If spans from the app don't arrive, see [Troubleshooting](/observability/tracing#troubleshooting). For the full list of variables Deno reads, see the <a href="https://docs.deno.com/runtime/fundamentals/open_telemetry/" target="_blank">Deno OpenTelemetry documentation</a>.
