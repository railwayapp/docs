---
title: Recover PostgreSQL from corrupted WAL
description: Recover a PostgreSQL database that cannot start because its write-ahead log is corrupted.
---

## Symptom

PostgreSQL cannot start and its deployment logs contain a checkpoint error such
as:

```plaintext
FATAL: could not locate a valid checkpoint record
```

The logs might also contain `invalid primary checkpoint record` or the same
checkpoint message at the `PANIC` level.

## Cause

PostgreSQL uses its write-ahead log (WAL) to recover committed changes after a
restart. A damaged WAL segment or control file can leave PostgreSQL without a
valid checkpoint from which to start.

## Solution

If point-in-time recovery is enabled, [restore the database to a new
service](/volumes/point-in-time-recovery#restore-to-a-point-in-time). Otherwise,
restore a [volume backup](/volumes/backups) when one is available. Both options
are safer than resetting the WAL because they don't modify the source database.

<Banner variant="danger">
`pg_resetwal` can cause data loss and leave partially committed transactions in
the database. Use it only as a last resort when PostgreSQL cannot start and you
don't have a usable backup.
</Banner>

### Create a volume backup

Preserve the current state before changing the database files:

1. Open the PostgreSQL service in Railway.
2. Select the **Backups** tab.
3. Create a manual backup of the database volume.

### Stop PostgreSQL

Prevent PostgreSQL from running while you reset the WAL:

1. Open the PostgreSQL service **Settings**.
2. Set the **Custom Start Command** to `sleep infinity`.
3. Deploy the change.

The new deployment keeps the container running without starting PostgreSQL.

### Connect to the container

In a terminal linked to the Railway project and PostgreSQL service, connect to
the deployment:

```bash
railway ssh
```

Confirm that `PGDATA` points to the PostgreSQL data directory and that its major
version matches the `pg_resetwal` major version:

```bash
printf '%s\n' "$PGDATA"
cat "$PGDATA/PG_VERSION"
pg_resetwal --version
```

### Reset the WAL

Preview the values that `pg_resetwal` will use without changing any files:

```bash
su postgres -c "pg_resetwal --dry-run '$PGDATA'"
```

Review the output, then force the reset:

```bash
su postgres -c "pg_resetwal --force '$PGDATA'"
```

`pg_resetwal` must run as the `postgres` user while the server is stopped. The
command must come from the same PostgreSQL major version as the data directory.

### Restart PostgreSQL

Return the service to its normal start command:

1. Remove `sleep infinity` from **Custom Start Command**.
2. Deploy the change.
3. Check the deployment logs to confirm that PostgreSQL starts.

### Rebuild the database

Treat the recovered database as inconsistent. Don't run data-modifying queries.
Immediately create a logical dump, initialize a new PostgreSQL service, restore
the dump into it, and check the restored data for inconsistencies.

For the required recovery steps and caveats, see the
<a href="https://www.postgresql.org/docs/current/app-pgresetwal.html" target="_blank">PostgreSQL `pg_resetwal` documentation</a>.
