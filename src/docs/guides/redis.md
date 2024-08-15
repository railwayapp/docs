---
title: Deploy Redis
---

Railway offers two Redis deployment options to accommodate different needs: a **Standalone Instance** and a **High Availability (HA) Cluster**.

- **Standalone Instance** - a single Redis server that is easy to manage; ideal for development environments, smaller projects, or services that are less sensitive to disruption.

- **High Availability (HA) Cluster** - intended for production workloads where uptime is critical. It consists of three Redis nodes in [replication mode](https://redis.io/docs/latest/operate/oss_and_stack/management/replication/), complemented by three [Sentinel services](https://redis.io/learn/operate/redis-at-scale/high-availability/understanding-sentinels) for automatic failover.

## Standalone Redis

Let's talk about how to deploy, connect, and manage the standalone instance.

### Deploy

You can deploy a standalone Redis database via the `CMD + K` menu or by clicking the `+ New` button on the Project Canvas.

<Image src="https://res.cloudinary.com/railway/image/upload/v1695934218/docs/databases/addDB_qxyctn.gif"
alt="GIF of the Adding Database"
layout="responsive"
width={450} height={396} quality={100} />

You can also deploy it via the [template](https://railway.app/template/redis) from the template marketplace.

#### Service Source

Upon deployment, you will have a standalone Redis service running in your project, deployed from the [bitnami/redis](https://hub.docker.com/r/bitnami/redis) Docker image.

### Connect

Connect to the Redis server from another service in your project by [referencing the environment variables](/guides/variables#referencing-another-services-variable) made available in the Redis service:

- `REDISHOST`
- `REDISUSER`
- `REDISPORT`
- `REDISPASSWORD`
- `REDIS_URL`

#### Connecting externally

It is possible to connect to Redis externally (from outside of the [project](/develop/projects) in which it is deployed), by using the [TCP Proxy](/deploy/exposing-your-app#tcp-proxying) which is enabled by default.

*Keep in mind that you will be billed for [Network Egress](/reference/pricing/plans#resource-usage-pricing) when using the TCP Proxy.*

### Modify the deployment

Since the deployed container is pulled from the [bitnami Redis](https://hub.docker.com/r/bitnami/redis) image in Docker Hub, you can modify the deployment based on the [instructions in Docker Hub](https://hub.docker.com/r/bitnami/redis).

## High Availability Redis Cluster

We'll cover how to deploy, connect, and manage the [High Availability (HA) Redis Cluster](https://redis.io/docs/latest/operate/oss_and_stack/management/sentinel/) in this section.

### Deploy

You can deploy a HA Redis Cluster via the [template in the marketplace](https://railway.app/template/ha-redis).

<Image src="https://res.cloudinary.com/railway/image/upload/v1723667697/docs/databases/rediscluster_x6zzwd.png"
alt="Redis HA in the marketplace"
layout="responsive"
width={376} height={396} quality={100} />

#### Deployed services

Upon deployment, you will have a cluster of 3 Redis nodes deployed from the [bitnami/redis](https://hub.docker.com/r/bitnami/redis) image, running in replication mode. 

Additionally, 3 Sentinel nodes will be deployed from the [bitnami/redis-sentinel](https://hub.docker.com/r/bitnami/redis-sentinel) image to manage failover.

#### Multi-region deployment

By default, each node is deployed to a different region (US West, US East, and EU West) for fault tolerance.

Since region selection is a Pro-only feature, this only applies to Pro users. If you deploy this template as a Hobby user, all nodes will deploy to US West.

### Connect

To connect to the Redis cluster, you should connect via the Sentinel services using the environment variables available in the Sentinel services.

<Image src="https://res.cloudinary.com/railway/image/upload/v1723761949/docs/databases/CleanShot_2024-08-15_at_16.43.46_ngja7a.gif"
alt="MySQL Router variables"
layout="responsive"
width={655} height={396} quality={100} />

The exact method to configure your client will depend on the client library you are using.  As an example, a Node.js server using `ioredis` can be found here [here](https://github.com/railwayapp-templates/redis-ha-sentinel/blob/main/exampleApps/node/server.js#L4).

#### Connecting externally

It is possible to connect to the Redis cluster externally (from outside of the [project](/develop/projects) in which it is deployed) by using the [TCP Proxy](/deploy/exposing-your-app#tcp-proxying).

*Keep in mind that you will be billed for [Network Egress](/reference/pricing/plans#resource-usage-pricing) when using the TCP Proxy.*

### Modify the deployment

Since the deployed containers are based on the `bitnami/redis` and `bitnami/redis-sentinel` images, you can refer to the documentation for each to understand how to customize them:
- [bitnami/redis](https://hub.docker.com/r/bitnami/redis)
- [bitnami/redis-sentinel](https://hub.docker.com/r/bitnami/redis-sentinel)
- [Redis Official Documentation](https://redis.io/documentation)

## Backup and Monitoring

Especially for production environments, performing backups and monitoring the health of your data is essential. Consider adding:

- **Backup solutions**: Automate regular backups to ensure data recovery in case of failure.

- **Observability**: Implement monitoring for insights into performance and health of your Redis cluster. You can integrate a Redis exporter for Prometheus, although we do not provide a specific template at this time.

## Additional Resources

- [Redis Documentation](https://redis.io/docs/latest/operate/oss_and_stack/)
- [Redis Replication](https://redis.io/docs/latest/operate/oss_and_stack/management/replication/)
- [High Availability with Redis Sentinel](https://redis.io/docs/latest/operate/oss_and_stack/management/sentinel/)
- [Understanding Sentinels](https://redis.io/learn/operate/redis-at-scale/high-availability/understanding-sentinels)