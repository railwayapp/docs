---
title: railway status
description: Show information about the linked project, environment, and resources.
---

Display information about the linked project, environment, and resources.

In its default form, `railway status` prints a project overview that includes
the workspace, project, environment, the linked service, and grouped sections
for every resource in the linked environment.

## Usage

```bash
railway status [OPTIONS]
```

## Options

| Flag | Description |
|------|-------------|
| `--json` | Output in JSON format. |

## Output

The default output groups information into sections:

- Workspace, project, and environment context, including IDs and unmerged change counts.
- The linked service, rendered with the same card used by `railway service list`.
- All resources in the linked environment, grouped by type:
  - Services
  - Databases
  - Volumes (detached volumes are listed here)
  - Functions
  - Cron jobs (with schedule and next run time)
  - Buckets

For each service, the output includes deployment status, replica counts,
volumes, and the regions the service runs in.

## Examples

### Show the project overview

```bash
railway status
```

### Output the full project as JSON

```bash
railway status --json
```

`--json` returns the raw project payload, including services, environments,
and resources. The shape of `--json` output is unchanged from earlier versions
of the CLI.

## Related

- [railway link](/cli/link)
- [railway service](/cli/service)
- [railway open](/cli/open)
