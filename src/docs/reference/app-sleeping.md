---
title: App Sleeping
---

App Sleeping (aka "Serverless") allows you to increase the efficiency of resource utilization on Railway and may reduce the usage cost of a [service](/reference/services), by ensuring it is running only when necessary.

## How it Works

App sleeping is configured on a service and enables automated detection of an inactivity based on outbound traffic.

#### Inactive Service Detection

Inactivity is based on detection of any outbound packets, which could include telemetry or NTP. If no packets are sent from the service for over 10 minutes or longer, the service is considered inactive.

#### Waking a Service Up

A service is woken when it receives traffic from the internet.

The first request made to a slept service wakes it. It may take a small amount of time for the service to spin up again on the first request (commonly known as "cold boot time").

## Caveats

- There will be a small delay in the response time of the first request sent to a slept service (commonly known as "cold boot times")
- For Railway to put a service to sleep, a service must not send _outbound_ traffic for at least 10 minutes. Outbound traffic can include telemetry, NTP, etc. Inbound traffic is excluded from considering when to sleep a service.
- Enabling App Sleeping will apply the setting across all [Replicas](/reference/scaling#horizontal-scaling-with-replicas)
- Slept services still consume a slot on our infrastructure, enabling App Sleeping de-prioritizes your workload and in remote cases, may require a rebuild to re-live the service.

## Support

For information on how to enable app sleeping on your services refer to the [how to guide](/guides/optimize-usage#enabling-app-sleeping).
