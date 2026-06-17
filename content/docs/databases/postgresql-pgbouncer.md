---
title: PostgreSQL Connection Pooling
description: Add PgBouncer as a connection pooler in front of your Railway PostgreSQL database or HA cluster.
---

Railway can add [PgBouncer](https://www.pgbouncer.org/) as a connection pooler in front of your PostgreSQL service. PgBouncer multiplexes many application connections into a smaller pool of server connections, reducing overhead and allowing your database to serve far more concurrent clients than `max_connections` alone would permit.

PgBouncer works with both standalone Postgres and [Postgres HA](/databases/postgresql-ha) clusters. When added to an HA cluster, it sits in front of HAProxy.

## Adding PgBouncer

Open your Postgres service and navigate to **Database → Config → Connection Pooling**. Click **Add PgBouncer**.

Before confirming, select a pool mode:

| Pool Mode | Behavior |
|---|---|
| **Transaction** _(default)_ | Server connections are reused per transaction — best multiplexing. Session-level features (LISTEN/NOTIFY, advisory locks, `SET` held across statements) are not supported. |
| **Session** | Each client holds a server connection for its entire session. Every Postgres feature works, but pooling only helps when clients disconnect. |
| **Statement** | Server connections are reused per statement. Multi-statement transactions are not allowed. |

Transaction mode is the right choice for most applications. Use session mode if your application relies on session-scoped features that are incompatible with transaction pooling.

After confirming, Railway stages the changes. Deploy to complete the setup.

## Connection strings

Once PgBouncer is deployed, two connection variables are available:

| Variable | Points to | Use for |
|---|---|---|
| `DATABASE_URL` | PgBouncer (pooled) | Normal application queries |
| `DATABASE_UNPOOLED_URL` | Postgres or HAProxy (direct) | Operations that require a dedicated session |

Railway automatically migrates any service within your project that references your Postgres variables to point to PgBouncer. Hardcoded connection strings outside of Railway must be updated manually.

### When to use `DATABASE_UNPOOLED_URL`

Use `DATABASE_UNPOOLED_URL` for operations that require a dedicated server connection:

- **Schema migrations** — most migration tools open a transaction that spans the entire migration run
- `CREATE INDEX CONCURRENTLY` / `DROP INDEX CONCURRENTLY`
- `LISTEN` / `NOTIFY`
- Advisory locks (`pg_advisory_lock`)
- `SET` configuration values that must persist across statements

For everything else, use `DATABASE_URL`.

## Scaling PgBouncer

The **PgBouncer Overview** panel (available from the cluster view once PgBouncer is deployed) lets you scale the number of PgBouncer replicas from 1 to 6. Each replica multiplies both client capacity and the number of server connections open to Postgres:

| Setting | Default | Description |
|---|---|---|
| `DEFAULT_POOL_SIZE` | 20 | Server connections per replica |
| `MAX_CLIENT_CONN` | 1000 | Max client connections per replica |

With 1 replica: up to 1,000 clients share 20 server connections.
With 3 replicas: up to 3,000 clients share 60 server connections.

Make sure the total server connections across all replicas (`DEFAULT_POOL_SIZE × replicas`) stays within your Postgres `max_connections` limit. The PgBouncer Overview will warn you when server connections approach that limit.

## Changing the pool mode

You can change the pool mode at any time from the **PgBouncer Overview** panel. The change is staged and takes effect on the next PgBouncer deployment — it does not restart your database.

## Removing PgBouncer

To remove PgBouncer, click **Remove** in the PgBouncer Overview, or navigate to **Database → Config → Connection Pooling → Remove PgBouncer**.

Removing PgBouncer will:

- Drop all active PgBouncer connections
- Restore `DATABASE_URL` to point directly at your Postgres service (or HAProxy for HA clusters)
- Remove the `DATABASE_UNPOOLED_URL` variable

Railway automatically migrates variable references within your project back to the original endpoint. Hardcoded connection strings outside of Railway must be updated manually.
