---
title: railway setup
description: Set up Railway tooling for editors and AI agents.
---

Set up your editor for Railway agent functionality, including agent skills, MCP configuration, and authentication guidance.

## Usage

Use the `agent` subcommand to configure Railway tooling for coding agents.

```bash
railway setup agent [OPTIONS]
```

## Subcommands

The setup command provides one agent-focused workflow.

| Subcommand | Description |
|------------|-------------|
| `agent` | Install Railway agent skills, configure MCP, and check Railway authentication |

## Options for `agent`

Use these flags to skip prompts or select a hosted MCP transport.

| Flag | Description |
|------|-------------|
| `-y, --yes` | Skip prompts and accept defaults. Also used automatically when stdout is not a terminal |
| `--remote` | Configure `mcp.railway.com` through the CLI proxy using your `railway login` session |
| `--oauth` | With `--remote`, configure the direct HTTP endpoint so the editor handles OAuth |

## Examples

Choose an interactive or non-interactive setup based on your environment.

### Interactive setup

Run the command without flags to choose tools and an MCP transport.

```bash
railway setup agent
```

This prompts for which supported coding tools to configure and lets you choose
local MCP, hosted MCP through the CLI proxy, hosted MCP through editor OAuth,
or no MCP configuration. It starts the Railway login flow when needed.

### Non-interactive setup

Pass `--yes` to accept the detected defaults.

```bash
railway setup agent -y
```

This configures detected coding tools with default settings and skips the interactive login flow. If you are not already authenticated, run `railway login` after setup.

### Use the hosted server through the CLI proxy

Pass `--remote` to use Railway's hosted server with your CLI login.

```bash
railway setup agent --remote
```

This configures supported editors to run `railway mcp proxy`. The proxy
connects to Railway's hosted MCP server using your CLI login.

### Use the hosted server with editor OAuth

Add `--oauth` when the editor must manage the hosted server's authentication.

```bash
railway setup agent --remote --oauth
```

This writes `https://mcp.railway.com` directly into supported editor
configurations. The editor manages the OAuth flow.

## What it configures

`railway setup agent` installs the `use-railway` skill for supported coding tools, configures the Railway MCP server where supported, and checks your Railway authentication.

Skills are installed for Claude Code, Cursor, OpenAI Codex, OpenCode, and the universal `.agents` skills directory. MCP is additionally configured for Factory Droid and GitHub Copilot. See [`railway skills`](/cli/skills) and [`railway mcp`](/cli/mcp) for the per-command target lists.

The setup is idempotent. Re-running it updates Railway-owned skill directories and merges Railway MCP entries into existing tool configs without removing other MCP servers.

## Related

These pages describe the commands and resources installed by setup.

- [railway mcp](/cli/mcp)
- [railway agent](/cli/agent)
- [Agent Skills](/ai/agent-skills)
- [Railway MCP Server](/ai/mcp-server)
