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
| `--ssh` | Tunnel to the database over SSH instead of a public TCP proxy. Auto-enabled when the service has no public proxy URL |
| `--no-ssh` | Force the public TCP proxy path and never fall back to SSH. Conflicts with `--ssh` |
| `--tunnel-only` | Open the local tunnel without launching a database client; prints connection details for external tools and holds the tunnel open until Ctrl+C. Implies `--ssh` |
| `-P, --port <PORT>` | Local port to bind for the SSH tunnel (defaults to an ephemeral port) |

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

### Point an external GUI client (TablePlus, DBeaver, pgAdmin, ...) at the database

```bash
railway connect postgres --tunnel-only
```

Opens a local SSH tunnel to the database and prints the host, port, user, password, database, and full connection URL, then holds the tunnel open until Ctrl+C. Use this when you want to point a GUI client at the database instead of an interactive shell.

## Requirements

- The appropriate database client must be installed on your machine, unless using `--tunnel-only`
- If the database has no public [TCP Proxy](/networking/tcp-proxy), `railway connect` automatically tunnels over SSH instead — no public URL required

## How it works

1. Detects the database type from the service's image
2. Fetches connection variables (`DATABASE_PUBLIC_URL`, `REDIS_PUBLIC_URL`, etc.)
3. If the service has a public TCP Proxy and `--ssh`/`--tunnel-only` weren't passed, launches the appropriate database client directly against it
4. Otherwise, opens a local SSH tunnel into the service and either launches the database client against the tunnel, or — with `--tunnel-only` — prints the connection details for an external client and holds the tunnel open

## Related

- [railway ssh](/cli/ssh)
- [railway run](/cli/run)
