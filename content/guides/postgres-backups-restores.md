---
title: Back Up and Restore Postgres
description: Set up volume backups and point-in-time recovery for Postgres on Railway, take logical dumps with pg_dump, and run a restore drill so you know recovery works before you need it.
date: "2026-07-29"
tags:
  - postgres
  - backups
  - disaster-recovery
  - point-in-time-recovery
topic: infrastructure
---

A backup you have never restored is unverified. This guide enables the three backup layers available for Postgres on Railway, then runs a restore drill with `pg_dump` and `pg_restore` so you test the whole loop before an incident forces you to.

Railway Postgres stores its data on a [volume](/volumes). That gives you three ways to protect it:

| Layer | What it is | Restores to | Best for |
|---|---|---|---|
| [Volume backups](/volumes/backups) | Scheduled or manual snapshots of the volume | The same service, same project and environment | Routine recovery from bad deploys or data mistakes |
| [Point-in-time recovery](/volumes/point-in-time-recovery) | Continuous WAL archiving to a storage bucket via pgBackRest | A new sibling Postgres service, at any timestamp in the window | Recovering to the moment just before a `DROP TABLE` or bad migration |
| Logical dumps (`pg_dump`) | A portable SQL-level export you create yourself | Anywhere: another Railway service, another provider, your laptop | Offsite copies, migrations, and restore drills |

Use all three for production. Volume backups and PITR are Railway features you enable once. Logical dumps are the layer you control end to end, and the one you can test cheaply.

## Enable scheduled volume backups

Volume backups snapshot everything on the volume attached to your Postgres service. They are incremental and copy-on-write, so you are only billed for data unique to each snapshot, at the same per-GB rate as [volumes](/volumes).

To enable them:

1. Open your Postgres service and go to the **Backups** tab.
2. Choose one or more schedules. Each schedule has its own retention:
   - **Daily**: every 24 hours, kept for 6 days
   - **Weekly**: every 7 days, kept for 1 month
   - **Monthly**: every 30 days, kept for 3 months
3. You can also trigger a manual backup from the same tab at any time.

Two limits to know about:

- Manual backups are limited to 50% of the volume's total size. If your data is above that threshold, grow the volume first.
- Wiping a volume deletes all of its backups. Backups protect against data mistakes, not against deleting the volume itself. That is what logical dumps are for.

### Restore a volume backup

In the **Backups** tab, find the backup by its date stamp and click **Restore**. Railway stages the change instead of applying it immediately: a new volume named after the backup's date stamp is mounted at the original mount path, and the previous volume is unmounted but retained. Review the [staged change](/deployments/staged-changes) and click **Deploy** to apply it. The service redeploys on the restored data.

Restoring a backup removes any newer backups created after it, and backups can only be restored into the same project and environment.

## Enable point-in-time recovery

Volume backups restore to fixed snapshot times. [Point-in-time recovery](/volumes/point-in-time-recovery) (PITR) restores to any timestamp in the archive window, which is what you want when the incident happened between snapshots.

When PITR is enabled, the Postgres image archives every WAL segment to a private Railway [storage bucket](/storage-buckets) using pgBackRest, and takes rolling base backups (weekly full, daily incremental). The last 4 full backups are retained, giving a restore window of roughly 4 weeks.

To enable it:

1. Open the **Backups** tab on your Postgres service.
2. Click **Enable PITR** and confirm.

Railway creates a bucket named **Postgres-PITR**, sets `WAL_ARCHIVE_*` variables on the service, and redeploys it. Once archiving is healthy and the first base backup completes, a datetime picker appears on the Backups tab. PITR works for single-node Postgres and [Postgres HA](/databases/postgresql-ha) clusters; on HA clusters, enabling rolls through the cluster with about 5 seconds of unavailability during the switchover.

The restore window starts from the first post-enable base backup. Enabling PITR today does not let you restore to yesterday, so enable it before you need it.

PITR has no separate fee. You pay bucket storage at the standard rate for the compressed WAL and base backups, plus network egress for the uploads, though idle databases archive almost nothing.

### Restore to a point in time

On the **Backups** tab, pick a timestamp in the datetime picker and click **Restore to this moment**. Railway creates a new Postgres service next to the original, named `<source>-restored-YYYYMMDD-HHMM`, and replays the base backup plus archived WAL forward until it reaches your target.

The source service is untouched and keeps serving traffic the whole time. After the restore, you have two services side by side: verify the fork's data, then cut over by swapping connection strings or copying the rows you need back into the source. The fork runs as plain non-archiving Postgres; enable PITR on it separately if you want continued coverage.

## Take a logical backup with pg_dump

Logical dumps are portable and provider-independent. They are also the only layer that survives deleting the project itself.

You need the Postgres client tools installed locally (`pg_dump`, `pg_restore`, `psql`). On macOS: `brew install libpq`. On Debian/Ubuntu: `apt-get install postgresql-client`.

To reach the database from your machine, open a tunnel with the [Railway CLI](/cli/connect). In a project directory linked with `railway link`:

