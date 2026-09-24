---
title: railway config
description: Define, import, preview, and apply Railway Infrastructure as Code, and manage named partial ownership.
---

Manage a Railway project and environment from an Infrastructure as Code file at
`.railway/railway.ts` (generally available), `.railway/railway.py`, or
`.railway/railway.go` (Python and Go authoring are in beta).

## Usage

The `config` command creates, imports, previews, and applies Railway
Infrastructure as Code.

```bash
railway config <COMMAND> [OPTIONS]
```

| Command | Description |
|---------|-------------|
| `init` | Create `.railway/railway.ts` by default |
| `pull` | Import the selected Railway environment into the authoring file |
| `plan` | Preview changes without applying them |
| `apply` | Preview, confirm, and apply changes |
| `migrate` | Convert Config as Code into IaC (`--lang ts` \| `py` \| `go`) |
| `partials` | List, release, or transfer named partial ownership |

See [Infrastructure as Code](/infrastructure-as-code) for the complete workflow
and [the IaC reference](/infrastructure-as-code/reference) for the TypeScript
DSL. Prefer one configuration file per project. Named partials are a last
resort for split repositories, not the default.

## Find the configuration file

`railway config plan` and `railway config apply` use the nearest
`.railway/railway.ts`, `.railway/railway.py`, or `.railway/railway.go`. The CLI
checks the current directory and then walks up through its parent directories.
Keep only one of those files.

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
| `--force` | Overwrite an existing authoring file |

The interactive flow can scan the repository, import a Railway project, or
create a minimal file.

## Import Railway state

Use `pull` to render the selected Railway project and environment as
authoring code (TypeScript unless `.railway/railway.py` or `.railway/railway.go`
already exists).

```bash
railway config pull
```

| Flag | Description |
|------|-------------|
| `--force` | Overwrite an existing authoring file |
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

Use `plan` to compare the authoring file with the selected Railway
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
[`railwayapp/config`](https://github.com/railwayapp/config) so pull requests
get a plan comment and merge applies that pinned artifact. See
[Apply from GitHub Actions](/infrastructure-as-code#apply-from-github-actions).

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

## Manage partial ownership

Use `railway config partials` to inspect ownership, release resources from a
named partial, or transfer them to another partial. These commands use the
linked project and environment. They work without an authoring file, including
when the file that originally claimed ownership no longer exists.

Release and transfer require environment `ADMIN` access. Authentication uses
your CLI login, `RAILWAY_API_TOKEN`, or an environment-scoped `RAILWAY_TOKEN`.
Both operations change ownership metadata only. They don't delete resources,
change resource configuration, redeploy anything, or edit local files.

### List ownership

List every partial and its owned resource addresses:

```bash
railway config partials list
railway config partials list --json
```

JSON output includes `environmentId`, `environmentName`, `configEtag`, the
complete address-to-owner map in `iacPartials`, and `wholeProjectAvailable`.
The last field is `true` when no named ownership remains. The owner `*`, if
present in the map, represents whole-project ownership and isn't a named
partial you can release or transfer.

### Release ownership

Release all ownership held by a named partial:

```bash
railway config partials release operations --dry-run
railway config partials release operations
```

To release selected resources, repeat `--resource` with exact addresses from
`partials list`:

```bash
railway config partials release operations \
  --resource service.api --resource service.admin --dry-run
```

Omitting `--resource` selects the entire partial. Every selected address must
belong to the source partial. An unknown partial, an empty selection, or an
address owned by another partial fails without changing ownership.

### Transfer ownership

Move selected resources from one named partial to another:

```bash
railway config partials transfer legacy-ops operations \
  --resource service.api --resource service.admin --dry-run
```

Remove `--dry-run` to review the addresses and confirm the transfer. Omit
`--resource` to transfer the entire source partial. The destination can be a
new or existing partial, but it must differ from the source. Both names use
the [named partial format](/infrastructure-as-code#multi-repo-projects).

### Confirm ownership changes

Release and transfer accept these options:

| Flag | Description |
|------|-------------|
| `--resource <ADDRESS>` | Select one owned address. Repeat to select several, or omit for the entire source partial |
| `--dry-run` | Preview exact affected addresses without changing ownership |
| `--yes` | Confirm the change and proceed without prompting |
| `--json` | Output JSON and execute without prompting, unless `--dry-run` is also set |
| `--base-config-etag <ETAG>` | Require the `configEtag` from `list` or the `baseConfigEtag` from a previous dry run |

Interactive execution previews every affected address and asks for confirmation,
defaulting to no. Non-interactive execution requires `--yes` or `--json`.
You can't combine `--dry-run` with `--yes`.

<Banner variant="warning">
`release --json` and `transfer --json` change ownership without prompting.
Add `--dry-run` when you only need a machine-readable preview.
</Banner>

JSON output includes `affectedResources`, the complete resulting `iacPartials`
map, `wholeProjectAvailable`, and `dryRun`. For a dry run, the map and
availability describe the predicted result. Execution returns the result
reported by Railway.

### Pin an ownership preview in CI

Each operation sends the exact reviewed addresses and the preview's
`Environment.configEtag`. If configuration or ownership changes between review
and execution, the operation fails. Run a fresh dry run and review the result
before retrying.

For separate review and execution steps, capture the JSON preview and pass its
`baseConfigEtag` when executing the same command. This example uses `jq` to
read the token:

```bash
railway config partials release operations --dry-run --json \
  > ownership-preview.json

# After reviewing ownership-preview.json:
railway config partials release operations \
  --base-config-etag "$(jq -r .baseConfigEtag ownership-preview.json)" --json
```

Ownership operations reuse the configuration plan's etag, but don't create a
resource change set. They don't use `config plan --out` or `config apply --plan`
artifacts and don't require a `.railway/` source tree. Changing ownership makes
previously saved configuration plans stale. Create a fresh configuration plan
before your next apply.

### Update the authoring configuration

After a transfer, update the source and destination configurations to match the
new ownership, then re-plan. Applying an old named-partial configuration can
reclaim released resources. To restore ownership later, declare the resources
in a named partial and use the ordinary `railway config plan` and
`railway config apply` workflow.

Whole-project planning becomes available only after all named ownership is
cleared. Remove the named partial export and create a fresh whole-project plan.
Include every resource you want to keep, since an ordinary whole-project apply
can delete resources omitted from the file. See
[Return to one file per project](/infrastructure-as-code#return-to-one-file-per-project).

## Related

These pages cover Infrastructure as Code and Railway configuration files.

- [Infrastructure as Code](/infrastructure-as-code)
- [Infrastructure as Code reference](/infrastructure-as-code/reference)
- [Config as Code](/config-as-code)
