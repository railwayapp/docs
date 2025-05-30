---
title: Viewing Logs
description: Learn how to view and filter build, deployment, environment, and HTTP logs on Railway.
---

Any build or deployment logs emitted to standard output or standard error (e.g. `console.log(...)`) are captured by Railway to be viewed or searched later.

There are three ways to view logs in Railway.

- **Build/Deploy Panel** → Click on a deployment in the dashboard
- **Log Explorer** → Click on the Observability tab in the top navigation
- **CLI** → Run the `railway logs` command

## Build / Deploy Panel

Logs for a specific deployment can be viewed by clicking on the deployment in the service window, useful when debugging application failures.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1722993852/docs/CleanShot_2023-09-08_at_10.55.06_2x_co6ztr.png"
alt="deploy logs for a specific deployment"
layout="responsive"
width={1365} height={790} quality={80} />

Similarly, logs for a specific build can be viewed by clicking on the **Build Logs** tab once you have a deployment open.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1722993947/docs/build_logs_og7uec.png"
alt="deploy logs for a specific deployment"
layout="responsive"
width={1365} height={790} quality={80} />

## Log Explorer

Logs for the entire environment can be viewed together by clicking the "Observability" button in the top navigation. The Log Explorer is useful for debugging more general problems that may span multiple services.

The log explorer also has additional features like selecting a date range or toggling the visibility of specific columns.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1694194133/docs/log-explorer_nrlong.png"
alt="Railway Log Explorer"
layout="responsive"
width={1166} height={650} quality={80} />

## Command Line 

Deployment logs can also be viewed from the command line to quickly check the current status of the latest deployment. Use `railway logs` to view them.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1694195563/docs/CleanShot_2023-09-08_at_10.52.12_2x_yv1d7f.png"
alt="Viewing logs using the command line interface"
layout="responsive"
width={1489} height={591} quality={80} />

## Filtering Logs

Railway supports a custom filter syntax that can be used to query logs.

Filter syntax is available for all log types, but some log types have specific attributes.

### Deployment Logs

- `<search term>` → Filter for a partial substring match

- `"<search term>"` → Filter for an exact log message 

- `replica:<replica_id>` → Filter by a specific replica's UUID

- `@attribute:value` → Filter by custom attribute (see structured logs below)

**Examples:**

Find logs that contain the word "request".

```text
request
```

Find logs that exactly match the message "request handled".

```text
"request handled"
```

Find logs with an error level.

```text
@level:error
```

Find logs with a warning level.

```text
@level:warn
```

Find logs with an error level and specific text.

```text
@level:error AND "failed to send batch"
```

Find logs with a specific custom attribute.

```text
@customAttribute:value
```

Find logs with a specific array attribute.

```text
@arrayAttribute[i]:value
```

### Environment Logs

Environment logs allow you to query for logs from the environment they were emitted in.

This means that you can search for logs emitted by all services in an environment at the same time, all in one central location.

In addition to the filters available for deployment logs, an additional filter is available for environment logs:

- `@service:<service_id>` → Filter by a specific service's UUID

**Examples:**

Filter out logs from the Postgres database service.

```text
-@service:<postgres_service_id>
```

Filter logs from the Postgres database service and the Redis cache service. 

```text
-@service:<postgres_service_id> AND -@service:<redis_service_id>
```

Show only logs from the Postgres database and Redis cache services.

```text
@service:<postgres_service_id> OR @service:<redis_service_id>
```

### HTTP Logs

HTTP logs use the same filter syntax, but have a specific set of attributes for HTTP-specific data.

Some commonly used filters for HTTP logs are:

- `@requestId:<request_id>` → Filter by request ID

- `@timestamp:<timestamp>` → Filter by timestamp (Formatted in RFC3339)

- `@method:<method>` → Filter by method

- `@path:<path>` → Filter by path

- `@host:<host>` → Filter by host

- `@httpStatus:<status_code>` → Filter by HTTP status code

- `@responseDetails:<details>` → Filter by response details (Only populated when the application fails to respond)

- `@clientUa:<user_agent>` → Filter by a specific client's user agent

- `@srcIp:<ip>` → Filter by source IP (The client's IP address that made the request)

- `@edgeRegion:<region>` → Filter by edge region (The region of the edge node that handled the request)

**Examples:**

Find logs for a specific path.

```text
@path:/api/v1/users
```

Find logs for a specific path that returned a 500 error.

```text
@path:/api/v1/users AND @httpStatus:500
```

Find logs for a specific path that returned a 500 or 501 error.

```text
@path:/api/v1/users AND (@httpStatus:500 OR @httpStatus:501)
```

Find all non-200 responses.

```text
-@httpStatus:200
```

Find all requests that originated from or around Europe.

```text
@edgeRegion:europe-west4-drams3a
```

Find all requests that originated from a specific IP address.

```text
@srcIp:66.33.22.11
```

## View In Context

Often, when searching for a log, it is useful to see the surrounding logs. To
do this, either click the "Timestamp" column, or expand any log and click 
the "View in Context" button. 

<Image
src="https://res.cloudinary.com/railway/image/upload/v1694195189/docs/CleanShot_2023-09-08_at_10.45.51_2x_nwxqid.png"
alt="Viewing a log in context"
layout="responsive"
width={1682} height={272} quality={80} />

## Structured Logs

Structured logs are logs emitted in a structured JSON format, useful if you want
to attach custom metadata to logs or preserve multi-line logs like stack traces.

```typescript
console.log(JSON.stringify({
  message: "A minimal structured log", // (required) The content of the log
  level: "info", // Severity of the log (debug, info, warn, error)
  customAttribute: "value", // Custom attributes (query via @name:value)
}));
```

Structured logs are best generated with a library for your language. For example, the default <a href="https://github.com/winstonjs/winston" target="_blank">Winston</a>. JSON format emits logs in the correct structure by default.

Logs with a `level` field will be coloured accordingly in the log explorer.

Logs emitted to `stderr` will be converted to `level.error` and coloured red.

### Examples

Here are a few examples of structured logs.

**Note:** The entire JSON log must be emitted on a single line to be parsed correctly.

```json
{"level":"info","message":"A minimal structured log"}
```

```json
{"level":"error","message":"Something bad happened"}
```

```json
{"level":"info","message":"New purchase!","productId":123,"userId":456}
```

```json
{"level":"info","message":"User roles updated","roles":["editor","viewer"],"userId":123}
```

### Normalization Strategy

In order to ensure a consistent query format across Railway services, incoming logs are normalized to the above format automatically.

- Non-structured logs are converted to `{"message":"...","level":"..."}`

- `log.msg` converted to `log.message`

- `log.level` converted to `log.severity`

- Logs from `stderr` are converted to `level.error`

- Logs from `stdout` are converted to `level.info`

- Levels are lowercased and matched to the closest of `debug`, `info`, `warn`, `error`
