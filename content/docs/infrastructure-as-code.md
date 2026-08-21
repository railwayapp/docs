---
title: Infrastructure as Code (IaC)
description: Define, import, preview, and apply your Railway project configuration with .railway/railway.ts.
---

Railway Infrastructure as Code lets you define the services and resources in a Railway project with a TypeScript file:

```txt
.railway/railway.ts
```

Use Railway IaC when you want one editable file for project-level configuration: services, databases, volumes, buckets, custom domains, environment variables, replicas, and canvas groups.

> **TypeScript, Python, and Go.** Railway IaC is authored via `.railway/railway.ts`, `.railway/railway.py`, or `.railway/railway.go`. TypeScript is the most mature surface; Python and Go mirrors share the same graph contract. Other languages may follow on demand.

<PriorityBoardingBanner />

## IaC vs Config as Code

[Config as Code](/config-as-code) (`railway.json` / `railway.toml`) is **deprecated**. Infrastructure as Code (`.railway/railway.ts`) is the replacement.

| Feature | Scope | File | Status |
|---------|-------|------|--------|
| Config as Code | One service deployment | `railway.json` or `railway.toml` | Deprecated |
| Infrastructure as Code | A Railway project/environment | `.railway/railway.ts` | Current |

Config as Code is still read from your service repository during deploy for services that already use it, and it overrides dashboard values for that service. Starting **2026-08-28**, services that have never used Config as Code cannot opt in. Existing Config as Code files stop being read on **2026-12-01** (hard cutoff).

Infrastructure as Code is evaluated by the Railway CLI. The CLI compares `.railway/railway.ts` with the selected Railway environment, shows the changes it would make, and applies those changes only after confirmation.

A service cannot be managed by both systems at the same time. If a service is already managed by `railway.json` or `railway.toml`, `railway config plan` stops and tells you which service must be migrated before `.railway/railway.ts` can manage it.

## Install or upgrade the CLI

Infrastructure as Code is managed through the Railway CLI. See [Installing the CLI](/cli#installing-the-cli) for installation instructions.

Then authenticate and connect the current directory to the Railway project and environment you want to manage:

```bash
railway login
railway link
```

If the current directory is not linked, `railway config plan`, `railway config apply`, and `railway config pull` prompt you to choose the Railway project and environment to use.

For `plan` and `apply`, the CLI finds the nearest `.railway/railway.ts` by
checking the current directory and then walking up through parent directories.
This lets you run either command from the project root, the `.railway`
directory, or a nested monorepo directory. Pass `--file` to use a different
configuration file.

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
    resources: [web],
  });
});
```

## Import an existing project

Run:

```bash
railway config pull
```

This writes the linked Railway project's current configuration to `.railway/railway.ts`.

The importer generates code intended to be edited by humans. It keeps user-facing names, omits platform defaults, leaves out generated Railway domains, avoids internal IDs, and omits encrypted secrets unless it must include `preserve()` to avoid overwriting an existing value.

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

Apply is also protected against acting on a stale plan. Railway runs a fresh plan immediately before applying and commits against the exact environment state it just read. If the environment changed in between — for example a concurrent apply or a dashboard edit — the apply is rejected and you are asked to run `railway config plan` again. This prevents an apply from silently overwriting changes it never saw.

## Authoring `.railway/railway.ts`

A Railway configuration file exports `defineRailway` and returns a `project`.

```ts
import { defineRailway, project, service } from "railway/iac";

export default defineRailway(() => {
  const web = service("web");

  return project("my-project", {
    resources: [web],
  });
});
```

For the full TypeScript DSL, including services, sources, replicas, variables, databases, volumes, buckets, domains, groups, and environment context, see the [Infrastructure as Code reference](/infrastructure-as-code/reference).

## Migrating from Config as Code

If you currently use `railway.json` or `railway.toml`, migrate with the CLI:

```bash
# Preview the generated .railway/railway.ts
railway config migrate

# Write the file and clear the service's Railway Config File setting
railway config migrate --apply

# Optionally delete the old CaC file
railway config migrate --apply --delete-files
```

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
.agents/skills/railway-config/SKILL.md
```

These files help teammates and agents understand how to edit the Railway configuration safely.

## Limitations

Infrastructure as Code is experimental. Current limitations include:

- Services managed by `railway.json` or `railway.toml` must be migrated before IaC can manage them.
- Volume lifecycle is intentionally conservative to avoid accidental unmounts.
- Bucket regions are immutable after creation.
- Persisted ChangeSet history and apply-later workflows are not part of v0.
- Generated `.railway/railway.ts` formatting may change while the DSL is experimental.

## Related pages

- [Infrastructure as Code reference](/infrastructure-as-code/reference)
- [railway config](/cli/config)
- [Config as Code](/config-as-code)
- [Config as Code reference](/config-as-code/reference)
- [CLI](/cli)
- [Environments](/environments)
- [Variables](/variables)
