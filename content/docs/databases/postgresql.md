---
title: PostgreSQL
description: Learn how to deploy a PostgreSQL database on Railway.
---

The Railway PostgreSQL database template allows you to provision and connect to a PostgreSQL database with zero configuration.

## Deploy

Add a PostgreSQL database to your project via the `ctrl / cmd + k` menu or by clicking the `+ New` button on the Project Canvas.

<Image src="https://res.cloudinary.com/railway/image/upload/v1695934218/docs/databases/addDB_qxyctn.gif"
alt="GIF of the Adding Database"
layout="responsive"
width={450} height={396} quality={100} />

You can also deploy it via the [template](https://railway.com/deploy/postgres) from the template marketplace.

#### Deployed service

Upon deployment, you will have a PostgreSQL service running in your project, deployed from Railway's [SSL-enabled Postgres image](https://github.com/railwayapp-templates/postgres-ssl/pkgs/container/postgres-ssl), which uses the official [Postgres](https://hub.docker.com/_/postgres) image from Docker Hub as its base.

### Connect

Connect to the PostgreSQL server from another service in your project by [referencing the environment variables](/variables#referencing-another-services-variable) made available in the PostgreSQL service:

- `PGHOST`
- `PGPORT`
- `PGUSER`
- `PGPASSWORD`
- `PGDATABASE`
- `DATABASE_URL`

_Note, Many libraries will automatically look for the `DATABASE_URL` variable and use
it to connect to PostgreSQL but you can use these variables in whatever way works for you._

#### Connecting externally

It is possible to connect to PostgreSQL externally (from outside of the [project](/projects) in which it is deployed). Databases are deployed private by default — to expose one, open the service's **Settings → Networking** and add **Public Access**. This creates a [TCP Proxy](/networking/tcp-proxy) and populates a `DATABASE_PUBLIC_URL` variable with the external connection string.

_Keep in mind that you will be billed for [Network Egress](/pricing/plans#resource-usage-pricing) when using the TCP Proxy._

### Modify the deployment

Since the deployed container is based on an image built from the official [PostgreSQL](https://hub.docker.com/_/postgres) image in Docker hub, you can modify the deployment based on the [instructions in Docker hub](https://hub.docker.com/_/postgres#:~:text=How%20to%20extend%20this%20image).

We also encourage you to fork the [Railway postgres-ssl repository](https://github.com/railwayapp-templates/postgres-ssl) to customize it to your needs, or feel free to open a PR in the repo!

## Turn on the managed setup

The managed setup turns on high availability, connection pooling, point-in-time recovery, and scheduled backups for a PostgreSQL service together. Railway stages every part as one set of changes, and you deploy them once.

The section appears under **Database → Config → Managed setup** on PostgreSQL services that run Railway's Postgres image, which the PostgreSQL template deploys. It lists each part with its state, **On**, **Staged**, or **Off**, and stages only the parts that are off. Nothing changes until you deploy.

1. Open your PostgreSQL service and navigate to **Database → Config → Managed setup**.
2. Click **Stage managed setup**.
3. Review the parts listed in the confirmation and click **Stage**.
4. Review the staged changes on the service and click **Deploy**.

Each part stages the same changes as turning it on from its own section:

| Part | What Railway stages |
| --- | --- |
| [High availability](/databases/postgresql-ha) | Replicas, consensus nodes, and a reverse proxy, with automatic failover. Railway backs up the volume first. |
| [Connection pooling](/databases/postgresql-pgbouncer) | PgBouncer in transaction mode in front of the reverse proxy. Services in the project that reference the database's variables are pointed at PgBouncer. |
| [Point-in-time recovery](/volumes/point-in-time-recovery) | A storage bucket and the variables that make the database archive its WAL to it. |
| [Backups](/volumes/backups#backup-schedules) | Daily, weekly, and monthly backup schedules on the database's volume. |

When the setup includes high availability, the deploy restarts the database once to move it onto the HA image, and active connections drop during the restart. Connection endpoints change too: Railway updates the services in the project that reference the database's variables, and connection strings hardcoded outside Railway must be updated by hand.

Each part adds usage, billed the same as when you turn it on separately.

On a service that is already an HA cluster, the button stages connection pooling and backups. Point-in-time recovery on a cluster rolls out node by node as soon as you turn it on, so it can't be staged. [Turn it on from the Backups tab](/volumes/point-in-time-recovery#enabling-pitr) instead.

While an HA conversion is staged on the service, the button is unavailable. Deploy or discard the staged conversion first.

## High availability

An existing PostgreSQL service can be converted into a high-availability cluster with automatic failover, backed by Patroni, etcd, and HAProxy. See [Upgrading PostgreSQL to High Availability](/databases/postgresql-ha) for the full guide.

## Major version upgrades

Move a PostgreSQL service to a newer major version in place, with a preflight check, automatic backups, and one-click revert. See [Upgrading PostgreSQL Major Versions](/databases/postgresql-major-upgrade) for the full guide.

## Backups and observability

Especially for production environments, performing regular backups and monitoring the health of your database is essential. Consider adding:

- **Backups**: Automate regular backups to ensure data recovery in case of failure. We suggest checking out the native [Backups](/volumes/backups) feature.

- **Observability**: Implement monitoring for insights into performance and health of your databases. If you're not already running an observability stack, check out these templates to help you get started building one:
  - [Prometheus](https://railway.com/deploy/KmJatA)
  - [Grafana](https://railway.com/deploy/anURAt)
  - [PostgreSQL Exporter](https://railway.com/deploy/gDzHrM)

## Extensions

In an effort to maintain simplicity in the default templates, we do not plan to add extensions to the PostgreSQL templates covered in this guide.

For some of the most popular extensions, like PostGIS and Timescale, there are several options in the template marketplace.

- <a href="https://railway.com/deploy/VSbF5V" target="_blank">TimescaleDB</a>
- <a href="https://railway.com/deploy/postgis" target="_blank">PostGIS</a>
- <a href="https://railway.com/deploy/timescaledb-postgis" target="_blank">TimescaleDB + PostGIS</a>
- <a href="https://railway.com/deploy/3jJFCA" target="_blank">pgvector</a>

## Increasing the SHM size

The SHM Size is the maximum amount of shared memory available to the container.

By default it is set to 64MB.

You would need to change the SHM Size if you are experiencing the following error -

```txt
ERROR: could not resize shared memory segment "PostgreSQL.1590182853" to 182853 bytes: no space left on device
```

You can modify the SHM Size by setting the `RAILWAY_SHM_SIZE_BYTES` variable in your service variables.

This variable is a number in bytes, so you would need to convert the size you want to use.

For example, to increase the SHM Size to 500MB, you would set the variable to `524288000`.

## Additional resources

Railway maintains this template; [what Railway manages](/databases#what-railway-manages) lists which operations Railway handles and which are yours. Changing the template as shipped, such as its image, start command or variables, makes the database yours to manage; see [database support scope](/databases#database-support-scope).

We _strongly encourage you_ to refer to the source documentation to gain deeper understanding of their functionality and how to use them effectively. Here are some links to help you get started:

- [PostgreSQL Documentation](https://www.postgresql.org/)
- [PostgreSQL High Availability Documentation](https://www.postgresql.org/docs/current/high-availability.html)
- [Repmgr Documentation](https://www.repmgr.org/docs/current/getting-started.html)
- [Pgpool-II Documentation](https://www.pgpool.net/docs/latest/en/html/)
