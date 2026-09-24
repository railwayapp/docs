---
title: Upgrading MongoDB to high availability
description: Convert an existing Railway MongoDB service to a high-availability replica set with automatic failover.
---

Railway can convert an existing MongoDB service into a high-availability cluster backed by a [MongoDB replica set](https://www.mongodb.com/docs/manual/replication/) and [HAProxy](https://www.haproxy.org/). The data nodes form a single-primary replica set. Elections run inside MongoDB itself, so there is no separate coordinator tier, and HAProxy routes client connections to whichever node is currently the primary. If the primary goes down and a majority of voting members remains available, the set can elect a new primary and HAProxy routes new connections to it.

## How the cluster is shaped

A converted cluster consists of:

- MongoDB data nodes: your original service becomes the primary, plus an even number of replicas, for an odd cluster total (3, 5, or 7). A replica set needs a strict majority of voting members to elect a primary, and an odd count is what lets the set reach that majority during a network partition instead of splitting the vote. Secondaries never accept writes, so a write can only land on the elected primary.
- HAProxy: the single entry point for clients. It probes every data node's role endpoint and routes connections to the current primary, so your application never needs to know which node holds that role.

There is no read endpoint over the secondaries in this version. All connections, reads included, go to the primary through HAProxy. The replicas exist for failover, not read scaling.

## Prerequisites

Before converting, confirm the following:

Official MongoDB image: only services running the official [mongo](https://hub.docker.com/_/mongo) Docker image (what Railway's MongoDB template deploys) are supported, along with services already on Railway's cluster data-node image (`ghcr.io/railwayapp-templates/mongo-ha/mongo`) but running standalone. Forks and variants (for example FerretDB or Percona Server for MongoDB) are not compatible. If your service qualifies, the **High Availability** section appears in its Config tab.

Supported version: the image must be tagged with a supported major version, 7 or 8. The `:latest` tag and named tags are not supported, because Railway needs a detectable version to pin the cluster's images to. If your service uses `:latest`, change the image to a versioned tag (for example `mongo:8.0`) in the service settings and redeploy before converting.

As part of the conversion, Railway pins the data nodes to your service's exact `major.minor` series. The cluster image is published at exact series tags (`7.0`, `8.0`, `8.2` and so on), never a bare major, so pinning to the series already running is what makes a real image available to pull.

No custom start command: the cluster image manages its own startup, so a service with a customer-set start command can't be converted. The MongoDB template ships one (it enables IPv6 for the private network), so the High Availability section shows a warning with a one-click **Reset to template default** button. MongoDB reads its credentials from environment variables, not from the start command, so resetting never affects authentication, and the cluster image enables IPv6 itself.

## Step 1: Open the High Availability section

Open your MongoDB service and navigate to **Database → Config → High Availability**.

## Step 2: Configure and convert

You will see options to configure the cluster size before converting:

| Setting | Default | Description |
|---|---|---|
| **MongoDB Replicas** | 2 | Replicas added to the primary. Options: 2, 4, or 6. Even counts keep the cluster's total node count odd: 3, 5, or 7 nodes, the most voting members a replica set allows. |
| **Reverse Proxies** | 2 | HAProxy instances routing connections to the primary. Options: 1 or 2. Trial workspaces are limited to 1. |

There is no separate coordinator tier to size. Replica set elections run inside the MongoDB nodes themselves.

Click **Convert to HA**. A confirmation dialog will appear warning that:

- Active connections are dropped during the conversion
- Connection endpoints change: any hardcoded connection strings will need to be updated after conversion

After confirming, Railway will:

1. Create a backup of your database volume
2. Provision all cluster services (replicas and HAProxy) as staged changes
3. Redirect you to the cluster overview

Review the staged changes and click **Deploy** to complete the conversion. The conversion adopts your existing volume and its data: your original node initiates the replica set on the data it already holds, and the replicas copy it through MongoDB's initial sync when they first join.

## Step 3: Connection strings

Once the cluster is deployed, connect through HAProxy, never to an individual MongoDB node. HAProxy routes to the current primary. Configure your application to reconnect after a failover:

| Variable | Points to | Use for |
|---|---|---|
| `MONGO_URL` | MongoDB HA (HAProxy), private network | Connections from inside Railway |
| `MONGO_PUBLIC_URL` | MongoDB HA (HAProxy), TCP proxy | Connections from outside Railway |

Both URLs end in `?directConnection=true`. Keep that option when you build a connection string yourself. Without it, a MongoDB driver reads the replica set's member list from the primary and starts connecting to the members' private hostnames directly, which bypasses HAProxy inside Railway and fails outright from outside it.

The HAProxy service also exposes the individual `MONGOHOST`, `MONGOPORT`, `MONGOUSER` and `MONGOPASSWORD` variables for clients that take connection details separately.

Railway automatically migrates all variable references within your project as part of the staged changes. Any service that references your MongoDB service's variables (for example `MONGO_URL`) will be updated to reference the new **MongoDB HA** (HAProxy) service instead. No manual changes are needed for services within Railway.

The only case that requires manual action is if you have hardcoded connection strings anywhere: in application code, Railway variables set to a literal URL (rather than a reference), other Railway projects, external tools, or CI pipelines. After deploying the cluster, update those to use the connection details from the **MongoDB HA** service.

`MONGO_PUBLIC_URL` exists only while public access is enabled. If your standalone MongoDB was publicly exposed, the conversion carries the public endpoint over to **MongoDB HA** automatically. Otherwise the cluster is private by default: click **Connect** on the cluster view and add **Public Access** to create the [TCP Proxy](/networking/tcp-proxy) and the variable.

## Step 4: Verify cluster health

After all deployments reach a running state, wait for the set to form and for the replicas to complete their initial sync. Initial sync time depends on your dataset size and available resources. The cluster overview in the Railway dashboard shows each node's role, with the current primary carrying a **Primary** badge, along with per-node health.

## Failover

Failover is automatic. When the primary becomes unreachable, the remaining members hold an election. Once a majority agrees, the set elects a new primary and HAProxy routes connections to it after its health checks detect the change. Recovery time depends on election and health-check timing. If the set loses its majority, writes remain unavailable until a majority is restored. In-flight connections to the old primary are dropped; clients that reconnect resume against the new primary without any configuration change, because they connect through HAProxy. When the old primary comes back, it rejoins the set as a secondary and catches up automatically.

To move the primary role back onto your original node deliberately (for example, after a failover, or before reverting), open the cluster overview and use **Make Leader**. This performs a coordinated step-down with the same brief connection drop as a failover.

## Scale the cluster

You can change the number of replicas after conversion from the cluster overview. Replica counts move in steps of two (2, 4, or 6) for the same quorum reason as at conversion time: the cluster total stays odd and never exceeds the seven voting members a replica set allows.

## Backups and restore

Each data node's volume carries the same backup schedules your standalone service had. Restoring a backup from the cluster view restores the same snapshot to every data node. The set reforms from the restored data, and any members the snapshot no longer accounts for are re-added automatically.

## Revert to standalone

You can revert a cluster back to a single standalone MongoDB service from the cluster overview, or from **Database → Config → High Availability**. Click **Revert to Standalone** to stage the changes.

Reverting will:

- Delete all HA services (replicas and HAProxy)
- Restore the TCP Proxy directly on the original MongoDB service, if the cluster was publicly exposed
- Migrate variable references back to the root service

The reverted service keeps the cluster image (`mongo-ha/mongo`), which detects that it has no cluster peers and runs plain standalone `mongod` with authentication intact. It also clears the replica set configuration the cluster left in MongoDB's `local` database, so a later re-conversion starts clean. Don't swap the image back to a bare `mongo` tag by hand: the cluster image supports standalone operation, and it is what keeps a later re-conversion possible without another image change.

Reverting keeps every deleted node's volume. Deleting the cluster services does not delete their volumes: the replicas' volumes stay in your project, unattached, and continue to count toward storage billing. This is deliberate, because a revert never destroys data. Once you've confirmed the standalone MongoDB service is healthy, it is safe to delete the leftover volumes from the project canvas. If you convert to HA again later, the new cluster provisions fresh volumes (with suffixed names, since the kept ones still hold the original names). It does not reuse them.

Reverting is only available while the original MongoDB service is the cluster primary. Reverting keeps that service and deletes every other node. If the primary role has moved after a failover, reverting would delete the node holding the latest data. If the original service is not the primary, use **Make Leader** to promote it first; the revert flow offers this when it applies.

Railway will automatically migrate all variable references within your project back to the original MongoDB service as part of the staged revert. As with conversion, any hardcoded connection strings outside of Railway will need to be updated manually.
