---
title: Scaling
description: Learn how to scale your applications on Railway.
---

Scaling your applications in Railway is made easy with configurable options for horizontal scaling as well as vertical autoscaling out-of-the-box.

## How it Works

### Vertical Autoscaling

By default Railway will scale your service up to the specified vCPU and Memory limits of your [plan](/reference/pricing#plans).

### Horizontal Scaling with Replicas

Scale horizontally by manually increasing the number of replicas for a service in the service settings. Increasing the number of replicas on a service will create multiple instances of the service deployment.

Each replica has access to the full resources allocated by your plan. For instance, with the `Pro` plan, each of your replicas can utilize up to 32 vCPU and 32GB of memory, for example, if you had 2 replicas, your service would be able to utilize up to 64 vCPU and 64GB of memory split between the 2 replicas.

#### Multi-region replicas

Multi-region replicas are exactly as advertised -- horizontally scaled replicas that are located in different geographic regions.

The service settings panel will reveal an interface for assigning replicas to different regions.

<Image 
    src="https://res.cloudinary.com/railway/image/upload/v1733386054/multi-region-replicas_zov7rv.png"
    alt="Multi-region replicas"
    layout="responsive"
    width={1370}
    height={934}
/>

Creating, deleting, and re-assigning replicas will trigger a staged change which upon applying will trigger a redeploy.

#### Load Balancing Between Replicas

If you are using multi-region replicas, Railway will automatically route public traffic to the nearest region and then randomly distribute requests to the replicas within that region.

If you are using a single region with multiple replicas, Railway will randomly distribute public traffic to the replicas of that region.

We plan to add more advanced load balancing strategies in the future.

#### Metrics

For services with multiple replicas, the metrics from all replicas are summed up and displayed in the metrics tab, for example, if you have 2 replicas, each using 100 MB of memory, the memory usage displayed in the metrics tab will be 200 MB.

#### Sticky Sessions

For now Railway does not support sticky sessions nor report the usage of the replicas within the metrics view.

## Support

For information on how to use horizontal scaling with replicas, refer to [this guide](/guides/optimize-performance#configure-horizontal-scaling).
