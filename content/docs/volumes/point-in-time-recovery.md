---
title: Point-in-Time Recovery
description: Recover a Railway Postgres service to any moment within the WAL retention window using continuous pgBackRest WAL archiving.
---

Point-in-Time Recovery (PITR) lets you restore a Postgres service to any timestamp within the archive retention window — not just to the moment of the most recent backup. It's the right tool when something goes wrong between scheduled backups: an accidental `DROP TABLE`, a faulty migration, a runaway script.

PITR works for both single-node Postgres and [Postgres HA](/databases/postgresql-ha) clusters.

## How it works

When PITR is enabled, your Postgres image archives every WAL segment it produces directly to a Railway [storage bucket](/storage-buckets) using [pgBackRest](https://pgbackrest.org/). pgBackRest also takes its own base backups on a rolling schedule — a full backup every week and an incremental backup every day — so the bucket holds everything Postgres needs to rebuild a database at any point in the archive window. The last 4 full backups are retained, giving you a restore window of roughly 4 weeks.

Pushes are async: pgBackRest's worker batches WAL segments and ships them to S3 in the background, so a stalled bucket can't block writes on Postgres. Under sustained S3 outages, a 5 GiB queue cap on the leader trips and pgBackRest drops WAL to keep the database running — your PITR window truncates, but Postgres stays up.

To restore, you pick a target timestamp. Railway provisions a brand-new Postgres service alongside the source, and the new service's image runs `pgbackrest restore --type=time --target=<T>` on first boot — pulling the most recent base backup at-or-before your target, then replaying archived WAL forward until it reaches the target, then promoting. The source service is never touched.

## Enabling PITR

Open the **Backups** tab on your Postgres service. When PITR isn't yet configured, you'll see a **Point-in-time recovery is off** banner with an **Enable PITR** button.

Click Enable, confirm, and Railway:

1. Creates a Railway Bucket named **Postgres-PITR** for archived WAL and base backups.
2. Sets `WAL_ARCHIVE_*` env vars on the Postgres service, referencing the bucket's credentials.
3. Redeploys the service.

When the new container boots, the image detects the archive credentials, writes `archive_mode=on` / `archive_command='pgbackrest --stanza=main archive-push %p'` / `archive_timeout=60` into Postgres config, runs `pgbackrest stanza-create`, and starts pushing WAL on every commit. Once archiving is healthy, an in-container watcher takes the first pgBackRest base backup automatically — no manual snapshot step. After that, the **PITR datetime picker** appears on the Backups tab.

For Postgres HA clusters, enabling rolls through the cluster instead of redeploying it all at once: Railway creates the bucket, sets the `WAL_ARCHIVE_*` vars on every member, then restarts replicas one at a time, performs a switchover, and finally restarts the former leader. Expect about 5 seconds of unavailability during the failover; the Backups tab shows the rollout's progress.

## Restoring to a point in time

On the Backups tab, the PITR section shows the available restore range and a datetime picker. Pick a moment, click **Restore to this moment**.

If the archive bucket holds more than one WAL history — for example, after restoring a database and re-enabling PITR on it — the picker first asks which cluster lifetime to restore from.

Railway:

1. Creates a brand-new Postgres service in the project, named `<source>-restored-YYYYMMDD-HHMM` (you can override the name).
2. Provisions an empty volume for it, the same size as the source.
3. Stages a patch wiring up the new service: same image as the source, the source's env vars (minus the archive credentials), `WAL_RECOVER_FROM_*` pointing read-only at the source's bucket, and `POSTGRES_RECOVERY_TARGET_TIME` set to your target.
4. Deploys the new service.

On first boot, the image runs `pgbackrest restore --type=time --target=<T>`, populating the empty volume from the bucket — base backup first, then archived WAL replayed forward until your target. Postgres promotes when it hits the target.

**The source service is never touched.** It keeps serving traffic the entire time. After the restore finishes, you have two services side by side: the original and the fork. Cut over by swapping connection strings, copying out the rows you need, or replacing the source service with the fork.

The restored fork runs as plain non-archiving Postgres. If you want continued PITR coverage on it, enable PITR on the new service through the same flow — it'll get its own bucket.

For Postgres HA, restore also produces a single-node fork (not a cluster). To restore an HA cluster as HA, restore to a single-node fork, then [convert it to HA](/databases/postgresql-ha) once you're satisfied with the data.

## Disabling PITR

Click **Disable PITR** on the Backups tab.

For single-node Postgres, Railway stages a patch that removes the `WAL_ARCHIVE_*` env vars and deletes the Postgres-PITR bucket. Nothing changes on the running service until you review the patch in the **Staged Changes** panel and click Deploy. If you want to keep the archived WAL around (e.g. to restore from it later before fully cleaning up), edit the patch to drop the bucket-deletion step before deploying.

For Postgres HA clusters, disabling rolls through the cluster the same way enabling does — replicas restart one at a time, followed by a switchover — with about 5 seconds of unavailability during the failover. The archive bucket is kept so your backup history stays restorable; delete it yourself once you no longer need it.

## Cost

PITR is billed through two existing meters — there's no separate PITR fee:

- **Bucket storage**, at the standard [Railway storage bucket](/storage-buckets) rate, for the archived WAL and base backups the bucket holds.
- **Network egress** from the Postgres service for the uploads: every WAL segment and base backup is sent from your service to the bucket, and uploads to a bucket count as service [network egress](/pricing/plans#resource-usage-pricing).

For most workloads, expect roughly:

- A few GB of compressed WAL per day under steady write load (zstd-compressed; idle databases are nearly free). Each segment is billed once as egress when pushed, then as storage while retained.
- One base backup per cycle (weekly full, daily incremental), compressed and de-duplicated by pgBackRest.

pgBackRest's `expire` runs after each backup and reclaims old base backups along with their pinned WAL, so the bucket size stabilizes at roughly 4 weeks of write volume.

Restore traffic is free: the restored service downloads from the bucket, and bucket egress isn't charged.

## Limitations

- The available restore window starts from the first post-enable base backup, not retroactively. If you enable PITR today, you can't restore to yesterday.
- Restore creates a new sibling service. Cutting over to the restored database (renaming, swapping connection strings, decommissioning the original) is a manual step.
- HA restore produces a single-node Postgres fork; convert to HA after restore if you want HA on the restored data.
- Minor version pinning is not supported with PITR. Keep the image on a major tag (e.g. `postgres-ssl:16`, not `postgres-ssl:16.10`) so it keeps tracking Railway's Postgres rebuilds and pgBackRest fixes — the Backups tab shows a warning if a minor pin is detected.
