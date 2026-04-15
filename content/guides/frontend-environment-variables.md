---
title: Manage Environment Variables in Frontend Builds
description: Understand build-time vs runtime environment variables in frontend frameworks. Covers Vite, Next.js, Nuxt, SvelteKit, Astro, and Angular prefix conventions and how Railway handles each.
date: "2026-04-14"
tags:
  - frontend
  - environment-variables
  - vite
  - nextjs
topic: architecture
---

Frontend frameworks distinguish between build-time and runtime environment variables. Getting this wrong causes variables to be `undefined` in the browser or, worse, secrets to leak into client-side JavaScript bundles.

This guide covers how each major framework handles environment variables and what to account for when deploying to Railway.

## Build-time vs runtime

**Build-time variables** are injected into the JavaScript bundle during `npm run build`. They become static strings in the output files. Changing a build-time variable requires a new build and deploy.

**Runtime variables** are read by server-side code at request time. They are never shipped to the browser. Changing a runtime variable takes effect on the next request without rebuilding.

On Railway, all [service variables](/variables) are available during both the build step and at runtime. The framework's prefix convention determines which variables are exposed to client-side code in the bundle.

## Framework prefix conventions

| Framework | Client-side prefix | Server-only | How to access in client code |
|---|---|---|---|
| Vite (React, Vue, Solid) | `VITE_` | No prefix | `import.meta.env.VITE_API_URL` |
| Next.js | `NEXT_PUBLIC_` | No prefix | `process.env.NEXT_PUBLIC_API_URL` |
| Nuxt | `NUXT_PUBLIC_` in `runtimeConfig.public` | `runtimeConfig` (no prefix) | `useRuntimeConfig().public.apiUrl` |
| SvelteKit | `PUBLIC_` | No prefix | `import { env } from '$env/static/public'` |
| Astro | `PUBLIC_` | No prefix | `import.meta.env.PUBLIC_API_URL` |
| Angular | N/A (uses `environment.ts` files) | N/A | `environment.apiUrl` |
| Gatsby | `GATSBY_` | No prefix | `process.env.GATSBY_API_URL` |
| Remix | None (use loaders) | All env vars | Pass from loader to component |

## Setting variables in Railway

1. Go to your service in the Railway dashboard.
2. Open the **Variables** tab.
3. Add your variables with the correct prefix for your framework.

Variables set here are available during both the build and at runtime. See [Variables](/variables) for more details.

**When a build-time variable changes, you must redeploy.** Railway triggers a new deploy when you update a variable, which rebuilds the app with the new value baked in.

### Reference variables across services

If your frontend needs to know your backend's public URL, use a [reference variable](/variables#referencing-another-services-variable) instead of hardcoding it:

```
VITE_API_URL=https://${{Backend.RAILWAY_PUBLIC_DOMAIN}}
```

This keeps the value in sync when domains change.

## Server-side variables in SSR frameworks

SSR frameworks (Next.js, Nuxt, SvelteKit, Remix, Astro in SSR mode) run server code that can access all environment variables, not just prefixed ones.

In Next.js, Server Components and Route Handlers can read `process.env.DATABASE_URL` directly. This value is never sent to the browser. Only variables with the `NEXT_PUBLIC_` prefix are included in the client bundle.

In Nuxt, `runtimeConfig` values (without the `public` key) are server-only. In SvelteKit, `$env/static/private` and `$env/dynamic/private` are server-only.

## Common mistakes

### Variable is undefined in the browser

**Symptoms:** `import.meta.env.API_URL` returns `undefined` in the browser, but the variable is set in Railway.

**Cause:** The variable is missing the framework-specific prefix. Without the prefix, the build tool strips it from the client bundle as a security measure.

**Fix:** Rename the variable with the correct prefix (e.g., `VITE_API_URL` for Vite, `NEXT_PUBLIC_API_URL` for Next.js) and redeploy.

### Secrets leaked into the client bundle

**Symptoms:** Database credentials, API secret keys, or other sensitive values are visible in the browser's JavaScript source files.

**Cause:** A secret was given a client-side prefix (e.g., `NEXT_PUBLIC_DATABASE_URL`).

**Fix:** Remove the public prefix from secret variables. Access them only in server-side code (API routes, server components, loaders). Rotate the compromised credentials immediately.

To audit your bundle for leaked values, search the build output:

```bash
grep -r "your-secret-value" dist/
```

### Variable unchanged after updating in Railway

**Symptoms:** The old value still appears in the browser after updating the variable in the Railway dashboard.

**Cause:** Build-time variables are baked into the JavaScript bundle. If Railway's deploy completed but a CDN or browser cache serves the old bundle, the old value persists.

**Fix:** Clear your CDN cache if applicable. For browser caching, ensure your build tool uses content hashes in filenames (Vite does this by default).

## Pattern: Runtime config injection for SPAs

For SPAs served as static files (no SSR server), all variables are build-time by default. If you need to change a variable without rebuilding, inject it at serve time.

This pattern serves a small script that reads from the server environment:

1. Create a server endpoint or template that injects environment values:

```javascript
// server.js (or a Caddy/Nginx template)
app.get('/config.js', (req, res) => {
  res.type('application/javascript');
  res.send(`window.__env = {
    apiUrl: "${process.env.API_URL}",
  };`);
});
```

2. Include the script in your `index.html` before your app bundle:

```html
<script src="/config.js"></script>
<script type="module" src="/main.js"></script>
```

3. Read from `window.__env` in your app code instead of `import.meta.env`.

This approach is also useful when you want the same Docker image to work across multiple Railway [environments](/environments) without rebuilding. For more detail on this pattern, see [Skipped Builds](/builds/skipped-builds).

## Next steps

- [Variables](/variables) - Configure service variables and reference variables.
- [Configure SPA routing](/guides/spa-routing-configuration) - Set up Caddy or Nginx fallback routing.
- [Skipped Builds](/builds/skipped-builds) - How Railway handles build caching and when build-time variables cause issues.
- [Deploying a Monorepo](/guides/deploying-a-monorepo) - Share variables between frontend and backend services.
