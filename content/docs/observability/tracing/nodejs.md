---
title: Tracing for Node.js
description: Export OpenTelemetry traces from a Node.js service on Railway, including Express, Fastify, NestJS, and Next.js apps.
---

Node.js apps export traces to Railway with the OpenTelemetry Node.js SDK. Its auto-instrumentation covers the HTTP server, outgoing requests, and popular libraries, so most apps need no code changes beyond a start command.

Before you start, [enable tracing](/observability/tracing#enable-tracing) for the service. Railway adds the `OTEL_*` variables on the next deploy, and the SDK reads them.

## Install the SDK

```bash
npm install @opentelemetry/api @opentelemetry/auto-instrumentations-node
```

The auto-instrumentation package bundles instrumentations for the `http` module, Express, Fastify, Koa, Hapi, NestJS, `pg`, `mysql2`, `ioredis`, `mongodb`, and more. Each one activates only when the matching library is present.

## Set the start command

The SDK must load before the libraries it instruments. For an app written as ECMAScript modules, set the [start command](/builds/build-and-start-commands) of the service to load the register module with `--import`, together with the loader hook that lets the SDK patch `import` statements:

```bash
node --experimental-loader=@opentelemetry/instrumentation/hook.mjs \
  --import @opentelemetry/auto-instrumentations-node/register server.js
```

For an app written as CommonJS, `--require` is enough:

```bash
node --require @opentelemetry/auto-instrumentations-node/register server.js
```

If you'd rather leave the start command alone, put the same flags in `NODE_OPTIONS` as a service variable instead:

```plaintext
NODE_OPTIONS=--experimental-loader=@opentelemetry/instrumentation/hook.mjs --import @opentelemetry/auto-instrumentations-node/register
```

The register module configures the SDK from environment variables alone. Besides the variables Railway provides, set these two on the service. The SDK exports metrics and logs by default, and Railway's receiver accepts traces only:

```plaintext
OTEL_METRICS_EXPORTER=none
OTEL_LOGS_EXPORTER=none
```

The loader hook is the supported way to instrument ESM today. See the <a href="https://github.com/open-telemetry/opentelemetry-js/blob/main/doc/esm-support.md" target="_blank">ESM support notes</a> in the OpenTelemetry JavaScript repository for the current status, including TypeScript projects run with `tsx`.

## Frameworks

Express, Fastify, Koa, Hapi, and NestJS are instrumented by the bundle. Each incoming request produces a server span named after the method and matched route, with `http.route` and `http.response.status_code` attributes, plus child spans for the middleware and handlers the framework runs.

Hono on `@hono/node-server` is served by Node's `http` module, so the `http` instrumentation produces a server span per request without a route attribute.

### Next.js

Next.js instruments itself and loads the SDK through its `instrumentation.ts` file, so don't use the `--require` start command. Install the packages Next.js recommends:

```bash
npm install @vercel/otel @opentelemetry/sdk-logs @opentelemetry/api-logs @opentelemetry/instrumentation
```

Create `instrumentation.ts` in the root of the project (or in `src` if you use one):

```typescript filename="instrumentation.ts"
import { registerOTel } from "@vercel/otel";

export function register() {
  registerOTel();
}
```

`@vercel/otel` reads `OTEL_SERVICE_NAME` and the `OTEL_EXPORTER_OTLP_*` variables Railway provides and exports over OTLP/HTTP. Each request produces a root span named after the method and route, with child spans for rendering, route handlers, and `fetch` calls. Set `NEXT_OTEL_VERBOSE=1` to record more spans.

## Add a custom span

Auto-instrumentation gives you one span per request and per library call. Wrap the work you care about in your own span with the OpenTelemetry API:

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

The span becomes a child of the request span that's active when the function runs, so it appears nested in the trace. Attributes you set are searchable on the Traces page, for example with `@cart.items:>10`.

## Verify

1. Deploy the service and send it a few requests.
2. Open the **Traces** page. In the **Tracing setup** panel, the **App** indicator for the service turns green when its first span arrives.
3. Open a trace. The request's server span and any child spans appear under the edge and proxy spans.

If spans from the app don't arrive, see [Troubleshooting](/observability/tracing#troubleshooting).

## Flush on shutdown

Railway sends `SIGTERM` when a deployment is replaced. The register module shuts the SDK down on `SIGTERM`, which exports the last batch of spans. If you configure the SDK yourself with `NodeSDK`, call `sdk.shutdown()` from your own `SIGTERM` handler. See [Node.js SIGTERM handling](/deployments/troubleshooting/nodejs-sigterm-handling).
