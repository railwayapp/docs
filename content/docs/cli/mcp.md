---
title: railway mcp
description: Start or install the Railway MCP server for AI coding tools.
---

Start a local Railway MCP server, or install the Railway MCP configuration into supported AI coding tools.

## Usage

```bash
railway mcp [COMMAND] [OPTIONS]
```

Running `railway mcp` with no subcommand starts the local stdio MCP server. This is the command used by local MCP client configurations.

## Subcommands

| Subcommand | Description |
|------------|-------------|
| `install` | Install Railway's MCP server config into AI coding tools |

## Options for `install`

| Flag | Description |
|------|-------------|
| `--agent <AGENT>` | Target a specific tool instead of all detected tools. Can be used more than once |
| `--remote` | Configure the remote MCP server at `https://mcp.railway.com` instead of the local stdio server |

## Supported agents

| Agent | Value |
|-------|-------|
| Claude Code | `claude-code` |
| Cursor | `cursor` |
| OpenAI Codex | `codex` |
| OpenCode | `opencode` |

Codex supports local stdio MCP only. It is skipped when installing with `--remote`.

## Installed MCP entries

| Agent | Local stdio config | Remote config |
|-------|--------------------|---------------|
| Claude Code | `command: "railway"`, `args: ["mcp"]` | `type: "http"`, `url: "https://mcp.railway.com"` |
| Cursor | `command: "railway"`, `args: ["mcp"]` | `url: "https://mcp.railway.com"` |
| OpenCode | `type: "local"`, `command: ["railway", "mcp"]`, `enabled: true` | `type: "remote"`, `url: "https://mcp.railway.com"`, `enabled: true` |
| OpenAI Codex | `command = "railway"`, `args = ["mcp"]` | Not supported |

`railway mcp install` merges the Railway server entry into existing configs without removing other MCP servers.

## Examples

### Install MCP for detected tools

```bash
railway mcp install
```

### Install MCP for a specific tool

```bash
railway mcp install --agent cursor
```

### Install MCP for multiple tools

```bash
railway mcp install --agent claude-code --agent opencode
```

### Install the remote MCP server configuration

```bash
railway mcp install --remote
```

## Local server

MCP clients that use a local stdio server should run:

```bash
railway mcp
```

The `railway mcp install` command writes this configuration for supported tools automatically.

## Related

- [railway setup](/cli/setup)
- [Railway MCP Server](/ai/mcp-server)
- [Agent Skills](/ai/agent-skills)
