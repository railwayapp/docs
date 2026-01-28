---
title: Edge Networking
description: Learn how Railway's global edge network routes traffic to your deployments
---

Railway uses a globally distributed edge network to route traffic to your deployments. This guide explains how the edge network works, what the `X-Railway-Edge` header tells you, and why traffic sometimes appears to hit a different region than where your service is deployed.

## Edge Network Architecture

### How Anycast Works

Railway's edge network uses [anycast](https://en.wikipedia.org/wiki/Anycast) routing. With anycast, the same IP address is advertised from multiple geographic locations. When a user makes a request to your Railway service:

1. Their DNS query resolves to Railway's anycast IP addresses
2. Internet routing (BGP) automatically directs the request to the **nearest edge location** based on network topology
3. The edge proxy terminates TLS, processes the request, and forwards it to your deployment

The key insight is that **"nearest" is determined by network topology, not geographic distance**. A user in one city might be routed to an edge location in a different region if that path has better network connectivity.

### Edge Regions vs Deployment Regions

Railway operates in four locations: **US West**, **US East**, **Europe West**, and **Asia Southeast**. Each location can serve as both an entry point for traffic (edge region) and a deployment target for your applications (deployment region).

You choose which locations to deploy your app to, but all edge regions are available automatically. Your users always enter Railway at the location nearest to them, regardless of where your app is deployed.

For any given request, traffic enters at the nearest edge region, then routes internally to the nearest deployment region where your app is running. If your app is deployed in multiple locations, traffic is routed to the closest one. If your app is only in one location, traffic routes there regardless of where it entered.

### Request Flow

When a request reaches your Railway service, it follows this path:

```
User → ISP → Internet (BGP) → Nearest Edge
  → Internal Routing → Deployment Region → Your Service
```

1. **User to Edge**: Anycast routing directs traffic to the nearest edge location
2. **Edge Processing**: The edge proxy (tcp-proxy) terminates TLS, adds headers, and looks up routing information
3. **Internal Routing**: Traffic is forwarded over Railway's internal network to your deployment
4. **Service Response**: Your service processes the request and the response follows the reverse path

## Understanding the X-Railway-Edge Header

Every HTTP request to your Railway service includes the `X-Railway-Edge` header, which identifies which edge location handled the request.

### Header Format

The header value follows the format: `railway/{region-identifier}`

| Header | Region | Location |
| ------ | ------ | -------- |
| `railway/us-west2` | US West | California, USA |
| `railway/us-east4-eqdc4a` | US East | Virginia, USA |
| `railway/europe-west4-drams3a` | Europe West | Amsterdam, Netherlands |
| `railway/asia-southeast1-eqsg3a` | Southeast Asia | Singapore |

### What It Tells You

The `X-Railway-Edge` header indicates:
- Which edge location received and processed the incoming request
- The geographic region where TLS was terminated
- The entry point into Railway's network for that specific request

### What It Does NOT Tell You

The header does **not** indicate:
- Where your deployment is running (use [Deployment Regions](/reference/deployment-regions) for that)
- The user's actual geographic location
- The optimal routing path

### Accessing the Header

You can see this header in your deployment's HTTP logs, or read it programmatically in your application like any other HTTP request header.

## Why Traffic Hits "Wrong" Regions

A common question from users is: "Why does `X-Railway-Edge` show a different region than where I'm located or where my deployment runs?" This is usually expected behavior.

### Anycast Routes to Nearest Edge, Not Deployment

The edge region is determined by anycast routing, which optimizes for network path, not geographic proximity. Your deployment region is a separate configuration that determines where your application runs.

**Example**: A user in Chicago might see `X-Railway-Edge: railway/us-east4-eqdc4a` even though their service is deployed in `us-west2`. This is normal - the request entered via the US East edge (nearest by network path) and was then routed internally to the US West deployment.

### ISP and Network Factors

Internet routing depends on:
- Your ISP's peering agreements
- Network congestion and availability
- BGP routing decisions made by intermediate networks

These factors can cause traffic to take unexpected paths that don't align with geographic intuition.

### Cloudflare and CDN Influence

If you're using Cloudflare or another CDN in front of Railway:

1. The user's request first hits Cloudflare's edge
2. Cloudflare forwards the request to Railway from its edge location
3. Railway's anycast routes based on where Cloudflare's request originates, not the end user

This can result in `X-Railway-Edge` showing a region that matches Cloudflare's edge location rather than the end user's location. This is expected behavior when using a CDN.

### VPNs and Proxies

Users connecting through VPNs or corporate proxies will have their traffic routed based on the VPN/proxy exit point, not their actual location.

## Diagnosing Routing Issues

### When Edge Region Mismatch is Expected

These scenarios are **normal** and don't require investigation:

- `X-Railway-Edge` shows a different region than your deployment region
- `X-Railway-Edge` varies for users in the same geographic area
- `X-Railway-Edge` doesn't match your users' expected locations when using a CDN
- Occasional variation in which edge handles requests

### When to Investigate

Consider reaching out to support if:

- All traffic consistently routes to a single, distant edge when you expect geographic distribution
- You see significantly higher latency than expected for your users' locations
- Traffic routing changes suddenly and dramatically without any configuration changes

### Diagnostic Steps

1. **Check your current routing**: Visit [Railway's routing info page](https://routing-info-production.up.railway.app/) to see which edge region your requests are hitting

2. **Check the header**: Inspect `X-Railway-Edge` in your application logs or by making test requests

3. **Run traceroute**: Test network paths to Railway's anycast IP
   ```bash
   traceroute 66.33.22.11
   ```

4. **Compare from multiple locations**: Use tools like [globalping.io](https://globalping.io) to test routing from different geographic locations

5. **Check your CDN configuration**: If using Cloudflare or similar, verify your DNS and proxy settings

### Contacting Support

If you need to report a routing issue, include:
- The `X-Railway-Edge` header value from affected requests
- Your deployment ID (found in the Railway dashboard)
- Traceroute results to `66.33.22.11`
- The geographic location where the issue is observed
- Whether you're using a CDN or proxy

## Related Documentation

- [Deployment Regions](/reference/deployment-regions) - Configure where your services run
- [Public Networking](/reference/public-networking) - Overview of public networking features
- [Network Diagnostics](/reference/network-diagnostics) - Tools for troubleshooting network issues
- [TCP Proxy](/reference/tcp-proxy) - Proxy TCP traffic to your services
