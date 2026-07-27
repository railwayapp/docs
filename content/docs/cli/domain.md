---
title: railway domain
description: Add, list, inspect, update, or delete domains for a service.
---

Add, list, inspect, update, or delete domains for a service.

Running `railway domain` without a subcommand preserves the create behavior:
it generates a Railway-provided service domain when you don't pass `DOMAIN`, or
creates a custom domain when you do.

## Usage

```bash
railway domain [OPTIONS] [DOMAIN] [COMMAND]
```

## Subcommands

| Subcommand | Aliases | Description |
|------------|---------|-------------|
| `list` | `ls` | List domains for a service |
| `status` | | Show status and DNS details for a domain |
| `delete` | `remove`, `rm` | Delete a custom or service domain |
| `update` | `edit` | Update a domain |
| `certificate retry` | | Retry certificate issuance for a custom domain |

## Options

| Flag | Description |
|------|-------------|
| `-p, --port <PORT>` | Port to connect to the domain when creating a domain |
| `-s, --service <SERVICE>` | Service to manage domains for |
| `-e, --environment <ENVIRONMENT>` | Environment to use |
| `--project <PROJECT_ID>` | Project ID to use |
| `--json` | Output in JSON format |

## Examples

### Generate a Railway domain

```bash
railway domain
```

Creates a free `*.up.railway.app` domain for your service.

### Add a custom domain

```bash
railway domain example.com
```

Returns the required DNS records to configure.

### Add domain with specific port

```bash
railway domain example.com --port 8080
```

### Add domain to specific service

```bash
railway domain example.com --service api
```

### List service domains

```bash
railway domain list --service api
```

Lists Railway-provided and custom domains for the selected service and
environment.

### Show domain status

```bash
railway domain status example.com
```

Shows domain status and DNS details. The identifier can be a domain name, URL,
or domain ID.

### Update domain target port

```bash
railway domain update example.com --port 8080
```

Updates the target port that HTTP traffic routes to for the selected domain.

### Rename a Railway-provided domain

```bash
railway domain update old-name.up.railway.app --domain new-name
```

Renames a Railway-provided service domain. The `--domain` value can be a full
service domain or a host label.

### Retry certificate issuance

```bash
railway domain certificate retry example.com
```

Retries certificate issuance for a custom domain after you fix DNS or
certificate validation issues.

### Delete a domain

```bash
railway domain delete example.com --yes
```

Deletes a custom or service domain. Omit `--yes` to confirm interactively.

## Options for `update`

Use `railway domain update` with at least one setting flag.

| Flag | Description |
|------|-------------|
| `--port <PORT>` | Target port to route HTTP traffic to |
| `--domain <DOMAIN>` | Rename a Railway-provided service domain |

## Arguments for `status`, `delete`, `update`, and `certificate retry`

| Argument | Description |
|----------|-------------|
| `<DOMAIN_OR_ID>` | Domain name, URL, or domain ID |

## Options for `delete`

| Flag | Description |
|------|-------------|
| `-y, --yes` | Skip confirmation |

## Custom domain setup

When adding a custom domain, the CLI displays the required DNS records: a
`CNAME` record and a `TXT` record. Both are required. The `CNAME` routes
traffic, and the `TXT` verifies domain ownership. Add both to your DNS provider
exactly as shown in the CLI output.

Requests to the domain will return a `404` until the `TXT` record is in place and Railway has verified ownership.

DNS changes can take up to 72 hours to propagate worldwide.

## Limits

- One Railway-provided domain per service
- Multiple custom domains can be added per service

## Related

- [Domains](/networking/domains)
- [Public networking](/networking/public-networking)
- [railway service](/cli/service)
