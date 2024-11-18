---
title: Deploy PostgreSQL
---

Railway offers two PostgreSQL deployment options to accommodate different needs: a **Standalone Instance** and a **High Availability (HA) Cluster**.

- **Standalone Instance** - a single Postgres database server that is easy to manage; ideal for development environments, smaller projects, or services which are less sensitive to disruption.

- **High Availability (HA) Cluster** - intended for production workloads where uptime is critical.  It consists of three Postgres nodes in replication mode managed by [Repmgr](https://www.repmgr.org/docs/current/getting-started.html), complemented by a [Pgpool-II](https://www.pgpool.net/mediawiki/index.php/Main_Page) proxy service.

## Standalone PostgreSQL

Let's talk about how to deploy, connect, and manage the standalone instance.

### Deploy

You can deploy a standalone PostgreSQL database via the `CMD + K` menu or by clicking the `+ New` button on the Project Canvas.

<Image src="https://res.cloudinary.com/railway/image/upload/v1695934218/docs/databases/addDB_qxyctn.gif"
alt="GIF of the Adding Database"
layout="responsive"
width={450} height={396} quality={100} />

You can also deploy it via the [template](https://railway.com/template/postgres) from the template marketplace.

#### Deployed Service

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

#### Connecting Externally

It is possible to connect to PostgreSQL externally (from outside of the [project](/develop/projects) in which it is deployed), by using the [TCP Proxy](/deploy/exposing-your-app#tcp-proxying) which is enabled by default.

*Keep in mind that you will be billed for [Network Egress](/reference/pricing/plans#resource-usage-pricing) when using the TCP Proxy.*

### Modify the Deployment

Since the deployed container is based on an image built from the official [PostgreSQL](https://hub.docker.com/_/postgres) image in Docker hub, you can modify the deployment based on the [instructions in Docker hub](https://hub.docker.com/_/postgres#:~:text=How%20to%20extend%20this%20image).

We also encourage you to fork the [Railway postgres-ssl repository](https://github.com/railwayapp-templates/postgres-ssl) to customize it to your needs, or feel free to open a PR in the repo!

## High Availability PostgreSQL Cluster

<Banner>
**Released August 2024** 

Be aware that this template has not been battle-tested like the standalone instance.  We are seeking feedback to improve the experience using this template, please provide your input [here](https://help.railway.com/templates/postgre-sql-ha-with-repmgr-33c997a9).
</Banner>

We'll cover how to deploy, connect, and manage the [High Availability (HA) PostgreSQL](https://www.postgresql.org/docs/current/high-availability.html) cluster in this section.

### Deploy

You can deploy a HA PostgreSQL cluster via the [template in the marketplace](https://railway.com/template/ha-postgres).

<Image src="https://res.cloudinary.com/railway/image/upload/v1723589926/docs/databases/postgrescluster_ac7vld.png"
alt="PostgreSQL HA in the marketplace"
layout="responsive"
width={405} height={396} quality={100} />

#### Deployed Services

Upon deployment, you will have a cluster of 3 PostgreSQL nodes deployed from the [bitnami/postgres-repmgr](https://hub.docker.com/r/bitnami/postgresql-repmgr) image, running in [replication mode](https://www.postgresql.org/docs/16/high-availability.html) and managed by [repmgr](https://www.repmgr.org/).

You will also have a [Pgpool-II](https://www.pgpool.net/docs/latest/en/html/) service deployed from the [bitnami/pgpool](https://hub.docker.com/r/bitnami/pgpool) image which is intended to be used as a proxy to the cluster.

#### Multi-region Deployment

By default, each node is deployed to a different region (US West, US East, and EU West) for fault tolerance.

Since region selection is a Pro-only feature, this only applies to Pro users.  If you deploy this template as a Hobby user, all nodes will deploy to US West.

### Connect

You should connect to the cluster via a proxy service which is aware of all of the cluster nodes.  We have included a [Pgpool-II](https://www.pgpool.net/docs/latest/en/html/) service in the template deployment for this purpose.

Connect to the cluster via Pgpool by [referencing the environment variable](/guides/variables#referencing-another-services-variable) `DATABASE_URL` available in the Pgpool service.

<Image src="https://res.cloudinary.com/railway/image/upload/v1723755568/docs/databases/CleanShot_2024-08-15_at_14.58.11_yyzinw.gif"
alt="Pgpool variables"
layout="responsive"
width={655} height={396} quality={100} />

#### Connecting Externally

It is possible to connect to the PostgreSQL cluster externally (from outside of the [project](/develop/projects) in which it is deployed), by using the [TCP Proxy](/deploy/exposing-your-app#tcp-proxying).  To do so, you should reference the `DATABASE_PUBLIC_URL` environment variable available in the Pgpool service.

*Keep in mind that you will be billed for [Network Egress](/reference/pricing/plans#resource-usage-pricing) when using the TCP Proxy.*

### Modify the Deployment

Since the containers are deployed from bitnami images, you can reference the documentation for each, to understand how to customize them:
- [bitnami/postgres-repmgr](https://github.com/bitnami/containers/blob/main/bitnami/postgresql-repmgr/README.md#environment-variables)
- [bitnami/pgpool](https://github.com/bitnami/containers/blob/main/bitnami/pgpool/README.md#environment-variables)

## Backups and Observability

Especially for production environments, performing regular backups and monitoring the health of your database is essential.  Consider adding:

- **Backups**: Automate regular backups to ensure data recovery in case of failure. We suggest checking out our native [Backups](/reference/backups) feature.

- **Observability**: Implement monitoring for insights into performance and health of your databases.  If you're not already running an observability stack, check out these templates to help you get started building one:
    - [Prometheus](https://railway.com/template/KmJatA)
    - [Grafana](https://railway.com/template/anURAt)
    - [PostgreSQL Exporter](https://railway.com/template/gDzHrM)

## Extensions

In an effort to maintain simplicity in the default templates, we do not plan to add exentions to the PostgreSQL templates covered in this guide.

For some of the most popular extensions, like PostGIS and Timescale, there are several options in the template marketplace.

- <a href="https://railway.com/template/VSbF5V" target="_blank">TimescaleDB</a>
- <a href="https://railway.com/template/postgis" target="_blank">PostGIS</a>
- <a href="https://railway.com/template/timescaledb-postgis" target="_blank">TimescaleDB + PostGIS</a>

## Additional Resources

While these templates are available for your convenience, they are considered unmanaged, meaning you have total control over their configuration and maintenance.  

We *strongly encourage you* to refer to the source documentation to gain deeper understanding of their functionality and how to use them effectively.  Here are some links to help you get started:
- [PostgreSQL Documentation](https://www.postgresql.org/)
- [PostgreSQL High Availability Documentation](https://www.postgresql.org/docs/current/high-availability.html)
- [Repmgr Documentation](https://www.repmgr.org/docs/current/getting-started.html)
- [Pgpool-II Documentation](https://www.pgpool.net/docs/latest/en/html/)