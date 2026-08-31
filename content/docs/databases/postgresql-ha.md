---
title: Upgrading PostgreSQL to High Availability
description: Convert an existing Railway PostgreSQL service to a high-availability cluster with automatic failover.
---

Railway can convert an existing PostgreSQL service into a high-availability cluster backed by [Patroni](https://patroni.readthedocs.io/), [etcd](https://etcd.io/), and [HAProxy](https://www.haproxy.org/). The cluster handles automatic leader election and failover — if the primary node goes down, Patroni promotes a replica and HAProxy begins routing connections to it within seconds.

## How the cluster is shaped

A converted cluster consists of three tiers:

- **Postgres data nodes** — your original service becomes the primary, plus streaming replicas managed by Patroni. Patroni supervises every node and promotes a replica when the primary fails.
- **etcd** — the consensus store Patroni uses for leader election. It runs as an odd-sized cluster (3, 5, 7, or 9 nodes) so a majority can still agree on the leader during a network partition.
- **HAProxy** — the single entry point for clients. It routes connections to the current primary, so your application never needs to know which node holds that role.

## Prerequisites

Before converting, confirm the following:

**Official Railway image** — Only services running the official Railway Postgres images are supported. Custom images (e.g. PostGIS, TimescaleDB) are not compatible.

- `ghcr.io/railwayapp-templates/postgres-ssl` (standard Railway Postgres)
- `ghcr.io/railwayapp-templates/postgres-ha/postgres-patroni` (already on the HA image but running standalone)

**Pinned version tag** — The `:latest` image tag is not supported. The service must be pinned to a specific major version. Supported versions are **14, 15, 16, 17, and 18**.

If your service uses `:latest`, the Railway dashboard will prompt you to pin the version before conversion. See [Step 1](#step-1--pin-the-image-version-if-needed) below.

**No custom start command** — The cluster image manages its own startup, so a service with a customer-set start command can't be converted. If your service has one, the High Availability section shows a warning with a one-click **Reset to template default** button — resetting redeploys the service with its template's original command and unblocks the conversion.

## Step 1 — Pin the Image Version (if needed)

If your Postgres service uses the `:latest` tag, you must pin it to a specific version before the HA conversion option becomes available.

Open your Postgres service and navigate to **Database → Config → High Availability**. If the service is on `:latest`, Railway will automatically detect the running Postgres version and show a **Pin to version X** button.

Click the button to stage the image tag change, then deploy the service. Once the deployment is complete, come back to the High Availability section — the conversion controls will now be available.

## Step 2 — Configure and Convert

Open your Postgres service and navigate to **Database → Config → High Availability**. You will see options to configure the cluster size before converting:

| Setting | Default | Description |
|---|---|---|
| **Replicas** | 2 | Number of streaming replicas (in addition to the primary). Options: 2–7. |
| **Coordinator Nodes** | 3 | etcd nodes. Must be an odd number for quorum — a 3-node cluster tolerates 1 failure; 5-node tolerates 2. Options: 3, 5, 7, or 9. |
| **Reverse Proxy** | 3 | Number of HAProxy instances routing connections to the primary. Options: 2–5. Trial workspaces are limited to 2. |

<Image src="https://res.cloudinary.com/railway/image/upload/v1786572577/1a844484-3dac-4914-8600-db7c045da1dd.png"
alt="High Availability section in the Postgres Config tab, showing the Replicas, Coordinator Nodes, and Reverse Proxy selectors and the Convert to HA button"
layout="intrinsic"
width={1020} height={638} quality={100} />

Click **Convert to HA**. A confirmation dialog will appear warning that:

- **Active connections will be dropped** during the conversion
- **Connection endpoints will change** — any hardcoded connection strings will need to be updated after conversion

<Image src="https://res.cloudinary.com/railway/image/upload/v1786572627/f92637f5-6cd5-436f-9833-40824c1982b3.png"
alt="Convert to High Availability confirmation dialog for Postgres"
layout="intrinsic"
width={916} height={542} quality={100} />

After confirming, Railway will:

1. Create a backup of your database volume (expires in 21 days)
2. Provision all cluster services (replicas, etcd nodes, HAProxy) as staged changes
3. Redirect you to the cluster overview

Review the staged changes and click **Deploy** to complete the conversion.

<Image src="https://res.cloudinary.com/railway/image/upload/v1786575254/8f08dead-cd14-4984-855c-f61cbadda027.png"
alt="Cluster overview showing the staged HA services with a Deploy to enable HA banner"
layout="intrinsic"
width={1576} height={859} quality={100} />

## Step 3 — Connection Strings

Once the cluster is deployed, connect through HAProxy — never to an individual Postgres node. HAProxy always routes to the current primary, so connections keep working across failovers:

| Variable | Points to | Use for |
|---|---|---|
| `DATABASE_URL` | Postgres HA (HAProxy) — private network | Connections from inside Railway |
| `DATABASE_PUBLIC_URL` | Postgres HA (HAProxy) — TCP proxy | Connections from outside Railway |

Railway automatically migrates all variable references within your project as part of the staged changes. Any service that references your Postgres service's variables (e.g. `DATABASE_URL`) will be updated to reference the new **Postgres HA** (HAProxy) service instead — no manual changes needed for services within Railway.

The only case that requires manual action is if you have hardcoded connection strings anywhere — in application code, Railway variables set to a literal URL (rather than a reference), other Railway projects, external tools, or CI pipelines. After deploying the cluster, update those to use the connection details from the **Postgres HA** service.

`DATABASE_PUBLIC_URL` exists only while public access is enabled. If your standalone Postgres was publicly exposed, the conversion carries the public endpoint over to **Postgres HA** automatically; otherwise the cluster is private by default — click **Connect** on the cluster view and add **Public Access** to create the [TCP Proxy](/networking/tcp-proxy) and the variable.

If you need connection pooling in front of the cluster, [PgBouncer](/databases/postgresql-pgbouncer) works with HA clusters too — it sits in front of HAProxy.

## Step 4 — Verify Cluster Health

After all deployments reach a running state, allow approximately 2 minutes for Patroni, etcd, and HAProxy to initialize and elect a leader. The cluster overview in the Railway dashboard shows each node's role — the current primary carries a **Primary** badge — along with per-node health.

<Image src="https://res.cloudinary.com/railway/image/upload/v1786575207/e875e05f-9859-40b0-8031-3e14230bb93a.png"
alt="Healthy Postgres HA cluster overview showing the primary and replica nodes"
layout="intrinsic"
width={1014} height={787} quality={100} />

## Failover

Failover is automatic. When the primary becomes unreachable, Patroni holds a leader election through etcd, promotes a replica, and HAProxy reroutes connections to it. In-flight connections to the old primary are dropped; clients that reconnect resume against the new primary without any configuration change, because they connect through HAProxy.

To move the primary role deliberately (for example, back onto the original node after a failover), open the cluster overview and use **Make Leader** on the node that should take over. This performs a coordinated switchover with the same brief connection drop as a failover.

## Reverting to Standalone

You can revert a cluster back to a single standalone Postgres service from the cluster overview, or from **Database → Config → High Availability**. Click **Revert to Standalone** to stage the changes.

Reverting will:

- Delete all HA services (replicas, etcd nodes, HAProxy)
- Restore the TCP Proxy directly on the original Postgres service, if the cluster was publicly exposed
- Migrate variable references back to the root service

<Image src="https://res.cloudinary.com/railway/image/upload/v1786575238/7a71e44f-9f2e-4775-9f48-293326c3dee0.png"
alt="Revert to Standalone confirmation dialog for a Postgres HA cluster"
layout="intrinsic"
width={916} height={542} quality={100} />

**Reverting keeps every deleted node's volume.** Deleting the cluster services does not delete their volumes: the replicas' and etcd nodes' volumes stay in your project, unattached, and continue to count toward storage billing. This is deliberate — a revert never destroys data. Once you've confirmed the standalone Postgres service is healthy, it is safe to delete the leftover volumes from the project canvas. If you convert to HA again later, the new cluster provisions fresh volumes (with suffixed names, since the kept ones still hold the original names) — it does not reuse them.

**Reverting is only available while the original Postgres service is the cluster leader.** Reverting keeps that service and deletes every other node — if the leader role has moved after a failover, reverting would delete the node holding the latest data. If the original service is not the leader, use **Make Leader** to promote it first; the revert flow offers this when it applies.

Railway will automatically migrate all variable references within your project back to the original Postgres service as part of the staged revert. As with conversion, any hardcoded connection strings outside of Railway will need to be updated manually.

## Manage HA from the CLI

Use `railway postgres ha` to inspect cluster health, convert or revert a
database, scale cluster members, and perform a switchover:

```bash
railway postgres ha status --service postgres
railway postgres ha convert --service postgres --replicas 2
railway postgres ha scale --service postgres --replicas 3
railway postgres ha switchover \
  --service postgres \
  --to postgres-replica-1
```

See the [`railway postgres` reference](/cli/postgres) for every HA command,
selector, confirmation flag, and deployment option.

## Major version upgrades

Postgres HA clusters support in-place major version upgrades — the primary
upgrades first, then every replica rebuilds from it on the new major before
failover resumes. See [Upgrading PostgreSQL Major Versions](/databases/postgresql-major-upgrade)
for the full guide.
