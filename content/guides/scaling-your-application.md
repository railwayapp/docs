---
title: Scaling Your Application
description: Learn how to scale applications on Railway with vertical autoscaling and horizontal replicas, and how to read metrics to right-size each service.
date: "2026-07-13"
tags:
  - scaling
  - replicas
  - autoscaling
  - performance
topic: infrastructure
---

Railway ships with a number of ways to keep your app running smoothly and snappily, no matter how much traffic it serves, or how data-intensive your workload is.

## What is scaling?

As the load on an application increases, the servers that host it naturally stress as their memory, CPU, and disk capacity are used up. This can cause slow response times, errors, and all-out crashes. To meet demand, developers need to scale their server power, but how you scale has implications for performance and price.

### Naive scaling

One strategy (we'll call this the "naive" strategy) is to use beefier machines. To accomplish this, you can specify in your infrastructure configuration that the servers on which your app should run should have a lot of RAM, CPU, and disk space. This strategy works, but for many cases is extremely inefficient.

This inefficiency stems from the fact that most applications have variable usage patterns; times of the day, week, or month when usage hits peak load, like a streaming service when a new episode of a hit show comes out, or a trading platform that executes a bunch of strategies at market open. Accordingly, there are also valleys; times when the application is under less, or no load, such as after market close or in the middle of the night.

But large, powerful servers don't cost less just because you're not using them. An r6a.8xlarge with 32 vCPUs and 256 GB of RAM costs $1,324 a month. You pay the same amount whether it's under load or sitting idle, because with most cloud service providers, you pay for provisioned capacity, not utilization. In the following graph, we can see all that overhead.

<Image
  src="https://res.cloudinary.com/railway/image/upload/v1783949650/docs/external-images/image_1_naive_scaling_qu234p.png"
  alt="Graph showing a flat, over-provisioned capacity line far above variable demand"
  layout="responsive"
  width={1600} height={900} quality={100}
/>

### Smart scaling

A better strategy is to reduce the area of wasted capacity by automatically changing the provisioned capacity of your infrastructure to match real demand. In the following graph, we see that an auto-scaled setup can significantly reduce overhead on infrastructure you don't even use.

<Image
  src="https://res.cloudinary.com/railway/image/upload/v1783949650/docs/external-images/image_2_smart_scaling_flxdgj.png"
  alt="Graph showing provisioned capacity tracking demand closely, reducing wasted overhead"
  layout="responsive"
  width={1600} height={900} quality={100}
/>

Application infrastructure can scale in two main ways, or "directions".

**Vertical scaling** is when you increase the power of an existing server by adding more resources to the same machine. You're making the box bigger rather than adding more boxes. This works well for workloads that are hard to parallelize, like large machine learning, LLM, or video processing jobs.

**Horizontal scaling** is when you add more servers to distribute the load across multiple machines. Rather than one more powerful server, you have many smaller ones working in parallel. This works well for stateless workloads like web servers or API layers, where requests can be routed to any available instance, and any given job is computationally light.

Railway supports both horizontal and vertical scaling, so your application can continue to run reliably without paying for infrastructure you don't use.

## Auto scaling with Railway

Railway supports both scaling directions and manages them automatically within the limits you configure.

### Vertical scaling

You vertically scale infrastructure by upping the resources available to your workloads. This is appropriate for resource-intensive tasks that cannot be parallelized. Examples include data-intensive machine learning jobs, video processing pipelines, data transformations or aggregations, and anything that needs to hold a large amount of data in memory at any given time.

Each Railway <a href="https://railway.com/pricing" target="_blank">plan</a> comes with RAM and CPU limits that apply to your whole workspace, and you can also configure memory limits at the project and service level. Railway will automatically determine how much memory your service is using, and scale up the available memory to meet demand (within configured limits).

To demonstrate this, I'll deploy this <a href="https://github.com/WillRaphaelson/railway-content/blob/main/scaling/memory_hog.py" target="_blank">memory_hog.py</a> script, which, as the name suggests, allocates more and more memory over time. After running it, we see the following graph.

<Image
  src="https://res.cloudinary.com/railway/image/upload/v1783949651/docs/external-images/image_3_memory_steps_vkcqdo.png"
  alt="Memory usage graph showing step changes as Railway scales allocated memory to meet demand"
  layout="responsive"
  width={1600} height={900} quality={100}
/>

As you can see in the metrics tab, about every minute, there is a step change in memory utilization. Why is that? If the script's memory usage increases linearly, we would expect to see a linear trend. Instead, what we see is the service hitting the automatically allocated memory limit, and then Railway auto-scaling to meet demand about once a minute. This keeps our code running smoothly, but doesn't over-allocate memory prematurely, saving valuable credits.

In addition to configuring [overall workspace usage limits](/pricing/cost-control), you can configure limits at the service level in service settings. Service level limits ensure that one memory-hungry service doesn't consume all of your plan's memory.

<Image
  src="https://res.cloudinary.com/railway/image/upload/v1783949650/docs/external-images/image_4_memory_settings_c1dwdn.png"
  alt="Service settings panel showing the memory limit configuration for a service"
  layout="responsive"
  width={1200} height={700} quality={100}
/>

Of course, you can also enshrine this configuration in code, via a `railway.toml` file like so:

```toml
[services.memory_hog]
memoryLimit = 512  # in MB
```

And via the CLI:

```bash
railway service memory_hog set --memory-limit 512
```

Scaling down is just as important as scaling up, and Railway automatically releases memory allocations as demand falls. By default, Railway will always allocate a minimum amount of memory for your service, even when it's not in use. If you want to scale even lower than that minimum, you can scale to zero by toggling serverless in your service settings. After 10 minutes, a serverless container that has not done any work will be fully put to sleep and wake up upon receiving a request. For more information on the tradeoffs of serverless, see [Serverless](/deployments/serverless).

<Image
  src="https://res.cloudinary.com/railway/image/upload/v1783949651/docs/external-images/image_5_serverless_gb9yq4.png"
  alt="Service settings panel showing the serverless toggle enabled"
  layout="responsive"
  width={1200} height={700} quality={100}
/>

### Horizontal scaling

You horizontally scale infrastructure by adding more instances of your workloads. This is appropriate for tasks that can be distributed across multiple workers. Examples include web servers handling concurrent requests, queue consumers processing jobs in parallel, stateless API services under variable load, and anything where workloads can be divvied up and processed independently. Horizontal scaling is accomplished by adding exact copies of your service called replicas, across which Railway will distribute requests in a round-robin fashion.

By default, Railway spins up one replica, but by adding replicas in the service settings page, `railway.toml`, or CLI, Railway will provision replica servers and route traffic to them once they look healthy.

<Image
  src="https://res.cloudinary.com/railway/image/upload/v1783949651/docs/external-images/image_6_replicas_xlil4q.png"
  alt="Service settings panel showing the number of replicas configured for a service"
  layout="responsive"
  width={1600} height={900} quality={100}
/>

```toml
[services.my_service]
numReplicas = 3
```

```bash
railway service my_service set --replicas 3
```

To demonstrate this, let's look at what happens when I run a <a href="https://github.com/WillRaphaelson/railway-content/blob/main/scaling/cpu_killer.py" target="_blank">processing-intensive application</a> that computes large prime numbers, and then hammer it by simulating 200 concurrent users hitting the API.

<Image
  src="https://res.cloudinary.com/railway/image/upload/v1783949651/docs/external-images/image_7_cpu_chhthk.png"
  alt="CPU metrics graph showing usage pegged at the 1 vCPU service maximum"
  layout="responsive"
  width={1600} height={600} quality={100}
/>

<Image
  src="https://res.cloudinary.com/railway/image/upload/v1783949651/docs/external-images/image_8_response_time_oj0uqm.png"
  alt="Response time graph showing requests taking a very long time or failing under load"
  layout="responsive"
  width={1600} height={600} quality={100}
/>

Unsurprisingly, things are not going great for our server. The CPU is pegged at the service maximum of 1 vCPU, and requests are starting to take a very long time or outright fail.

If I add replicas, however, we can see the relief come in real time. Railway spins up the copies and starts dividing up work across them evenly. CPU utilization per replica goes down, and response time returns to normal.

<Image
  src="https://res.cloudinary.com/railway/image/upload/v1783949651/docs/external-images/image_9_better_cpu_y0ztrc.png"
  alt="CPU metrics graph showing lower per-replica utilization after adding replicas"
  layout="responsive"
  width={1600} height={600} quality={100}
/>

<Image
  src="https://res.cloudinary.com/railway/image/upload/v1783949651/docs/external-images/image_10_better_response_cz9vtc.png"
  alt="Response time graph returning to normal after adding replicas"
  layout="responsive"
  width={1600} height={600} quality={100}
/>

Replicas *also* vertically scale, so if the workload becomes memory-intensive, Railway will add memory to all of the replicas as needed, ensuring that whatever the nature of the stress on your application, it will continue to run smoothly.

Note that if you have users worldwide, configuring replicas across different regions will route requests to the closest server to each user, speeding up response time. This also adds a layer of redundancy in case a region goes down, which is rare but not unheard of.

## Rightsizing your Railway

Making smart scaling decisions is the best way to ensure your application is both performant and cost-efficient. To do that well, you need to know what your application is actually constrained by.

### What is your application bound by?

When an application slows down or stops handling requests, it's usually because one resource has hit its limit. That resource is the bottleneck, and the application is said to be "bound" by it. Scaling the wrong resource wastes money and doesn't fix the problem.

- **CPU-bound:** the processor is the constraint. The app is doing heavy computation and needs more processing power.
- **Memory-bound:** the app needs more RAM to hold its working data. Adding more instances won't help if each one runs out of memory independently.
- **Network-bound:** traffic in or out is the ceiling. The app can process requests fine, but can't move data fast enough.
- **I/O-bound:** the app spends most of its time waiting on disk reads/writes or database queries. The CPU and memory are mostly idle.

### How to identify your bottleneck using Railway metrics

To identify bottlenecks, you need an accurate picture of how your services perform under low, average, and peak demand. The metrics tab of your service provides a detailed historical view into CPU usage, memory usage, network throughput, and resulting response times. The metric that shows up consistently high or spikes when things slow down is your bottleneck.

### Scaling to match your bottleneck

Once you know your bottleneck, match your scaling strategy to it.

- **Memory-bound:** scale vertically. More RAM on the same instance. Adding replicas in this case gives each one the same memory ceiling, so it doesn't help.
- **CPU-bound with parallelizable work:** scale horizontally. If each unit of work is independent, more instances result in more work done at the same time.
- **CPU-bound with tightly coupled work:** scale vertically. If the work can't be split across instances because each step depends on the last, a bigger machine is the right call.
- **Network-bound:** scale horizontally. Distributing traffic across more instances spreads the network load.
- **I/O-bound:** scale horizontally. If your app is mostly waiting on a database or disk, adding more instances lets more requests wait in parallel rather than queuing behind each other.

### Using both together

Some applications need to scale in both directions. A video transcription service, for example, might load a speech-to-text model into memory on startup (memory-bound) while also serving many concurrent upload requests (I/O-bound). In this case, the performant path is vertical scaling for the worker service that holds the model, and horizontal scaling for the API layer that handles incoming traffic. Railway lets you configure limits independently at the service level, so each service in your project can be sized for what it actually does.

If your limits are configured correctly, Railway handles this automatically. When memory climbs toward the vertical limit, Railway scales the instance up. When concurrent requests increase, Railway distributes them where they need to go. You set the ceiling, and Railway decides when to use it.

### Cheat sheet: reading your Railway metrics

Use this table to map what you observe in the metrics tab to a scaling decision.

| What you see | What it probably means | What to do |
|---|---|---|
| Memory creeping toward its limit | Memory-bound | Vertical |
| CPU spiking, memory comfortable | CPU-bound, parallelizable | Horizontal |
| Network in/out saturating | Network-bound | Horizontal |
| All metrics look fine, app is slow | I/O-bound | Check database query times, not infrastructure |

Sometimes, addressing one bottleneck reveals others or moves the problem to another place in the application architecture, so optimizing your scaling strategy is often iterative: tweak a resource configuration, observe metrics, and repeat.

## Conclusion

Hopefully, this guide gave you the confidence to analyze your application's performance and configure scaling efficiently. If you have any questions or feedback, reach out on <a href="https://discord.gg/railway" target="_blank">Discord</a>, [Slack](/platform/support#slack), or <a href="https://station.railway.com/" target="_blank">Central Station</a>.
