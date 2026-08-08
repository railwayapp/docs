---
title: railway mcp
description: Start, proxy, or install the Railway MCP server for AI coding tools.
---

Start a local Railway MCP server, bridge the hosted server through your CLI login, or install the Railway MCP configuration into supported AI coding tools.

## Usage

```bash
railway mcp [COMMAND] [OPTIONS]
```

Running `railway mcp` with no subcommand starts the local stdio MCP server. This is the command used by local MCP client configurations.

## Subcommands

| Subcommand | Description |
|------------|-------------|
| `proxy` | Bridge the hosted MCP server at `https://mcp.railway.com` over stdio, authenticating with your existing `railway login` |
| `install` | Install Railway's MCP server config into AI coding tools |

## Transports

`railway mcp install` can configure three transports. All three write to the same `railway` server entry, so switching between them is a single re-run of the command.

| Transport | Command | How it authenticates |
|-----------|---------|----------------------|
| Local | `railway mcp install` | Runs the local stdio server (`railway mcp`) through the CLI, sharing your CLI login and linked project |
| Remote (proxy) | `railway mcp install --remote` | Runs `railway mcp proxy`, which forwards to `mcp.railway.com` using your `railway login`. No browser step |
| Remote (OAuth) | `railway mcp install --remote --oauth` | Points the editor at the `mcp.railway.com` URL directly; the editor runs its own OAuth browser flow |

The proxy is the default remote transport because it reuses the login you already have. It refreshes your token automatically, so the connection keeps working without re-authenticating, and no credential is written into the editor's config file. Use `--remote --oauth` for environments without the Railway CLI, or when you want the editor to manage its own OAuth connection.

## Options for `install`

| Flag | Description |
|------|-------------|
| `--agent <AGENT>` | Target a specific tool instead of all detected tools. Can be used more than once |
| `--remote` | Configure the remote MCP server at `https://mcp.railway.com` through the CLI proxy (`railway mcp proxy`) instead of the local stdio server |
| `--oauth` | Use with `--remote` to write the direct `mcp.railway.com` URL, so the editor runs its own OAuth flow instead of the proxy |

## Supported agents

| Agent | Value |
|-------|-------|
| Claude Code | `claude-code` |
| Cursor | `cursor` |
| Factory Droid | `factory-droid` |
| GitHub Copilot | `copilot` |
| OpenAI Codex | `codex` |
| OpenCode | `opencode` |

## Installed MCP entries

The local and remote-proxy transports both write a stdio entry that runs the `railway` binary; they differ only in the arguments (`["mcp"]` versus `["mcp", "proxy"]`). The remote-OAuth transport writes the hosted URL directly.

| Agent | Local (`railway mcp`) | Remote proxy (`railway mcp proxy`) | Remote OAuth (URL) |
|-------|-----------------------|------------------------------------|--------------------|
| Claude Code | `command: "railway"`, `args: ["mcp"]` | `command: "railway"`, `args: ["mcp", "proxy"]` | `type: "http"`, `url: "https://mcp.railway.com"` |
| Cursor | `command: "railway"`, `args: ["mcp"]` | `command: "railway"`, `args: ["mcp", "proxy"]` | `url: "https://mcp.railway.com"` |
| Factory Droid | `type: "stdio"`, `command: "railway"`, `args: ["mcp"]`, `disabled: false` | `type: "stdio"`, `command: "railway"`, `args: ["mcp", "proxy"]`, `disabled: false` | `type: "http"`, `url: "https://mcp.railway.com"`, `disabled: false` |
| GitHub Copilot | `type: "local"`, `command: "railway"`, `args: ["mcp"]`, `tools: ["*"]` | `type: "local"`, `command: "railway"`, `args: ["mcp", "proxy"]`, `tools: ["*"]` | `type: "http"`, `url: "https://mcp.railway.com"`, `tools: ["*"]` |
| OpenCode | `type: "local"`, `command: ["railway", "mcp"]`, `enabled: true` | `type: "local"`, `command: ["railway", "mcp", "proxy"]`, `enabled: true` | `type: "remote"`, `url: "https://mcp.railway.com"`, `enabled: true` |
| OpenAI Codex | `command = "railway"`, `args = ["mcp"]` | `command = "railway"`, `args = ["mcp", "proxy"]` | `url = "https://mcp.railway.com"` |

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
railway mcp install --agent claude-code --agent copilot
```

### Use the remote server through your CLI login

```bash
railway mcp install --remote
```

This configures detected tools to run `railway mcp proxy`. Because the proxy uses your existing `railway login`, the editor connects to `mcp.railway.com` without an OAuth browser step. If you are not logged in, run `railway login` and the connection starts working on the next request.

### Use the remote server with the editor's own OAuth flow

```bash
railway mcp install --remote --oauth
```

### Switch a tool back to the local server

```bash
railway mcp install --agent claude-code
```

## Local server

MCP clients that use a local stdio server run:

```bash
railway mcp
```

## Proxy server

MCP clients configured for the remote server through the CLI run:

```bash
railway mcp proxy
```

You do not run this command directly. `railway mcp install --remote` writes it into the editor's MCP configuration, and the editor launches it. The proxy reads your stored `railway login`, attaches a fresh token to each request, and forwards it to `mcp.railway.com`. Restart the editor after installing so it picks up the change.

## Related

- [railway setup](/cli/setup)
- [Railway MCP Server](/ai/mcp-server)
- [Agent Skills](/ai/agent-skills)
