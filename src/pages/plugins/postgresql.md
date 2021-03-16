---
title: PostgreSQL
---

The Railway PostgreSQL plugin allows you to provision and connect to a
PostgreSQL database with zero configuration.

## Connect

When you run `railway run` in a project with the Postgres plugin installed, we inject several environment variables.

- PGHOST
- PGPORT
- PGUSER
- PGPASSWORD
- PGDATABASE
- DATABASE_URL

Many libraries will automatically look for the `DATABASE_URL` variable and use
it to connect to PostgreSQL. You can also manually use these variables however you
like.

## Image

The Postgres plugin uses the [timescale/timescaledb-postgis:latest-pg13](https://hub.docker.com/r/timescale/timescaledb) docker image.

## Timescale and PostGIS

All PostgreSQL containers have the [PostGIS](https://postgis.net/install/) and [Timescale](https://www.timescale.com/) family of extensions installed. However, you must enable the extensions in every database you want to use them.

For example

```
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS timescaledb;
```
