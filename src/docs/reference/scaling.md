---
title: Scaling
description: Learn how to scale your applications on Railway.
---

Scaling your applications in Railway is made easy with configurable options for horizontal scaling as well as vertical autoscaling out-of-the-box.

## How it Works

### Vertical Autoscaling

By default Railway will scale your service up to the specified vCPU and Memory limits of your [plan](/reference/pricing#plans).

### Horizontal Scaling with Replicas

Scale horizontally by manually increasing the number of replicas for a service in the service settings.  Increasing the number of replicas on a service will create multiple instances of the service deployment.

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

#### Sticky Sessions

For now Railway does not support sticky sessions nor report the usage of the replicas within the metrics view.

## Support

For information on how to use horizontal scaling with replicas, refer to [this guide](/guides/optimize-performance#configure-horizontal-scaling).