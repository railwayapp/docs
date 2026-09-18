---
title: Tracing for PHP
description: Export OpenTelemetry traces from a PHP service on Railway with the OpenTelemetry PHP extension and SDK, including Laravel apps.
---

PHP apps export traces to Railway with the OpenTelemetry PHP SDK and its auto-instrumentation packages. The `opentelemetry` PHP extension hooks into function calls, and framework packages use those hooks to trace requests without code changes.

Before you start, [enable tracing](/observability/tracing#enable-tracing) for the service. Railway adds the `OTEL_*` variables on the next deploy, and the SDK reads them.

## Install the extension

Auto-instrumentation needs the `opentelemetry` PHP extension. Install it in your Dockerfile with PECL, or with the `install-php-extensions` helper from the official PHP images:

```dockerfile filename="Dockerfile"
FROM php:8.3-cli

RUN pecl install opentelemetry \
    && docker-php-ext-enable opentelemetry
```

Check that the extension loads with `php -m | grep opentelemetry` during the build.

## Install the packages

Add the SDK, the OTLP exporter, and the auto-instrumentation package for your framework:

```bash
composer require open-telemetry/sdk \
  open-telemetry/exporter-otlp \
  open-telemetry/opentelemetry-auto-laravel
```

Use `open-telemetry/opentelemetry-auto-symfony` for Symfony or `open-telemetry/opentelemetry-auto-slim` for Slim. Add `open-telemetry/opentelemetry-auto-psr18` to trace outgoing HTTP calls made through a PSR-18 client, and `open-telemetry/opentelemetry-auto-pdo` for database queries.

## Configure the SDK

The SDK configures itself from environment variables when autoloading is enabled. Set these on the service alongside the variables Railway provides:

```plaintext
OTEL_PHP_AUTOLOAD_ENABLED=true
OTEL_TRACES_EXPORTER=otlp
```

`OTEL_EXPORTER_OTLP_ENDPOINT`, `OTEL_EXPORTER_OTLP_PROTOCOL`, `OTEL_EXPORTER_OTLP_HEADERS`, and `OTEL_SERVICE_NAME` come from Railway. The SDK exports traces only unless you enable other exporters.

## Laravel

Each incoming request produces a server span named after the HTTP method and the matched route, with `http.route` and `http.response.status_code` attributes. The instrumentation reads the `traceparent` header the edge sends, so the span joins the edge's trace. Middleware, controller actions, Eloquent queries, and queued jobs appear as child spans.

PHP exports spans at the end of each request. In a long-running process such as Laravel Octane or a queue worker, the SDK batches spans and exports them periodically.

## Add a custom span

```php
use OpenTelemetry\API\Globals;

$tracer = Globals::tracerProvider()->getTracer('checkout');

function calculateTotal(Cart $cart, $tracer): int
{
    $span = $tracer->spanBuilder('calculate-total')->startSpan();
    $scope = $span->activate();
    try {
        $span->setAttribute('cart.items', count($cart->items));
        return priceItems($cart);
    } catch (\Throwable $e) {
        $span->recordException($e);
        $span->setStatus(\OpenTelemetry\API\Trace\StatusCode::STATUS_ERROR);
        throw $e;
    } finally {
        $scope->detach();
        $span->end();
    }
}
```

The span becomes a child of the request span that's active when the function runs.

## Verify

1. Deploy the service and send it a few requests.
2. Open the **Traces** page. In the **Tracing setup** panel, the **App** indicator for the service turns green when its first span arrives.
3. Open a trace. The request's server span and any child spans appear under the edge and proxy spans.

If spans from the app don't arrive, see [Troubleshooting](/observability/tracing#troubleshooting). Set `OTEL_LOG_LEVEL=debug` on the service to have the SDK log its configuration and export attempts.
