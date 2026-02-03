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
| [**MySQL**](/databases/mysql) | Popular open source relational database |
| [**Redis**](/databases/redis) | In-memory data store for caching and real-time data |
| [**MongoDB**](/databases/mongodb) | Document-oriented NoSQL database |

These templates are maintained by Railway and come pre-configured with sensible defaults.

## Deploy any database

Railway isn't limited to the databases above. You can deploy **any open source database** by using:

- **Docker Images**: Deploy any database available as a Docker image
- **Templates**: Browse our <a href="https://railway.com/templates?category=Storage" target="_blank">database and storage templates</a> for pre-configured options
- **Custom Builds**: Build your own database service from source code

### Popular database templates

Explore these community and official templates in our marketplace:

- <a href="https://railway.com/deploy?category=Storage" target="_blank">**All Storage Templates**</a> - Browse databases, caches, and storage solutions
- ClickHouse, CockroachDB, Cassandra, and more
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

Need to run a database that isn't in our templates? Check out our guide on [building a database service](/databases/build-a-database-service) to learn how to configure volumes, networking, and persistence for any database.

## Important notes

Railway-provided database templates are **unmanaged services** - you're responsible for:

- Configuring backups and disaster recovery
- Tuning performance for your workload
- Managing security and access control
- Monitoring and maintenance

For managed database requirements or compliance needs, consider [Enterprise](/enterprise) or connecting to external managed database providers.
