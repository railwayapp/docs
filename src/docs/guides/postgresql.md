---
title: Deploy PostgreSQL
---

Railway offers two PostgreSQL deployment options to accommodate different needs: a **Standalone Instance** and a **High Availability (HA) Cluster**.

- **Standalone Instance** - a single Postgres database server that is easy to manage; ideal for development environments, smaller projects, or services which are less sensitive to disruption.

- **High Availability (HA) Cluster** - intended for production workloads where uptime is critical.  It consists of three Postgres nodes distributed across different regions.

## Standalone PostgreSQL

Let's talk about how to deploy, connect, and manage the standalone instance.

### Deploy

You can deploy a standalone PostgreSQL database via the `CMD + K` menu or by clicking the `+ New` button on the Project Canvas.

<Image src="https://res.cloudinary.com/railway/image/upload/v1695934218/docs/databases/addDB_qxyctn.gif"
alt="GIF of the Adding Database"
layout="responsive"
width={450} height={396} quality={100} />

You can also deploy it via the [template](https://railway.app/template/postgres) from the template marketplace.

#### Service Source

Upon deployment, you will have a standalone PostgreSQL service running in your project, deployed from Railway's [SSL-enabled Postgres image](https://github.com/railwayapp-templates/postgres-ssl/pkgs/container/postgres-ssl), which uses the official [postgres](https://hub.docker.com/_/postgres) image in Docker Hub as its base.

### Connect

Connect to the PostgreSQL server from another service in your project by [referencing the environment variables](/guides/variables#referencing-another-services-variable) made available in the PostgreSQL service:

- `PGHOST`
- `PGPORT`
- `PGUSER`
- `PGPASSWORD`
- `PGDATABASE`
- `DATABASE_URL`

_Note, Many libraries will automatically look for the `DATABASE_URL` variable and use
it to connect to PostgreSQL but you can use these variables in whatever way works for you._

#### Connecting externally

It is possible to connect to PostgreSQL externally (from outside of the [project](/develop/projects) in which it is deployed), by using the [TCP Proxy](/deploy/exposing-your-app#tcp-proxying) which is enabled by default.

Keep in mind that you will be billed for [Network Egress](/reference/pricing/plans#resource-usage-pricing) when using the TCP Proxy.

### Modify the deployment

Since the deployed container is based on an image built from the official [PostgreSQL](https://hub.docker.com/_/postgres) image in Docker hub, you can modify the deployment based on the [instructions in Docker hub](https://hub.docker.com/_/postgres#:~:text=How%20to%20extend%20this%20image).

We also encourage you to fork the [Railway postgres-ssl repository](https://github.com/railwayapp-templates/postgres-ssl) to customize it to your needs, or feel free to open a PR in the repo!

## High Availability PostgreSQL Cluster

We'll cover how to deploy, connect, and manage the High Availability (HA) PostgreSQL cluster in this section.

### Deploy

You can deploy a HA PostgreSQL cluster via the [template in the template marketplace](https://railway.app/template/GsthnV).

<Image src="https://res.cloudinary.com/railway/image/upload/v1723589926/docs/databases/postgrescluster_ac7vld.png"
alt="PostgreSQL HA in the marketplace"
layout="responsive"
width={405} height={396} quality={100} />

#### Service Source

Upon deployment, you will have a cluster of 3 PostgreSQL nodes deployed from the [bitnami/postgres-repmgr](https://hub.docker.com/r/bitnami/postgresql-repmgr) image, running in [replication mode](https://www.postgresql.org/docs/16/high-availability.html) and managed by [repmgr](https://www.repmgr.org/).

You will also have a Pgpool-II service deployed from the [bitnami/pgpool](https://hub.docker.com/r/bitnami/pgpool) image which is intended to be used as a proxy to the cluster.

### Connect

You should connect to the cluster via a proxy service which is aware of all of the cluster nodes.  We have included a Pgpool-II service in the template deployment for this purpose.

Connect to the cluster via Pgpool by [referencing the environment variable](/guides/variables#referencing-another-services-variable)`DATABASE_URL` available in the Pgpool service.

#### Connecting externally

It is possible to connect to the PostgreSQL cluster externally (from outside of the [project](/develop/projects) in which it is deployed), by using the [TCP Proxy](/deploy/exposing-your-app#tcp-proxying).  To do so, you should reference the `DATABASE_PUBLIC_URL` environment variable available in the Pgpool service.

*Keep in mind that you will be billed for [Network Egress](/reference/pricing/plans#resource-usage-pricing) when using the TCP Proxy.*

### Modify the deployment

Since the deployed containers are all deployed from bitnami images available in Docker hub, you can modify them using the documentation for each:
- [bitnami/postgres-repmgr](https://github.com/bitnami/containers/blob/main/bitnami/postgresql-repmgr/README.md#environment-variables)
- [bitnami/pgpool](https://github.com/bitnami/containers/blob/main/bitnami/pgpool/README.md#environment-variables)

## Backup and Monitoring

We


## Timescale and PostGIS

The Postgres service deployed from the Command Palette no longer contains PostGIS or Timescale extensions. However, there are several options in the template marketplace that deploy a PostGIS or Timescale-enabled Postgres image.

- <a href="https://railway.app/template/VSbF5V" target="_blank">TimescaleDB</a>
- <a href="https://railway.app/template/postgis" target="_blank">PostGIS</a>
- <a href="https://railway.app/template/timescaledb-postgis" target="_blank">TimescaleDB + PostGIS</a>

To deploy a service from a template in an existing project, simply click `+ New` from your project canvas, select `Template` and search for the template you require.
