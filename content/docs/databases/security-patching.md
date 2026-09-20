---
title: Database Security Patching
description: How Railway detects published vulnerabilities (CVEs) in the database images it ships and patches affected PostgreSQL and Redis services automatically, with a backup first.
---

Railway monitors the database images it ships for published security vulnerabilities (CVEs) and patches affected databases automatically. Before a patch, Railway takes a backup of the database volume. The patch itself is a redeploy of the same service onto a build of the image that no longer carries the vulnerability.

You don't need to enable anything. When a vulnerability matches a database you run, Railway schedules the patch, notifies your workspace admins, and shows a banner on the service with the option to patch immediately, skip a week, or move the maintenance window.

## Which databases are covered

Automatic patching covers databases deployed from Railway's own templates, running the images Railway builds or the upstream image the template ships.

| Engine | Images covered | Status |
|---|---|---|
| PostgreSQL | `ghcr.io/railwayapp-templates/postgres-ssl` (standalone, PgBouncer-fronted, and PITR-enabled services) and `ghcr.io/railwayapp-templates/postgres-ha/postgres-patroni` ([Postgres HA](/databases/postgresql-ha) data nodes) | Automatic patching active |
| Redis | The official Docker Hub `redis` image (the standalone template), Railway's `redis-sentinel` image ([Redis HA](/databases/redis-ha) data nodes), and Railway's `railwayapp/redis` Bitnami mirror | Automatic patching active |
| MySQL | The official Docker Hub `mysql` image and Railway's `mysql-ha` data node image | Monitored. Automatic patching is being rolled out |
| MongoDB | The official Docker Hub `mongo` image and Railway's `mongo-ha` data node image | Monitored. Automatic patching is being rolled out |

Sidecars in an HA cluster (HAProxy, PgBouncer, etcd) are not database servers and are not patched by this process.

Not covered:

- Custom or third-party images, including the bare Docker Hub `postgres` image, `pgvector/pgvector`, `postgis/postgis`, TimescaleDB, and personal forks. Railway doesn't build these images, so it has no fixed build to move you to
- MariaDB, Percona, raw `bitnami/*` images, and `mongodb/mongodb-community-server`
- Vulnerabilities in operating system packages inside the image. The monitor tracks CVEs filed against the database server itself (for example, the `postgresql:postgresql` product in the National Vulnerability Database), not the base image

If you replaced a template's image with your own, you're responsible for keeping it patched.

## How it works

### Detection

Roughly every 12 hours, Railway resolves the exact database version each covered service is running (from the image digest of its current deployment) and matches it against CVEs published in the <a href="https://nvd.nist.gov" target="_blank">National Vulnerability Database</a>. Railway also reads CISA's Known Exploited Vulnerabilities catalog and EPSS exploit-prediction scores to judge how urgent a match is.

When a CVE matches an image Railway builds and no fixed build exists yet, Railway rebuilds the image first. A patch is only ever scheduled against a build the monitor has confirmed clean.

### Scheduling

Every matched CVE is scheduled for patching, whatever its severity rating. Railway doesn't wait for a CVE to be rated high or critical: a low or medium CVE on your database is patched in the next maintenance window like any other.

By default, patches run in a weekend maintenance window from Saturday 10:00 UTC to Sunday 18:00 UTC. The service settings show this window as **Weekends**.

On an HA cluster, the window is split by role so that replicas are patched before the primary:

- Replicas are patched on the Saturday leg (10:00 to 24:00 UTC). In practice, a replica that isn't serving as primary is patched as soon as the patch is scheduled, because restarting a replica doesn't interrupt client traffic.
- The primary is patched on the Sunday leg (00:00 to 18:00 UTC), after its replicas have been running the fixed build.

A patch is only scheduled for a service that has a volume mounted. A database without a volume has nothing to back up, so Railway never restarts it automatically.

### Urgent vulnerabilities

Some vulnerabilities are patched immediately instead of waiting for the maintenance window. Railway decides this from the CVE's CVSS vector, not its severity label, because PostgreSQL requires authentication for almost everything reachable over the network and a real remote code execution bug is typically rated high rather than critical.

A CVE qualifies as urgent when all of the following hold:

