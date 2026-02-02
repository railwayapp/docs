---
title: railway redeploy
description: Redeploy the latest deployment of a service.
---

Redeploy the most recent deployment of a service without uploading new code.

## Usage

```bash
railway redeploy [OPTIONS]
```

## Options

| Flag | Description |
|------|-------------|
| `-s, --service <SERVICE>` | Service to redeploy (defaults to linked service) |
| `-y, --yes` | Skip confirmation dialog |
| `--json` | Output in JSON format |

## Examples

### Redeploy Current Service

```bash
railway redeploy
```

### Redeploy Specific Service

```bash
railway redeploy --service backend
```

### Skip Confirmation

```bash
railway redeploy --yes
```

## Use Cases

Redeploying is useful for:
- Applying environment variable changes
- Restarting a service that crashed
- Triggering a fresh deployment with the same code

## Related

- [railway up](/cli/up)
- [railway restart](/cli/restart)
- [railway logs](/cli/logs)
