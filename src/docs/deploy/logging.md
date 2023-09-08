---
title: Logging
---

Any build or deployment logs emitted to standard output or standard error (
eg. `console.log(...)`) is captured by Railway to be viewed or searched later.

Depending on your plan, logs are retained for a certain amount of time.

| Plan          | Retention*    |
|---------------|---------------|
| Hobby / Trial | 7 days        |
| Pro           | 21 days       |
| Enterprise    | Up to 90 days |

_* Upgrading plans will immediately restore logs that were previously 
outside of the retention period._

## Viewing Logs

There are three ways to view logs in Railway.

- **Build/Deploy Panel** → Click on a deployment in the dashboard
- **Log Explorer** → Click on the Observability tab in the top navigation
- **CLI** → Run the `railway logs` command

### Build/Deploy Panel

Logs for a specific deployment can be viewed by clicking on the deployment 
in dashboard, useful when debugging build or deployment failures.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1694195763/docs/CleanShot_2023-09-08_at_10.55.06_2x_co6ztr.png"
alt="Logs for a specific deployment"
layout="responsive"
width={1385} height={816} quality={80} />


### Log Explorer

Logs for the entire environment can be viewed together by clicking the 
"Observability" button in the top navigation. The Log Explorer is useful for 
debugging more general problems that may span multiple services.

The log explorer also has additional features like selecting a date range or 
toggling the visibility of specific columns.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1694194133/docs/log-explorer_nrlong.png"
alt="Railway Log Explorer"
layout="responsive"
width={1166} height={650} quality={80} />

### Command Line 

Deployment logs can also be viewed from the command line to quickly check 
the current status of the latest deployment. Use `railway logs` to view them.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1694195563/docs/CleanShot_2023-09-08_at_10.52.12_2x_yv1d7f.png"
alt="Viewing logs using the command line interface"
layout="responsive"
width={1489} height={591} quality={80} />

## Filtering Logs

Railway supports a custom filter syntax that can be used to query logs.

- `<keyword>` or `"key phrase"` → Filter by exact text 
- `@key:value` → Filter by key/value pair
  - Valid keys are replica, deployment, service, plugin
- `@attribute:value` → Filter by custom attribute (see structured logs below)

Any of the above expressions can be combined with boolean operators `AND`, 
`OR`, and `-` (negation).

**Find logs containing "error" for a specific service** 👇
```text
error AND @service:123
```

**Find all 404 errors that are NOT from a specific service** 👇
```text
(404 OR 503) AND -@service:123
```

**Find logs with a custom attribute** 👇
```text
@fullName:"first last"
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

<PriorityBoardingBanner />

Structured logs are logs emitted in a structured JSON format, useful if you want
to attach custom metadata to logs or preserve multi-line logs like stack traces.

```typescript
type StructuredLog = {
  // (required) The content of the log
  message: string;

  // Severity of the log (default info)
  level: "debug" | "info" | "warn" | "error";

  // Custom attributes (query via @name:value)
  [string]: string | number | boolean | null;
}
```

Structured logs are best generated with a library for your language. For
example, the default [Winston](https://github.com/winstonjs/winston) JSON
format emits logs in the correct structure by default.

### Examples

Here are a few examples of structured logs. Note that the entire log must be
emitted on a single line to be parsed correctly.

```text
{"message":"A minimal structured log"}
```

```text
{"level":"error","message":"Something bad happened"}
```

```text
{"message":"New purchase!","productId":123,"userId":456}
```
