---
title: railway init
description: Create a new project.
---

Create a new Railway project and link it to the current directory.

## Usage

```bash
railway init [OPTIONS]
```

## Aliases

- `railway new`

## Options

| Flag | Description |
|------|-------------|
| `-n, --name <NAME>` | Project name (randomly generated if not provided) |
| `-w, --workspace <ID\|NAME>` | Workspace to create the project in |
| `--json` | Output in JSON format |

## Examples

### Interactive Project Creation

```bash
railway init
```

Prompts you to select a workspace and enter a project name.

### Create with Specific Name

```bash
railway init --name my-api
```

### Create in Specific Workspace

```bash
railway init --name my-api --workspace "My Team"
```

### Non-Interactive (CI/CD)

```bash
railway init --name my-api --workspace my-team-id --json
```

## Output

After creation, the project is automatically linked to your current directory. You can start deploying with `railway up`.

## Related

- [railway link](/cli/link)
- [railway up](/cli/up)
- [railway project](/cli/project)
