---
title: Upgrading PostgreSQL to High Availability
description: Convert an existing Railway PostgreSQL service to a high-availability cluster with automatic failover.
---

Railway can convert an existing PostgreSQL service into a high-availability cluster backed by [Patroni](https://patroni.readthedocs.io/), [etcd](https://etcd.io/), and [HAProxy](https://www.haproxy.org/). The cluster handles automatic leader election and failover — if the primary node goes down, Patroni promotes a replica and HAProxy begins routing connections to it within seconds.

## Prerequisites

Before converting, confirm the following:

**Official Railway image** — Only services running the official Railway Postgres images are supported. Custom images (e.g. PostGIS, TimescaleDB) are not compatible.

- `ghcr.io/railwayapp-templates/postgres-ssl` (standard Railway Postgres)
- `ghcr.io/railwayapp-templates/postgres-ha/postgres-patroni` (already on the HA image but running standalone)

**Pinned version tag** — The `:latest` image tag is not supported. The service must be pinned to a specific major version. Supported versions are **14, 15, 16, 17, and 18**.

If your service uses `:latest`, the Railway dashboard will prompt you to pin the version before conversion. See [Pinning the Image Version](#pinning-the-image-version) below.

## Step 1 — Pin the Image Version (if needed)

If your Postgres service uses the `:latest` tag, you must pin it to a specific version before the HA conversion option becomes available.

Open your Postgres service and navigate to **Settings → High Availability**. If the service is on `:latest`, Railway will automatically detect the running Postgres version and show a **Pin to version X** button.

Click the button to stage the image tag change, then deploy the service. Once the deployment is complete, come back to **Settings → High Availability** — the conversion controls will now be available.

## Step 2 — Configure and Convert

Open your Postgres service and navigate to **Settings → High Availability**. You will see options to configure the cluster size before converting:

| Setting | Default | Description |
|---|---|---|
| **Postgres Replicas** | 2 | Number of streaming replicas (in addition to the primary). Range: 2–7. |
| **etcd Nodes** | 3 | Must be an odd number for quorum. A 3-node cluster tolerates 1 failure; 5-node tolerates 2. Options: 3, 5, 7, 9. |
| **HAProxy** | 3 | Number of HAProxy load balancer replicas. Range: 2–5. |

Click **Convert to HA**. A confirmation dialog will appear warning that:

- **Active connections will be dropped** during the conversion
- **Connection endpoints will change** — any hardcoded connection strings will need to be updated after conversion

After confirming, Railway will:

1. Create a backup of your database volume (expires in 21 days)
2. Provision all cluster services (replicas, etcd nodes, HAProxy) as staged changes
3. Redirect you to the cluster overview

Review the staged changes and deploy to complete the conversion.

## Step 3 — Connection Strings

Railway automatically migrates all variable references within your project as part of the staged changes. Any service that references your Postgres service's variables (e.g. `DATABASE_URL`) will be updated to reference the new **Postgres HA** (HAProxy) service instead — no manual changes needed for services within Railway.

The only case that requires manual action is if you have hardcoded connection strings anywhere — in application code, Railway variables set to a literal URL (rather than a reference), other Railway projects, external tools, or CI pipelines. After deploying the cluster, update those to use the connection details from the **Postgres HA** service.

For external connections (from outside Railway), use `DATABASE_PUBLIC_URL` from the **Postgres HA** service. This routes through the [TCP Proxy](/networking/tcp-proxy).

## Step 4 — Wait for Cluster Warm-Up

After all deployments reach a running state, allow approximately 2 minutes for Patroni, etcd, and HAProxy to initialize and elect a leader. The cluster overview in the Railway dashboard will show the current leader and replica status once the cluster is healthy.

## Reverting to Standalone

You can revert a cluster back to a single standalone Postgres service from the cluster overview. Click **Revert** to stage the changes.

Reverting will:

- Delete all HA services (replicas, etcd nodes, HAProxy)
- Restore the TCP Proxy directly on the original Postgres service
- Migrate variable references back to the root service

**The Revert button is only available when the original Postgres service (Postgres-1) is currently the cluster leader.** If it is not the leader, use the **Make Leader** button in the cluster overview to promote it first.

Railway will automatically migrate all variable references within your project back to the original Postgres service as part of the staged revert. As with conversion, any hardcoded connection strings outside of Railway will need to be updated manually.
