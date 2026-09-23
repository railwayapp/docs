---
title: Tracing for Functions
description: Export OpenTelemetry traces from a Railway function, a single-file Bun service, with the OpenTelemetry JavaScript SDK.
---

[Functions](/functions) run one file of TypeScript on the Bun runtime. Bun doesn't have OpenTelemetry built in, and [automatic instrumentation](/observability/tracing/automatic-instrumentation) doesn't support Bun, so a function exports spans with the OpenTelemetry JavaScript SDK from inside its single file. The SDK reads the variables Railway provides, and a few lines wrap the requests the function handles and makes.

Before you start, [enable tracing](/observability/tracing#enable-tracing) for the function. Railway adds the `OTEL_*` variables on the next deploy, and the SDK reads them.

## How a function differs from a service

A function has no repository, build step, or start command. Railway writes the file to `index.tsx`, turns its imports into a `package.json`, installs the packages with `bun install` at every start, and runs the file with Bun. This changes how you add the SDK:

- The SDK setup lives at the top of the same file. There is no `--require` flag, `--preload` option, or `bunfig.toml` to load it separately. That works because the SDK doesn't patch any library. It only needs to start before the function serves its first request.
- Packages are pinned in the import specifier, for example `import { Hono } from "hono@4"`. Pin the SDK the same way. Each package you import adds to the time the function takes to start.
- No OpenTelemetry package instruments `Bun.serve`, Bun's `fetch`, `Bun.sql`, or `Bun.redis`. The SDK gives you the exporter, the resource, and context propagation. The spans come from the Hono middleware or from a wrapper you write, as shown below.
- Saving the code is a deploy, so the save that adds the SDK is also the deploy that picks up the `OTEL_*` variables.

## Set up the SDK

Import the SDK and start it before anything else in the file:

```typescript
import { NodeSDK } from "@opentelemetry/sdk-node@0.222.0";

const sdk = new NodeSDK();
sdk.start();
process.on("SIGTERM", () => sdk.shutdown().finally(() => process.exit(0)));
```

`NodeSDK` reads `OTEL_EXPORTER_OTLP_ENDPOINT`, `OTEL_EXPORTER_OTLP_PROTOCOL`, `OTEL_EXPORTER_OTLP_HEADERS`, `OTEL_SERVICE_NAME`, and the sampler variables from the variables Railway provides, and exports over OTLP/HTTP. Don't pass an endpoint or a service name in code. The `SIGTERM` handler exports the last batch of spans when Railway replaces the deployment.

The SDK also exports metrics and logs to the same endpoint by default, and Railway's receiver accepts traces only. Set these two variables on the function:

```plaintext
OTEL_METRICS_EXPORTER=none
OTEL_LOGS_EXPORTER=none
```

The SDK package has no stable major version, so pin it to an exact version as shown and update it deliberately. `@opentelemetry/api`, `hono`, and `@hono/otel` follow semantic versioning and can be pinned to a major.

## Instrument incoming requests

The edge sends a `traceparent` header with each request it traces. The middleware or wrapper below reads it, so the function's spans continue the edge's trace instead of starting their own.

### Hono

For a function built on Hono, add the `@hono/otel` middleware. It records one server span per request, named after the method and route, with `http.route` and `http.response.status_code` attributes, and marks responses with a 5xx status as errors.

```typescript
import { NodeSDK } from "@opentelemetry/sdk-node@0.222.0";
import { Hono } from "hono@4";
import { httpInstrumentationMiddleware } from "@hono/otel@1";

const sdk = new NodeSDK();
sdk.start();
process.on("SIGTERM", () => sdk.shutdown().finally(() => process.exit(0)));

const app = new Hono();
app.use(httpInstrumentationMiddleware());

app.get("/hello/:name", (c) => c.json({ greeting: `Hello, ${c.req.param("name")}` }));

export default { port: Number(Bun.env.PORT ?? 3000), fetch: app.fetch };
```

### Bun.serve

For a function that calls `Bun.serve` directly, wrap the `fetch` handler. The wrapper extracts the parent context from the request headers, opens a server span around the handler, and records the response status:

```typescript
import { NodeSDK } from "@opentelemetry/sdk-node@0.222.0";
import { context, propagation, trace, SpanKind, SpanStatusCode } from "@opentelemetry/api@1";

const sdk = new NodeSDK();
sdk.start();
process.on("SIGTERM", () => sdk.shutdown().finally(() => process.exit(0)));

const tracer = trace.getTracer("webhook");

async function handle(req: Request): Promise<Response> {
  const url = new URL(req.url);
  if (req.method === "POST" && url.pathname === "/webhook") {
    const event = await req.json();
    return Response.json({ received: event.id });
  }
  return new Response("Not found", { status: 404 });
}

Bun.serve({
  port: Number(Bun.env.PORT ?? 3000),
  fetch(req) {
    const url = new URL(req.url);
    const parent = propagation.extract(context.active(), req.headers, {
      get: (headers, key) => headers.get(key) ?? undefined,
      keys: (headers) => [...headers.keys()],
    });
    return tracer.startActiveSpan(
      `${req.method} ${url.pathname}`,
      {
        kind: SpanKind.SERVER,
        attributes: { "http.request.method": req.method, "url.path": url.pathname },
      },
      parent,
      async (span) => {
        try {
          const res = await handle(req);
          span.setAttribute("http.response.status_code", res.status);
          if (res.status >= 500) {
            span.setStatus({ code: SpanStatusCode.ERROR });
          }
          return res;
        } catch (err) {
          span.recordException(err as Error);
          span.setStatus({ code: SpanStatusCode.ERROR });
          throw err;
        } finally {
          span.end();
        }
      },
    );
  },
});
```

## Trace outgoing requests

Bun's `fetch` doesn't add the `traceparent` header on its own, so a call to another Railway service starts a separate trace there. Wrap `fetch` to record a client span and inject the trace context. The other service's spans then appear under the function's span in the same trace.

```typescript
import { context, propagation, trace, SpanKind, SpanStatusCode } from "@opentelemetry/api@1";

const tracer = trace.getTracer("storefront");

async function tracedFetch(input: string | URL, init: RequestInit = {}): Promise<Response> {
  const url = new URL(input);
  const method = init.method ?? "GET";
  return tracer.startActiveSpan(
    `${method} ${url.host}`,
    {
      kind: SpanKind.CLIENT,
      attributes: { "http.request.method": method, "url.full": url.href, "server.address": url.hostname },
    },
    async (span) => {
      const headers = new Headers(init.headers);
      propagation.inject(context.active(), headers, { set: (h, key, value) => h.set(key, value) });
      try {
        const res = await fetch(url, { ...init, headers });
        span.setAttribute("http.response.status_code", res.status);
        if (res.status >= 400) {
          span.setStatus({ code: SpanStatusCode.ERROR });
        }
        return res;
      } catch (err) {
        span.recordException(err as Error);
        span.setStatus({ code: SpanStatusCode.ERROR });
        throw err;
      } finally {
        span.end();
      }
    },
  );
}

app.get("/stock/:sku", async (c) => {
  const res = await tracedFetch(`http://inventory.railway.internal:8080/stock/${c.req.param("sku")}`);
  return c.json(await res.json());
});
```

Call `tracedFetch` from inside a request handler or a span, as above. The client span becomes a child of whichever span is active when it runs.

## Add a custom span

Wrap the work you care about in your own span with the OpenTelemetry API. The span becomes a child of the request span that's active when the function runs, so it appears nested in the trace, and the attributes you set are searchable on the Traces page, for example with `@cart.items:>10`.

```typescript
import { trace, SpanStatusCode } from "@opentelemetry/api@1";

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

