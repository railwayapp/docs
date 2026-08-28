---
title: Infrastructure as Code (IaC)
description: Define, import, preview, and apply your Railway project configuration with .railway/railway.ts, railway.py, or railway.go.
---

Railway Infrastructure as Code lets you define the services and resources in a Railway project in one file. TypeScript is generally available. Python and Go authoring are in beta.

```txt
.railway/railway.ts   # generally available
.railway/railway.py   # beta
.railway/railway.go   # beta
```

Use Railway IaC when you want one editable file for project-level configuration: services, databases, volumes, buckets, custom domains, environment variables, replicas, and canvas groups.

Keep **one** authoring file. Install the matching package:

<CodeBlock>
  <CodeTab label="TypeScript" lang="bash">
{`npm install railway`}
  </CodeTab>
  <CodeTab label="Python (beta)" lang="bash">
{`pip install railway-sdk`}
  </CodeTab>
  <CodeTab label="Go (beta)" lang="bash">
{`# put go.mod next to .railway/railway.go
go get github.com/railwayapp/railway-go-sdk@v0.2.0`}
  </CodeTab>
</CodeBlock>

## IaC vs Config as Code

[Config as Code](/config-as-code) (`railway.json` / `railway.toml`) is **deprecated**. Infrastructure as Code is the replacement.

| Feature | Scope | File | Status |
|---------|-------|------|--------|
| Config as Code | One service deployment | `railway.json` or `railway.toml` | Deprecated |
| Infrastructure as Code | A Railway project/environment | `.railway/railway.ts` | Generally available |
| Infrastructure as Code | Same graph, Python or Go authoring | `.railway/railway.py` or `.railway/railway.go` | Beta |

Config as Code is still read from your service repository during deploy for existing (legacy) services, and it overrides dashboard values for that service. New services cannot opt into Config as Code. Existing Config as Code files stop being read on **2026-12-01** (hard cutoff).

Infrastructure as Code is evaluated by the Railway CLI. The CLI compares the authoring file with the selected Railway environment, shows the changes it would make, and applies those changes only after confirmation.

A service cannot be managed by both systems at the same time. If a service is already managed by `railway.json` or `railway.toml`, `railway config plan` stops and tells you which service must be migrated before `.railway/railway.ts` can manage it.

## Install or upgrade the CLI