- It is exploitable over the network
- It requires no privileges, or at most an ordinary database login
- It requires no user interaction
- It is either a remote code execution or high-impact bug with low attack complexity, or it is being exploited in the wild (listed in CISA's Known Exploited Vulnerabilities catalog, or carrying a high EPSS score)

A CVE that needs elevated (superuser-level) privileges never qualifies as urgent, even when it's actively exploited. Those always go through the scheduled path, where a human reviews them.

<Banner variant="warning">
An urgent patch runs immediately after the pre-patch backup, and it does not consult the service's auto-update setting. Turning auto updates off keeps your database out of the scheduled weekend patching, but not out of an urgent patch for an actively exploited or remotely exploitable vulnerability. Railway keeps the ability to run urgent patches behind an operator control, and a vulnerability that qualifies while that control is off falls back to the scheduled path instead.
</Banner>

### What happens during a patch

Whether the patch runs in the maintenance window, immediately as an urgent patch, or because you clicked **Patch now**, the steps are the same:

1. Railway re-checks that the patch is safe to apply right now: the service is running, the image and start command haven't changed since the last scan, the volume is mounted at the path the image expects, and a confirmed-clean build exists. If any check fails, the patch is held and retried on a later pass.
2. Railway takes a backup of every volume attached to the service, named **Pre-Security-Patch Backup**. The patch doesn't start until the backup exists.
3. If the service is pinned to an exact minor version (for example `postgres-ssl:16.3`) that upstream no longer patches, Railway first moves the pin to the major version tag (`postgres-ssl:16`), which resolves to the latest patch release of that major. Railway never changes the major version.
4. Railway redeploys the service. The redeploy pulls the fixed build under the same tag, so your image tag, variables, and volume stay as they were.
5. Railway clears the security patch banner and notifies workspace admins that the patch was applied.

For a standalone database, expect under a minute of downtime while it restarts. On an HA cluster, replicas are patched without client-visible impact, and the primary's patch causes a brief connection interruption at switchover while reads and writes keep flowing until then.

<Banner variant="info">
The pre-patch backup is taken on every plan, including Hobby and Free, doesn't count toward your plan's backup allowance, and is kept for 30 days. This differs from routine image auto-update backups, which are a Pro plan feature.
</Banner>

Railway holds off on a patch, and keeps the banner and the schedule in place, when:

- The service has no volume, or the volume is not ready (mid-migration, resizing, or forked)
- The volume is mounted at a path other than the one the image requires. The deploy would fail, so nothing is attempted until you move the mount
- The start command changed after the last scan. A patch is a fresh deploy of your committed configuration, so Railway refuses to apply a change it hasn't checked
- The service's configuration has drifted from the template defaults in a way Railway hasn't vetted as safe to redeploy through. These services are flagged for a Railway engineer rather than patched automatically
- The volume's region and the service's deploy region disagree, which could make the backup snapshot the wrong disk

Free plan restrictions on deploying during peak hours don't apply to security patches.

## What you see

### Banner on the service

When a patch is scheduled, the service's **Deployments** tab shows a banner titled **Security patch scheduled: CVE-XXXX-XXXXX (severity)**. The body names the version the patch moves the database to (when it differs from the running version) and the maintenance window, and notes that a snapshot is taken first.

The banner offers:

- **Patch now**: run the backup and redeploy immediately, after a confirmation
- **Skip this week**: hold this occurrence without changing the recurring schedule
- **Reschedule**: change the maintenance window
- **About this CVE**: open the CVE's entry in the National Vulnerability Database

On an HA cluster, the same banner appears on the cluster overview, so you don't need to open the individual data node. A cluster shows at most one banner at a time.

If you have a staged but undeployed change to the service's auto-update settings, the banner tells you so. The schedule shown in the banner is the committed one, which is what Railway acts on.

### Notifications

Workspace admins receive a notification, including an email, when a patch is scheduled and again when it's applied:

- **Security patch scheduled**, followed by the CVE identifier, names the service, the CVEs, and the maintenance window, and links to the service so you can patch now or reschedule.
- **Security patch applied**, followed by the CVE identifier, confirms the redeploy and that a snapshot was taken first.

Both include the CVE identifiers and severity, what the patch updates to, when it runs, and the backup note. Notifications are delivered by per-engine rules named **Postgres Security Patches**, **Redis Security Patches**, **MySQL Security Patches**, and **MongoDB Security Patches**. You can adjust or mute them in your workspace's notification settings without affecting other alerts.

### Deployments and backups

The patch appears in the service's **Deployments** tab as a new deployment. The pre-patch backup appears in the service's **Backups** tab as **Pre-Security-Patch Backup**.

## Control when a patch runs

### Patch now

Click **Patch now** on the banner. The confirmation states what the patch updates to and the expected downtime, and the button reads **Snapshot & patch**. Railway takes the backup, redeploys, and shows a **Security patch started** banner until the deployment finishes. If the redeploy fails, a toast tells you to check the deployment logs.

**Patch now** is only available while a patch is pending. It refuses, with the reason, when the same safety checks that hold a scheduled patch would fail.

### Skip this week

Click **Skip this week** to hold the next occurrence for seven days. The recurring schedule and the banner stay in place, and the banner shows when the skip lifts. Click **Undo skip** on the banner (or **Undo** on the toast) to reverse it.

### Reschedule

Click **Reschedule** on the banner to pick a different maintenance window. The change applies immediately, without a deploy. The reschedule dialog changes only the window. To change the update policy itself, use the service settings.

## The auto-update policy

Security patching runs through the same auto-update mechanism as [image auto updates](/deployments/image-auto-updates). The policy is under the service's **Settings**, in the **Source** section, under **Configure Auto Updates**. Databases Railway can patch offer a policy that other services don't:

| Policy | Effect on security patching |
|---|---|
| **Confirmed security vulnerabilities only** (recommended) | Railway redeploys only when a confirmed CVE matches the running build and a fixed build exists. Routine releases with no CVE are never applied. This is the policy Railway sets when it schedules a patch on a service with no policy of its own |
| **Security & bug-fix patches** | On Railway PostgreSQL images, Railway attaches the security patch to your own schedule and applies it in your window, because PostgreSQL security fixes ship as minor version bumps that a patch-level policy would never pick up on its own. On Redis, this policy already delivers security fixes by itself |
| **Minor updates & patches** | Left alone. Your policy already picks up the release that carries the fix |
| **Turn off auto updates** | Railway doesn't schedule or apply patches for this service in a maintenance window, and no banner is shown. Urgent patches for actively exploited or remotely exploitable vulnerabilities can still be applied, as described above |

Railway never overwrites a policy you set. It only fills in the security policy and the weekend window on services that have no auto-update configuration.

In [config as code](/infrastructure-as-code/reference), the security policy is `autoUpdates: { type: "vuln" }`.

**Note:** Changing the policy in **Settings** is a staged change that applies when you deploy. Changing the window from the banner's **Reschedule** applies immediately.

## Restore the pre-patch backup

If your application misbehaves after a patch, open the service's **Backups** tab, find **Pre-Security-Patch Backup**, and click **Restore**. Railway stages a new volume from the backup for you to review and deploy. See [Backups](/volumes/backups) for the full restore flow.

Restoring the backup returns your data to the moment before the patch, and the restored deploy runs whatever image the service is configured with at that point. It does not move the database back to the vulnerable build unless you also change the image tag.

## Limitations

- **Anything outside the volume is lost on redeploy.** A patch is a fresh container. Extensions or packages you installed at runtime into the container's filesystem (for example, a PostGIS extension compiled into a running Postgres container rather than shipped in the image) are not preserved. Only the data on the mounted volume carries over. Use an image that ships what you need.
- **The patch deploys your committed configuration.** Variables and settings you committed but never deployed take effect. Railway refuses the patch when the start command changed since the last scan, but other committed changes apply.
- **Major versions are never changed.** A patch moves you to the latest patch release of your current major. To move majors, see [Upgrading PostgreSQL Major Versions](/databases/postgresql-major-upgrade).
- **Custom images are out of scope**, including forks of Railway's images published under another registry path.
- **A database without a volume is never patched automatically.** Attach a volume, or redeploy it yourself.

## Troubleshooting

**The banner is still showing after I updated the image myself.** Railway clears the banner once a scan confirms the build the service runs has no matching CVEs. Until the next scan pass, the banner may remain. You can also click **Patch now**, which redeploys onto the fixed build and clears the banner.

**Patch now says the update can't be applied by a redeploy right now.** The message names the check that failed: the volume mount path, a start command changed since the last scan, a plan-limit setting on the service, or a volume that isn't ready for a backup. Fix the named condition and try again. The scheduled patch retries automatically once the condition clears.

**The security patch redeploy failed.** Open the failed deployment's logs. The pre-patch backup is in the **Backups** tab if you need it. If the database is down, redeploy the previous successful deployment, then <a href="https://station.railway.com" target="_blank">contact support</a> with the service ID.

**I didn't get a notification.** Security patch notifications go to workspace admins. Check the workspace's notification rules for **Postgres Security Patches** or **Redis Security Patches**.

**I need a database excluded from scheduled patching.** Set the service's auto-update policy to **Turn off auto updates**. Keep in mind that this also removes the banner and the scheduled fix, so you take on patching the database yourself. For an actively exploited vulnerability, Railway may still patch it.

For anything else, reach out on <a href="https://station.railway.com" target="_blank">Central Station</a> with the service ID and the CVE identifier from the banner or email.
