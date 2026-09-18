---
title: Tracing for Rust
description: Export OpenTelemetry traces from a Rust service on Railway with the OpenTelemetry Rust SDK and the tracing crate, including Axum apps.
---

Rust apps export traces to Railway with the OpenTelemetry Rust SDK. Most Rust services already instrument themselves with the `tracing` crate, and the `tracing-opentelemetry` layer turns those spans into OpenTelemetry spans without changing them.

Before you start, [enable tracing](/observability/tracing#enable-tracing) for the service. Railway adds the `OTEL_*` variables on the next deploy, and the SDK reads them.

## Install the crates

```bash
cargo add opentelemetry opentelemetry_sdk opentelemetry-otlp \
  tracing tracing-opentelemetry
cargo add tracing-subscriber --features env-filter
```

The `opentelemetry-otlp` crate's default features include OTLP over HTTP with protobuf, which matches the protocol Railway sets.

## Configure the SDK

Build the exporter and tracer provider at startup, register the W3C Trace Context propagator, and add the OpenTelemetry layer to your `tracing` subscriber:

```rust filename="src/telemetry.rs"
use opentelemetry::global;
use opentelemetry::trace::TracerProvider as _;
use opentelemetry_sdk::propagation::TraceContextPropagator;
use opentelemetry_sdk::trace::SdkTracerProvider;
use tracing_subscriber::layer::SubscriberExt;
use tracing_subscriber::util::SubscriberInitExt;

pub fn init() -> SdkTracerProvider {
    // Reads OTEL_EXPORTER_OTLP_ENDPOINT, OTEL_EXPORTER_OTLP_HEADERS,
    // and OTEL_EXPORTER_OTLP_PROTOCOL from the environment.
    let exporter = opentelemetry_otlp::SpanExporter::builder()
        .with_http()
        .build()
        .expect("failed to build OTLP exporter");

    // The default resource reads OTEL_SERVICE_NAME.
    let provider = SdkTracerProvider::builder()
        .with_batch_exporter(exporter)
        .build();

    global::set_tracer_provider(provider.clone());
    global::set_text_map_propagator(TraceContextPropagator::new());

    let tracer = provider.tracer("app");
    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::from_default_env())
        .with(tracing_subscriber::fmt::layer())
        .with(tracing_opentelemetry::layer().with_tracer(tracer))
        .init();

    provider
}
```

Call `telemetry::init()` at the start of `main`, keep the returned provider, and call `provider.shutdown()` before the process exits so the last batch of spans is exported. Railway sends `SIGTERM` when a deployment is replaced, so handle it and shut down in order.

## Axum

The `tracing` spans your handlers create only join the edge's trace if something extracts the `traceparent` header from the incoming request and sets it as the parent. The <a href="https://crates.io/crates/axum-tracing-opentelemetry" target="_blank">axum-tracing-opentelemetry</a> crate does this with a layer:

```bash
cargo add axum-tracing-opentelemetry
```

```rust
use axum::Router;
use axum_tracing_opentelemetry::middleware::OtelAxumLayer;

let app = Router::new()
    .route("/checkout", axum::routing::get(checkout))
    .layer(OtelAxumLayer::default());
```

The layer produces a server span per request named after the method and matched route, with the standard HTTP attributes, and makes it the parent of everything your handler does. For outgoing requests with `reqwest`, the <a href="https://crates.io/crates/reqwest-tracing" target="_blank">reqwest-tracing</a> crate produces client spans and injects the trace context into the request headers.

## Add a custom span

Use the `tracing` macros as you already do. Every span becomes an OpenTelemetry span, and fields become attributes:

```rust
use tracing::{info_span, instrument};

#[instrument(name = "calculate-total", skip(cart), fields(cart.items = cart.items.len()))]
async fn calculate_total(cart: &Cart) -> Result<u64, Error> {
    let total = price_items(cart).await?;
    Ok(total)
}
```

To mark a span as failed, record `otel.status_code = "ERROR"` on it. The `tracing-opentelemetry` layer maps that field to the span status.

## Verify

1. Deploy the service and send it a few requests.
2. Open the **Traces** page. In the **Tracing setup** panel, the **App** indicator for the service turns green when its first span arrives.
3. Open a trace. The request's server span and any child spans appear under the edge and proxy spans.

If spans from the app don't arrive, see [Troubleshooting](/observability/tracing#troubleshooting).
