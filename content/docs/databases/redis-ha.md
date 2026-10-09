---
title: Convert Redis to high availability
description: Convert an existing Railway Redis service to a high-availability cluster with automatic failover.
---

Railway can convert an existing Redis service into a high-availability (HA) cluster backed by [Redis Sentinel](https://redis.io/docs/latest/operate/oss_and_stack/management/sentinel/) and [HAProxy](https://www.haproxy.org/). Every Redis node runs a colocated Sentinel process. Sentinel elects the primary and handles failover, and HAProxy routes client connections to whichever node is currently the primary. If the primary goes down, Sentinel promotes a replica and HAProxy routes to it within seconds.

A converted cluster has two kinds of nodes:

- **Redis data nodes.** Your original service starts as the primary, alongside an even number of replicas. Every node also runs a Sentinel, so the cluster always totals an odd number of Sentinel voters (3, 5, 7, or 9). An odd count is what lets Sentinel reach a majority during a network partition instead of splitting the vote.
- **Reverse proxies (HAProxy).** The single entry point for clients. HAProxy health-checks every Redis node and routes connections to the current primary, so your application never needs to know which node holds that role.

Persistence is managed for you. The cluster always runs with AOF (append-only file) persistence enabled, so an auto-restarted node comes back with its data instead of an empty dataset.

## Prerequisites

Before converting, confirm the following.

**Supported Redis image.** Services running any of the following images can be converted:

- The official [redis](https://hub.docker.com/_/redis) Docker image (what Railway's Redis template deploys)
- The `ghcr.io/railwayapp-templates/redis-ha/redis-sentinel` image, when already deployed but running standalone
- The legacy Bitnami Redis template lineage: the `railwayapp/redis` Docker Hub mirror and the `bitnami/redis` image it mirrors

Forks and bundles (for example Valkey or Redis Stack) aren't compatible. If your service qualifies, the **High Availability** section appears in its Config tab.

**Supported version.** The image must be tagged with a supported major version, **7 or 8**, including the minor (for example `redis:8.2`). The `:latest` tag, bare majors like `redis:8`, and named tags aren't supported. If your service uses one of those, change the image to a `major.minor` tag in the service settings and redeploy before converting.

Railway pins every node to the `major.minor` version your service already runs, so all nodes stay on the same version. Redis replicas sync from the primary through RDB snapshots, which aren't readable across mismatched versions.

**No custom start command.** The cluster image manages its own startup. If you set a custom start command (one you set), the High Availability section shows a warning with a **Reset to template default** button. Resetting redeploys the service with its template's original command (which keeps authentication intact) and unblocks the conversion.

## Convert

1. Open your Redis service and go to **Database**, then **Config**, then **High Availability**.

   <Image src="https://res.cloudinary.com/railway/image/upload/v1786575275/feb83543-28dc-446d-a12e-ea8af16b7c9d.png"
   alt="High Availability section in the Redis Config tab, showing the Redis Replicas and Reverse Proxies selectors and the Convert to HA button"
   layout="intrinsic"
   width={685} height={513} quality={100} />

2. Choose the cluster size:

   | Setting | Default | Description |
   |---|---|---|
   | **Redis replicas** | 2 | Replicas added to the primary. Options: 2, 4, 6, or 8. Even counts keep the cluster's total node count (and with it the Sentinel voter count) odd: 3, 5, 7, or 9 nodes. |
   | **Reverse proxies** | 2 | HAProxy instances routing connections to the primary. Options: 1 or 2. Trial workspaces are limited to 1. |

   There is no separate coordinator tier to size. Sentinel runs on the Redis nodes themselves.

3. Click **Convert to HA**. The confirmation dialog says that active connections drop during the conversion and that connection strings change, so any hardcoded ones need updating afterwards.

   <Image src="https://res.cloudinary.com/railway/image/upload/v1786575307/d4194715-0fcb-4979-9db3-9bdef34b638f.png"
   alt="Convert to High Availability confirmation dialog for Redis"
   layout="intrinsic"
   width={642} height={398} quality={100} />

4. Confirm. Railway creates a backup of your database volume (it expires in 21 days), stages the cluster services (replicas and reverse proxies), and opens the cluster view.
5. Review the staged changes and click **Deploy**. Nothing changes until you deploy.

## Connect

Once the cluster is deployed, connect through HAProxy, never to an individual Redis node. HAProxy always routes to the current primary, so connections keep working across failovers:

| Variable | Points to | Use for |
|---|---|---|
| `REDIS_URL` | Redis HA (HAProxy), private network | Connections from inside Railway |
| `REDIS_PUBLIC_URL` | Redis HA (HAProxy), TCP proxy | Connections from outside Railway |

Railway migrates every variable reference within your project as part of the staged changes. Any service that references your Redis service's variables (for example `REDIS_URL`) is updated to reference the new **Redis HA** (HAProxy) service instead. No manual changes are needed for services within Railway.

The only case that needs manual action is a hardcoded connection string: in application code, in a Railway variable set to a literal URL rather than a reference, in another Railway project, in an external tool, or in a CI pipeline. After deploying the cluster, update those to use the connection details from the **Redis HA** service.

`REDIS_PUBLIC_URL` exists only while public access is enabled. If your standalone Redis was publicly exposed, the conversion carries the public endpoint over to **Redis HA** automatically. Otherwise the cluster is private by default. Click **Connect** on the cluster view and add **Public Access** to create the [TCP Proxy](/networking/tcp-proxy) and the variable.

## Verify

After every deployment is running, allow a minute or two for Sentinel to establish the primary and for the replicas to finish their initial sync. The cluster view shows each node's role and health. The current primary carries a **Primary** badge.

<Image src="https://res.cloudinary.com/railway/image/upload/v1786575304/567f4c1e-4061-430f-9f8e-b87f9c191f12.png"
alt="Healthy Redis HA cluster overview showing the primary and replica nodes"
layout="intrinsic"
width={1012} height={777} quality={100} />

## Failover

Failover is automatic. When the primary becomes unreachable, the Sentinels vote. Once a majority agrees it is down, one replica is promoted and HAProxy reroutes connections to it. In-flight connections to the old primary are dropped. Clients that reconnect (which most Redis clients do by default) resume against the new primary without any configuration change, because they connect through HAProxy.

To move the primary role yourself (for example, back onto the original service after a failover), open the cluster view and use **Make primary** on the node that should take over. This is a coordinated switchover with the same brief connection drop as a failover.

## Scale

You can change the number of replicas after conversion from the cluster view. Replica counts move in steps of two (2, 4, 6, or 8) for the same reason as at conversion time: the cluster total stays odd, so a majority can vote.

## Backups and restore

Each data node's volume keeps the backup schedules your standalone service had. Restoring a backup from the cluster view restores it to the primary, and the replicas sync from it. Redis HA does not offer point-in-time recovery.

## Revert

You can revert a cluster back to a single standalone Redis service from the cluster view, or from **Database**, then **Config**, then **High Availability**. Click **Revert to Standalone** to stage the changes.

Reverting:

- Deletes all HA services (replicas and reverse proxies)
- Restores the TCP Proxy directly on the original Redis service, if the cluster was publicly exposed
- Migrates variable references back to the original service

The reverted service stays on the cluster's `redis-sentinel` image rather than returning to `redis:X`. Running standalone, it behaves like a plain Redis with authentication intact. Leave the image as is. Swapping it back to `redis:X` by hand drops the `--requirepass` startup wiring the Sentinel image provides, so clients that send your password start failing to authenticate.

**Reverting keeps every deleted node's volume.** Deleting the cluster services does not delete their volumes. The replicas' volumes stay in your project, unattached, and continue to count toward storage billing. This is deliberate: a revert never destroys data. Once you've confirmed the standalone Redis service is healthy, it is safe to delete the leftover volumes from the project canvas. If you convert to HA again later, the new cluster provisions fresh volumes (with suffixed names, since the kept ones still hold the original names). It does not reuse them.

**Reverting is only available while the original Redis service is the primary.** Reverting keeps that service and deletes every other node. If the primary role has moved after a failover, reverting would delete the node holding the latest data. If the original service is not the primary, use **Make primary** to switch over to it first. The revert flow offers this when it applies.

Railway migrates every variable reference within your project back to the original Redis service as part of the staged revert. As with conversion, hardcoded connection strings outside of Railway need updating by hand.

## CLI

Use `railway redis ha` to inspect cluster health, convert or revert a database, scale the cluster, and switch the primary:

```bash
railway redis ha status --service redis
railway redis ha convert --service redis --replicas 2
railway redis ha scale --service redis --replicas 4
railway redis ha switchover \
  --service redis \
  --to Redis-2
```

Every HA command takes `--service`, `--environment`, `--project`, and `--json`. Actions that change the cluster ask for confirmation unless you pass `--yes`, and deploy unless you pass `--no-deploy`, which stages the change instead.
