---
title: railway connect
description: Connect to a database's shell.
---

Connect to a database's interactive shell (psql for Postgres, mongosh for MongoDB, etc.).

## Usage

```bash
railway connect [SERVICE_NAME] [OPTIONS]
```

## Options

| Flag | Description |
|------|-------------|
| `-e, --environment <ENV>` | Environment to pull variables from (defaults to linked environment) |

## Supported databases

| Database | Client Required |
|----------|-----------------|
| PostgreSQL | `psql` |
| MySQL | `mysql` |
| Redis | `redis-cli` |
| MongoDB | `mongosh` |

## Examples

### Connect to database (interactive)

```bash
railway connect
```

Prompts you to select a database service if multiple exist.

### Connect to specific database

```bash
railway connect postgres
```

### Connect to database in specific environment

```bash
railway connect postgres --environment staging
```

## Requirements

- The database must have a [TCP Proxy](/networking/tcp-proxy) enabled (public URL)
- The appropriate database client must be installed on your machine

## How it works

1. Detects the database type from the service's image
2. Fetches connection variables (`DATABASE_PUBLIC_URL`, `REDIS_PUBLIC_URL`, etc.)
3. Launches the appropriate database client with the connection string

## Related

- [railway ssh](/cli/ssh)
- [railway run](/cli/run)
