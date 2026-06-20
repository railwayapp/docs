---
title: railway waf
description: Manage WAF protection for a service.
---

Manage Under Attack Mode for a service.

Under Attack Mode requires an applied public domain. Add a Railway-provided or
custom domain before you enable it.

## Usage

```bash
railway waf under-attack <COMMAND> [OPTIONS]
```

## Subcommands

| Subcommand | Description |
|------------|-------------|
| `status` | Show Under Attack Mode status |
| `enable` | Enable Under Attack Mode |
| `disable` | Disable Under Attack Mode |

## Options

| Flag | Description |
|------|-------------|
| `-s, --service <SERVICE>` | Service name or ID |
| `-e, --environment <ENVIRONMENT>` | Environment to use |
| `-p, --project <PROJECT_ID>` | Project ID to use |
| `--json` | Output in JSON format |

## Examples

### Show Under Attack Mode status

```bash
railway waf under-attack status --service web
```

Shows whether Under Attack Mode is active for the selected service.

### Enable Under Attack Mode

```bash
railway waf under-attack enable --service web
```

Enables Under Attack Mode until you turn it off.

### Enable Under Attack Mode for a set duration

```bash
railway waf under-attack enable --service web --duration 1h
```

Enables Under Attack Mode for 1 hour.

### Disable Under Attack Mode

```bash
railway waf under-attack disable --service web
```

Disables Under Attack Mode for the selected service.

## Options for `enable`

Use `railway waf under-attack enable` with an optional duration.

| Flag | Description |
|------|-------------|
| `--duration <forever\|1h\|3h\|12h\|24h>` | How long Under Attack Mode stays active |

## Related

- [WAF](/networking/waf)
- [Domains](/networking/domains)
- [railway domain](/cli/domain)
- [railway service](/cli/service)
