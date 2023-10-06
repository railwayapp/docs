---
title: App Sleeping
---

<PriorityBoardingBanner />

App Sleeping allows you to increase the efficiency of resource utilization on Railway.  It may reduce the resource usage cost of a [service](/develop/services) by ensuring you only use what you need, when you need it.

## What is App Sleeping?

Enabling App Sleep on a service tells Railway to stop a service when it is inactive, effectively reducing the overall cost to run it.

App sleeping enables automated detection of an inactive [service](/develop/services) based on outbound traffic.

<Image src="https://res.cloudinary.com/railway/image/upload/v1696017787/events_gjkaob.png"
alt="App Sleeping in the Activity Feed"
layout="intrinsic"
width={700} height={460} quality={100} />

### Inactive Service Detection

Inactivity is based detection of any outbound packets, which could include telemetry or NTP. If no packets are sent from the service for over 10 minutes or longer, the service is considered inactive.


### Waking a Service Up

We wake a service when it receives traffic from the internet.

The first request made to a service wakes a sleeping service.  It may take a small amount of time for the service to spin up again on the frist request (commonly known as "cold boot time").

## How to enable App Sleeping

To enable App Sleeping, toggle the feature on within the service configuration pane in your project:

<Image src="https://res.cloudinary.com/railway/image/upload/v1696548703/docs/scale-to-zero/appSleep_ksaewp.png"
alt="Enable App Sleep"
layout="intrinsic"
width={700} height={460} quality={100} />

1. Navigate to your service's settings > Deploy > App Sleeping
2. Toggle "Enable App Sleeping"
3. To _disable_ App Sleeping, toggle the setting again

## Caveats
- There will be a small delay in the response time of the first request sent to a slept service (commonly known as "cold boot times")
- [Private Networking](/reference/private-networking) does not currently work with App Sleeping
- Outbound traffic is excluded from considering when to sleep a service. For Railway to put a service to sleep, a service must not send outbound traffic for at least 10 minutes. Outbound traffic can include telemetry, NTP, etc.
- Enabling App Sleeping will apply the setting across all [Replicas](https://docs.railway.app/develop/services#horizontal-scaling-with-replicas)