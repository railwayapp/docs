---
title: Choose Between SSR, SSG, and ISR for Your Frontend
description: When to use server-side rendering, static site generation, or incremental static regeneration. Covers Railway deployment implications, cost tradeoffs, and framework support.
date: "2026-04-14"
tags:
  - architecture
  - frontend
  - ssr
  - ssg
  - isr
  - rendering
topic: architecture
---

Frontend frameworks offer multiple rendering strategies. The one you choose affects how your app deploys on Railway, what resources it consumes, and how it handles dynamic content.

This guide covers when to use each strategy and what to account for on Railway.

## Quick comparison

| Strategy | When HTML is generated | Server required | Railway resource usage | Best for |
|---|---|---|---|---|
| SSG | At build time | No (static files) | Lowest (Caddy serves files) | Marketing sites, blogs, documentation |
| SSR | On each request | Yes (Node/Deno process) | Higher (always-on service) | Dashboards, authenticated pages, personalized content |
| ISR | At build time, then re-generated on demand | Yes (Node process) | Medium (server + cache) | Content that updates periodically but tolerates brief staleness |
| Streaming SSR | On each request, sent in chunks | Yes (Node process) | Similar to SSR | Large pages where fast time-to-first-byte matters |

## Static site generation (SSG)

HTML pages are generated at build time. The build output is a directory of static files (HTML, CSS, JS) served by a web server like Caddy or Nginx.

**Best for:** content that changes infrequently. Marketing pages, documentation, blogs, changelogs. The content is the same for every visitor.

**On Railway:** deploy as static files served by Caddy. No long-running server process. Costs are minimal because Caddy is lightweight. See [Configure SPA Routing](/guides/spa-routing-configuration) for the Caddy setup.

**Tradeoff:** every content change requires a full rebuild and deploy. For sites with thousands of pages, builds can be slow.

**Failure mode:** if your site has many pages and the build exceeds Railway's [build timeout or memory limits](/deployments/reference), the deploy fails. Split large builds into smaller services or use ISR instead.

### Frameworks that support SSG

- **Astro** (default mode)
- **Next.js** (`output: "export"` for fully static, or per-page with `getStaticProps`)
- **Nuxt** (`nuxt generate`)
- **SvelteKit** (`@sveltejs/adapter-static`)
- **Gatsby** (default mode)

## Server-side rendering (SSR)

HTML is generated on the server for each request. The server runs continuously, processing requests and returning rendered pages.

**Best for:** pages with user-specific content, authenticated views, search results, or any page that needs fresh data on every request.

**On Railway:** deploy as a Node service. The framework's built-in server handles incoming requests. Set a [health check](/deployments/healthchecks) to monitor the service. Consider [scaling](/scaling) if traffic demands it.

**Tradeoff:** higher resource consumption than SSG. The server is always running, even during low traffic. Each request incurs server-side rendering time.

**Failure mode:** if your SSR server is slow (heavy database queries, large component trees), time-to-first-byte suffers. Profile your server-side rendering and move expensive data fetching to background jobs or caching layers.

### Frameworks that support SSR

- **Next.js** (default for App Router, Server Components)
- **Nuxt** (default mode)
- **Remix** (default mode)
- **SvelteKit** (default mode)
- **Astro** (with `output: "server"` or `output: "hybrid"`)

## Incremental static regeneration (ISR)

Pages are pre-built at deploy time like SSG, then individually re-generated after a configurable time interval when a new request arrives. The first visitor after the interval gets the stale page while the server regenerates it in the background. Subsequent visitors get the fresh version.

**Best for:** content that updates periodically but does not need to be real-time. Product catalogs, CMS-driven pages, dashboards with data that refreshes every few minutes.

**On Railway:** deploy as a Node service (same as SSR). The server must stay running to handle revalidation requests.

**Tradeoff:** adds operational complexity. The cache lives on the local filesystem by default, which means:

