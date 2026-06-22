---
title: railway outbound-network
description: Manage outbound networking settings for a service.
---

Manage Static Outbound IPs and Outbound IPv6 for a service.

Static Outbound IP changes are committed directly to the service's outbound
networking settings. Redeploy the service before outbound traffic uses the new
IP addresses or stops using removed IP addresses.

Outbound IPv6 changes are staged as environment config changes. Apply the
staged changes to trigger a redeploy.

## Usage

```bash
railway outbound-network <COMMAND> [OPTIONS]
```

## Subcommands

| Subcommand | Description |
|------------|-------------|
| `status` | Show Static Outbound IP and Outbound IPv6 status |
| `static-ip status` | Show Static Outbound IP status |
| `static-ip enable` | Enable Static Outbound IPs |
| `static-ip disable` | Disable Static Outbound IPs |
| `ipv6 status` | Show Outbound IPv6 status |
| `ipv6 enable` | Stage enabling Outbound IPv6 |
| `ipv6 disable` | Stage disabling Outbound IPv6 |

## Options

| Flag | Description |
|------|-------------|
| `-s, --service <SERVICE>` | Service name or ID |
| `-e, --environment <ENVIRONMENT>` | Environment to use |
| `-p, --project <PROJECT_ID>` | Project ID to use |
| `--json` | Output in JSON format |

## Examples

### Show outbound networking status

```bash
railway outbound-network status --service api
```

Shows Static Outbound IP and Outbound IPv6 status for the selected service.

### Enable Static Outbound IPs

```bash
railway outbound-network static-ip enable --service api
```

Enables Static Outbound IPs and prints the assigned IPv4 addresses. Redeploy the
service before outbound traffic uses these IP addresses.

### Disable Static Outbound IPs

```bash
railway outbound-network static-ip disable --service api
```

Disables Static Outbound IPs. Redeploy the service before outbound traffic
stops using the removed IP addresses.

### Stage Outbound IPv6

```bash
railway outbound-network ipv6 enable --service api
```

Stages an environment config change for Outbound IPv6. Apply staged changes to
trigger a redeploy.

### Clear or stage disabling Outbound IPv6

```bash
railway outbound-network ipv6 disable --service api
```

If Outbound IPv6 is enabled, this stages disabling it. If enabling Outbound IPv6
is staged but not applied, this clears the staged change.

### Output JSON

```bash
railway outbound-network static-ip status --service api --json
```

Use `--json` to inspect lifecycle fields for automation. Static Outbound IP
actions use `direct` lifecycle mode. Outbound IPv6 actions use
`environmentPatch` lifecycle mode.

## Related

- [Static Outbound IPs](/networking/static-outbound-ips)
- [Outbound networking](/networking/outbound-networking)
- [Staged changes](/deployments/staged-changes)
- [railway service](/cli/service)
