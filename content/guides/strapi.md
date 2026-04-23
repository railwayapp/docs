---
title: Self-host Strapi with Postgres and File Uploads
description: Deploy Strapi on Railway with a Postgres database and persistent file storage. Covers one-click template deployment, environment configuration, and upload provider setup.
date: "2026-04-14"
tags:
  - deployment
  - frontend
  - strapi
  - cms
topic: integrations
---

<a href="https://strapi.io" target="_blank">Strapi</a> is an open-source headless CMS that provides an admin panel for content management and a REST/GraphQL API for delivering content to frontends. It supports custom content types, role-based access, and plugin extensions.

This guide covers deploying Strapi on Railway with a Postgres database and persistent file storage.

## What you will set up

- A Strapi instance with the admin panel
- A Postgres database for content storage
- Persistent file uploads via a Railway [Volume](/volumes) or [Storage Bucket](/storage-buckets)
- A public domain for the API and admin panel

## One-click deploy from a template

Railway has a Strapi template that provisions the full setup:

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/new/template/strapi)

After deploying, generate a domain for the Strapi service and open `/admin` to create your first admin user.

It is recommended to [eject from the template](/templates/deploy#eject-from-template-repository) to get a copy of the repository on your own GitHub account.

If you prefer to set things up manually, continue with the steps below.

## Deploy manually

### 1. Create a new Strapi project

```bash
npx create-strapi@latest my-strapi-app
```

Select Postgres as the database during setup. Push the project to a GitHub repository.

### 2. Create the Railway project and database

1. Create a new [project](/projects) on Railway.
2. Add a [PostgreSQL](/databases/postgresql) database: click **+ New**, then **Database**, then **PostgreSQL**.
3. Deploy the Strapi app: click **+ New**, then **GitHub Repo**, and select your repository.

### 3. Configure environment variables

Add the following variables to the Strapi service:

```
DATABASE_CLIENT=postgres
DATABASE_HOST=${{Postgres.PGHOST}}
DATABASE_PORT=${{Postgres.PGPORT}}
DATABASE_NAME=${{Postgres.PGDATABASE}}
DATABASE_USERNAME=${{Postgres.PGUSER}}
DATABASE_PASSWORD=${{Postgres.PGPASSWORD}}
DATABASE_SSL=true
NODE_ENV=production
```

Generate the required secret keys and add them:

```
APP_KEYS=<generate four comma-separated random strings>
API_TOKEN_SALT=<generate a random string>
ADMIN_JWT_SECRET=<generate a random string>
JWT_SECRET=<generate a random string>
```

Generate random strings with:

```bash
openssl rand -base64 32
```

### 4. Generate a domain

Navigate to **Networking** in the service settings and [generate a domain](/networking/public-networking#railway-provided-domain). Open `https://your-domain.railway.app/admin` to access the admin panel.

## Persistent file storage

By default, Strapi stores uploaded files on the local filesystem. On Railway, the filesystem is [ephemeral](/deployments/reference), meaning uploads are lost on each deploy.

### Option 1: Railway Volume

Attach a [Volume](/volumes) to the Strapi service mounted at `/app/public/uploads`. Files persist across deploys.

1. In your Strapi service, go to **Settings**, then **Volumes**.
2. Add a volume with the mount path `/app/public/uploads`.

This is the simplest option. The tradeoff is that volumes are tied to a single service instance.

### Option 2: Storage Bucket (S3-compatible)

For production use, configure Strapi's S3 upload provider with a Railway [Storage Bucket](/storage-buckets):

1. Create a bucket in your Railway project.
2. Install the S3 upload provider:

```bash
npm install @strapi/provider-upload-aws-s3
```

3. Configure `config/plugins.js`:

```javascript
module.exports = {
  upload: {
    config: {
      provider: 'aws-s3',
      providerOptions: {
        s3Options: {
          credentials: {
            accessKeyId: process.env.BUCKET_ACCESS_KEY_ID,
            secretAccessKey: process.env.BUCKET_SECRET_ACCESS_KEY,
          },
          endpoint: process.env.BUCKET_ENDPOINT,
          region: 'auto',
          params: {
            Bucket: process.env.BUCKET_NAME,
          },
        },
      },
    },
  },
};
```

4. Add the bucket credentials to your Strapi service variables.

## Connecting a frontend

Strapi exposes a REST API at `/api` and an optional GraphQL API via a plugin. Point your frontend to the Strapi service's public domain:

```javascript
const response = await fetch('https://your-strapi.railway.app/api/articles');
const { data } = await response.json();
```

If your frontend runs in the same Railway project, use [private networking](/networking/private-networking) instead:

```javascript
const response = await fetch('http://strapi.railway.internal:1337/api/articles');
```

## Next steps

- [Storage Buckets](/storage-buckets) - Configure S3-compatible storage.
- [Volumes](/volumes) - Attach persistent storage to a service.
- [Private Networking](/networking/private-networking) - Connect frontend and CMS internally.
- [Manage environment variables](/guides/frontend-environment-variables) - Handle API URLs across services.
