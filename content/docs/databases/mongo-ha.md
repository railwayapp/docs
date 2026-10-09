---
title: Convert MongoDB to high availability
description: Convert an existing Railway MongoDB service to a high-availability replica set with automatic failover.
---

Railway can convert an existing MongoDB service into a high-availability (HA) cluster backed by a [MongoDB replica set](https://www.mongodb.com/docs/manual/replication/) and [HAProxy](https://www.haproxy.org/). The data nodes form a single-primary replica set. Elections run inside MongoDB itself, so there is no separate coordinator tier, and HAProxy routes client connections to whichever node is currently the primary. If the primary goes down and a majority of voting nodes remains available, the set elects a new primary and HAProxy routes new connections to it.

A converted cluster has two kinds of nodes:

- **MongoDB data nodes.** Your original service starts as the primary, alongside an even number of replicas, for an odd cluster total (3, 5, or 7). A replica set needs a strict majority of voting nodes to elect a primary, and an odd count is what lets the set reach that majority during a network partition instead of splitting the vote. Replicas never accept writes, so a write can only land on the elected primary.
- **Reverse proxies (HAProxy).** The single entry point for clients. HAProxy probes every data node's role and routes connections to the current primary, so your application never needs to know which node holds that role.

There is no read endpoint over the replicas in this version. All connections, reads included, go to the primary through HAProxy. The replicas exist for failover, not read scaling.

## Prerequisites

Before converting, confirm the following.

**Official MongoDB image.** Only services running the official [mongo](https://hub.docker.com/_/mongo) Docker image (what Railway's MongoDB template deploys) are supported, along with services already on Railway's cluster data-node image (`ghcr.io/railwayapp-templates/mongo-ha/mongo`) but running standalone. Forks and variants (for example FerretDB or Percona Server for MongoDB) aren't compatible. If your service qualifies, the **High Availability** section appears in its Config tab.

**Supported version.** The image must be tagged with a supported major version, **7 or 8**, including the minor (for example `mongo:8.0`). The `:latest` tag and named tags aren't supported, because Railway needs a detectable version to pin the cluster's images to. If your service uses `:latest`, change the image to a versioned tag in the service settings and redeploy before converting.

Railway pins every node to the `major.minor` version your service already runs, so all nodes stay on the same version.

**No custom start command.** The cluster image manages its own startup. If you changed the start command, the High Availability section asks you to reset it first. The MongoDB template's default start command is fine.

## Convert

1. Open your MongoDB service and go to **Database**, then **Config**, then **High Availability**.
2. Choose the cluster size:

   | Setting | Default | Description |
   |---|---|---|
   | **MongoDB replicas** | 2 | Replicas added to the primary. Options: 2, 4, or 6. Even counts keep the cluster's total node count odd: 3, 5, or 7 nodes, the most voting members a replica set allows. |
   | **Reverse proxies** | 2 | HAProxy instances routing connections to the primary. Options: 1 or 2. Trial workspaces are limited to 1. |

   There is no separate coordinator tier to size. Replica set elections run inside the MongoDB nodes themselves.

3. Click **Convert to HA**. The confirmation dialog says that active connections drop during the conversion and that connection strings change, so any hardcoded ones need updating afterwards.
4. Confirm. Railway creates a backup of your database volume, stages the cluster services (replicas and reverse proxies), and opens the cluster view.
5. Review the staged changes and click **Deploy**. Nothing changes until you deploy. The conversion adopts your existing volume and its data. Your original service starts the replica set on the data it already holds, and the replicas copy it through MongoDB's initial sync when they first join.

## Connect

Once the cluster is deployed, connect through HAProxy, never to an individual MongoDB node. HAProxy routes to the current primary. Configure your application to reconnect after a failover:

| Variable | Points to | Use for |
|---|---|---|
| `MONGO_URL` | MongoDB HA (HAProxy), private network | Connections from inside Railway |
| `MONGO_PUBLIC_URL` | MongoDB HA (HAProxy), TCP proxy | Connections from outside Railway |

Both URLs end in `?directConnection=true`. Keep that option when you build a connection string yourself. Without it, a MongoDB driver reads the replica set's member list from the primary and starts connecting to the nodes' private hostnames directly, which bypasses HAProxy inside Railway and fails outright from outside it.

The HAProxy service also exposes the individual `MONGOHOST`, `MONGOPORT`, `MONGOUSER`, and `MONGOPASSWORD` variables for clients that take connection details separately.

Railway migrates every variable reference within your project as part of the staged changes. Any service that references your MongoDB service's variables (for example `MONGO_URL`) is updated to reference the new **MongoDB HA** (HAProxy) service instead. No manual changes are needed for services within Railway.

The only case that needs manual action is a hardcoded connection string: in application code, in a Railway variable set to a literal URL rather than a reference, in another Railway project, in an external tool, or in a CI pipeline. After deploying the cluster, update those to use the connection details from the **MongoDB HA** service.

`MONGO_PUBLIC_URL` exists only while public access is enabled. If your standalone MongoDB was publicly exposed, the conversion carries the public endpoint over to **MongoDB HA** automatically. Otherwise the cluster is private by default. Click **Connect** on the cluster view and add **Public Access** to create the [TCP Proxy](/networking/tcp-proxy) and the variable.

## Verify

After every deployment is running, wait for the set to form and for the replicas to finish their initial sync. Initial sync time depends on your dataset size and available resources. The cluster view shows each node's role and health. The current primary carries a **Primary** badge.

## Failover

Failover is automatic. When the primary becomes unreachable, the remaining nodes hold an election. Once a majority agrees, the set elects a new primary and HAProxy routes connections to it after its health checks detect the change. Recovery time depends on election and health-check timing. If the set loses its majority, writes remain unavailable until a majority is restored. In-flight connections to the old primary are dropped. Clients that reconnect resume against the new primary without any configuration change, because they connect through HAProxy.

When the old primary comes back, it rejoins the set as a replica and catches up while the required history is still available in the oplog. A node that falls behind beyond that history can't catch up on its own. The cluster view shows that node as unhealthy, and its logs say `Too stale to catch up`. To rebuild it, wipe the node's volume and redeploy the node. It rejoins empty and copies the data from the primary through initial sync.

Use `w: "majority"` and journaling for writes that need durable majority acknowledgement. HA does not eliminate timeouts: slow storage or an unavailable majority can delay acknowledgement even while the nodes are running. A write-concern timeout does not undo a write that has already reached the database, so applications must handle an uncertain outcome and use idempotent retries. See [MongoDB write concern](https://www.mongodb.com/docs/v8.0/reference/write-concern/).

To move the primary role back onto your original service yourself (for example, after a failover, or before reverting), open the cluster view and use **Make primary**. This is a coordinated step-down with the same brief connection drop as a failover.

## Scale

You can change the number of replicas after conversion from the cluster view. Replica counts move in steps of two (2, 4, or 6) for the same reason as at conversion time: the cluster total stays odd and never exceeds the seven voting members a replica set allows.

## Backups and restore

Each data node's volume keeps the backup schedules your standalone service had. Restoring a backup from the cluster view restores the same snapshot to every data node. The set re-forms from the restored data, and any nodes the snapshot no longer accounts for are re-added automatically. This is a snapshot restore. MongoDB HA does not offer continuous backup or point-in-time recovery.

## Revert

You can revert a cluster back to a single standalone MongoDB service from the cluster view, or from **Database**, then **Config**, then **High Availability**. Click **Revert to Standalone** to stage the changes.

Reverting:

- Deletes all HA services (replicas and reverse proxies)
- Restores the TCP Proxy directly on the original MongoDB service, if the cluster was publicly exposed
- Migrates variable references back to the original service

The reverted service keeps the cluster image (`mongo-ha/mongo`), which detects that it has no cluster peers and runs plain standalone `mongod` with authentication intact. It also clears the replica set configuration the cluster left in MongoDB's `local` database, so a later re-conversion starts clean. Don't swap the image back to a bare `mongo` tag by hand. The cluster image supports standalone operation, and it is what keeps a later re-conversion possible without another image change.

**Reverting keeps every deleted node's volume.** Deleting the cluster services does not delete their volumes. The replicas' volumes stay in your project, unattached, and continue to count toward storage billing. This is deliberate: a revert never destroys data. Once you've confirmed the standalone MongoDB service is healthy, it is safe to delete the leftover volumes from the project canvas. If you convert to HA again later, the new cluster provisions fresh volumes (with suffixed names, since the kept ones still hold the original names). It does not reuse them.

**Reverting is only available while the original MongoDB service is the primary.** Reverting keeps that service and deletes every other node. If the primary role has moved after a failover, reverting would delete the node holding the latest data. If the original service is not the primary, use **Make primary** to switch over to it first. The revert flow offers this when it applies.

Railway migrates every variable reference within your project back to the original MongoDB service as part of the staged revert. As with conversion, hardcoded connection strings outside of Railway need updating by hand.
