---
title: Point-in-Time Recovery
description: Recover a Railway Postgres service to any moment within the WAL retention window using continuous wal-g WAL archiving.
---

Point-in-Time Recovery (PITR) lets you restore a Postgres service to any timestamp within the WAL retention window — not just to the moment of the most recent snapshot. It's the right tool when something goes wrong between scheduled backups: an accidental `DROP TABLE`, a faulty migration, a runaway script.

PITR works for both single-node Postgres and [Postgres HA](/databases/postgresql-ha) clusters, and it's available on the **Pro** plan.

## How it works

When PITR is enabled, your Postgres image archives every WAL segment it produces to a Railway [storage bucket](/storage-buckets) using [wal-g](https://github.com/wal-g/wal-g). The bucket retains roughly 7 days of WAL by default. To restore, you pick a target timestamp; Railway finds the most recent base [snapshot](/volumes/backups) at-or-before that timestamp, creates a new volume from it, and the Postgres image replays archived WAL up to your target before promoting.

The original volume is retained, unmounted, in case you need to roll back the restore.

## Enabling PITR

Open the **Backups** tab on your Postgres service (or on the cluster Backups page for Postgres HA). When PITR isn't yet configured, you'll see a **Point-in-time recovery is off** banner with an **Enable PITR** button.

### Single-node Postgres

Click Enable, confirm, and Railway:

1. Creates a Railway Bucket named **Postgres-PITR** for archived WAL.
2. Sets the wal-g credentials as variables on the Postgres service.
3. Redeploys the service. The image picks up the new env vars and starts archiving WAL on every commit.
4. Adds **daily and weekly** backup schedules (if not already enabled) and triggers an immediate base snapshot. Both schedules are required: WAL is retained for 7 days, but daily snapshots are only retained for 6 — without a weekly snapshot, the oldest day of your WAL window would have no base snapshot to replay onto. The weekly fills that gap.

One redeploy. After the service comes back, you'll see a **PITR datetime picker** appear on the Backups tab.

### Postgres HA

HA enable runs a rolling restart so the cluster never loses Patroni quorum:

1. **Bucket + DCS** — Bucket is created and the cluster's Patroni DCS gains `archive_mode=on`, `archive_command='wal-g wal-push %p'`, and `archive_timeout=60`. No restarts at this step.
2. **Roll replicas** — Each replica gets the wal-g env vars one at a time. The variable change triggers a redeploy of just that node; Patroni absorbs the restart and the cluster stays available throughout. Railway waits for each replica to come back as a healthy streaming follower (`state=streaming`, `lag=0`) before moving to the next.
3. **Switchover** — Patroni promotes one of the now-configured replicas to leader, demoting the original primary. Brief (~5s) write-unavailability blip absorbed by HAProxy + client reconnect.
4. **Roll ex-primary** — The demoted node gets the wal-g env vars and redeploys cleanly as a replica.

After this completes, every Postgres node carries the wal-g credentials, so whichever node holds Patroni leadership at any given moment can fire `archive_command`. Failovers preserve archiving with no config change.

The full HA enable typically takes 2–4 minutes.

## Restoring to a point in time

On the Backups tab, the PITR section shows the available restore range — typically **(oldest snapshot's timestamp) → now** — and a datetime picker bounded to that window. Pick a moment, click **Restore to this moment**.

Railway:

1. Resolves the most recent base snapshot at-or-before your target timestamp. (The picker prevents you from picking a target outside the available range; the API also rejects out-of-range targets.)
2. Creates a new volume from that snapshot.
3. Sets `POSTGRES_RECOVERY_TARGET_TIME` on the restored service.
4. Stages the changes — review them via the Project Canvas, then Deploy.

When the new volume mounts, the Postgres image enters archive recovery, replays WAL from the bucket up to your target, and promotes. The old volume is retained, unmounted, under its original name.

For Postgres HA, restoring to a past timestamp requires full cluster downtime: replicas are wiped to fresh empty volumes and re-bootstrap from the restored primary via `pg_basebackup`. Plan accordingly.

## Coverage and warnings

PITR replay needs a covering base snapshot. Two states the Backups tab will surface:

- **No snapshots yet** — PITR is enabled but no backup has run. The picker is disabled. Take a manual backup or wait for the daily schedule.
- **Coverage gap** — The most recent snapshot is older than the WAL retention window (~7 days). The picker is disabled and a warning explains why: WAL beyond the retention window has no covering snapshot to replay onto. Take a fresh backup before restoring.

Both states are recoverable — just take a snapshot. Keep the daily and weekly schedules on (both added automatically when you enable PITR) and you'll never hit them. Removing either of those schedules while PITR is enabled will reintroduce a coverage gap, so leave them in place.

## Disabling PITR

Click **Disable PITR** on the Backups tab.

For single-node, Railway reverts the postgres-pitr template — removes the wal-g env vars and redeploys the service. The image cleans its archive config out of `postgresql.auto.conf` on next start so Postgres comes back without any wal-g machinery.

For HA, the same rolling-restart pattern as enable runs in reverse: revert the cluster's DCS archive config, roll replicas (clearing their wal-g vars), switchover, roll the ex-primary.

The Railway Bucket holding archived WAL is **not deleted** — you can still restore from it, or remove it manually from the Buckets page once you're sure you no longer need it.

If an enable run fails partway through, Railway runs a best-effort cleanup automatically: reverts the DCS edit and clears any wal-g vars that were written. The cluster goes back to its pre-enable state, and a toast surfaces the original error so you can decide whether to retry.

## Cost

PITR storage costs are billed at the standard [Railway storage bucket](/storage-buckets) rate. For most workloads, expect roughly:

- A few GB of compressed WAL per day under steady write load (zstd-compressed; idle databases are nearly free)
- One base snapshot per day at the volume's size, retained per your backup schedule

Restore egress is free.

## Limitations

- Available on the **Pro** plan and above.
- Currently amd64 only (the wal-g binary in the postgres-ssl image isn't published for arm64 yet).
- The available restore window starts from the first post-enable base snapshot, not retroactively. If you enable PITR today, you can't restore to yesterday.
- HA restore inherently requires full cluster downtime (replicas wiped, re-bootstrapped from restored primary).
- After failover, the residual RPO is bounded by `archive_timeout` (60s) plus failover-detection time. Workloads that need tighter guarantees should consider a dedicated archiver (pgBackRest) — out of scope for Railway's PITR offering today.
