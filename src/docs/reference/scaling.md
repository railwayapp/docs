---
title: Scaling
---

Scaling your applications in Railway is made easy with configurable options for horizontal scaling as well as vertical autoscaling out-of-the-box.

## How it Works

### Vertical Autoscaling

By default Railway will scale your service up to the specified vCPU and Memory limits of your [plan](/reference/pricing#plans).

### Horizontal Scaling with Replicas

Scale horizontally by manually increasing the number of replicas for a service in the service settings.  Increasing the number of replicas on a service will create multiple instances of the service deployment.

#### Load Balancing Between Replicas

Railway will round-robin requests to the replicas of a service. If you need more advanced load balancing, you can use an external load balancer such as Cloudflare to distribute traffic between your services.

We plan to add more advanced load balancing strategies in the future.

#### Sticky Sessions

For now Railway does not support sticky sessions nor report the usage of the replicas within the metrics view.

## Support

For information on how to use horizontal scaling with replicas, refer to [this guide](/guides/optimize-performance#configure-horizontal-scaling).