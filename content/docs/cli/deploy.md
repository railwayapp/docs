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

### Deploy a Template (Interactive)

```bash
railway deploy
```

### Deploy PostgreSQL

```bash
railway deploy --template postgres
```

### Deploy with Variables

```bash
railway deploy --template postgres --variable "POSTGRES_USER=admin"
```

### Deploy Multiple Templates

```bash
railway deploy --template postgres --template redis
```

### Service-Specific Variables

Prefix variables with the service name:

```bash
railway deploy --template my-app --variable "Backend.PORT=3000"
```

## Template Codes

Common template codes:
- `postgres` - PostgreSQL database
- `mysql` - MySQL database
- `redis` - Redis database
- `mongo` - MongoDB database

Find more templates at [railway.com/templates](https://railway.com/templates).

## Related

- [railway add](/cli/add)
- [Templates](/templates)