Infrastructure as Code is managed through the Railway CLI. See [Installing the CLI](/cli#installing-the-cli) for installation instructions.

Then authenticate and connect the current directory to the Railway project and environment you want to manage:

```bash
railway login
railway link
```

If the current directory is not linked, `railway config plan`, `railway config apply`, and `railway config pull` prompt you to choose the Railway project and environment to use.

For `plan` and `apply`, the CLI finds the nearest `.railway/railway.ts`,
`.railway/railway.py`, or `.railway/railway.go` by checking the current
directory and then walking up through parent directories. Keep only one of
those files. This lets you run either command from the project root, the
`.railway` directory, or a nested monorepo directory. Pass `--file` to use a
different configuration file.

## Commands

| Command | Description |
|---------|-------------|
| `railway config init` | Create Railway configuration files for the current directory (TypeScript by default). |
| `railway config pull` | Import the linked Railway project's current configuration into the authoring file. |
| `railway config plan` | Preview changes without applying them. |
| `railway config apply` | Preview and apply changes after confirmation. |

## Initialize a new configuration

Run:

```bash
railway config init
```

Railway creates `.railway/README.md` and, by default, `.railway/railway.ts`. To author Python or Go, write `.railway/railway.py` or `.railway/railway.go` (or migrate with `--lang py` / `--lang go`) and keep only that file.

The CLI can scan the current directory and generate a starting service from your package manager, `package.json` scripts, and GitHub remote.

Example generated file:

<CodeBlock>
  <CodeTab label="TypeScript" lang="ts">
{`import { defineRailway, project, service } from "railway/iac";

export default defineRailway(() => {
  const web = service("web", {
    build: "pnpm build",
    start: "pnpm start",
  });

  return project("my-app", {
    resources: [web],
  });
});`}
  </CodeTab>
  <CodeTab label="Python (beta)" lang="python">
{`from railway_sdk import define_railway, project, service

@define_railway
def main(ctx=None):
    web = service(
        "web",
        build="pnpm build",
        start="pnpm start",
    )
    return project("my-app", resources=[web])`}
  </CodeTab>
  <CodeTab label="Go (beta)" lang="go">
{`package main

import "github.com/railwayapp/railway-go-sdk"

func Railway() railway.Project {
  web := railway.ServiceNamed("web", railway.ServiceConfig{
    "build": "pnpm build",
    "start": "pnpm start",
  })
  return railway.ProjectNamed("my-app", []any{web})
}`}
  </CodeTab>
</CodeBlock>

## Import an existing project

Run:

```bash
railway config pull
```

This writes the linked Railway project's current configuration to the existing authoring file, or to `.railway/railway.ts` if none exists.

The importer generates code intended to be edited by humans. It keeps user-facing names, omits platform defaults, leaves out generated Railway domains, avoids internal IDs, and renders existing variable values as `preserve()` so they stay on Railway instead of being written into source.

To inline non-sealed variable values into the file, pass `--include-variables`. The CLI warns that non-sealed variables, including secrets, will be decrypted and included in the spec. Sealed variables stay as `preserve()`.

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

Plan: 1 to add, 0 to change, 0 to destroy
  + Create service web

Next
  • Run railway config apply to apply these changes.
```

`plan` is safe. It only reads Railway state and prints the changes that would be applied.

Variable values are **redacted** in plan output by default (shown as `«hidden»`), so secrets defined in `.railway/railway.ts` don't end up in your terminal or CI logs. The variable and whether it's changing are still shown. To print the actual values — useful when reviewing non-secret config — pass `--show-values`:

```bash
railway config plan --show-values
```

For machine-readable output:

```bash
railway config plan --json
```

To gate CI on drift, use `--detailed-exit-code`. The plan then exits `0` when nothing would change and `2` when changes are pending (errors stay non-zero):

```bash
railway config plan --detailed-exit-code
```

`--detailed-exit-code` is opt-in, so the default exit behavior is unchanged.

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

Destructive changes, such as deleting a service or variable, are marked before confirmation. Review those lines carefully before continuing. Non-interactively (with `--yes`, `--json`, or in an agent session), destructive changes additionally require `--confirm-destructive`, so a stray `--yes` cannot remove resources on its own:

```bash
railway config apply --yes --confirm-destructive
```

Apply is also protected against acting on a stale plan. A live `railway config apply` runs a fresh plan immediately before applying and commits against the exact environment state it just read. If the environment changed in between — for example a concurrent apply or a dashboard edit — the apply is rejected and you are asked to run `railway config plan` again.

CI should pin that review instead of planning again on merge:

```bash
railway config plan --out railway-plan.json
railway config apply --plan railway-plan.json --yes --confirm-destructive
```

`--plan` applies the saved change set as-is. It fails if the live `configEtag` drifted or the checked-out `.railway/` tree is not the planned tree. In GitHub Actions, [`railwayapp/config`](https://github.com/railwayapp/config) wraps both commands, comments the plan on the pull request, and documents the two-job workflow. See [`railway config`](/cli/config).

## Authoring

A Railway configuration file defines a project and its resources. TypeScript is the documented DSL (`import { defineRailway, project, service } from "railway/iac"`). Python and Go expose the same helpers and graph; those surfaces are in beta and may change.

Install the matching package before you plan or apply — `npm install railway` for TypeScript (or `pnpm` / `yarn` / `bun`), `pip install railway-sdk` for Python, or `go get github.com/railwayapp/railway-go-sdk@v0.2.0` for Go.

<CodeBlock>
  <CodeTab label="TypeScript" lang="ts">
{`import { defineRailway, project, service } from "railway/iac";

export default defineRailway(() => {
  const web = service("web");

  return project("my-project", {
    resources: [web],
  });
});`}
  </CodeTab>
  <CodeTab label="Python (beta)" lang="python">
{`from railway_sdk import define_railway, project, service

@define_railway
def main(ctx=None):
    web = service("web")
    return project("my-project", resources=[web])`}
  </CodeTab>
  <CodeTab label="Go (beta)" lang="go">
{`package main

import "github.com/railwayapp/railway-go-sdk"

func Railway() railway.Project {
  web := railway.ServiceNamed("web", nil)
  return railway.ProjectNamed("my-project", []any{web})
}`}
  </CodeTab>
</CodeBlock>

For the full TypeScript DSL, including services, sources, replicas, variables, databases, volumes, buckets, domains, groups, and environment context, see the [Infrastructure as Code reference](/infrastructure-as-code/reference).

## One file per project

Keep every service for a Railway environment in a single `.railway/railway.ts` (or `.py` / `.go`) file. That is the supported shape: one project definition, one apply, omit means delete. Do not keep more than one language file in `.railway/`.

A named partial is a last resort when separate repositories cannot share that file. Export a stable name from each file so omit=delete only applies to resources that file already owns:

```ts
export const partial = "api";

export default defineRailway(() => {
  const api = service("api");
  return project("acme", { resources: [api] });
});
```

Python uses `PARTIAL = "api"`. Go uses `const Partial = "api"`.

Do not add a partial export to a monorepo or a file that already describes the whole environment. Do not rename a partial after you apply it. `railway config migrate` writes a named partial only when it migrates a single service. A merged monorepo migrate does not.

## Migrating from Config as Code

If you currently use `railway.json` or `railway.toml`, migrate with the CLI. In a monorepo, `migrate` finds every CaC file in the repository and writes them into a single `.railway/railway.ts`.

```bash
# Preview the generated authoring file (TypeScript by default)
railway config migrate

# Write the file and clear Railway Config File settings
railway config migrate --apply

# Python or Go (beta)
railway config migrate --lang py --apply
railway config migrate --lang go --apply

# Optionally delete the old CaC files
railway config migrate --apply --delete-files
```

`--service <name>` migrates only that service. A single-service migrate still writes a named `partial` export because Config as Code was per-service. A merged migrate does not.

Then review and apply:

```bash
railway config plan
railway config apply
```

You can also migrate manually:

1. Import your current Railway project:

   ```bash
   railway config pull --force
   ```

2. Open the service's `railway.json` or `railway.toml` file and translate the settings you want Railway IaC to own into the `.railway/railway.ts` DSL.

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

3. Remove the old `railway.json` or `railway.toml` file from the service's source repository.

   If the service uses a custom config file path in Railway, open the service's **Settings**, find the config file path field, and clear it. After this step, future deployments for that service should not read `railway.json` or `railway.toml`.

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
```

The README explains how to plan and apply the configuration. Prefer one file for the project. A named partial is documented there only as a last resort for split repositories.

## Limitations

- Services managed by `railway.json` or `railway.toml` must be migrated before IaC can manage them.
- Volume lifecycle is intentionally conservative to avoid accidental unmounts.
- Bucket regions are immutable after creation.
- Python and Go authoring are in beta. Helper names and generated formatting may change.
- Generated TypeScript formatting may still change in small ways between CLI versions.

## Related pages

- [Infrastructure as Code reference](/infrastructure-as-code/reference)
- [railway config](/cli/config)
- [Config as Code](/config-as-code)
- [Config as Code reference](/config-as-code/reference)
- [CLI](/cli)
- [Environments](/environments)
- [Variables](/variables)
