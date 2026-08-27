---
title: Upgrading MySQL to High Availability
description: Convert an existing Railway MySQL service to a high-availability Group Replication cluster with automatic failover.
---

Railway can convert an existing MySQL service into a high-availability cluster backed by [MySQL Group Replication](https://dev.mysql.com/doc/refman/8.4/en/group-replication.html) and [HAProxy](https://www.haproxy.org/). The data nodes form a single-primary Group Replication group — consensus runs inside MySQL itself, so there is no separate coordinator tier — and HAProxy routes client connections to whichever node is currently the primary. If the primary goes down, the group elects a new one and HAProxy begins routing to it within seconds.

## How the cluster is shaped

A converted cluster consists of:

- **MySQL data nodes** — your original service becomes the primary, plus an even number of replicas, for an odd cluster total (3, 5, 7, or 9). Group Replication needs a strict majority of members to agree before electing a primary, and an odd count is what lets the group reach that majority during a network partition instead of splitting the vote. Secondaries run with `super_read_only` enabled at all times, so writes can never land outside the group's certification.
- **HAProxy** — the single entry point for clients. It probes every data node's role endpoint and routes connections to the current primary, so your application never needs to know which node holds that role.

There is no read endpoint over the secondaries in this version — all connections, reads included, go to the primary through HAProxy. The replicas exist for failover, not read scaling.

## Prerequisites

Before converting, confirm the following:

**Official MySQL image** — Only services running the official [mysql](https://hub.docker.com/_/mysql) Docker image (what Railway's MySQL template deploys) are supported, along with services already on Railway's cluster data-node image (`ghcr.io/railwayapp-templates/mysql-ha/mysql`) but running standalone. Forks and variants (e.g. MariaDB, Percona) are not compatible. If your service qualifies, the **High Availability** section appears in its Config tab.

**Supported version** — The image must be tagged with a supported major version: **8 or 9**. The `:latest` tag and named tags are not supported — Railway needs a detectable version to pin the cluster's images to. If your service uses `:latest`, change the image to a versioned tag (e.g. `mysql:8.4`) in the service settings and redeploy before converting.

As part of the conversion, Railway pins the data nodes to your service's exact `major.minor` series. The cluster image is only published at exact minor tags (`8.4`, `9.4`, and so on), never a bare major, so pinning to the version already running is what makes a real image available to pull.

**No custom start command** — The cluster image manages its own startup, so a service with a customer-set start command can't be converted. If your service has one, the High Availability section shows a warning with a one-click **Reset to template default** button — MySQL reads its credentials from environment variables (`MYSQL_ROOT_PASSWORD`), not from the start command, so resetting never affects authentication.

## Step 1 — Open the High Availability section

Open your MySQL service and navigate to **Database → Config → High Availability**.

<Image src="https://res.cloudinary.com/railway/image/upload/v1787041575/FINAL-step1-config-ha-section_uk71pe.png"
alt="High Availability section in the MySQL Config tab, showing the MySQL Replicas and Reverse Proxies selectors and the Convert to HA button"
layout="intrinsic"
width={928} height={872} quality={100} />

## Step 2 — Configure and Convert

You will see options to configure the cluster size before converting:

| Setting | Default | Description |
|---|---|---|
| **MySQL Replicas** | 2 | Replicas added to the primary. Options: 2, 4, 6, or 8 — even counts keep the cluster's total node count odd: 3, 5, 7, or 9 nodes. |
| **Reverse Proxies** | 2 | HAProxy instances routing connections to the primary. Options: 1 or 2. Trial workspaces are limited to 1. |

There is no separate coordinator tier to size — Group Replication's consensus runs inside the MySQL nodes themselves.

Click **Convert to HA**. A confirmation dialog will appear warning that:

- **Active connections will be dropped** during the conversion
- **Connection endpoints will change** — any hardcoded connection strings will need to be updated after conversion

<Image src="https://res.cloudinary.com/railway/image/upload/v1787041576/FINAL-step2-convert-dialog_e0hrnn.png"
alt="Convert to High Availability confirmation dialog for MySQL"
layout="intrinsic"
width={612} height={378} quality={100} />

After confirming, Railway will:

1. Create a backup of your database volume
2. Provision all cluster services (replicas and HAProxy) as staged changes
3. Redirect you to the cluster overview

Review the staged changes and click **Deploy** to complete the conversion. The conversion adopts your existing volume and its data — the replicas clone from your original node when they first join the group.

<Image src="https://res.cloudinary.com/railway/image/upload/v1787041576/FINAL-step2b-staged-changes_uxps3c.png"
alt="Cluster overview showing the staged MySQL HA services with an Apply changes and Deploy banner"
layout="intrinsic"
width={704} height={521} quality={100} />

## Step 3 — Connection Strings

Once the cluster is deployed, connect through HAProxy — never to an individual MySQL node. HAProxy always routes to the current primary, so connections keep working across failovers:

| Variable | Points to | Use for |
|---|---|---|
| `MYSQL_URL` | MySQL HA (HAProxy) — private network | Connections from inside Railway |
| `MYSQL_PUBLIC_URL` | MySQL HA (HAProxy) — TCP proxy | Connections from outside Railway |

The HAProxy service also exposes the individual `MYSQLHOST`, `MYSQLPORT`, `MYSQLUSER`, `MYSQLPASSWORD`, and `MYSQLDATABASE` variables for clients that take connection details separately.

Railway automatically migrates all variable references within your project as part of the staged changes. Any service that references your MySQL service's variables (e.g. `MYSQL_URL`) will be updated to reference the new **MySQL HA** (HAProxy) service instead — no manual changes needed for services within Railway.

The only case that requires manual action is if you have hardcoded connection strings anywhere — in application code, Railway variables set to a literal URL (rather than a reference), other Railway projects, external tools, or CI pipelines. After deploying the cluster, update those to use the connection details from the **MySQL HA** service.

`MYSQL_PUBLIC_URL` exists only while public access is enabled. If your standalone MySQL was publicly exposed, the conversion carries the public endpoint over to **MySQL HA** automatically; otherwise the cluster is private by default — click **Connect** on the cluster view and add **Public Access** to create the [TCP Proxy](/networking/tcp-proxy) and the variable.

## Step 4 — Verify Cluster Health

After all deployments reach a running state, allow a minute or two for the group to form and for the replicas to complete their initial clone from your original node. The cluster overview in the Railway dashboard shows each node's role — the current primary carries a **Primary** badge — along with per-node health.

<Image src="https://res.cloudinary.com/railway/image/upload/v1787041575/FINAL-step4-healthy-cluster_c4pgib.png"
alt="Healthy MySQL HA cluster overview showing the primary and replica nodes"
layout="intrinsic"
width={928} height={746} quality={100} />

## Failover

Failover is automatic. When the primary becomes unreachable, the remaining members vote — once a majority agrees it is down, the group elects a new primary and HAProxy reroutes connections to it within one probe interval. In-flight connections to the old primary are dropped; clients that reconnect resume against the new primary without any configuration change, because they connect through HAProxy. When the old primary comes back, it rejoins the group as a secondary and catches up automatically.

To move the primary role back onto your original node deliberately (for example, after a failover, or before reverting), open the cluster overview and use **Make Leader**. This performs a coordinated switchover with the same brief connection drop as a failover.

## Scaling the Cluster

You can change the number of replicas after conversion from the cluster overview. Replica counts move in steps of two (2, 4, 6, or 8) for the same quorum reason as at conversion time: the cluster total stays odd.

## Backups and Restore

Each data node's volume carries the same backup schedules your standalone service had. Restoring a backup from the cluster view restores the same snapshot to **every** data node — the group reforms from the restored data with each node minting a fresh identity, so the restore never collides with the group's previous membership records.

## Reverting to Standalone

You can revert a cluster back to a single standalone MySQL service from the cluster overview, or from **Database → Config → High Availability**. Click **Revert to Standalone** to stage the changes.

Reverting will:

- Delete all HA services (replicas and HAProxy)
- Restore the TCP Proxy directly on the original MySQL service, if the cluster was publicly exposed
- Migrate variable references back to the root service

<Image src="https://res.cloudinary.com/railway/image/upload/v1787041575/FINAL-revert-dialog_tktzls.png"
alt="Revert to Standalone confirmation dialog for a MySQL HA cluster"
layout="intrinsic"
width={612} height={378} quality={100} />

The reverted service keeps the cluster image (`mysql-ha/mysql`), which detects that it has no cluster peers and runs plain standalone `mysqld` with authentication intact. Don't swap the image back to a bare `mysql` tag by hand — the cluster image runs standalone perfectly well, and it is what keeps a later re-conversion possible without another image change.

**Reverting is only available while the original MySQL service is the cluster primary.** Reverting keeps that service and deletes every other node — if the primary role has moved after a failover, reverting would delete the node holding the latest data. If the original service is not the primary, use **Make Leader** to promote it first; the revert flow offers this when it applies.

Railway will automatically migrate all variable references within your project back to the original MySQL service as part of the staged revert. As with conversion, any hardcoded connection strings outside of Railway will need to be updated manually.
