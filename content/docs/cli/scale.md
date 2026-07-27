---
title: railway scale
description: Scale a service across regions.
---

Scale a service by setting the number of replicas in one or more regions.

The `railway scale` command applies replica changes through the same environment
patch flow that the dashboard uses, then commits the patch as a single change.
You can pass replica counts as positional arguments, run the interactive scale
TUI in a terminal, or drive scaling from agents and scripts.

## Usage

```bash
railway scale [OPTIONS] [REGION=REPLICAS]...
```

You can also call the command as `railway service scale`. Both forms accept the
same arguments and behave identically.

## Arguments

| Argument | Description |
|----------|-------------|
| `REGION=REPLICAS` | One or more replica assignments. `REGION` is a friendly region name (`eu-west`, `us-east`, `us-west`, `southeast-asia`) or a Railway region ID. `REPLICAS` is a non-negative integer. |

A maximum of 50 total replicas is supported across all regions.

## Options

| Flag | Description |
|------|-------------|
| `-s, --service <SERVICE>` | Service to scale. Defaults to the linked service. |
| `-e, --environment <ENV>` | Environment the service is in. Defaults to the linked environment. |
| `--json` | Output in JSON format. |

## Examples

### Run the interactive TUI

```bash
railway scale
```

When run in a terminal with no replica assignments, `railway scale` opens an
interactive TUI for selecting regions and replica counts. Apply the changes
from the TUI to commit them.

### Scale a service in one region

```bash
railway scale eu-west=2
```

### Scale across multiple regions

```bash
railway scale eu-west=2 us-east=1
```

### Scale a specific service in a specific environment

```bash
railway scale --service worker --environment production eu-west=2 us-east=1
```

### Remove replicas from a region

```bash
railway scale eu-west=0
```

Setting a region to `0` removes all replicas from that region.

### Output the result as JSON

```bash
railway scale --json eu-west=2
```

## Behavior

`railway scale` commits a single environment patch that updates the service's
multi-region replica configuration. The change is applied without a separate
redeploy step.

If you call `railway scale` non-interactively without any `REGION=REPLICAS`
arguments, the command exits with an error. Pass at least one assignment, or
run the command in a terminal to use the TUI.

## Related

- [railway redeploy](/cli/redeploy)
- [Scaling](/deployments/scaling)
