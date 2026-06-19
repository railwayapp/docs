---
title: Edge Networking
description: Learn how Railway's global edge network routes traffic to your deployments
---

Railway uses a globally distributed edge network to route traffic to your deployments. This guide explains how the edge network works, what the `X-Railway-Edge` and `X-Railway-Debug` headers tell you, and why traffic sometimes appears to hit a different region than where your service is deployed.

## Edge network architecture

### How anycast works

Railway's edge network uses [anycast](https://en.wikipedia.org/wiki/Anycast) routing. With anycast, the same IP address is advertised from multiple geographic locations. When a user makes a request to your Railway service:

1. Their DNS query resolves to Railway's anycast IP addresses
2. Internet routing (BGP) automatically directs the request to the **nearest edge location** based on network topology
3. The edge proxy terminates TLS, processes the request, and forwards it to your deployment

The key insight is that **"nearest" is determined by network topology, not geographic distance**. A user in one city might be routed to an edge location in a different region if that path has better network connectivity.

### Edge POPs VS deployment regions

Railway's network has two distinct layers:

- **Edge POPs** are the entry points where user traffic first reaches Railway. Each request is terminated at the nearest POP and tagged with that POP's ID in the `X-Railway-Edge` header. Railway operates POPs in [dozens of cities worldwide](https://status.railway.com/locations).
- **Deployment regions** are where your applications actually run. Railway offers four: **US West**, **US East**, **Europe West**, and **Asia Southeast**.

You choose which regions to deploy your app to, but all edge POPs are available automatically. Your users always enter Railway at the POP nearest to them, regardless of where your app is deployed.

For any given request, traffic enters at the nearest edge POP, then routes internally to the nearest deployment region where your app is running. If your app is deployed in multiple regions, traffic is routed to the closest one. If your app is only in one region, traffic routes there regardless of where it entered.

### Request flow

When a request reaches your Railway service, it follows this path:

```
User → ISP → Internet (BGP) → Nearest Edge
  → Internal Routing → Deployment Region → Your Service
```

1. **User to Edge**: Anycast routing directs traffic to the nearest edge location
2. **Edge Processing**: The edge proxy (tcp-proxy) terminates TLS, adds headers, and looks up routing information
3. **Internal Routing**: Traffic is forwarded over Railway's internal network to your deployment
4. **Service Response**: Your service processes the request and the response follows the reverse path

## Understanding the X-Railway-Edge header

Every HTTP request to your Railway service includes the `X-Railway-Edge` header, which identifies the edge location (POP) that handled the request.

### Header format

