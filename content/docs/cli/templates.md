---
title: railway templates
description: Discover Railway templates from the CLI.
---

Discover published Railway templates from the CLI. The `templates` command groups
subcommands for finding templates that you can deploy from the dashboard or
through the Railway API.

You can also call the command as `railway template`. Both forms behave
identically.

## Usage

```bash
railway templates <COMMAND>
```

## Subcommands

| Subcommand | Aliases | Description |
|------------|---------|-------------|
| `search` | `find`, `list`, `ls` | Search published templates. |

## railway templates search

Search published Railway templates. The command works in two modes:

- In a terminal (TTY), it opens a command-palette-style picker that updates as you type.
- Outside a terminal, or when `--json` is set, it prints results to stdout for use in scripts and agents.

The picker is seeded with the optional `QUERY` argument. Pressing Enter selects
the highlighted template. The command does not require authentication.

### Usage

```bash
railway templates search [OPTIONS] [QUERY]
```

### Arguments

| Argument | Description |
|----------|-------------|
| `QUERY` | Search term. Seeds the picker in TTY mode. |

### Options

| Flag | Description |
|------|-------------|
| `--json` | Print results as JSON. Disables the interactive picker. |
| `--limit <LIMIT>` | Number of results to request. Defaults to `20`. Maximum `50`. |
| `--after <CURSOR>` | Fetch the next page using `pageInfo.endCursor` from a previous response. |
| `--category <CATEGORY>` | Filter by template category. |
| `--verified <BOOL>` | Filter by verification state. Accepts `true` or `false`. |

### Examples

#### Open the interactive picker

```bash
railway templates search
```

#### Search with a seed query

```bash
railway templates search postgres
```

#### Filter to verified templates

```bash
railway templates search --verified true
```

#### Filter by category

```bash
railway templates search --category databases
```

#### Print results as JSON

```bash
railway templates search --json postgres
```

#### Paginate through results

```bash
railway templates search --limit 50 --after <CURSOR> postgres
```

Use the `endCursor` value from the previous JSON response as the next `--after`
value.

## Related

- [Templates](/templates)
- [railway init](/cli/init)
