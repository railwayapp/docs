---
title: ENOTFOUND redis.railway.internal
---

## What This Error Means

The error code `ENOTFOUND` means that your application could not resolve the `redis.railway.internal` hostname to an IP address when trying to connect to the Redis database.

## Why This Error Can Occur

The main reason this error can occur is because your application uses the [`ioredis`](https://www.npmjs.com/package/ioredis) package to connect to the Redis database, or uses a package that uses ioredis as a dependency such as [`bullmq`](https://docs.bullmq.io/).

By default, ioredis will only do an IPv4 (A record) lookup for the `redis.railway.internal` hostname.

That presents a problem given that Railway's private network uses only IPv6 (AAAA records).

The lookup will fail because the A records for `redis.railway.internal` do not exist.

## Solutions

The solution depends on the package you are using to connect to the Redis database, though the solution is the same for both.

### ioredis

`ioredis` has an option to do a dual stack lookup, which will try to resolve the `redis.railway.internal` hostname using both IPv4 and IPv6 addresses (A and AAAA records).

To enable this, in your `REDIS_URL` environment variable, you can set the `family` to `0` to enable dual stack lookup.

```js
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL + '?family=0');

const ping = await redis.ping();
```

### bullmq

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
        password: redisURL.password
    }
});

const jobs = await queue.getJobs();

console.log(jobs);
```

### Other

Above we covered the two most common packages that can cause this error, but there are other packages that use `ioredis` as a dependency that may also cause this error.

If you are using a package that uses `ioredis` as a dependency, you can try to find a way to set the `family` option to `0` either in your connection object or in your `REDIS_URL` environment variable. Similar to the examples above.
