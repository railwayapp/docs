---
title: railway scale
description: Scale a service across regions.
---

Scale a service by configuring the number of instances in different regions.

## Usage

```bash
railway scale [OPTIONS] [--<REGION>=<INSTANCES>...]
```

## Options

| Flag | Description |
|------|-------------|
| `-s, --service <SERVICE>` | Service to scale (defaults to linked service) |
| `-e, --environment <ENV>` | Environment the service is in (defaults to linked environment) |
| `--json` | Output in JSON format |
| `--<REGION>=<N>` | Set the number of instances for a specific region |

## Dynamic region flags

The available region flags are fetched dynamically from Railway. Common regions include:

- `--us-west1`
- `--us-east4`
- `--europe-west4`
- `--asia-southeast1`

## Examples

### Interactive mode

```bash
railway scale
```

Prompts you to select regions and instance counts.

### Scale to specific regions

```bash
railway scale --us-west1=2 --us-east4=1
```

### Scale specific service

```bash
railway scale --service backend --us-west1=3
```

## Behavior

After updating the region configuration, the service is automatically redeployed to apply the changes.

## Related

- [railway redeploy](/cli/redeploy)
- [Scaling](/deployments/scaling)
