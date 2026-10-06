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

Railway maintains these templates (the Redis template is owned by Redis) and they come pre-configured with sensible defaults.

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
| [**Backups**](/volumes/backups) | Scheduled and on-demand volume backups; [point-in-time recovery](/volumes/point-in-time-recovery) for PostgreSQL and MySQL |

## Building custom database services

Need to run a database that isn't in the templates marketplace? Check out the guide on [building a database service](/databases/build-a-database-service) to learn how to configure volumes, networking, and persistence for any database.

## What Railway manages

Railway maintains the database templates above (the Redis template is owned by Redis) and keeps them running. The table lists which operations Railway handles and which stay with the user.

| Operation | Who |
| --- | --- |
| Provisioning, storage and networking | Railway |
| Security patches to the database image | Railway |
| Major version upgrades | User, [one click for PostgreSQL](/databases/postgresql-major-upgrade) |
| [Backups](/volumes/backups) and [point-in-time recovery](/volumes/point-in-time-recovery) (PostgreSQL, MySQL) | User turns them on |
| High availability and failover ([PostgreSQL](/databases/postgresql-ha), [MySQL](/databases/mysql-ha), [Redis](/databases/redis-ha), [MongoDB](/databases/mongo-ha)) | User turns it on; failover is then automatic |
| [Connection pooling](/databases/postgresql-pgbouncer) (PostgreSQL) | User turns it on |
| Disk size | User [resizes the volume](/volumes#live-resizing-the-volume) |
| Schema, queries, indexes and data | User |

## Database support scope

Support covers the template as Railway ships it and the platform it runs on:

- provisioning, volumes and networking;
- security updates to the database image;
- the dashboard and CLI flows for backups, point-in-time recovery, high availability, connection pooling and major upgrades.

A database leaves this scope when the user changes:

- the service's image, source, start command or the template's own variables;
- its volume: the mount path, detaching or swapping it, or restoring a backup into it by hand;
- the members of an HA cluster (replicas, proxies, consensus nodes) outside the dashboard and CLI flows;
- files inside the container through SSH or a shell, such as the engine's config files or the data directory;
- the database's own configuration through SQL rather than through Railway's dashboard or CLI: roles, settings, extensions, `ALTER SYSTEM`.

From then on the database is the user's to manage. Support still helps with the platform.

Schema, queries, indexes and the data are always the user's. Support does not configure a database for the user and does not make tuning, schema or query recommendations; the engine's own documentation, linked from each database page, is the reference.
