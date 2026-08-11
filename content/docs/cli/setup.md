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

Use these flags to skip prompts or select how Remote MCP authenticates.

| Flag | Description |
|------|-------------|
| `-y, --yes` | Skip prompts and accept defaults. Also used automatically when stdout is not a terminal |
| `--remote` | Configure `mcp.railway.com` through the CLI proxy using your `railway login` session |
| `--oauth` | With `--remote`, configure the direct HTTP endpoint so the MCP client handles OAuth |

## Examples

Choose an interactive or non-interactive setup based on your environment.

### Interactive setup

Run the command without flags to choose tools and an MCP transport.

```bash
railway setup agent
```

This prompts for which supported coding tools to configure and lets you choose
Local MCP, Remote MCP through the CLI proxy, Remote MCP with OAuth, or no
MCP configuration. It starts the Railway login flow when needed.

### Non-interactive setup

Pass `--yes` to accept the detected defaults.

```bash
railway setup agent -y
```

This configures detected coding tools with default settings and skips the interactive login flow. If you are not already authenticated, run `railway login` after setup.

### Use Remote MCP through the CLI proxy

Pass `--remote` to connect to Remote MCP through the CLI proxy and reuse your
Railway CLI credentials.

```bash
railway setup agent --remote
```

This configures supported editors to run `railway mcp proxy`. The proxy reuses
your `railway login` credentials when it connects to Remote MCP.

### Use Remote MCP with OAuth

Add `--oauth` when the MCP client must connect directly and manage OAuth.

```bash
railway setup agent --remote --oauth
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
