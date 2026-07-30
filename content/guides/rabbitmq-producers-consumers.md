---
title: Deploy RabbitMQ and Wire Up Producers and Consumers
description: Run RabbitMQ on Railway, expose the management UI, and connect producer and consumer services over private networking with Node.js and amqplib.
date: "2026-07-29"
tags:
  - rabbitmq
  - message-queues
  - private-networking
  - workers
topic: integrations
---

RabbitMQ is a message broker that sits between the services that create work (producers) and the services that process it (consumers). Producers publish messages to the broker and move on. Consumers pull messages at their own pace and acknowledge each one after processing; a failed message can be retried or dead-lettered instead of lost. This decouples request handling from slow work like sending email, processing uploads, or calling external APIs. This guide deploys RabbitMQ on Railway and connects a producer and a consumer to it over private networking.

On Railway, a typical setup is three services in one project:

1. **RabbitMQ**: the broker, deployed from a template or Docker image, with a volume for message persistence.
2. **Producer**: your API service. It accepts requests and publishes messages.
3. **Consumer**: a worker service with no public domain. It consumes messages and does the work.

The services talk to each other over [private networking](/networking/private-networking), so broker traffic never leaves your project and generates no egress charges.

## Deploy RabbitMQ

### Option 1: use a template

Search the <a href="https://railway.com/templates" target="_blank">template marketplace</a> for RabbitMQ and click **Deploy Now**. Templates come preconfigured with credentials and a volume. You can also add a template to an existing project: click **+ New** on your project canvas and select **Template**. See [deploy a template](/templates/deploy) for the full flow.

### Option 2: deploy the Docker image

If you prefer to configure it yourself:

1. In your project, click **+ New**, choose **Docker Image**, and enter `rabbitmq:4-management`. The `-management` tag includes the web management UI.
2. In the service's **Variables** tab, set the default credentials:

```
RABBITMQ_DEFAULT_USER=admin
RABBITMQ_DEFAULT_PASS=<generate a strong password>
```

3. Attach a [volume](/volumes) so messages survive restarts. Create a volume from the command palette (`⌘K`) or by right-clicking the project canvas, connect it to the RabbitMQ service, and set the mount path to `/var/lib/rabbitmq`. Without a volume, queues and messages are lost whenever the container restarts. Volumes cost $0.15 per GB per month and are only mounted at runtime, not during builds.
4. Deploy. RabbitMQ listens for AMQP connections on port `5672` and serves the management UI on port `15672`.

## Expose the management UI

The management UI is a regular HTTP app, so you can put it behind a Railway domain:

1. Open the RabbitMQ service's **Settings** tab.
2. In the **Networking** section, generate a domain and set the target port to `15672`.
3. Open the generated `*.up.railway.app` URL and log in with `RABBITMQ_DEFAULT_USER` and `RABBITMQ_DEFAULT_PASS`.

From the UI you can watch queue depth, message rates, consumer counts, and unacknowledged messages. Anyone with the URL can reach the login page, so use a strong password.

## Connect over private networking

Every service in an environment gets an internal DNS name at `<service-name>.railway.internal`. If your broker service is named `rabbitmq`, producers and consumers in the same environment reach it at `rabbitmq.railway.internal:5672`. That reachability stops at the environment boundary, so your staging services cannot reach your production broker.

Instead of hardcoding credentials in each service, define one `RABBITMQ_URL` variable on the producer and consumer using [reference variables](/variables):

```
RABBITMQ_URL=amqp://${{rabbitmq.RABBITMQ_DEFAULT_USER}}:${{rabbitmq.RABBITMQ_DEFAULT_PASS}}@${{rabbitmq.RAILWAY_PRIVATE_DOMAIN}}:5672
```

Railway resolves the references at deploy time. Rotate the password on the broker and both services pick it up on their next deploy.

Private networking has two limits:

- It is available at runtime only. Do not try to connect to RabbitMQ from a build step.
- Use plain `amqp://`, not `amqps://`. Traffic between services is already encrypted with WireGuard.

If an external system outside Railway must publish or consume directly, enable [TCP Proxy](/networking/tcp-proxy) on the RabbitMQ service with internal port `5672`. Railway generates a public `domain:port` pair that proxies raw TCP to the broker. Keep this off unless you need it; internal services should use the private address.

## Write the producer

The producer is an HTTP API that publishes a message for each incoming request. We use Express and amqplib.

Install the dependencies:

```bash
npm install express amqplib
```

