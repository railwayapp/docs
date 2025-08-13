---
title: Optimize Performance
description: Explore quick ways to optimize your app's performance on Railway.
---

Railway offers some quick and easy ways to configure deployments for achieving optimal performance.

Specifically, we offer the following features:

- Horizontal Scaling with Replicas where each individual replica can use the full resources your plan allows for. ([Vertical scaling](/reference/scaling#vertical-autoscaling) is done automatically)
- Regional Deployments

Continue reading for information on how to configure these.

## Configure Horizontal Scaling

Scale horizontally by manually increasing the number of replicas for a service.

Each replica has access to the full resources allocated by your plan. For instance, with the `Pro` plan, each of your replicas can utilize up to 32 vCPU and 32GB of memory, for example, if you had 2 replicas, your service would be able to utilize up to 64 vCPU and 64GB of memory split between the 2 replicas.

Railway's infrastructure spans multiple regions across the globe, and by default Railway deploys to your [preferred region](https://railway.com/workspace).

<Image 
    src="https://res.cloudinary.com/railway/image/upload/v1733386054/multi-region-replicas_zov7rv.png"
    alt="Multi-region replicas"
    layout="responsive"
    width={1370}
    height={934}
/>

To change the number of replicas per deploy within your service, go to the service settings view and look for the "Regions" field in the "Deploy" section. This will create multiple instances of your service and distribute traffic between them.

_Additional regions may be added in the future as Railway continues expanding its infrastructure footprint._

### Replica ID Environment Variable

Each replica will be deployed with a Railway-provided environment variable named `RAILWAY_REPLICA_ID` which can be used for logging and monitoring, for example.

### Replica Region Environment Variable

Each replica will be deployed with a Railway-provided environment variable named `RAILWAY_REPLICA_REGION` which can be used for logging and monitoring, for example.

### Load Balancing Between Replicas

If you are using multi-region replicas, Railway will automatically route public traffic to the nearest region and then randomly distribute requests to the replicas within that region.

If you are using a single region with multiple replicas, Railway will randomly distribute public traffic to the replicas of that region.

**Note:** For now Railway does not support sticky sessions nor report the usage of the individual replicas within the metrics view, all metrics are aggregated across all replicas in all regions.

### Set a Preferred Region

To set a default or preferred region, do so from your [Workspace Settings](https://railway.com/workspace).

### Impact of Region Changes

For information on the impact of changing a service's region, see the [Regions reference guide](/reference/deployment-regions#impact-of-region-changes).

## Singleton Deploys

By default, Railway maintains only one deploy per service.
