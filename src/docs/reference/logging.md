---
title: Logging
description: Learn about log retention on Railway.
---

Logs for services deployed to Railway are available to diagnose issues or track performance.

## How it Works

Any build or deployment logs emitted to standard output or standard error (
eg. `console.log(...)`) are captured by Railway to be viewed or searched later.

## Log Retention

Depending on your plan, logs are retained for a certain amount of time.

| Plan          | Retention\*   |
| ------------- | ------------- |
| Hobby / Trial | 7 days        |
| Pro           | 30 days       |
| Enterprise    | Up to 90 days |

_\* Upgrading plans will immediately restore logs that were previously
outside of the retention period._

## Logging throughput

To maintain quality of service for all users, Railway enforces a logging rate limit of **500 log lines per second per <a href="/reference/scaling#horizontal-scaling-with-replicas" target="_blank">replica</a>** across all plans. When this limit is exceeded, additional logs are dropped and you'll see a warning message like this:

```txt
Railway rate limit of 500 logs/sec reached for replica, update your application to reduce the logging rate. Messages dropped: 50
```

If you encounter this limit, here are some strategies to reduce your logging volume:

- Reduce log verbosity in production
- Use structured logging with minimal formatting (e.g., minified JSON instead of pretty-printed objects)
- Implement log sampling for high-frequency events
- Conditionally disable verbose logging based on the environment
- Combine multiple related log entries into single messages

## Viewing Logs

For information on how to view logs, head over to the [guide for using logs](/guides/logs).
