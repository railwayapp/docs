---
title: railway service
description: Manage services.
---

Link a service to the current project and manage service operations.

## Usage

```bash
railway service [SERVICE] [COMMAND]
```

## Subcommands

| Subcommand | Description |
|------------|-------------|
| `link` | Link a service to the current project |
| `status` | Show deployment status for services |
| `logs` | View logs from a service |
| `redeploy` | Redeploy the latest deployment |
| `restart` | Restart the latest deployment |
| `scale` | Scale a service across regions |

## Examples

### Link a Service (Interactive)

```bash
railway service
```

Prompts you to select a service to link.

### Link a Specific Service

```bash
railway service backend
```

### Show Service Status

```bash
railway service status
```

### Show All Services Status

```bash
railway service status --all
```

### View Service Logs

```bash
railway service logs
```

### Redeploy Service

```bash
railway service redeploy
```

### Restart Service

```bash
railway service restart
```

### Scale Service

```bash
railway service scale --us-west1=2
```

## Options for `status`

| Flag | Description |
|------|-------------|
| `-a, --all` | Show status for all services in the environment |
| `--json` | Output in JSON format |

## Options for `logs`

| Flag | Description |
|------|-------------|
| `-d, --deployment` | Show deployment logs |
| `-b, --build` | Show build logs |
| `-n, --lines <N>` | Number of log lines to fetch (disables streaming) |
| `-f, --filter <QUERY>` | Filter logs using Railway's query syntax |
| `--latest` | Show logs from latest deployment (even if failed/building) |
| `-S, --since <TIME>` | Show logs since a specific time |
| `-U, --until <TIME>` | Show logs until a specific time |
| `--json` | Output logs in JSON format |

See [railway logs](/cli/logs) for detailed usage and examples.

## Options for `redeploy`

| Flag | Description |
|------|-------------|
| `-y, --yes` | Skip confirmation dialog |
| `--json` | Output in JSON format |

## Options for `restart`

| Flag | Description |
|------|-------------|
| `-y, --yes` | Skip confirmation dialog |
| `--json` | Output in JSON format |

## Options for `scale`

| Flag | Description |
|------|-------------|
| `--<REGION>=<N>` | Set the number of instances for a specific region |
| `--json` | Output in JSON format |

See [railway scale](/cli/scale) for available regions and detailed usage.

## Related

- [railway add](/cli/add)
- [railway link](/cli/link)
- [railway logs](/cli/logs)
