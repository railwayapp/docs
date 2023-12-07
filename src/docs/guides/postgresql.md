---
title: PostgreSQL
---

The Railway PostgreSQL database service allows you to provision and connect to a
PostgreSQL database with zero configuration.

## Deploy

You can add a PostgreSQL database via the `CMD + K` menu or by clicking the `+ New` button on the Project Canvas.

<Image src="https://res.cloudinary.com/railway/image/upload/v1695934218/docs/databases/addDB_qxyctn.gif"
alt="GIF of the Adding Database"
layout="intrinsic"
width={450} height={396} quality={100} />

## Connect

There are two ways to connect to a PostgreSQL database - 
- privately via [Private Networking](/reference/private-networking)
- publicly via [TCP Proxy](/deploy/exposing-your-app#tcp-proxying)

When you deploy your PostgreSQL database, you will have access to two environment [variables](/develop/variables) that enable one of the two connection types (private or public).

As you create more services in your project, you can use [Reference Variables](/develop/variables#reference-variables) to easily connect to the PostgreSQL database.

### Private Networking

To access your PostgreSQL database from another service within the same [project](/develop/projects), you can use the connection string stored in the `DATABASE_PRIVATE_URL` environment variable.

This connection string uses [Private Networking](/reference/private-networking) to route communication to your service over the private network.


### TCP Proxy Connection

To access your PostgreSQL database over the public internet, you can use the connection string stored in the `DATABASE_URL` environment variable available in the service.

This connection string uses the [TCP Proxy connection](/deploy/exposing-your-app#tcp-proxying) to route communication to your service over the public internet.

You can also connect using psql shell:
```bash
psql "postgres://railway:PASSWORD@PROXY_DOMAIN:PROXY_PORT/railway"
```

## Variables

The following variables are included in the PostgreSQL service and can be referenced in other services:
- `PGHOST`
- `PGPORT`
- `PGUSER`
- `PGPASSWORD`
- `PGDATABASE`
- `DATABASE_URL`
- `DATABASE_PRIVATE_URL`

_Note, Many libraries will automatically look for the `DATABASE_URL` variable and use
it to connect to PostgreSQL but you can use these variables in whatever way works for you._

## Image

The Postgres database service uses Railway's [SSL-enabled Postgres image](https://github.com/railwayapp-templates/postgres-ssl/pkgs/container/postgres-ssl), which uses the official [postgres](https://hub.docker.com/_/postgres) image in Docker Hub as its base.

## Changing System Variables

Tailor your PostgreSQL service to your needs by adding any variables relevant to the [postgres](https://hub.docker.com/_/postgres) image.


## Timescale and PostGIS

The Postgres service deployed from the Command Palette no longer contains PostGIS or Timescale extensions.  However, there are several options in the template marketplace that deploy a PostGIS or Timescale-enabled Postgres image.
- <a href="https://railway.app/template/VSbF5V" target="_blank">TimescaleDB</a>
- <a href="https://railway.app/template/postgis" target="_blank">PostGIS</a>
- <a href="https://railway.app/template/timescaledb-postgis" target="_blank">TimescaleDB + PostGIS</a>

To deploy a service from a template in an existing project, simply click `+ New` from your project canvas, select `Template` and search for the template you require.