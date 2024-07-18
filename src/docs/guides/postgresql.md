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

Connect to PostgreSQL from another service in your project by [referencing the environment variables](/guides/variables#referencing-another-services-variable) made available in the PostgreSQL service:

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

## Image

The Postgres database service uses Railway's [SSL-enabled Postgres image](https://github.com/railwayapp-templates/postgres-ssl/pkgs/container/postgres-ssl), which uses the official [postgres](https://hub.docker.com/_/postgres) image in Docker Hub as its base.

## Changing System Variables

Tailor your PostgreSQL service to your needs by adding any variables relevant to the [postgres](https://hub.docker.com/_/postgres) image.

## Timescale and PostGIS

The Postgres service deployed from the Command Palette no longer contains PostGIS or Timescale extensions. However, there are several options in the template marketplace that deploy a PostGIS or Timescale-enabled Postgres image.

- <a href="https://railway.app/template/VSbF5V" target="_blank">TimescaleDB</a>
- <a href="https://railway.app/template/postgis" target="_blank">PostGIS</a>
- <a href="https://railway.app/template/timescaledb-postgis" target="_blank">TimescaleDB + PostGIS</a>

To deploy a service from a template in an existing project, simply click `+ New` from your project canvas, select `Template` and search for the template you require.
