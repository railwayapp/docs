---
title: Troubleshooting Slow Deployments and Applications
description: Learn how to diagnose and fix slow deployments and application performance issues on Railway.
---

When your deployment takes longer than expected or your application feels slow, it helps to understand what's happening behind the scenes. This guide walks you through Railway's deployment process, how to identify where slowdowns occur, and what you can do about them.

## Understanding Deployment Phases

Every deployment on Railway goes through several distinct phases. Understanding these phases helps you identify where delays are occurring.

### Phase Overview

| Phase | What Happens | Typical Duration |
|-------|--------------|------------------|
| **Initialization** | Railway takes a snapshot of your code | Seconds |
| **Build** | Your code is built into a container image | 1-10+ minutes |
| **Pre-Deploy** | Dependencies are checked and volumes are migrated if needed | Seconds to minutes |
| **Deploy** | Container is created and started | 30 seconds to 2 minutes |
| **Network** | Healthchecks run (if configured) | Up to 5 minutes (configurable) |
| **Post-Deploy** | Previous deployment is drained and removed | Seconds |

### Detailed Phase Breakdown

#### Initialization (Snapshot Code)

Railway captures a snapshot of your source code. This is typically fast unless you have an unusually large repository or many files.

#### Build Phase

The build phase is often the longest part of a deployment. Railway uses [Railpack](/reference/railpack) (or a [Dockerfile](/guides/dockerfiles) if present) to build your application into a container image.

Common causes of slow builds:
- Large dependency trees (many npm packages, Python dependencies, etc.)
- No build caching (first build or cache invalidation)
- Compiling native extensions
- Large assets being processed

**Tip:** Check the build logs to see which steps are taking the longest.

#### Pre-Deploy

This phase handles:
- **Waiting for dependencies**: If your service depends on another service that's also deploying, Railway waits for it to be ready
- **Volume migration**: If you changed your service's region and it has a volume attached, the volume data must be migrated. This can take significant time depending on volume size

#### Deploy (Creating Containers)

This phase involves:
1. **Pulling the container image** to the compute node
2. **Creating the container** with your configuration
3. **Mounting volumes** if configured
4. **Starting your application**

Large container images take longer to pull. Railway caches images on compute nodes when possible, but the first deployment to a new node requires a full pull.

#### Network (Healthchecks)

If you have a [healthcheck](/reference/healthchecks) configured, Railway queries your healthcheck endpoint until it receives an HTTP 200 response. The default timeout is 300 seconds (5 minutes).

If your application takes time to:
- Initialize database connections
- Load large files into memory
- Warm up caches

...the healthcheck phase will reflect that startup time.

#### Post-Deploy (Drain Instances)

Railway stops and removes the previous deployment. By default, old deployments are given 0 seconds to gracefully shut down (configurable via `RAILWAY_DEPLOYMENT_DRAINING_SECONDS`).

## Is It Railway or My App?

Before diving into optimization, determine whether the slowness is on Railway's side or within your application. In the vast majority of cases, performance issues originate from the application itself, rather than the platform. This could be from inefficient queries, resource constraints, or configuration problems.

### Check Railway Status

