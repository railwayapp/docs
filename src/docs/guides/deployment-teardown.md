---
title: Deployment Teardown
description: Learn how to configure the deployment lifecycle to create graceful deploys with zero downtime.
---

By default, Railway maintains only one deploy per service. This means that if you trigger a new deploy, the previous version will be stopped and removed after the new version deploys. There are two configuration options in the "Settings" pane for a service that allow you to slightly overlap the new and preview versions for zero downtime:

<Image
src="https://res.cloudinary.com/railway/image/upload/v1750178677/docs/deployment-teardown-guide/s5pqob0j8nreoojbo6dj.png"
alt="Screenshot of a teardown settings"
layout="responsive"
width={642} height={324} quality={80}/>

To learn more about the full deployment lifecycle, see the [deploy reference](/reference/deployments).

#### Overlap Time

Once the new deployment is active, the previous deployment remains active for a configurable amount of time. You can control this via the "Settings" pane for the service. It can also be configured via [code](/reference/config-as-code#overlap-seconds) or the [`RAILWAY_DEPLOYMENT_OVERLAP_SECONDS` service variable](/reference/variables#user-provided-configuration-variables).

#### Draining Time

Once the new deployment is active, the previous deployment is sent a SIGTERM signal and given time to gracefully shutdown before being forcefully stopped with a SIGKILL. The time to gracefully shutdown can be controlled via the "Settings" pane. It can also be configured via [code](/reference/config-as-code#draining-seconds) or the [`RAILWAY_DEPLOYMENT_DRAINING_SECONDS` service variable](/reference/variables#user-provided-configuration-variables).
