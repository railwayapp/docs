---
title: railway templates
description: Manage Railway templates from the CLI.
---

Manage Railway templates from the CLI. The `templates` command groups subcommands for discovering, creating, publishing, and managing templates. You can also call the command as `railway template`. Both forms behave identically.

## Usage

```bash
railway templates <COMMAND>
```

## Subcommands

| Subcommand | Aliases | Description |
|------------|---------|-------------|
| `search` | `find` | Search published templates in the marketplace. |
| `list` | `ls` | List templates owned by a workspace. |
| `create` | `generate` | Create an unpublished template from a project. |
| `publish` | `update` | Publish or update a template in the marketplace. |
| `unpublish` | | Unpublish a published template from the marketplace. |
| `delete` | `remove`, `rm` | Delete a template. |

## railway templates search

Search published Railway templates in the marketplace. The command works in two modes:

- In a terminal (TTY), it opens a command-palette-style picker that updates as you type.
- Outside a terminal, or when `--json` is set, it prints results to stdout for use in scripts and agents.

The picker is seeded with the optional `QUERY` argument. Pressing Enter selects the highlighted template. The command does not require authentication.

### Usage

```bash
railway templates search [OPTIONS] [QUERY]
```

### Arguments

| Argument | Description |
|----------|-------------|
| `QUERY` | Search term. Seeds the picker in TTY mode. |

### Options

| Flag | Description |
|------|-------------|
| `--json` | Print results as JSON. Disables the interactive picker. |
| `--limit <LIMIT>` | Number of results to request. Defaults to `20`. Maximum `50`. |
| `--after <CURSOR>` | Fetch the next page using `pageInfo.endCursor` from a previous response. |
| `--category <CATEGORY>` | Filter by template category. |
| `--verified <BOOL>` | Filter by verification state. Accepts `true` or `false`. |

### Examples

#### Open the interactive picker

```bash
railway templates search
```

#### Search with a seed query

```bash
railway templates search postgres
```

#### Filter to verified templates

```bash
railway templates search --verified true
```

#### Filter by category

```bash
railway templates search --category databases
```

#### Print results as JSON

```bash
railway templates search --json postgres
```

#### Paginate through results

```bash
railway templates search --limit 50 --after <CURSOR> postgres
```

Use the `endCursor` value from the previous JSON response as the next `--after` value.

## railway templates list

List templates owned by a workspace. This includes both draft and published templates.

### Usage

```bash
railway templates list [OPTIONS]
```

### Options

| Flag | Description |
|------|-------------|
| `-w, --workspace <WORKSPACE>` | Workspace ID or name. Defaults to listing across every workspace you belong to. |
| `--json` | Print results as JSON. |

### Examples

#### List all templates across your workspaces

```bash
railway templates list
```

#### List templates in a specific workspace

```bash
railway templates list --workspace my-workspace
```

#### List templates as JSON

```bash
railway templates list --json
```

#### List templates in a workspace as JSON

```bash
railway templates list --workspace my-workspace --json
```

## railway templates create

Create an unpublished template draft from an existing project. This matches the dashboard "Generate Template" action: it clones a project into a template draft that you can edit and publish later.

### Usage

```bash
railway templates create [OPTIONS]
```

### Options

| Flag | Description |
|------|-------------|
| `-p, --project <PROJECT>` | Project ID or name. Defaults to the linked project. |
| `-e, --environment <ENVIRONMENT>` | Environment ID or name. Defaults to the linked environment when available. |
| `--json` | Print the created template as JSON. |

### Examples

#### Create a template from the linked project

```bash
railway templates create
```

#### Create a template from a specific project

```bash
railway templates create --project my-project
```

#### Create a template from a specific project and environment

```bash
railway templates create --project my-project --environment production
```

#### Create a template and output as JSON

```bash
railway templates create --json
```

## railway templates publish

Publish or update a template in the marketplace. Use this command to make a template available to other users or to update metadata on an already-published template.

