---
title: Stripe Provisioning
description: Provision Railway databases, hosting, and storage directly from Stripe using the Agentic Provisioning Protocol.
---

Railway is available as a provider in the Stripe marketplace. Developers can provision Railway infrastructure directly from the Stripe CLI or dashboard using the Agentic Provisioning Protocol (APP).

## Getting Started

Install the Stripe CLI and the projects plugin:

```bash
stripe plugin install projects
stripe projects init
```

Browse available Railway services:

```bash
stripe projects catalog railway
```

Provision a resource:

```bash
stripe projects add railway/postgres --name my-database
stripe projects add railway/hosting --config '{"repo":"docker/welcome-to-docker"}'
```

View credentials:

```bash
stripe projects env
stripe projects env --reveal
```

## Available Services

### Plans

| Service | Pricing | Description |
|---------|---------|-------------|
| `free` | Free | Trial plan — 500h compute, 512 MB RAM, 1 GB disk |
| `hobby` | $5/mo + usage | For individual developers |
| `pro` | $20/seat/mo + usage | For teams and production workloads |

### Deployable Services

| Service | Category | Description |
|---------|----------|-------------|
| `postgres` | Database | Managed PostgreSQL |
| `redis` | Cache | Managed Redis |
| `mongo` | Database | Managed MongoDB |
| `hosting` | Compute | Deploy a GitHub repo or Docker image |
| `bucket` | Storage | S3-compatible object storage (Tigris) |

Deployable services are components of a plan. Provision a plan first, then add deployable services.

## Connecting to Databases

After provisioning, credentials are available via `stripe projects env --reveal`. Use the `connection_string` to connect from outside Railway:

```bash
# PostgreSQL
psql "postgresql://postgres:PASSWORD@HOST:PORT/railway"

# Redis
redis-cli -u "redis://default:PASSWORD@HOST:PORT"
```

Connection strings use Railway's public TCP proxy, accessible from anywhere. For lower latency in production, deploy your application on Railway alongside the database to use [private networking](/reference/private-networking).

## Hosting Configuration

Provision a GitHub repository:

```bash
stripe projects add railway/hosting --config '{"repo":"owner/repo"}'
```

Deploy a specific branch:

```bash
stripe projects add railway/hosting --config '{"repo":"owner/repo","branch":"staging"}'
```

Deploy a Docker image:

```bash
stripe projects add railway/hosting --config '{"image":"nginx:latest"}'
```

After provisioning, the service receives a public URL like `https://my-app-production.up.railway.app`.

## Management

### Credential Rotation

```bash
stripe projects rotate railway-redis
```

### Resource Removal

```bash
stripe projects remove railway-postgres
```

### Dashboard Access

Each provisioned resource has a Railway dashboard link in its access configuration. Visit the dashboard for advanced management: logs, metrics, scaling, environment variables, and more.

## Extended API

Railway provides management endpoints beyond the standard provisioning protocol. These are available to AI agents after provisioning.

Available operations include:
- **Environment variables** — set, get, delete variables on hosting services
- **Domain management** — generate Railway public domains
- **Scaling** — set replica count (1–100)
- **Redeploy / Restart** — trigger rebuilds or container restarts
- **Logs** — fetch recent log output
- **Configuration updates** — change deployed image or branch
