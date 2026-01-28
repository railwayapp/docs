---
title: Serverless
description: Learn how Serverless reduces cost usage on Railway.
---

_Note: This feature is formerly called: App-Sleeping_

Serverless allows you to increase the efficiency of resource utilization on Railway and may reduce the usage cost of a [service](/reference/services), by ensuring it is running only when necessary.

## How it Works

When Serverless is enabled for a service, Railway automatically detects inactivity based on outbound traffic.

#### Inactive Service Detection

Inactivity is based on the detection of any outbound packets, which could include network requests, database connections, or even NTP. If no packets are sent from the service for over 10 minutes, the service is considered inactive.

Some things that can prevent a service from being put to sleep -

- Keeping active database connections open, such as a database connection pooler.
- Frameworks that report telemetry to their respective services, such as [Next.js](https://nextjs.org/telemetry).
- Making requests to other services in the same [project](/overview/the-basics#project--project-canvas) over the [private network](/reference/private-networking).
- Making requests to other Railway services over the public internet.
- Making requests to external services over the public internet.
- Receiving traffic from other services in the same project over the private network.
- Receiving traffic from other Railway services over the public internet.
- Receiving traffic from external services over the public internet.

It's important to note that the networking graph in the metrics tab only displays public internet traffic. If you're using a private network to communicate with other services, this traffic won't appear in the metrics tab. However, it's still counted as outbound traffic and will prevent the service from being put to sleep.

#### Waking a Service Up

A service is woken when it receives traffic from the internet or from another service in the same project through the [private network](/reference/private-networking).

The first request made to a slept service wakes it. It may take a small amount of time for the service to spin up again on the first request (commonly known as "cold boot time").

## Caveats

- There will be a small delay in the response time of the first request sent to a slept service (commonly known as "cold boot times")
- For Railway to put a service to sleep, a service must not send _outbound_ traffic for at least 10 minutes. Outbound traffic can include telemetry, database connections, NTP, etc. Inbound traffic is excluded from considering when to sleep a service.
- Enabling Serverless will apply the setting across all [Replicas](/reference/scaling#horizontal-scaling-with-replicas)
- Slept services still consume a slot on our infrastructure, enabling Serverless de-prioritizes your workload and in remote cases, may require a rebuild to re-live the service.

## Support

For information on how to enable Serverless on your services refer to the [how to guide](/guides/optimize-usage#enabling-app-sleeping).
