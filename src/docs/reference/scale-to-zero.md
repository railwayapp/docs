---
title: Scale to Zero
---

Scale to Zero enables you to reduce unnecessary costs by ensuring you only use what you need, when you need it.

## What is App Sleeping?

App sleeping enables automated detection of inactive [services](/develop/services) based on outbound traffic.

Enabling App Sleep on a service tells Railway to stop the service when it is inactive, effectively reducing the overall cost to run it.

<Image src="https://res.cloudinary.com/railway/image/upload/v1696017787/events_gjkaob.png"
alt="App Sleeping in the Activity Feed"
layout="intrinsic"
width={700} height={460} quality={100} />

### Inactive Service Detection

Inactivity is based on outbound packets. If no packets are sent from the service for over 10 minutes or longer, the service is considered inactive.


### Reactivation

When the service receives traffic from the _public network*_, it is sent a signal to wake.  

Only when the service is ready, is traffic routed to it, ensuring no requests are dropped during the startup process.

_*Currently, requests made to the service over the private network do not cause it to awake from sleep._

## How to enable App Sleeping

To enable App Sleeping simply toggle the feature on within the service configuration - 

<Image src="https://res.cloudinary.com/railway/image/upload/v1696548703/docs/scale-to-zero/appSleep_ksaewp.png"
alt="Enable App Sleep"
layout="intrinsic"
width={700} height={460} quality={100} />

1. Navigate to your service's settings > Deploy > App Sleeping.
2. Toggle "Enable App Sleeping".
3. This setting will be applied across all [replicas](https://docs.railway.app/develop/services#horizontal-scaling-with-replicas) automatically.
4. When your service is put to sleep, an event will be visible in the dashboard.
5. To _disable_ App Sleeping, simply toggle the setting again.

## Things to Note
- **Latency** - There may be a small delay when requests arrive at a stopped application.
- **Private Networking** - Services that receive traffic exclusively over the private network should *not* be enabled with App Sleeping since only public network traffic will trigger the service to wake.
- **Conditions for Sleeping** - For a service to be considered inactive, it must not send outbound traffic for at least 10 minutes or more.  Outbound traffic can include telemetry, NTP, etc.