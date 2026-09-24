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

`--plan` applies the saved change set as-is. It fails if the live `configEtag` drifted or the checked-out `.railway/` tree is not the planned tree. See [`railway config`](/cli/config) for the flags.

## Apply from GitHub Actions

[`railwayapp/config`](https://github.com/railwayapp/config) plans Infrastructure as Code on pull requests and applies the reviewed plan when the pull request merges.

The plan job pins the change set, the environment's `configEtag`, and the `.railway/` git tree. The apply job applies that artifact. It does not re-evaluate the authoring file. If the environment changed after the plan, or the merged `.railway/` tree is not the planned tree, apply fails and you re-plan.

Create a [project token](/integrations/api#project-token) for the target environment and store it as the `RAILWAY_TOKEN` repository secret. A project token is scoped to one environment, so the workflow applies to that environment only.

Add `.github/workflows/railway-config.yml`:

```yaml
name: Railway config

on:
  pull_request:
    types: [opened, synchronize, reopened, closed]
    paths:
      - ".railway/**"

permissions:
  contents: read
  pull-requests: write
  actions: read
  id-token: write

jobs:
  plan:
    if: github.event.action != 'closed' && github.event.pull_request.head.repo.full_name == github.repository
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: railwayapp/config@v1
        with:
          command: plan
          railway-token: ${{ secrets.RAILWAY_TOKEN }}

  apply:
    if: github.event.action == 'closed' && github.event.pull_request.merged && github.event.pull_request.head.repo.full_name == github.repository
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          ref: ${{ github.event.pull_request.merge_commit_sha }}
      - uses: railwayapp/config@v1
        with:
          command: apply
          railway-token: ${{ secrets.RAILWAY_TOKEN }}
```

Every pull request that touches `.railway/` gets a plan comment with the diff. Destructive changes are marked in that comment. Merging is the approval.

Install the TypeScript SDK (`npm install railway`) in the repository so the plan job can evaluate `.railway/railway.ts`. Fork pull requests are skipped. They don't receive repository secrets.

`id-token: write` plus the [Railway GitHub App](https://github.com/apps/railway-app) posts the plan comment as the Railway bot (the same identity as preview-environment comments). Without those, the comment is posted as github-actions.

To run apply as a separately named job on your default branch, split plan and apply into two workflows. See the [action README](https://github.com/railwayapp/config).

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

When one repository (or monorepo) holds the code for every service in an environment, keep every service in a single `.railway/railway.ts` (or `.py` / `.go`) file. One project definition, one apply, and omitting a resource means deleting it. Do not keep more than one language file in `.railway/`.

When the services in an environment live in separate repositories, use one file per repository with a named partial. See [Multi-repo projects](#multi-repo-projects).

## Multi-repo projects

A named partial lets each repository manage its own slice of a Railway environment. Every file exports a stable partial name, and the CLI records which partial owns each resource. Omitting a resource then only deletes it if your partial owns it.

Choose the shape that matches where the code lives:

| Repositories | File layout | Partial export |
|--------------|-------------|----------------|
| One repository or monorepo for the whole environment | One `.railway/railway.ts` describing every resource | None |
| One repository per service (or group of services) | One `.railway/railway.ts` per repository, each describing only that repository's resources | Required in every file |

Don't mix the two. Once any partial in an environment has a name, every file that targets that environment must export one.

As with a single file, `railway config plan` and `railway config apply` run wherever you run them: locally or in your CI. Railway doesn't read `.railway/` during deploys. To apply from each repository's pipeline, use the [GitHub Actions recipe](#apply-from-github-actions) in every repository, each with a project token for the target environment.

### Example: two repositories

An `api` repository owns the API service and its database:

```ts
// api/.railway/railway.ts
import { defineRailway, postgres, project, service } from "railway/iac";

export const partial = "api";

export default defineRailway(() => {
  const db = postgres("postgres");
  const api = service("api", {
    env: {
      DATABASE_URL: db.env.DATABASE_URL,
    },
  });

  return project("acme", { resources: [api, db] });
});
```

A `web` repository owns the frontend service:

```ts
// web/.railway/railway.ts
import { defineRailway, project, service } from "railway/iac";

export const partial = "web";

export default defineRailway(() => {
  const web = service("web");

  return project("acme", { resources: [web] });
});
```

After both repositories apply, partial `api` owns `service.api` and `database.postgres`, and partial `web` owns `service.web`. Removing `db` from the `api` file deletes the database on the next `api` apply. Nothing the `web` file does can touch it.

Python uses `PARTIAL = "api"`. Go uses `const Partial = "api"`. A partial name is 1 to 64 characters from `a-z`, `A-Z`, `0-9`, `.`, `_`, and `-`.

### Ownership rules

The CLI enforces ownership on every plan and apply:

- A resource declared in a file whose partial doesn't own it fails with `Cannot manage service "api": already managed by partial "web".` Move the declaration to the owning repository, or [transfer its ownership](#transfer-partial-ownership) before applying it from another partial.
- A file without a partial export fails in an environment that already has named partials: `This environment already has named IaC partials. Export const partial = "<name>" from this file instead of managing the whole project.`
- A named partial only deletes resources it owns. Resources owned by other partials, or not yet owned by any partial, are left alone when they're missing from your file.
- The first `railway config apply` from a partial claims ownership of every resource the file declares. The apply runs even when the plan shows no configuration changes, so that the claim is recorded.

Renaming a partial export doesn't transfer ownership. Resources stay owned by the old name. Transfer ownership to the new name, update the export, and re-plan before applying it.

### Inspect partial ownership

Ownership is stored on the Railway environment. You can inspect or change it
even when the original authoring file no longer exists:

```bash
railway config partials list
```

The command lists partial names and every address they own. Add `--json` for
the complete address-to-owner map and the environment's configuration etag.
Commands use the linked project and environment, including an environment-scoped
project token when `RAILWAY_TOKEN` is set.

### Transfer partial ownership

Transfer resources when moving them to another repository or replacing an
orphaned partial. Release and transfer require environment `ADMIN` access and
change only ownership metadata. They don't change, delete, or redeploy
resources, and they don't edit authoring files.

Preview moving two services from `legacy-ops` to `operations`:

```bash
railway config partials transfer legacy-ops operations \
  --resource service.api --resource service.admin --dry-run
```

Run the same command without `--dry-run` to review the addresses and confirm.
Every selected address must belong to `legacy-ops`. The destination can be a
new or existing partial. To move every resource from the source, omit all
`--resource` options.

After the transfer, update the source configuration to stop declaring the moved
resources and add them to the destination configuration. Re-plan before applying
either file. To rename an entire partial, transfer all its ownership to the
new name, then update the partial export and re-plan.

### Return to one file per project

Release named ownership before removing partial exports and managing the whole
environment from one file. First, list ownership and preview the release of a
partial:

```bash
railway config partials list
railway config partials release operations --dry-run
```

Run `railway config partials release operations` to review and confirm. Omit
`--resource` to release the entire partial, or repeat `--resource ADDRESS` to
release selected addresses. Releasing ownership leaves the resources running.

Whole-project planning requires all named ownership to be cleared. Releasing one
partial isn't enough if another still owns resources. Repeat for the other named
partials, then verify with `railway config partials list`.

Once no named ownership remains, combine the resources you want to keep into
one authoring file, remove the named partial export (`partial`, `PARTIAL`, or
`Partial`), and run a fresh `railway config plan`. Review the plan before applying,
since a whole-project apply can delete resources omitted from that file.

Applying an old named-partial configuration can reclaim released ownership.
Update each authoring configuration and its CI workflow before applying again.
To restore named ownership later, declare the resources in a named partial and
use the ordinary plan/apply workflow.

Ownership operations reject a preview if configuration or ownership changes
before execution. Ownership changes also make saved configuration plans stale.
See the [ownership command reference](/cli/config#manage-partial-ownership) for
confirmation flags, JSON output, and pinning a preview in CI.

### Migrating per-repo Config as Code

If each repository has its own `railway.json` or `railway.toml`, run `railway config migrate` in each repository. When it finds a single service, it writes a `.railway/railway.ts` with `export const partial = "<service name>"`. Review with `railway config plan` and apply from that repository. Each repository ends up as one partial, which matches how Config as Code was applied per service. See [Migrating from Config as Code](#migrating-from-config-as-code) for the commands.

## Migrating from Config as Code

If you currently use `railway.json` or `railway.toml`, migrate with the CLI. In a monorepo, `migrate` finds every CaC file in the repository and writes them into a single `.railway/railway.ts`. In a multi-repo project, run it in each repository. See [Multi-repo projects](#multi-repo-projects).

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

`--service <name>` migrates only that service. A single-service migrate writes a named `partial` export because Config as Code was per-service. A merged migrate does not.

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

The README explains how to plan and apply the configuration, and when to add a named partial for a [multi-repo project](#multi-repo-projects).

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
- [railwayapp/config](https://github.com/railwayapp/config)
