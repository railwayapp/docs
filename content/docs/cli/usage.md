---
title: railway usage
description: Inspect workspace usage and manage compute and agent usage limits.
---

Inspect workspace and project costs for a billing period, and manage compute
and agent usage limits.

## Usage

Run `railway usage` without a subcommand for a workspace summary.

```bash
railway usage [OPTIONS] [COMMAND]
```

| Command | Description |
|---------|-------------|
| `projects` | Show project-level or service-level usage |
| `limit` | Show or change compute and agent usage limits |

## Select a workspace

Pass `--workspace` with a workspace name or ID to select it explicitly.

```bash
railway usage --workspace Acme
```

Without this flag, the CLI uses the workspace that owns the linked project. If
the directory isn't linked, it uses your only workspace or prompts you to
choose one. Non-interactive sessions with multiple workspaces must pass
`--workspace`.

## Inspect workspace usage

The workspace summary shows the billing period, current usage, current bill,
estimated bill, resource line items, and compute usage limits.

```bash
railway usage
railway usage --period previous
railway usage --period 2026-07 --json
```

| Flag | Description |
|------|-------------|
| `--workspace <WORKSPACE>` | Workspace name or ID |
| `--period <PERIOD>` | `current`, `previous`, or `YYYY-MM`. Defaults to `current` |
| `--json` | Output in JSON format |

Historical usage is available for the last 90 days. The CLI rejects future
billing periods. Estimated bill and usage-limit fields apply to the current
period.

## Inspect usage by project

Use `usage projects` to rank projects by cost for the selected billing period.

```bash
railway usage projects
railway usage projects --limit 10
```

Human-readable output shows the top 25 projects by default and combines the
remainder into an "Other projects" row. JSON output returns every project
unless you pass `--limit`.

| Flag | Description |
|------|-------------|
| `--project <PROJECT>` | Show a service-level breakdown for one project name or ID |
| `--period <PERIOD>` | `current`, `previous`, or `YYYY-MM` |
| `--limit <COUNT>` | Maximum projects to return. Can't be combined with `--project` |
| `--workspace <WORKSPACE>` | Workspace name or ID |
| `--json` | Output in JSON format |

Select one project to show its CPU, memory, egress, volume, backup, and total
cost by service:

```bash
railway usage projects --project api --period previous
```

## Inspect usage limits

Usage limits track compute and Railway Agent spend independently. Without a
target, the status command shows both.

```bash
railway usage limit status
railway usage limit status --target workspace
railway usage limit status --target agent
```

The `--target` values are `workspace` for compute usage and `agent` for
Railway Agent usage.

## Set workspace compute limits

Set a custom email alert, a hard limit, or both for compute usage. Workspace
amounts must use whole dollars.

```bash
railway usage limit set \
  --target workspace \
  --soft 75 \
  --hard 125
```

| Flag | Description |
|------|-------------|
| `--target workspace` | Required target for `set` |
| `--soft <DOLLARS>` | Email alert. Use `0` or a whole-dollar value from `$5` to `$500,000` |
| `--hard <DOLLARS>` | Hard limit. Use `0` or a whole-dollar value from `$10` to `$500,000` |

The hard limit must be greater than or equal to the email alert when both are
non-zero. Omitted values preserve an existing threshold.

The `update` command is a compatibility shortcut for workspace compute limits:

```bash
railway usage limit update --soft 100
```

Remove workspace compute limits with confirmation:

```bash
railway usage limit remove
railway usage limit remove --yes
```

Non-interactive sessions must pass `--yes` to remove a compute limit.

## Set agent usage limits

Agent limits accept dollar amounts with up to two decimal places. A hard limit
is required because agent usage limits can't be removed.

```bash
railway usage limit set \
  --target agent \
  --soft 7.50 \
  --hard 20
```

| Flag | Description |
|------|-------------|
| `--target agent` | Required target for `set` |
| `--soft <DOLLARS>` | Optional email alert with cent-level precision |
| `--hard <DOLLARS>` | Required hard limit with cent-level precision |

The hard limit must be greater than or equal to the email alert and can't
exceed `$500,000`. Set `--hard 0` to block additional agent usage.

## Use commands in automation

Pass `--json` to summaries, project breakdowns, and limit commands for stable
machine-readable output. JSON mode doesn't print progress spinners.

The `--period` flag applies only to usage summaries and project breakdowns. It
isn't accepted by usage limit commands.

## Related

These pages explain usage reporting, limits, and Railway plans.

- [Project usage](/projects/project-usage)
- [Cost control](/pricing/cost-control)
- [Pricing plans](/pricing/plans)
