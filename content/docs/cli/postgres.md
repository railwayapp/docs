---
title: railway postgres
description: Manage PostgreSQL backups, point-in-time recovery, high availability, and connection pooling.
---

Manage PostgreSQL point-in-time recovery (PITR), volume backups, high
availability (HA), and PgBouncer connection pooling from the CLI.

## Usage

The `postgres` command groups database management actions under three feature
areas and keeps a local operation history.

```bash
railway postgres [OPTIONS] <COMMAND>
```

| Command | Description |
|---------|-------------|
| `pitr` | Manage continuous backups, restores, volume backups, and backup schedules |
| `ha` | Manage PostgreSQL HA clusters |
| `pgbouncer` | Manage PgBouncer connection pooling |
| `history` | Show the local audit trail of PostgreSQL operations |

## Target a database

Global selectors apply to PITR, HA, and PgBouncer commands. Without an explicit
selector, the CLI uses the linked project, environment, and service. The
`history` command reads the local audit trail and doesn't resolve a Railway
project.

| Flag | Description |
|------|-------------|
| `-s, --service <SERVICE>` | Service name or ID. Defaults to the linked service |
| `-e, --environment <ENVIRONMENT>` | Environment name or ID. Defaults to the linked environment |
| `-p, --project <PROJECT_ID>` | Project ID. Defaults to the linked project |
| `--json` | Output in JSON format |

PITR and HA require an official Railway PostgreSQL image:

- `ghcr.io/railwayapp-templates/postgres-ssl`
- `ghcr.io/railwayapp-templates/postgres-ha/postgres-patroni`

Use a major version tag, such as `:16`. Minor version tags, such as `:16.10`,
aren't supported, and HA conversion doesn't support `:latest`. Clear any
custom start command before enabling PITR or converting a standalone database
to HA.

## Manage point-in-time recovery

Use `railway postgres pitr` to inspect and configure continuous backups. The
same commands work with standalone PostgreSQL services and HA cluster roots.

| Command | Description |
|---------|-------------|
| `status` | Show configuration, restore coverage, and archiver health |
| `enable` | Enable PITR |
| `disable` | Disable PITR |
| `progress` | Show the rolling PITR workflow for an HA cluster |
| `cancel` | Cancel a stuck HA PITR workflow |
| `clear` | Clear a completed HA PITR workflow snapshot |
| `restore` | Restore to a timestamp in a new service |
| `backup` | Manage volume backups |
| `schedule` | Manage automatic volume backup schedules |

The live coverage section in `status` uses SSH to inspect the running
container. If the service isn't reachable, this section reports that the probe
is unavailable without failing the status command.

### Enable or disable PITR

Standalone services deploy the configuration change by default. Pass
`--no-deploy` to commit the change without deploying it.

```bash
railway postgres pitr enable --service postgres
railway postgres pitr disable --service postgres
```

| Flag | Command | Description |
|------|---------|-------------|
| `--no-deploy` | `enable`, `disable` | Commit without triggering a deployment |
| `-y, --yes` | `disable` | Skip the confirmation prompt |

For an HA cluster, enabling or disabling PITR runs a live rolling workflow.
The `--no-deploy` flag has no effect on that workflow.

Inspect the latest workflow once, or follow it until completion:

```bash
railway postgres pitr progress
railway postgres pitr progress --watch
```

### Restore to a timestamp

PITR restores create a sibling PostgreSQL service and leave the source service
unchanged.

```bash
railway postgres pitr restore \
  --service postgres \
  --at 2026-07-20T12:00:00Z
```

| Flag | Description |
|------|-------------|
| `--at <TIME>` | Required restore target |
| `--new-service-name <NAME>` | Name for the restored service |
| `--source-repo-path <PATH>` | Archive sub-prefix to use when multiple WAL histories exist |
| `-y, --yes` | Skip the confirmation prompt |

The restore target accepts RFC 3339, local `YYYY-MM-DD HH:MM[:SS]`, or a
relative duration such as `30m`, `2h`, `1d`, or `1w`.

### Manage volume backups

Volume backup commands operate on the volume attached to the selected database
root.

| Command | Description |
|---------|-------------|
| `backup list` | List backups |
| `backup create [--name <NAME>]` | Start an on-demand backup |
| `backup delete <IDS>... [-y]` | Delete one or more backups |
| `backup lock <ID>` | Remove a backup's expiration |
| `backup restore <ID> [-y]` | Restore a standalone database in place |

