---
title: Optimize Deployments
---

Railway offers some quick and easy ways to configure deployments for achieving optimal performance.

## Configure Horizontal Scaling

By default Railway will scale your service up to the the specified vCPU and Memory limits of your plan. You can scale horizontally by manually increasing the number of replicas for a service.

<Image src="https://res.cloudinary.com/railway/image/upload/v1684534939/docs/Export-replica_lrtrvs.png"
alt="Screenshot of replica setting"
layout="responsive"
width={800} height={317} quality={100} />


To change the number of replicas per deploy within your service, go to the service settings view and look for the "Replicas" field in the "Deploy" section. This will create multiple instances of your service and distribute traffic between them.

At the moment, Railway will round-robin requests to the replicas of your service. We plan to add more advanced load balancing strategies in the future. If you need more advanced load balancing, you can use an external load balancer such as Cloudflare to distribute traffic between your services.

**Note:** For now Railway does not support sticky sessions nor report the usage of the replicas within the metrics view.

## Configure a Region

<PriorityBoardingBanner />

Railway's infrastructure spans multiple regions across the globe, and by default Railway deploys to `us-west1` located in Portland, Oregon.

To choose a different region for your service, go to your service settings and select the desired region -

<Image
    quality={100}
    width={1359}
    height={651}
    src="https://res.cloudinary.com/railway/image/upload/v1695660846/docs/service_region_picker.png"
    alt="Region Picker"
/>

*Additional regions may be added in the future as Railway continues expanding its infrastructure footprint.*

### Impact of Region Changes

For information on the impact of changing a service's region, see the [Regions reference guide](/reference/regions).

## Singleton Deploys

By default, Railway maintains only one deploy per service.