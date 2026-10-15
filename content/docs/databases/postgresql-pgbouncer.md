---
title: Add connection pooling to PostgreSQL
description: Add PgBouncer as a connection pooler in front of your Railway PostgreSQL database or HA cluster.
---

Railway can add [PgBouncer](https://www.pgbouncer.org/) as a connection pooler in front of your PostgreSQL service. PgBouncer multiplexes many application connections into a smaller pool of server connections, reducing overhead and allowing your database to serve far more concurrent clients than `max_connections` alone would permit.

PgBouncer works with both standalone Postgres and [Postgres HA](/databases/postgresql-ha) clusters. When added to an HA cluster, it sits in front of HAProxy.

## Add PgBouncer

Open your Postgres service and go to **Database**, then **Config**, then **Connection Pooling**. Click **Add PgBouncer**.

Before confirming, select a pool mode:

| Pool mode | Behavior |
|---|---|
| **Transaction** _(default)_ | Server connections are reused per transaction, which gives the best multiplexing. Session-level features (LISTEN/NOTIFY, advisory locks, `SET` held across statements) aren't supported. |
| **Session** | Each client holds a server connection for its entire session. Every Postgres feature works, but pooling only helps when clients disconnect. |
| **Statement** | Server connections are reused per statement. Multi-statement transactions aren't allowed. |

Transaction mode is the right choice for most applications. Use session mode if your application relies on session-scoped features that are incompatible with transaction pooling.

After confirming, Railway stages the changes. Click **Deploy** to complete the setup. Nothing changes until you deploy.

## Connection strings

Once PgBouncer is deployed, these connection variables are available:

| Variable | Points to | Use for |
|---|---|---|
| `DATABASE_URL` | PgBouncer (Pooled), private network | Normal application queries from inside Railway |
| `DATABASE_PUBLIC_URL` | PgBouncer (Pooled), TCP proxy | Connecting from outside Railway |
| `DATABASE_UNPOOLED_URL` | Postgres or HAProxy (Direct), private network | Operations that need a dedicated session |
| `DATABASE_PUBLIC_UNPOOLED_URL` | Postgres or HAProxy (Direct), TCP proxy | Direct connections from outside Railway |

The two public variables exist only while public access is enabled. If your Postgres was publicly exposed before adding PgBouncer, the public endpoint carries over to the pooler automatically. Otherwise click **Connect** on the PgBouncer service and add **Public Access**. `DATABASE_PUBLIC_UNPOOLED_URL` bypasses the pooler, so it also needs the database behind PgBouncer to be publicly exposed itself.

Railway migrates any service within your project that references your Postgres variables to point to PgBouncer. Hardcoded connection strings outside of Railway need updating by hand.

### When to use `DATABASE_UNPOOLED_URL`

Use `DATABASE_UNPOOLED_URL` for operations that need a dedicated server connection:

- **Schema migrations.** Most migration tools open a transaction that spans the entire migration run.
- `CREATE INDEX CONCURRENTLY` / `DROP INDEX CONCURRENTLY`
- `LISTEN` / `NOTIFY`
- Advisory locks (`pg_advisory_lock`)
- `SET` configuration values that must persist across statements

For everything else, use `DATABASE_URL`.

## Scale PgBouncer

The **PgBouncer Overview** panel (available from the PgBouncer service once it is deployed) lets you scale the number of PgBouncer instances from 1 to 6. Each instance multiplies both client capacity and the number of server connections open to Postgres:

| Setting | Default | Description |
|---|---|---|
| `DEFAULT_POOL_SIZE` | 20 | Server connections per instance |
| `MAX_CLIENT_CONN` | 1000 | Max client connections per instance |

With 1 instance, up to 1,000 clients share 20 server connections.
With 3 instances, up to 3,000 clients share 60 server connections.

Make sure the total server connections across all instances (`DEFAULT_POOL_SIZE × instances`) stays within your Postgres `max_connections` limit. The PgBouncer Overview warns you when server connections approach that limit.

## Change the pool mode

You can change the pool mode at any time from the **PgBouncer Overview** panel. The change is staged and takes effect on the next PgBouncer deployment. It does not restart your database.

## Remove connection pooling

To remove PgBouncer, click **Remove connection pooling** in the PgBouncer Overview, or go to **Database**, then **Config**, then **Connection Pooling**, then **Remove PgBouncer**.

Removing PgBouncer:

- Drops all active PgBouncer connections
- Restores `DATABASE_URL` to point directly at your Postgres service (or HAProxy for HA clusters)
- Removes the `DATABASE_UNPOOLED_URL` variable

Railway migrates variable references within your project back to the original endpoint. Hardcoded connection strings outside of Railway need updating by hand.

## CLI

Use `railway postgres pgbouncer` to inspect, add, configure, scale, or remove PgBouncer:

```bash
railway postgres pgbouncer status --service postgres
railway postgres pgbouncer add \
  --service postgres \
  --pool-mode transaction
railway postgres pgbouncer configure \
  --service postgres \
  --default-pool-size 30
railway postgres pgbouncer scale --service postgres --replicas 2
```

See the [`railway postgres` reference](/cli/postgres) for every PgBouncer command and option.
