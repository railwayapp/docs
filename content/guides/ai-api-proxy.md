---
title: Deploy an AI API Gateway
description: Deploy LiteLLM Proxy on Railway as a unified gateway for multiple LLM providers. Covers model routing, cost tracking, API key management, caching with Redis, and private networking.
date: "2026-04-14"
tags:
  - gateway
  - api
  - proxy
  - python
topic: ai
---

As AI applications scale, managing multiple LLM providers becomes complex. Different services may use different providers, API keys rotate, costs are hard to track, and a single provider outage can take down your entire application.

An AI API gateway sits between your services and LLM providers. It provides a single endpoint with a unified API, model routing, cost tracking, rate limiting, and provider failover.

[LiteLLM Proxy](https://docs.litellm.ai/docs/simple_proxy) is the most widely used open-source option. It exposes an OpenAI-compatible API that routes requests to 100+ LLM providers.

## Architecture

- **LiteLLM Proxy** runs as a Railway service with no public domain. Other services in the project call it over [private networking](/networking/private-networking).
- **Redis** (optional) provides response caching to reduce API costs and latency.
- **Postgres** (optional) stores request logs and cost data for analytics.

Your application services send requests to the proxy's internal URL instead of directly to OpenAI, Anthropic, or other providers.

## Prerequisites

- A Railway account
- API keys for one or more LLM providers

## 1. Create the proxy repository

Create a new repository with two files:

**litellm_config.yaml:**

```yaml
model_list:
  - model_name: gpt-4o
    litellm_params:
      model: openai/gpt-4o
      api_key: os.environ/OPENAI_API_KEY

  - model_name: claude-sonnet
    litellm_params:
      model: anthropic/claude-sonnet-4-20250514
      api_key: os.environ/ANTHROPIC_API_KEY

  - model_name: gpt-4o-mini
    litellm_params:
      model: openai/gpt-4o-mini
      api_key: os.environ/OPENAI_API_KEY
```

**Dockerfile:**

```dockerfile
FROM ghcr.io/berriai/litellm:main-latest
COPY litellm_config.yaml /app/config.yaml
CMD ["--config", "/app/config.yaml", "--port", "8000", "--host", "0.0.0.0"]
```

## 2. Deploy the proxy

1. Create a new [project](/projects) on Railway.
2. Click **+ New > GitHub Repo** and select your proxy repository.
3. Set the following environment variables on the proxy service:

| Variable | Value |
| --- | --- |
| `OPENAI_API_KEY` | Your OpenAI API key |
| `ANTHROPIC_API_KEY` | Your Anthropic API key |
| `LITELLM_MASTER_KEY` | A secret key for proxy admin access |

4. Railway builds the Dockerfile and starts the proxy.

## 3. Keep the proxy internal

The proxy should not be publicly accessible. Do not generate a public domain for it. Other services in the same project reach it via [private networking](/networking/private-networking) at:

```
http://litellm-proxy.railway.internal:PORT
```

Replace `litellm-proxy` with your service name and `PORT` with the port number shown in the service's networking settings.

## 4. Connect your services

Update your application services to point at the proxy instead of directly at LLM providers. Since LiteLLM exposes an OpenAI-compatible API, you only need to change the base URL:

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://litellm-proxy.railway.internal:8000/v1",
    api_key="your-litellm-master-key",
)

response = client.chat.completions.create(
    model="gpt-4o",  # Routed by the proxy to the configured provider
    messages=[{"role": "user", "content": "Hello"}],
)
```

Any OpenAI SDK client (Python, Node.js, Go) works with the proxy by changing `base_url`.

## 5. Add Redis for caching

Response caching reduces costs by returning cached results for identical requests:

1. Add [Redis](/databases/redis) to your project.
2. Add the Redis connection to the proxy's environment variables:

| Variable | Value |
| --- | --- |
| `REDIS_HOST` | `${{Redis.REDISHOST}}` |
| `REDIS_PORT` | `${{Redis.REDISPORT}}` |
| `REDIS_PASSWORD` | `${{Redis.REDISPASSWORD}}` |

3. Enable caching in your `litellm_config.yaml`:

```yaml
litellm_settings:
  cache: true
  cache_params:
    type: redis
```

## 6. Track costs

LiteLLM logs request metadata including token counts and estimated costs. To persist this data, add [Postgres](/databases/postgresql) and set:

| Variable | Value |
| --- | --- |
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` |

LiteLLM automatically creates its logging tables on first connection. Access cost data through the LiteLLM admin UI or query the database directly.

## Next steps

- [Deploy an AI-Powered SaaS App](/guides/deploy-ai-saas): Build a product that uses the gateway.
- [Private Networking](/networking/private-networking): How services communicate within a project.
- [Redis on Railway](/databases/redis): Persistence settings and memory management.
- [PostgreSQL on Railway](/databases/postgresql): Connection pooling, backups, and configuration.
