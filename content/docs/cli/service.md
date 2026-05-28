---
title: railway service
description: Manage services.
---

Link a service to the current project and manage service operations.

## Usage

```bash
railway service [SERVICE] [COMMAND]
```

## Subcommands

| Subcommand | Aliases | Description |
|------------|---------|-------------|
| `list` | `ls` | List services in the current environment |
| `link` | | Link a service to the current project |
| `delete` | `remove`, `rm` | Delete a service from an environment |
| `status` | | Show deployment status for services |
| `logs` | | View logs from a service |
| `redeploy` | | Redeploy the latest deployment |
| `restart` | | Restart the latest deployment |
| `scale` | | Scale a service across regions |
| `files` | `file` | Manage files in a service filesystem |

## Examples

### Link a service (interactive)

```bash
railway service
```

Prompts you to select a service to link.

### Link a specific service

```bash
railway service backend
```

### Show service status

```bash
railway service status
```

### Show all services status

```bash
railway service status --all
```

### View service logs

```bash
railway service logs
```

### Redeploy service

```bash
railway service redeploy
```

### Restart service

```bash
railway service restart
```

### Scale service

```bash
railway service scale us-west=2
```

### Browse service files

```bash
railway service files browse /app
```

Opens an interactive TUI for browsing, downloading, uploading, editing, renaming, and deleting files in the service filesystem.

### List service files

```bash
railway service files list /app
```

### Download a file from a service

```bash
railway service files download /app/data.db ./data.db
```

### Upload a file to a service

```bash
railway service files upload ./seed.db /app/seed.db
```

### Rename a file in a service

```bash
railway service files rename /app/data.db /app/data-old.db
```

### Delete a file from a service

```bash
railway service files delete /app/data.db
```

## Options for `status`

| Flag | Description |
|------|-------------|
| `-a, --all` | Show status for all services in the environment |
| `--json` | Output in JSON format |

## Options for `logs`

| Flag | Description |
|------|-------------|
| `-d, --deployment` | Show deployment logs |
| `-b, --build` | Show build logs |
| `-n, --lines <N>` | Number of log lines to fetch (disables streaming) |
| `-f, --filter <QUERY>` | Filter logs using Railway's query syntax |
| `--latest` | Show logs from latest deployment (even if failed/building) |
| `-S, --since <TIME>` | Show logs since a specific time |
| `-U, --until <TIME>` | Show logs until a specific time |
| `--json` | Output logs in JSON format |

See [railway logs](/cli/logs) for detailed usage and examples.

## Options for `redeploy`

| Flag | Description |
|------|-------------|
| `-y, --yes` | Skip confirmation dialog |
| `--json` | Output in JSON format |

## Options for `restart`

| Flag | Description |
|------|-------------|
| `-y, --yes` | Skip confirmation dialog |
| `--json` | Output in JSON format |

## Options for `scale`

| Argument | Description |
|----------|-------------|
| `REGION=REPLICAS` | One or more replica assignments by region. |

| Flag | Description |
|------|-------------|
| `--json` | Output in JSON format |

See [railway scale](/cli/scale) for available regions and detailed usage.

## Manage files

Use `railway service files` to manage files in a running service filesystem. The command uses the linked service by default. Pass `--service`, `--environment`, or `--project` to select a different target.

| Subcommand | Aliases | Description |
|------------|---------|-------------|
| `list` | `ls` | List files in a directory |
| `browse` | `browser` | Browse files interactively |
| `download` | | Download a file or directory |
| `upload` | | Upload a file or directory |
| `delete` | `rm`, `remove` | Delete a file |
| `rename` | `mv` | Rename a file |

### Options for `files`

| Flag | Description |
|------|-------------|
| `-s, --service <SERVICE>` | Service name or ID |
| `-e, --environment <ENVIRONMENT>` | Environment to use |
| `-p, --project <PROJECT_ID>` | Project ID to use |

### Options for `files list`

| Argument or flag | Description |
|------------------|-------------|
| `[REMOTE_PATH]` | Directory path to list. Defaults to `/` |
| `--json` | Output in JSON format |

### Options for `files download`

| Argument or flag | Description |
|------------------|-------------|
| `<REMOTE_PATH>` | Remote file or directory to download |
| `[LOCAL_PATH]` | Local destination. Defaults to the current directory |
| `--overwrite`, `--override` | Replace the local path if it already exists |
| `--concurrency <N>` | Concurrent file downloads when downloading a directory. Defaults to `32` |
| `--json` | Output in JSON format |

### Options for `files upload`

| Argument or flag | Description |
|------------------|-------------|
| `<LOCAL_PATH>` | Local file or directory to upload |
| `<REMOTE_PATH>` | Remote destination path |
| `--overwrite` | Replace the remote path if it already exists |
| `--concurrency <N>` | Concurrent file uploads when uploading a directory. Defaults to `32` |
| `--json` | Output in JSON format |

### Options for `files delete`

| Argument or flag | Description |
|------------------|-------------|
| `<REMOTE_PATH>` | Remote file to delete |
| `-y, --yes` | Skip confirmation |
| `--json` | Output in JSON format |

`railway service files delete` refuses to run when invoked by an AI agent and must be run by a human.

### Options for `files rename`

| Argument or flag | Description |
|------------------|-------------|
| `<OLD_REMOTE_PATH>` | Existing remote path |
| `<NEW_REMOTE_PATH>` | New remote path |
| `--json` | Output in JSON format |

### Options for `files browse`

| Argument or flag | Description |
|------------------|-------------|
| `[REMOTE_PATH]` | Directory path to open. Defaults to `/` |
| `--editor <COMMAND>` | Editor command to use when editing files |
| `--concurrency <N>` | Concurrent file downloads. Defaults to `32` |

## Related

- [railway add](/cli/add)
- [railway link](/cli/link)
- [railway logs](/cli/logs)
