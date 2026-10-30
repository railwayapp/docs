---
title: Point-in-time recovery
description: Recover a Railway Postgres or MySQL service to any moment within the archive retention window using continuous WAL or binlog archiving.
---

Point-in-time recovery (PITR) lets you restore a database service to any timestamp within the archive retention window, not just to the moment of the most recent backup. It's the right tool when something goes wrong between scheduled backups: an accidental `DROP TABLE`, a faulty migration, a runaway script.

PITR is available for **Postgres** (standalone and [Postgres HA](/databases/postgresql-ha)) and **MySQL** (standalone and [MySQL HA](/databases/mysql-ha)). Both engines use the same flow, a bucket, a set of archive variables on the service, and an image that archives continuously, and differ only in what gets archived: Postgres uses WAL archiving, MySQL uses binlog archiving.

## How it works

### Postgres

When PITR is enabled, your Postgres image archives every WAL segment it produces directly to a Railway [storage bucket](/storage-buckets) using [pgBackRest](https://pgbackrest.org/). pgBackRest also takes its own base backups on a rolling schedule, a full backup every week and a differential backup every day, so the bucket holds everything Postgres needs to rebuild a database at any point in the archive window. The last 4 full backups are retained, giving you a restore window of roughly 4 weeks.

Archiving never blocks writes. If the bucket is unreachable for a long time, Postgres keeps running and your restore window gets a gap.

To restore, you pick a target timestamp. Railway provisions a brand-new Postgres service alongside the source. On first boot, the new service rebuilds the database from the most recent base backup before your target, replays the archived WAL up to the target, and starts serving. The source service is never touched.

### MySQL

When PITR is enabled, Railway's MySQL image turns on the binary log and ships every closed binlog file to a Railway [storage bucket](/storage-buckets), alongside a full logical backup (`mysqldump`) taken when archiving starts and then once a day. Binlogs rotate every minute even when the database is idle, so the newest restorable point trails real time by about a minute. Binlog events carry whole-second timestamps, so a MySQL restore target has one-second granularity: the restored service holds the state as of the **start** of the chosen second. Nothing that ran inside that second is included, and nothing from before it is lost.

The archive is kept for 7 days. Full backups and binlogs older than the horizon are expired by the image, and the last full backup a restore could still need is never removed. A binlog is deleted from the service's volume only after its upload is confirmed. If the bucket is unreachable, the volume grows until it isn't, rather than leaving a hole in the archive.

To restore, you pick a target timestamp. Railway provisions a brand-new MySQL service alongside the source. On first boot its image loads the newest full backup at or before your target and replays the archived binlogs up to it. If the archive is missing a file the target depends on, the restore refuses and stays down instead of serving a database with rows silently missing. The source service is never touched.

On a MySQL HA cluster, only the current primary archives. A failover moves archiving to the new primary, and a restore replays every node's history as one, in transaction (GTID) order.

## Enable PITR

Open the **Backups** tab on your database service. When PITR isn't yet configured, you'll see a **Point-in-time recovery is off** banner with an **Enable PITR** button.

Click **Enable PITR**, confirm, and Railway:

1. Creates a Railway bucket, **Postgres-PITR** or **MySQL-PITR**, for the archive.
2. Sets the archive variables on the service (`WAL_ARCHIVE_*` for Postgres, `BINLOG_ARCHIVE_*` for MySQL), referencing the bucket's credentials.
3. Redeploys the service.

**Postgres:** when the new container boots, it starts archiving WAL on every commit and takes the first base backup automatically. After that, the **PITR datetime picker** appears on the Backups tab.

**MySQL:** a service deployed from the stock MySQL template runs the upstream `mysql` image, which has no archiver. Enabling PITR moves the service onto Railway's MySQL image at the same version (`mysql:9.4` becomes `mysql-ha/mysql:9.4`, never a different version) and clears the template's start command so the image's own entrypoint runs. That redeploy is the one moment of downtime. On boot the image takes the first full backup and starts shipping binlogs. A service with a custom start command (one you set) can't be moved automatically. The Backups tab asks you to remove it first.

For HA clusters of either engine, enabling rolls through the cluster instead of redeploying it all at once. Railway creates the bucket, sets the archive variables on every node, restarts the replicas one at a time, switches the primary, and finally restarts the former primary. Expect a few seconds of unavailability during the switchover. The Backups tab shows the rollout's progress.

## Restore to a point in time

On the Backups tab, the PITR section shows the available restore range and a datetime picker. Pick a moment, then click **Restore to this moment**.

If a Postgres archive bucket holds more than one WAL history (for example, after restoring a database and re-enabling PITR on it), the picker first asks which history to restore from.

Railway:

1. Creates a brand-new service in the project, named `<source>-restored-YYYYMMDD-HHMM` (you can override the name).
2. Provisions an empty volume for it, sized to the larger of the source's volume and your plan's default volume size.
3. Stages the new service with the same image as the source, the source's variables, and recovery settings pointing at your target. The new service reads the source's archive but never writes to it.
4. Deploys the new service.

On first boot, the image populates the empty volume from the bucket: base backup first, then the archive replayed forward until your target.

**The source service is never touched.** It keeps serving traffic the entire time. After the restore finishes, you have two services side by side: the original and the restored copy. Cut over by swapping connection strings, copying out the rows you need, or replacing the source service with the copy.

The restored copy runs as a plain non-archiving database. If you want continued PITR coverage on it, enable PITR on the new service through the same flow. It gets its own bucket.

For HA clusters, a restore also produces a standalone service, not a cluster. To get an HA cluster back, restore to a standalone service, then convert it to HA ([Postgres](/databases/postgresql-ha), [MySQL](/databases/mysql-ha)) once you're satisfied with the data.

## Disable PITR

Click **Disable PITR** on the Backups tab.

For a standalone service, Railway stages two changes: it removes the archive variables and deletes the PITR bucket. Nothing changes until you click **Deploy** in the staged changes panel. Once deployed, you can no longer restore to a point in time. Your volume backups are kept.

For HA clusters, disabling rolls through the cluster the same way enabling does. The replicas restart one at a time, then the primary switches over, with a few seconds of unavailability during the switchover. The archive bucket is kept so your backup history stays restorable. Delete it yourself once you no longer need it.

## Manage PITR from the CLI

Use `railway postgres pitr` or `railway mysql pitr` to inspect archiver health, enable or disable PITR, restore to a timestamp, and manage volume backups and schedules:

```bash
railway postgres pitr status --service postgres
railway postgres pitr enable --service postgres
railway postgres pitr restore \
  --service postgres \
  --at 2026-07-20T12:00:00Z
railway mysql pitr enable --service mysql
railway mysql pitr backup create \
  --service mysql \
  --name pre-migration
```

On an HA cluster, `enable` and `disable` run the rollout and follow its progress. You can press Ctrl+C, and the rollout keeps going. Follow it again with `railway postgres pitr progress --watch` (or `railway mysql pitr progress --watch`).

See the [`railway postgres` reference](/cli/postgres) for every PITR command, restore format, and backup option. The `railway mysql pitr` commands take the same options.

## Cost

PITR is billed through two existing meters. There's no separate PITR fee:

- **Bucket storage**, at the standard [Railway storage bucket](/storage-buckets) rate, for the archive the bucket holds.
- **Network egress** from the database service for the uploads. Every archived segment or binlog and every base backup is sent from your service to the bucket, and uploads to a bucket count as service [network egress](/pricing/plans#resource-usage-pricing).

Everything is compressed before it leaves the service (zstd for Postgres, gzip for MySQL), so both egress and storage are billed on the compressed size, not the raw log volume.

For most workloads, expect roughly:

- A few GB of compressed WAL or binlog per day under steady write load (idle databases are nearly free). Each file is billed once as egress when pushed, then as storage while retained.
- **Postgres:** one base backup per cycle (weekly full, daily differential), compressed and de-duplicated by pgBackRest. Old base backups and their WAL are reclaimed after each backup, so the bucket stabilizes at roughly 4 weeks of write volume.
- **MySQL:** one full logical backup per day. The 7-day horizon expires older fulls and binlogs, so the bucket stabilizes at roughly a week of write volume plus seven fulls.

Restore traffic is free. The restored service downloads from the bucket, and bucket egress isn't charged.

## Limitations

- The available restore window starts from the first post-enable base backup, not retroactively. If you enable PITR today, you can't restore to yesterday.
- Restore creates a new sibling service. Cutting over to the restored database (renaming, swapping connection strings, decommissioning the original) is a manual step.
- An HA restore produces a standalone service. Convert it to HA after the restore if you want HA on the restored data.
- The recovery variables reference the archive bucket's credential, the same one the source archives with. A bucket's credential has read and write access, and there is no read-only variant. The restore only reads from the archive, but anyone who can see the restored service's variables can also write to the source's archive.
- **Postgres:** minor version pinning is not supported with PITR. Keep the image on a major tag (for example `postgres-ssl:16`, not `postgres-ssl:16.10`) so it keeps tracking Railway's Postgres rebuilds and pgBackRest fixes. The Backups tab shows a warning if a minor pin is detected.
- **MySQL:** pinning the image to a single build (for example `mysql-ha/mysql:8.4-a1b2c3d`) is not supported with PITR. Keep the `major.minor` tag (`mysql-ha/mysql:8.4`) so the service keeps tracking Railway's MySQL rebuilds. Archiver, retention, and HA fixes ship on that tag.
- **MySQL:** the newest restorable point trails real time by about one binlog rotation (a minute), and targets resolve to the start of their second (binlog events are whole-second). A target newer than the archive is refused up front, with the newest restorable point named.
