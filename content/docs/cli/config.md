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
| `--agent` | Print a suggestion to ask an agent to turn imported state into idiomatic TypeScript |

`--agent` doesn't invoke an agent or change the generated file. The flag has
no effect with `--json`, which prints only the imported graph.

Review an imported configuration with `railway config plan` before applying
it.

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

Plan output redacts variable values by default. Treat output from
`--show-values` or `--decrypt-variables` as sensitive.

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
