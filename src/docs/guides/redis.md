---
title: Redis
---

The Railway Redis database service allows you to provision and connect to a
Redis database with zero configuration.

## Deploy

Add a Redis database to your project via the `CMD + K` menu or by clicking the `+ New` button on the Project Canvas.

<Image src="https://res.cloudinary.com/railway/image/upload/v1695934218/docs/databases/addDB_qxyctn.gif"
alt="GIF of the Adding Database"
layout="intrinsic"
width={450} height={396} quality={100} />

## Connect

Connect to Redis from another service in your project by [referencing the environment variables](/guides/variables#referencing-another-services-variable) made available in the Redis service:

- `REDISHOST`
- `REDISUSER`
- `REDISPORT`
- `REDISPASSWORD`
- `REDIS_URL`

#### Connecting externally

It is possible to connect to Redis externally (from outside of the [project](/develop/projects) in which it is deployed), by using the [TCP Proxy](/deploy/exposing-your-app#tcp-proxying) which is enabled by default.

Keep in mind that you will be billed for [Network Egress](/reference/pricing/plans#resource-usage-pricing) when using the TCP Proxy.

## Image

The Redis database service uses the [bitnami/redis](https://hub.docker.com/r/bitnami/redis/) docker image.

## Modifying the Service

Tailor your Redis service to your needs by adding any variables relevant to the [bitnami/redis](https://hub.docker.com/r/bitnami/redis/) image.