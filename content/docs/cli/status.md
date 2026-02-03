---
title: railway status
description: Show information about the current project.
---

Display information about the currently linked project, environment, and service.

## Usage

```bash
railway status [OPTIONS]
```

## Options

| Flag | Description |
|------|-------------|
| `--json` | Output in JSON format |

## Examples

### Show current status

```bash
railway status
```

Output:
```
Project: my-api
Environment: production
Service: backend
```

### JSON output

```bash
railway status --json
```

Returns detailed project information including all services and environments.

## Related

- [railway link](/cli/link)
- [railway open](/cli/open)
