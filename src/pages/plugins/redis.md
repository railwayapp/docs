---
title: Redis
---

The Railway Redis plugin allows you to provision and connect to a
Redis database with zero configuration.

## Connect

When you run `railway run` in a project with the Redis plugin installed, we inject several environment variables.

- REDISHOST
- REDISUSER
- REDISPORT
- REDISPASSWORD
- REDIS_URL

Connect to your Redis container using your library of choice and supplying the
appropriate environment variables.


## Image

The Redis plugin uses the [bitnami/redis:6.0](https://hub.docker.com/r/bitnami/redis/) docker image.
