---
title: railway down
description: Remove the most recent deployment.
---

Delete the most recent successful deployment of a service.

## Usage

```bash
railway down [OPTIONS]
```

## Options

| Flag | Description |
|------|-------------|
| `-s, --service <SERVICE>` | Service to remove deployment from (defaults to linked service) |
| `-e, --environment <ENV>` | Environment to remove deployment from (defaults to linked environment) |
| `-y, --yes` | Skip confirmation dialog |

## Examples

### Remove Latest Deployment

```bash
railway down
```

### Remove from Specific Service

```bash
railway down --service backend
```

### Skip Confirmation

```bash
railway down --yes
```

## Behavior

This command removes only the latest successful deployment. The service itself is not deleted, and you can deploy again with `railway up`.

## Related

- [railway up](/cli/up)
- [railway redeploy](/cli/redeploy)
