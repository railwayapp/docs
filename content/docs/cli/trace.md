---
title: railway trace
description: Turn tracing on or off for a service or project, check its status, and read traces from the CLI.
---

Manage [tracing](/observability/tracing) for a service or project and inspect its traces. `railway trace` changes the same settings as the **Tracing setup** panel on the Traces page and lists the same traces.

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
| `enable` | | Turn tracing on for a service, or for the project default with `--project-default` |
| `disable` | | Turn tracing off for a service, or for the project default with `--project-default` |
| `inherit` | | Clear a service's tracing override so it follows the project default again |
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

Tracing is a service-wide setting, not a per-environment one, so `enable`, `disable`, and `inherit` ignore `--environment`. `status`, `list`, and `get` read spans, which belong to an environment, so they use the linked environment or the one you pass. When you pass `--project`, pass `--environment` as well.

Changing tracing needs a user or workspace token. A [project token](/integrations/api#project-token) set as `RAILWAY_TOKEN` can run `status`, `list`, and `get`, but not `enable`, `disable`, or `inherit`.

## Examples

### Show tracing status

```bash
railway trace status
```

Prints the project default (tracing on or off, and the sample rate) and, for the linked service, whether it's traced, whether the setting is pinned or follows the project, whether automatic instrumentation is on, and when the edge and the app last exported a span.

### Show status for every service

```bash
railway trace status --all
```

### Enable tracing for a service

```bash
railway trace enable --service api
```

Pins tracing on for the service regardless of the project default. The edge starts tracing requests to the service's domains within seconds. An app that runs an OpenTelemetry SDK gets the [provided variables](/observability/tracing#provided-variables) on its next deploy.

### Enable tracing with automatic instrumentation

```bash
railway trace enable --auto-instrument
```

Turns on tracing and [automatic instrumentation](/observability/tracing/automatic-instrumentation) for the service in one step. Railway instruments the running processes within about a minute, with no redeploy.

### Enable tracing for the whole project

```bash
railway trace enable --project-default --sample-rate 0.25
```

Turns on the project default, so every service without an override is traced, and sets the sample rate to 25% of client-facing requests. Omit `--sample-rate` to keep the current rate. The rate is a fraction from 0 to 1 on the command line and a percentage in the dashboard.

### Disable tracing for a service

```bash
railway trace disable
```

Pins tracing off for the linked service. Add `--auto-instrument` to turn automatic instrumentation off with it, or `--project-default` to turn off the project default instead.

### Follow the project default again

```bash
railway trace inherit
```

Clears the service's override. The service is traced when the project default is on and not traced when it's off.

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

`list --json` prints one trace summary per line and `get --json` one span per line, as newline-delimited JSON like `railway logs --json`. Each span includes its attributes, resource attributes, events, and links. `status`, `enable`, `disable`, and `inherit` print a single JSON document.

## Options for `enable`

| Flag | Description |
|------|-------------|
| `--auto-instrument` | Also turn on automatic instrumentation for the service. Conflicts with `--project-default` |
| `--project-default` | Change the project default instead of one service |
| `--sample-rate <RATE>` | Fraction of client-facing requests the edge traces, from 0 to 1. Requires `--project-default` |

## Options for `disable`

| Flag | Description |
|------|-------------|
| `--auto-instrument` | Also turn off automatic instrumentation for the service. Conflicts with `--project-default` |
| `--project-default` | Change the project default instead of one service |

## Options for `status`

| Flag | Description |
|------|-------------|
| `-a, --all` | Show every service in the project. Conflicts with `--service` |

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
