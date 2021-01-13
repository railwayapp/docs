---
title: Redis
---

The Railway Redis plugin allows you to provision and connect to a
PostgreSQL database with zero configuration.

### Connect

When you run `railway run` in a project with the Redis plugin installed, we inject several environment variables.

- `REDISHOST`
- `REDISUSER`
- `REDISPORT`
- `REDISPASSWORD`
- `REDIS_URL`

Connect to your Redis container using your library of choice and supplying the
appropriate environment variables.

### Example Usage

Run these examples with `railway run`.

```js
import redis from "redis"

const client = redis.createClient({
  url: process.env.REDIS_URL,
});

client.on("error", function(error) {
  console.error(error);
});

client.set("key", "value", redis.print);
client.get("key", redis.print);
```

```python
import redis

redis_url = os.environ.get('REDIS_URL')
r = redis.StrictRedis.from_url(redis_url)

r.set('hello', 'world')
value = r.get('hello')
print(value)
```

```ruby
require "redis"

redis = Redis.new(url: ENV.REDIS_URL)

redis.set("mykey", "hello world")
# => "OK"

redis.get("mykey")
# => "hello world"
```
