---
title: railway private-network
description: Manage private networking for a service.
---

Manage private networking endpoint status and names for a service.

Private networking uses the selected service and environment. When multiple
private networks exist, `status` shows each network. `update` defaults to the
network named `railway` unless you pass `--network`.

## Usage

```bash
railway private-network <COMMAND> [OPTIONS]
```

## Subcommands

| Subcommand | Description |
|------------|-------------|
| `status` | Show private networking status |
| `update` | Update the private networking endpoint name |

## Options

| Flag | Description |
|------|-------------|
| `-s, --service <SERVICE>` | Service name or ID |
| `-e, --environment <ENVIRONMENT>` | Environment to use |
| `-p, --project <PROJECT_ID>` | Project ID to use |
| `--network <NETWORK>` | Private network name, ID, or DNS name |
| `--json` | Output in JSON format |

## Examples

### Show private networking status

```bash
railway private-network status --service api
```

Shows private networking status for the selected service and environment.

### Show status for a specific private network

```bash
railway private-network status --network railway --json
```

Uses the private network name, ID, or DNS name passed to `--network`.

### Update an endpoint name

```bash
railway private-network update api-internal --service api
```

Updates the service's private networking endpoint name. Pass the endpoint name
prefix only, without the `.internal` suffix.

## Related

- [Private networking](/networking/private-networking)
- [railway service](/cli/service)
- [railway status](/cli/status)
