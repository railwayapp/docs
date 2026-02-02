---
title: railway add
description: Add a service to your project.
---

Add a new service to your Railway project. You can add databases, GitHub repos, Docker images, or empty services.

## Usage

```bash
railway add [OPTIONS]
```

## Options

| Flag | Description |
|------|-------------|
| `-d, --database <TYPE>` | Add a database (postgres, mysql, redis, mongo) |
| `-s, --service [NAME]` | Create an empty service (optionally with a name) |
| `-r, --repo <REPO>` | Create a service from a GitHub repo |
| `-i, --image <IMAGE>` | Create a service from a Docker image |
| `-v, --variables <KEY=VALUE>` | Environment variables to set on the service |
| `--verbose` | Enable verbose logging |
| `--json` | Output in JSON format |

## Examples

### Interactive Mode

```bash
railway add
```

Prompts you to select what type of service to add.

### Add a Database

```bash
railway add --database postgres
```

Add multiple databases at once:

```bash
railway add --database postgres --database redis
```

### Add from GitHub Repo

```bash
railway add --repo user/my-repo
```

### Add from Docker Image

```bash
railway add --image nginx:latest
```

### Create an Empty Service

```bash
railway add --service
```

With a specific name:

```bash
railway add --service my-api
```

### Add with Environment Variables

```bash
railway add --service api --variables "PORT=3000" --variables "NODE_ENV=production"
```

## Behavior

When you add a service, it's automatically linked to your current directory. For databases, the new service is automatically deployed.

## Related

- [railway service](/cli/service)
- [railway link](/cli/link)
