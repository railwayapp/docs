---
title: railway cron
description: View recent runs of a cron service or trigger one off-schedule.
---

View recent runs of a [cron service](/cron-jobs) or trigger a run outside its
schedule. The command group mirrors the Cron Runs tab in the dashboard.

## Usage

```bash
railway cron <COMMAND> [OPTIONS]
```

## Subcommands

| Subcommand | Aliases | Description |
|------------|---------|-------------|
| `list` | `ls`, `runs` | List recent runs with status, start time, and duration |
| `run` | `trigger` | Trigger an off-schedule run of a cron service now |

Both subcommands target the linked service by default. Pass `--service`,
`--environment`, or `--project` to pick another. The target service must have a
cron schedule, either set in the service settings or declared under `deploy` in
a [config file](/config-as-code/reference). Otherwise the command exits with an
error:

```
Service worker has no cron schedule in environment production
```

## railway cron list

List the most recent runs of a cron service, newest first.

```bash
railway cron list [OPTIONS]
```

### Options for `list`

| Flag | Description |
|------|-------------|
| `-s, --service <SERVICE>` | Service name or ID (defaults to linked service) |
| `-e, --environment <ENV>` | Environment (defaults to linked environment) |
| `-p, --project <PROJECT>` | Project ID or name (defaults to linked project) |
| `--limit <N>` | Maximum number of runs to show (default: 20, max: 1000) |
| `--json` | Output in JSON format |

### List recent runs

```bash
railway cron list
```

Output:

```
Cron runs for worker in production
Schedule: 0 0 * * * (at 00:00), next run in 14 hours

  STARTED                     STATUS        DURATION      DEPLOYMENT
  2026-10-12 02:01:53 +02:00  EXITED        7s            9830309c-4c34-47c5-8841-ddb872e77b07
  2026-10-11 02:02:21 +02:00  EXITED        8s            9830309c-4c34-47c5-8841-ddb872e77b07
  2026-10-10 02:04:19 +02:00  EXITED        9s            9830309c-4c34-47c5-8841-ddb872e77b07

Logs for a run: railway logs -s worker --since 2026-10-12T00:01:53Z --until 2026-10-12T00:02:02Z
```

Start times are shown in your local time zone. The header describes the
schedule in words and shows when the next run is due. A run that is still in
progress shows its elapsed time with a `so far` suffix. A run that was skipped
because the previous one was still running shows `previous run still running`
next to the deployment ID.

The last line is a ready-to-run [railway logs](/cli/logs) command for the
latest completed run. It uses the run's start and end time, with the end
rounded up to the next whole second, so the output covers exactly that run.

### List runs for another service

```bash
railway cron list --service worker --environment production --limit 50
```

### List runs in JSON format

```bash
railway cron list --json
```

Prints an array of runs, newest first:

```json
[
  {
    "id": "0d3b5e6a-2b6c-4ab0-9d6e-7f1c3a9e2b45",
    "deploymentId": "9830309c-4c34-47c5-8841-ddb872e77b07",
    "status": "EXITED",
    "createdAt": "2026-10-12T00:01:53.000Z",
    "completedAt": "2026-10-12T00:02:01.000Z",
    "durationSeconds": 8,
    "meta": {}
  }
]
```

`durationSeconds` and `completedAt` are `null` while a run is still in
progress. `meta` holds the deployment metadata recorded for the run.

Useful for scripting:

```bash
# Status of the latest run
railway cron list --json --limit 1 | jq -r '.[0].status'

# Fail if any of the last 20 runs crashed
railway cron list --json | jq -e 'all(.status != "CRASHED")'
```

### Run statuses

| Status | Description |
|--------|-------------|
| `EXITED` | The run finished and the process exited |
| `CRASHED` | The run exited with an error |
| `RUNNING` | The run is in progress |
| `SKIPPED` | The run was skipped because the previous run was still in progress |
| `CREATED`, `INITIALIZING`, `RESTARTING` | The run is starting up |
| `STOPPED`, `REMOVED`, `REMOVING` | The run was stopped or its deployment was removed |

See [service execution requirements](/cron-jobs#service-execution-requirements)
for why runs get skipped.

## railway cron run

Trigger an off-schedule run of a cron service. The run shows up in
`railway cron list` alongside scheduled runs.

```bash
railway cron run [OPTIONS]
```

### Options for `run`

| Flag | Description |
|------|-------------|
| `-s, --service <SERVICE>` | Service name or ID (defaults to linked service) |
| `-e, --environment <ENV>` | Environment (defaults to linked environment) |
| `-p, --project <PROJECT>` | Project ID or name (defaults to linked project) |
| `-y, --yes` | Skip confirmation dialog |
| `--json` | Output in JSON format |

### Trigger a run

```bash
railway cron run
```

The command asks for confirmation, then enqueues the run:

```
Cron run enqueued for worker. It can take a few minutes to appear in `railway cron list`.
```

### Skip confirmation

```bash
railway cron run --service worker --yes
```

The command requires `--yes` when stdout is not a terminal, for example in CI
or when piped. Without it, the command exits with an error instead of
prompting.

### Trigger a run in JSON format

```bash
railway cron run --yes --json
```

Output:

```json
{"success": true}
```

## Related

- [Cron jobs](/cron-jobs)
- [railway logs](/cli/logs)
- [railway deployment](/cli/deployment)
- [railway redeploy](/cli/redeploy)
