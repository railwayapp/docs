---
title: railway login
description: Login to your Railway account.
---

Login to your Railway account to authenticate the CLI.

## Usage

```bash
railway login [OPTIONS]
```

## Options

| Flag | Description |
|------|-------------|
| `-b, --browserless` | Login without opening a browser (uses pairing code) |

## Examples

### Browser login (default)

Opens your default browser to authenticate:

```bash
railway login
```

### Browserless login

Use this in environments without a browser (e.g., SSH sessions):

```bash
railway login --browserless
```

This displays a pairing code and URL. Visit the URL and enter the code to authenticate.

## Environment variables

The CLI supports two environment variables for non-interactive authentication (e.g., CI/CD pipelines):

| Variable | Scope | Use case |
|----------|-------|----------|
| `RAILWAY_TOKEN` | Project-scoped | Deploying, managing variables, and other operations within a single project. Generated per-project in the dashboard. |
| `RAILWAY_API_TOKEN` | Account/workspace-scoped | Account-level operations like creating environments, managing multiple projects, or any action that requires broader access. Generated in Account Settings > Tokens. |

When either variable is set, the CLI skips interactive login and authenticates automatically. Only one may be set at a time — setting both will result in an error.

```bash
# Project-scoped: deploy within a linked project
RAILWAY_TOKEN=xxx railway up

# Account-scoped: manage environments across projects
RAILWAY_API_TOKEN=xxx railway environment new staging
```

See [Tokens](/integrations/api#project-token) for how to generate each token type.

## Related

- [railway logout](/cli/logout)
- [railway whoami](/cli/whoami)
- [Global Options](/cli/global-options)
