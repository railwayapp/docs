---
title: railway deployment
description: Manage deployments.
---

List and manage deployments for your services.

## Usage

```bash
railway deployment <COMMAND> [OPTIONS]
```

## Subcommands

| Subcommand | Aliases | Description |
|------------|---------|-------------|
| `list` | `ls` | List deployments with IDs, statuses, and timestamps |
| `up` | | Upload and deploy (same as `railway up`) |
| `redeploy` | | Redeploy latest deployment (same as `railway redeploy`) |

## Examples

### List Deployments

```bash
railway deployment list
```

Output:
```
Recent Deployments
  7422c95b-c604-46bc-9de4-b7a43e1fd53d | SUCCESS | 2024-01-15 10:30:00 PST
  a1b2c3d4-e5f6-7890-abcd-ef1234567890 | FAILED | 2024-01-15 09:15:00 PST
  ...
```

### List More Deployments

```bash
railway deployment list --limit 50
```

### List Deployments for Specific Service

```bash
railway deployment list --service backend
```

### List Deployments in JSON Format

```bash
railway deployment list --json
```

Useful for scripting:

```bash
# Get the latest deployment ID
railway deployment list --json --limit 1 | jq -r '.[0].id'
```

### Use Deployment ID with Logs

```bash
# Get deployment ID from list
railway deployment list

# View logs for specific deployment
railway logs 7422c95b-c604-46bc-9de4-b7a43e1fd53d
```

## Options for `list`

| Flag | Description |
|------|-------------|
| `-s, --service <SERVICE>` | Service to list deployments for (defaults to linked service) |
| `-e, --environment <ENV>` | Environment to list deployments from (defaults to linked environment) |
| `--limit <N>` | Maximum number of deployments to show (default: 20, max: 1000) |
| `--json` | Output in JSON format |

## Deployment Statuses

| Status | Description |
|--------|-------------|
| `SUCCESS` | Deployment completed successfully |
| `FAILED` | Deployment failed |
| `CRASHED` | Deployment crashed after starting |
| `BUILDING` | Deployment is being built |
| `DEPLOYING` | Deployment is being deployed |
| `INITIALIZING` | Deployment is initializing |
| `WAITING` | Deployment is waiting |
| `QUEUED` | Deployment is queued |
| `REMOVED` | Deployment was removed |
| `REMOVING` | Deployment is being removed |

## Related

- [railway up](/cli/up)
- [railway redeploy](/cli/redeploy)
- [railway logs](/cli/logs)
