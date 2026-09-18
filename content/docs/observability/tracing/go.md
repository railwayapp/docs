---
title: Tracing for Go
description: Export OpenTelemetry traces from a Go service on Railway with the OpenTelemetry Go SDK, including net/http and Gin apps.
---

Go apps export traces to Railway with the OpenTelemetry Go SDK. Go has no zero-code agent, so you set up the SDK in `main` and wrap your HTTP handlers and clients with the instrumentation packages. For a Go service you can't modify, [automatic instrumentation](/observability/tracing/automatic-instrumentation) supports Go with full context propagation.

Before you start, [enable tracing](/observability/tracing#enable-tracing) for the service. Railway adds the `OTEL_*` variables on the next deploy, and the SDK reads them.

## Install the SDK

```bash
go get go.opentelemetry.io/otel \
  go.opentelemetry.io/otel/sdk \
  go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracehttp \
  go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp
```

## Set up the SDK

Create the exporter and tracer provider at startup, register them globally, and set the propagator. Without a propagator, the SDK ignores the `traceparent` header the edge sends, and your spans form separate traces.

```go filename="otel.go"
package main

import (
	"context"

	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracehttp"
	"go.opentelemetry.io/otel/propagation"
	sdktrace "go.opentelemetry.io/otel/sdk/trace"
)

// setupTracing configures the global tracer provider. The returned function
// flushes pending spans and must run before the process exits.
func setupTracing(ctx context.Context) (func(context.Context) error, error) {
	// Reads OTEL_EXPORTER_OTLP_ENDPOINT and OTEL_EXPORTER_OTLP_HEADERS.
	exporter, err := otlptracehttp.New(ctx)
	if err != nil {
		return nil, err
	}

	// The default resource reads OTEL_SERVICE_NAME.
	provider := sdktrace.NewTracerProvider(sdktrace.WithBatcher(exporter))
	otel.SetTracerProvider(provider)

	otel.SetTextMapPropagator(propagation.NewCompositeTextMapPropagator(
		propagation.TraceContext{},
		propagation.Baggage{},
	))

	return provider.Shutdown, nil
}
```

The exporter and the resource read the variables Railway provides, so nothing is hardcoded. The default sampler is parent-based, so the SDK follows the sampling decision in the edge's `traceparent` header.

## Instrument the server

Wrap your handler or router with `otelhttp.NewHandler`, and stop the provider on shutdown so the last batch of spans is exported:

```go filename="main.go"
package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp"
)

func main() {
	ctx := context.Background()
	shutdown, err := setupTracing(ctx)
	if err != nil {
		log.Fatal(err)
	}

	mux := http.NewServeMux()
	mux.Handle("/checkout", otelhttp.WithRouteTag("/checkout",
		http.HandlerFunc(checkoutHandler)))

	server := &http.Server{
		Addr:    ":" + os.Getenv("PORT"),
		Handler: otelhttp.NewHandler(mux, "http.server"),
	}

	go func() {
		if err := server.ListenAndServe(); err != http.ErrServerClosed {
			log.Fatal(err)
		}
	}()

	// Railway sends SIGTERM when the deployment is replaced.
	stop := make(chan os.Signal, 1)
	signal.Notify(stop, syscall.SIGTERM, syscall.SIGINT)
	<-stop

	ctx, cancel := context.WithTimeout(ctx, 10*time.Second)
	defer cancel()
	server.Shutdown(ctx)
	shutdown(ctx)
}
```

`otelhttp.NewHandler` produces a server span per request and extracts the trace context from the incoming headers. `otelhttp.WithRouteTag` sets the `http.route` attribute for a route, which gives you searchable, low-cardinality route names.

### Gin

For Gin, use the `otelgin` middleware instead of wrapping the handler:

```bash
go get go.opentelemetry.io/contrib/instrumentation/github.com/gin-gonic/gin/otelgin
```

```go
router := gin.Default()
router.Use(otelgin.Middleware(os.Getenv("OTEL_SERVICE_NAME")))
```

The middleware names each span after the matched route and sets `http.route` from Gin's route pattern. Equivalent packages exist for Echo (`otelecho`), Gorilla Mux (`otelmux`), and gRPC (`otelgrpc`) in the <a href="https://github.com/open-telemetry/opentelemetry-go-contrib/tree/main/instrumentation" target="_blank">contrib repository</a>.

## Instrument outgoing requests

Wrap the transport of your HTTP client so outgoing calls produce client spans and carry the trace context to the callee:

```go
client := &http.Client{
	Transport: otelhttp.NewTransport(http.DefaultTransport),
}

req, _ := http.NewRequestWithContext(ctx, "GET", url, nil)
resp, err := client.Do(req)
```

Pass the request's `context.Context` through your code and into `http.NewRequestWithContext`. The span for the outgoing call is a child of whatever span is in the context.

## Add a custom span

```go
import "go.opentelemetry.io/otel"

var tracer = otel.Tracer("checkout")

func calculateTotal(ctx context.Context, cart Cart) (int, error) {
	ctx, span := tracer.Start(ctx, "calculate-total")
	defer span.End()

	span.SetAttributes(attribute.Int("cart.items", len(cart.Items)))
	total, err := priceItems(ctx, cart)
	if err != nil {
		span.RecordError(err)
		span.SetStatus(codes.Error, err.Error())
	}
	return total, err
}
```

`attribute` is `go.opentelemetry.io/otel/attribute` and `codes` is `go.opentelemetry.io/otel/codes`. Always pass `ctx` on, so child spans nest under this one.

## Verify

1. Deploy the service and send it a few requests.
2. Open the **Traces** page. In the **Tracing setup** panel, the **App** indicator for the service turns green when its first span arrives.
3. Open a trace. The request's server span and any child spans appear under the edge and proxy spans.

If spans from the app don't arrive, see [Troubleshooting](/observability/tracing#troubleshooting).
