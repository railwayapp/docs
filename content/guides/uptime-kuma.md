---
title: Self-Host Uptime Kuma for Uptime Monitoring
description: Deploy Uptime Kuma on Railway with a volume for persistent monitor history. Monitor public sites and internal services, and publish status pages.
date: "2026-07-29"
tags:
  - uptime-kuma
  - monitoring
  - docker
  - self-hosted
topic: integrations
---

[Uptime Kuma](https://github.com/louislam/uptime-kuma) is an open-source uptime monitoring tool. It checks your sites and services on an interval (HTTP, TCP, ping, DNS, and more), records response times, sends alerts through 90+ notification providers, and publishes public status pages. It is a lightweight alternative to hosted monitoring services, and the monitoring data stays in your own database.

Uptime Kuma runs as a single container with a SQLite database, so deploying it on Railway takes only one service, built from the official Docker image, plus a volume so your monitors and history survive redeploys.

## What you will set up

- An Uptime Kuma instance running from the official Docker image
- Persistent storage via a Railway [Volume](/volumes)
- A public domain for the dashboard and status pages
- Optional monitoring of other Railway services over [private networking](/networking/private-networking)

## One-click deploy from a template

Railway has an Uptime Kuma template that provisions the service and volume in one step.

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/deploy/uptime-kuma)

After deploying, skip to [Create your admin account](#create-your-admin-account).

To set it up manually instead, continue with the steps below.

## Deploy from a Docker image

1. Create a new project in Railway.
2. Click **+ New** and select **Docker Image**.
3. Enter `louislam/uptime-kuma:1` as the image name and press Enter.
4. Railway pulls the image and creates the service.

Pinning the major version tag (`1`) is safer than `latest`. For images hosted on Docker Hub or GitHub Container Registry, Railway can also check for new versions and redeploy the service during a maintenance window you choose; enable this under **Settings → Source → Configure Auto Updates**. See [image auto updates](/deployments/image-auto-updates).

## Attach a volume before first use

Uptime Kuma stores everything in `/app/data`: the SQLite database, your monitors, notification settings, and uptime history. Without a volume, all of it is lost on every deployment.

1. Right-click the project canvas and select **Volume**, or use the Command Palette (`⌘K`).
2. Connect the volume to the Uptime Kuma service.
3. Set the mount path to `/app/data`.

Attach the volume before you create your admin account. If you configure Uptime Kuma first and add the volume later, the container restarts with an empty data directory and you start over.

## Generate a public domain

1. Open the **Settings** tab of the service.
2. Under **Networking**, click **Generate Domain**.

Uptime Kuma listens on port 3001. Railway detects that automatically and sets it as the domain's target port, so you get a domain like `uptime-kuma-production.up.railway.app`.

## Create your admin account

Open the generated domain in your browser. On first load, Uptime Kuma prompts you to create an admin username and password. Do this immediately: until an account exists, anyone with the URL can claim the instance.

## Add your first monitor

1. Click **Add New Monitor**.
2. Choose a monitor type. **HTTP(s)** is the most common: it requests a URL on an interval and alerts when the response fails or is too slow.
3. Enter the URL, check interval, and retry settings.
4. Click **Save**.

The dashboard charts response time and uptime percentage per monitor, and that history accumulates in the volume-backed database.

## Monitor other Railway services privately

Services in the same project and environment can reach each other at `<service>.railway.internal` without public exposure. Use this to monitor internal services that have no public domain:

1. In Uptime Kuma, add an **HTTP(s)** or **TCP** monitor.
2. Point it at the internal hostname and the port your service listens on, for example `http://api.railway.internal:8080/health`.

Private networking is scoped per environment. An Uptime Kuma instance in your `production` environment can only reach other services in `production`.

## Set up notifications

Uptime Kuma configures notifications in the UI, not through environment variables. Go to **Settings → Notifications** and add a provider: Slack, Discord, Telegram, email (SMTP), PagerDuty, webhooks, and dozens more. Attach the notification to individual monitors or set it as a default for all of them.

## Publish a status page

Uptime Kuma serves public status pages from the same domain. Go to **Status Pages**, create a page, and pick which monitors it shows. The page is available at `https://<your-domain>/status/<slug>` and is safe to share: it exposes only the monitors you select, not the admin dashboard.

## Keep the service always on

Do not enable [serverless](/deployments/serverless) for this service. A monitor is only useful if it runs continuously. In practice Uptime Kuma's own outbound checks would prevent sleep anyway, but there is no reason to opt a monitoring service into it.

Uptime Kuma is a single-instance application backed by SQLite. Run exactly one replica. Expect roughly 512 MB of RAM for a typical instance; Railway bills for the memory and CPU the service actually uses.

## Next steps

- [Use volumes](/volumes): Manage the persistent storage backing your monitor history.
- [Back up your volume](/volumes/backups): Schedule backups of the Uptime Kuma database.
- [Set up a custom domain](/networking/domains): Serve your status page from your own domain.
- [Configure health checks](/deployments/healthchecks): Add deploy-time health checks to the services Uptime Kuma watches.
