---
title: railway trace
description: Turn tracing on or off for a service in an environment, check its status, and read traces from the CLI.
---

Manage [tracing](/observability/tracing) for the services of an environment and inspect their traces. `railway trace` changes the same settings as the **Tracing setup** panel on the Traces page and lists the same traces.

**Note:** Tracing is a preview feature under active development.

## Usage

```bash
railway trace <COMMAND> [OPTIONS]
```

## Aliases

- `railway traces`
- `railway tracing`

## Subcommands

| Subcommand | Aliases | Description |
|------------|---------|-------------|
| `enable` | | Turn tracing on for a service in the environment, or for every service with `--all` |
| `disable` | | Turn tracing off for a service in the environment, or for every service with `--all` |
| `status` | | Show tracing settings and when spans were last exported |
| `list` | `ls` | List traces, newest first |
| `get` | `show` | Show the spans of one trace as a tree |

## Options

These options apply to every subcommand:

| Flag | Description |
|------|-------------|
| `-s, --service <SERVICE>` | Service name or ID (defaults to the linked service) |
| `-e, --environment <ENV>` | Environment to use (defaults to the linked environment) |
| `-p, --project <PROJECT_ID>` | Project to use (defaults to the linked project) |
| `--json` | Output in JSON format |

Tracing is set per service and environment, so every subcommand works in one environment: the linked one, or the one you pass with `--environment`. When you pass `--project`, pass `--environment` as well.

Changing tracing needs a user or workspace token. A [project token](/integrations/api#project-token) set as `RAILWAY_TOKEN` can run `status`, `list`, and `get`, but not `enable` or `disable`.

## Examples

### Show tracing status

```bash
railway trace status
```

Prints, for the linked service in the linked environment, whether it's traced, whether automatic instrumentation is on and active, and when the edge and the app last exported a span.

### Show status for every service

```bash
railway trace status --all
```

### Enable tracing for a service

```bash
railway trace enable --service api
```

Turns tracing on for the service in the linked environment. The edge starts tracing requests to the service's domains within seconds. An app that runs an OpenTelemetry SDK gets the [provided variables](/observability/tracing#provided-variables) on its next deploy.

### Enable tracing with automatic instrumentation

```bash
railway trace enable --auto-instrument
```

Turns on tracing and [automatic instrumentation](/observability/tracing/automatic-instrumentation) for the service in one step. Railway instruments the running processes within about a minute, with no redeploy.

### Enable tracing for every service in an environment

```bash
railway trace enable --all --environment staging
```

Turns tracing on for every service in `staging`. Add `--auto-instrument` to switch automatic instrumentation on for all of them as well.

### Disable tracing for a service

```bash
railway trace disable
```

Turns tracing off for the linked service in the linked environment. Add `--auto-instrument` to turn automatic instrumentation off with it, or `--all` to turn tracing off for every service in the environment.

### List recent traces

```bash
railway trace list --since 30m --errors
```

Lists traces of the linked service from the last 30 minutes that contain at least one span with an error status, newest first. Each row shows when the trace started, its duration, the number of spans and errors, the root span, and the trace ID.

### List traces across the environment with a filter

```bash
railway trace list --all --filter '@http.route:/api/users @duration:>500'
```

`--all` lists traces of every service in the environment. `--filter` takes the same syntax as the Traces page and [`railway logs`](/cli/logs): keywords, `@field:value` pairs, `AND`, `OR`, and `-` for negation. See [Search traces](/observability/tracing#search-traces) for the built-in fields.

### Show one trace

```bash
railway trace get 4bf92f3577b34da6a3ce929d0e0e4736
```

Prints every span of the trace as an indented tree, with each span's name, the component and service that exported it, its duration, and its status. Get the ID from `railway trace list`, from the `x-railway-trace-id` response header, or from the Traces page.

### JSON output

```bash
railway trace list --json
railway trace get 4bf92f3577b34da6a3ce929d0e0e4736 --json
```

`list --json` prints one trace summary per line and `get --json` one span per line, as newline-delimited JSON like `railway logs --json`. Each span includes its attributes, resource attributes, events, and links. `status`, `enable`, and `disable` print a single JSON document with the environment and the state of each service.

## Options for `enable`

| Flag | Description |
|------|-------------|
| `--auto-instrument` | Also turn on automatic instrumentation for the service |
| `-a, --all` | Change every service in the environment instead of one. Conflicts with `--service` |

## Options for `disable`

| Flag | Description |
|------|-------------|
| `--auto-instrument` | Also turn off automatic instrumentation for the service |
| `-a, --all` | Change every service in the environment instead of one. Conflicts with `--service` |

## Options for `status`

| Flag | Description |
|------|-------------|
| `-a, --all` | Show every service in the environment. Conflicts with `--service` |

## Options for `list`

| Flag | Description |
|------|-------------|
| `-a, --all` | List traces of every service in the environment. Conflicts with `--service` |
| `-f, --filter <QUERY>` | Filter expression over spans, for example `@status:error @http.route:/api/users` |
| `--errors` | Only traces with an error span. Adds `@status:error` to the filter |
| `-S, --since <TIME>` | Start of the time window. Relative (`30m`, `2h`, `1d`) or ISO 8601. Defaults to `1h` |
| `-U, --until <TIME>` | End of the time window, same formats as `--since`. Defaults to now |
| `-n, --limit <N>` | Maximum number of traces to return, from 1 to 500. Defaults to 100 |

## Options for `get`

| Argument or flag | Description |
|------------------|-------------|
| `<TRACE_ID>` | W3C trace ID, 32 hexadecimal characters. Required |
| `--max-spans <N>` | Maximum number of spans to return, oldest first. Defaults to 1000, at most 2000 |

## Related

- [Tracing](/observability/tracing)
- [Automatic instrumentation](/observability/tracing/automatic-instrumentation)
- [railway logs](/cli/logs)
- [railway metrics](/cli/metrics)
