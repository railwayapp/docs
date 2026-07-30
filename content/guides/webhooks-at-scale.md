---
title: Receive Webhooks at Scale
description: Build a webhook receiver that verifies signatures, responds fast, and queues work for a background worker. Covers idempotency keys, retries, and how to run the pattern on Railway.
date: "2026-07-29"
tags:
  - webhooks
  - architecture
  - queues
  - workers
topic: architecture
---

A webhook receiver at scale does three things, in this order: verify the signature, acknowledge with a 200 immediately, and queue the actual work for a separate process. Everything else (retries, deduplication, backpressure) follows from keeping those three steps separate.

In this guide we build that pattern on Railway with two Node.js services and Redis: a receiver that stays thin, and a worker that processes jobs from a BullMQ queue.

## Why you should not process webhooks inline

Providers like Stripe, GitHub, and Shopify expect a response within a few seconds. If your handler updates a database, calls another API, and sends an email before responding, three things go wrong under load:

- **Timeouts trigger retries.** The provider marks the delivery failed and sends it again, so slow processing multiplies your traffic.
- **Retries create duplicates.** All three providers deliver at least once, so if a retry arrives while the first attempt is mid-flight, you process the same event twice.
- **Spikes take down the receiver.** A backfill or a burst of activity can deliver thousands of events in seconds, and inline processing ties each one to an open HTTP request.

Queuing decouples ingestion rate from processing rate. The receiver absorbs the spike; the worker drains the queue at its own pace.

## Architecture on Railway

Create one Railway project with three services in the same environment:

1. **Receiver**: a public HTTP service. Verifies signatures, enqueues jobs, returns 200.
2. **Redis**: deployed from the Railway Redis template. Holds the queue.
3. **Worker**: a private service with no public domain. Consumes jobs and does the work.

The receiver and worker talk to Redis over [private networking](/networking/private-networking) at `redis.railway.internal`. Private networking is scoped per environment, so production and staging queues never mix.

None of that affects response time, though. Railway's edge allows HTTP requests to run for up to 15 minutes while data keeps transferring, but that limit is irrelevant here: your receiver should respond in well under a second, because the provider's own timeout is the constraint.

## Step 1: Verify the signature

Providers sign each delivery with a shared secret, usually an HMAC of the raw request body. Two rules matter:

- **Verify against the raw bytes.** If your framework parses JSON before you compute the HMAC, re-serialized output will not match what the provider signed. In Express, mount `express.raw()` on the webhook route.
- **Compare in constant time.** Use `crypto.timingSafeEqual`, not `===`, to avoid timing attacks.

Reject anything that fails verification with a 401 and do not enqueue it.

## Step 2: Respond 200, then do nothing else

Once the signature checks out, enqueue the event and respond. The 200 means "received", not "processed". If enqueueing fails (Redis is unreachable), return a 500 so the provider retries later; that is what provider retries are for.

## Step 3: Queue with an idempotency key

An idempotency key is a stable identifier for one logical event. Processing an event twice under the same key has the same effect as processing it once. Most providers give you one: Stripe sends an event `id`, GitHub sends an `X-GitHub-Delivery` header, Shopify sends `X-Shopify-Webhook-Id`.

Use that identifier as the BullMQ `jobId`. BullMQ refuses to enqueue a second job with the same `jobId` while the first is queued, active, or retained after completion, so provider retries collapse into one job.

## The receiver

Create the receiver service:

```bash
mkdir webhook-receiver && cd webhook-receiver
npm init -y
npm install express bullmq
```

`server.js`:

```javascript
const crypto = require("node:crypto");
const express = require("express");
const { Queue } = require("bullmq");

const app = express();
const secret = process.env.WEBHOOK_SECRET;

const redisURL = new URL(process.env.REDIS_URL);

const queue = new Queue("webhooks", {
  connection: {
    family: 0,
    host: redisURL.hostname,
    port: Number(redisURL.port),
    username: redisURL.username,
    password: redisURL.password,
  },
});

function verifySignature(rawBody, signatureHeader) {
  if (!signatureHeader) return false;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");
  const received = Buffer.from(signatureHeader, "utf8");
  const computed = Buffer.from(expected, "utf8");
  if (received.length !== computed.length) return false;
  return crypto.timingSafeEqual(received, computed);
}

// Raw body on this route only: signature is computed over the exact bytes.
app.post(
  "/webhooks",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    if (!verifySignature(req.body, req.get("X-Signature-256"))) {
      return res.status(401).send("invalid signature");
    }

    const event = JSON.parse(req.body.toString("utf8"));
    const idempotencyKey = req.get("X-Delivery-Id") || event.id;

    if (!idempotencyKey) {
      return res.status(400).send("missing delivery id");
    }

    try {
      await queue.add("process-event", event, {
        jobId: idempotencyKey,
        attempts: 5,
        backoff: { type: "exponential", delay: 5000 },
        removeOnComplete: { age: 86400 },
        removeOnFail: false,
      });
    } catch (err) {
      console.error("enqueue failed", err);
      // 500 tells the provider to retry the delivery later.
      return res.status(500).send("queueing failed");
    }

    res.status(200).send("ok");
  }
);

app.get("/health", (req, res) => res.status(200).send("ok"));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`receiver listening on ${port}`));
```

