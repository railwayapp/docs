---
title: Public Networking
description: Expose your Railway services to the internet.
---

Public networking allows you to expose your Railway services to the internet via HTTP/HTTPS. Railway provides automatic SSL certificates, Railway-provided domains, and support for custom domains.

## Key features

- **Automatic SSL** - Free SSL certificates automatically provisioned and renewed
- **Railway Domains** - Get a `.railway.app` domain instantly
- **Custom Domains** - Bring your own domain with easy DNS configuration
- **Global Edge Network** - Traffic routed through Railway's edge network

## Learn more

| Topic | Description |
| ----- | ----------- |
| [**Domains**](/networking/domains) | Configure Railway-provided domains and custom domains for your services. Learn about DNS setup, SSL certificates, and domain management. |
| [**Specs & Limits**](/networking/public-networking/specs-and-limits) | Understand request limits, timeouts, and other specifications for public networking. |

## Quick start

To expose a service to the internet:

1. Go to your service's **Settings**
2. Find **Networking → Public Networking**
3. Click **Generate Domain** to get a Railway-provided domain

Or configure a custom domain by adding a CNAME record pointing to your Railway-provided domain.

See [Domains](/networking/domains) for complete setup instructions.
