---
title: railway variable
description: Manage environment variables.
---

Manage environment variables for a service.

## Usage

```bash
railway variable [COMMAND] [OPTIONS]
```

## Aliases

- `railway variables`
- `railway vars`
- `railway var`

## Subcommands

| Subcommand | Aliases | Description |
|------------|---------|-------------|
| `list` | `ls` | List variables for a service |
| `set` | | Set a variable |
| `delete` | `rm`, `remove` | Delete a variable |

## Examples

### List Variables

```bash
railway variable list
```

### List in Key-Value Format

```bash
railway variable list --kv
```

Output:
```
DATABASE_URL=postgres://...
API_KEY=secret123
```

### Set a Variable

```bash
railway variable set API_KEY=secret123
```

### Set Multiple Variables

```bash
railway variable set API_KEY=secret123 DEBUG=true
```

### Set Variable from stdin

```bash
echo "my-secret-value" | railway variable set SECRET_KEY --stdin
```

### Delete a Variable

```bash
railway variable delete API_KEY
```

## Options for `list`

| Flag | Description |
|------|-------------|
| `-s, --service <SERVICE>` | Service to list variables for |
| `-e, --environment <ENV>` | Environment to list variables from |
| `-k, --kv` | Show variables in KEY=VALUE format |
| `--json` | Output in JSON format |

## Options for `set`

| Flag | Description |
|------|-------------|
| `-s, --service <SERVICE>` | Service to set the variable for |
| `-e, --environment <ENV>` | Environment to set the variable in |
| `--stdin` | Read value from stdin (use with single KEY) |
| `--skip-deploys` | Skip triggering deploys |
| `--json` | Output in JSON format |

## Options for `delete`

| Flag | Description |
|------|-------------|
| `-s, --service <SERVICE>` | Service to delete the variable from |
| `-e, --environment <ENV>` | Environment to delete the variable from |
| `--json` | Output in JSON format |

## Legacy Flags

The following flags are deprecated but still supported:

```bash
# Deprecated: use 'railway variable set KEY=VALUE' instead
railway variable --set KEY=VALUE

# Deprecated: use 'railway variable set KEY --stdin' instead
railway variable --set-from-stdin KEY
```

## Related

- [Variables](/variables)
- [railway run](/cli/run)
