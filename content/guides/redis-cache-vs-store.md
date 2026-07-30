---
title: Run Redis as a Cache vs a Persistent Store
description: Configure Redis as a cache or as a durable store on Railway. Covers the persistence settings, eviction policies, and start commands for each mode.
date: "2026-07-29"
tags:
  - redis
  - caching
  - persistence
  - architecture
topic: architecture
---

Redis can play two different roles. As a cache, it holds disposable copies of data that lives elsewhere, and losing everything in it costs you nothing but a few slow requests. As a persistent store, it is the system of record for data like sessions, queues, or counters, and losing it means losing real state. The same server binary handles both roles, but getting each one right means configuring it separately: a cache with bounded memory and eviction, or a durable store with AOF persistence and a volume.

## Three settings decide the mode

These are the settings that separate the two configurations:

| Setting | Cache | Persistent store |
|---|---|---|
| `maxmemory` | Set to a hard limit | Unset or generous headroom |
| `maxmemory-policy` | `allkeys-lru` (or `allkeys-lfu`) | `noeviction` (default) |
| Persistence (RDB/AOF) | Disabled | AOF enabled, plus RDB snapshots |

The dividing line is whether Redis is allowed to throw data away: a cache is, a store is not. Everything else follows from that.

## Configure Redis as a cache

For a cache you want bounded memory, automatic eviction of cold keys, and no disk writes.

Deploy the [Redis template](/databases/redis), then set a custom [start command](/deployments/start-command) on the service:

```bash
redis-server --save "" --appendonly no --maxmemory 400mb --maxmemory-policy allkeys-lru
```

What each flag does:

- `--save ""` disables RDB snapshots. Without this, the Redis Docker image uses its built-in snapshot schedule and writes dump files to disk. A cache does not need them.
- `--appendonly no` keeps the append-only file off. This is already the default; the flag makes the intent explicit.
- `--maxmemory 400mb` caps the dataset. When the cap is reached, Redis evicts keys instead of growing.
- `--maxmemory-policy allkeys-lru` evicts the least recently used key, across all keys, whenever memory is needed. Use `allkeys-lfu` instead if your access pattern favors frequently used keys over recently used ones.

A cache configured this way does not need a volume. If the service restarts, it comes back empty and refills from your source of truth.

### Pick a maxmemory value

Railway bills memory at usage-based rates (see [pricing](/pricing/plans)), so `maxmemory` is also your cost ceiling for the dataset. Leave headroom between `maxmemory` and the service's memory limit: Redis needs extra memory beyond the dataset for client buffers and copy-on-write during forks. That headroom follows a common rule: set `maxmemory` to roughly half of the memory you expect the container to use at peak.

### Eviction policies compared

| Policy | Behavior | Use when |
|---|---|---|
| `noeviction` | Writes fail with an error when memory is full | Redis is a store, never a cache |
| `allkeys-lru` | Evict least recently used key, any key | General-purpose cache |
| `allkeys-lfu` | Evict least frequently used key, any key | Cache with stable hot set |
| `volatile-lru` | Evict LRU among keys with a TTL | Mixed cache and store in one instance (avoid this, see below) |
| `volatile-ttl` | Evict the key closest to expiry | TTL-driven caches |
| `allkeys-random` / `volatile-random` | Evict random keys | Rarely the right choice |

## Configure Redis as a persistent store

For sessions, job queues (BullMQ, Sidekiq, Celery), rate-limit counters, or any data your application cannot rebuild, you need durability.

