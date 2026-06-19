---
title: railway logs
description: View build, deploy, HTTP, or network flow logs.
---

View build, deploy, HTTP, or network flow logs for a service. `railway logs` streams logs in real time by default, or fetches historical logs when you pass `--lines`, `--since`, or `--until`.

## Usage

```bash
railway logs [DEPLOYMENT_ID] [OPTIONS]
```

With no log type flag, the command shows deploy logs from the most recent successful deployment. Pass `--build`, `--http`, or `--network` to view a different log type. These flags are mutually exclusive. For deploy, build, and HTTP logs, you can pass a `DEPLOYMENT_ID` to target a specific deployment.

## Options

These options apply to every log type:

| Flag | Description |
|------|-------------|
| `-s, --service <SERVICE>` | Service to view logs from (defaults to linked service) |
| `-e, --environment <ENV>` | Environment to view logs from (defaults to linked environment) |
| `-p, --project <PROJECT_ID>` | Project to use (defaults to linked project) |
| `-n, --lines <N>` | Number of log lines to fetch (disables streaming) |
| `-f, --filter <QUERY>` | Filter logs using Railway's query syntax |
| `-S, --since <TIME>` | Show logs since a specific time (disables streaming) |
| `-U, --until <TIME>` | Show logs until a specific time (disables streaming) |
| `--json` | Output logs in JSON format |

In a terminal with no `--lines`, `--since`, or `--until`, the command streams logs in real time over a WebSocket. Passing any of those flags switches to fetch mode and retrieves historical logs instead.

## Deploy logs

Deploy logs capture the standard output and standard error of your running application. They're the default log type, so `railway logs` with no log type flag shows deploy logs.

| Flag | Description |
|------|-------------|
| `-d, --deployment` | Show deployment logs (the default) |
| `--latest` | Show logs from the latest deployment, even if it failed or is still building |

You can pass a `DEPLOYMENT_ID` to view logs from a specific deployment. Without one, Railway uses the most recent successful deployment, falling back to the latest deployment if none succeeded. If the latest deployment failed, build logs are shown by default.

### Stream live deploy logs

```bash
railway logs
```

### View the last 100 lines

```bash
railway logs --lines 100
```

### View logs from the last hour

```bash
railway logs --since 1h
```

### View logs from a time range

```bash
railway logs --since 30m --until 10m
```

### View logs since a specific time

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

### Logs from a specific service

```bash
railway logs --service backend --environment production
```

### Stream logs from the latest deployment

```bash
railway logs --latest
```

### JSON output

```bash
railway logs --json
```

## Build logs

Build logs capture the output of building your service image, such as dependency installation and compilation steps. Pass `--build` to view them.

| Flag | Description |
|------|-------------|
| `-b, --build` | Show build logs |

You can pass a `DEPLOYMENT_ID` to view build logs from a specific deployment, and `--latest` to target the latest deployment even if it's still building. If the latest deployment failed, build logs are shown by default.

### View build logs

```bash
railway logs --build
```

### Build logs from a specific deployment

```bash
railway logs 7422c95b-c604-46bc-9de4-b7a43e1fd53d --build
```

### Filter build logs

```bash
railway logs --build --filter "error"
```

## HTTP logs

HTTP request logs capture each request served by your service through Railway's edge, including method, path, status code, and timing. Pass `--http` to view them.

Human-readable output shows the timestamp, method, path, status code (color-coded by class), total duration in milliseconds, and request ID for each request. Like deploy and build logs, HTTP logs accept a `DEPLOYMENT_ID` argument and the `--latest` flag.

### HTTP filters

These flags require `--http` and compose with `--filter`:

| Flag | Description |
|------|-------------|
| `--method <METHOD>` | Filter by `GET`, `POST`, `PUT`, `DELETE`, `PATCH`, `HEAD`, or `OPTIONS` |
| `--status <STATUS>` | Filter by status code: exact (`200`), comparison (`>=400`), or range (`500..599`) |
| `--path <PATH>` | Filter by request path |
| `--request-id <ID>` | Filter by request ID |