Adjust the header names (`X-Signature-256`, `X-Delivery-Id`) to match your provider. The signature scheme here is plain HMAC-SHA256 of the body; some providers prefix the header (GitHub uses `sha256=...`) or sign a timestamped payload (Stripe), so follow their docs for the exact string to hash.

The `family: 0` option tells the underlying Redis client to resolve both IPv4 and IPv6 addresses, which is required for Railway's [private network](/networking/private-networking).

Note `removeOnComplete: { age: 86400 }`: completed jobs are kept for 24 hours, so a provider retry arriving within that window hits the duplicate `jobId` and is dropped. Removing completed jobs immediately would reopen the duplicate window.

## The worker

Create the worker service:

```bash
mkdir webhook-worker && cd webhook-worker
npm init -y
npm install bullmq
```

`worker.js`:

```javascript
const { Worker } = require("bullmq");

const redisURL = new URL(process.env.REDIS_URL);

const worker = new Worker(
  "webhooks",
  async (job) => {
    const event = job.data;
    console.log(`processing ${job.id} (${event.type})`);

    // Your actual work goes here: update the database, call APIs,
    // send emails. Make each step idempotent where possible, for
    // example with upserts keyed on job.id.
    await handleEvent(event);
  },
  {
    connection: {
      family: 0,
      host: redisURL.hostname,
      port: Number(redisURL.port),
      username: redisURL.username,
      password: redisURL.password,
    },
    concurrency: 10,
  }
);

async function handleEvent(event) {
  switch (event.type) {
    case "payment.succeeded":
      // upsert payment record
      break;
    default:
      console.log(`ignoring event type ${event.type}`);
  }
}

worker.on("failed", (job, err) => {
  console.error(`job ${job?.id} failed: ${err.message}`);
});

worker.on("error", (err) => {
  console.error("worker error", err);
});
```

The worker retries failed jobs 5 times with exponential backoff (configured on the queue side via `attempts` and `backoff`). Jobs that exhaust their retries stay in the failed set for inspection.

The `jobId` deduplication protects you from enqueueing duplicates, but not from a job that crashes halfway through and retries. For work that must not repeat (charging a card, sending an email), add a second idempotency layer inside the handler: an upsert or a unique-constraint insert on the idempotency key in your database, checked before the side effect runs.

## Deploy on Railway

1. Create a project and deploy Redis from the template. It provides `REDIS_URL`.
2. Deploy the receiver from its repo. In its variables, set `REDIS_URL` to a [reference variable](/variables) pointing at the Redis service's private URL, and set `WEBHOOK_SECRET` to the secret from your provider.
3. Deploy the worker the same way. Do not generate a public domain for it; it only talks to Redis.
4. Generate a public domain for the receiver under Settings, then register `https://<your-domain>/webhooks` with your provider.

Two settings worth configuring on the receiver:

- **Healthcheck**: set the healthcheck path to `/health` in service settings. Railway then performs [zero-downtime deploys](/deployments/healthchecks), so a deploy does not drop incoming deliveries.
- **Restart policy**: the default restart-on-failure keeps the receiver up if it crashes.

Do not enable serverless on the receiver. Webhooks arrive on the provider's schedule, and a cold start adds latency exactly when a delivery lands. That same logic rules it out for the worker too: it keeps a persistent Redis connection, which counts as outbound traffic, so it would not sleep anyway.

## Scaling the pattern

Each side scales independently:

- **Receiver**: stateless, so add [replicas](/deployments/scaling) in service settings. Railway load-balances public traffic across them.
- **Worker**: raise `concurrency` first, since it is the cheapest lever, then add replicas once a single instance's CPU is saturated. BullMQ distributes jobs across workers safely, and `jobId` deduplication holds across all of them because it lives in Redis.
- **Queue depth is your backpressure signal.** If the queue grows faster than it drains for sustained periods, add worker capacity. A deep queue is the system working as designed during a spike; a permanently growing one is under-provisioning.

Railway bills by usage (RAM at $10/GB-month, CPU at $20/vCPU-month), so an idle worker with low concurrency costs little between spikes.

## Common mistakes

- **Parsing the body before verifying.** Global `express.json()` middleware breaks signature checks. Keep `express.raw()` on the webhook route.
- **Returning 200 before the job is enqueued.** If you acknowledge first and Redis fails after, the event is lost and the provider will not retry. Enqueue, then respond.
- **Using a timestamp or a hash of the payload as the idempotency key.** Two distinct events can carry identical payloads. Use the provider's delivery or event ID.
- **Doing "just one quick thing" inline.** The one quick database write becomes three writes and an API call over time. Keep the receiver at zero business logic.

## Next steps

- [Choose between cron jobs, background workers, and queues](/guides/cron-workers-queues)
- [Deploy a SaaS backend with Postgres, workers, and webhooks](/guides/saas-backend)
- [Private networking](/networking/private-networking)
- [Scaling your application](/guides/scaling-your-application)
