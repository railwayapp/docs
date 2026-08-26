---
title: Upgrading PostgreSQL Major Versions
description: Move a Railway PostgreSQL service to a newer major version in place, with a preflight check, automatic backups, and one-click revert.
---

Railway can upgrade a PostgreSQL service to a newer major version in place, using [`pg_upgrade`](https://www.postgresql.org/docs/current/pgupgrade.html). The database is stopped for the duration of the upgrade — typically a few minutes, depending on data size — and comes back on the new major with all its data intact.

This works for standalone Postgres services and for [Postgres HA](/databases/postgresql-ha) clusters. On a cluster, the primary is upgraded first and every replica is rebuilt from it on the new major; the cluster stays paused (no automatic failover) until every member is back on the same major.

## Prerequisites

- **Official Railway image only** — `ghcr.io/railwayapp-templates/postgres-ssl` or a Postgres HA cluster on `ghcr.io/railwayapp-templates/postgres-ha/postgres-patroni`. Custom images are not supported.
- **Pinned version tag** — the service must be on a specific major (`:latest` is not supported).
- Supported source majors: **14 through 17**, upgrading to any newer major Railway publishes.

## Step 1 — Review the Preflight Report

Open your Postgres service, navigate to **Database → Config → Major Version Upgrade**. Railway runs a read-only preflight check against the live database and reports each result:

| Check | What it looks for |
|---|---|
| `reg*` column types | Columns storing `regproc`, `regoper`, and similar catalog-OID types an upgrade cannot preserve (only checked below major 16) |
| `aclitem` column types | Columns using the `aclitem` type, whose internal format changed in PostgreSQL 16 (only checked below major 16) |
| Prepared transactions | Open two-phase-commit transactions, which must be committed or rolled back first |
| Logical replication slots | Slots are not carried over — consumers must re-create them after the upgrade |
| Password authentication | Roles still using `md5` password auth, which should move to SCRAM first |
| Event triggers | Present triggers should be reviewed for compatibility with a catalog restore |
| Extensions | Each installed extension is checked against what the image ships: missing entirely (blocker) or behind the image's version (run `ALTER EXTENSION … UPDATE`) |
| Data size | Informational — `pg_upgrade` needs free volume space for the new catalog |

A **blocker** prevents starting the upgrade until it's resolved. A **warning** doesn't block the upgrade but is worth reviewing first. Click **Re-run** after making a fix to refresh the report.

## Step 2 — Start the Upgrade

Choose the target major version and click **Upgrade to PostgreSQL &lt;version&gt;**. The confirmation dialog summarizes what happens:

- The database is stopped while `pg_upgrade` runs, so it will be briefly unavailable.
- A backup is taken before the upgrade and another once the new major is serving — a restore point on either side.
- The upgrade only starts if preflight reports no blockers.

Once confirmed, Railway takes the pre-upgrade backup, runs the upgrade job against the volume, and redeploys the service on the new major's image. A progress panel on the same page tracks each phase.

On a **Postgres HA** cluster, this additionally pauses cluster failover, upgrades the primary, then rebuilds each replica from it on the new major before resuming failover — the whole cluster moves together.

## Step 3 — Revert, if Needed

For a limited window after the upgrade completes, a banner offers **Revert and discard changes** — this restores the pre-upgrade backup and returns the service (or every member of an HA cluster) to the previous major. Any writes made after the upgrade are lost, since the backup point predates them.

If the upgrade itself fails, the same revert action is offered from the failure banner, and the pre-upgrade backup is restored automatically to recover the service.

## Manual Image Edits

Changing the service's image tag directly (outside this flow) to jump a Postgres major does **not** run `pg_upgrade` and does not migrate the data directory — the database will very likely refuse to start, or start against data it can't safely read. Railway warns about this in the image settings when the new tag's major doesn't match the running data, and steers you back to this flow. Use it unless the volume is empty or you already know the data is compatible with the new major.

## Troubleshooting

**A replica in an HA cluster won't come back after an upgrade or revert.** Railway retries automatically; if a replica was offline for an unrelated reason during the operation, it may need a redeploy once it's back to pick up the rebuild. Contact support if a replica stays unhealthy after that.

**Extensions report "missing from the image."** The target major's image doesn't ship that extension. Check the extension's own release notes for major-version support before upgrading, or remove it first if it's unused.

**Logical replication slots after an upgrade.** These are not preserved across a major upgrade — re-create any logical slots your consumers depend on once the new major is serving.
