---
title: Right-Size CPU and Memory from Real Metrics
description: How to read the Metrics tab on Railway, translate real CPU and memory usage into a monthly cost, and set replica and usage limits that cap spend without crashing your service.
date: "2026-07-29"
tags:
  - metrics
  - cost
  - infrastructure
  - scaling
topic: infrastructure
---

Right-sizing means matching the resources a service is allowed to use to the resources it actually needs. That takes three steps: read the Metrics tab, turn real usage into a monthly cost, and set limits that cap spend without crashing your service.

On most platforms you right-size by picking an instance size. On Railway there is no instance size to pick: services scale vertically up to your plan's limits automatically, and you are billed per minute for what the service actually consumes. That consumption is priced per resource: RAM costs $10 per GB per month, CPU $20 per vCPU per month.

That billing model changes what right-sizing means: your baseline bill is set by real usage, not by an allocation you chose. The work is to read the metrics, understand what your service really uses, and set limits so a memory leak, a runaway loop, or a traffic spike cannot turn into a surprise invoice.

## How resource billing works on Railway

Railway meters four resources for a running service:

| Resource | Price | Per-minute rate |
| --- | --- | --- |
| RAM | $10 / GB / month | $0.000231 / GB / minute |
| CPU | $20 / vCPU / month | $0.000463 / vCPU / minute |
| Network egress | $0.05 / GB | metered per KB |
| Volume storage | $0.15 / GB / month | metered per minute |

Two consequences follow:

1. **Idle services still cost money.** A service that holds 512 MB of RAM at zero traffic is billed for 512 MB every minute it runs. You pay for consumption, not requests.
2. **Headroom is free until your process uses it.** Because there is no instance size to buy, generous limits cost nothing on their own. Look instead for memory your process holds but does not need, and CPU it burns without doing useful work.

Your plan sets the ceiling per replica. On the Pro plan, for example, each replica can use up to 24 GB RAM and 24 vCPU. See [plans](/pricing/plans) for the limits on each plan.

## Read the Metrics tab

Open your project, click the service, and select the **Metrics** tab. Railway shows four graphs per service:

- **CPU**: processor usage in vCPU
- **Memory**: RAM consumption
- **Disk Usage**: storage utilization
- **Network**: inbound and outbound traffic

Up to 30 days of data is available, and the time series is continuous across deployments, not per deployment. Dotted vertical lines mark when each deployment began, so you can attribute a jump in memory or CPU to a specific commit.

What to look for:

- **Memory baseline.** The flat line your memory graph settles at after startup. This is what your service costs at idle. For a typical Node or Python web service this is 100 to 400 MB.
- **Memory slope.** A line that climbs steadily across days and only resets at the deployment markers is a leak. Fix the leak before touching limits; a limit will turn the leak into a crash instead of a bill.
- **CPU shape.** Web services should sit near zero and spike with traffic. A CPU line that is pinned high with no matching traffic in the Network graph means busy-waiting, a hot polling loop, or a misbehaving dependency.
- **Deployment deltas.** Compare the baseline before and after a dotted line. A dependency upgrade that adds 200 MB of resident memory is easy to spot here and adds $2 per month per replica until you fix it.

### Sum and Replica views

If the service runs multiple [replicas](/deployments/scaling), the Metrics tab offers two views. **Sum** combines all replicas: two replicas at 100 MB each show as 200 MB. **Replica** shows each instance separately, which is the view to use for right-sizing, because limits apply per replica and one hot replica can hide behind a calm average. Public network traffic is only shown in the Sum view.

## Do the cost math

Take the numbers off the graphs and turn them into dollars. The formula for a service that runs continuously:

```
monthly cost ≈ (avg RAM in GB × $10) + (avg vCPU × $20) + (egress GB × $0.05)
```

Use the average, not the peak, because billing is per minute of actual usage. A service that spikes to 2 GB for five minutes a day but idles at 300 MB is billed almost entirely at 300 MB.

Worked example, a typical API service:

