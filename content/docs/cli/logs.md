---
title: railway logs
description: View build or deploy logs from a Railway deployment.
---

View build or deploy logs from a Railway deployment. Streams logs by default, or fetches historical logs when using `--lines`, `--since`, or `--until` flags.

## Usage

```bash
railway logs [DEPLOYMENT_ID] [OPTIONS]
```

## Options

| Flag | Description |
|------|-------------|
| `-s, --service <SERVICE>` | Service to view logs from (defaults to linked service) |
| `-e, --environment <ENV>` | Environment to view logs from (defaults to linked environment) |
| `-d, --deployment` | Show deployment logs |
| `-b, --build` | Show build logs |
| `-n, --lines <N>` | Number of log lines to fetch (disables streaming) |
| `-f, --filter <QUERY>` | Filter logs using Railway's query syntax |
| `--latest` | Show logs from latest deployment (even if failed/building) |
| `-S, --since <TIME>` | Show logs since a specific time (disables streaming) |
| `-U, --until <TIME>` | Show logs until a specific time (disables streaming) |
| `--json` | Output logs in JSON format |

## Examples

### Stream Live Logs

```bash
railway logs
```

### View Build Logs

```bash
railway logs --build
```

### View Last 100 Lines

```bash
railway logs --lines 100
```

### View Logs from Last Hour

```bash
railway logs --since 1h
```

### View Logs from Time Range

```bash
railway logs --since 30m --until 10m
```

### View Logs Since Specific Time

```bash
railway logs --since 2024-01-15T10:00:00Z
```

### Filter Error Logs

```bash
railway logs --lines 10 --filter "@level:error"
```

### Filter Warning Logs with Text

```bash
railway logs --lines 10 --filter "@level:warn AND rate limit"
```

### Logs from Specific Service

```bash
railway logs --service backend --environment production
```

### Logs from Specific Deployment

```bash
railway logs 7422c95b-c604-46bc-9de4-b7a43e1fd53d --build
```

### JSON Output

```bash
railway logs --json
```

## Time Formats

The `--since` and `--until` flags accept:

- **Relative times**: `30s`, `5m`, `2h`, `1d`, `1w`
- **ISO 8601 timestamps**: `2024-01-15T10:30:00Z`

## Filter Syntax

Railway uses a query syntax for filtering logs:

- **Text search**: `"error message"` or `user signup`
- **Attribute filters**: `@level:error`, `@level:warn`
- **Operators**: `AND`, `OR`, `-` (not)

See [Logs](/observability/logs) for full syntax documentation.

## Behavior

- **Stream mode** (default): Connects via WebSocket and streams logs in real-time
- **Fetch mode**: Retrieves historical logs when using `--lines`, `--since`, or `--until`
- If the latest deployment failed, build logs are shown by default

## Related

- [railway ssh](/cli/ssh)
- [Logs](/observability/logs)
