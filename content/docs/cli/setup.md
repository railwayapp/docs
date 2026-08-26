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

The setup command includes the `agent` subcommand.

| Subcommand | Description |
|------------|-------------|
| `agent` | Install Railway agent skills, configure MCP, and check Railway authentication |

## Options for `agent`

Use these flags to skip prompts or select how the MCP connection authenticates.

| Flag | Description |
|------|-------------|
| `-y, --yes` | Skip prompts and accept defaults. Also used automatically when stdout is not a terminal |
| `--oauth` | Configure the direct `https://mcp.railway.com` endpoint so the MCP client handles OAuth. Takes precedence over `--remote` |
| `--local` | Configure the in-process local server (`railway mcp local`) instead of connecting to `mcp.railway.com` |
| `--remote` | Connect to `mcp.railway.com` through the CLI using your `railway login` session. This is already the default, and the flag is kept as a compatibility alias |

## Examples

Choose an interactive or non-interactive setup based on your environment.

### Interactive setup

Run the command without flags to choose tools and an MCP transport.

```bash
railway setup agent
```

This prompts for which supported coding tools to configure and lets you choose
the CLI connection to `mcp.railway.com` (the default), OAuth, a local
in-process server, or no MCP configuration. It starts the Railway login flow
when needed.

### Non-interactive setup

Pass `--yes` to accept the detected defaults.

```bash
railway setup agent -y
```

This configures detected coding tools and skips the interactive login flow. The editors run `railway mcp`, which reuses your `railway login` credentials when it connects to `mcp.railway.com`. If you are not already authenticated, run `railway login` after setup.

### Connect with OAuth

Pass `--oauth` when the MCP client must connect directly and manage OAuth.

```bash
railway setup agent --oauth
```

This writes `https://mcp.railway.com` directly into supported editor
configurations. The MCP client manages the OAuth flow.

## What it configures

`railway setup agent` installs the `use-railway` skill for supported coding tools, configures the Railway MCP server where supported, and checks your Railway authentication.

The command can install skills for Claude Code, Cursor, OpenAI Codex, OpenCode,
Factory Droid, GitHub Copilot, and the universal `.agents` skills directory. It
configures MCP for each selected named coding tool. The universal directory
doesn't have an MCP configuration convention. See
[`railway skills`](/cli/skills) and [`railway mcp`](/cli/mcp) for the
per-command target lists.

The setup is idempotent. Re-running it updates Railway-owned skill directories and merges Railway MCP entries into existing tool configs without removing other MCP servers.

## Related

These pages describe the commands and resources installed by setup.

- [railway mcp](/cli/mcp)
- [railway agent](/cli/agent)
- [Agent Skills](/ai/agent-skills)
- [Railway MCP Server](/ai/mcp-server)
