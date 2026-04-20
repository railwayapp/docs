---
title: railway domain
description: Add a domain to a service.
---

Add a custom domain or generate a Railway-provided domain for a service.

## Usage

```bash
railway domain [DOMAIN] [OPTIONS]
```

## Options

| Flag | Description |
|------|-------------|
| `-p, --port <PORT>` | The port to connect to the domain |
| `-s, --service <SERVICE>` | The service to add the domain to |
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

## Custom domain setup

When adding a custom domain, the CLI displays the required DNS records - a `CNAME` record and a `TXT` record. Both are required: the `CNAME` routes traffic and the `TXT` verifies domain ownership. Add both to your DNS provider exactly as shown in the CLI output.

Requests to the domain will return a `404` until the `TXT` record is in place and Railway has verified ownership.

DNS changes can take up to 72 hours to propagate worldwide.

## Limits

- One Railway-provided domain per service
- Multiple custom domains can be added per service

## Related

- [Domains](/networking/domains)
- [railway service](/cli/service)