The header value is the **POP (point of presence) ID** of the edge location that received the request. Each POP ID is the [IATA code](https://en.wikipedia.org/wiki/IATA_airport_code) of the city where the POP is located, followed by a number (a city can have more than one POP):

```
X-Railway-Edge: iad1    # an Ashburn POP
X-Railway-Edge: hnd1    # a Tokyo POP
```

Railway operates edge POPs in dozens of cities worldwide. You can see the full list, along with each POP's current status, on the [Railway status page](https://status.railway.com/locations).

### What it tells you

The `X-Railway-Edge` header indicates:
- Which edge POP received and processed the incoming request
- The geographic location where TLS was terminated
- The entry point into Railway's network for that specific request

### What it does not tell you

The header does **not** indicate:
- Where your deployment is running (use [Deployment Regions](/deployments/regions) for that, or the [`X-Railway-Upstream-Zone`](#debugging-with-the-x-railway-debug-header) debug header to see which zone served the request)
- The user's actual geographic location
- The optimal routing path

### Accessing the header

You can see this header in your deployment's HTTP logs, or read it programmatically in your application like any other HTTP request header.

## Debugging with the X-Railway-Debug header

To get more information about how Railway routed a request, send the `X-Railway-Debug` request header with any value (for example, `1`). When Railway sees this header, it adds extra debug headers to the response:

```bash
curl -sI -H "X-Railway-Debug: 1" https://your-app.up.railway.app
```

### X-Railway-Upstream-Zone

Currently, the only extra debug header is `X-Railway-Upstream-Zone`, which identifies the **origin zone** that served the request — the deployment region your traffic was routed to internally after entering at the edge.

| Zone | Region | Location |
| ---- | ------ | -------- |
| `railway/us-west2` | US West | California, USA |
| `railway/us-east4-eqdc4a` | US East | Virginia, USA |
| `railway/europe-west4-drams3a` | Europe West | Amsterdam, Netherlands |
| `railway/asia-southeast1-eqsg3a` | Asia Southeast | Singapore |

Comparing `X-Railway-Edge` (the POP where the request entered Railway) with `X-Railway-Upstream-Zone` (the zone that served it) shows the full path a request took through Railway's network.

## Why traffic hits "wrong" regions

A common question from users is: "Why does `X-Railway-Edge` show a different region than where I'm located or where my deployment runs?" This is usually expected behavior.

### Anycast routes to nearest edge, not deployment

The edge POP is determined by anycast routing, which optimizes for network path, not geographic proximity. Your deployment region is a separate configuration that determines where your application runs.

**Example**: A user in Chicago might see `X-Railway-Edge: iad1` (an Ashburn POP) even though a closer POP exists, if their ISP's path to Railway is better via Ashburn. With `X-Railway-Debug` enabled, that same request might return `X-Railway-Upstream-Zone: railway/us-west2` — it entered at the US East edge but was served by a deployment in US West. Both are normal: anycast follows network topology, and internal routing sends traffic to the nearest region your app runs in.

### ISP and network factors

Internet routing depends on:
- Your ISP's peering agreements
- Network congestion and availability
- BGP routing decisions made by intermediate networks

These factors can cause traffic to take unexpected paths that don't align with geographic intuition.

### Cloudflare and CDN influence

If you're using Cloudflare or another CDN in front of Railway:

1. The user's request first hits Cloudflare's edge
2. Cloudflare forwards the request to Railway from its edge location
3. Railway's anycast routes based on where Cloudflare's request originates, not the end user

This can result in `X-Railway-Edge` showing a region that matches Cloudflare's edge location rather than the end user's location. This is expected behavior when using a CDN.

### VPNs and proxies

Users connecting through VPNs or corporate proxies will have their traffic routed based on the VPN/proxy exit point, not their actual location.

## Diagnosing routing issues

### When edge region mismatch is expected

These scenarios are **normal** and don't require investigation:

- `X-Railway-Edge` shows a POP in a different region than your deployment region
- `X-Railway-Edge` varies for users in the same geographic area
- `X-Railway-Edge` doesn't match your users' expected locations when using a CDN
- Occasional variation in which edge handles requests

### When to investigate

Consider reaching out to support if:

- All traffic consistently routes to a single, distant edge when you expect geographic distribution
- You see significantly higher latency than expected for your users' locations
- Traffic routing changes suddenly and dramatically without any configuration changes

### Diagnostic steps

1. **Check your current routing**: Visit [Railway's routing info page](https://routing-info-production.up.railway.app/) to see which edge POP your requests are hitting

2. **Check the header**: Inspect `X-Railway-Edge` in your application logs or by making test requests

3. **Run traceroute**: Test network paths to Railway's anycast IP
   ```bash
   traceroute 69.46.46.46
   ```

4. **Compare from multiple locations**: Use tools like [globalping.io](https://globalping.io) to test routing from different geographic locations

5. **Check your CDN configuration**: If using Cloudflare or similar, verify your DNS and proxy settings

### Contacting support

If you need to report a routing issue, include:
- The `X-Railway-Edge` header value from affected requests (and `X-Railway-Upstream-Zone`, if you can capture it by sending `X-Railway-Debug`)
- Your deployment ID (found in the Railway dashboard)
- Traceroute results to `69.46.46.46`
- The geographic location where the issue is observed
- Whether you're using a CDN or proxy

## Related documentation

- [Deployment Regions](/deployments/regions) - Configure where your services run
- [Public Networking](/networking/public-networking) - Overview of public networking features
- [Network Diagnostics](/networking/troubleshooting/network-diagnostics) - Tools for troubleshooting network issues
- [TCP Proxy](/networking/tcp-proxy) - Proxy TCP traffic to your services
