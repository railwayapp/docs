---
title: Load Test an App Before Launch with k6
description: Write a k6 load test, run it locally or as a Railway service, set realistic performance targets, and read Railway metrics while the test runs.
date: "2026-07-29"
tags:
  - load-testing
  - k6
  - performance
  - metrics
topic: infrastructure
---

Before launch you want three numbers: the request rate your current resources can handle, the load where latency starts to degrade, and whether errors appear under pressure. A load test gets you all three by sending controlled, realistic traffic at your application and measuring how it responds.

k6 does exactly that: it's an open source load testing tool from Grafana Labs. You write test scenarios in JavaScript, and k6 executes them with a configurable number of virtual users (VUs). It reports latency percentiles, throughput, and error rates, and it can fail the run automatically when results miss your thresholds.

This guide puts k6 to work: write a script, choose realistic targets, run the test locally and then as a Railway service, and watch the target's metrics while it runs.

## What you need

- An application deployed on Railway with a public domain, for example `myapp.up.railway.app`. See [public networking](/networking/public-networking) if you have not exposed your service yet.
- k6 installed locally, or a Railway project where you can add a second service to act as the test runner.

One caveat before you start: if your target service has [serverless](/deployments/serverless) enabled, it sleeps after 10 minutes without outbound traffic and wakes on the next request. The first requests of your test will measure cold start time, not steady-state performance. Disable serverless on the target for the duration of the test, or accept that the opening seconds of the run are noise.

## Install k6

On macOS:

```bash
brew install k6
```

On Debian or Ubuntu:

```bash
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update && sudo apt-get install k6
```

With Docker, no install is needed:

```bash
docker run --rm -i grafana/k6 run - <script.js
```

## Write the test script

Create a file named `script.js`. This script ramps traffic up in stages, checks every response, and defines pass/fail thresholds:

```javascript
import http from "k6/http";
import { check, sleep } from "k6";

const BASE_URL = __ENV.TARGET_URL || "https://myapp.up.railway.app";

export const options = {
  stages: [
    { duration: "1m", target: 20 },  // ramp up to 20 VUs
    { duration: "3m", target: 20 },  // hold steady
    { duration: "1m", target: 50 },  // push past expected peak
    { duration: "2m", target: 50 },  // hold at peak
    { duration: "1m", target: 0 },   // ramp down
  ],
  thresholds: {
    http_req_duration: ["p(95)<500"], // 95% of requests under 500ms
    http_req_failed: ["rate<0.01"],   // less than 1% errors
  },
};

export default function () {
  const res = http.get(`${BASE_URL}/`);

  check(res, {
    "status is 200": (r) => r.status === 200,
    "body is not empty": (r) => r.body && r.body.length > 0,
  });

  sleep(1); // each VU pauses 1s between requests, like a real user
}
```

The `stages` array shapes the traffic. The `thresholds` block makes the run self-grading: if the p95 latency exceeds 500ms or more than 1% of requests fail, k6 exits with a non-zero code. That makes the same script usable as a CI gate later.

Test the endpoints your users actually hit. A test that only requests `/` while your real traffic hammers `/api/search` tells you very little. Add more `http.get` or `http.post` calls to the default function to model a realistic session.

## Set realistic targets

Base your numbers on expected traffic:

- **Virtual users.** Estimate peak concurrent users, not total signups. If you expect 10,000 daily visitors with sessions averaging 3 minutes, your steady concurrency is far lower than 10,000. A common starting point is peak hourly visitors multiplied by average session length in hours. Then test at that level and at 2 to 3 times it, so you know your headroom.
- **Latency threshold.** 500ms at p95 is a reasonable default for API endpoints. Pages that render HTML or call downstream services may warrant more. Set the threshold at the point where the experience degrades for your users, not at the best number your app can achieve.
- **Error rate.** Under 1% is a sane launch bar. Anything above that under expected load is a bug to fix, not a threshold to relax.
- **Duration.** Run at least 5 to 10 minutes at steady load. Memory leaks and connection pool exhaustion often take minutes to surface. A 30-second burst hides them.

Two Railway edge limits matter when you interpret results. Requests through Railway's edge can run up to 15 minutes as long as data keeps transferring, and are closed after 5 minutes of idle time. If your test includes long-running requests, keep them under those limits or the closures will show up as errors in k6 that are not application failures.

## Run the test locally

Point the script at your Railway domain and run it:

```bash
TARGET_URL=https://myapp.up.railway.app k6 run script.js
```

