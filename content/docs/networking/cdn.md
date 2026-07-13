---
title: CDN
description: Cache static assets and HTML at the edge with Railway's built-in CDN to reduce latency and origin load.
---

Railway's CDN serves your service's responses from the edge location nearest each visitor, so a cached request returns faster than a round trip to your service. It caches static assets and HTML across a <a href="https://blog.railway.com/p/railway-cdn" target="_blank">global network of points of presence (POPs)</a>, which also lowers load on your service and reduces network egress costs.

CDN caching is available on all plans at no additional cost. It's off by default and enabled per service.

**Note:** If you're being hit by a DDoS or bot flood, see [Under Attack Mode](/networking/waf).

## Enable CDN caching

<PriorityBoardingBanner />

CDN caching is configured per service and applies to all of that service's domains, including Railway-provided domains and custom domains. Turning it on doesn't change your DNS or SSL setup.

1. Open the service you want to cache and go to its **Settings**.
2. In the **Edge** section, toggle **Enable CDN Caching** on.

You can also enable CDN caching from the CLI:

```bash
railway cdn enable --service web
```

Railway routes each request to the nearest edge location automatically. For how that routing works, see [Edge networking](/networking/edge-networking).

## How caching works

The CDN sits between your visitors and your service. The first time someone requests a cacheable URL, the edge fetches the response from your service, stores a copy, and returns it. This is a cache miss. Later requests for the same URL are served straight from the edge without reaching your service. This is a cache hit.

