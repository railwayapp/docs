---
title: Infrastructure as Code Reference
description: Reference for the .railway/railway.ts TypeScript DSL.
---

This page documents the TypeScript authoring API for Railway Infrastructure as Code. For the workflow and CLI commands, see [Infrastructure as Code](/infrastructure-as-code).

## Authoring `.railway/railway.ts`

A Railway configuration file exports `defineRailway`.

```ts
import { defineRailway, project, service } from "railway/iac";

export default defineRailway(() => {
  const web = service("web");

  return project("my-project", {
    resources: [web],
  });
});
```

### Environment context

`defineRailway` receives a context object from the CLI. Use it to render different desired state for the Railway environment you are planning or applying to.

```ts
export default defineRailway((ctx) => {
  const prod = ctx.environment === "production";

  const web = service("web", {
    replicas: prod ? 3 : 1,
  });

  return project("my-project", {
    resources: [web],
  });
});
```

Available context fields include:

| Field | Description |
|-------|-------------|
| `ctx.command` | The command being run, such as `plan` or `apply`. |
| `ctx.projectId` | The linked Railway project ID. |
| `ctx.projectName` | The linked Railway project name. |
| `ctx.environmentId` | The target environment ID. |
| `ctx.environment` | The target environment name. |
| `ctx.environmentName` | Alias for the target environment name. |
| `ctx.isEnvironment(name)` | Returns `true` when the current environment name matches. |

## Services

Create a service with `service(name, config)`.

```ts
const web = service("web", {
  source: github("acme/web"),
  build: "pnpm build",
  start: "pnpm start",
  healthcheck: "/health",
});
```

Service names should match the names users see in Railway. Names with spaces are valid:

```ts
const docsFrontend = service("Docs Frontend", {
  source: github("acme/docs"),
});
```

### Sources

Use a GitHub source:

```ts
const web = service("web", {
  source: github("owner/repo", { branch: "main" }),
});
```

Use a Docker image:

```ts
const worker = service("worker", {
  source: image("ghcr.io/acme/worker:latest"),
});
```

Omit `source` when `.railway/railway.ts` should manage service settings but not declare a GitHub repository or Docker image:

```ts
const web = service("web", {
  build: "bun run build",
  start: "bun src/index.ts",
});
```

### Build and start commands

```ts
const web = service("web", {
  build: "pnpm build",
  start: "pnpm start",
});
```

### Healthchecks

```ts
const api = service("api", {
  healthcheck: "/health",
  healthcheckTimeout: 30,
});
```

### Replicas

Use `replicas` for scaling intent:

```ts
const web = service("web", {
  replicas: 3,
});
```

