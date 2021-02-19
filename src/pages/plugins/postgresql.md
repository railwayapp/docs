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

The Postgres plugin uses the [postgis/postgis:13-3.1](https://registry.hub.docker.com/r/postgis/postgis/) docker image.

## PostGIS

All PostgreSQL containers have the [PostGIS](https://postgis.net/install/) family of extensions installed. However, you must enable PostGIS in every database you want to use it.

```
CREATE EXTENSION postgis;
```
