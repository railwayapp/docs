---
title: Redis
---

The Railway Redis database service allows you to provision and connect to a
Redis database with zero configuration.

## Deploy

You can add a Redis database via the `CMD + K` menu or by clicking the `+ New` button on the Project Canvas.

<Image src="https://res.cloudinary.com/railway/image/upload/v1695934218/docs/databases/addDB_qxyctn.gif"
alt="GIF of the Adding Database"
layout="intrinsic"
width={450} height={396} quality={100} />

## Connect

There are two ways to connect to a Redis database:
- privately via [Private Networking](/reference/private-networking)
- publicly via [TCP Proxy](/deploy/exposing-your-app#tcp-proxying)

When you deploy your Redis database, you will have access to two environment [variables](/develop/variables) that enable one of the two connection types (private or public).

As you create more services in your project, you can use [Reference Variables](/develop/variables#reference-variables) to easily connect to the Redis database.

### Private Networking

To access your Redis database from another service within the same [project](/develop/projects), you can use the `REDIS_PRIVATE_URL` environment variable.

This connection string uses [Private Networking](/reference/private-networking) to route communication to your service over the private network.

### TCP Proxy Connection

To access your Redis database over the public internet, you can use the connection string stored in the `REDIS_URL` environment variable available in the service.

This connection string uses the [TCP Proxy connection](/deploy/exposing-your-app#tcp-proxying) to route communication to your service over the public internet.

You can also connect using redis-cli:
```bash
redis-cli -h TCP_PROXY_DOMAIN -p TCP_PROXY_PORT

AUTH REDIS_PASSWORD
```

## Variables

The following variables are included in the Redis service and can be referenced in other services:
- `REDISHOST`
- `REDISUSER`
- `REDISPORT`
- `REDISPASSWORD`
- `REDIS_URL`
- `REDIS_PRIVATE_URL`

Connect to your Redis container using your library of choice and supplying the
appropriate environment variables.

## Image

The Redis database service uses the [bitnami/redis:latest](https://hub.docker.com/r/bitnami/redis/) docker image.

## Changing System Variables

Tailor your Redis service to your needs by adding any variables relevant to the [bitnami/redis:latest](https://hub.docker.com/r/bitnami/redis/) image.