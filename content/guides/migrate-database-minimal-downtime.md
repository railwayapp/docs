---
title: Migrate a Production Database into Railway with Minimal Downtime
description: Move a production PostgreSQL database into Railway using dump and restore or logical replication, with a cutover checklist that keeps downtime to seconds.
date: "2026-07-29"
tags:
  - postgresql
  - migration
  - databases
  - infrastructure
topic: infrastructure
---

Moving a production PostgreSQL database into Railway and pointing the application at it comes down to one choice: how much downtime you can tolerate. A dump and restore takes the database offline for as long as the copy runs, while logical replication streams changes continuously and reduces the cutover to seconds.

This guide covers both strategies, when to use each, and how to cut over safely. The same decision framework applies to MySQL and MongoDB, though the tooling differs.

## Choose a migration strategy

| | Dump and restore | Logical replication |
|---|---|---|
| Downtime | Full duration of dump + restore | Seconds at cutover |
| Complexity | Low | Moderate |
| Source requirements | Network access only | `wal_level = logical`, replication privileges |
| Best for | Databases up to a few GB, or apps that tolerate a maintenance window | Large databases, apps that cannot afford a window |

Rule of thumb: time a dump and restore against a staging copy first. If the total is inside an acceptable maintenance window, use it. It is simpler and has fewer failure modes. Reach for logical replication only when the window is not acceptable.

## Provision the target database on Railway

