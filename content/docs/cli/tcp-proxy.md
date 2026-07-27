---
title: railway tcp-proxy
description: Manage public TCP proxies for a service.
---

Manage public TCP proxies for a service.

TCP proxies expose non-HTTP application ports, such as database or game server
ports, to the public internet. Only one TCP proxy is allowed per service
instance. Creating a TCP proxy updates the service networking configuration.

## Usage

```bash
railway tcp-proxy <COMMAND> [OPTIONS]
```

## Subcommands

| Subcommand | Aliases | Description |
|------------|---------|-------------|
| `list` | `ls` | List TCP proxies for a service |
| `create` | `add`, `new` | Create a TCP proxy for an application port |
| `status` | | Show status for a TCP proxy |
| `delete` | `remove`, `rm` | Delete a TCP proxy |

## Options

| Flag | Description |
|------|-------------|
| `-s, --service <SERVICE>` | Service name or ID |
| `-e, --environment <ENVIRONMENT>` | Environment to use |
| `-p, --project <PROJECT_ID>` | Project ID to use |
| `--json` | Output in JSON format |

## Examples

### List TCP proxies

```bash
railway tcp-proxy list --service postgres
```

Lists TCP proxies for the selected service and environment.

### Create a TCP proxy

```bash
railway tcp-proxy create --port 5432 --service postgres
```

Creates a TCP proxy for the application port. If the proxy doesn't become
active, redeploy the service and check its status.

### Show TCP proxy status

```bash
railway tcp-proxy status tcp-proxy-id
```

The proxy identifier can be a TCP proxy ID, domain, endpoint, proxy port, or
application port.

### Delete a TCP proxy

```bash
railway tcp-proxy delete tcp-proxy-id --yes
```

Deletes the selected TCP proxy. Omit `--yes` to confirm interactively.

## Options for `create`

Use `railway tcp-proxy create` with an application port.

| Flag | Description |
|------|-------------|
| `--port <PORT>` | Application port to expose through the TCP proxy |

## Arguments for `status` and `delete`

| Argument | Description |
|----------|-------------|
| `<PROXY>` | TCP proxy ID, domain, endpoint, proxy port, or application port |

## Options for `delete`

| Flag | Description |
|------|-------------|
| `-y, --yes` | Skip confirmation |

## Related

- [TCP proxy](/networking/tcp-proxy)
- [Public networking](/networking/public-networking)
- [railway service](/cli/service)