```bash
railway connect postgres --tunnel-only
```

This opens a local tunnel to the database and prints connection details (host, port, user, password, database) without launching a client. Leave it running and, in a second terminal, take a dump in custom format:

```bash
pg_dump "postgresql://postgres:<password>@localhost:<port>/railway" \
  --format=custom \
  --no-owner \
  --file=backup-$(date +%Y%m%d-%H%M%S).dump
```

Custom format (`--format=custom`) is compressed and lets `pg_restore` do selective and parallel restores, which plain SQL dumps cannot.

Alternatively, connect through the public [TCP proxy](/networking/tcp-proxy) using the `DATABASE_PUBLIC_URL` variable from the Postgres service:

```bash
pg_dump "$DATABASE_PUBLIC_URL" --format=custom --no-owner --file=backup.dump
```

Traffic over the TCP proxy is billed as network egress, so the tunnel is preferable for large databases you dump often.

## Run a restore drill

Do this once now, and on a schedule after. The goal is to prove the dump actually restores, and to time how long it takes.

Restore into a scratch database rather than the production one. With the tunnel from the previous section still open:

```bash
# Create a scratch database on the same server
psql "postgresql://postgres:<password>@localhost:<port>/railway" \
  -c 'CREATE DATABASE restore_drill;'

# Restore the dump into it
pg_restore \
  --dbname="postgresql://postgres:<password>@localhost:<port>/restore_drill" \
  --no-owner \
  --exit-on-error \
  backup-20260729-090000.dump
```

Then verify the restored data looks right:

```bash
psql "postgresql://postgres:<password>@localhost:<port>/restore_drill" <<'SQL'
-- Row counts per table, compare against production
SELECT relname, n_live_tup
FROM pg_stat_user_tables
ORDER BY n_live_tup DESC;
SQL
```

Spot-check a few recent rows in your most important tables. When you are satisfied, drop the scratch database:

```bash
psql "postgresql://postgres:<password>@localhost:<port>/railway" \
  -c 'DROP DATABASE restore_drill;'
```

Record two numbers from the drill: how long the restore took, and how old the dump was. Those are your real recovery time and recovery point.

## Automate offsite dumps with a cron service

For an offsite copy that survives anything happening to the project, run `pg_dump` on a schedule from a [cron job](/cron-jobs) service and upload the result to a separate Railway [storage bucket](/storage-buckets) (or any S3-compatible store outside Railway).

Create a bucket in your project, then create an empty service with this Dockerfile:

```dockerfile
FROM postgres:16-alpine

RUN apk add --no-cache aws-cli

COPY backup.sh /backup.sh
RUN chmod +x /backup.sh

CMD ["/backup.sh"]
```

And this `backup.sh`:

```bash
#!/bin/sh
set -eu

STAMP=$(date -u +%Y%m%d-%H%M%S)
FILE="backup-${STAMP}.dump"

echo "Dumping database..."
pg_dump "$DATABASE_URL" --format=custom --no-owner --file="/tmp/${FILE}"

echo "Uploading ${FILE} to bucket..."
aws s3 cp "/tmp/${FILE}" "s3://${BUCKET}/${FILE}" \
  --endpoint-url "$ENDPOINT"

echo "Done."
```

Wire up the variables on the cron service:

- `DATABASE_URL`: a [reference](/variables) to the Postgres service's `DATABASE_URL`, so the dump travels over private networking with no egress cost for the database read. The upload to the bucket does count as service egress, since buckets live on the public network.
- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_DEFAULT_REGION`, `ENDPOINT`, `BUCKET`: use the bucket's variable-reference presets from its Credentials tab. The AWS CLI picks up the `AWS_*` names automatically.

Finally, set a cron schedule in the service settings, for example `0 3 * * *` for a daily dump at 03:00 UTC. Cron schedules on Railway run in UTC, the minimum granularity is 5 minutes, and if a run is still going when the next trigger fires, the new run is skipped rather than stacked. That's why the service must exit when the dump finishes, which the script above does.

Bucket storage is billed at $0.015 per GB-month with free API operations, so retaining a few weeks of compressed dumps is cheap. Add a cleanup step to the script (`aws s3 rm` on objects older than your retention window) once the bucket starts accumulating.

## Which layer to use when

- **Bad deploy corrupted some rows an hour ago**: PITR, restore to the minute before the deploy, copy the rows back.
- **Need yesterday's state of the whole database**: volume backup restore, or PITR if you need a specific time.
- **Migrating to another provider or region**: logical dump. A bucket's region is fixed at creation, but a dump file goes anywhere.
- **Project or volume was deleted**: only the offsite logical dumps survive this. That is why the cron service exists.

## Next steps

- [Volume backups reference](/volumes/backups)
- [Point-in-time recovery](/volumes/point-in-time-recovery)
- [Deploy PostgreSQL on Railway](/databases/postgresql)
- [Cron jobs](/cron-jobs)