Add a PostgreSQL service to your project from the Project Canvas with the `+ New` button, or deploy the [PostgreSQL template](https://railway.com/deploy/postgres). Railway provisions the database with credentials exposed as service variables: `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`, and a combined `DATABASE_URL`.

Match or exceed the source's PostgreSQL major version. Logical replication works across major versions, but restoring a dump into an older major version does not.

## Get an external connection string

Your source database lives outside Railway, so the migration traffic needs a public route into the new database. That route comes from a [TCP proxy](/networking/tcp-proxy), which Railway's PostgreSQL template ships with enabled by default. It gives you a public endpoint like `shuttle.proxy.rlwy.net:15140` that forwards raw TCP to the database's internal port.

Find the proxy domain and port in the database service's Settings under Networking, or read the public `DATABASE_PUBLIC_URL` variable on the service. Your external connection string looks like:

```txt
postgresql://postgres:<PGPASSWORD>@shuttle.proxy.rlwy.net:15140/railway
```

Two things about the proxy:

- Traffic through it counts as network egress when data leaves Railway, billed at [$0.05 per GB](/pricing/plans).
- It is for external access only. Once your application also runs on Railway, connect over [private networking](/networking/private-networking) at `<service>.railway.internal` instead. Private traffic stays inside Railway's network and is not billed as egress.

Verify connectivity from the machine that will run the migration:

```bash
psql "postgresql://postgres:<PGPASSWORD>@shuttle.proxy.rlwy.net:15140/railway" -c "SELECT version();"
```

You can also open a shell directly with the Railway CLI using [`railway connect`](/cli/connect), which is useful for the verification queries later in this guide.

## Strategy 1: dump and restore

This strategy takes a consistent snapshot of the source and loads it into Railway. Writes to the source during the copy are lost, so stop the application (or put it in read-only mode) before dumping.

### 1. Dump the source

```bash
pg_dump -Fc --no-acl --no-owner \
  -h <source-host> -p <source-port> \
  -U <source-user> -d <source-db> \
  -f backup.dump
```

The `-Fc` flag writes PostgreSQL's compressed custom format, which restores faster than plain SQL and lets `pg_restore` parallelize. `--no-acl --no-owner` strips role-specific grants that will not exist on the target.

### 2. Restore into Railway

```bash
pg_restore --no-acl --no-owner --clean --if-exists \
  -h shuttle.proxy.rlwy.net -p 15140 \
  -U postgres -d railway \
  -j 4 \
  backup.dump
```

`-j 4` restores four tables in parallel. `--clean --if-exists` drops existing objects first, which makes the command safe to re-run.

### 3. Verify and cut over

Run the checks in the [verification section](#verify-the-migration) below, update your application's `DATABASE_URL`, and bring the application back up. Total downtime is the dump plus the restore plus the deploy.

## Strategy 2: logical replication

Logical replication keeps the source live while PostgreSQL streams every committed change to the Railway database, which acts as the subscriber and opens an outbound connection to the source. The initial table sync happens in the background; once the subscriber catches up, cutover is a config change.

That connection means the source must be reachable from Railway and configured to publish changes, though the Railway side needs no replication-specific configuration.

### 1. Prepare the source

On the source database, enable logical WAL and confirm slot capacity:

```sql
ALTER SYSTEM SET wal_level = 'logical';
-- Restart the source PostgreSQL server for this to take effect.

SHOW max_replication_slots;   -- needs at least 1 free
SHOW max_wal_senders;         -- needs at least 1 free
```

Create a replication user and a publication covering the tables you want to move:

```sql
CREATE ROLE railway_migration WITH LOGIN REPLICATION PASSWORD 'a-strong-password';
GRANT SELECT ON ALL TABLES IN SCHEMA public TO railway_migration;

CREATE PUBLICATION railway_migration_pub FOR ALL TABLES;
```

If the source is itself a Railway PostgreSQL service (for example, migrating between projects or regions), you can set `wal_level` the same way. Railway's Postgres supports `ALTER SYSTEM`; run the statement, then restart the deployment from the service's 3-dot menu.

### 2. Copy the schema

Logical replication moves rows, not DDL. Copy the schema first:

```bash
pg_dump --schema-only --no-acl --no-owner \
  -h <source-host> -p <source-port> \
  -U <source-user> -d <source-db> \
  | psql "postgresql://postgres:<PGPASSWORD>@shuttle.proxy.rlwy.net:15140/railway"
```

### 3. Create the subscription on Railway

Connect to the Railway database and subscribe to the source:

```sql
CREATE SUBSCRIPTION railway_migration_sub
  CONNECTION 'host=<source-host> port=<source-port> dbname=<source-db> user=railway_migration password=a-strong-password'
  PUBLICATION railway_migration_pub;
```

PostgreSQL now copies every table's existing rows, then switches to streaming live changes.

### 4. Monitor until caught up

On the Railway database, watch the sync state:

```sql
-- 'r' means a table is fully synced and streaming
SELECT srrelid::regclass AS table, srsubstate FROM pg_subscription_rel;
```

On the source, check replication lag:

```sql
SELECT slot_name,
       pg_size_pretty(pg_wal_lsn_diff(pg_current_wal_lsn(), confirmed_flush_lsn)) AS lag
FROM pg_replication_slots;
```

Wait until every table reports state `r` and lag stays near zero under normal traffic.

### 5. Cut over

1. Stop writes to the source: put the application in maintenance mode or scale writers to zero.
2. Wait for lag to reach zero. This usually takes seconds.
3. Resync sequences. Logical replication does not carry sequence values, so serial and identity columns would collide on the first insert. Run this on the Railway database:

```sql
SELECT setval(
  pg_get_serial_sequence(quote_ident(schemaname) || '.' || quote_ident(tablename), columnname),
  (SELECT COALESCE(MAX(id), 1) FROM your_table)
) FROM (VALUES ('public', 'your_table', 'id')) AS t(schemaname, tablename, columnname);
```

Repeat for each table with a sequence, or generate the statements from `information_schema.columns`.

4. Point the application at Railway by updating `DATABASE_URL`, then bring it back up.
5. Drop the subscription once traffic is confirmed healthy:

```sql
DROP SUBSCRIPTION railway_migration_sub;
```

Dropping the subscription also removes the replication slot on the source. Do not leave the slot behind: an orphaned slot forces the source to retain WAL and will eventually fill its disk.

## Verify the migration

Run these checks on both databases before and after cutover:

```sql
-- Row counts per table
SELECT relname, n_live_tup
FROM pg_stat_user_tables
ORDER BY relname;

-- Database size
SELECT pg_size_pretty(pg_database_size(current_database()));
```

For stronger guarantees, checksum a few critical tables:

```sql
SELECT md5(string_agg(t::text, '' ORDER BY id)) FROM your_table t;
```

Then confirm the application works end to end against the new database before you decommission the source.

## After the migration

- **Switch to private networking.** If your application runs in the same Railway environment, connect via `postgres.railway.internal` (the `DATABASE_URL` reference variable does this for you). Keep the TCP proxy only if external clients still need access.
- **Enable backups.** Configure scheduled [volume backups](/volumes/backups) on the database service.
- **Consider PITR.** [Point-in-Time Recovery](/volumes/point-in-time-recovery) archives every WAL segment to a storage bucket, letting you restore to any timestamp in the retention window.
- **Keep the source for a rollback window.** Retain the old database in read-only mode for a few days. If something surfaces, you can replicate in the reverse direction rather than restoring from backup.

## Next steps

- [PostgreSQL on Railway](/databases/postgresql)
- [TCP Proxy](/networking/tcp-proxy)
- [Volume backups](/volumes/backups)
- [Private networking](/networking/private-networking)
