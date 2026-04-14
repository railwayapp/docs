---
title: Self-host Payload CMS with Postgres
description: Deploy Payload CMS 3.x on Railway inside a Next.js application. Covers database setup, media storage with buckets, and production configuration.
date: "2026-04-14"
tags:
  - deployment
  - payload
  - cms
  - frontend
  - postgres
  - nextjs
topic: integrations
---

<a href="https://payloadcms.com" target="_blank">Payload CMS</a> is a TypeScript-native headless CMS that runs inside a Next.js application. Starting with version 3.0, Payload embeds directly in your Next.js app, sharing the same server, routes, and build process.

This guide covers deploying Payload CMS 3.x on Railway with a Postgres database and media storage.

## What you will set up

- A Payload CMS instance running inside Next.js
- A Postgres database for content storage
- Media uploads via a Railway [Storage Bucket](/storage-buckets)
- A public domain for the admin panel and API

## Create a Payload project

```bash
npx create-payload-app@latest my-payload-app
```

Select the Postgres database adapter and your preferred template during setup. Push the project to a GitHub repository.

## Deploy to Railway

### 1. Create the project and database

1. Create a new [project](/projects) on Railway.
2. Add a [PostgreSQL](/databases/postgresql) database: click **+ New**, then **Database**, then **PostgreSQL**.
3. Deploy the app: click **+ New**, then **GitHub Repo**, and select your repository.

### 2. Configure environment variables

Add the following variables to the Payload service:

```
DATABASE_URI=${{Postgres.DATABASE_URL}}
PAYLOAD_SECRET=<generate a random string>
NEXT_PUBLIC_SERVER_URL=https://your-domain.railway.app
```

Generate the secret with:

```bash
openssl rand -base64 32
```

Set `NEXT_PUBLIC_SERVER_URL` after generating a domain (next step). This variable tells Payload its public URL for generating links in the admin panel.

### 3. Configure standalone output

Set `output: "standalone"` in `next.config.js`:

```javascript
import { withPayload } from '@payloadcms/next/withPayload';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
};

export default withPayload(nextConfig);
```

### 4. Generate a domain

Navigate to **Networking** in the service settings and [generate a domain](/networking/public-networking#railway-provided-domain). Update the `NEXT_PUBLIC_SERVER_URL` variable to match the generated domain.

Open `https://your-domain.railway.app/admin` to create your first admin user.

## Media storage

By default, Payload stores media on the local filesystem, which is [ephemeral](/deployments/reference) on Railway. Configure an S3-compatible storage provider for persistent media.

1. Create a [Storage Bucket](/storage-buckets) in your Railway project.
2. Install the storage adapter:

```bash
npm install @payloadcms/storage-s3
```

3. Add the adapter to your Payload config:

```typescript
// payload.config.ts
import { s3Storage } from '@payloadcms/storage-s3';

export default buildConfig({
  plugins: [
    s3Storage({
      collections: { media: true },
      bucket: process.env.BUCKET_NAME!,
      config: {
        credentials: {
          accessKeyId: process.env.BUCKET_ACCESS_KEY_ID!,
          secretAccessKey: process.env.BUCKET_SECRET_ACCESS_KEY!,
        },
        endpoint: process.env.BUCKET_ENDPOINT,
        region: 'auto',
      },
    }),
  ],
  // ... rest of config
});
```

4. Add the bucket credentials to your service variables.

## Connecting a frontend

Payload exposes a REST API at `/api` and a GraphQL API at `/api/graphql`. Since Payload runs inside Next.js, you can also use Server Components to query content directly:

```tsx
// app/page.tsx
import { getPayload } from 'payload';
import config from '@payload-config';

export default async function Home() {
  const payload = await getPayload({ config });
  const posts = await payload.find({ collection: 'posts' });

  return (
    <ul>
      {posts.docs.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

For a separate frontend (e.g., a standalone React app), call the REST API:

```javascript
const response = await fetch('https://your-payload.railway.app/api/posts');
const { docs } = await response.json();
```

## Build memory

Payload with Next.js can be memory-intensive during builds, especially with many collections and plugins. If the build fails with an out-of-memory error, increase the Node.js heap size by adding this variable:

```
NODE_OPTIONS=--max-old-space-size=4096
```

## Next steps

- [Storage Buckets](/storage-buckets) - Configure media storage.
- [Next.js deployment guide](/guides/nextjs) - Additional Next.js deployment options.
- [Deploy a Full-Stack Next.js App](/guides/fullstack-nextjs) - Add background workers and more.
- [Manage environment variables](/guides/frontend-environment-variables) - Handle public vs server-only variables.