1. **Attach a volume.** The Railway Redis template runs the [official Redis Docker image](https://hub.docker.com/_/redis), which uses `/data` as its working directory. Make sure the service has a [volume](/volumes) mounted at `/data` so RDB and AOF files survive restarts and redeploys. That mount happens when the container starts, not during build, which works fine for Redis since it only reads its data directory at runtime.

2. **Enable AOF.** Set the start command:

```bash
redis-server --appendonly yes --appendfsync everysec
```

The append-only file logs every write. With `appendfsync everysec`, Redis syncs the log to disk once per second, so a crash loses at most about one second of writes. Alongside that AOF log, RDB snapshots stay on their default schedule and act as compact restore points.

3. **Keep `noeviction`.** It is the default policy. When memory fills up, writes fail loudly instead of Redis silently deleting your queue jobs or sessions. A failed write is a signal to resize; a silently evicted job is data loss.

4. **Turn on backups.** Volume-backed services support scheduled [backups](/volumes/backups). Persistence protects you from restarts; backups protect you from bad deploys and operator error.

If the dataset grows, you can resize the volume live from the volume settings without downtime on paid plans.

## Do not mix both roles in one instance

You could run one Redis with TTLs on cache keys, no TTLs on durable keys, and `volatile-lru` as the policy. That setup has three problems:

- Cache traffic and store traffic compete for the same memory budget, so a burst of cache fills can pressure the durable dataset.
- Persistence settings apply to the whole instance. You either pay AOF write overhead for cache traffic or run your durable data without it.
- One `FLUSHALL` or one memory incident takes out both.

Run two Redis services in the same project instead: `redis-cache` with the cache configuration and `redis-store` with the persistent configuration. Both are reachable from your other services over [private networking](/networking/private-networking) at `redis-cache.railway.internal` and `redis-store.railway.internal`, and internal traffic does not count toward egress billing.

## Connect from your application

Each Redis service exposes a `REDIS_URL` [variable](/variables) you can reference from other services in the project. With two instances, reference each service's variable separately.

Install the client:

```bash
npm install ioredis
```

Then connect to both, using the cache with a cache-aside pattern and the store for durable state:

```typescript
import Redis from "ioredis";

// family: 0 enables dual-stack lookup, required for
// private networking hostnames like redis-cache.railway.internal
const cache = new Redis(process.env.CACHE_REDIS_URL!, { family: 0 });
const store = new Redis(process.env.STORE_REDIS_URL!, { family: 0 });

// Cache-aside: try the cache, fall back to the real source, then fill.
async function getProduct(id: string): Promise<Product> {
  const cached = await cache.get(`product:${id}`);
  if (cached) return JSON.parse(cached) as Product;

  const product = await fetchProductFromDatabase(id);
  // Always set a TTL on cache keys. Eviction is the safety net, not the plan.
  await cache.set(`product:${id}`, JSON.stringify(product), "EX", 300);
  return product;
}

// Durable state: no TTL, lives in the persistent instance.
async function recordLogin(userId: string): Promise<void> {
  await store.hset(`session:${userId}`, {
    lastLogin: Date.now().toString(),
  });
}

interface Product {
  id: string;
  name: string;
  priceCents: number;
}

async function fetchProductFromDatabase(id: string): Promise<Product> {
  // Replace with your real database query.
  return { id, name: "example", priceCents: 1000 };
}
```

The `family: 0` option matters when connecting over the internal network. Without it, some clients fail DNS resolution for `.railway.internal` hostnames. See the [ENOTFOUND troubleshooting guide](/databases/troubleshooting/enotfound-redis-railway-internal) for details.

## Which configuration fits your workload

- **Page and API response caching, computed results, HTML fragments:** cache mode. Rebuildable by definition.
- **Sessions:** persistent store. Users notice when every session drops on a redeploy.
- **Job queues:** persistent store with AOF. An evicted or lost job is silent data loss.
- **Rate limiting:** depends. If a reset window on restart is acceptable, cache mode is fine. If limits enforce billing or abuse rules, use the store.
- **Pub/sub:** neither setting matters. Pub/sub messages are never persisted in Redis regardless of configuration; use a queue if you need delivery guarantees.

## Next steps

- [Redis on Railway](/databases/redis) - Deploy and connect the Redis template.
- [Using Volumes](/volumes) - Attach persistent storage to a service.
- [Backups](/volumes/backups) - Schedule automated volume backups.
- [Choose Between Cron Jobs, Background Workers, and Queues](/guides/cron-workers-queues) - Background processing patterns that pair with Redis.
