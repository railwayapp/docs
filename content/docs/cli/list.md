---
title: railway list
description: List all projects in your Railway account.
---

List all projects across all workspaces in your Railway account.

## Usage

```bash
railway list [OPTIONS]
```

## Options

| Flag | Description |
|------|-------------|
| `--json` | Output in JSON format |

## Examples

### List All Projects

```bash
railway list
```

Output:
```
My Team
  my-api
  frontend-app

Personal
  side-project
```

The currently linked project is highlighted in purple.

### JSON Output

```bash
railway list --json
```

Returns an array of all projects with their workspace information.

## Related

- [railway link](/cli/link)
- [railway init](/cli/init)
- [railway project](/cli/project)
