---
title: railway login
description: Login to your Railway account.
---

Login to your Railway account to authenticate the CLI.

Sign-in and sign-up are the same flow: if you don't have a Railway account yet, `railway login` creates one on the fly — there is no separate signup command. New users accept the Terms of Service and Fair Use Policy as part of authorizing the CLI.

**Tip:** if your goal is to deploy, you can skip this step entirely — [`railway up`](/cli/up) signs you in (or up) as part of the deploy.

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

If no local browser can open — over SSH, in a container, or with no display — the CLI automatically falls back to the browserless device-code flow. `railway login` also works from non-interactive shells (such as an agent's terminal): it prints the sign-in URL and waits for you to finish in the browser.

### Browserless login

Use this in environments without a browser (e.g., SSH sessions):

```bash
railway login --browserless
```

This displays a pairing code and URL. Visit the URL and enter the code on any device to authenticate.

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

See [Tokens](/cli#tokens) for how to generate each token type.

## Related

- [railway up](/cli/up) — deploy and sign up/in in one step
- [railway logout](/cli/logout)
- [railway whoami](/cli/whoami)
- [Global Options](/cli/global-options)
