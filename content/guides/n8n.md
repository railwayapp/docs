---
title: Self-host n8n
description: Deploy n8n on Railway with persistent storage and webhook configuration. Run your own workflow automation instance without managing servers.
date: "2026-03-30"
tags:
  - deployment
  - n8n
  - automation
  - docker
topic: integrations
---

<a href="https://n8n.io" target="_blank">n8n</a> is an open-source workflow automation tool that lets you connect APIs, services, and databases through a visual editor. It can be self-hosted, giving you full control over your data and workflows.

The steps below cover deploying n8n on Railway from the official Docker image, with persistent storage and webhook configuration.

## What you'll set up

- An n8n instance running from the official Docker image
- Persistent storage via a Railway [Volume](/volumes)
- Webhook URL configuration for external triggers
- A public domain for accessing the n8n editor

## One-click deploy from a template

Railway has an n8n template that provisions the full setup in one step.

Click the button below to deploy:

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/template/n8n)

After deploying, you can skip ahead to [Set up the webhook URL](#set-up-the-webhook-url) to configure webhooks for your instance.

If you prefer to set things up manually, continue with the steps below.

## Deploy from a Docker image

1. Create a new project in Railway.
2. Click **+ New** and select **Docker Image**.
3. Enter `n8nio/n8n` as the image name and press Enter.
4. Railway will pull the image and create a service.

The service will not yet be accessible from the internet. The following sections cover the configuration needed before your instance is ready.

## Configure environment variables

Add the following variables to your n8n service. You can do this from the **Variables** tab in the service settings.

**Required variables:**

| Variable | Value | Description |
| --- | --- | --- |
| `N8N_PORT` | `${{PORT}}` | Binds n8n to Railway's injected port |
| `N8N_PROTOCOL` | `https` | Sets the protocol for generated URLs |
| `WEBHOOK_URL` | `https://your-service.railway.app` | Full public URL for webhooks (update after generating a domain) |

**Recommended variables:**

| Variable | Value | Description |
| --- | --- | --- |
| `N8N_BASIC_AUTH_ACTIVE` | `true` | Enables basic auth on the n8n editor |
| `N8N_BASIC_AUTH_USER` | Your username | Username for basic auth |
| `N8N_BASIC_AUTH_PASSWORD` | Your password | Password for basic auth |
| `GENERIC_TIMEZONE` | e.g., `America/New_York` | Sets the timezone for scheduled workflows |

Set `N8N_BASIC_AUTH_ACTIVE`, `N8N_BASIC_AUTH_USER`, and `N8N_BASIC_AUTH_PASSWORD` to protect your instance. Without basic auth, anyone with the URL can access the editor and modify workflows.

## Attach persistent storage

n8n stores workflow definitions, credentials, and execution data in `/home/node/.n8n` by default. Without a volume, this data is lost on every deployment.

1. Open the n8n service in your project.
2. Go to the **Volumes** tab.
3. Click **Add Volume**.
4. Set the mount path to `/home/node/.n8n`.
5. Choose a size appropriate for your usage (1 GB is a reasonable starting point).
6. Click **Add**.

This volume preserves your n8n data across deployments and restarts. For more details, see the [Volumes documentation](/volumes).

## Set up a public domain

To access the n8n editor from your browser, generate a domain for the service:

1. Go to the **Settings** tab of the n8n service.
2. Under **Networking**, click **Generate Domain**.
3. Railway will assign a domain like `n8n-production-xxxx.up.railway.app`.

Open the domain in your browser to access the n8n editor.

## Set up the webhook URL

n8n needs to know its public URL to generate correct webhook endpoints. Without this, webhook trigger nodes will produce URLs that external services cannot reach.

1. Copy the domain generated in the previous step.
2. Go to the **Variables** tab of the n8n service.
3. Set `WEBHOOK_URL` to the full URL, including the protocol:
   ```plaintext
   WEBHOOK_URL=https://n8n-production-xxxx.up.railway.app
   ```
4. Redeploy the service for the change to take effect.

After this, any webhook trigger node in n8n will generate URLs using your Railway domain.

## Optional: Use Postgres instead of SQLite

By default, n8n uses SQLite and stores its database file in the volume at `/home/node/.n8n`. For production workloads with high execution volumes, you can switch to Postgres.

1. Add a Postgres database to your project by clicking **+ New** and selecting **Database > PostgreSQL**.
2. Add the following variables to the n8n service, using [reference variables](/variables#reference-variables) from the Postgres service:

   | Variable | Value |
   | --- | --- |
   | `DB_TYPE` | `postgresdb` |
   | `DB_POSTGRESDB_HOST` | `${{Postgres.PGHOST}}` |
   | `DB_POSTGRESDB_PORT` | `${{Postgres.PGPORT}}` |
   | `DB_POSTGRESDB_DATABASE` | `${{Postgres.PGDATABASE}}` |
   | `DB_POSTGRESDB_USER` | `${{Postgres.PGUSER}}` |
   | `DB_POSTGRESDB_PASSWORD` | `${{Postgres.PGPASSWORD}}` |

3. Redeploy the n8n service.

n8n will create the required tables on first connection. The volume is still needed for storing encryption keys and other local files.

## Next steps

- [Manage Volumes](/volumes) - Resize or back up your persistent storage.
- [Set up a custom domain](/networking/domains) - Use your own domain instead of the generated Railway domain.
- [Monitor your app](/observability) - View logs and metrics for your n8n instance.
- [Add a Database Service](/databases) - Explore other database options on Railway.
