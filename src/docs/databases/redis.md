---
title: Redis
---

The Railway Redis database service allows you to provision and connect to a
Redis database with zero configuration.

## Connect

There are two ways to connect to a Redis database:

- Add a [Reference Variable](/develop/variables#reference-variables) to a service
- Run `railway connect` to start a `redis-cli` shell

The following variables are made available to reference in your services:

- `REDISHOST`
- `REDISUSER`
- `REDISPORT`
- `REDISPASSWORD`
- `REDIS_URL`

Connect to your Redis container using your library of choice and supplying the
appropriate environment variables.

## Image

The Redis database service uses the [bitnami/redis:6.0](https://hub.docker.com/r/bitnami/redis/) docker image.
