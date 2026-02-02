---
title: railway project
description: Manage projects.
---

Manage Railway projects with subcommands for listing, linking, and deleting.

## Usage

```bash
railway project <COMMAND>
```

## Subcommands

| Subcommand | Aliases | Description |
|------------|---------|-------------|
| `list` | `ls` | List all projects in your account |
| `link` | | Link a project to the current directory |
| `delete` | `rm`, `remove` | Delete a project |

## Examples

### List All Projects

```bash
railway project list
```

### Link a Project

```bash
railway project link
```

### Delete a Project

```bash
railway project delete --project my-old-project
```

## Related

- [railway init](/cli/init)
- [railway link](/cli/link)
- [railway list](/cli/list)
- [railway delete](/cli/delete)