- Memory baseline 350 MB, brief spikes to 700 MB: call it 0.36 GB average → 0.36 × $10 = **$3.60/month**
- CPU averaging 0.05 vCPU with request spikes to 0.5 vCPU → 0.05 × $20 = **$1.00/month**
- 20 GB egress → 20 × $0.05 = **$1.00/month**

Total: about $5.60 per month. Multiply the RAM and CPU terms by the replica count if you run more than one.

This math also tells you where optimization pays. In the example above, halving memory saves $1.80 per month; cutting CPU is worth twice as much per unit, so a busy-looping process at 1 vCPU flat is a $20 per month bug. And because a vCPU-minute costs twice a GB-minute, trading memory for CPU (caching computed results, for instance) is usually the right direction on Railway.

For a breakdown of what you have already spent by project and by resource (CPU, memory, network), see the Usage page in your workspace settings. See [understanding your bill](/pricing/understanding-your-bill) for how the subscription fee and usage overage combine.

## Set replica limits

By default a service can scale up to your plan's per-replica maximum. If you want a hard ceiling below that, set replica limits: **service settings → Deploy → Replica Limits**. This caps the CPU and memory available to each replica.

Set limits from the metrics, not from guesses:

- **Memory limit**: at least 1.5 to 2 times the observed peak, not the baseline. A Node service idling at 300 MB that peaks at 700 MB during garbage collection or bursts should get a limit of about 1.5 GB, not 512 MB.
- **CPU limit**: set it above the spikes you see under normal traffic. Its main job is to bound the worst-case CPU bill from a runaway process.

Railway warns that limits set too low will crash your service. See [cost control](/pricing/cost-control). Replica limits are the right tool when you would rather have the service crash and restart than absorb unbounded cost, which is the correct trade for a leaky worker but the wrong one for your production API during a launch.

Replica limits do not lower your baseline bill: usage below the limit is billed identically with or without one, so they only bound the tail.

## Cap total spend with usage limits

Replica limits bound one service. To bound the whole bill, set usage limits on the [Workspace Usage page](https://railway.com/workspace/usage):

- **Custom email alert**: a soft threshold. Railway emails you when usage crosses it and nothing is shut down. Set this at your expected monthly spend so drift gets noticed in days, not at invoice time.
- **Hard limit**: when billing-cycle usage hits this amount, Railway takes all workloads offline. Emails go out at 75%, 90%, and 100%. The minimum hard limit is $10.

A sane default: email alert at your normal monthly spend, hard limit at 3 to 5 times that. The hard limit is destructive by design, so leave real headroom above legitimate growth.

## Cut the waste the metrics reveal

Once the graphs show where the money goes, three changes reduce it:

- **[Serverless](/deployments/serverless)** stops a service after 10 minutes without outbound traffic and restarts it on the next request. For staging environments, preview deploys, and low-traffic internal tools, this converts the idle baseline to near zero. Note that persistent database connections or outbound polling count as activity and will keep the service awake.
- **[Private networking](/networking/private-networking)** eliminates egress charges between services in the same environment. If your app talks to its database over the public URL, switch to the `.railway.internal` hostname (use `DATABASE_URL` instead of `DATABASE_PUBLIC_URL`); the Network graph plus the $0.05/GB rate tells you what that has been costing.
- **Delete or scale down replicas you cannot justify.** The Replica view makes it obvious when a second replica carries no meaningful load. Fewer replicas means one less multiple on the RAM and CPU terms.

## Recheck after every meaningful deploy

Right-sizing is not a one-time exercise. The deployment markers on the metrics graphs make the loop cheap: after a dependency bump, a framework upgrade, or a feature that adds caching, glance at the before and after baselines. Catching a 300 MB regression the week it deploys costs one look; catching it at invoice time costs a month of $3.

## Next steps

- [Metrics](/observability/metrics): full reference for the Metrics tab, including replica views
- [Cost control](/pricing/cost-control): usage limits, replica limits, and serverless in detail
- [Scaling](/deployments/scaling): horizontal scaling with replicas and multi-region deployment
- [Understanding your bill](/pricing/understanding-your-bill): how subscription fees and usage combine on your invoice
