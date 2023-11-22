---
title: Scaling
---

Scaling your applications in Railway is made easy with configurable options for horizontal scaling and built-in vertical autoscaling.

## How it Works

### Vertical Autoscaling

By default Railway will scale your service up to the the specified vCPU and Memory limits of your plan.

### Horizontal Scaling with Replicas

You can scale horizontally by manually increasing the number of replicas for a service.

<Image src="https://res.cloudinary.com/railway/image/upload/v1684534939/docs/Export-replica_lrtrvs.png"
alt="Screenshot of replica setting"
layout="responsive"
width={800} height={317} quality={100} />

#### Load Balancing between replicas

At the moment, Railway will round-robin requests to the replicas of your service. We plan to add more advanced load balancing strategies in the future. If you need more advanced load balancing, you can use an external load balancer such as Cloudflare to distribute traffic between your services.

#### Sticky Sessions

For now Railway does not support sticky sessions nor report the usage of the replicas within the metrics view.

## Support

For information on how to use horizontal scaling with replicas, refer to [this guide](/how-to/optimize-deployments#configure-horizontal-scaling).