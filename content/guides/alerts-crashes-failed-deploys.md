---
title: Set Up Alerts for Crashes, Restarts, and Failed Deploys
description: Configure Railway webhooks and monitors to get notified in Slack, Discord, or your own service when a deployment fails, crashes, or a resource threshold is crossed.
date: "2026-07-29"
tags:
  - alerts
  - webhooks
  - monitoring
  - observability
topic: infrastructure
---

Railway has two native alerting mechanisms: project webhooks, which push deployment status changes and alert events to any URL, and monitors, which watch resource metrics and notify you when a threshold is crossed. Together they cover failed builds, crashed deployments, and resource exhaustion, so you hear about a crashed service before your users do. This guide sets up both, routes alerts to Slack and Discord, and builds a small receiver service for custom handling.

## What Railway alerts on natively

Railway emits events through [project webhooks](/observability/webhooks) for:

- **Deployment status changes**: every state transition, including `Failed` (build or deploy error) and `Crashed` (a running deployment exited unexpectedly). The full list of states is in the [deployments reference](/deployments/reference).
- **Volume usage alerts**: a volume approaching capacity.
- **CPU/RAM monitor alerts**: a monitor threshold you configured was exceeded.

Separately, [monitors](/observability) on the Observability Dashboard send email and in-app notifications when CPU, RAM, disk usage, or network egress crosses a threshold you set, and that feature requires the Pro plan. Webhooks fire for monitor alerts too, so one webhook URL can receive everything.

For billing rather than infrastructure, you can also set a [custom email alert on usage](/pricing/cost-control) that emails you when workspace spend reaches an amount you choose.

## Set up a project webhook

Webhooks are configured per project and fire across all environments in that project.

1. Open your project on Railway.
2. Click **Settings** in the top right corner.
3. Go to the **Webhooks** tab.
4. Enter the URL that should receive events.
5. Optionally select which events to receive.
6. Click **Save Webhook**.

Use the **Test Webhook** button to send a test payload. Test payloads are sent from your browser, so CORS restrictions on the receiving end can make a working endpoint look like a delivery failure. So trigger a real deployment to confirm end to end.

## Send alerts to Slack or Discord

Railway detects Slack and Discord webhook URLs and transforms the payload to match what those platforms expect, in what Railway calls a Muxer. You do not need any middleware.

For Slack:

1. Enable incoming webhooks for your Slack workspace and create a `hooks.slack.com` webhook URL for the channel that should receive alerts.
2. Paste that URL into your Railway project's Webhooks tab and save.

For Discord:

1. In your Discord server, open the channel settings, go to **Integrations**, then **Webhooks**, and create a webhook.
2. Copy the webhook URL and paste it into your Railway project's Webhooks tab and save.

From then on, deployment status changes for that project post directly to the channel.

## Understand the webhook payload

For non-Muxer URLs, Railway sends JSON whose `type` field identifies the event, for example `Deployment.failed`, and whose `resource` block tells you which workspace, project, environment, service, and deployment the event belongs to:

```json
{
  "type": "Deployment.failed",
  "details": {
    "id": "8107edff-4b8e-44fc-b43a-04566e847a2a",
    "source": "GitHub",
    "branch": "main",
    "commitHash": "abc123",
    "commitAuthor": "octocat",
    "commitMessage": "fix: handle null response"
  },
  "resource": {
    "workspace": { "id": "...", "name": "..." },
    "project": { "id": "...", "name": "my-project" },
    "environment": { "id": "...", "name": "production", "isEphemeral": false },
    "service": { "id": "...", "name": "api" },
    "deployment": { "id": "..." }
  },
  "severity": "WARNING",
  "timestamp": "2025-11-21T23:48:42.311Z"
}
```

## Build a custom alert receiver

Slack and Discord cover most cases. Build your own receiver when you want to filter noise (for example, only production failures), page an on-call rotation, or feed events into another system.

Create a new project:

```bash
mkdir railway-alert-receiver && cd railway-alert-receiver
npm init -y
npm install express
```

Create `server.js`:

