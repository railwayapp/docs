---
title: Add Connection Pooling to Postgres with PgBouncer
description: Why Postgres needs a connection pooler, how to add PgBouncer to a Railway Postgres service, and how to configure your application for pooled and unpooled connections.
date: "2026-07-29"
tags:
  - postgres
  - pgbouncer
  - database
  - infrastructure
topic: infrastructure
---

Connection pooling puts a proxy between your application and Postgres. The proxy accepts thousands of cheap client connections and multiplexes them onto a small, fixed set of real server connections. PgBouncer is the standard tool for this.

Pooling is not built into Railway's standard Postgres template: a fresh Postgres service accepts direct connections only. To add it, you layer PgBouncer on top, either through Railway's built-in Connection Pooling feature or as a separate service you run yourself. This guide sets up both, then makes the application-side changes that pooling requires.

## Why Postgres needs a connection pooler

Every Postgres connection is a forked backend process on the server. Each one costs memory and scheduling overhead whether it is running a query or sitting idle. Postgres caps the total with `max_connections`, and once you hit the cap new clients get `FATAL: sorry, too many clients already`.

You hit this limit faster than you expect:

- **Horizontal scaling.** Ten app replicas with a pool of 20 connections each is 200 server connections doing mostly nothing.
- **Serverless and short-lived workers.** Each cold start opens fresh connections. Under a traffic spike, connection churn alone can take the database down.
- **ORMs with per-request connections.** Some frameworks open a connection per request and hold it for the request's lifetime.

PgBouncer fixes this by decoupling client count from server count: a single instance can hold 1,000 client connections open while using only 20 real connections to Postgres. Clients then queue for a free server connection instead of failing.

## Add PgBouncer with Railway's Connection Pooling feature

Railway can deploy and manage PgBouncer for you, in front of either a standalone Postgres service or a [Postgres HA cluster](/databases/postgresql-ha).

1. Open your Postgres service.
2. Go to **Database → Config → Connection Pooling**.
3. Click **Add PgBouncer**.
4. Pick a pool mode (see the next section), then deploy the staged changes.

Railway automatically rewrites variable references within your project so services that used your Postgres variables now point at PgBouncer. Connection strings hardcoded outside Railway must be updated by hand.

After deployment you get four connection variables:

| Variable | Points to | Use for |
|---|---|---|
| `DATABASE_URL` | PgBouncer, private network | Normal application queries from inside Railway |
| `DATABASE_PUBLIC_URL` | PgBouncer, TCP proxy | Connections from outside Railway |
| `DATABASE_UNPOOLED_URL` | Postgres (or HAProxy for HA), private network | Operations that need a dedicated session |
| `DATABASE_PUBLIC_UNPOOLED_URL` | Postgres (or HAProxy for HA), TCP proxy | Unpooled connections from outside Railway |

The full reference for this feature, including scaling PgBouncer replicas and removing the pooler, is in the [PostgreSQL Connection Pooling docs](/databases/postgresql-pgbouncer).

## Choose a pool mode

Pool mode controls when PgBouncer hands a server connection back to the pool. It is the most important setting you will pick.

| Mode | Server connection is released | Tradeoff |
|---|---|---|
| **Transaction** (default) | After each transaction | Best multiplexing. Session-scoped features break. |
| **Session** | When the client disconnects | Session-scoped features work, but pooling only helps if clients disconnect. |
| **Statement** | After each statement | Maximum reuse. Multi-statement transactions are not allowed. |

Transaction mode is right for most web applications. The features it breaks are the ones that assume your session and your server connection are the same thing:

- `SET` values that must persist across statements
- `LISTEN` / `NOTIFY`
- Advisory locks (`pg_advisory_lock`)
- Session-level prepared statements created with SQL `PREPARE`

If your application depends on any of these, use session mode, or route just those code paths through `DATABASE_UNPOOLED_URL`.

## Connect your application

Nothing about the wire protocol changes. Point your driver at the pooled URL and keep your driver-side pool small, since PgBouncer does the multiplexing now.

Install the driver:

```bash
npm install pg
```

```js
// db.js
import pg from "pg";

// DATABASE_URL points at PgBouncer once pooling is enabled.
export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  // Keep this modest: PgBouncer multiplexes for you.
  max: 10,
  idleTimeoutMillis: 30_000,
});

export async function getUserCount() {
  const { rows } = await pool.query("SELECT count(*) AS n FROM users");
  return Number(rows[0].n);
}
```

One caveat for transaction mode: named prepared statements created by the driver can fail with `prepared statement "..." does not exist`, because consecutive queries from one client may run on different server connections. If you see that error, switch the affected workload to session mode or the unpooled URL, or configure your driver to avoid named prepared statements.

### Prisma

Prisma supports the pooled/unpooled split directly. Queries go through PgBouncer, while migrations use a direct connection:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DATABASE_UNPOOLED_URL")
}
```

Append `?pgbouncer=true` to the pooled URL so Prisma disables features that are incompatible with transaction pooling.

## Route migrations around the pooler

Schema migrations are the most common thing that breaks behind transaction-mode PgBouncer. Most migration tools wrap the entire run in one transaction, take advisory locks, or run `CREATE INDEX CONCURRENTLY`, all of which need a dedicated server connection.

Migrations need that dedicated connection: application traffic uses `DATABASE_URL`, while migrations use `DATABASE_UNPOOLED_URL`.

```bash
# Example: run migrations against the direct connection
DATABASE_URL=$DATABASE_UNPOOLED_URL npx prisma migrate deploy
```

## Run PgBouncer as a separate service

If you want full control over `pgbouncer.ini`, or you are pooling a Postgres you deployed from a custom image, run PgBouncer as its own Railway service from a Docker image.

1. In your project, create a new service and set its source to the Docker image `edoburu/pgbouncer`.
2. Configure it through service variables:

```bash
DB_HOST=postgres.railway.internal
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=${{Postgres.PGPASSWORD}}
POOL_MODE=transaction
DEFAULT_POOL_SIZE=20
MAX_CLIENT_CONN=1000
AUTH_TYPE=scram-sha-256
```

3. Point your application services at the pooler over [private networking](/networking/private-networking): `postgresql://postgres:PASSWORD@pgbouncer.railway.internal:5432/railway`.

Private networking is scoped per environment, so the pooler, the database, and your application must live in the same project environment. Traffic between them stays on the internal network and does not count as egress.

Keep the built-in feature as your default. Run a separate PgBouncer service only when you need configuration the managed pooler does not expose.

## Size the pool

Two numbers matter:

- **`DEFAULT_POOL_SIZE`**: real server connections PgBouncer opens to Postgres. Start at 20. More is not better; Postgres throughput usually peaks at a small multiple of your CPU count.
- **`MAX_CLIENT_CONN`**: how many application connections PgBouncer will accept. Default 1000.

Keep total server connections (pool size times the number of PgBouncer replicas or instances) below your Postgres `max_connections`, with headroom for migrations and admin sessions on the unpooled URL.

Watch for clients spending long periods waiting for a server connection. That means queries are holding connections too long. Fix the slow queries first; only raise the pool size if the database has capacity to spare.

## Next steps

- [PostgreSQL Connection Pooling reference](/databases/postgresql-pgbouncer) for pool modes, replica scaling, and removal
- [PostgreSQL on Railway](/databases/postgresql) for the standard template and its variables
- [Postgres HA](/databases/postgresql-ha) to pair pooling with a replicated cluster
- [Private networking](/networking/private-networking) for how services reach each other inside an environment