```bash
railway postgres pitr backup create \
  --service postgres \
  --name pre-migration
```

An in-place backup restore overwrites the selected database's data. The CLI
doesn't perform in-place backup restores on HA clusters because the replicas
would diverge. Use the Railway dashboard for an HA backup restore so Railway
can reseed the replicas.

### Manage backup schedules

Automatic volume backup schedules can retain daily, weekly, monthly, or any
combination of those backup types.

```bash
railway postgres pitr schedule set --daily --weekly
railway postgres pitr schedule list
```

Pass `--none` to remove every schedule without deleting existing backups:

```bash
railway postgres pitr schedule set --none
```

## Manage high availability

Use `railway postgres ha` to inspect, convert, scale, revert, or switch the
leader of an HA cluster.

| Command | Description |
|---------|-------------|
| `status` | Show cluster topology and live Patroni state |
| `convert` | Convert a standalone service to an HA cluster |
| `revert` | Revert an HA cluster to standalone PostgreSQL |
| `scale` | Change replica, coordinator, or edge counts |
| `switchover` | Promote a replica to leader. Alias: `promote` |

Convert a standalone database and choose the cluster size:

```bash
railway postgres ha convert \
  --service postgres \
  --replicas 2 \
  --coordinators 3 \
  --edge 1
```

| Flag | Commands | Description |
|------|----------|-------------|
| `--replicas <COUNT>` | `convert`, `scale` | Replica count, excluding the primary |
| `--coordinators <COUNT>` | `convert`, `scale` | Consensus node count. Must be odd |
| `--edge <COUNT>` | `convert`, `scale` | HAProxy edge count |
| `--no-deploy` | `convert`, `revert`, `scale` | Commit without triggering deployments |
| `-y, --yes` | `convert`, `revert`, `scale`, `switchover` | Skip the confirmation prompt |

Omitting a count during conversion keeps the template default. Scaling
requires at least one count.

Promote a replica with its service name or ID:

```bash
railway postgres ha switchover \
  --service postgres \
  --to postgres-replica-1
```

Switchover causes brief downtime. Before reverting to standalone PostgreSQL,
the selected root service must be the current Patroni leader.

## Manage PgBouncer

Use `railway postgres pgbouncer` with a standalone PostgreSQL service or an HA
cluster root. If you select a PgBouncer or HAProxy edge service, the CLI
resolves the database root automatically.

| Command | Description |
|---------|-------------|
| `status` | Show PgBouncer configuration and live pool utilization |
| `add` | Add PgBouncer in front of the database |
| `remove` | Remove PgBouncer |
| `configure` | Update pool mode and connection settings |
| `scale` | Change the PgBouncer replica count |

Add PgBouncer with transaction pooling:

```bash
railway postgres pgbouncer add \
  --service postgres \
  --pool-mode transaction
```

| Flag | Commands | Description |
|------|----------|-------------|
| `--pool-mode <MODE>` | `add`, `configure` | `transaction`, `session`, or `statement`. Defaults to `transaction` for `add` |
| `--max-client-conn <COUNT>` | `configure` | Maximum client connections |
| `--default-pool-size <COUNT>` | `configure` | Server connections per user and database pair |
| `--max-prepared-statements <COUNT>` | `configure` | Prepared statements per connection. `0` disables them |
| `--replicas <COUNT>` | `scale` | Target PgBouncer replica count |
| `--no-deploy` | `add`, `remove`, `configure`, `scale` | Commit without triggering deployments |
| `-y, --yes` | `add`, `remove` | Skip the confirmation prompt |

Configuration-changing commands deploy by default. With `--no-deploy`, the
change applies the next time each affected service deploys.

## Review operation history

Every PITR, HA, and PgBouncer invocation appends a best-effort record to a
local audit trail. The history includes the command, target, outcome, duration,
and error summary.

```bash
railway postgres history
railway postgres history --limit 10 --json
```

The CLI keeps the audit trail in `~/.railway/postgres-ops.jsonl` and prints the
latest 50 entries by default.

## Use commands in automation

Pass `--json` at any level below `railway postgres` for machine-readable
output. Commands that prompt for confirmation fail in a non-interactive
session unless you pass `--yes`.

## Related

These pages explain the PostgreSQL features managed by the command.

- [Point-in-Time Recovery](/volumes/point-in-time-recovery)
- [PostgreSQL high availability](/databases/postgresql-ha)
- [PostgreSQL connection pooling](/databases/postgresql-pgbouncer)
- [railway connect](/cli/connect)
