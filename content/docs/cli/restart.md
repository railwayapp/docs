---
title: railway restart
description: Restart the latest deployment of a service (without rebuilding).
---

Restart the most recent deployment of a service without triggering a rebuild.

## Usage

```bash
railway restart [OPTIONS]
```

## Options

| Flag | Description |
|------|-------------|
| `-s, --service <SERVICE>` | Service to restart (defaults to linked service) |
| `-y, --yes` | Skip confirmation dialog |
| `--json` | Output in JSON format |

## Examples

### Restart Current Service

```bash
railway restart
```

### Restart Specific Service

```bash
railway restart --service backend
```

### Skip Confirmation

```bash
railway restart --yes
```

## Behavior

This command restarts the service without rebuilding it. The existing deployment image is reused. The command waits for the deployment to become healthy before completing.

## Difference from Redeploy

- **restart**: Restarts the existing deployment (no build)
- **redeploy**: Creates a new deployment from the same source (triggers a build)

## Related

- [railway redeploy](/cli/redeploy)
- [railway logs](/cli/logs)
