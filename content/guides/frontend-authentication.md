---
title: Add Authentication to a Frontend Application
description: Implement authentication in a frontend application deployed on Railway. Covers third-party providers (Clerk, Supabase Auth), session-based auth with Postgres, and common deployment pitfalls.
date: "2026-04-14"
tags:
  - frontend
  - authentication
  - clerk
  - supabase
topic: architecture
---

Most production applications need authentication. This guide covers three approaches to adding auth to a frontend application on Railway, with tradeoffs for each.

## Choosing an approach

| Approach | Complexity | Cost | Best for |
|---|---|---|---|
| Third-party auth service (Clerk, Auth0) | Low | Per-user pricing | Teams that want auth handled entirely externally |
| Supabase Auth (self-hosted or cloud) | Medium | Free (self-hosted) or usage-based (cloud) | Apps already using Supabase for database/storage |
| Session-based auth with Postgres | Higher | Only Railway resource costs | Full control over auth logic, no external dependencies |

All three approaches work with any frontend framework deployed on Railway.

## Pattern 1: Third-party auth (Clerk)

<a href="https://clerk.com" target="_blank">Clerk</a> handles user management, sign-up/sign-in UI, session tokens, and multi-factor authentication as an external service. Your Railway application verifies tokens on each request.

### Frontend setup (Next.js example)

Install the Clerk SDK:

```bash
npm install @clerk/nextjs
```

Add Clerk's provider to your layout:

```tsx
// app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs';

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

Add middleware to protect routes:

```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/']);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});
```

### Railway configuration

Set these variables in your Railway service:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - your Clerk publishable key (safe for the client).
- `CLERK_SECRET_KEY` - your Clerk secret key (server-only, no `NEXT_PUBLIC_` prefix).
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL` - the path for sign-in (e.g., `/sign-in`).
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL` - the path for sign-up (e.g., `/sign-up`).

In Clerk's dashboard, add your Railway domain to the allowed origins list.

### Syncing users to your database

If your app stores user data in Postgres, use Clerk webhooks to sync user creation and updates:

1. Create an API route that handles Clerk webhook events.
2. In Clerk's dashboard, set the webhook URL to `https://your-app.railway.app/api/webhooks/clerk`.
3. On `user.created` and `user.updated` events, upsert the user in your Postgres database.

This pattern also works with Auth0 and other providers that offer webhook-based user syncing.

## Pattern 2: Supabase Auth

<a href="https://supabase.com/docs/guides/auth" target="_blank">Supabase Auth</a> provides authentication as part of the Supabase platform. You can use Supabase's hosted service or self-host Supabase on Railway.

### Frontend setup

Install the Supabase client:

```bash
npm install @supabase/supabase-js
```

Initialize the client:

```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
```

Sign in with email:

```javascript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password',
});
```

### Railway configuration

Set these variables in your Railway service:

- `NEXT_PUBLIC_SUPABASE_URL` - your Supabase project URL (or your self-hosted instance's public domain).
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - the anonymous/public key (safe for the client).
- `SUPABASE_SERVICE_ROLE_KEY` - the service role key (server-only, no `NEXT_PUBLIC_` prefix). Used for admin operations.

### Verifying tokens on your API

If your frontend calls a separate API service on Railway, verify the JWT on each request:

```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verifyAuth(req) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error) throw new Error('Unauthorized');
  return user;
}
```

## Pattern 3: Session-based auth with Postgres

For full control, implement session-based authentication using cookies and a Postgres session store. This avoids external dependencies.

### Server setup (Express example)

```bash
npm install express express-session connect-pg-simple bcrypt
```

```javascript
import express from 'express';
import session from 'express-session';
import connectPg from 'connect-pg-simple';
import pg from 'pg';

const PgSession = connectPg(session);
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

const app = express();

app.use(session({
  store: new PgSession({ pool }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,  // Railway handles TLS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'lax',
  },
}));
```

### Railway configuration

- `DATABASE_URL` - reference variable pointing to your Postgres service.
- `SESSION_SECRET` - a random string for signing session cookies. Generate one with `openssl rand -base64 32`.

Set `cookie.secure: true` because Railway terminates TLS at the proxy and forwards requests over HTTP internally. The `Secure` flag ensures the cookie is only sent over HTTPS connections from the browser.

## Common pitfalls

**OAuth callback URL mismatch.** OAuth providers (Google, GitHub) require an exact callback URL. If your Railway service uses a generated domain like `your-app-production.up.railway.app`, add that URL to the provider's allowed redirect URIs. When you add a custom domain, update the redirect URIs to match.

**Secret keys in client bundles.** Variables like `CLERK_SECRET_KEY` and `SUPABASE_SERVICE_ROLE_KEY` must never have a `NEXT_PUBLIC_` or `VITE_` prefix. These are server-only secrets. If they appear in the browser's JavaScript source, rotate them immediately. See [Manage environment variables in frontend builds](/guides/frontend-environment-variables) for the full prefix reference.

**Session cookies not sent in cross-origin requests.** If your frontend and API are on different Railway domains, the browser blocks cookies by default. Either deploy both on the same domain (using path-based routing in Caddy, see [SPA routing guide](/guides/spa-routing-configuration)) or configure `sameSite: 'none'` with `secure: true` on the cookie.

**Auth state lost after deploy.** If you store sessions in memory (`express-session` default), all sessions are lost when Railway deploys a new container. Use a Postgres or Redis session store for persistent sessions.

## Next steps

- [Manage environment variables in frontend builds](/guides/frontend-environment-variables) - Handle public vs secret keys correctly.
- [Postgres on Railway](/databases/postgresql) - Set up a database for user data and sessions.
- [Private Networking](/networking/private-networking) - Connect frontend and API services securely.
- [Configure SPA routing](/guides/spa-routing-configuration) - Serve frontend and API from the same domain.
