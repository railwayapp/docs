---
title: railway delete
description: Delete a project.
---

Permanently delete a Railway project.

## Usage

```bash
railway delete [OPTIONS]
```

## Options

| Flag | Description |
|------|-------------|
| `-p, --project <ID\|NAME>` | Project to delete |
| `-y, --yes` | Skip confirmation dialog |
| `--2fa-code <CODE>` | 2FA code for verification (if 2FA is enabled) |
| `--json` | Output in JSON format |

## Examples

### Interactive Deletion

```bash
railway delete
```

Prompts you to select a project and confirm deletion.

### Delete Specific Project

```bash
railway delete --project my-old-project
```

### Skip Confirmation

```bash
railway delete --project my-old-project --yes
```

### With 2FA Code

```bash
railway delete --project my-project --yes --2fa-code 123456
```

## Warning

This action is **permanent** and cannot be undone. All services, deployments, and data within the project will be deleted.

## Related

- [railway init](/cli/init)
- [railway list](/cli/list)