To filter on fields without a dedicated flag, use `--filter` with the query syntax. HTTP logs support these fields:

- **String fields**: `@method`, `@path`, `@host`, `@requestId`, `@clientUa`, `@srcIp`, `@edgeRegion`, `@upstreamAddress`, `@upstreamProto`, `@downstreamProto`, `@responseDetails`, `@deploymentId`, and `@deploymentInstanceId`
- **Numeric fields**: `@httpStatus`, `@totalDuration`, `@responseTime`, `@upstreamRqDuration`, `@txBytes`, `@rxBytes`, and `@upstreamErrors`

### Stream HTTP request logs

```bash
railway logs --http
```

### Filter by method and status

```bash
railway logs --http --method GET --status 200
```

### Filter by method and path

```bash
railway logs --http --method POST --path /api/users
```

### Filter error responses

```bash
railway logs --http --status ">=400" --lines 50
```

### Filter by status range

```bash
railway logs --http --status 500..599
```

### Find a specific request

```bash
railway logs --http --request-id abc123
```

### Compose typed and raw filters

```bash
railway logs --http --method GET --filter "@totalDuration:>=1000"
```

### Exclude requests by method

```bash
railway logs --http --filter "-@method:OPTIONS"
```

### HTTP JSON output

```bash
railway logs --http --json --lines 1
```

HTTP JSON is newline-delimited JSON. Each row uses camelCase field names from the public GraphQL API.

```json
{
  "timestamp": "2026-06-16T00:15:14.000Z",
  "method": "GET",
  "path": "/api/users",
  "httpStatus": 200,
  "totalDuration": 42,
  "requestId": "string",
  "host": "myapp.up.railway.app",
  "clientUa": "Mozilla/5.0",
  "srcIp": "203.0.113.1",
  "edgeRegion": "us-east-1",
  "txBytes": 512,
  "rxBytes": 128,
  "upstreamRqDuration": 38,
  "upstreamAddress": "10.202.164.239:8080",
  "upstreamProto": "HTTP/1.1",
  "downstreamProto": "HTTP/2",
  "upstreamErrors": 0,
  "responseDetails": "",
  "deploymentId": "string",
  "deploymentInstanceId": "string"
}
```

## Network flow logs

Network flow logs record connection-level traffic for your service, including protocol, direction, peers, ports, and dropped packets. Pass `--network` to view them.

Human-readable output uses `Time`, `Dir`, `Proto`, `Source`, `Destination`, `Peer`, `Traffic`, `Latency`, and `Status` columns. Network flow logs don't accept a `DEPLOYMENT_ID` argument or the `--latest` flag, since flows are tracked at the service level rather than per deployment.

### Network flow filters

These flags require `--network` and compose with `--filter`:

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

To filter on fields without a dedicated flag, use `--filter` with the query syntax. Network flow logs support these fields:

- **String fields**: `@protocol`, `@direction`, `@peer`, `@peer_kind`, `@status`, `@drop_cause`, `@src`, `@dst`, and `@host`
- **Numeric fields**: `@port`
- **Boolean fields**: `@dropped`

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

### Compose typed and raw filters

```bash
railway logs --network --protocol tcp --filter "@drop_cause:NO_SOCKET"
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

Railway uses a query syntax for the `--filter` flag across all log types:

- **Text search**: `"error message"` or `user signup`
- **Attribute filters**: `@level:error`, `@level:warn`
- **Operators**: `AND`, `OR`, `-` (not)
- **Numeric operators**: `>`, `>=`, `<`, `<=`, and `..` for ranges (`@httpStatus:200..299`)

The fields available depend on the log type. See the filter fields listed under [HTTP logs](#http-logs) and [Network flow logs](#network-flow-logs). See [Logs](/observability/logs) for full syntax documentation.

## Related

- [railway ssh](/cli/ssh)
- [Logs](/observability/logs)
