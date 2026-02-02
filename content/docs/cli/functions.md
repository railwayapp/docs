---
title: railway functions
description: Manage project functions.
---

Manage serverless functions in your Railway project.

## Usage

```bash
railway functions <COMMAND> [OPTIONS]
```

## Aliases

- `railway function`
- `railway func`
- `railway fn`
- `railway funcs`
- `railway fns`

## Subcommands

| Subcommand | Aliases | Description |
|------------|---------|-------------|
| `list` | `ls` | List functions |
| `new` | `create` | Add a new function |
| `delete` | `remove`, `rm` | Delete a function |
| `push` | `up` | Push changes to a function |
| `pull` | | Pull changes from a linked function |
| `link` | | Link a function manually |

## Examples

### List Functions

```bash
railway functions list
```

### Create a New Function

```bash
railway functions new --path ./my-function.ts --name my-function
```

### Create an HTTP Function

```bash
railway functions new --path ./api.ts --name api --http
```

### Create a Cron Function

```bash
railway functions new --path ./job.ts --name cleanup --cron "0 * * * *"
```

### Push Changes

```bash
railway functions push
```

### Push with Watch Mode

```bash
railway functions push --watch
```

### Pull Remote Changes

```bash
railway functions pull
```

### Delete a Function

```bash
railway functions delete --function my-function
```

### Link a Function

```bash
railway functions link --function my-function --path ./local-function.ts
```

## Options for `new`

| Flag | Description |
|------|-------------|
| `-p, --path <PATH>` | Path to the function file |
| `-n, --name <NAME>` | Name of the function |
| `-c, --cron <SCHEDULE>` | Cron schedule for the function |
| `--http` | Generate a domain for HTTP access |
| `-s, --serverless` | Enable serverless mode (sleeping) |
| `-w, --watch` | Watch for changes and deploy on save |

## Options for `push`

| Flag | Description |
|------|-------------|
| `-p, --path <PATH>` | Path to the function |
| `-w, --watch` | Watch for changes and deploy on save |

## Options for `delete`

| Flag | Description |
|------|-------------|
| `-f, --function <FUNCTION>` | ID or name of the function to delete |
| `-y, --yes` | Skip confirmation dialog |

## Common Options

| Flag | Description |
|------|-------------|
| `-e, --environment <ENV>` | Environment ID or name |

## Related

- [Functions](/functions)
