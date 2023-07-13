---
title: PostgreSQL
---

The Railway PostgreSQL database service allows you to provision and connect to a
PostgreSQL database with zero configuration.

## Connect

There are two ways to connect to a PostgreSQL database:
- Add a [Reference Variable](/develop/variables#reference-variables) to a service
- Run `railway connect` to start a `psql` shell

The following variables can be referenced in your services:
- `PGHOST`
- `PGPORT`
- `PGUSER`
- `PGPASSWORD`
- `PGDATABASE`
- `DATABASE_URL`

_Note, Many libraries will automatically look for the `DATABASE_URL` variable and use
it to connect to PostgreSQL but you can use these variables in whatever way works for you._

## Image

The Postgres database service uses the [timescale/timescaledb-postgis:latest-pg13](https://hub.docker.com/r/timescale/timescaledb) docker image.

## Timescale and PostGIS

All PostgreSQL containers have the [PostGIS](https://postgis.net/install/) and [Timescale](https://www.timescale.com/) family of extensions installed. This means you can do both geo-spatial and time-series queries out of the box with Railway!

You must enable the extensions in every database you want to use them. For example,

```
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS timescaledb;
```
