---
title: Tracing for Ruby
description: Export OpenTelemetry traces from a Ruby service on Railway with the OpenTelemetry Ruby SDK, including Rails apps.
---

Ruby apps export traces to Railway with the OpenTelemetry Ruby SDK. The `opentelemetry-instrumentation-all` gem instruments Rails, Rack, Sinatra, ActiveRecord, Net::HTTP, Redis, Sidekiq, and more, so a small initializer is all most apps need.

Before you start, [enable tracing](/observability/tracing#enable-tracing) for the service. Railway adds the `OTEL_*` variables on the next deploy, and the SDK reads them.

## Install the gems

Add the SDK, the OTLP exporter, and the instrumentation bundle to your `Gemfile`:

```ruby filename="Gemfile"
gem "opentelemetry-sdk"
gem "opentelemetry-exporter-otlp"
gem "opentelemetry-instrumentation-all"
```

Then run `bundle install`.

## Configure the SDK

Create an initializer that configures the SDK and enables every instrumentation with a matching library:

```ruby filename="config/initializers/opentelemetry.rb"
require "opentelemetry/sdk"
require "opentelemetry/exporter/otlp"
require "opentelemetry/instrumentation/all"

OpenTelemetry::SDK.configure do |c|
  c.use_all
end
```

The SDK reads `OTEL_SERVICE_NAME` for the service name and the OTLP exporter reads `OTEL_EXPORTER_OTLP_ENDPOINT` and `OTEL_EXPORTER_OTLP_HEADERS`, so nothing is hardcoded. The exporter speaks OTLP over HTTP with protobuf, which matches the protocol Railway sets. The SDK exports traces only, so no other variables are needed.

For an app that isn't Rails, put the same code where your app boots, before it starts handling requests. To enable only some instrumentations, call `c.use "OpenTelemetry::Instrumentation::Rack"` and friends instead of `c.use_all`.

## Rails

Each incoming request produces a server span named after the HTTP method and the Rails route, with `http.route` and `http.response.status_code` attributes. The Rack instrumentation reads the `traceparent` header the edge sends, so the span joins the edge's trace. Controller actions, view rendering, and ActiveRecord queries appear as child spans.

Outgoing calls made with `Net::HTTP`, `Faraday`, or `HTTParty` produce client spans and carry the trace context to the callee. Jobs enqueued with Sidekiq or ActiveJob are linked to the enqueuing request's trace.

## Add a custom span

```ruby
tracer = OpenTelemetry.tracer_provider.tracer("checkout")

def calculate_total(cart)
  tracer.in_span("calculate-total") do |span|
    span.set_attribute("cart.items", cart.items.size)
    price_items(cart)
  end
end
```

The span becomes a child of the request span that's active when the method runs. An exception raised inside the block marks the span as an error and records the exception as an event.

## Verify

1. Deploy the service and send it a few requests.
2. Open the **Traces** page. In the **Tracing setup** panel, the **App** indicator for the service turns green when its first span arrives.
3. Open a trace. The request's server span and any child spans appear under the edge and proxy spans.

If spans from the app don't arrive, see [Troubleshooting](/observability/tracing#troubleshooting). Set `OTEL_LOG_LEVEL=debug` on the service to have the SDK log its configuration and export attempts.
