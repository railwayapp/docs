---
title: Configure Client-Side Routing for Single-Page Applications
description: Set up Caddy or Nginx to handle client-side routing for single-page applications on Railway. Avoid blank pages on refresh and configure fallback routes.
date: "2026-04-14"
tags:
  - architecture
  - frontend
  - spa
  - routing
  - caddy
  - nginx
topic: architecture
---

Single-page applications (SPAs) built with React, Vue, Angular, or Solid use client-side routing to navigate between pages without full reloads. When deployed to Railway, the web server needs to be configured to return `index.html` for all routes so the JavaScript router can handle navigation.

Without this configuration, refreshing the browser on a route like `/dashboard` returns a 404 because the server has no file at that path.

This guide covers how to configure fallback routing with Caddy, Nginx, or a Node-based server when deploying a SPA to Railway.

## The problem

SPAs use the browser's History API to change the URL without making a server request. When a user navigates from `/` to `/dashboard`, the JavaScript router updates the URL and renders the correct component.

The issue occurs when the browser sends a request directly to `/dashboard`, either from a page refresh, a bookmarked link, or a shared URL. The server looks for a file at `/dashboard`, finds nothing, and returns a 404.

The fix is a fallback rule: serve the requested file if it exists, otherwise serve `index.html` and let the client-side router take over.

## Option 1: Caddy (recommended)

[Caddy](https://caddyserver.com) is a lightweight web server that works well for serving SPAs on Railway. Most Railway SPA templates use Caddy.

Create a `Caddyfile` in your project root:

```
{
    admin off
    persist_config off
    auto_https off
    log {
        format json
    }
    servers {
        trusted_proxies static private_ranges 100.0.0.0/8
    }
}

:{$PORT:3000} {
    log {
        format json
    }

    rewrite /health /*

    root * dist

    encode gzip

    file_server

    try_files {path} /index.html
}
```

Key lines:

- `root * dist` sets the directory containing your build output. Change `dist` to `public`, `build`, or `out` depending on your framework.
- `try_files {path} /index.html` serves the file if it exists, otherwise falls back to `index.html`.
- `encode gzip` enables compression for faster delivery.
- `auto_https off` is required because Railway handles TLS termination.
- `trusted_proxies static private_ranges 100.0.0.0/8` ensures Railway's proxy headers are trusted.

### Build output directories by framework

| Framework | Build command | Output directory |
|---|---|---|
| React (Vite) | `npm run build` | `dist` |
| Vue (Vite) | `npm run build` | `dist` |
| Angular | `ng build` | `dist/<project-name>/browser` |
| Solid (Vite) | `npm run build` | `dist` |
| Gatsby | `gatsby build` | `public` |

Update the `root` directive in your Caddyfile to match your framework's output directory.

## Option 2: Nginx

If you prefer Nginx, create an `nginx.conf` in your project root:

```nginx
server {
    listen $PORT;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;
}
```

Use a multi-stage Dockerfile to build and serve:

```dockerfile
FROM node:lts-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . ./
RUN npm run build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html
```

Nginx uses the `$PORT` variable via its `envsubst` template system when placed in `/etc/nginx/templates/`.

## Option 3: Node-based serving

For simpler setups, you can serve your SPA with a Node server. This avoids a separate web server but uses more memory.

Install the `serve` package:

```bash
npm install serve
```

Add a start script to your `package.json`:

```json
{
  "scripts": {
    "start": "serve -s dist -l $PORT"
  }
}
```

The `-s` flag enables SPA mode, which rewrites all requests to `index.html`.

## Multi-stage Dockerfile with Caddy

This is the recommended approach for production deployments. Build your app with Node, then serve with Caddy:

```dockerfile
FROM node:lts-alpine AS build

ENV NPM_CONFIG_UPDATE_NOTIFIER=false
ENV NPM_CONFIG_FUND=false

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . ./
RUN npm run build

FROM caddy
WORKDIR /app
COPY Caddyfile ./
RUN caddy fmt Caddyfile --overwrite
COPY --from=build /app/dist ./dist

CMD ["caddy", "run", "--config", "Caddyfile", "--adapter", "caddyfile"]
```

Adjust `COPY --from=build /app/dist ./dist` to match your framework's output directory.

## Route API requests alongside the SPA

If your SPA calls a backend API running as a separate Railway service, you can proxy API routes through Caddy to keep the frontend and API on the same domain.

Add a `reverse_proxy` directive to your Caddyfile:

```
:{$PORT:3000} {
    # API routes go to the backend service over private networking
    handle /api/* {
        reverse_proxy backend.railway.internal:3000
    }

    # Everything else serves the SPA
    handle {
        root * dist
        encode gzip
        file_server
        try_files {path} /index.html
    }
}
```

Replace `backend.railway.internal` with your backend service's [private networking](/networking/private-networking) hostname.

## When you do not need fallback routing

You do not need `try_files` configuration if:

- **You use hash routing** (e.g., `/#/dashboard`). Hash-based URLs never hit the server because the fragment stays in the browser.
- **Your framework handles SSR.** Frameworks like Next.js, Nuxt, Remix, SvelteKit, and Astro (in SSR mode) run a server that handles all routes. Deploy these as Node services, not as static files behind Caddy.

## Common pitfalls

**Assets return `index.html` instead of the actual file.** This happens when `file_server` is not configured or is ordered incorrectly. In Caddy, `file_server` before `try_files` ensures real files are served first.

**Nested routes load broken assets.** If your app is at `/app/settings` and loads a relative script like `src="main.js"`, the browser requests `/app/main.js` instead of `/main.js`. Fix this by setting a base path in your build tool (e.g., `base: "/"` in `vite.config.js`).

**Health checks conflict with SPA routes.** The `rewrite /health /*` line in the Caddyfile ensures Railway's health check endpoint always returns a response. Without it, `/health` would fall through to `index.html`, which may not return the status code Railway expects.

## Next steps

- [React deployment guide](/guides/react)
- [Vue deployment guide](/guides/vue)
- [Angular deployment guide](/guides/angular)
- [Solid deployment guide](/guides/solid)
- [Manage environment variables in frontend builds](/guides/frontend-environment-variables)
- [Public Networking](/networking/public-networking)
