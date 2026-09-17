---
title: Tracing for .NET
description: Export OpenTelemetry traces from a .NET service on Railway with the OpenTelemetry .NET SDK, including ASP.NET Core apps.
---

.NET apps export traces to Railway with the OpenTelemetry .NET SDK. A few lines in `Program.cs` instrument ASP.NET Core, `HttpClient`, and the libraries you add instrumentation packages for.

Before you start, [enable tracing](/observability/tracing#enable-tracing) for the service. Railway adds the `OTEL_*` variables on the next deploy, and the SDK reads them.

## Install the packages

```bash
dotnet add package OpenTelemetry.Extensions.Hosting
dotnet add package OpenTelemetry.Instrumentation.AspNetCore
dotnet add package OpenTelemetry.Instrumentation.Http
dotnet add package OpenTelemetry.Exporter.OpenTelemetryProtocol
```

Add instrumentation packages for the libraries you use, for example `Npgsql.OpenTelemetry` for PostgreSQL, `OpenTelemetry.Instrumentation.SqlClient` for SQL Server, or `OpenTelemetry.Instrumentation.StackExchangeRedis` for Redis.

## Configure the SDK

Register OpenTelemetry in `Program.cs`:

```csharp filename="Program.cs"
using OpenTelemetry.Trace;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenTelemetry()
    .WithTracing(tracing => tracing
        .AddAspNetCoreInstrumentation()
        .AddHttpClientInstrumentation()
        .AddOtlpExporter());

var app = builder.Build();
```

The OTLP exporter reads `OTEL_EXPORTER_OTLP_ENDPOINT`, `OTEL_EXPORTER_OTLP_PROTOCOL`, and `OTEL_EXPORTER_OTLP_HEADERS`, and the default resource reads `OTEL_SERVICE_NAME`, so nothing is hardcoded. With `WithTracing` alone, the SDK exports traces only.

Register instrumentation packages on the same builder, for example `.AddNpgsql()` or `.AddSqlClientInstrumentation()`.

## ASP.NET Core

Each incoming request produces a server span named after the HTTP method and the matched route, with `http.route` and `http.response.status_code` attributes. ASP.NET Core reads the `traceparent` header the edge sends, so the span joins the edge's trace. Calls made with `HttpClient` produce client spans and carry the trace context to the callee.

## Add a custom span

.NET's `ActivitySource` is the OpenTelemetry tracing API. Register the source name with the SDK, then create activities around the work you care about:

```csharp
using System.Diagnostics;

public class CheckoutService
{
    private static readonly ActivitySource Source = new("Checkout");

    public int CalculateTotal(Cart cart)
    {
        using var activity = Source.StartActivity("calculate-total");
        activity?.SetTag("cart.items", cart.Items.Count);
        return PriceItems(cart);
    }
}
```

Add `.AddSource("Checkout")` to the tracing builder in `Program.cs` so the SDK exports activities from this source. The activity becomes a child of the request's activity.

## Zero-code alternative

To instrument an app without changing its code, use the <a href="https://opentelemetry.io/docs/zero-code/dotnet/nuget-packages/" target="_blank">OpenTelemetry.AutoInstrumentation NuGet package</a>. It adds an `instrument.sh` launcher to the build output, which you run in front of your start command:

```bash
./instrument.sh dotnet MyApp.dll
```

The auto-instrumentation exports metrics and logs by default, and Railway's receiver accepts traces only, so set these variables on the service:

```plaintext
OTEL_METRICS_EXPORTER=none
OTEL_LOGS_EXPORTER=none
```

## Verify

1. Deploy the service and send it a few requests.
2. Open the **Traces** page. In the **Tracing setup** panel, the **App** indicator for the service turns green when its first span arrives.
3. Open a trace. The request's server span and any child spans appear under the edge and proxy spans.

If spans from the app don't arrive, see [Troubleshooting](/observability/tracing#troubleshooting).
