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

You can also deploy it via the [template](https://railway.com/template/postgres) from the template marketplace.

#### Deployed Service

Upon deployment, you will have a PostgreSQL service running in your project, deployed from Railway's [SSL-enabled Postgres image](https://github.com/railwayapp-templates/postgres-ssl/pkgs/container/postgres-ssl), which uses the official [Postgres](https://hub.docker.com/_/postgres) image from Docker Hub as its base.

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

_Keep in mind that you will be billed for [Network Egress](/reference/pricing/plans#resource-usage-pricing) when using the TCP Proxy._

### Modify the Deployment

Since the deployed container is based on an image built from the official [PostgreSQL](https://hub.docker.com/_/postgres) image in Docker hub, you can modify the deployment based on the [instructions in Docker hub](https://hub.docker.com/_/postgres#:~:text=How%20to%20extend%20this%20image).

We also encourage you to fork the [Railway postgres-ssl repository](https://github.com/railwayapp-templates/postgres-ssl) to customize it to your needs, or feel free to open a PR in the repo!

## Backups and Observability

Especially for production environments, performing regular backups and monitoring the health of your database is essential. Consider adding:

- **Backups**: Automate regular backups to ensure data recovery in case of failure. We suggest checking out our native [Backups](/reference/backups) feature.

- **Observability**: Implement monitoring for insights into performance and health of your databases. If you're not already running an observability stack, check out these templates to help you get started building one:
  - [Prometheus](https://railway.com/template/KmJatA)
  - [Grafana](https://railway.com/template/anURAt)
  - [PostgreSQL Exporter](https://railway.com/template/gDzHrM)

## Extensions

In an effort to maintain simplicity in the default templates, we do not plan to add extensions to the PostgreSQL templates covered in this guide.

For some of the most popular extensions, like PostGIS and Timescale, there are several options in the template marketplace.

- <a href="https://railway.com/template/VSbF5V" target="_blank">TimescaleDB</a>
- <a href="https://railway.com/template/postgis" target="_blank">PostGIS</a>
- <a href="https://railway.com/template/timescaledb-postgis" target="_blank">TimescaleDB + PostGIS</a>
- <a href="https://railway.com/template/3jJFCA" target="_blank">pgvector</a>

## Modifying The Postgres Configuration

You can modify the Postgres configuration by using the [`ALTER SYSTEM`](https://www.postgresql.org/docs/current/sql-altersystem.html) command.

```txt
ALTER SYSTEM SET shared_buffers = '2GB';
ALTER SYSTEM SET effective_cache_size = '6GB';
ALTER SYSTEM SET maintenance_work_mem = '512MB';
ALTER SYSTEM SET work_mem = '32MB';
ALTER SYSTEM SET max_worker_processes = '8';
ALTER SYSTEM SET max_parallel_workers_per_gather = '4';
ALTER SYSTEM SET max_parallel_workers = '8';

-- Reload the configuration to save the changes
SELECT pg_reload_conf();
```

After running the SQL, you will need to restart the deployment for the changes to take effect.

You can restart the deployment by clicking the `Restart` button in the deployment's 3-dot menu.

## Increasing the SHM Size

The SHM Size is the maximum amount of shared memory available to the container.

By default it is set to 64MB.

You would need to change the SHM Size if you are experiencing the following error -

```txt
ERROR: could not resize shared memory segment "PostgresSQL.1590182853" to 182853 bytes: no space left on device
```

You can modify the SHM Size by setting the `RAILWAY_SHM_SIZE_BYTES` variable in your service variables.

This variable is a number in bytes, so you would need to convert the size you want to use.

For example, to increase the SHM Size to 500MB, you would set the variable to `524288000`.

## Additional Resources

While these templates are available for your convenience, they are considered unmanaged, meaning you have total control over their configuration and maintenance.

We _strongly encourage you_ to refer to the source documentation to gain deeper understanding of their functionality and how to use them effectively. Here are some links to help you get started:

- [PostgreSQL Documentation](https://www.postgresql.org/)
- [PostgreSQL High Availability Documentation](https://www.postgresql.org/docs/current/high-availability.html)
- [Repmgr Documentation](https://www.repmgr.org/docs/current/getting-started.html)
- [Pgpool-II Documentation](https://www.pgpool.net/docs/latest/en/html/)
