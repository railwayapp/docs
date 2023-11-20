---
title: Scaling
---

<Image src="https://res.cloudinary.com/railway/image/upload/v1684534939/docs/Export-replica_lrtrvs.png"
alt="Screenshot of replica setting"
layout="responsive"
width={800} height={317} quality={100} />

By default Railway will scale your service up to the the specified vCPU and Memory limits of your plan. You can scale horizontally by manually increasing the number of replicas for a service.

## Load Balancing between replicas

At the moment, Railway will round-robin requests to the replicas of your service. We plan to add more advanced load balancing strategies in the future. If you need more advanced load balancing, you can use an external load balancer such as Cloudflare to distribute traffic between your services.

### Sticky Sessions

For now Railway does not support sticky sessions nor report the usage of the replicas within the metrics view.