Visit [status.railway.com](https://status.railway.com) to see if there are any ongoing incidents or degraded performance affecting the platform. If there's a platform-wide issue, it will be reported here. If status shows all systems operational, the issue is almost certainly within your application or its dependencies.

### Check Build Logs

Build logs show output from the build phase (installing dependencies, compiling code, creating the container image). The deployment view shows each phase with timing information.

Look for:
- Dependency installation steps that take disproportionately long
- Cache misses causing full rebuilds
- Large assets being processed

### Check Deployment Logs

Deployment logs show your application's stdout/stderr while it's running. These help diagnose runtime issues that occur after your app starts.

Look for:
- Database connection errors or timeouts
- Slow query warnings
- Application exceptions or errors
- Healthcheck failures

### Check Your Application Metrics

Railway provides [metrics](/guides/metrics) for CPU, memory, and network usage. High resource usage can indicate:
- Your application is resource-constrained
- Inefficient code paths
- Memory leaks causing garbage collection pressure

For deeper insights, consider integrating an Application Performance Monitoring (APM) tool like Datadog, New Relic, or open-source alternatives like OpenTelemetry. APM tools provide distributed tracing, helping you identify slow database queries, external API calls, and bottlenecks that Railway's built-in metrics don't capture.

### Analyze HTTP Logs

Railway captures detailed HTTP request logs for every request to your service. These logs are invaluable for identifying slow endpoints and understanding request patterns. For complete documentation on log features and filtering syntax, see the [Logs guide](/guides/logs).

**Key fields for performance troubleshooting:**

| Field | Description |
|-------|-------------|
| `totalDuration` | Total time from request received to response sent (ms) |
| `upstreamRqDuration` | Time your application took to respond (ms) |
| `httpStatus` | Response status code |
| `path` | Request path to identify which endpoints are slow |
| `responseDetails` | Error details if the request failed |
| `txBytes` / `rxBytes` | Response and request sizes |

**Finding slow requests:**

Use the log filter syntax to find requests exceeding a duration threshold:

```
@totalDuration:>1000
```

This finds all requests taking longer than 1 second. You can combine filters to narrow down:

```
@totalDuration:>500 @path:/api/users @method:GET
```

**Understanding the timing fields:**

- **`totalDuration`** includes everything: network time to/from the edge, time in the proxy, and your application's response time
- **`upstreamRqDuration`** is specifically how long your application took to respond

If `totalDuration` is high but `upstreamRqDuration` is low, the latency is in the network path (edge routing, DNS). If `upstreamRqDuration` is high, the slowness is in your application.

**Identifying error patterns:**

Filter by status code to find failing requests:

```
@httpStatus:>=500
```

Check `responseDetails` for specific error information, and `upstreamErrors` for details about connection failures to your application.

### Test Locally

If your app is slow on Railway but fast locally, consider:
- Are you hitting external services with higher latency?
- Are you using the correct region for your database?
- Is your application configured to use private networking?

## Common Causes of Slow Applications

### Database Queries

Slow database queries are one of the most common causes of application latency.

**Symptoms:**
- API endpoints that worked fast are now slow
- Timeouts on specific operations
- High CPU on your database service

**Solutions:**
- Add database indexes for frequently queried columns
- Use connection pooling
- Review slow query logs
- Consider read replicas for read-heavy workloads

### Wrong Region Configuration

If your application is in one region but your database is in another, every query incurs geographic latency as traffic travels between regions on Railway's network.

**Symptoms:**
- Consistently high latency on all database operations (typically 50-150ms+ per query depending on distance)

**Solutions:**
- Deploy your application in the same region as your database

### Not Using Private Networking

If services within the same project communicate over the public internet instead of [private networking](/guides/private-networking), you add unnecessary latency and incur [egress costs](/reference/pricing/plans#resource-usage-pricing). Private networking is for **server-to-server communication only**. It won't work for requests originating from a user's browser.

**Symptoms:**
- Using public URLs (e.g., `your-app.up.railway.app`) for inter-service communication
- Connection strings using public hostnames
- Unexpectedly high network egress charges on your bill

**Solutions:**
- Use `*.railway.internal` hostnames for service-to-service communication
- Update connection strings to use private networking addresses and ports
- For frontend applications that need to call backend APIs, use private networking from your server-side code (API routes, SSR) while keeping public URLs for client-side browser requests

**Example:**
```javascript
// Server-side code (API routes, SSR): use private networking
const apiUrl = "http://api.railway.internal:3000";

// Client-side code (browser): must use public URL
const apiUrl = "https://api.up.railway.app";
```

### Resource Constraints

Your application may be hitting resource limits, causing throttling or OOM (out of memory) kills.

**Symptoms:**
- Application crashes with exit code 137 (OOM killed)
- Consistently high CPU usage at 100%
- Slow response times during high load

**Solutions:**
- Check your [metrics](/guides/metrics) to see actual resource usage
- Adjust [resource limits](/guides/optimize-performance) if you're consistently hitting them
- Optimize your application's memory and CPU usage
- Consider [horizontal scaling](/reference/scaling#horizontal-scaling-with-replicas) for stateless workloads

### Large Container Images

Large images take longer to pull, especially on first deployment to a new compute node.

**Symptoms:**
- "Creating containers" phase takes several minutes
- Large build output size shown in build logs

**Solutions:**
- Use multi-stage Docker builds to reduce final image size
- Use smaller base images (e.g., Alpine variants)
- Exclude unnecessary files with `.dockerignore`
- Remove development dependencies from production builds

### Slow Application Startup

If your application takes time to initialize, it affects the healthcheck phase duration.

**Symptoms:**
- Healthcheck takes a long time to pass
- Application logs show initialization steps running

**Solutions:**
- Defer non-critical initialization to after the app is ready to serve traffic
- Use lazy loading for heavy dependencies
- Increase healthcheck timeout if startup time is legitimate
- Consider a dedicated healthcheck endpoint that responds before full initialization

## What Plan Upgrades Actually Do

Upgrading your plan increases your **resource limits**, not guaranteed performance. Understanding this distinction is important.

### What Upgrading Provides

| Plan | Per-Replica vCPU Limit | Per-Replica Memory Limit |
|------|------------------------|--------------------------|
| **Hobby** | 8 vCPU | 8 GB |
| **Pro** | 32 vCPU | 32 GB |
| **Enterprise** | Custom | Custom |

Upgrading raises the ceiling on how many resources a single replica can use. Your application only uses what it needs, up to the limit.

### When Upgrading Helps

Upgrading helps when:
- Your metrics show you're hitting current resource limits
- Your application needs more memory (e.g., processing large datasets)
- You need more CPU for compute-intensive tasks
- You want to run more replicas (higher replica limits on higher plans)

### When Upgrading Doesn't Help

Upgrading won't help when:
- Slowness is caused by external services (databases, APIs)
- Your application has inefficient code
- Network latency is the bottleneck
- You're not actually using your current resource allocation

**Always check your metrics before upgrading.** If your service uses 500MB of memory and 0.5 vCPU, upgrading from Hobby to Pro won't make it faster.

## Edge Routing and Latency

Railway operates edge proxies in multiple regions. For a complete overview of edge infrastructure, see the [Edge Networking reference](/reference/edge-networking). Understanding how traffic is routed helps diagnose latency issues.

### How Edge Routing Works

When a request comes in:
1. It hits the nearest Railway edge proxy
2. The edge proxy routes it to your service in the configured region
3. Your service processes the request and responds

You can see which edge handled a request via the `X-Railway-Edge` response header.

### Checking the Edge Header

```bash
curl -I https://your-app.up.railway.app | grep -i X-Railway-Edge
```

The header value shows the region, e.g., `railway/us-west2`.

### Why Traffic Might Hit the Wrong Edge

- DNS caching: Your local DNS resolver may have cached an old record
- CDN/Proxy interference: Services like Cloudflare route based on their own logic
- Geographic routing: Users in certain regions may be routed suboptimally

### Optimizing for Global Users

If you have users worldwide, you can use [multi-region replicas](/reference/scaling#multi-region-replicas) to deploy stateless services closer to your users. Railway automatically routes traffic to the nearest region.

**Note:** Multi-region works well for stateless application servers, but databases typically run in a single region. If your app is deployed globally but your database is in one region, replicas far from the database will still experience latency on database queries. To mitigate this:
- Use application-level caching to reduce database round-trips
- Consider database read replicas in additional regions for read-heavy workloads
- Accept the latency trade-off for writes, which must go to the primary database

### Private Networking and Edge

Private networking (`*.railway.internal`) bypasses the edge entirely. Services communicate directly within Railway's infrastructure, which is faster than going through the public internet.

## When to Contact Support

Contact Railway support through [Central Station](https://station.railway.com) if:

- Deployments are consistently slow with no apparent cause
- You see **544 Railway Proxy Error** responses, which indicate a platform-side issue (as opposed to 502 errors, which indicate application issues)
- The status page shows no issues but you're experiencing degraded performance
- You need help optimizing your deployment configuration

**Tip:** When reporting issues, include the `X-Railway-Request-Id` header from affected requests. This unique identifier helps Railway support trace your request through the infrastructure. You can find it in your HTTP response headers.
