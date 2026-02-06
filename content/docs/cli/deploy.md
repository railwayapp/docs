---
title: railway deploy
description: Provision a template into your project.
---

Deploy a template into your Railway project.

**Note:** This command deploys pre-built templates (like databases). To deploy your own code, use [railway up](/cli/up) instead.

## Usage

```bash
railway deploy [OPTIONS]
```

## Options

| Flag | Description |
|------|-------------|
| `-t, --template <CODE>` | The template code to deploy |
| `-v, --variable <KEY=VALUE>` | Environment variables for the template |

## Examples

### Deploy a template (interactive)

```bash
railway deploy
```

### Deploy PostgreSQL

```bash
railway deploy --template postgres
```

### Deploy with variables

```bash
railway deploy --template postgres --variable "POSTGRES_USER=admin"
```

### Deploy multiple templates

```bash
railway deploy --template postgres --template redis
```

### Service-specific variables

Prefix variables with the service name:

```bash
railway deploy --template my-app --variable "Backend.PORT=3000"
```

## Template codes

Common template codes:
- `postgres` - PostgreSQL database
- `mysql` - MySQL database
- `redis` - Redis database
- `mongo` - MongoDB database

Find more templates at [railway.com/templates](https://railway.com/templates).

## Related

- [railway add](/cli/add)
- [Templates](/templates)
