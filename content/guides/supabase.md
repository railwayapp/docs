---
title: Self-host Supabase with Postgres, Auth, and Storage
description: Deploy the Supabase stack on Railway with Postgres, GoTrue auth, PostgREST API, storage, and the Studio dashboard. Covers multi-service setup and JWT configuration.
date: "2026-04-14"
tags:
  - deployment
  - supabase
  - postgres
  - authentication
  - frontend
topic: integrations
---

<a href="https://supabase.com" target="_blank">Supabase</a> is an open-source alternative to Firebase that provides a Postgres database, authentication, instant APIs, storage, and a real-time engine. Self-hosting gives you full control over your data and infrastructure.

This guide covers deploying the Supabase stack on Railway as multiple services in a single project.

## What you will deploy

The Supabase stack consists of several services:

- **Postgres** stores all application data and user accounts.
- **GoTrue** handles authentication (sign-up, sign-in, OAuth, magic links).
- **PostgREST** generates a REST API from your Postgres schema automatically.
- **Storage API** handles file uploads and serves files from an S3-compatible backend.
- **Studio** is the browser-based dashboard for managing your project.
- **Kong** or **API Gateway** routes requests to the correct service.

All services run in one Railway project and communicate over [private networking](/networking/private-networking).

## One-click deploy from a template

Railway has a community Supabase template that provisions the full stack:

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/new/template/supabase)

This sets up all required services and wires them together. After deploying, generate domains for the API gateway and Studio services.

It is recommended to [eject from the template](/templates/deploy#eject-from-template-repository) to get a copy of the configuration on your own GitHub account.

If you prefer to understand the architecture or customize the setup, continue reading.

## Architecture

The Supabase stack routes all client requests through an API gateway (Kong or a custom router). The gateway forwards requests to the appropriate service based on the URL path:

| Path | Service | Purpose |
|---|---|---|
| `/auth/v1/*` | GoTrue | Authentication endpoints |
| `/rest/v1/*` | PostgREST | Auto-generated REST API |
| `/storage/v1/*` | Storage API | File upload and download |
| `/realtime/v1/*` | Realtime | WebSocket subscriptions |

Each service connects to Postgres over private networking. The API gateway is the only service that needs a public domain.

## JWT configuration

All Supabase services authenticate requests using JWTs signed with a shared secret. You need two keys:

- **`anon` key**: a JWT with the `anon` role. Used by the client library for unauthenticated requests. Safe to expose in frontend code.
- **`service_role` key**: a JWT with the `service_role` role. Bypasses Row Level Security. Must be kept server-side only.

Generate these keys using the JWT secret you configure on all services. Use <a href="https://supabase.com/docs/guides/self-hosting#api-keys" target="_blank">Supabase's key generation guide</a> to create them.

Set the following variables on all Supabase services:

```
JWT_SECRET=<your-jwt-secret>
ANON_KEY=<generated-anon-jwt>
SERVICE_ROLE_KEY=<generated-service-role-jwt>
```

## Connecting from a frontend

Install the Supabase client library:

```bash
npm install @supabase/supabase-js
```

Initialize the client pointing to your self-hosted instance:

```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://your-supabase-api.railway.app',
  'your-anon-key'
);
```

Replace the URL with the public domain of your API gateway service. The anon key is safe to include in frontend code as it respects Row Level Security policies.

### Authentication

```javascript
// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password',
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password',
});
```

### Querying data

```javascript
const { data, error } = await supabase
  .from('posts')
  .select('*')
  .order('created_at', { ascending: false });
```

### File uploads

```javascript
const { data, error } = await supabase.storage
  .from('avatars')
  .upload('user-1/avatar.png', file);
```

## Storage backend

The Supabase Storage API needs an S3-compatible backend. Create a Railway [Storage Bucket](/storage-buckets) and configure the Storage API service with the bucket credentials:

```
STORAGE_BACKEND=s3
GLOBAL_S3_BUCKET=<your-bucket-name>
AWS_ACCESS_KEY_ID=<bucket-access-key>
AWS_SECRET_ACCESS_KEY=<bucket-secret-key>
REGION=auto
GLOBAL_S3_ENDPOINT=<bucket-endpoint>
GLOBAL_S3_FORCE_PATH_STYLE=true
```

## Securing Studio

The Studio dashboard provides full access to your database, auth configuration, and storage. Do not expose it publicly without authentication.

Options:

- **Do not generate a public domain for Studio.** Access it only through Railway's private networking or a VPN.
- **Add basic auth** using a reverse proxy (Caddy or Nginx) in front of Studio.
- **Restrict access by IP** if your team uses a fixed IP range.

## Common pitfalls

**Service startup order.** GoTrue and PostgREST require Postgres to be running and have the required schemas. On initial deploy, these services may restart once or twice while Postgres initializes. Railway's [restart policy](/deployments/restart-policy) handles this automatically.

**JWT key mismatch.** If the `JWT_SECRET` differs between services, authentication fails silently. Ensure all services share the same secret using [reference variables](/variables#referencing-another-services-variable).

**Realtime not connecting.** The Realtime service uses WebSockets. Ensure the API gateway forwards WebSocket upgrade requests to the Realtime service. See [Choose between SSE and WebSockets](/guides/sse-vs-websockets) for Railway's WebSocket support details.

## Next steps

- [Storage Buckets](/storage-buckets) - Configure S3-compatible storage for Supabase.
- [Private Networking](/networking/private-networking) - How services communicate internally.
- [Add authentication to a frontend](/guides/frontend-authentication) - Patterns for using Supabase Auth in your app.
- [Manage environment variables](/guides/frontend-environment-variables) - Handle anon keys vs service role keys.
