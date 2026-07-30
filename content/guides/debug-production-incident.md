---
title: Debug a Production Incident with Logs, Metrics, and Traces
description: A step-by-step incident debugging workflow using Railway's built-in observability surfaces. Confirm scope with metrics, find the failure in HTTP and deployment logs, correlate requests, and mitigate with a rollback.
date: "2026-07-29"
tags:
  - observability
  - incident-response
  - logs
  - metrics
topic: infrastructure
---

A production incident is any user-visible failure in a deployed service: elevated error rates, slow responses, crashes, or a dependency that stopped answering. This guide debugs one with Railway's built-in observability tools, in the order you would use them during a live incident. Debugging one is a narrowing exercise: you start from a broad signal (an alert, a user report), confirm the scope, find what changed, and isolate the failing request path.

Railway gives you several built-in surfaces for this work:

- **Metrics**: CPU, memory, disk, and network per service, with deployment markers on every graph.
- **Logs**: build, deployment, environment-wide, HTTP, and DNS logs, all queryable with the same filter syntax.
- **Observability dashboard**: a per-environment view that combines metrics and logs, with configurable monitors.
- **Deployment actions**: rollback and restart, your fastest mitigations.

Railway does not collect distributed traces natively. The last section covers what you get instead: request-level HTTP logs, log correlation with request IDs, and how to add real tracing with OpenTelemetry.

## Step 1: Confirm the scope

Before reading a single log line, establish what is actually broken and how widely.

Open the **Observability** tab in your project's top navigation and make sure you are in the right environment (for example, `production`). The [Observability dashboard](/observability) is scoped per environment. If you have not set it up, click "Start with a simple dashboard" and Railway autogenerates widgets for spend, service metrics, and logs.

Questions to answer here:

- **One service or several?** If multiple services show errors at once, suspect a shared dependency: the database, a cache, or an upstream API.
- **When did it start?** Fix the time window now. Every query you run later should use it.
- **Is it resource pressure?** Click the affected service on the project canvas and open the **Metrics** tab. Look for memory climbing toward the limit, CPU pinned, or disk filling up. Railway keeps up to 30 days of metrics per project, so you can compare against last week's baseline.

If the service runs multiple replicas, switch the metrics view from **Sum** to **Replica**. One replica pinned at 100% CPU while the others idle points at a bad instance or uneven load, not a code bug.

## Step 2: Find what changed

Most incidents follow a change. Railway's metrics graphs draw a dotted line at every deployment, so a spike that starts at a dotted line is strong evidence the deploy caused it.

Check, in order:

1. **A recent deployment.** The metrics graph shows which commit each deployment came from. If the incident started at a deploy marker, read that commit.
2. **A crashed deployment.** Railway automatically restarts crashed deployments up to 10 times depending on your [restart policy](/deployments/restart-policy). After that, the deployment status changes to `Crashed` and project members are notified. A service stuck in a crash loop shows this pattern clearly in its deploy logs.
3. **A dependency change.** No deploy on your side does not mean no change. A database that filled its disk or an external API that started timing out will not show up in your git history, but it will show up in logs.