```javascript
const express = require("express");

const app = express();
app.use(express.json());

// Event types that should trigger an alert.
// Railway sends types like "Deployment.failed" for deployment
// state changes, plus volume and monitor alert events.
const ALERT_SUFFIXES = ["failed", "crashed"];

function shouldAlert(event) {
  const type = (event.type || "").toLowerCase();
  return ALERT_SUFFIXES.some((suffix) => type.endsWith(suffix));
}

app.post("/railway-webhook", async (req, res) => {
  const event = req.body;

  // Acknowledge immediately so Railway does not see a slow endpoint.
  res.status(200).json({ received: true });

  if (!shouldAlert(event)) {
    console.log(`Ignoring event: ${event.type}`);
    return;
  }

  const project = event.resource?.project?.name ?? "unknown project";
  const service = event.resource?.service?.name ?? "unknown service";
  const environment = event.resource?.environment?.name ?? "unknown env";

  // Only alert for production. Drop this check to alert on every environment.
  if (environment !== "production") {
    console.log(`Skipping non-production event in ${environment}`);
    return;
  }

  const message = `${event.type}: ${service} in ${project} (${environment}) at ${event.timestamp}`;
  console.error(message);

  // Forward anywhere: a paging service, an internal API, a queue.
  if (process.env.FORWARD_URL) {
    try {
      await fetch(process.env.FORWARD_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: message, event }),
      });
    } catch (err) {
      console.error("Failed to forward alert:", err);
    }
  }
});

app.get("/health", (_req, res) => res.status(200).send("ok"));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Alert receiver listening on port ${port}`);
});
```

The handler acknowledges with a 200 before doing any work, filters to failure and crash events in production, and optionally forwards a formatted message to `FORWARD_URL`.

## Deploy the receiver on Railway

The receiver is a normal service. Deploy it in its own project so an outage in the project you are monitoring cannot take your alerting down with it.

1. Push the code to a GitHub repository and create a new Railway project from it, or run `railway init` and `railway up` from the directory with the [CLI](/cli).
2. Railway detects Node and builds it with no extra configuration. The app reads the `PORT` environment variable, which Railway injects.
3. Generate a public domain for the service in its settings. You get a `*.up.railway.app` domain.
4. Set `FORWARD_URL` as a [service variable](/variables) if you want forwarding.
5. In the project you want to monitor, add `https://<your-receiver-domain>/railway-webhook` as the webhook URL.

Add a [health check](/deployments/healthchecks) pointing at `/health` so deploys of the receiver itself only go live once the server is accepting traffic. That check is HTTP only.

## Add monitors for resource thresholds

Webhooks tell you after something failed. Monitors can tell you before: a service climbing toward its memory limit is often a crash you can still prevent.

1. Open the **Observability** tab in your project and make sure you are in the right environment.
2. Create a widget for the metric you care about (CPU, memory, disk, or network) if you do not have one.
3. Click the three dot menu on the widget and select **Add monitor**.
4. Configure the threshold. Monitors can trigger above or below a limit for CPU, RAM, disk usage, and network egress.

Monitor alerts arrive by email and in-app notification, and also fire your project webhook, so they land in the same Slack or Discord channel as deployment failures.

This requires the Pro plan, and the Observability Dashboard is scoped per environment, so set up monitors in each environment you want covered.

## Restarts: what Railway already handles

Alerting complements the [restart policy](/deployments/restart-policy) rather than replacing it. By default, Railway restarts a crashed service automatically (`On Failure`, up to 10 restarts). With multiple [replicas](/deployments/scaling), only the crashed replica restarts while the others keep serving traffic.

That restart policy means a single transient crash often self-heals before anyone reacts. A useful alerting posture builds on it:

- Let the restart policy absorb one-off crashes.
- Alert on `Deployment.failed` immediately: a failed build or deploy never self-heals.
- Treat repeated crash events for the same service in a short window as a page, not a log line. The receiver above is the place to add that counting logic.

## Next steps

- [Webhooks reference](/observability/webhooks): payload details, Muxers, and troubleshooting.
- [Connect a Third-Party Observability Tool](/guides/third-party-observability): ship logs and metrics to Datadog, Grafana, or similar for alerting with longer retention.
- [Deploy an OpenTelemetry Collector and Backend on Railway](/guides/deploy-an-otel-collector-stack): application-level traces and metrics beyond platform events.
- [GitHub Actions Post-Deploy](/guides/github-actions-post-deploy): run checks and notifications from CI after a deployment.
