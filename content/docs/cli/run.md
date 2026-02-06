---
title: railway run
description: Run a local command using variables from the active environment.
---

Execute a command locally with environment variables from your Railway service injected.

## Usage

```bash
railway run [OPTIONS] <COMMAND> [ARGS...]
```

## Aliases

- `railway local`

## Options

| Flag | Description |
|------|-------------|
| `-s, --service <SERVICE>` | Service to pull variables from (defaults to linked service) |
| `-e, --environment <ENV>` | Environment to pull variables from (defaults to linked environment) |
| `-p, --project <ID>` | Project ID to use (defaults to linked project) |
| `--no-local` | Skip local develop overrides |
| `-v, --verbose` | Show verbose domain replacement info |

## Examples

### Run a Node.js app

```bash
railway run npm start
```

### Run a Python script

```bash
railway run python main.py
```

### Run with specific service variables

```bash
railway run --service backend npm start
```

### Run database migrations

```bash
railway run npx prisma migrate deploy
```

### Access a repl

```bash
railway run rails console
railway run python
```

## How it works

1. Fetches environment variables from the specified Railway service
2. Injects them into the command's environment
3. Executes the command

This is useful for:
- Running your app locally with production/staging variables
- Running database migrations
- Accessing REPLs with the correct environment

## Exit codes

The command exits with the same code as the executed command.

## Related

- [railway shell](/cli/shell)
- [railway dev](/cli/dev)
