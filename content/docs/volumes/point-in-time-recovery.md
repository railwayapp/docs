---
title: Point-in-Time Recovery
description: Recover a Railway Postgres or MySQL service to any moment within the archive retention window using continuous WAL or binlog archiving.
---

Point-in-Time Recovery (PITR) lets you restore a database service to any timestamp within the archive retention window — not just to the moment of the most recent backup. It's the right tool when something goes wrong between scheduled backups: an accidental `DROP TABLE`, a faulty migration, a runaway script.

PITR is available for **Postgres** (single-node and [Postgres HA](/databases/postgresql-ha)) and **MySQL** (single-node and [MySQL HA](/databases/mysql-ha)). Both engines use the same flow — a bucket, a set of archive variables on the service, and an image that archives continuously — and differ only in what gets archived.

## How it works

### Postgres

When PITR is enabled, your Postgres image archives every WAL segment it produces directly to a Railway [storage bucket](/storage-buckets) using [pgBackRest](https://pgbackrest.org/). pgBackRest also takes its own base backups on a rolling schedule — a full backup every week and a differential backup every day — so the bucket holds everything Postgres needs to rebuild a database at any point in the archive window. The last 4 full backups are retained, giving you a restore window of roughly 4 weeks.

Pushes are async: pgBackRest's worker batches WAL segments and ships them to S3 in the background, so a stalled bucket can't block writes on Postgres. Under sustained S3 outages, a 5 GiB queue cap on the leader trips and pgBackRest drops WAL to keep the database running — your PITR window truncates, but Postgres stays up.

To restore, you pick a target timestamp. Railway provisions a brand-new Postgres service alongside the source, and the new service's image runs `pgbackrest restore --type=time --target=<T>` on first boot — pulling the most recent base backup at-or-before your target, then replaying archived WAL forward until it reaches the target, then promoting. The source service is never touched.

### MySQL

When PITR is enabled, Railway's MySQL image turns on the binary log and ships every closed binlog file to a Railway [storage bucket](/storage-buckets), alongside a full logical backup (`mysqldump`) taken when archiving starts and then once a day. Binlogs rotate every minute even when the database is idle, so the newest restorable point trails real time by about a minute.

The archive is kept for 7 days: fulls and binlogs older than the horizon are expired by the image, and the last full backup a restore could still need is never removed. A binlog is deleted from the service's volume only after its upload is confirmed — if the bucket is unreachable, the volume grows until it isn't, rather than leaving a hole in the archive.

To restore, you pick a target timestamp. Railway provisions a brand-new MySQL service alongside the source; on first boot its image loads the newest full backup at or before your target and replays the archived binlogs up to it. If the archive is missing a file the target depends on, the restore refuses and stays down instead of serving a database with rows silently missing. The source service is never touched.

On a MySQL HA cluster, only the current primary archives; a failover moves archiving to the new primary, and a restore replays every member's history as one, in transaction (GTID) order.

## Enabling PITR

Open the **Backups** tab on your database service. When PITR isn't yet configured, you'll see a **Point-in-time recovery is off** banner with an **Enable PITR** button.

Click Enable, confirm, and Railway:

1. Creates a Railway Bucket — **Postgres-PITR** or **MySQL-PITR** — for the archive.
2. Sets the archive variables on the service (`WAL_ARCHIVE_*` for Postgres, `BINLOG_ARCHIVE_*` for MySQL), referencing the bucket's credentials.
3. Redeploys the service.

**Postgres:** when the new container boots, the image detects the archive credentials, writes `archive_mode=on` / `archive_command='pgbackrest --stanza=main archive-push %p'` / `archive_timeout=60` into Postgres config, runs `pgbackrest stanza-create`, and starts pushing WAL on every commit. Once archiving is healthy, an in-container watcher takes the first pgBackRest base backup automatically — no manual snapshot step. After that, the **PITR datetime picker** appears on the Backups tab.

**MySQL:** a service deployed from the stock MySQL template runs the upstream `mysql` image, which has no archiver. Enabling PITR moves the service onto Railway's MySQL image at the same version (`mysql:9.4` becomes `mysql-ha/mysql:9.4` — never a different version) and clears the template's start command so the image's own entrypoint runs; that redeploy is the one moment of downtime. On boot the image takes the first full backup and starts shipping binlogs. A service whose start command was customized can't be moved automatically — the Backups tab tells you to remove it first.

For HA clusters of either engine, enabling rolls through the cluster instead of redeploying it all at once: Railway creates the bucket, sets the archive variables on every member, then restarts replicas one at a time, performs a switchover, and finally restarts the former leader. Expect a few seconds of unavailability during the failover; the Backups tab shows the rollout's progress.

## Restoring to a point in time

On the Backups tab, the PITR section shows the available restore range and a datetime picker. Pick a moment, click **Restore to this moment**.

If a Postgres archive bucket holds more than one WAL history — for example, after restoring a database and re-enabling PITR on it — the picker first asks which cluster lifetime to restore from.

Railway:

1. Creates a brand-new service in the project, named `<source>-restored-YYYYMMDD-HHMM` (you can override the name).
2. Provisions an empty volume for it, the same size as the source.
3. Stages a patch wiring up the new service: same image as the source, the source's env vars (minus the archive credentials), the recovery variables pointing read-only at the source's bucket (`WAL_RECOVER_FROM_*` + `POSTGRES_RECOVERY_TARGET_TIME`, or `BINLOG_RECOVER_FROM_*` + `MYSQL_RECOVERY_TARGET_TIME`) set to your target.
4. Deploys the new service.

On first boot, the image populates the empty volume from the bucket — base backup first, then the archive replayed forward until your target.

**The source service is never touched.** It keeps serving traffic the entire time. After the restore finishes, you have two services side by side: the original and the fork. Cut over by swapping connection strings, copying out the rows you need, or replacing the source service with the fork.

The restored fork runs as a plain non-archiving database. If you want continued PITR coverage on it, enable PITR on the new service through the same flow — it'll get its own bucket.

For HA clusters, restore also produces a single-node fork (not a cluster). To restore an HA cluster as HA, restore to a single-node fork, then convert it to HA ([Postgres](/databases/postgresql-ha), [MySQL](/databases/mysql-ha)) once you're satisfied with the data.

## Disabling PITR

Click **Disable PITR** on the Backups tab.

For a single-node service, Railway stages a patch that removes the archive variables and deletes the PITR bucket. Nothing changes on the running service until you review the patch in the **Staged Changes** panel and click Deploy. If you want to keep the archive around (e.g. to restore from it later before fully cleaning up), edit the patch to drop the bucket-deletion step before deploying.

For HA clusters, disabling rolls through the cluster the same way enabling does — replicas restart one at a time, followed by a switchover — with a few seconds of unavailability during the failover. The archive bucket is kept so your backup history stays restorable; delete it yourself once you no longer need it.

## Manage Postgres PITR from the CLI

Use `railway postgres pitr` to inspect archiver health, enable or disable PITR,
restore to a timestamp, and manage volume backups and schedules:

```bash
railway postgres pitr status --service postgres
railway postgres pitr enable --service postgres
railway postgres pitr restore \
  --service postgres \
  --at 2026-07-20T12:00:00Z
railway postgres pitr backup create \
  --service postgres \
  --name pre-migration
```

See the [`railway postgres` reference](/cli/postgres) for every PITR command,
restore format, and backup option.

## Cost

PITR is billed through two existing meters — there's no separate PITR fee:

- **Bucket storage**, at the standard [Railway storage bucket](/storage-buckets) rate, for the archive the bucket holds.
- **Network egress** from the database service for the uploads: every archived segment or binlog and every base backup is sent from your service to the bucket, and uploads to a bucket count as service [network egress](/pricing/plans#resource-usage-pricing).

Everything is compressed before it leaves the service (zstd for Postgres, gzip for MySQL), so both egress and storage are billed on the compressed size, not the raw log volume.

For most workloads, expect roughly:

- A few GB of compressed WAL or binlog per day under steady write load (idle databases are nearly free). Each file is billed once as egress when pushed, then as storage while retained.
- **Postgres:** one base backup per cycle (weekly full, daily differential), compressed and de-duplicated by pgBackRest; `expire` runs after each backup and reclaims old base backups along with their pinned WAL, so the bucket stabilizes at roughly 4 weeks of write volume.
- **MySQL:** one full logical backup per day; the 7-day horizon expires older fulls and binlogs, so the bucket stabilizes at roughly a week of write volume plus seven fulls.

Restore traffic is free: the restored service downloads from the bucket, and bucket egress isn't charged.

## Limitations

- The available restore window starts from the first post-enable base backup, not retroactively. If you enable PITR today, you can't restore to yesterday.
- Restore creates a new sibling service. Cutting over to the restored database (renaming, swapping connection strings, decommissioning the original) is a manual step.
- HA restore produces a single-node fork; convert to HA after restore if you want HA on the restored data.
- **Postgres:** minor version pinning is not supported with PITR. Keep the image on a major tag (e.g. `postgres-ssl:16`, not `postgres-ssl:16.10`) so it keeps tracking Railway's Postgres rebuilds and pgBackRest fixes — the Backups tab shows a warning if a minor pin is detected.
- **MySQL:** pinning the image to a single build (e.g. `mysql-ha/mysql:8.4-a1b2c3d`) is not supported with PITR. Keep the `major.minor` tag (`mysql-ha/mysql:8.4`) so the service keeps tracking Railway's MySQL rebuilds — archiver, retention and HA fixes ship on that tag.
- **MySQL:** the newest restorable point trails real time by about one binlog rotation (a minute). A target newer than the archive is refused up front, with the newest restorable point named.