- **Cache is lost on every deploy.** Railway replaces the container on each deployment. All cached pages are regenerated from scratch. This is expected behavior but can cause a burst of server-side renders immediately after deploy.
- **Cache is not shared across replicas.** If you scale to multiple instances, each instance maintains its own cache. A visitor may see a stale page on one instance while another has already regenerated.

For multi-replica setups, use an external cache backend like Redis to share ISR state. Next.js supports [custom cache handlers](https://nextjs.org/docs/app/building-your-application/deploying#caching-and-isr) for this purpose.

**Failure mode:** if you expect ISR to eliminate server load, note that the server still runs continuously and handles revalidation. The benefit is reduced render frequency, not eliminating the server.

### Frameworks that support ISR

- **Next.js** (`revalidate` option in App Router or `getStaticProps`)
- **Nuxt** (`routeRules` with `swr` or `isr` options)

## Streaming SSR

The server begins sending HTML to the browser before the entire page is rendered. The initial shell loads immediately, and slower parts stream in as they resolve. This reduces perceived load time for pages with heavy data requirements.

**Best for:** pages with both fast and slow data sources. The user sees the page layout and fast content immediately while slower sections (database queries, API calls) load progressively.

**On Railway:** deploy the same way as SSR. Railway does not buffer streaming responses, so chunks reach the browser as they are sent. Ensure your application does not add buffering middleware on the SSE or streaming routes.

### Frameworks that support streaming SSR

- **Next.js** (App Router with React Server Components and Suspense)
- **Remix** (`defer` in loaders)
- **SvelteKit** (streaming with `await` blocks)
- **Solid Start** (streaming by default)

## Decision flowchart

Use these questions to pick a rendering strategy:

1. **Is the content the same for every visitor?**
   - Yes, and it changes rarely → **SSG**
   - Yes, but it changes every few minutes or hours → **ISR**
   - No, it varies per user or per request → continue to 2

2. **Does the page need data from a database or API on every request?**
   - Yes → **SSR**
   - Yes, and parts of the page load at different speeds → **Streaming SSR**

3. **Is the site small enough to rebuild in under a few minutes?**
   - Yes → **SSG** is simpler even if content changes moderately
   - No → **ISR** avoids full rebuilds

You can mix strategies within a single app. Next.js, Nuxt, Astro, and SvelteKit all support per-route rendering modes.

## Framework support matrix

| Framework | SSG | SSR | ISR | Streaming SSR |
|---|---|---|---|---|
| Next.js | Yes | Yes | Yes | Yes |
| Nuxt | Yes | Yes | Yes (via `routeRules`) | Limited |
| SvelteKit | Yes | Yes | No | Yes |
| Remix | No | Yes | No | Yes (`defer`) |
| Astro | Yes | Yes (hybrid/server) | No | No |
| Gatsby | Yes | No | No | No |
| TanStack Start | No | Yes | No | Yes |

## Cost implications on Railway

**SSG** is the cheapest to run. Caddy uses minimal CPU and memory to serve static files. You pay only for the web server process.

**SSR** costs more because a Node process runs continuously. Resource usage scales with traffic and rendering complexity. Use Railway's [autoscaling](/scaling) to match capacity to demand.

**ISR** falls between SSG and SSR. The server runs continuously but renders pages less frequently than pure SSR. Cache hits serve static files without rendering.

For all strategies, build-time resource usage (CPU and memory during `npm run build`) is charged separately from runtime. Large SSG builds with thousands of pages consume more build resources.

## Next steps

- [Configure SPA routing](/guides/spa-routing-configuration) - Set up Caddy for static frontend deploys.
- [Manage environment variables in frontend builds](/guides/frontend-environment-variables) - Handle build-time vs runtime variables.
- [Choose between SSE and WebSockets](/guides/sse-vs-websockets) - Add real-time features to your frontend.
- [Scaling](/scaling) - Scale SSR services based on traffic.
- [Health Checks](/deployments/healthchecks) - Monitor your SSR service health.
