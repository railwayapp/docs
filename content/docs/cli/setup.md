---
title: railway setup
description: Set up Railway tooling for editors and AI agents.
---

Set up your editor for Railway agent functionality, including agent skills, MCP configuration, and authentication guidance.

## Usage

```bash
railway setup agent [OPTIONS]
```

## Subcommands

| Subcommand | Description |
|------------|-------------|
| `agent` | Install Railway agent skills, configure MCP, and check Railway authentication |

## Options for `agent`

| Flag | Description |
|------|-------------|
| `-y, --yes` | Skip prompts and accept defaults. Also used automatically when stdout is not a terminal |
| `--remote` | Configure the remote MCP server at `https://mcp.railway.com` instead of the local stdio server |

## Examples

### Interactive setup

```bash
railway setup agent
```

This prompts for which supported coding tools to configure, lets you choose local or remote MCP, and starts the login flow if needed.

### Non-interactive setup

```bash
railway setup agent -y
```

This configures detected coding tools with default settings and skips the interactive login flow. If you are not already authenticated, run `railway login` after setup.

### Use the remote MCP server

```bash
railway setup agent --remote
```

This configures supported editors to use Railway's hosted MCP server.

## What it configures

`railway setup agent` installs the `use-railway` skill for supported coding tools, configures the Railway MCP server where supported, and checks your Railway authentication.

Supported agent targets include Claude Code, Cursor, Factory Droid, GitHub Copilot, OpenAI Codex, OpenCode, and the universal `.agents` skills directory.

The setup is idempotent. Re-running it updates Railway-owned skill directories and merges Railway MCP entries into existing tool configs without removing other MCP servers.

## Related

- [railway mcp](/cli/mcp)
- [railway agent](/cli/agent)
- [Agent Skills](/ai/agent-skills)
- [Railway MCP Server](/ai/mcp-server)
