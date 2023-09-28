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
- `DATABASE_PRIVATE_URL`

_Note, Many libraries will automatically look for the `DATABASE_URL` variable and use
it to connect to PostgreSQL but you can use these variables in whatever way works for you._

## Image

The Postgres database service uses Railway's [SSL-enabled Postgres image](https://github.com/railwayapp-templates/postgres-ssl).

## Timescale and PostGIS

The Postgres image that we use in our one-click template no longer contains PostGIS or Timescale extensions.

The beauty of our new services, however, is that you can customize your Postgres service to your needs!  Please reach out to the community in [Discord](https://discord.gg/railway) if you need help.