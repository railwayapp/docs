---
title: railway link
description: Associate an existing project with the current directory.
---

Link an existing Railway project to the current directory. Once linked, commands like `railway up` and `railway logs` will target this project.

## Usage

```bash
railway link [OPTIONS]
```

## Options

| Flag | Description |
|------|-------------|
| `-p, --project <ID\|NAME>` | Project to link to |
| `-e, --environment <ID\|NAME>` | Environment to link to |
| `-s, --service <ID\|NAME>` | Service to link to |
| `-w, --workspace <ID\|NAME>` | Workspace to link to |
| `-t, --team <ID\|NAME>` | Team to link to (deprecated, use `--workspace`) |
| `--json` | Output in JSON format |

## Examples

### Interactive Linking

```bash
railway link
```

Prompts you to select a workspace, project, environment, and optionally a service.

### Link to Specific Project

```bash
railway link --project my-api
```

### Link to Specific Environment

```bash
railway link --project my-api --environment staging
```

### Link to Specific Service

```bash
railway link --project my-api --service backend
```

### Non-Interactive (CI/CD)

```bash
railway link --project abc123 --environment def456 --json
```

## How It Works

Railway stores the link configuration in a `.railway` directory in your project root. This file is typically added to `.gitignore`.

The link includes:
- Project ID
- Environment ID
- Service ID (optional)

## Related

- [railway unlink](/cli/unlink)
- [railway init](/cli/init)
- [railway status](/cli/status)
