---
title: Set Up Structured Logging for a Production App
description: Emit JSON logs from your Railway services so the Log Explorer can parse, color, and filter them by level and custom attributes.
date: "2026-07-29"
tags:
  - logging
  - observability
  - monitoring
  - debugging
topic: infrastructure
---

Structured logging means emitting each log line as a single-line JSON object instead of plain text. Railway parses these objects automatically: the `level` field colors the line in the Log Explorer, the `message` field becomes the log text, and every other field becomes a custom attribute you can filter on with `@name:value` queries.

This guide sets that up for a Node.js service with Pino, shows equivalents for Python and Go, and queries the results in the Log Explorer.

## How Railway parses your logs

Railway captures everything your service writes to standard output and standard error. If one of those lines is valid JSON, Railway reads these fields:

```json
{
  "message": "A minimal structured log",
  "level": "info",
  "customAttribute": "value"
}
```

- `message` is the log content shown in the explorer.
- `level` is the severity: `debug`, `info`, `warn`, or `error`. Lines with a level are colored accordingly.
- Any other field becomes a queryable attribute, including arrays and numbers.

Railway normalizes common variations so most logging libraries work without custom configuration:

- `msg` is converted to `message`
- Levels are lowercased and matched to the closest of `debug`, `info`, `warn`, `error`
- Plain-text lines are wrapped as `{"message": "...", "level": "..."}`
- Lines written to stdout default to `level: info`; lines written to stderr become `level: error`

The one hard requirement: each JSON object must be emitted on a single line, so disable pretty-printing in production. In return, multi-line content like stack traces stays intact inside the `message` field, where plain-text logging would split it into separate lines.

## Set up Pino in a Node.js service

Pino is a JSON logger for Node.js. Install it along with `pino-http` for request logging:

```bash
npm install express pino pino-http
```

Pino emits numeric levels (`"level": 30`) by default. Configure it to emit label strings instead so Railway can match them:

```javascript
// logger.js
import { pino } from "pino";

export const logger = pino({
  // Emit "level": "info" instead of "level": 30
  formatters: {
    level: (label) => ({ level: label }),
  },
  // Emit "message" instead of "msg" (Railway normalizes "msg" too,
  // but "message" matches the parsed format exactly)
  messageKey: "message",
});
```

Use it in an Express app, with a request logger that attaches a request ID to every line:

```javascript
// server.js
import express from "express";
import { pinoHttp } from "pino-http";
import { randomUUID } from "node:crypto";
import { logger } from "./logger.js";

const app = express();
app.use(express.json());

app.use(
  pinoHttp({
    logger,
    genReqId: (req) => req.headers["x-request-id"] ?? randomUUID(),
    // Put the request ID at the top level so it is filterable
    // as @requestId:<id> in the Log Explorer
    customProps: (req) => ({ requestId: req.id }),
  }),
);

app.post("/checkout", (req, res) => {
  const start = Date.now();
  const { userId, productId } = req.body ?? {};

  // Custom fields become filterable attributes: @userId:456
  req.log.info({ userId, productId }, "checkout started");

  try {
    // ... process the order ...
    req.log.info(
      { userId, productId, durationMs: Date.now() - start },
      "checkout completed",
    );
    res.json({ ok: true });
  } catch (err) {
    // Pino serializes the error, stack trace included, into one line
    req.log.error({ err, userId }, "checkout failed");
    res.status(500).json({ ok: false });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  logger.info({ port: Number(port) }, "server listening");
});
```

That `import` syntax needs `"type": "module"` set in your `package.json`.

A checkout request now produces lines like this (Pino's `time`, `pid`, and `req` fields trimmed for brevity):

```json
{"level":"info","message":"checkout completed","userId":456,"productId":123,"durationMs":84,"requestId":"a1b2c3d4"}
```

Keep pretty-printing out of production. If you use `pino-pretty` locally, run it as a dev-only transport:

```javascript
const logger = pino({
  formatters: { level: (label) => ({ level: label }) },
  messageKey: "message",
  transport:
    process.env.NODE_ENV !== "production"
      ? { target: "pino-pretty" }
      : undefined,
});
```

## Set up structlog in a Python service

Install structlog:

```bash
pip install structlog
```

Configure it to emit single-line JSON with the fields Railway expects. structlog names the log text `event` by default, so rename it to `message`:

```python
# logger.py
import structlog

structlog.configure(
    processors=[
        structlog.processors.add_log_level,
        structlog.processors.EventRenamer("message"),
        structlog.processors.JSONRenderer(),
    ]
)

log = structlog.get_logger()

log.info("checkout completed", user_id=456, product_id=123, duration_ms=84)
```

Output:

```json
{"user_id": 456, "product_id": 123, "duration_ms": 84, "level": "info", "message": "checkout completed"}
```

## Set up slog in a Go service

The standard library's `log/slog` package needs no dependencies. Its JSON handler emits `msg` and uppercase levels, both of which Railway normalizes automatically:

```go
package main

import (
	"log/slog"
	"os"
)

func main() {
	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))
	logger.Info("checkout completed", "userId", 456, "durationMs", 84)
}
```

Output:

```json
{"time":"2026-07-29T12:00:00Z","level":"INFO","msg":"checkout completed","userId":456,"durationMs":84}
```

Railway converts `msg` to `message` and matches `INFO` to `info`.

## Query structured logs in the Log Explorer

Open the **Observability** tab in your project to reach the Log Explorer, which searches across all services in the environment. The same filter syntax works in a single deployment's log panel.

Filter by level:

```text
@level:error
```

Filter by a custom attribute your app emitted:

```text
@userId:456
```

Combine filters with `AND`, `OR`, and `-` (negation), and group with parentheses:

```text
@level:error AND "checkout failed"
```

```text
@productId:123 AND (@level:warn OR @level:error)
```

Numeric attributes support comparison operators and ranges:

```text
@durationMs:>500
```

```text
@durationMs:100..500
```

Array attributes are filterable by element:

```text
@roles[0]:editor
```

In the environment-wide view, scope by service or exclude noisy ones:

```text
@service:<service_id> AND @level:error
```

```text
-@service:<postgres_service_id>
```

To trace one request across log lines, filter on the request ID your logger attached:

```text
@requestId:a1b2c3d4
```

Right-click any matched line and select **View in Context** to see the surrounding logs.

## Production practices

**Stay under the rate limit.** Railway allows 500 log lines per replica per second; beyond that, lines are dropped and a warning appears in your logs. Structured logging helps here: one JSON object with ten fields is one line, where a pretty-printed object would be ten. Dropping `debug` level in production and sampling high-frequency events cuts that count further.

**Log to stdout, not files.** Railway only captures standard output and standard error. File-based logs are invisible to the Log Explorer and lost on redeploy unless written to a volume.

**Keep attribute names consistent.** Pick one convention (`userId` everywhere, not `user_id` in one service and `uid` in another) so a single filter works across the whole environment view.

**Know your retention window.** Logs are retained 7 days on Hobby, 30 days on Pro, and up to 90 days on Enterprise. For longer retention, forward logs to a third-party tool. See [Connect a Third-Party Observability Tool](/guides/third-party-observability).

## Next steps

- [Logs reference](/observability/logs) for the full filter syntax, HTTP log attributes, and DNS log attributes
- [Connect a Third-Party Observability Tool](/guides/third-party-observability) for retention beyond your plan's window
- [Deploy an OpenTelemetry Collector Stack](/guides/deploy-an-otel-collector-stack) for metrics and traces alongside logs
- [Metrics](/observability/metrics) for built-in CPU, memory, and network graphs
