---
title: railway volume
description: Manage project volumes.
---

Manage persistent storage volumes for your services.

## Usage

```bash
railway volume <COMMAND> [OPTIONS]
```

## Subcommands

| Subcommand | Aliases | Description |
|------------|---------|-------------|
| `list` | `ls` | List volumes |
| `add` | `create` | Add a new volume |
| `delete` | `remove`, `rm` | Delete a volume |
| `update` | `edit` | Update a volume |
| `detach` | | Detach a volume from a service |
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

## Common options

| Flag | Description |
|------|-------------|
| `-s, --service <SERVICE>` | Service ID |
| `-e, --environment <ENV>` | Environment ID |
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

## Related

- [Volumes](/volumes)