```javascript
// producer.js
const express = require("express");
const amqp = require("amqplib");

const QUEUE = "tasks";
let channel = null;

async function connect() {
  const connection = await amqp.connect(process.env.RABBITMQ_URL);
  connection.on("close", () => {
    console.error("RabbitMQ connection closed, exiting");
    process.exit(1); // Railway restarts the service
  });
  channel = await connection.createChannel();
  await channel.assertQueue(QUEUE, { durable: true });
}

const app = express();
app.use(express.json());

app.post("/jobs", (req, res) => {
  if (!channel) {
    return res.status(503).json({ error: "broker not connected" });
  }
  const payload = Buffer.from(JSON.stringify(req.body));
  channel.sendToQueue(QUEUE, payload, { persistent: true });
  res.status(202).json({ queued: true });
});

app.get("/health", (req, res) => {
  if (!channel) {
    return res.status(503).json({ ok: false });
  }
  res.json({ ok: true });
});

const port = process.env.PORT || 3000;

connect()
  .then(() => {
    app.listen(port, () => console.log(`Producer listening on ${port}`));
  })
  .catch((err) => {
    console.error("Failed to connect to RabbitMQ:", err.message);
    process.exit(1);
  });
```

Two details matter for durability. The queue is declared with `durable: true`, so the queue definition survives a broker restart. Each message is published with `persistent: true`, so the message itself is written to disk on the volume. You need both, plus the volume on the broker, for messages to survive a restart.

The `/health` endpoint returns 503 until the broker connection is up. Set it as the service's [healthcheck](/deployments/healthchecks) path in the deploy settings so a deploy is only marked live once the producer can publish. Healthchecks also guarantee zero-downtime deploys: the old version keeps serving until the new one passes.

## Write the consumer

The consumer is a plain worker with no HTTP server and no public domain. Deploy it as its own service in the same project.

```bash
npm install amqplib
```

```javascript
// consumer.js
const amqp = require("amqplib");

const QUEUE = "tasks";

async function handleJob(job) {
  // Replace with real work: send an email, resize an image, call an API.
  console.log("Processing job:", job);
}

async function main() {
  const connection = await amqp.connect(process.env.RABBITMQ_URL);
  connection.on("close", () => {
    console.error("RabbitMQ connection closed, exiting");
    process.exit(1); // Railway restarts the service
  });

  const channel = await connection.createChannel();
  await channel.assertQueue(QUEUE, { durable: true });
  channel.prefetch(5);

  await channel.consume(QUEUE, async (msg) => {
    if (!msg) return;
    try {
      const job = JSON.parse(msg.content.toString());
      await handleJob(job);
      channel.ack(msg);
    } catch (err) {
      console.error("Job failed:", err.message);
      // Requeue once; drop on redelivery to avoid poison-message loops.
      channel.nack(msg, false, !msg.fields.redelivered);
    }
  });

  console.log(`Consuming from "${QUEUE}"`);
}

main().catch((err) => {
  console.error("Failed to start consumer:", err.message);
  process.exit(1);
});
```

Key decisions in this code:

- **Manual acknowledgment.** The consumer calls `channel.ack(msg)` only after the job succeeds. If the consumer crashes mid-job, RabbitMQ redelivers the message to another consumer.
- **Prefetch.** `channel.prefetch(5)` caps unacknowledged messages per consumer at 5. Without it, RabbitMQ pushes the entire queue to the first consumer that connects.
- **Poison messages.** On failure, the message is requeued once (`!msg.fields.redelivered`). If it fails again it is dropped. For production, configure a dead-letter exchange instead of dropping.
- **Exit on disconnect.** When the broker connection closes, the process exits with a non-zero code and Railway restarts the service, which reconnects cleanly.

To process more messages in parallel, scale the consumer service to multiple replicas or increase the prefetch count. Those extra replicas help because RabbitMQ distributes messages across all consumers on the same queue.

Do not enable serverless (app sleeping) on the consumer or the broker. An idle consumer still needs its open AMQP connection, and the heartbeat traffic on that connection counts as outbound activity, so the service would never sleep anyway.

## Test the pipeline

Publish a job through the producer's public domain:

```bash
curl -X POST https://your-producer.up.railway.app/jobs \
  -H "Content-Type: application/json" \
  -d '{"type": "welcome-email", "userId": 42}'
```

Then check two places:

1. The consumer service's logs should show `Processing job: { type: 'welcome-email', userId: 42 }`.
2. The management UI's **Queues** tab should show the `tasks` queue with a brief spike in message rate and zero messages ready.

If messages pile up as "Ready" with no consumers listed, the consumer is not connected: check its logs for a bad `RABBITMQ_URL` or a service name mismatch in the reference variable.

## Next steps

- [Choose between cron jobs, background workers, and queues](/guides/cron-workers-queues) for when RabbitMQ is the right tool.
- [Private networking](/networking/private-networking) for how internal DNS and environment isolation work.
- [Variables](/variables) for reference variables and shared variables across services.
- [Scaling your application](/guides/scaling-your-application) for adding replicas to consumers.
