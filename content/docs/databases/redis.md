---
title: Redis
description: Learn how to deploy a Redis database on Railway.
---

The Railway Redis database template allows you to provision and connect to a Redis database with zero configuration.

## Deploy

Add a Redis database to your project via the `ctrl / cmd + k` menu or by clicking the `+ New` button on the Project Canvas.

<Image src="https://res.cloudinary.com/railway/image/upload/v1695934218/docs/databases/addDB_qxyctn.gif"
alt="GIF of the Adding Database"
layout="responsive"
width={450} height={396} quality={100} />

You can also deploy it via the [template](https://railway.com/deploy/redis) from the template marketplace.

#### Deployed service

Upon deployment, you will have a Redis service running in your project, deployed from the [redis](https://hub.docker.com/_/redis) Docker image.

### Connect

Connect to the Redis server from another service in your project by [referencing the environment variables](/variables#referencing-another-services-variable) made available in the Redis service:

- `REDISHOST`
- `REDISUSER`
- `REDISPORT`
- `REDISPASSWORD`
- `REDIS_URL`

#### Connecting externally

It is possible to connect to Redis externally (from outside of the [project](/projects) in which it is deployed), by using the [TCP Proxy](/networking/tcp-proxy) which is enabled by default.

_Keep in mind that you will be billed for [Network Egress](/pricing/plans#resource-usage-pricing) when using the TCP Proxy._

### Modify the deployment

Since the deployed container is pulled from the [redis](https://hub.docker.com/_/redis) image in Docker Hub, you can modify the deployment based on the [instructions in Docker Hub](https://hub.docker.com/_/redis).

## Backup and monitoring

Especially for production environments, performing backups and monitoring the health of your data is essential. Consider adding:

- **Backups**: Automate regular backups to ensure data recovery in case of failure. We suggest checking out the native [Backups](/volumes/backups) feature.

- **Observability**: Implement monitoring for insights into performance and health of your Redis cluster. You can integrate a Redis exporter for Prometheus, although we do not provide a specific template at this time.

## Additional resources

While these templates are available for your convenience, they are considered unmanaged, meaning you have total control over their configuration and maintenance.

We _strongly encourage you_ to refer to the source documentation to gain deeper understanding of their functionality and how to use them effectively. Here are some links to help you get started:

- [Redis Documentation](https://redis.io/docs/latest/operate/oss_and_stack/)
- [Redis Replication](https://redis.io/docs/latest/operate/oss_and_stack/management/replication/)
- [High Availability with Redis Sentinel](https://redis.io/tutorials/operate/redis-at-scale/high-availability/#understanding-sentinels)
- [Understanding Sentinels](https://redis.io/learn/operate/redis-at-scale/high-availability/understanding-sentinels)
