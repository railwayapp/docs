---
title: PostgreSQL Corrupted WAL
description: Learn how to troubleshoot and fix corrupted Write-Ahead Log (WAL) errors in PostgreSQL.
---

## What This Error Means

PostgreSQL uses a Write-Ahead Log (WAL) to ensure data integrity. When PostgreSQL reports a corrupted WAL, it means the database cannot start because the transaction log files are damaged or inconsistent.

You may see errors like:

```txt
FATAL: could not locate a valid checkpoint record
```

```txt
LOG: invalid primary checkpoint record
```

```txt
PANIC: could not locate a valid checkpoint record
```

## Why This Error Can Occur

WAL corruption typically occurs due to:

- **Unexpected shutdown** - The database was terminated abruptly without a proper shutdown (e.g., during a deployment crash or infrastructure issue).
- **Storage issues** - Disk errors or volume problems during write operations.
- **Out of disk space** - The volume ran out of space while PostgreSQL was writing WAL segments.

## Solution

<Warning>
**Before proceeding**, if you have [backups enabled](/reference/backups), consider restoring from a recent backup instead. The `pg_resetwal` command should only be used as a last resort when no backup is available, as it may result in data loss.
</Warning>

To fix corrupted WAL, you need to run `pg_resetwal` which resets the transaction log. Follow these steps:

### 1. Create a Volume Snapshot

Before making any changes, create a snapshot of your database volume:

1. Navigate to your PostgreSQL service in the Railway dashboard
2. Go to the **Volumes** tab
3. Click the three-dot menu on your volume and select **Create Snapshot**

This gives you a recovery point if something goes wrong.

### 2. Set a Custom Start Command

Override the start command to prevent PostgreSQL from starting:

1. Go to your PostgreSQL service settings
2. Set the **Start Command** to:

```bash
sleep infinity
```

3. Click **Deploy** to apply the change

This keeps the container running without starting PostgreSQL, allowing you to access the filesystem.

### 3. SSH Into the Database

Use the Railway CLI to connect to your database container:

```bash
railway shell
```

### 4. Run pg_resetwal

Once connected, switch to the postgres user and run the reset command:

```bash
su postgres
pg_resetwal -f /var/lib/postgresql/data/pgdata
```

The `-f` flag forces the reset even if `pg_resetwal` cannot determine valid data for the control file.

You should see output similar to:

```txt
Write-ahead log reset
```

### 5. Remove the Start Command Override

1. Go back to your PostgreSQL service settings
2. Remove the `sleep infinity` start command (leave it empty to use the default)
3. Click **Deploy** to redeploy the service

PostgreSQL should now start successfully.

## After Recovery

Once your database is running again:

1. **Check your data** - Run queries to verify your data is intact. Some recent transactions may have been lost.
2. **Run VACUUM** - Execute `VACUUM ANALYZE;` to clean up and update statistics.
3. **Review your backups** - Ensure you have [backups](/reference/backups) configured to avoid data loss in the future.

## Additional Resources

- [PostgreSQL pg_resetwal Documentation](https://www.postgresql.org/docs/current/app-pgresetwal.html)
- [Railway Backups](/reference/backups)
- [PostgreSQL Guide](/guides/postgresql)
