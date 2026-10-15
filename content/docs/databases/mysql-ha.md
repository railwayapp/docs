---
title: Convert MySQL to high availability
description: Convert an existing Railway MySQL service to a high-availability Group Replication cluster with automatic failover.
---

Railway can convert an existing MySQL service into a high-availability (HA) cluster backed by [MySQL Group Replication](https://dev.mysql.com/doc/refman/8.4/en/group-replication.html) and [HAProxy](https://www.haproxy.org/). The data nodes form a single-primary Group Replication group. Consensus runs inside MySQL itself, so there is no separate coordinator tier, and HAProxy routes client connections to whichever node is currently the primary. If the primary goes down, the group elects a new one and HAProxy routes to it within seconds.

A converted cluster has two kinds of nodes:

- **MySQL data nodes.** Your original service starts as the primary, alongside an even number of replicas, for an odd cluster total (3, 5, 7, or 9). Group Replication needs a strict majority of nodes to agree before electing a primary, and an odd count is what lets the group reach that majority during a network partition instead of splitting the vote. Replicas run with `super_read_only` enabled at all times, so writes can never land outside the group's certification.
- **Reverse proxies (HAProxy).** The single entry point for clients. HAProxy probes every data node's role and routes connections to the current primary, so your application never needs to know which node holds that role.

There is no read endpoint over the replicas in this version. All connections, reads included, go to the primary through HAProxy. The replicas exist for failover, not read scaling.

## Prerequisites

Before converting, confirm the following.

**Official MySQL image.** Only services running the official [mysql](https://hub.docker.com/_/mysql) Docker image (what Railway's MySQL template deploys) are supported, along with services already on Railway's cluster data-node image (`ghcr.io/railwayapp-templates/mysql-ha/mysql`) but running standalone. Forks and variants (for example MariaDB or Percona) aren't compatible. If your service qualifies, the **High Availability** section appears in its Config tab.

**Supported version.** The image must be tagged with a supported major version, **8 or 9**, including the minor (for example `mysql:8.4`). The `:latest` tag and named tags aren't supported, because Railway needs a detectable version to pin the cluster's images to. If your service uses `:latest`, change the image to a versioned tag in the service settings and redeploy before converting.

Railway pins every node to the `major.minor` version your service already runs, so all nodes stay on the same version.

**No custom start command.** The cluster image manages its own startup. If you set a custom start command (one you set), the High Availability section shows a warning with a **Reset to template default** button. MySQL reads its credentials from environment variables (`MYSQL_ROOT_PASSWORD`), not from the start command, so resetting never affects authentication.

## Convert

1. Open your MySQL service and go to **Database**, then **Config**, then **High Availability**.

   <Image src="https://res.cloudinary.com/railway/image/upload/v1787041575/FINAL-step1-config-ha-section_uk71pe.png"
   alt="High Availability section in the MySQL Config tab, showing the MySQL Replicas and Reverse Proxies selectors and the Convert to HA button"
   layout="intrinsic"
   width={928} height={872} quality={100} />

2. Choose the cluster size:

   | Setting | Default | Description |
   |---|---|---|
   | **MySQL replicas** | 2 | Replicas added to the primary. Options: 2, 4, 6, or 8. Even counts keep the cluster's total node count odd: 3, 5, 7, or 9 nodes. |
   | **Reverse proxies** | 2 | HAProxy instances routing connections to the primary. Options: 1 or 2. Trial workspaces are limited to 1. |

   There is no separate coordinator tier to size. Group Replication's consensus runs inside the MySQL nodes themselves.

3. Click **Convert to HA**. The confirmation dialog says that active connections drop during the conversion and that connection strings change, so any hardcoded ones need updating afterwards.

   <Image src="https://res.cloudinary.com/railway/image/upload/v1787041576/FINAL-step2-convert-dialog_e0hrnn.png"
   alt="Convert to High Availability confirmation dialog for MySQL"
   layout="intrinsic"
   width={612} height={378} quality={100} />

4. Confirm. Railway creates a backup of your database volume, stages the cluster services (replicas and reverse proxies), and opens the cluster view.
5. Review the staged changes and click **Deploy**. Nothing changes until you deploy. The conversion adopts your existing volume and its data. The replicas copy it from your original service when they first join the group.

   <Image src="https://res.cloudinary.com/railway/image/upload/v1787041576/FINAL-step2b-staged-changes_uxps3c.png"
   alt="Cluster overview showing the staged MySQL HA services with an Apply changes and Deploy banner"
   layout="intrinsic"
   width={704} height={521} quality={100} />

## Connect

Once the cluster is deployed, connect through HAProxy, never to an individual MySQL node. HAProxy always routes to the current primary, so connections keep working across failovers:

| Variable | Points to | Use for |
|---|---|---|
| `MYSQL_URL` | MySQL HA (HAProxy), private network | Connections from inside Railway |
| `MYSQL_PUBLIC_URL` | MySQL HA (HAProxy), TCP proxy | Connections from outside Railway |

The HAProxy service also exposes the individual `MYSQLHOST`, `MYSQLPORT`, `MYSQLUSER`, `MYSQLPASSWORD`, and `MYSQLDATABASE` variables for clients that take connection details separately.

Railway migrates every variable reference within your project as part of the staged changes. Any service that references your MySQL service's variables (for example `MYSQL_URL`) is updated to reference the new **MySQL HA** (HAProxy) service instead. No manual changes are needed for services within Railway.

The only case that needs manual action is a hardcoded connection string: in application code, in a Railway variable set to a literal URL rather than a reference, in another Railway project, in an external tool, or in a CI pipeline. After deploying the cluster, update those to use the connection details from the **MySQL HA** service.

`MYSQL_PUBLIC_URL` exists only while public access is enabled. If your standalone MySQL was publicly exposed, the conversion carries the public endpoint over to **MySQL HA** automatically. Otherwise the cluster is private by default. Click **Connect** on the cluster view and add **Public Access** to create the [TCP Proxy](/networking/tcp-proxy) and the variable.

## Verify

After every deployment is running, allow a minute or two for the group to form and for the replicas to finish copying data from your original service. The cluster view shows each node's role and health. The current primary carries a **Primary** badge.

<Image src="https://res.cloudinary.com/railway/image/upload/v1787041575/FINAL-step4-healthy-cluster_c4pgib.png"
alt="Healthy MySQL HA cluster overview showing the primary and replica nodes"
layout="intrinsic"
width={928} height={746} quality={100} />

## Failover

Failover is automatic. When the primary becomes unreachable, the remaining nodes vote. Once a majority agrees it is down, the group elects a new primary and HAProxy reroutes connections to it within one probe interval. In-flight connections to the old primary are dropped. Clients that reconnect resume against the new primary without any configuration change, because they connect through HAProxy. When the old primary comes back, it rejoins the group as a replica and catches up automatically.

To move the primary role back onto your original service yourself (for example, after a failover, or before reverting), open the cluster view and use **Make primary**. This is a coordinated switchover with the same brief connection drop as a failover.

## Scale

You can change the number of replicas after conversion from the cluster view. Replica counts move in steps of two (2, 4, 6, or 8) for the same reason as at conversion time: the cluster total stays odd, so a majority can vote.

## Backups and restore

Each data node's volume keeps the backup schedules your standalone service had. Restoring a backup restores the same snapshot to every data node, and the group re-forms from it.

The cluster also supports [point-in-time recovery](/volumes/point-in-time-recovery). Enabling PITR restarts nodes one at a time, then switches the primary. A restore creates a standalone MySQL at the moment you pick.

## Revert

You can revert a cluster back to a single standalone MySQL service from the cluster view, or from **Database**, then **Config**, then **High Availability**. Click **Revert to Standalone** to stage the changes.

Reverting:

- Deletes all HA services (replicas and reverse proxies)
- Restores the TCP Proxy directly on the original MySQL service, if the cluster was publicly exposed
- Migrates variable references back to the original service

<Image src="https://res.cloudinary.com/railway/image/upload/v1787041575/FINAL-revert-dialog_tktzls.png"
alt="Revert to Standalone confirmation dialog for a MySQL HA cluster"
layout="intrinsic"
width={612} height={378} quality={100} />

The reverted service keeps the cluster image (`mysql-ha/mysql`), which detects that it has no cluster peers and runs plain standalone `mysqld` with authentication intact. Don't swap the image back to a bare `mysql` tag by hand. The cluster image runs standalone perfectly well, and it is what keeps a later re-conversion possible without another image change.

**Reverting keeps every deleted node's volume.** Deleting the cluster services does not delete their volumes. The replicas' volumes stay in your project, unattached, and continue to count toward storage billing. This is deliberate: a revert never destroys data. Once you've confirmed the standalone MySQL service is healthy, it is safe to delete the leftover volumes from the project canvas. If you convert to HA again later, the new cluster provisions fresh volumes (with suffixed names, since the kept ones still hold the original names). It does not reuse them.

**Reverting is only available while the original MySQL service is the primary.** Reverting keeps that service and deletes every other node. If the primary role has moved after a failover, reverting would delete the node holding the latest data. If the original service is not the primary, use **Make primary** to switch over to it first. The revert flow offers this when it applies.

Railway migrates every variable reference within your project back to the original MySQL service as part of the staged revert. As with conversion, hardcoded connection strings outside of Railway need updating by hand.

## CLI

Use `railway mysql ha` to inspect cluster health, convert or revert a database, scale the cluster, and switch the primary:

```bash
railway mysql ha status --service mysql
railway mysql ha convert --service mysql --replicas 2
railway mysql ha scale --service mysql --replicas 4
railway mysql ha switchover \
  --service mysql \
  --to MySQL-2
```

Every HA command takes `--service`, `--environment`, `--project`, and `--json`. Actions that change the cluster ask for confirmation unless you pass `--yes`, and deploy unless you pass `--no-deploy`, which stages the change instead.
