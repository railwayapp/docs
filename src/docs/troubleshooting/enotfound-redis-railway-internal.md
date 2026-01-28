---
title: ENOTFOUND redis.railway.internal
description: Learn how to troubleshoot and fix the 'ENOTFOUND' redis.railway.internal error.
---

## What This Error Means

The error code `ENOTFOUND` means that your application could not resolve the `redis.railway.internal` hostname to an IP address when trying to connect to the Redis database.

## Why This Error Can Occur

This error can occur for a few different reasons, but the main reason is because your application uses the [`ioredis`](https://www.npmjs.com/package/ioredis) package to connect to the Redis database, or uses a package that uses ioredis as a dependency such as [`bullmq`](https://docs.bullmq.io/).

By default, ioredis will only do an IPv4 (A record) lookup for the `redis.railway.internal` hostname.

In environments created before October 16th 2025, Railway's private network uses only IPv6 (AAAA records). In these legacy environments, the lookup will fail because the A records for `redis.railway.internal` do not exist.

**Note: New environments support both IPv4 and IPv6, so this specific cause is less likely to occur unless you are explicitly forcing an IPv4 connection in a legacy environment.**

Some other reasons that this error can occur would be -

- Your application and Redis database are in different projects.

- You are trying to connect to a Redis database locally with the private hostname and port.

For either of these reasons, the issue arises because the private network is scoped to a single environment within a [project](https://docs.railway.com/overview/the-basics#project--project-canvas), and would not be accessible from your local machine or other projects.

If the Redis database is in the same project as your application, and you are not trying to connect to a Redis database locally, `ioredis` is the likely cause of the error.

## Solutions

The solution depends on the package you are using to connect to the Redis database, though the solution is the same for both.

### ioredis

#### Using ioredis directly in your application

`ioredis` has an option to do a dual stack lookup, which will try to resolve the `redis.railway.internal` hostname using both IPv4 and IPv6 addresses (A and AAAA records).

To enable this, in your `REDIS_URL` environment variable, you can set the `family` to `0` to enable dual stack lookup.

```js
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL + "?family=0");

const ping = await redis.ping();
```

#### Using bullmq

Similarly, for `bullmq` since it uses `ioredis` as a dependency, you can set the `family` option to `0` in your connection object.

```js
import { Queue } from "bullmq";

const redisURL = new URL(process.env.REDIS_URL);

const queue = new Queue("Queue", {
  connection: {
    family: 0,
    host: redisURL.hostname,
    port: redisURL.port,
    username: redisURL.username,
    password: redisURL.password,
  },
});

const jobs = await queue.getJobs();

console.log(jobs);
```

#### Other packages

Above we covered the two most common packages that can cause this error, but there are other packages that use `ioredis` as a dependency that may also cause this error.

If you are using a package that uses `ioredis` as a dependency, you can try to find a way to set the `family` option to `0` either in your connection object or in your `REDIS_URL` environment variable. Similar to the examples above.

### Redis database in a different project

Create a [new Redis database](https://docs.railway.com/guides/redis) in the same [project](https://docs.railway.com/overview/the-basics#project--project-canvas) as your application, and connect it to the Redis database using the private network as shown in the examples above.

Read about best pracices to get the most out of the platform [here](/overview/best-practices).

### Connecting to a Redis database locally

The easiest way to connect to a Redis database locally is to use the public network.

You can do this is by using the `REDIS_PUBLIC_URL` environment variable to connect to the Redis database.

```js
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_PUBLIC_URL);

const ping = await redis.ping();
```
