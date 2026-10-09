---
title: Convert PostgreSQL to high availability
description: Convert an existing Railway PostgreSQL service to a high-availability cluster with automatic failover.
---

Railway can convert an existing PostgreSQL service into a high-availability (HA) cluster backed by [Patroni](https://patroni.readthedocs.io/), [etcd](https://etcd.io/), and [HAProxy](https://www.haproxy.org/). The cluster fails over automatically: if the primary goes down, Patroni promotes a replica and HAProxy routes connections to it within seconds.

A converted cluster has three kinds of nodes:

- **Postgres data nodes.** Your original service starts as the primary, alongside streaming replicas managed by Patroni. Patroni supervises every data node and promotes a replica when the primary fails.
- **Coordinators (etcd).** The consensus store Patroni uses to elect a primary. They run as an odd-sized group (3, 5, 7, or 9 nodes) so a majority can still agree on the primary during a network partition.
- **Reverse proxies (HAProxy).** The single entry point for clients. HAProxy routes connections to the current primary, so your application never needs to know which node holds that role.

Postgres HA clusters also support in-place major version upgrades. See [Upgrade PostgreSQL to a newer major version](/databases/postgresql-major-upgrade).

## Prerequisites

Before converting, confirm the following.

**Official Railway image.** Only services running the official Railway Postgres images are supported. Custom images (for example PostGIS or TimescaleDB) aren't compatible.

- `ghcr.io/railwayapp-templates/postgres-ssl` (standard Railway Postgres)
- `ghcr.io/railwayapp-templates/postgres-ha/postgres-patroni` (already on the HA image but running standalone)

**Pinned version tag.** The `:latest` tag isn't supported. The service must be pinned to a major version. Supported majors are **14, 15, 16, 17, and 18**. If your service uses `:latest`, the High Availability section asks you to pin the version first (see [Convert](#convert)).

**No custom start command.** The cluster image manages its own startup. If you set a custom start command (one you set), the High Availability section shows a warning with a **Reset to template default** button. Resetting redeploys the service with its template's original command and unblocks the conversion.

## Convert

1. Open your Postgres service and go to **Database**, then **Config**, then **High Availability**.
2. If the service is on `:latest`, click **Pin to version X**. Railway detects the running Postgres version and stages the image tag change. Deploy the service, then come back to the High Availability section.
3. Choose the cluster size:

   | Setting | Default | Description |
   |---|---|---|
   | **Replicas** | 2 | Streaming replicas, in addition to the primary. Options: 2 to 7. |
   | **Coordinator nodes** | 3 | etcd nodes. The count stays odd so a majority can vote. 3 nodes tolerate 1 failure, and 5 tolerate 2. Options: 3, 5, 7, or 9. |
   | **Reverse proxies** | 3 | HAProxy instances routing connections to the primary. Options: 2 to 5. Trial workspaces are limited to 2. |

   <Image src="https://res.cloudinary.com/railway/image/upload/v1786572577/1a844484-3dac-4914-8600-db7c045da1dd.png"
   alt="High Availability section in the Postgres Config tab, showing the Replicas, Coordinator Nodes, and Reverse Proxy selectors and the Convert to HA button"
   layout="intrinsic"
   width={1020} height={638} quality={100} />

4. Click **Convert to HA**. The confirmation dialog says that active connections drop during the conversion and that connection strings change, so any hardcoded ones need updating afterwards.

   <Image src="https://res.cloudinary.com/railway/image/upload/v1786572627/f92637f5-6cd5-436f-9833-40824c1982b3.png"
   alt="Convert to High Availability confirmation dialog for Postgres"
   layout="intrinsic"
   width={916} height={542} quality={100} />

5. Confirm. Railway creates a backup of your database volume (it expires in 21 days), stages the cluster services (replicas, coordinators, and reverse proxies), and opens the cluster view.
6. Review the staged changes and click **Deploy**. Nothing changes until you deploy.

   <Image src="https://res.cloudinary.com/railway/image/upload/v1786575254/8f08dead-cd14-4984-855c-f61cbadda027.png"
   alt="Cluster overview showing the staged HA services with a Deploy to enable HA banner"
   layout="intrinsic"
   width={1576} height={859} quality={100} />

## Connect

Once the cluster is deployed, connect through HAProxy, never to an individual Postgres node. HAProxy always routes to the current primary, so connections keep working across failovers:

| Variable | Points to | Use for |
|---|---|---|
| `DATABASE_URL` | Postgres HA (HAProxy), private network | Connections from inside Railway |
| `DATABASE_PUBLIC_URL` | Postgres HA (HAProxy), TCP proxy | Connections from outside Railway |

Railway migrates every variable reference within your project as part of the staged changes. Any service that references your Postgres service's variables (for example `DATABASE_URL`) is updated to reference the new **Postgres HA** (HAProxy) service instead. No manual changes are needed for services within Railway.

The only case that needs manual action is a hardcoded connection string: in application code, in a Railway variable set to a literal URL rather than a reference, in another Railway project, in an external tool, or in a CI pipeline. After deploying the cluster, update those to use the connection details from the **Postgres HA** service.

`DATABASE_PUBLIC_URL` exists only while public access is enabled. If your standalone Postgres was publicly exposed, the conversion carries the public endpoint over to **Postgres HA** automatically. Otherwise the cluster is private by default. Click **Connect** on the cluster view and add **Public Access** to create the [TCP Proxy](/networking/tcp-proxy) and the variable.

If you need connection pooling in front of the cluster, [PgBouncer](/databases/postgresql-pgbouncer) works with HA clusters too. It sits in front of HAProxy.

## Verify

After every deployment is running, allow about 2 minutes for Patroni, etcd, and HAProxy to start and elect a primary. The cluster view shows each node's role and health. The current primary carries a **Primary** badge.

<Image src="https://res.cloudinary.com/railway/image/upload/v1786575207/e875e05f-9859-40b0-8031-3e14230bb93a.png"
alt="Healthy Postgres HA cluster overview showing the primary and replica nodes"
layout="intrinsic"
width={1014} height={787} quality={100} />

## Failover

Failover is automatic. When the primary becomes unreachable, Patroni holds an election through etcd, promotes a replica, and HAProxy reroutes connections to it. In-flight connections to the old primary are dropped. Clients that reconnect resume against the new primary without any configuration change, because they connect through HAProxy.

To move the primary role yourself (for example, back onto the original service after a failover), open the cluster view and use **Make primary** on the node that should take over. This is a coordinated switchover with the same brief connection drop as a failover.

## Scale

You can change the number of replicas, coordinators, and reverse proxies after conversion from the cluster view. Coordinators stay at an odd count (3, 5, 7, or 9) so a majority can still vote.

## Backups and restore

Each data node's volume keeps the backup schedules your standalone service had. Restoring a backup from the cluster view restores it to the primary and rebuilds every replica from it.

The cluster also supports [point-in-time recovery](/volumes/point-in-time-recovery). Enabling PITR restarts nodes one at a time, then switches the primary. A restore creates a standalone Postgres at the moment you pick.

## Revert

You can revert a cluster back to a single standalone Postgres service from the cluster view, or from **Database**, then **Config**, then **High Availability**. Click **Revert to Standalone** to stage the changes.

Reverting:

- Deletes all HA services (replicas, coordinators, and reverse proxies)
- Restores the TCP Proxy directly on the original Postgres service, if the cluster was publicly exposed
- Migrates variable references back to the original service

<Image src="https://res.cloudinary.com/railway/image/upload/v1786575238/7a71e44f-9f2e-4775-9f48-293326c3dee0.png"
alt="Revert to Standalone confirmation dialog for a Postgres HA cluster"
layout="intrinsic"
width={916} height={542} quality={100} />

**Reverting keeps every deleted node's volume.** Deleting the cluster services does not delete their volumes. The replicas' and coordinators' volumes stay in your project, unattached, and continue to count toward storage billing. This is deliberate: a revert never destroys data. Once you've confirmed the standalone Postgres service is healthy, it is safe to delete the leftover volumes from the project canvas. If you convert to HA again later, the new cluster provisions fresh volumes (with suffixed names, since the kept ones still hold the original names). It does not reuse them.

**Reverting is only available while the original Postgres service is the primary.** Reverting keeps that service and deletes every other node. If the primary role has moved after a failover, reverting would delete the node holding the latest data. If the original service is not the primary, use **Make primary** to switch over to it first. The revert flow offers this when it applies.

Railway migrates every variable reference within your project back to the original Postgres service as part of the staged revert. As with conversion, hardcoded connection strings outside of Railway need updating by hand.

## CLI

Use `railway postgres ha` to inspect cluster health, convert or revert a database, scale the cluster, and switch the primary:

```bash
railway postgres ha status --service postgres
railway postgres ha convert --service postgres --replicas 2
railway postgres ha scale --service postgres --replicas 3
railway postgres ha switchover \
  --service postgres \
  --to postgres-replica-1
```

See the [`railway postgres` reference](/cli/postgres) for every HA command, selector, confirmation flag, and deployment option.