For advanced placement, specify [regions](/deployments/regions#region-options):

```ts
const web = service("web", {
  replicas: {
    "us-west2": 2,
    "europe-west4": 1,
  },
});
```

## Environment variables

Set literal variables:

```ts
const web = service("web", {
  env: {
    NODE_ENV: "production",
  },
});
```

Reference another service or database:

```ts
const db = postgres("postgres");

const web = service("web", {
  env: {
    DATABASE_URL: db.env.DATABASE_URL,
  },
});
```

Reference a shared variable defined on the environment using the context:

```ts
export default defineRailway((ctx) => {
  const web = service("web", {
    env: {
      SENTRY_DSN: ctx.shared.SENTRY_DSN,
    },
  });

  return project("my-project", { resources: [web] });
});
```

`ctx.shared.NAME` compiles to `${{shared.NAME}}`. It points at an existing [shared variable](/variables) on the environment; it does not define or manage the shared variable itself.

Preserve an existing Railway-managed value:

```ts
const web = service("web", {
  env: {
    STRIPE_SECRET_KEY: preserve(),
  },
});
```

`preserve()` is mainly used for imported secrets whose values are not available to the CLI. It means “keep the value that is already set in Railway.”

## Databases

Railway provides helpers for common databases:

```ts
const db = postgres("postgres");
const cache = redis("redis");
const mysqlDb = mysql("mysql");
const mongoDb = mongo("mongo");
```

Reference database variables from services:

```ts
const api = service("api", {
  env: {
    DATABASE_URL: db.env.DATABASE_URL,
    REDIS_URL: cache.env.REDIS_URL,
  },
});
```

Database provisioning is handled by Railway product workflows. The configuration file describes the database intent; you do not need to attach a volume to managed database helpers yourself.

## Volumes

Create a persistent volume with `volume(name, config)` and attach it to a service with `volumeMounts`:

```ts
const data = volume("backend-data", {
  region: "us-west2",
  sizeMB: 1024,
});

const backend = service("backend", {
  start: "node server.js",
  volumeMounts: {
    "/data": data,
  },
});

return project("my-project", {
  resources: [backend, data],
});
```

A volume can be attached to one service. The object key in `volumeMounts` is the mount path inside the service container, and the value is the `volume(...)` resource to mount there.

Volume config supports:

| Field | Description |
|-------|-------------|
| `region` | Region where the volume is provisioned. |
| `sizeMB` | Requested volume size in megabytes. |

Increasing `sizeMB` is planned as a non-destructive resize. Decreasing `sizeMB`, deleting a volume, detaching a mounted volume, or changing placement can affect persisted data and is treated as destructive.

`railway config pull` imports existing volumes and service mounts. Managed database volumes may appear in imported configuration so Railway can preserve the existing volume resource, but database helpers such as `postgres("postgres")` still own the database product intent.

## Buckets

Create an object storage bucket:

```ts
const media = bucket("media", {
  region: "iad",
});
```

Bucket regions cannot be changed after creation. If you need a different region, create a new bucket in that region, copy the data, update your services to use the new bucket, and then remove the old bucket when it is no longer needed.

## Custom domains

Attach custom domains to a service:

```ts
const web = service("web", {
  domains: ["app.example.com"],
});
```

Specify a target port:

```ts
const api = service("api", {
  domains: [{ domain: "api.example.com", port: 3000 }],
});
```

Generated Railway service domains are not included in `.railway/railway.ts`.

## Groups

Use groups to organize resources on the Railway canvas:

```ts
const api = service("api");
const worker = service("worker");
const db = postgres("postgres");

const backend = group("Backend", [api, worker, db]);

return project("my-app", {
  resources: [backend],
});
```

Groups are structural. They make large projects easier to scan in both `.railway/railway.ts` and the Railway canvas.

## Larger example

```ts
import {
  bucket,
  defineRailway,
  github,
  group,
  postgres,
  preserve,
  project,
  redis,
  service,
  volume,
} from "railway/iac";

export default defineRailway((ctx) => {
  const prod = ctx.environment === "production";

  const db = postgres("postgres");
  const cache = redis("redis");
  const uploads = bucket("uploads", { region: "iad" });
  const workerData = volume("worker-data", {
    region: "us-west2",
    sizeMB: 1024,
  });

  const api = service("api", {
    source: github("acme/monorepo", { rootDirectory: "apps/api" }),
    build: "pnpm --filter api build",
    start: "pnpm --filter api start",
    healthcheck: "/health",
    replicas: prod ? { "us-west2": 2, "europe-west4": 1 } : 1,
    env: {
      DATABASE_URL: db.env.DATABASE_URL,
      REDIS_URL: cache.env.REDIS_URL,
      JWT_SECRET: preserve(),
    },
  });

  const web = service("web", {
    source: github("acme/monorepo", { rootDirectory: "apps/web" }),
    build: "pnpm --filter web build",
    start: "pnpm --filter web start",
    domains: prod ? ["app.example.com"] : [],
    env: {
      API_HOST: api.env.RAILWAY_PRIVATE_DOMAIN,
    },
  });

  const worker = service("worker", {
    source: github("acme/monorepo", { rootDirectory: "apps/worker" }),
    build: "pnpm --filter worker build",
    start: "pnpm --filter worker start",
    volumeMounts: {
      "/data": workerData,
    },
    env: {
      DATABASE_URL: db.env.DATABASE_URL,
      REDIS_URL: cache.env.REDIS_URL,
    },
  });

  const backend = group("Backend", [db, cache, api, worker]);
  const storage = group("Storage", [uploads, workerData]);

  return project("acme", {
    resources: [backend, storage, web],
  });
});
```
