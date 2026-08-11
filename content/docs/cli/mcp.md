---
title: railway mcp
description: Start, proxy, or install the Railway MCP server for AI coding tools.
---

Start Local MCP, connect to Remote MCP, or install either configuration into
supported AI coding tools.

## Usage

Run the command without a subcommand to start the local server, or choose a
subcommand to install or proxy MCP.

```bash
railway mcp [COMMAND] [OPTIONS]
```

Running `railway mcp` with no subcommand starts the local stdio MCP server. This is the command used by local MCP client configurations.

## Subcommands

Use a subcommand to write editor configuration or connect Remote MCP to an
editor over stdio.

| Subcommand | Description |
|------------|-------------|
| `install` | Install Railway's MCP server config into AI coding tools |
| `proxy` | Proxy `mcp.railway.com` over stdio using your `railway login` credentials |

## Options for `install`

The install command can target specific tools and select how Remote MCP
authenticates.

| Flag | Description |
|------|-------------|
| `--agent <AGENT>` | Target a specific tool instead of all detected tools. Can be used more than once |
| `--remote` | Configure `mcp.railway.com` through `railway mcp proxy`, authenticated by your CLI login |
| `--oauth` | With `--remote`, configure the direct HTTP endpoint so the MCP client handles OAuth |

## Choose a server

Railway provides Local MCP and Remote MCP. Remote MCP supports CLI credential
reuse through a local proxy or direct OAuth through the MCP client.

| Server | Install command | Authentication |
|--------|-----------------|----------------|
| Local MCP | `railway mcp install` | Railway credentials available to the local CLI |
| Remote MCP | `railway mcp install --remote` | Reuses your `railway login` credentials through the CLI proxy |
| Remote MCP | `railway mcp install --remote --oauth` | OAuth managed by the MCP client |

The CLI proxy keeps credentials out of editor configuration. It refreshes your
Railway access token when needed and forwards requests to `mcp.railway.com`.
Run `railway login` if a proxied tool call reports that you aren't
authenticated. The next tool call uses the new login without restarting the
editor.

## Supported agents

Pass one or more of these values to `--agent`.

| Agent | Value |
|-------|-------|
| Claude Code | `claude-code` |
| Cursor | `cursor` |
| Factory Droid | `factory-droid` |
| GitHub Copilot | `copilot` |
| OpenAI Codex | `codex` |
| OpenCode | `opencode` |

## Installed MCP entries

The installed entry depends on the target tool and transport.

| Agent | Local MCP | Remote MCP through CLI proxy | Remote MCP with OAuth |
|-------|-----------|------------------------------|-----------------------|
| Claude Code | `command: "railway"`, `args: ["mcp"]` | `command: "railway"`, `args: ["mcp", "proxy"]` | `type: "http"`, `url: "https://mcp.railway.com"` |
| Cursor | `command: "railway"`, `args: ["mcp"]` | `command: "railway"`, `args: ["mcp", "proxy"]` | `url: "https://mcp.railway.com"` |
| Factory Droid | `type: "stdio"`, `command: "railway"`, `args: ["mcp"]`, `disabled: false` | `type: "stdio"`, `command: "railway"`, `args: ["mcp", "proxy"]`, `disabled: false` | `type: "http"`, `url: "https://mcp.railway.com"`, `disabled: false` |
| GitHub Copilot | `type: "local"`, `command: "railway"`, `args: ["mcp"]`, `tools: ["*"]` | `type: "local"`, `command: "railway"`, `args: ["mcp", "proxy"]`, `tools: ["*"]` | `type: "http"`, `url: "https://mcp.railway.com"`, `tools: ["*"]` |
| OpenCode | `type: "local"`, `command: ["railway", "mcp"]`, `enabled: true` | `type: "local"`, `command: ["railway", "mcp", "proxy"]`, `enabled: true` | `type: "remote"`, `url: "https://mcp.railway.com"`, `enabled: true` |
| OpenAI Codex | `command = "railway"`, `args = ["mcp"]` | `command = "railway"`, `args = ["mcp", "proxy"]` | `url = "https://mcp.railway.com"` |

`railway mcp install` merges the Railway server entry into existing configs without removing other MCP servers.

## Examples

These examples cover detected tools, targeted installs, Local MCP, and Remote
MCP.

### Install MCP for detected tools

Run the install command without selectors to configure detected tools.

```bash
railway mcp install
```

### Install MCP for a specific tool

Pass `--agent` to configure one tool explicitly.

```bash
railway mcp install --agent cursor
```

### Install MCP for multiple tools

Repeat `--agent` to update more than one tool in the same command.

```bash
railway mcp install --agent claude-code --agent copilot
```

### Install Remote MCP through the CLI proxy

Use `--remote` to install the CLI proxy configuration. The proxy reuses your
`railway login` credentials when it connects to Remote MCP.

```bash
railway mcp install --remote
```

### Install Remote MCP with OAuth

Use direct OAuth when your editor can authenticate an HTTP MCP server.

```bash
railway mcp install --remote --oauth
```

## Run Local MCP

MCP clients that use a local stdio server should run:

```bash
railway mcp
```

The `railway mcp install` command writes this configuration for supported tools automatically.

## Connect to Remote MCP through the CLI proxy

To reuse Railway CLI credentials when connecting to Remote MCP, run:

```bash
railway mcp proxy
```

The process communicates with the editor over stdio and forwards requests to
`mcp.railway.com` over HTTPS.

## Connect directly to Remote MCP

MCP clients that support OAuth can connect directly to Remote MCP at
`https://mcp.railway.com`. The client manages OAuth without using the Railway
CLI proxy. Run `railway mcp install --remote --oauth` to write this
configuration for supported tools.

## Related

These pages cover agent setup and the MCP server's capabilities.

- [railway setup](/cli/setup)
- [Railway MCP Server](/ai/mcp-server)
- [Agent Skills](/ai/agent-skills)
