---
title: Logging
---

Logs for services deployed to Railway are made availabe for you to diagnose issues or track performance.

## How it Works

Any build or deployment logs emitted to standard output or standard error (
eg. `console.log(...)`) is captured by Railway to be viewed or searched later.

## Log Retention

Depending on your plan, logs are retained for a certain amount of time.

| Plan          | Retention*    |
|---------------|---------------|
| Hobby / Trial | 7 days        |
| Pro           | 21 days       |
| Enterprise    | Up to 90 days |

_* Upgrading plans will immediately restore logs that were previously 
outside of the retention period._

## Viewing Logs

For information on how to view logs, head over to the [how-to guide for logs](/how-to/view-logs).
