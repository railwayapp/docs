---
title: Speed Up a Global App with Cache-Control Headers and a CDN
description: Set Cache-Control headers correctly for static assets, HTML, and API responses, then put a CDN in front of your Railway service to serve users from the nearest edge.
date: "2026-07-29"
tags:
  - caching
  - cdn
  - performance
  - networking
topic: infrastructure
---

A user in Singapore requesting a page from a service in US West waits on every round trip. Caching fixes most of that wait. The browser caches what it already downloaded, and a CDN caches responses at edge locations near your users, so repeat requests don't cross the ocean.

Both layers are driven by one header: `Cache-Control`, which your service sets on each response to declare who may cache it and for how long. Get that right first: a CDN with wrong headers either caches nothing (no speedup) or caches too much (users see each other's data).

## How Cache-Control works

`Cache-Control` is a comma-separated list of directives. The ones that matter in practice:

| Directive | Meaning |
| --------- | ------- |
| `public` | Any cache (browser or CDN) may store the response. |
| `private` | Only the end user's browser may store it. CDNs must not. |
| `no-store` | Nobody caches it. Every request hits your service. |
| `max-age=N` | The response is fresh for N seconds. |
| `s-maxage=N` | Freshness for shared caches (CDNs) only. Overrides `max-age` at the edge. |
| `immutable` | The content at this URL never changes, so the browser skips revalidation. |
| `stale-while-revalidate=N` | For N seconds after expiry, serve the stale copy instantly and refresh in the background. |
| `stale-if-error=N` | For N seconds after expiry, serve the stale copy if the origin returns an error. |

A response with no `Cache-Control` header gets whatever each client decides: browsers apply heuristics and CDNs apply their own defaults. Set headers explicitly.

## Choose a policy per response type

Different responses need different lifetimes: four categories cover most apps.

### Hashed static assets: cache forever

Bundlers like Vite, webpack, and esbuild write asset filenames with a content hash (`app.4f8a2c.js`). When the content changes, the filename changes, so the old URL never goes stale. Cache these as long as possible:

```
Cache-Control: public, max-age=31536000, immutable
```

That is one year. `immutable` tells browsers to skip revalidation entirely.

### HTML: short TTL with stale-while-revalidate

HTML URLs are stable (`/`, `/pricing`), so you cannot cache them forever. A short freshness window plus `stale-while-revalidate` gives you edge-speed responses without stale pages:

```
Cache-Control: public, max-age=0, s-maxage=60, stale-while-revalidate=300
```

Browsers revalidate every time (`max-age=0`), the CDN serves it for 60 seconds, and for 5 minutes after that it serves the cached copy instantly while fetching a fresh one in the background.

### Public API responses: short shared cache

JSON that is the same for every user (a public catalog, a status endpoint) can take a short `s-maxage` so bursts of traffic collapse into one origin request:

```
Cache-Control: public, s-maxage=30, stale-while-revalidate=60
```

### Personalized or sensitive responses: keep them out of shared caches

Anything that depends on who is asking must never land in a CDN cache:

```
Cache-Control: private, no-store
```

Use this for account pages, dashboards, and any response after login. Railway's CDN adds two protections of its own: requests with an `Authorization` header bypass the cache, and responses with a `Set-Cookie` header are never cached.

## Complete example: Express with per-route cache headers

This server applies all four policies. Create a project and install the dependency:

```bash
mkdir cache-demo && cd cache-demo
npm init -y
npm install express
```

Create `server.js`:

```javascript
const express = require("express");
const path = require("path");

const app = express();

// 1. Hashed static assets: cache for a year.
//    Build tools put content hashes in these filenames,
//    so a URL's content never changes.
app.use(
  "/assets",
  express.static(path.join(__dirname, "dist/assets"), {
    immutable: true,
    maxAge: "365d",
    etag: true,
  })
);

// 2. HTML: short shared-cache TTL with stale-while-revalidate.
app.get("/", (req, res) => {
  res.set(
    "Cache-Control",
    "public, max-age=0, s-maxage=60, stale-while-revalidate=300"
  );
  res.type("html").send("<h1>Cached at the edge for 60 seconds</h1>");
});

// 3. Public API data: brief shared caching to absorb bursts.
app.get("/api/products", (req, res) => {
  res.set("Cache-Control", "public, s-maxage=30, stale-while-revalidate=60");
  res.json([
    { id: 1, name: "Widget" },
    { id: 2, name: "Gadget" },
  ]);
});

// 4. Personalized data: never cached anywhere shared.
app.get("/api/me", (req, res) => {
  res.set("Cache-Control", "private, no-store");
  res.json({ user: "current-user", plan: "pro" });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
```

Run it locally with `node server.js` and inspect the headers:

```bash
curl -sI http://localhost:3000/ | grep -i cache-control
curl -sI http://localhost:3000/api/me | grep -i cache-control
```

Deploy it to Railway from the project directory:

```bash
railway init
railway up
```

Railway detects the Node app and builds it with [Railpack](/builds/build-configuration). Generate a public domain from the service's settings, or with `railway domain`.

## Enable Railway's built-in CDN

Railway includes a [CDN](/networking/cdn) that caches responses at edge locations worldwide. It is available on all plans at no extra cost, off by default, and enabled per service. Once it's on, cache hits are served entirely from the edge: they use none of your service's compute and incur no [network egress](/pricing/understanding-your-bill) charges.

Enable it in the service's **Settings** under the **Edge** section, or from the CLI:

```bash
railway cdn enable --service web
```

It applies to all of the service's domains, both the Railway-provided `*.up.railway.app` domain and custom domains, with no DNS changes.

### How the CDN reads your headers

The headers you set above map directly onto the CDN's behavior:

- **Static assets** (identified by response `Content-Type`, such as `image/*`, `text/css`, `application/javascript`) are cached even without headers, using your `max-age` when present and a configurable default TTL otherwise. Your one-year `immutable` header means they are fetched from your service once.
- **HTML** is cached in the default **Auto** mode only when you send a `max-age` or `s-maxage`, which the example does. The CDN resolves the TTL from `s-maxage` first, then `max-age`.
- **`stale-while-revalidate`** is honored by default: within the window, the edge answers instantly from cache and refreshes in the background, coalescing a burst of requests into a single origin fetch.
- **`private` and `no-store`** responses are never cached, and neither is any response carrying `Set-Cookie`.
- **JSON and other non-HTML, non-static responses** are cached only with an explicit `max-age` or `s-maxage`, so the `/api/products` policy works and unheadered API routes stay dynamic.

### Verify it is working

Request the same URL twice and read the `x-cache` response header:

```bash
curl -sI https://your-app.up.railway.app/ | grep -i x-cache
curl -sI https://your-app.up.railway.app/ | grep -i x-cache
```

The first request returns `x-cache: MISS`, the second `x-cache: HIT`. A third result, `DYNAMIC`, means the response was not cacheable, usually a missing freshness directive on HTML. You can also hit `/.railway/cdn-trace` on any CDN-enabled domain to see which edge location is serving you.

### Handle deploys

By default, Railway purges cached HTML on each successful deploy, so a new page version cannot reference old asset URLs while your hashed assets stay cached. You can also purge manually:

```bash
railway cdn purge html
railway cdn purge all
```

## Using an external CDN instead

The same headers work with any CDN. Point the CDN's origin at your Railway service's domain and it will respect `s-maxage`, `stale-while-revalidate`, and `private` the same way. This is the right choice when you need per-URL invalidation, custom edge logic, or a CDN your organization already standardizes on. For a full walkthrough with a managed distribution, see [Add a CDN using Amazon CloudFront](/guides/add-a-cdn-using-cloudfront).

If you use an external CDN, leave Railway's CDN off for that service so you are not debugging two cache layers.

## Move the origin closer too

Caching hides origin latency for repeat requests, but cache misses and dynamic routes still travel to your service, so pick a [deployment region](/deployments/regions) near your largest user base. Railway's [edge network](/networking/edge-networking) routes each request to the nearest entry point regardless of where the service runs.

## Next steps

- [CDN](/networking/cdn) for the full reference on cache eligibility, TTL resolution, and purging
- [Edge networking](/networking/edge-networking) for how requests reach your service
- [Add a CDN using Amazon CloudFront](/guides/add-a-cdn-using-cloudfront) for an external CDN integration
- [Optimize performance](/deployments/optimize-performance) for scaling your service's resources
