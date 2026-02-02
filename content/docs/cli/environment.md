---
title: railway environment
description: Manage environments.
---

Create, delete, edit, or link an environment.

## Usage

```bash
railway environment [ENVIRONMENT] [COMMAND]
```

## Aliases

- `railway env`

## Subcommands

| Subcommand | Description |
|------------|-------------|
| `link` | Link an environment to the current project |
| `new` | Create a new environment |
| `delete` | Delete an environment |
| `edit` | Edit an environment's configuration |
| `config` | Show environment configuration |

## Examples

### Link an Environment (Interactive)

```bash
railway environment
```

### Link a Specific Environment

```bash
railway environment staging
```

### Create a New Environment

```bash
railway environment new staging
```

### Duplicate an Environment

```bash
railway environment new staging --duplicate production
```

Or using the alias:

```bash
railway environment new staging --copy production
```

### Delete an Environment

```bash
railway environment delete staging
```

### Edit Environment Configuration

```bash
railway environment edit --service-config backend variables.API_KEY.value "secret"
```

### Show Environment Configuration

```bash
railway environment config
```

## Options for `new`

| Flag | Description |
|------|-------------|
| `-d, --duplicate <ENV>` | Environment to duplicate (alias: `--copy`) |
| `--json` | Output in JSON format |

## Options for `delete`

| Flag | Description |
|------|-------------|
| `-y, --yes` | Skip confirmation dialog |
| `--2fa-code <CODE>` | 2FA code for verification |
| `--json` | Output in JSON format |

## Options for `edit`

| Flag | Description |
|------|-------------|
| `-e, --environment <ENV>` | Environment to edit |
| `-s, --service-config <SERVICE> <PATH> <VALUE>` | Configure a service using dot-path notation |
| `-m, --message <MSG>` | Commit message for the changes |
| `--stage` | Stage changes without committing |
| `--json` | Output in JSON format |

### Dot-Path Notation for `--service-config`

The `--service-config` flag uses dot-path notation to specify nested configuration values:

```bash
# Set a variable value
railway environment edit --service-config backend variables.API_KEY.value "secret"

# Set a service configuration
railway environment edit --service-config api buildCommand "npm run build"
```

The format is: `--service-config <SERVICE_NAME> <DOT.PATH.TO.PROPERTY> <VALUE>`

## Options for `config`

| Flag | Description |
|------|-------------|
| `-e, --environment <ENV>` | Environment to show configuration for (defaults to linked environment) |
| `--json` | Output in JSON format |

### Config Examples

Show configuration for the current environment:

```bash
railway environment config
```

Show configuration for a specific environment:

```bash
railway environment config --environment staging
```

Output as JSON:

```bash
railway environment config --json
```

## Related

- [railway link](/cli/link)
- [Environments](/environments)
