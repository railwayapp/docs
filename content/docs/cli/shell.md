---
title: railway shell
description: Open a local subshell with Railway variables available.
---

Open a new shell session with environment variables from your Railway service available.

## Usage

```bash
railway shell [OPTIONS]
```

## Options

| Flag | Description |
|------|-------------|
| `-s, --service <SERVICE>` | Service to pull variables from (defaults to linked service) |
| `--silent` | Open shell without banner |

## Examples

### Open Shell with Variables

```bash
railway shell
```

Output:
```
Entering subshell with Railway variables available. Type 'exit' to exit.
```

### Shell for Specific Service

```bash
railway shell --service backend
```

### Silent Mode

```bash
railway shell --silent
```

## How It Works

1. Fetches environment variables from the specified Railway service
2. Opens a new shell with those variables in the environment
3. Sets `IN_RAILWAY_SHELL=true` to indicate you're in a Railway shell

Type `exit` to leave the shell and return to your normal environment.

## Shell Detection

On Windows, the CLI detects your current shell (PowerShell, cmd, pwsh) and opens the same type. On Unix systems, it uses the `$SHELL` environment variable.

## Difference from `railway run`

- **shell**: Opens an interactive shell session
- **run**: Executes a single command and exits

## Related

- [railway run](/cli/run)
- [railway dev](/cli/dev)
