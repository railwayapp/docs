---
title: railway volume
description: Manage project volumes.
---

Manage persistent storage volumes for your services.

## Usage

```bash
railway volume <COMMAND> [OPTIONS]
```

## Aliases

- `railway volumes`

## Subcommands

| Subcommand | Aliases | Description |
|------------|---------|-------------|
| `list` | `ls` | List volumes |
| `add` | `create`, `new` | Add a new volume |
| `delete` | `remove`, `rm` | Delete a volume |
| `update` | `edit`, `rename` | Update a volume |
| `detach` | | Detach a volume from a service |
| `files` | `file` | Manage files in a volume |
| `browse` | `browser` | Browse files in a volume interactively |
| `attach` | | Attach a volume to a service |

## Examples

### List volumes

```bash
railway volume list
```

### Add a volume

```bash
railway volume add --mount-path /data
```

### Delete a volume

```bash
railway volume delete --volume my-volume
```

### Update volume mount path

```bash
railway volume update --volume my-volume --mount-path /new/path
```

### Rename a volume

```bash
railway volume update --volume my-volume --name new-name
```

### Detach volume from service

```bash
railway volume detach --volume my-volume
```

### Attach volume to service

```bash
railway volume attach --volume my-volume --service backend
```

### Browse volume files

```bash
railway volume browse /
```

Opens an interactive TUI for browsing, downloading, uploading, editing, renaming, and deleting files in the volume.

### List volume files

```bash
railway volume files list /
```

### Download a file from a volume

```bash
railway volume files download /backup.tar ./backup.tar
```

### Upload a file to a volume

```bash
railway volume files upload ./backup.tar /backup.tar
```

### Rename a file in a volume

```bash
railway volume files rename /backup.tar /backup-old.tar
```

### Delete a file from a volume

```bash
railway volume files delete /backup.tar
```

## Common options

| Flag | Description |
|------|-------------|
| `-s, --service <SERVICE>` | Service ID |
| `-e, --environment <ENV>` | Environment ID |
| `-p, --project <PROJECT_ID>` | Project ID |
| `--json` | Output in JSON format |

## Options for `add`

| Flag | Description |
|------|-------------|
| `-m, --mount-path <PATH>` | Mount path for the volume (must start with `/`) |

## Options for `delete`

| Flag | Description |
|------|-------------|
| `-v, --volume <VOLUME>` | Volume ID or name |
| `-y, --yes` | Skip confirmation |
| `--2fa-code <CODE>` | 2FA code for verification |

## Options for `update`

| Flag | Description |
|------|-------------|
| `-v, --volume <VOLUME>` | Volume ID or name |
| `-m, --mount-path <PATH>` | New mount path |
| `-n, --name <NAME>` | New name for the volume |

## Options for `detach`

| Flag | Description |
|------|-------------|
| `-v, --volume <VOLUME>` | Volume ID or name to detach |
| `-y, --yes` | Skip confirmation |
| `--json` | Output in JSON format |

## Options for `attach`

| Flag | Description |
|------|-------------|
| `-v, --volume <VOLUME>` | Volume ID or name to attach |
| `-y, --yes` | Skip confirmation |
| `--json` | Output in JSON format |

## Manage files

Use `railway volume files` to manage files in a volume from scripts or non-interactive workflows.

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
| `-v, --volume <VOLUME>` | Volume ID or name. Without this flag, the CLI prompts you to choose one |

The `-v, --volume` flag must be passed before the subcommand (for example, `railway volume files --volume data browse /`).

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

`railway volume files delete` refuses to run when invoked by an AI agent and must be run by a human.

### Options for `files rename`

| Argument or flag | Description |
|------------------|-------------|
| `<OLD_REMOTE_PATH>` | Existing remote path |
| `<NEW_REMOTE_PATH>` | New remote path |
| `--json` | Output in JSON format |

## Interactive file browser

The volume file browser TUI can be opened with either:

- `railway volume browse [REMOTE_PATH]` — top-level shortcut
- `railway volume files browse [REMOTE_PATH]` — equivalent through the `files` group

### Options for `browse`

| Argument or flag | Description |
|------------------|-------------|
| `[REMOTE_PATH]` | Directory path to open. Defaults to `/` |
| `-v, --volume <VOLUME>` | Volume ID or name to browse |
| `--editor <COMMAND>` | Editor command to use when editing files |
| `--concurrency <N>` | Concurrent file downloads. Defaults to `32` |

When using `railway volume files browse`, pass `--volume` on the `files` group (for example, `railway volume files --volume data browse /`). The `--editor` and `--concurrency` flags are passed on `browse` itself.

## Related

- [Volumes](/volumes)
