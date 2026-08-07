---
title: railway code
description: Launch a coding agent on a cloud agent VM with your own credentials.
---

Launch Claude Code, Codex, or Grok CLI on a [cloud agent](/cloud-agents) and hand your terminal to it.

<Banner variant="info">The `code` command requires cloud agents to be enabled for your account through <a href="/platform/priority-boarding" target="_blank">Priority Boarding</a>. It's under active development, and its commands and flags may change in breaking ways.</Banner>

## Usage

```bash
railway code [OPTIONS] [-- <AGENT_ARGS>...]
```

`railway code` is the launcher on its own. [`railway ca`](/cli/ca) opens a terminal interface over the same launcher, reads the same preferences, and takes the same options.

## Options

| Option | Description |
|--------|-------------|
| `--claude` | Launch Claude Code, minting a token with `claude setup-token` |
| `--codex` | Launch Codex using `~/.codex/auth.json` |
| `--grok` | Launch Grok CLI using `~/.grok/auth.json` |
| `--new` | Create a fresh agent instead of reusing this environment's |
| `--keep-awake` | Leave the agent running on disconnect instead of sleeping it |
| `--rm` | Destroy this environment's agent and exit |
| `--refresh-auth` | Re-mint the Claude credential on an agent that already has one |
| `--name <NAME>` | Name a newly created agent |
| `--variable <KEY=VALUE>` | Set a variable on a newly created agent (repeatable) |
| `--env-file <PATH>` | Load variables from a `.env` file (repeatable) |
| `-p`, `--project <PROJECT>` | Project ID |
| `-e`, `--environment <ENVIRONMENT>` | Environment name or ID |

With no agent option, `railway code` launches the coding agent saved by `railway ca setup`. Set `RAILWAY_CA_AGENT` to override the saved agent for one run.

## Where the agent runs

Railway resolves the target project and environment in this order:

1. The `--project` and `--environment` options.
2. The default project saved by `railway ca setup`.
3. The [linked project](/cli/link) in the working directory.
4. `railway ca setup`, which Railway opens for you. Setup saves the answer, so later launches skip this step.

Within that environment, Railway reuses the agent it remembers, adopts your existing agent when there's no local record, and creates one when you have none. See [Reuse and create agents](/cloud-agents#reuse-and-create-agents).

## Credentials

Railway reads your local credential, tells you which one it's using, and writes it to the agent over SSH. It doesn't store the credential: it never becomes a Railway variable, part of an image, or an argument on a command line.

Claude Code needs a token minted for the VM, because its local sign-in uses a rotating refresh token. Railway runs `claude setup-token` for you, caches the result, and reuses it on later launches. Set `CLAUDE_CODE_OAUTH_TOKEN` or `ANTHROPIC_API_KEY` to supply your own instead.

Codex and Grok CLI read their local `auth.json`, so a missing sign-in fails before Railway creates a machine.

Running `railway logout` deletes the cached Claude token from your machine.

## Agent arguments

Arguments after `--` pass through to the coding agent. Railway runs them and exits when the agent finishes, rather than leaving you in a session:

```bash
railway code --codex -- exec "explain this codebase"
```

To start an interactive session with a task already handed to the agent, use the prompt in [`railway ca`](/cli/ca).

## Examples

### Launch your configured agent

```bash
railway code
```

### Launch Codex with your local sign-in

```bash
railway code --codex
```

### Force a fresh agent

```bash
railway code --codex --new
```

### Create an agent with variables

```bash
railway code --codex --new --variable DATABASE_URL=postgres.DATABASE_URL
```

Values can reference variables from other services in the environment. Railway resolves them when the agent is created, so pair `--variable` with `--new`.

### Create an agent from a variables file

```bash
railway code --codex --new --env-file .env
```

### Keep the agent running after you disconnect

```bash
railway code --claude --keep-awake
```

A running agent bills for compute even when nothing is connected to it.

### Destroy the agent

```bash
railway code --rm
```

This deletes the agent for the target environment along with its disk.
