---
title: Optimize Performance
description: Explore quick ways to optimize your app's performance on Railway.
---

Railway offers some quick and easy ways to configure deployments for achieving optimal performance.  

Specifically, we offer the following features:

- Horizontal Scaling with Replicas ([vertical scaling](/reference/scaling#vertical-autoscaling) is done automatically)
- Regional Deployments

Continue reading for information on how to configure these.

## Configure Horizontal Scaling

Scale horizontally by manually increasing the number of replicas for a service.

Railway's infrastructure spans multiple regions across the globe, and by default Railway deploys to `us-west1` located in Portland, Oregon.

<Image 
    src="https://res.cloudinary.com/railway/image/upload/v1733386054/multi-region-replicas_zov7rv.png"
    alt="Multi-region replicas"
    layout="responsive"
    width={1370}
    height={934}
/>


To change the number of replicas per deploy within your service, go to the service settings view and look for the "Regions" field in the "Deploy" section. This will create multiple instances of your service and distribute traffic between them.

*Additional regions may be added in the future as Railway continues expanding its infrastructure footprint.*

### Replica ID Environment Variable

Each replica will be deployed with a Railway-provided environment variable named `RAILWAY_REPLICA_ID` which can be used for logging and monitoring, for example.

### Replica Region Environment Variable

Each replica will be deployed with a Railway-provided environment variable named `RAILWAY_REPLICA_REGION` which can be used for logging and monitoring, for example.

### Load Balancing Between Replicas

If you are using multi-region replicas, Railway will automatically route public traffic to the nearest region and then randomly distribute requests to the replicas within that region.

If you are using a single region with multiple replicas, Railway will randomly distribute public traffic to the replicas of that region.

**Note:** For now Railway does not support sticky sessions nor report the usage of the individual replicas within the metrics view, all metrics are aggregated across all replicas in all regions.

### Set a Default Region

To set a default, or preferred, region, do so from the command palette.  From your project settings:
- Type `CMD+K` or `Ctrl+K` to access the command palette
- Type "preferred region"
- Select your preferred region

<Image
    quality={100}
    width={959}
    height={651}
    src="https://res.cloudinary.com/railway/image/upload/v1730327915/docs/preferredRegion_i33w6q.png"
    alt="Preferred Region Picker"
/>

### Impact of Region Changes

For information on the impact of changing a service's region, see the [Regions reference guide](/reference/deployment-regions#impact-of-region-changes).

## Singleton Deploys

By default, Railway maintains only one deploy per service.
