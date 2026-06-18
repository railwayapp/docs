---
title: railway logs
description: View build, deploy, HTTP, or network flow logs.
---

View build, deploy, HTTP, or network flow logs. Streams logs by default, or fetches historical logs when using `--lines`, `--since`, or `--until`.

## Usage

```bash
railway logs [DEPLOYMENT_ID] [OPTIONS]
```

## Options

| Flag | Description |
|------|-------------|
| `-s, --service <SERVICE>` | Service to view logs from (defaults to linked service) |
| `-e, --environment <ENV>` | Environment to view logs from (defaults to linked environment) |
| `-p, --project <PROJECT_ID>` | Project to use (defaults to linked project) |
| `-d, --deployment` | Show deployment logs |
| `-b, --build` | Show build logs |
| `--http` | Show HTTP request logs |
| `--network` | Show network flow logs |
| `-n, --lines <N>` | Number of log lines to fetch (disables streaming) |
| `-f, --filter <QUERY>` | Filter logs using Railway's query syntax |
| `--latest` | Show logs from latest deployment (even if failed/building) |
| `-S, --since <TIME>` | Show logs since a specific time (disables streaming) |
| `-U, --until <TIME>` | Show logs until a specific time (disables streaming) |
| `--json` | Output logs in JSON format |

### Network flow filters

These flags require `--network` and compose with `--filter`.

| Flag | Description |
|------|-------------|
| `--protocol <PROTOCOL>` | Filter by `tcp`, `udp`, `icmp`, `icmpv6`, or `unknown` |
| `--direction <DIRECTION>` | Filter by `ingress` or `egress` |
| `--peer <PEER>` | Filter by peer service name, peer service ID, `internet`, `dns`, or `edge-proxy` |
| `--peer-kind <KIND>` | Filter by `service`, `internet`, `edge_proxy`, `local_dns`, or `unknown` |
| `--status <STATUS>` | Filter by `ok` or `dropped` |
| `--dropped <BOOL>` | Filter by whether packets were dropped |
| `--port <PORT>` | Filter by source or destination port |
| `--src <IP>` | Filter by source IP |
| `--dst <IP>` | Filter by destination IP |
| `--host <IP>` | Filter by source or destination IP |
| `--drop-cause <CAUSE>` | Filter by drop cause |

## Examples

### Stream live logs

```bash
railway logs
```

### View build logs

```bash
railway logs --build
```

### View last 100 lines

```bash
railway logs --lines 100
```

### View logs from last hour

```bash
railway logs --since 1h
```

### View logs from time range

```bash
railway logs --since 30m --until 10m
```

### View logs since specific time

```bash
railway logs --since 2024-01-15T10:00:00Z
```

### Filter error logs

```bash
railway logs --lines 10 --filter "@level:error"
```

### Filter warning logs with text

```bash
railway logs --lines 10 --filter "@level:warn AND rate limit"
```

### Logs from specific service

```bash
railway logs --service backend --environment production
```

### Logs from specific deployment

```bash
railway logs 7422c95b-c604-46bc-9de4-b7a43e1fd53d --build
```

### Stream network flow logs

```bash
railway logs --network
```

### Fetch a network flow snapshot

```bash
railway logs --network --lines 100
```

### Filter outbound TCP traffic

```bash
railway logs --network --direction egress --protocol tcp
```

### Filter traffic for a peer and port

```bash
railway logs --network --peer postgres --port 5432
```

### Show dropped network flows

```bash
railway logs --network --status dropped
```

### Compose typed and raw network filters

```bash
railway logs --network --protocol tcp --filter "@drop_cause:NO_SOCKET"
```

### JSON output

```bash
railway logs --json
```

### Network flow JSON output

```bash
railway logs --network --json --lines 1
```

Network flow JSON is newline-delimited JSON. Each row uses camelCase field names from the public GraphQL API and includes `timestamp` as an alias of `captureEnd`.

```json
{
  "timestamp": "2026-06-16T00:15:14.000Z",
  "flowId": "string",
  "captureStart": "2026-06-16T00:15:14.000Z",
  "captureEnd": "2026-06-16T00:15:14.000Z",
  "flowState": "complete",
  "direction": "ingress",
  "l4Protocol": "tcp",
  "srcAddr": "10.202.164.239",
  "srcPort": 8080,
  "dstAddr": "100.64.0.2",
  "dstPort": 51222,
  "peerKind": "internet",
  "peerServiceId": null,
  "byteCount": 418,
  "packetCount": 6,
  "l4LatencyMs": 0,
  "dropCause": null,
  "serviceId": "string",
  "deploymentId": "string",
  "deploymentInstanceId": "string"
}
```

## Time formats

The `--since` and `--until` flags accept:

- **Relative times**: `30s`, `5m`, `2h`, `1d`, `1w`
- **ISO 8601 timestamps**: `2024-01-15T10:30:00Z`

## Filter syntax

Railway uses a query syntax for filtering logs:

- **Text search**: `"error message"` or `user signup`
- **Attribute filters**: `@level:error`, `@level:warn`
- **Operators**: `AND`, `OR`, `-` (not)
- **Network flow filters**: `@protocol:tcp`, `@direction:egress`, `@peer_kind:internet`, `@port:443`, `@drop_cause:NO_SOCKET`

See [Logs](/observability/logs) for full syntax documentation.

## Behavior

- **Stream mode** (default): Connects via WebSocket and streams logs in real-time
- **Fetch mode**: Retrieves historical logs when using `--lines`, `--since`, or `--until`
- **Network flow logs**: Human output uses `Time`, `Dir`, `Proto`, `Source`, `Destination`, `Peer`, `Traffic`, `Latency`, and `Status` columns
- If the latest deployment failed, build logs are shown by default

## Related

- [railway ssh](/cli/ssh)
- [Logs](/observability/logs)
