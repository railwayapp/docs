---
title: Runtime
description: Learn about the runtime options on the service settings page.
---

<PriorityBoardingBanner />

The runtime option on the service settings page refers to how and where your code gets executed. At the moment, Railway is rolling out a new runtime option that will run your OCI compliant image. It is currently dubbed "V2". Railway tends not to concern our users with implementation details, however, in the interest of transparency, this reference page will discuss the benefits and our rollout plan for our new runtime.

## How it works

Under the hood, Railway uses encrypted Wireguard tunnels to create an IPv6 mesh network between all services within an environment. With the "Legacy" runtime, we had to patch the runtime environment after the deploy step to make services discoverable. The Runtime V2 now includes a number of foundational infrastructure on improvements that address long standing concerns of scale on the platform when it comes to executing your code. Namely, at the networking layer.

### Benefits

The move to the new runtime enables new features already and yet to come on the platform.

- Improved port detection
- Immediate private network discoverability
- Shorter image publish times
- Improved performance
- Magic port detection (No redeploy port setting)
- Networking improvements

### Rollout

As of 2024/06/04 (YYYY/MM/DD) the Runtime V2 is already enabled for new workloads on the platform for new services created on the platform. We plan to fully cut-over all workloads on the new runtime by end of July. During this period, we expect no disruptions to service, however, the team will be monitoring all cut over activity observing performance on the platform. The Railway team will be first cutting over Trial then Hobby, Pro, and then lastly Enterprise customers in the final stage.

Users will be allowed to use the "Legacy" runtime as a backup in-case of any issues that may arise.

After the migration period, we will remove this setting entirely and this reference page will be archived.

## Support

For information and help on our new runtime during the rollout period, check out [this forum post](https://help.railway.com/feedback/new-runtime-v2-magic-port-detection-2b530a34).
