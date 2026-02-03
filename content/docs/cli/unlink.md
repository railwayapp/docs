---
title: railway unlink
description: Disassociate project from current directory.
---

Remove the link between the current directory and a Railway project or service.

## Usage

```bash
railway unlink [OPTIONS]
```

## Options

| Flag | Description |
|------|-------------|
| `-s, --service` | Unlink only the service (keep project link) |
| `-y, --yes` | Skip confirmation prompt |
| `--json` | Output in JSON format |

## Examples

### Unlink project

```bash
railway unlink
```

Removes the entire project link from the current directory.

### Unlink service only

```bash
railway unlink --service
```

Keeps the project and environment link but removes the service association.

### Skip confirmation

```bash
railway unlink --yes
```

Useful for scripts and automation.

## Related

- [railway link](/cli/link)
- [railway status](/cli/status)
