---
title: Self-host Ghost with MySQL and Custom Themes
description: Deploy Ghost on Railway from the official Docker image with a MySQL database, persistent content storage, and custom domain configuration.
date: "2026-04-14"
tags:
  - deployment
  - frontend
  - ghost
  - cms
topic: integrations
---

<a href="https://ghost.org" target="_blank">Ghost</a> is an open-source publishing platform for blogs, newsletters, and membership sites. It includes a visual editor, built-in SEO, membership and subscription management, and a theme system.

This guide covers deploying Ghost on Railway from the official Docker image with a MySQL database and persistent content storage.

## What you will set up

- A Ghost instance from the official Docker image
- A MySQL database for content storage
- Persistent storage via a Railway [Volume](/volumes) for themes, images, and settings
- A public domain with SSL for the Ghost site and admin panel

## One-click deploy from a template

Railway has a Ghost template:

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/new/template/ghost)

After deploying, generate a domain and update the `url` environment variable to match. Open `/ghost` to access the admin panel.

If you prefer to set things up manually, continue with the steps below.

## Deploy manually

### 1. Create the project and database

1. Create a new [project](/projects) on Railway.
2. Add a MySQL database: click **+ New**, then **Database**, then **MySQL**.

Ghost requires MySQL. It does not support Postgres.

### 2. Deploy the Ghost Docker image

1. Click **+ New**, then **Docker Image**.
2. Enter `ghost:5-alpine` as the image name.

### 3. Configure environment variables

Add the following variables to the Ghost service:

```
database__client=mysql
database__connection__host=${{MySQL.MYSQLHOST}}
database__connection__port=${{MySQL.MYSQLPORT}}
database__connection__database=${{MySQL.MYSQLDATABASE}}
database__connection__user=${{MySQL.MYSQLUSER}}
database__connection__password=${{MySQL.MYSQLPASSWORD}}
url=https://your-domain.railway.app
NODE_ENV=production
```

Ghost uses double-underscore (`__`) notation for nested configuration. Set the `url` variable after generating a domain in the next step.

### 4. Add persistent storage

Ghost stores themes, images, and other content in `/var/lib/ghost/content`. This directory must persist across deploys.

1. In the Ghost service, go to **Settings**, then **Volumes**.
2. Add a volume with the mount path `/var/lib/ghost/content`.

Without a volume, all uploaded images and custom themes are lost on each deploy.

### 5. Generate a domain

Navigate to **Networking** in the service settings and [generate a domain](/networking/public-networking#railway-provided-domain). Update the `url` variable to match (e.g., `https://your-blog.railway.app`).

The `url` variable must include the full URL with `https://`. Ghost uses it to generate absolute links for posts, images, and the admin panel.

Open `https://your-domain.railway.app/ghost` to create your admin account.

## Custom domain

To use your own domain:

1. [Add a custom domain](/networking/domains/working-with-domains) to the Ghost service in Railway.
2. Update the `url` variable to match your custom domain (e.g., `https://blog.example.com`).
3. Railway provisions an SSL certificate automatically.

## Custom themes

Ghost ships with a default theme (Casper). To use a custom theme:

**Option 1: Upload via admin panel.** Go to `Settings > Design > Change theme > Upload theme` in the Ghost admin. Themes uploaded this way are stored in the content volume and persist across deploys.

**Option 2: Build into the Docker image.** Create a Dockerfile that copies your theme into the Ghost image:

```dockerfile
FROM ghost:5-alpine

COPY ./my-theme /var/lib/ghost/content/themes/my-theme
```

Deploy this Dockerfile from a GitHub repository instead of using the public Docker image. The theme is built into the image and does not require a volume for persistence.

## Sending email

Ghost uses email for member sign-ups, newsletters, and password resets. Configure an SMTP provider by adding these variables:

```
mail__transport=SMTP
mail__options__host=smtp.mailgun.org
mail__options__port=587
mail__options__auth__user=<your SMTP username>
mail__options__auth__pass=<your SMTP password>
mail__from=noreply@yourdomain.com
```

Replace with your SMTP provider's credentials. Ghost supports Mailgun, SendGrid, and any SMTP service.

## Connecting a frontend

Ghost provides a Content API for headless use. Generate a Content API key in the Ghost admin under `Settings > Integrations`.

```javascript
const response = await fetch(
  'https://your-ghost.railway.app/ghost/api/content/posts/?key=YOUR_CONTENT_API_KEY'
);
const { posts } = await response.json();
```

For a full headless setup, use the <a href="https://ghost.org/docs/content-api/" target="_blank">Ghost Content API</a> with a separate frontend framework.

## Next steps

- [Volumes](/volumes) - Manage persistent storage.
- [Custom Domains](/networking/domains/working-with-domains) - Add your own domain with SSL.
- [Configure SPA routing](/guides/spa-routing-configuration) - If using a separate frontend with Ghost as an API.
