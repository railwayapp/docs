---
title: railway cdn
description: Manage CDN caching for a service.
---

Manage CDN caching settings for a service.

CDN caching requires an applied public domain. Add a Railway-provided or custom
domain before you enable CDN caching.

## Usage

```bash
railway cdn <COMMAND> [OPTIONS]
```

## Subcommands

| Subcommand | Description |
|------------|-------------|
| `status` | Show CDN settings for a service |
| `enable` | Enable CDN caching |
| `disable` | Disable CDN caching |
| `update` | Update CDN caching settings |
| `purge` | Purge cached content |

## Options

| Flag | Description |
|------|-------------|
| `-s, --service <SERVICE>` | Service name or ID |
| `-e, --environment <ENVIRONMENT>` | Environment to use |
| `-p, --project <PROJECT_ID>` | Project ID to use |
| `--json` | Output in JSON format |

## Examples

### Show CDN settings

```bash
railway cdn status --service web
```

Shows whether CDN caching is available and enabled for the selected service.

### Enable CDN caching

```bash
railway cdn enable --service web
```

Enables CDN caching with Railway's default settings.

### Configure HTML caching and TTL

```bash
railway cdn update \
  --html-caching force \
  --default-ttl 4h
```

Sets HTML caching to `force` and the fallback TTL to 4 hours.

### Configure stale-while-revalidate

```bash
railway cdn update --no-swr
```

Disables honoring `stale-while-revalidate` directives from your service.

### Configure purge on deploy

```bash
railway cdn update --purge-on-deploy all
```

Clears all cached content after each successful deploy.

### Purge cached HTML

```bash
railway cdn purge html
```

Clears cached HTML responses and leaves static assets in place.

### Purge all cached content

```bash
railway cdn purge all
```

Clears all cached content for the service.

### Disable CDN caching

```bash
railway cdn disable --service web
```

Disables CDN caching for the selected service.

## Options for `update`

Use `railway cdn update` with one or more setting flags.

| Flag | Description |
|------|-------------|
| `--html-caching <auto\|force\|never>` | Controls when HTML responses are cached |
| `--default-ttl <TTL>` | Fallback TTL: `30m`, `1h`, `2h`, `4h`, `12h`, `1d`, or matching seconds |
| `--swr` | Honor `stale-while-revalidate` directives |
| `--no-swr` | Ignore `stale-while-revalidate` directives |
| `--purge-on-deploy <off\|html\|all>` | Configure automatic cache purge after successful deploys |

## Arguments for `purge`

| Argument | Description |
|----------|-------------|
| `<html\|all>` | Cache scope to purge |

## Related

- [CDN](/networking/cdn)
- [Domains](/networking/domains)
- [railway domain](/cli/domain)
- [railway service](/cli/service)