k6 prints a live progress bar and finishes with a summary:

```
http_req_duration..........: avg=182ms min=95ms med=160ms max=1.2s p(90)=290ms p(95)=340ms
http_req_failed............: 0.12% ✓ 14 ✗ 11986
http_reqs..................: 12000  33.2/s
```

Running locally is the simplest option and is fine for most pre-launch tests. Your local machine and home connection can usually generate a few hundred VUs before they become the bottleneck. If the k6 process pegs your CPU or your upload bandwidth saturates, the numbers stop being trustworthy, and it is time to run the test from a server instead.

## Run k6 as a Railway service

Running the test runner on Railway gives it a datacenter network connection and removes your laptop's CPU and upload bandwidth from the measurement. k6 is a Go binary, so deploy it from a Dockerfile based on the official image.

Create a repository (or a directory to deploy with `railway up`) with two files, the `script.js` from above and this `Dockerfile`:

```dockerfile
FROM grafana/k6:latest
COPY script.js /script.js
ENTRYPOINT ["k6", "run", "/script.js"]
```

Then:

1. Create a new service in your project and point it at the repository or directory. See [services](/services) for the creation flow.
2. Set a `TARGET_URL` [variable](/variables) on the service, for example `https://myapp.up.railway.app`.
3. Set the service's [restart policy](/deployments/restart-policy) to `Never`. k6 exits when the test completes; the default `On Failure` policy would rerun the test up to 10 times whenever thresholds fail, which is exactly when you do not want more load.
4. Deploy. The test runs once, streams its output to the [deploy logs](/observability/logs), and exits.

To run the test again, redeploy the service. Remove the service when you are done so it does not sit in the project.

Two notes on this setup:

- **Egress cost.** Traffic between the k6 service and your target's public domain leaves Railway's network and returns through the edge. Those responses count as outbound traffic at $0.05/GB. A typical API load test moves little data at that rate, but factor this in before load testing endpoints that return large payloads.
- **Private networking option.** If the k6 service runs in the same project and environment as the target, it can hit the target over [private networking](/networking/private-networking) at `http://myapp.railway.internal:PORT`. This skips the public edge, so it measures your application alone rather than the full path your users take, and it avoids egress charges. Use the public URL for launch-readiness numbers and the private one for isolating application performance. Private networking is scoped per environment, so both services must be in the same environment.

## Watch metrics during the test

Open your target service in the Railway dashboard and go to the **Metrics** tab while the test runs. Railway charts four resource metrics, with deploy markers on the timeline:

- **CPU.** If CPU pins at your limit while latency climbs, you are compute-bound. Raise the service's resource limits or add [replicas](/deployments/scaling).
- **Memory.** Healthy services plateau. A line that climbs for the whole run and never flattens suggests a leak or an unbounded cache. In production, that service would eventually be killed for exceeding its memory limit.
- **Network.** Confirms the test traffic is arriving, and shows whether response payloads are larger than you assumed.
- **Disk.** Relevant if your app writes logs or temp files per request.

If the service runs multiple replicas, switch the metrics view from **Sum** to **Replica** to confirm load is spreading evenly rather than hammering one instance. See [metrics](/observability/metrics) for details on both views.

Railway does not collect application-level metrics such as request latency or error rates; those come from the k6 summary. For per-endpoint latency and error tracking inside your app, wire up an observability vendor as described in [Connect a Third-Party Observability Tool](/guides/third-party-observability).

Also tail the target's [logs](/observability/logs) during the run. Timeouts, connection pool errors, and unhandled exceptions often appear in logs before they move the error-rate needle.

## Act on the results

- **Latency rises with load, CPU is high.** Scale vertically by raising resource limits, or horizontally with replicas. Railway distributes public traffic randomly across replicas in a region, so stateless services scale this way with no code changes.
- **Errors spike at a specific VU count.** Look for a fixed-size bottleneck: database connection pool, worker count, or a downstream rate limit. The k6 output tells you the request rate where it broke; size the pool for it.
- **Memory grows without bound.** Fix the leak before launch. Adding RAM only delays the crash.
- **Everything passes with 3x headroom.** You are done. Configure a [healthcheck](/deployments/healthchecks) so future deploys are zero-downtime, and keep the k6 script in your repository to rerun before major releases.

## Next steps

- [Scaling Your Application](/guides/scaling-your-application)
- [Connect a Third-Party Observability Tool](/guides/third-party-observability)
- [Healthchecks](/deployments/healthchecks)
- [Metrics](/observability/metrics)