## Cron and script functions

A function with a [cron schedule](/cron-jobs), or one that runs to completion without serving requests, receives no request from the edge. Its spans start a new trace on each run. When the project sets a sample rate, the sampler variables make the SDK record these traces at that rate. Without one, every run is recorded.

The process exits as soon as the script finishes, before the SDK's batch processor exports on its own. Shut the SDK down at the end so the spans leave the process:

```typescript
import { NodeSDK } from "@opentelemetry/sdk-node@0.222.0";
import { trace } from "@opentelemetry/api@1";

const sdk = new NodeSDK();
sdk.start();

const tracer = trace.getTracer("cleanup");

await tracer.startActiveSpan("delete-expired-sessions", async (span) => {
  try {
    const deleted = await deleteExpiredSessions();
    span.setAttribute("sessions.deleted", deleted);
  } finally {
    span.end();
  }
});

await sdk.shutdown();
```

Find these traces on the Traces page with `@service:<function name>`. They have no edge span, so a filter on `@component:edge` doesn't match them.

## Verify

1. Deploy the function and send it a few requests.
2. Open the **Traces** page. In the **Tracing setup** panel, the **App** indicator for the function turns green when its first span arrives.
3. Open a trace. The request span from the middleware or your wrapper, and any child spans, appear under the edge and proxy spans.

If spans from the function don't arrive, read the deploy logs first. A failed `bun install` means an import specifier is wrong, and export errors for metrics or logs mean the two `none` variables are missing. Then see [Troubleshooting](/observability/tracing#troubleshooting).
