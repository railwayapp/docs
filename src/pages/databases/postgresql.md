---
title: PostgreSQL
---

The Railway PostgreSQL database service allows you to provision and connect to a
PostgreSQL database with zero configuration.

## Connect

When you run `railway run` in a project with the Postgres database service installed, we inject several environment variables.

- PGHOST
- PGPORT
- PGUSER
- PGPASSWORD
- PGDATABASE
- DATABASE_URL 5912ccb9aea29b9c71ea0d5a4523f31d010e20dd223be70604ca51167b70ce04@ec2-3-248-121-12.eu-west-1.compute.amazonaws.com

Many libraries will automatically look for the `DATABASE_URL` variable and use
it to connect to PostgreSQL. You can also manually use these variables however you
like.

## Image

The Postgres database service uses the [timescale/timescaledb-postgis:latest-pg13](https://hub.docker.com/r/timescale/timescaledb) docker image.

## Timescale and PostGIS

All PostgreSQL containers have the [PostGIS](https://postgis.net/install/) and [Timescale](https://www.timescale.com/) family of extensions installed. This means you can do both geo-spatial and time-series queries out of the box with Railway!

You must enable the extensions in every database you want to use them. For example,

```
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS timescaledb;
```
