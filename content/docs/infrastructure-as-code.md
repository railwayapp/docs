---
title: Infrastructure as Code (IaC)
description: Define, import, preview, and apply your Railway project configuration with .railway/railway.ts.
---

Railway Infrastructure as Code lets you define the desired shape of a Railway project in a TypeScript file:

```txt
.railway/railway.ts
```

Use Railway IaC when you want to manage project-level infrastructure like services, databases, buckets, custom domains, environment variables, replicas, and canvas groups from one editable source file.

**Note:** Infrastructure as Code is experimental. The API and generated output may change while we refine the developer experience.

## IaC vs Config as Code

Railway has two code-based configuration systems:

| Feature | Scope | File |
|---------|-------|------|
| Config as Code | One service deployment | `railway.json` or `railway.toml` |
| Infrastructure as Code | A Railway project/environment | `.railway/railway.ts` |

[Config as Code](/config-as-code) is read from your service repository during deploy. It overrides dashboard values for that service.

Infrastructure as Code is evaluated by the Railway CLI, previewed as a plan, and applied to your Railway project through Railway's API.

A service cannot be managed by both systems at the same time. If a service is already managed by `railway.json` or `railway.toml`, `railway config plan` will ask you to migrate that service before `.railway/railway.ts` can manage it.

## Install or upgrade the CLI

Infrastructure as Code is managed through the Railway CLI.

```bash
npm i -g @railway/cli
```

Then authenticate and link a project as usual:

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
| `railway up` | Preview/apply configuration changes, then deploy the current directory. |

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

The CLI can scan the current directory and generate a starting service from your package manager, scripts, and GitHub remote.

Example generated file:

```ts
import { defineRailway, project, service } from "railway/iac";

export default defineRailway(() => {
  const web = service("web", {
    build: "pnpm build",
    start: "pnpm start",
  });

  return project("my-app", {
    environments: ["production"],
    services: [web],
  });
});
```

If no GitHub remote is detected, the generated service has no source. Running `railway up` uploads the current directory to that service.

## Import an existing project

Run:

```bash
railway config pull
```

This imports the linked Railway project into `.railway/railway.ts`.

The importer generates code intended to be edited by humans. It omits platform defaults, generated Railway domains, internal IDs, and unknown secrets where possible.

After importing, verify the file matches Railway:

```bash
railway config plan
```

A clean import should show:

```txt
Your Railway configuration is already up to date.
```

## Preview changes

Run:

```bash
railway config plan
```

Example output:

```txt
Railway configuration
Using .railway/railway.ts
Environment production

Changes (1)
  + Create service web

Next
  • Run railway config apply to apply these changes.
```

`plan` is safe. It does not change Railway.

For machine-readable output:

```bash
railway config plan --json
```

## Apply changes

Run:

```bash
railway config apply
```

Railway always previews changes before applying. In an interactive terminal, you will be asked to confirm.

To apply non-interactively:

```bash
railway config apply --yes
```

Destructive changes, such as deleting a service or variable, are marked in the plan before apply.

## Deploy with `railway up`

`railway up` integrates with Infrastructure as Code.

If `.railway/railway.ts` exists, `railway up` first runs a configuration plan. If changes are found, Railway shows the diff and asks whether to apply those configuration changes before deploying.

```bash
railway up
```

To apply configuration changes and deploy without prompts:

```bash
railway up --yes
```

To skip configuration and deploy normally:

```bash
railway up --no-sync
```

When a service has no GitHub or image source, `railway up` uploads the current directory.

## Authoring `.railway/railway.ts`

A Railway configuration file exports `defineRailway`.

```ts
import { defineRailway, project, service } from "railway/iac";

export default defineRailway(() => {
  const web = service("web");

  return project("my-project", {
    environments: ["production"],
    services: [web],
  });
});
```

### Environment context

`defineRailway` receives a context object. Use it to render different desired state for different Railway environments.

```ts
export default defineRailway((ctx) => {
  const prod = ctx.environment === "production";

  const web = service("web", {
    replicas: prod ? 3 : 1,
  });

  return project("my-project", {
    environments: ["production", "staging"],
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

Omit `source` for local uploads with `railway up`:

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

For advanced placement, specify regions:

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

`preserve()` is mainly used for imported secrets whose values are not available. It prevents Railway configuration from overwriting the existing value.

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

Bucket regions cannot be changed after creation. To move a bucket to another region, create a new bucket and migrate the data.

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
  environments: ["production"],
  services: [backend],
});
```

Groups are structural. They help large projects stay readable in both code and the Railway canvas.

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
    environments: ["production", "staging"],
    services: [backend, storage, web],
  });
});
```

## Migrating from Config as Code

If you currently use `railway.json` or `railway.toml`, migrate one service at a time.

1. Run `railway config pull --force`.
2. Move the relevant service config from `railway.json` / `railway.toml` into `.railway/railway.ts`.
3. Remove the old config file or stop pointing the service at it.
4. Run `railway config plan`.
5. Apply when the plan is correct.

Railway blocks plans for services still managed by `railway.json` or `railway.toml` to prevent two sources of truth.

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
