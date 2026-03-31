---
title: Deploy a Docker Compose App to Production
description: Map a Docker Compose configuration to Railway services. Covers service mapping, networking, volumes, environment variables, and databases.
date: "2026-03-30"
tags:
  - deployment
  - docker
  - docker-compose
  - infrastructure
topic: integrations
---

Railway does not run `docker-compose.yml` files directly. Instead, each service defined in your Compose file maps to a separate Railway service within a project. The sections below walk through that translation so you can take an existing Compose setup and deploy it to production without managing servers.

## How Compose maps to Railway

| Compose concept | Railway equivalent |
|---|---|
| `services:` entry | Railway service |
| `build:` | Deploy from GitHub repo with a Dockerfile |
| `image:` | Deploy from a Docker image |
| `ports:` | [Public networking](/networking/public-networking) (external) or automatic [private networking](/networking/private-networking) (internal) |
| `volumes:` | [Railway Volumes](/volumes) |
| `networks:` | Automatic private networking (no config needed) |
| `environment:` / `env_file:` | [Railway Variables](/variables) |
| `depends_on:` | No direct equivalent. Applications should handle connection retries at startup. |

## Prerequisites

- A working `docker-compose.yml`
- A Railway account
- The [Railway CLI](/cli) installed (optional, but useful for setting variables)

## 1. Create a Railway project

Open the <a href="https://railway.com/dashboard" target="_blank">Railway dashboard</a> and click **+ New Project**. Choose **Empty project**. This project will hold all of the services that correspond to your Compose file.

## 2. Add services

Work through each entry under `services:` in your Compose file and create a matching Railway service.

### Services with a Dockerfile or build context

If a Compose service uses `build:`, it has source code and a Dockerfile. To deploy it on Railway:

1. Push the code to a GitHub repository.
2. In your Railway project, click **+ New** and select **GitHub Repo**.
3. Choose the repository and branch.
4. If the Dockerfile is not in the repository root, set the **Root Directory** or add a **Dockerfile Path** in the service settings under **Build Configuration**.

Railway will build the image from the Dockerfile on every push to the selected branch.

### Services using a Docker image

If a Compose service uses `image:` (for example, `image: redis:7-alpine`), deploy it as follows:

1. In your Railway project, click **+ New** and select **Docker Image**.
2. Enter the image name and tag, such as `redis:7-alpine`.

### Database services

For common databases like Postgres, MySQL, Redis, and MongoDB, use Railway's managed database services instead of raw Docker images. Managed databases include automatic backups, connection pooling, and a dashboard.

1. In your Railway project, click **+ New** and select **Database**.
2. Choose the database type (Postgres, MySQL, Redis, or MongoDB).

Railway provisions the database and exposes connection variables automatically. This replaces Compose services like:

```yaml
db:
  image: postgres:16
  environment:
    - POSTGRES_DB=myapp
    - POSTGRES_USER=user
    - POSTGRES_PASSWORD=pass
```

See the [databases documentation](/databases) for more detail.

## 3. Configure environment variables

Compose files define environment variables in `environment:` blocks or reference external files with `env_file:`. On Railway:

- Open a service's **Variables** tab.
- Add each variable individually, or click **Raw Editor** to paste multiple variables at once (one `KEY=VALUE` per line).

For variables that reference another service (for example, a `DATABASE_URL` that points to Postgres), use Railway [reference variables](/variables#referencing-another-services-variable). Reference variables stay in sync when connection details change.

Example: instead of hardcoding `DATABASE_URL=postgres://user:pass@db:5432/myapp`, create a reference variable that pulls the value from the Postgres service's `DATABASE_URL` variable.

## 4. Set up networking

### Private networking

In a Compose file, services communicate over a shared Docker network using the service name as the hostname. Railway works similarly. Every service in a project can reach other services over the private network at:

```
<service-name>.railway.internal
```

No manual network configuration is needed. Private networking is automatic. See [Private Networking](/networking/private-networking) for details.

**Note:** Use the port your application actually listens on when connecting over the private network. There is no port mapping layer.

### Public networking

For services that need to be reachable from the internet (for example, a web server):

1. Open the service's **Settings** tab.
2. Under **Networking**, click **Generate Domain** to get a Railway-provided domain.

This replaces the `ports:` mapping in your Compose file. See [Public Networking](/networking/public-networking#railway-provided-domain) for custom domains and other options.

## 5. Attach volumes

If your Compose file uses named volumes for persistent data, create a Railway Volume for each one:

1. Open the service's **Settings** tab.
2. Under **Volumes**, click **Add Volume**.
3. Set the **Mount Path** to match the path in your Compose file (for example, `/var/lib/postgresql/data`).

Railway Volumes persist across deploys and restarts. Note that volumes are not available during the build step, only at runtime.

If you replaced a database image with a Railway managed database, you do not need to attach a volume. Railway handles storage for managed databases.

See [Volumes](/volumes) for more detail.

## 6. Verify the deployment

After all services are configured:

1. Check the **Deploy Logs** for each service to confirm it started without errors.
2. If you generated a public domain, open it in a browser or send a request with `curl` to verify the service responds.
3. For services that depend on a database, confirm the connection by checking logs for successful queries or running a health check endpoint.

## Example: translating a Compose file

Consider this `docker-compose.yml`:

```yaml
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgres://user:pass@db:5432/myapp
      - REDIS_URL=redis://cache:6379
    depends_on:
      - db
      - cache
  db:
    image: postgres:16
    environment:
      - POSTGRES_DB=myapp
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - pgdata:/var/lib/postgresql/data
  cache:
    image: redis:7-alpine

volumes:
  pgdata:
```

This translates to three Railway services:

**1. Postgres database (managed)**

Add a Postgres database from the Railway dashboard. Railway creates the database, provisions credentials, and exposes a `DATABASE_URL` variable. No volume configuration is needed.

**2. Redis database (managed)**

Add a Redis database from the Railway dashboard. Railway exposes a `REDIS_URL` variable automatically.

**3. Web service (from GitHub)**

Deploy from your GitHub repository. Railway detects the Dockerfile and builds the image. In the service's **Variables** tab, set:

- `DATABASE_URL` as a [reference variable](/variables#referencing-another-services-variable) pointing to the Postgres service's `DATABASE_URL`.
- `REDIS_URL` as a reference variable pointing to the Redis service's `REDIS_URL`.

Generate a public domain under **Networking** so the web service is accessible externally.

The `depends_on` directive has no Railway equivalent. If the web service starts before the database is ready, it should retry the connection. Most database client libraries and ORMs support this through connection retry configuration.

## Next steps

- [Private Networking](/networking/private-networking) - Learn how services communicate within a project.
- [Manage Volumes](/volumes) - Attach persistent storage to services.
- [Add a Database Service](/databases) - Provision managed databases.
- [Monitor your app](/observability) - View logs, metrics, and traces.