First-time publication requires a template overview via `--readme-file` or `--readme`. Use the `update` alias when replacing metadata on an already-published template.

### Usage

```bash
railway templates publish [OPTIONS] [TEMPLATE]
```

### Arguments

| Argument | Description |
|----------|-------------|
| `TEMPLATE` | Template ID or code. |

### Options

| Flag | Description |
|------|-------------|
| `--category <CATEGORY>` | Marketplace category. See [Valid Categories](#valid-categories) below. |
| `--description <DESCRIPTION>` | Short marketplace description. |
| `--readme <README>` | Template overview markdown. Prefer `--readme-file` for multi-line content. |
| `--readme-file <README_FILE>` | File containing the template overview markdown. Use `-` to read from stdin. |
| `--image <IMAGE>` | Image URL for the marketplace card. Use `none` or `clear` to clear it. |
| `--demo-project <DEMO_PROJECT>` | Public demo project ID. Use `none` or `clear` to clear it. |
| `-w, --workspace <WORKSPACE>` | Workspace ID or name. Defaults to the template workspace. |
| `--json` | Print the published template as JSON. |

### Valid Categories

- AI/ML
- Analytics
- Authentication
- Automation
- Blogs
- Bots
- CMS
- Observability
- Other
- Starters
- Storage
- Queues

### Examples

#### Publish a template with metadata

```bash
railway templates publish template-id --category Other --description "Deploy and Host My App with Railway" --readme-file README.md
```

#### Publish a template with a demo project

```bash
railway templates publish template-id --category AI/ML --description "Deploy and Host My Agent with Railway" --readme-file README.md --demo-project demo-project-id
```

#### Update an already-published template

```bash
railway templates update template-id --category Other --description "Updated description" --readme-file README.md
```

#### Publish a template with readme from stdin

```bash
cat README.md | railway templates publish template-id --category Other --description "My Template" --readme-file -
```

#### Publish and output as JSON

```bash
railway templates publish template-id --category Other --description "My Template" --readme-file README.md --json
```

## railway templates unpublish

Unpublish a published template from the marketplace. The template draft remains in your workspace and can be published again later.

### Usage

```bash
railway templates unpublish [OPTIONS] [TEMPLATE]
```

### Arguments

| Argument | Description |
|----------|-------------|
| `TEMPLATE` | Template ID or code. |

### Options

| Flag | Description |
|------|-------------|
| `-y, --yes` | Skip confirmation dialog. Required for non-interactive use. |
| `--2fa-code <TWO_FACTOR_CODE>` | 2FA code for verification when required by the current auth session. |
| `--json` | Print the unpublished template result as JSON. |

### Examples

#### Unpublish a template (interactive)

```bash
railway templates unpublish template-code
```

#### Unpublish a template (non-interactive)

```bash
railway templates unpublish template-id --yes
```

#### Unpublish and output as JSON

```bash
railway templates unpublish template-id --yes --json
```

## railway templates delete

Delete a template. This removes the template draft or marketplace template from the workspace.

### Usage

```bash
railway templates delete [OPTIONS] [TEMPLATE]
```

### Arguments

| Argument | Description |
|----------|-------------|
| `TEMPLATE` | Template ID or code. |

### Options

| Flag | Description |
|------|-------------|
| `-y, --yes` | Skip confirmation dialog. Required for non-interactive use. |
| `--2fa-code <TWO_FACTOR_CODE>` | 2FA code for verification when required by the current auth session. |
| `--json` | Print the deleted template result as JSON. |

### Examples

#### Delete a template (interactive)

```bash
railway templates delete template-code
```

#### Delete a template (non-interactive)

```bash
railway templates delete template-id --yes
```

#### Delete and output as JSON

```bash
railway templates delete template-id --yes --json
```

## Related

- [Templates](/templates)
- [railway init](/cli/init)
- [railway deploy](/cli/deploy)

