---
title: Infrastructure as Code (IaC)
description: Define, import, preview, and apply your Railway project configuration with .railway/railway.ts.
---

Railway Infrastructure as Code lets you define the services and resources in a Railway project with a TypeScript file:

```txt
.railway/railway.ts
```

Use Railway IaC when you want one editable file for project-level configuration: services, databases, buckets, custom domains, environment variables, replicas, and canvas groups.

<PriorityBoardingBanner />

## IaC vs Config as Code

Railway has two code-based configuration systems:

| Feature | Scope | File |
|---------|-------|------|
| Config as Code | One service deployment | `railway.json` or `railway.toml` |
| Infrastructure as Code | A Railway project/environment | `.railway/railway.ts` |

[Config as Code](/config-as-code) is read from your service repository during deploy. It overrides dashboard values for that service.

Infrastructure as Code is evaluated by the Railway CLI. The CLI compares `.railway/railway.ts` with the selected Railway environment, shows the changes it would make, and applies those changes only after confirmation.

A service cannot be managed by both systems at the same time. If a service is already managed by `railway.json` or `railway.toml`, `railway config plan` stops and tells you which service must be migrated before `.railway/railway.ts` can manage it.

## Install or upgrade the CLI

Infrastructure as Code is managed through the Railway CLI. See [Installing the CLI](/cli#installing-the-cli) for installation instructions.

Then authenticate and connect the current directory to the Railway project and environment you want to manage:

```bash
railway login
railway link
```

The `railway config` commands will prompt you to log in or connect a project when needed.

## Commands

| Command | Description |
|---------|-------------|
| `railway config init` | Create Railway configuration files for the current directory. |
| `railway config pull` | Import the linked Railway project's current configuration into `.railway/railway.ts`. |
| `railway config plan` | Preview changes without applying them. |
| `railway config apply` | Preview and apply changes after confirmation. |

## Initialize a new configuration

Run:

```bash
railway config init
```

Railway creates:

```txt
.railway/railway.ts
.railway/README.md
.agents/skills/railway-config/SKILL.md
```

The CLI can scan the current directory and generate a starting service from your package manager, `package.json` scripts, and GitHub remote.

Example generated file:

```ts
import { defineRailway, project, service } from "railway/iac";

export default defineRailway(() => {
  const web = service("web", {
    build: "pnpm build",
    start: "pnpm start",
  });

  return project("my-app", {
    services: [web],
  });
});
```

## Import an existing project

Run:

```bash
railway config pull
```

This writes the linked Railway project's current configuration to `.railway/railway.ts`.

The importer generates code intended to be edited by humans. It keeps user-facing names, omits platform defaults, leaves out generated Railway domains, avoids internal IDs, and usually omits encrypted secrets because the CLI cannot read their values.

After importing, run a plan to check whether the generated file would change anything in Railway:

```bash
railway config plan
```

A clean import should show no changes:

```txt
Your Railway configuration is already up to date.
```

## Preview changes

Run:

```bash
railway config plan
```

Example output when the file creates one service:

```txt
Railway configuration
Using .railway/railway.ts
Environment production

Changes (1)
  + Create service web

Next
  • Run railway config apply to apply these changes.
```

`plan` is safe. It only reads Railway state and prints the changes that would be applied.

For machine-readable output:

```bash
railway config plan --json
```

## Apply changes

Run:

```bash
railway config apply
```

Railway always runs a plan before applying. In an interactive terminal, you will be asked to confirm the exact changes shown in the plan.

To apply non-interactively:

```bash
railway config apply --yes
```

Destructive changes, such as deleting a service or variable, are marked before confirmation. Review those lines carefully before continuing.

## Authoring `.railway/railway.ts`

A Railway configuration file exports `defineRailway`.

```ts
import { defineRailway, project, service } from "railway/iac";

export default defineRailway(() => {
  const web = service("web");

  return project("my-project", {
    services: [web],
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
    services: [web],
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

Database provisioning is handled by Railway product workflows. The configuration file describes the database intent; it does not author volume internals directly.

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
  services: [backend],
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
} from "railway/iac";

export default defineRailway((ctx) => {
  const prod = ctx.environment === "production";

  const db = postgres("postgres");
  const cache = redis("redis");
  const uploads = bucket("uploads", { region: "iad" });

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
    env: {
      DATABASE_URL: db.env.DATABASE_URL,
      REDIS_URL: cache.env.REDIS_URL,
    },
  });

  const backend = group("Backend", [db, cache, api, worker]);
  const storage = group("Storage", [uploads]);

  return project("acme", {
    services: [backend, storage, web],
  });
});
```

## Migrating from Config as Code

If you currently use `railway.json` or `railway.toml`, migrate one service at a time. Do not leave the same service managed by both files.

1. Import your current Railway project:

   ```bash
   railway config pull --force
   ```

2. Open the service's `railway.json` or `railway.toml` file and copy the settings you want Railway IaC to own into `.railway/railway.ts`.

   For example, this `railway.json`:

   ```json
   {
     "build": {
       "buildCommand": "pnpm build"
     },
     "deploy": {
       "startCommand": "pnpm start",
       "healthcheckPath": "/health"
     }
   }
   ```

   becomes:

   ```ts
   const web = service("web", {
     build: "pnpm build",
     start: "pnpm start",
     healthcheck: "/health",
   });
   ```

3. Remove the old config file from the service's source repository.

   If the service uses a custom config file path in Railway, clear that path in the service's settings as well. The goal is that future deployments for that service no longer read `railway.json` or `railway.toml`.

4. Preview the migration:

   ```bash
   railway config plan
   ```

5. Review the plan. It is safe to apply when the listed changes are only the settings you intentionally moved into `.railway/railway.ts`.

   For example, a good migration plan might show updates to `build`, `start`, or `healthcheck` for the service you migrated. It should not show unexpected service deletes, variable deletes, bucket deletes, or changes to unrelated services.

6. Apply the migration:

   ```bash
   railway config apply
   ```

Railway blocks plans for services still managed by `railway.json` or `railway.toml` to prevent two sources of truth. If you see that error, remove the repo config file for that service and run `railway config plan` again.

## Generated support files

`railway config init` and `railway config pull` also create project-local support files:

```txt
.railway/README.md
.agents/skills/railway-config/SKILL.md
```

These files help teammates and agents understand how to edit the Railway configuration safely.

## Limitations

Infrastructure as Code is experimental. Current limitations include:

- Services managed by `railway.json` or `railway.toml` must be migrated before IaC can manage them.
- Volume lifecycle is intentionally conservative to avoid accidental unmounts.
- Bucket regions are immutable after creation.
- Persisted ChangeSet history and apply-later workflows are not part of v0.
- Some generated output may change as the DSL is refined.

## Related pages

- [Config as Code](/config-as-code)
- [Config as Code reference](/config-as-code/reference)
- [CLI](/cli)
- [Environments](/environments)
- [Variables](/variables)
