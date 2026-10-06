---
title: Databases
description: Deploy and manage databases on Railway - PostgreSQL, MySQL, Redis, MongoDB, and any open source database you need.
---

Railway enables you to deploy and manage databases alongside your applications. Whether you need a quick PostgreSQL instance or want to run a specialized database, Railway's platform primitives allow you to build any database service your system requires.

## Getting started

The fastest way to deploy a database is through Railway's database templates:

| Database | Description |
| --- | --- |
| [**PostgreSQL**](/databases/postgresql) | The world's most advanced open source relational database |
| [**PostgreSQL HA**](/databases/postgresql-ha) | High-availability PostgreSQL cluster with automatic failover |
| [**PostgreSQL Connection Pooling**](/databases/postgresql-pgbouncer) | PgBouncer connection pooler for Postgres and HA clusters |
| [**MySQL**](/databases/mysql) | Popular open source relational database |
| [**MySQL HA**](/databases/mysql-ha) | High-availability MySQL cluster with Group Replication failover |
| [**Redis**](/databases/redis) | In-memory data store for caching and real-time data |
| [**Redis HA**](/databases/redis-ha) | High-availability Redis cluster with Sentinel failover |
| [**MongoDB**](/databases/mongodb) | Document-oriented NoSQL database |
| [**MongoDB HA**](/databases/mongo-ha) | High-availability MongoDB replica set with automatic failover |

These templates are maintained by Railway and come pre-configured with sensible defaults.

## Deploy any database

Railway isn't limited to the databases above. You can deploy **any open source database** by using:

- **Docker Images**: Deploy any database available as a Docker image
- **Templates**: Browse the <a href="https://railway.com/templates?category=Storage" target="_blank">database and storage templates</a> for pre-configured options
- **Custom Builds**: Build your own database service from source code

### Popular database templates

Explore these community and official templates in the marketplace:

- <a href="https://railway.com/deploy?category=Storage" target="_blank">**All Storage Templates**</a> - Browse databases, caches, and storage solutions
- ClickHouse, CockroachDB, Cassandra, ParadeDB, and more
- Specialized databases like TimescaleDB, InfluxDB, and Neo4j

## Platform features

Railway provides essential features for running production databases:

| Feature | Description |
| --- | --- |
| [**Volumes**](/volumes) | Persistent storage that survives deployments and restarts |
| [**TCP Proxy**](/networking/tcp-proxy) | Connect to your database from outside Railway's network |
| [**Private Networking**](/networking/private-networking) | Secure, low-latency connections between services |
| [**Backups**](/volumes/backups) | Point-in-time recovery for your data |

## Building custom database services

Need to run a database that isn't in the templates marketplace? Check out the guide on [building a database service](/databases/build-a-database-service) to learn how to configure volumes, networking, and persistence for any database.

## What Railway manages

Railway maintains the database templates above (the Redis template is maintained by Redis) and keeps them running. The table lists which operations Railway handles and which stay with the user.

| Operation | Who |
| --- | --- |
| Provisioning, storage and networking | Railway |
| Security patches to the database image | Railway |
| Major version upgrades | User, [one click for PostgreSQL](/databases/postgresql-major-upgrade) |
| [Backups](/volumes/backups) and [point-in-time recovery](/volumes/point-in-time-recovery) | User turns them on |
| High availability and failover ([PostgreSQL](/databases/postgresql-ha), [MySQL](/databases/mysql-ha), [Redis](/databases/redis-ha)) | User turns it on; failover is then automatic |
| [Connection pooling](/databases/postgresql-pgbouncer) | User turns it on |
| Disk size | User [resizes the volume](/volumes) |
| Schema, queries, indexes and data | User |

## Database support scope

Railway supports the templates as shipped and the platform around them: provisioning, volumes, networking, image security updates, and the dashboard flows for backups, point-in-time recovery, high availability, connection pooling and major upgrades.

Support stops covering a database once it is changed away from the template:

- editing the service's image, start command, variables or volume mount;
- changing the database's own configuration through SQL (roles, settings, extensions, `ALTER SYSTEM`).

After such a change the database is the user's to run. Support still helps with the platform.

Schema, queries, indexes and the data are always the user's. Support does not configure a database for the user and does not make tuning, schema or query recommendations; the engine's own documentation, linked from each database page, is the reference.
