---
title: railway config
description: Define, import, preview, and apply Railway Infrastructure as Code.
---

Manage a Railway project and environment from a TypeScript Infrastructure as
Code file at `.railway/railway.ts`.

## Usage

The `config` command creates, imports, previews, and applies Railway
Infrastructure as Code.

```bash
railway config <COMMAND> [OPTIONS]
```

| Command | Description |
|---------|-------------|
| `init` | Create `.railway/railway.ts` |
| `pull` | Import the selected Railway environment into `.railway/railway.ts` |
| `plan` | Preview changes without applying them |
| `apply` | Preview, confirm, and apply changes |
| `migrate` | Translate `railway.json` / `railway.toml` into `.railway/railway.ts` |

See [Infrastructure as Code](/infrastructure-as-code) for the complete workflow
and [the IaC reference](/infrastructure-as-code/reference) for the TypeScript
DSL. Prefer one configuration file per project. Named partials are a last
resort for split repositories, not the default.

## Find the configuration file

`railway config plan` and `railway config apply` use the nearest
`.railway/railway.ts`. The CLI checks the current directory and then walks up
through its parent directories. You can run either command from the project
root, from the `.railway` directory, or from a nested monorepo directory.

Override discovery with an explicit file:

```bash
railway config plan --file path/to/railway.ts
```

## Initialize configuration

Run `init` from the repository root where you want Railway to create the
`.railway` directory.

```bash
railway config init
```

| Flag | Description |
|------|-------------|
| `--force` | Overwrite an existing `.railway/railway.ts` |

The interactive flow can scan the repository, import a Railway project, or
create a minimal file.

## Import Railway state

Use `pull` to render the selected Railway project and environment as
TypeScript.

```bash
railway config pull
```

| Flag | Description |
|------|-------------|
| `--force` | Overwrite an existing `.railway/railway.ts` |
| `--json` | Print the imported graph as JSON instead of writing files |
| `--runner <PATH>` | Use a specific TypeScript configuration runner |
| `--omit-preserved-variables` | Omit unknown variables instead of rendering `preserve()` |
| `--include-variables` | Decrypt and inline non-sealed variable values into the file |
| `--agent` | Print a suggestion to ask an agent to turn imported state into idiomatic TypeScript |

`--include-variables` writes non-sealed values, including secrets that were never sealed, into `.railway/railway.ts`. The CLI prints a warning when you use it. Sealed variables stay as `preserve()`.

The TypeScript file imports `railway/iac`. Install the SDK from the repository root (`npm install railway`, or the equivalent `pnpm` / `yarn` / `bun` command) before `plan` or `apply`.

`--agent` doesn't invoke an agent or change the generated file. The flag has
no effect with `--json`, which prints only the imported graph.

Review an imported configuration with `railway config plan` before applying
it.

## Migrate Config as Code

`railway config migrate` finds every `railway.json` and `railway.toml` in the
repository — including files in monorepo packages — and emits one
`.railway/railway.ts`. Linked services whose Railway Config File points at
those paths keep their Railway service names.

```bash
railway config migrate
railway config migrate --apply
railway config migrate --apply --delete-files
```

| Flag | Description |
|------|-------------|
| `--apply` | Write the file and clear Railway Config File settings |
| `--force` | Overwrite an existing `.railway/railway.ts` |
| `--delete-files` | Delete the discovered CaC files after a successful apply |
| `--service <name>` | Migrate only this service |
| `--lang ts\|py\|go` | Authoring language (default `ts`) |

A single-service migrate still writes a named `partial` export. A merged
migrate does not.

## Preview changes

Use `plan` to compare `.railway/railway.ts` with the selected Railway
environment without changing resources.

```bash
railway config plan
```

| Flag | Description |
|------|-------------|
| `--file <PATH>` | Use a specific configuration file |
| `--json` | Output raw runner JSON |
| `--decrypt-variables` | Request decrypted variables when authorized |
| `--include-types` | Include generated graph TypeScript types in runner output |
| `--runner <PATH>` | Use a specific TypeScript configuration runner |
| `--verbose`, `--full` | Show full change details |
| `--detailed-exit-code` | Exit `2` when changes are pending and `0` when none are pending |
| `--show-values` | Print variable values instead of redacting them |
| `--out <PATH>` | Write a pinned plan artifact (change set, `configEtag`, `.railway/` tree) |
| `--source-tree <SHA>` | Override the tree written into `--out` (defaults to `git rev-parse HEAD:.railway`) |

Plan output redacts variable values by default. Treat output from
`--show-values` or `--decrypt-variables` as sensitive.

`--out` is the CI pin. Merge should apply that file, not re-plan:

```bash
railway config plan --out railway-plan.json
railway config apply --plan railway-plan.json --yes --confirm-destructive
```

Apply fails if the live environment etag no longer matches, or if the
checked-out `.railway/` tree is not the planned tree. In GitHub Actions, use
[`railwayapp/config`](https://github.com/railwayapp/config), which wraps both
commands, comments the plan on the pull request, and documents the two-job
workflow.

## Apply changes

Use `apply` to run a fresh plan and apply its changes. Without a
non-interactive flag, the CLI asks for confirmation.

```bash
railway config apply
```

`apply` accepts the plan options except `--detailed-exit-code`. It also
accepts these confirmation flags:

| Flag | Description |
|------|-------------|
| `--yes` | Skip the confirmation prompt and run non-interactively |
| `--confirm-destructive` | Permit destructive changes in non-interactive, JSON, or agent sessions |
| `--plan <PATH>` | Apply a pinned `--out` artifact without re-evaluating the authoring file |

<Banner variant="warning">
`railway config apply --json` applies non-destructive changes without
prompting. Use `railway config plan --json` when you only need a
machine-readable preview.
</Banner>

For a destructive non-interactive apply with human-readable output, pass both
confirmation flags:

```bash
railway config apply --yes --confirm-destructive
```

In JSON mode, pass `--confirm-destructive` to apply destructive changes. The
`--json` flag already skips the confirmation prompt, so `--yes` isn't required:

```bash
railway config apply --json --confirm-destructive
```

## Related

These pages cover Infrastructure as Code and Railway configuration files.

- [Infrastructure as Code](/infrastructure-as-code)
- [Infrastructure as Code reference](/infrastructure-as-code/reference)
- [Config as Code](/config-as-code)