If a fresh deploy is the obvious cause, skip ahead to [Step 6](#step-6-mitigate) and roll back first. Debug the root cause after users stop seeing errors.

## Step 3: Query HTTP logs for the failing requests

For services behind a public domain, HTTP logs are the fastest way to characterize the failure. Open the deployment, click the **Network** tab, or query HTTP logs from the Log Explorer in the Observability tab.

Railway's [filter syntax](/observability/logs#filtering-logs) supports attribute filters, boolean operators, and numeric comparisons. Useful incident queries:

Find all server errors:

```text
@httpStatus:500..599
```

Find errors on a specific endpoint:

```text
@path:/api/checkout AND @httpStatus:>=500
```

Find slow requests, which often precede errors when a dependency is degrading:

```text
@responseTime:>1000
```

Find requests that errored and were slow, the usual timeout signature:

```text
@totalDuration:>5000 @httpStatus:>=500
```

Check whether the app failed to respond at all. The `@responseDetails` attribute is only populated when the application fails to respond, so its presence is itself a signal:

```text
@responseDetails:"connection refused"
```

Check whether the problem is limited to one region by filtering on edge region:

```text
@httpStatus:>=500 AND @edgeRegion:europe-west4-drams3a
```

What these queries tell you:

- **Errors on every path**: the process itself is unhealthy (crash loop, out of memory, cannot reach the database).
- **Errors on one path**: a specific handler or the dependency only that handler uses.
- **Slow responses without errors yet**: a saturating dependency. You caught it early.
- **`@responseDetails` populated**: requests never reached a healthy process. Look at deploy logs next.

## Step 4: Drill into deployment logs

HTTP logs tell you requests failed. Deployment logs tell you why. Click the deployment in the service window to see its logs, or use the Log Explorer to search across the whole environment.

Start with errors in your fixed time window:

```text
@level:error
```

Narrow by message once you see the shape of the failure:

```text
@level:error AND "ECONNREFUSED"
```

When you find a relevant line, right-click it and select **View in Context** to see the surrounding logs. Stack traces and the requests that triggered them usually sit within a few lines of each other.

For incidents spanning services, environment logs let you query everything in one place and cut noise with service filters:

```text
@level:error AND -@service:<postgres_service_id>
```

Two things make this step more effective, and both are code changes worth making before your next incident:

**Emit structured logs.** Logs printed as single-line JSON get parsed into queryable attributes:

```json
{ "level": "error", "message": "payment failed", "orderId": "ord_123", "userId": 456 }
```

Then `@orderId:ord_123` finds every log line for that order. Libraries like Winston (Node.js) or structlog (Python) emit this format for you. The JSON must be on a single line to be parsed.

**Mind the logging rate limit.** Railway drops log lines beyond 500 per second per replica and prints a warning when it happens. An incident that triggers verbose error logging can hit this limit exactly when you need logs most. Prefer sampling over raw verbosity.

## Step 5: Check DNS logs for dependency failures

If deployment logs show connection errors to another service, DNS logs settle whether the problem is name resolution or the service itself. Railway logs every DNS lookup by default, including lookups over the [private network](/networking/private-networking). Open a deployment, click the **Network** tab, and select the **DNS** view.

Find all failed lookups:

```text
@status:failed
```

Check private network resolution specifically. Private networking is scoped per environment, and services resolve at `<service>.railway.internal`:

```text
@zone:internal AND @status:failed
```

Find failures for one dependency:

```text
@domain:api.stripe.com AND @status:failed
```

Interpretation:

- **`NXDOMAIN` on an internal name**: the target service does not exist in this environment, or the name is misspelled. Common after copying config between environments.
- **`TIMEOUT` or `SERVFAIL` on external names**: an upstream DNS or network problem, not your code.
- **DNS resolves fine but connections still fail**: the dependency is up at the network level but refusing or dropping connections. Go look at that service's own logs and metrics.

## Step 6: Mitigate

Once you know (or strongly suspect) the cause, mitigate before you finish the diagnosis.

**Roll back a bad deploy.** In the service's deployment list, click the three dots on a previous successful deployment and confirm the rollback. Railway restores both the Docker image and the custom variables from that deployment, so a rollback also reverts a bad variable change. That restore only works within your plan's image retention window, so the option only appears on eligible deployments. See [deployment actions](/deployments/deployment-actions) for details.

**Restart a crashed service.** A deployment marked `Crashed` (past its automatic restart limit) shows a **Restart** button inline on the deployment. Restarting restores the exact original image and configuration.

**Redeploy.** If the cause was transient (a dependency outage that has recovered), redeploying the current version gives you a clean process without reverting code.

For future incidents, configure a [health check](/deployments/healthchecks) on your service. Railway health checks are HTTP-only, and with one configured, new deployments only receive traffic after they report healthy. That converts a category of bad deploys from "incident" into "failed deploy that never took traffic."

## Tracing options

Railway does not run a tracing backend, and container metrics do not include application-level data like per-endpoint latency histograms. You have three options, in increasing order of effort:

**1. Use HTTP logs as request-level traces.** Every HTTP log line carries `@requestId`, `@totalDuration`, `@responseTime` (time to first byte), and `@upstreamRqDuration`. For a single service, this answers most "where did the time go" questions: a large gap between `@responseTime` and `@totalDuration` means the response body streamed slowly, while a high `@upstreamRqDuration` means your process was slow to answer.

**2. Correlate logs with your own request ID.** Generate an ID per request, attach it to every structured log line that request produces, and return it in a response header so users can report it:

```javascript
const { randomUUID } = require("node:crypto");

function withRequestId(handler) {
  return async (req, res) => {
    const requestId = randomUUID();
    res.setHeader("x-request-id", requestId);
    const log = (level, message, extra = {}) =>
      console.log(JSON.stringify({ level, message, requestId, ...extra }));
    try {
      await handler(req, res, log);
    } catch (err) {
      log("error", err.message, { stack: err.stack });
      res.statusCode = 500;
      res.end("internal error");
    }
  };
}

module.exports = { withRequestId };
```

This uses only the Node.js standard library, so there is nothing to install. During an incident, one filter returns every log line a request produced:

```text
@requestId:3f8a2c1e-9b4d-4f6a-8c2d-1e5b7a9c3d2f
```

**3. Add real distributed tracing.** For multi-service request flows, deploy an OpenTelemetry collector as a Railway service and instrument your apps with OTel SDKs, or use a vendor SDK directly. See [Deploy an OpenTelemetry Collector Stack](/guides/deploy-an-otel-collector-stack) and [Connect a Third-Party Observability Tool](/guides/third-party-observability). This is also the answer for log retention beyond your plan's window (7 days on Hobby, 30 on Pro, up to 90 on Enterprise).

## Prepare for the next incident

Ten minutes of setup makes the next incident shorter:

- **Create monitors.** On the Observability dashboard (Pro plan), add a monitor to any widget via its three-dot menu. Monitors alert by email and in-app notification when CPU, RAM, disk usage, or network egress crosses a threshold.
- **Wire up webhooks.** Project settings include a [Webhooks](/observability/webhooks) tab. Webhooks fire on deployment status changes, volume usage alerts, and CPU/RAM monitor alerts, and Railway automatically formats payloads for Discord and Slack URLs. One of those, a deployment failure alert in your team channel, beats a user report by minutes.
- **Adopt structured logging everywhere.** Attribute filters only work on logs emitted as single-line JSON.
- **Configure health checks and a restart policy.** They handle the mechanical mitigations automatically.

## Next steps

- [Logs](/observability/logs): the full filter syntax reference for deployment, HTTP, and DNS logs.
- [Metrics](/observability/metrics): reading service metrics, including per-replica views.
- [Deploy an OpenTelemetry Collector Stack](/guides/deploy-an-otel-collector-stack): add distributed tracing across services.
- [Connect a Third-Party Observability Tool](/guides/third-party-observability): longer retention and application-level metrics.
