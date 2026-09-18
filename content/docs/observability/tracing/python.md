---
title: Tracing for Python
description: Export OpenTelemetry traces from a Python service on Railway, including FastAPI, Flask, and Django apps.
---

Python apps export traces to Railway with the OpenTelemetry Python distribution. Its `opentelemetry-instrument` command wraps your start command and activates instrumentation for the frameworks and libraries you have installed, so most apps need no code changes.

Before you start, [enable tracing](/observability/tracing#enable-tracing) for the service. Railway adds the `OTEL_*` variables on the next deploy, and the SDK reads them.

## Install the SDK

Install the distribution and the OTLP exporter, then let the bootstrap command detect your libraries:

```bash
pip install opentelemetry-distro opentelemetry-exporter-otlp
opentelemetry-bootstrap -a install
```

`opentelemetry-bootstrap` looks at the packages in your environment and installs the matching instrumentation packages, for example `opentelemetry-instrumentation-fastapi` or `opentelemetry-instrumentation-psycopg2`. Run it locally and add the packages it installs to `requirements.txt` (or your `pyproject.toml`), so they're installed during the Railway build. Run `opentelemetry-bootstrap` without `-a install` to print the list instead of installing it.

## Set the start command

Prefix the [start command](/builds/build-and-start-commands) of the service with `opentelemetry-instrument`. For a FastAPI app served by Uvicorn:

```bash
opentelemetry-instrument uvicorn main:app --host 0.0.0.0 --port $PORT
```

For a Flask app served by Gunicorn:

```bash
opentelemetry-instrument gunicorn app:app --bind 0.0.0.0:$PORT
```

For a Django project served by Gunicorn:

```bash
opentelemetry-instrument gunicorn mysite.wsgi --bind 0.0.0.0:$PORT
```

The Django instrumentation needs the `DJANGO_SETTINGS_MODULE` variable set on the service, for example `mysite.settings`.

`opentelemetry-instrument` configures the SDK from environment variables. Besides the variables Railway provides, set these two on the service. The distribution exports metrics by default, and Railway's receiver accepts traces only:

```plaintext
OTEL_METRICS_EXPORTER=none
OTEL_LOGS_EXPORTER=none
```

## Frameworks

FastAPI, Starlette, Flask, and Django are instrumented by their packages. Each incoming request produces a server span named after the method and route, with `http.route` and `http.response.status_code` attributes. The instrumentation reads the `traceparent` header the edge sends, so the span joins the edge's trace.

Outgoing calls made with `requests`, `httpx`, `urllib3`, or `aiohttp` produce client spans and carry the trace context to the callee. Database clients such as `psycopg2`, `asyncpg`, `SQLAlchemy`, `redis`, and `pymongo` produce client spans with the statement or command.

## Add a custom span

Wrap the work you care about in your own span with the OpenTelemetry API:

```python
from opentelemetry import trace

tracer = trace.get_tracer("checkout")


def calculate_total(cart):
    with tracer.start_as_current_span("calculate-total") as span:
        span.set_attribute("cart.items", len(cart.items))
        return price_items(cart)
```

The span becomes a child of the request span that's active when the function runs. An exception raised inside the `with` block marks the span as an error and records the exception as an event.

## Verify

1. Deploy the service and send it a few requests.
2. Open the **Traces** page. In the **Tracing setup** panel, the **App** indicator for the service turns green when its first span arrives.
3. Open a trace. The request's server span and any child spans appear under the edge and proxy spans.

If spans from the app don't arrive, see [Troubleshooting](/observability/tracing#troubleshooting). Set `OTEL_LOG_LEVEL=debug` on the service to have the SDK log its configuration and export attempts.
