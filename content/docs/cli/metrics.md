---
title: railway metrics
description: View resource and HTTP metrics for a Railway service from the CLI.
---

View resource and HTTP metrics for a Railway service from the CLI. The
`metrics` command works at three levels: the linked service by default, a
specific service with `--service`, and every service in the project with
`--all`.

You can also call the command as `railway metric`. Both forms behave
identically.

## Usage

```bash
railway metrics [OPTIONS]
```

## Options

| Flag | Description |
|------|-------------|
| `-s, --service <SERVICE>` | Service to view metrics for. Defaults to the linked service. Conflicts with `--all`. |
| `-a, --all` | Show metrics for all services in the project. Conflicts with `--raw`. |
| `-e, --environment <ENV>` | Environment to view metrics for. Defaults to the linked environment. |
| `-S, --since <TIME>` | Start of the time window. Accepts relative (`1h`, `6h`, `1d`, `7d`) or ISO 8601. Defaults to `1h`. |
| `-U, --until <TIME>` | End of the time window. Same formats as `--since`. Defaults to now. Conflicts with `--watch`. |
| `--cpu` | Show only CPU metrics. |
| `--memory` | Show only memory metrics. |
| `--network` | Show only public network traffic (egress and ingress). |
| `--volume` | Show only volume and disk metrics. |
| `--http` | Show only HTTP metrics. |
| `--method <METHOD>` | Filter HTTP metrics by request method. Requires `--http`. |
| `--path <PATH>` | Filter HTTP metrics by request path. Requires `--http`. |
| `--raw` | Output raw time-series data points instead of summaries. |
| `--json` | Output in JSON format. |
| `-w, --watch` | Open a live TUI dashboard that refreshes metrics. |

## Metric groups

When no metric flag is set, `railway metrics` shows every group. Pass one or
more flags to limit output:

- `--cpu`: CPU usage and limits.
- `--memory`: Memory usage and limits.
- `--network`: Public network ingress and egress.
- `--volume`: Disk and volume usage.
- `--http`: HTTP request totals, status-code buckets, error rate, and latency percentiles.

For database services, the command detects supported database images and
includes native database stats from Postgres, Redis, MySQL, and MongoDB through
Railway SSH.

## Examples

### Quick overview of the linked service

```bash
railway metrics
```

### Specific service and environment

```bash
railway metrics --service my-api --environment production
```

### Last 6 hours

```bash
railway metrics --since 6h
```

### Specific time window

```bash
railway metrics --since 1d --until 1h
```

### Only CPU and memory

```bash
railway metrics --cpu --memory
```

### Only HTTP metrics

```bash
railway metrics --http
```

### HTTP metrics for POST requests to a specific path

```bash
railway metrics --http --method POST --path /api/users
```

### Raw time-series data

```bash
railway metrics --raw --cpu
```

### Compact view across every service in the project

```bash
railway metrics --all
```

### JSON output for scripts and agents

```bash
railway metrics --json
```

```bash
railway metrics --json --http --method POST
```

### Live dashboard

```bash
railway metrics --watch
```

```bash
railway metrics --all --watch
```

The `--watch` mode opens an interactive TUI with periodic refreshes,
time-range switching, metric toggles, HTTP status and latency series toggles,
and per-service detail panels in project mode.

## Related

- [railway logs](/cli/logs)
- [Metrics](/observability/metrics)