A cache hit never reaches your service, so it uses none of your service's compute and doesn't incur [network egress](/pricing/understanding-your-bill#high-network-egress).

The edge adds an `x-cache` response header showing how it handled the request:

| `x-cache` value | Meaning |
| --------------- | ------- |
| `HIT` | Served from the edge cache, without reaching your service. |
| `STALE` | Served from the edge cache while the edge refreshed it from your service in the background (see [Stale-while-revalidate](#stale-while-revalidate)). |
| `MISS` | Not cached yet, so the edge fetched it from your service and stored it for next time. |
| `DYNAMIC` | Fetched from your service and not cached, because the response isn't cacheable. |

If caching is off for the domain, or the request isn't eligible (see [Cacheable requests](#cacheable-requests)), there's no `x-cache` header.

On a cache hit or stale serve, the edge also adds an `age` response header showing how many seconds ago the entry was stored. A rising `age` across requests confirms the same cached copy is being reused.

To confirm caching is working, request a static asset twice and check that the second response returns `x-cache: HIT`. A persistent `DYNAMIC` means the edge reached your service but couldn't cache the response, usually because of the [HTML caching](#html-caching) mode, a missing cache header, or a [skip condition](#when-a-response-isnt-cached).

### Cacheable requests

A request is eligible for caching only when both of these are true:

- The method is `GET` or `HEAD`. Other methods always reach your service.
- The request has no `Authorization` header. Authenticated requests bypass the cache and go to your service.

A request `Cookie` header doesn't disable caching. This keeps pages cacheable for sites that set analytics cookies (for example, PostHog or Google Analytics). Personalized responses are handled on the response side instead (see [When a response isn't cached](#when-a-response-isnt-cached)).

### When a response isn't cached

Even when a request is eligible, the edge skips caching a response in any of these cases:

- `Cache-Control: no-store` or `Cache-Control: private` is present.
- A `Set-Cookie` header is present, which keeps personalized responses from being shared between users.
- `Vary: *` or `Vary: Cookie` is set. Other `Vary` values (`Accept`, `Accept-Language`, `User-Agent`) don't prevent caching.
- The response body is larger than 512 MB. The edge reports these as `MISS` without storing them.

## Static assets

Static assets are cached by default, even when your service sends no `Cache-Control` headers. Railway identifies a static asset by the response `Content-Type`, not the file extension. A `.js` file served as `text/plain` isn't treated as static, while an extensionless URL served as `image/png` is. Their cache duration follows the origin's `Cache-Control`, falling back to the [Default TTL](#default-ttl).

<Collapse title="Which content types are treated as static assets">

Railway caches responses whose `Content-Type` matches one of these glob patterns. The trailing `*` matches any subtype or parameters, so `image/*` covers `image/avif`, and `text/css*` covers `text/css; charset=utf-8`.

- `image/*`
- `font/*`
- `audio/*`
- `video/*`
- `text/css*`
- `text/csv*`
- `text/javascript*`
- `text/xml*`
- `application/javascript*`
- `application/x-javascript*`
- `application/xml*`
- `application/wasm*`
- `application/manifest+json*`
- `application/pdf*`
- `application/zip*`
- `application/gzip*`
- `application/x-gzip*`
- `application/x-tar*`
- `application/font*`
- `application/vnd.ms-fontobject*`

**Note:** This list can change over time; the running product is the source of truth.

</Collapse>

## Configure caching

The **Edge** section of your service settings controls how the CDN caches responses.

You can also configure these settings from the CLI with [`railway cdn update`](/cli/cdn#options-for-update).

### HTML caching

The **HTML Caching** setting controls when HTML responses are cached. Static assets are always cached regardless of this setting.

| Mode | Behavior |
| ---- | -------- |
| **Auto** (default) | Caches HTML only when your service sends a `Cache-Control` `max-age` or `s-maxage` and the response passes the checks in [When a response isn't cached](#when-a-response-isnt-cached). This suits frameworks like Next.js, Remix, and SvelteKit that set cache headers deliberately. |
| **Force** | Caches HTML even when your service sends no cache headers. Railway uses the origin's `max-age` if present, and otherwise the [Default TTL](#default-ttl). |
| **Never** | Doesn't cache HTML, regardless of the headers your service sends. |

### Default TTL

The **Default TTL** is the fallback cache duration Railway uses when your service doesn't send a `Cache-Control` freshness directive. It applies to static assets, and to HTML when **HTML Caching** is set to **Force**.

You can choose 30 minutes, 1 hour, 2 hours (the default), 4 hours, 12 hours, or 1 day.

Railway resolves the cache duration for each response in this order:

1. The origin's `s-maxage`, then `max-age`, if either is present.
2. The Default TTL, for static assets and for Force-mode HTML.

Well-configured asset servers usually send a long `max-age` (for example, `Cache-Control: max-age=31536000, immutable`), so the Default TTL mainly affects responses without cache headers.

Responses that are neither HTML nor a recognized static asset (for example, a JSON API response) are cached only when your service sends an explicit `max-age` or `s-maxage`. When it doesn't, the response isn't cached and the edge returns `x-cache: DYNAMIC`.

### Stale-while-revalidate

When **Honor SWR Directives** is on (the default), Railway honors the `stale-while-revalidate` directive in your responses' `Cache-Control` header. While a cached entry is within its stale-while-revalidate window, the edge serves the cached response immediately and refreshes it from your service in the background, so visitors don't wait for the revalidation. Railway coalesces these background refreshes, so a burst of requests triggers a single fetch to your service.

When the toggle is off, Railway ignores the directive. Once an entry expires, the next request waits for a fresh response from your service.

This setting controls `stale-while-revalidate` only. Railway honors `stale-if-error`, serving stale content when your service returns an error, regardless of this setting.

## Control caching from your service

Your service controls caching through the `Cache-Control` headers it returns. There's no per-path setting in the dashboard, so you tune caching per response.

- To cache a response, send a freshness directive such as `Cache-Control: public, max-age=3600`. HTML in [Auto mode](#html-caching) requires one.
- To keep a response out of the cache, send `Cache-Control: no-store` or `Cache-Control: private`. Use this for routes like `/api` or `/admin` that should always reach your service.
- To serve stale content while revalidating, add `stale-while-revalidate` (see [Stale-while-revalidate](#stale-while-revalidate)).

Non-`GET`/`HEAD` methods and requests with an `Authorization` header (see [Cacheable requests](#cacheable-requests)) are never cached, so most dynamic endpoints are excluded without any header changes.

## Conditional requests

When your service sends an `ETag`, the edge stores it with the cached response and can answer conditional requests itself. If a client sends an `If-None-Match` header matching the cached `ETag`, the edge returns `304 Not Modified` straight from the cache, without reaching your service.

The `304` carries no body, only the validators a client needs to refresh its freshness state: `ETag`, `Cache-Control`, `Vary`, `Expires`, `Last-Modified`, `Date`, and `Content-Location`. `ETag` matching follows the standard weak comparison, so weak (`W/`-prefixed) and strong tags compare equal, a comma-separated list matches if any tag matches, and `*` matches any cached entry.

## Streaming and WebSockets

Server-Sent Events (`text/event-stream`) are never cached or buffered: each event streams to the client the moment your service produces it. Responses that aren't cacheable also pass through without buffering. Cacheable responses are buffered at the edge so a copy can be stored, including responses your service sends with chunked transfer encoding, which cache normally. WebSocket connections upgrade and pass through normally.

## Cache keys

Railway caches each unique URL separately. The cache key includes the request method, host, path, and full query string, so different query strings are stored as different entries.

- Query parameters are part of the cache key. Their order doesn't matter (`?a=1&b=2` and `?b=2&a=1` are the same entry), but every parameter counts. Per-visit or tracking parameters (such as `utm_source`) create separate cache entries, which can fragment your cache.
- Cookies aren't part of the cache key. A cached response is shared across requests regardless of their cookies, which is why personalization relies on `Set-Cookie` and `Cache-Control: private` instead.
- The response encoding is part of the cache key, so Brotli and gzip variants are cached separately (see [Compression](#compression)).

## Compression

The edge compresses responses before serving them, so compressing at your service is optional. When the client supports it, the edge serves Brotli (preferred) or gzip.

A response is compressed when all of these hold:

- The client's `Accept-Encoding` includes `br` or `gzip`.
- Your service returns it uncompressed. If your service already set `Content-Encoding`, the edge caches and forwards it as-is, without recompressing.
- The content type is compressible (see below).
- The response is at least 256 bytes.

Cached responses are compressed once when stored, so every later hit is served pre-compressed, and each encoding is a separate cache entry. Server-Sent Events (`text/event-stream`) are never compressed, so streamed events aren't held back.

The edge compresses text, JSON and XML, JavaScript, SVG, and uncompressed fonts when the response isn't already compressed. Already-compressed formats, such as `zip` archives and `woff2` fonts, are skipped.

## Metrics and logging

Railway doesn't report CDN metrics such as cache hit rate or bandwidth saved. To check whether a specific response was cached, use the `x-cache` and `age` headers described in [How caching works](#how-caching-works).

Cache hits are served from the edge and never reach your service, so your service's request logs and server-side metrics don't record them and will undercount real traffic once caching is on. Client-side analytics, such as PostHog or Google Analytics, still capture every visitor, because the CDN keeps cookies intact and serves your full page.

### Check which edge location served you

Every domain with the CDN active responds to `/.railway/cdn-trace`, a built-in endpoint that reports the edge location handling your request. It returns the point of presence (POP), edge node, and a timestamp, which is useful for confirming the CDN is in front of your service and seeing which location you're routed to. Add `?json` (request `/.railway/cdn-trace?json`) to get the same details as JSON.

## Purge the cache

Purging removes cached content so the next request fetches a fresh copy from your service. You can purge manually or automatically on deploy.

### Purge manually

The **Purge Cache** controls in your service's **Edge** settings let you clear cached content on demand:

- **Purge HTML** clears cached HTML responses and leaves static assets in place.
- **Purge All** clears all cached content, including static assets.

Railway shows when each scope was last purged.

You can also purge cached content from the CLI:

```bash
railway cdn purge html
railway cdn purge all
```

Purging applies to the whole service. There's no per-URL purge, so to invalidate a single page, purge HTML or all content, or redeploy the service.

### Purge on deploy

The **Purge Cache on Deploy** setting clears cached content after each successful deploy so the next request re-fetches from your service.

| Option | Behavior |
| ------ | -------- |
| Off | Keeps the cache across deploys. |
| Purge HTML on each successful deploy (default) | Clears cached HTML so a freshly deployed page can't reference outdated asset URLs, while immutable static assets stay cached. |
| Purge everything on each successful deploy | Clears all cached content, including static assets. |

Configure purge on deploy from the CLI:

```bash
railway cdn update --purge-on-deploy html
```

### Purge propagation

Purges apply across all edge locations. They aren't instant: each location picks up a purge within a few seconds, typically around 10 seconds, and locations update independently rather than all at once. After a purge, the next request for an affected URL revalidates against your service.

## Related documentation

- [WAF](/networking/waf) - Defend your service from DDoS attacks and bot floods with Under Attack Mode
- [Edge networking](/networking/edge-networking) - How Railway routes requests to the nearest edge location
- [Public networking](/networking/public-networking) - Expose your services to the internet
- [Domains](/networking/domains) - Configure Railway-provided and custom domains
- [Deployment regions](/deployments/regions) - Choose where your service runs
- [railway cdn](/cli/cdn) - Manage CDN caching from the CLI
