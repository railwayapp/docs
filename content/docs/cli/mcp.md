---
title: railway mcp
description: Connect AI coding tools to the Railway MCP server.
---

Connect AI coding tools to the Railway MCP server at `mcp.railway.com`, or
install the configuration into supported tools.

## Usage

Run the command without a subcommand to connect to the MCP server, or use the
`install` subcommand to write editor configuration.

```bash
railway mcp [COMMAND] [OPTIONS]
```

Running `railway mcp` with no subcommand connects to `mcp.railway.com` over
stdio. The command authenticates every request with your `railway login`
credentials, so connecting doesn't require a second authentication. This is
the command used by the MCP client configurations that `railway mcp install`
writes.

**Note:** Connecting to `mcp.railway.com` by default requires CLI version
5.44.0 or later. On earlier versions, `railway mcp` starts the in-process
server described in [Run the server locally](#run-the-server-locally).

## Subcommands

| Subcommand | Description |
|------------|-------------|
| `install` | Install Railway's MCP server config into AI coding tools |
| `local` | Serve an in-process MCP server over stdio, without reaching `mcp.railway.com`. See [Run the server locally](#run-the-server-locally) |
| `proxy` | Behaves the same as running `railway mcp` with no subcommand. Kept so configurations written before it became the default keep working |

## Options for `install`

The install command can target specific tools and select how the connection
authenticates.

| Flag | Description |
|------|-------------|
| `--agent <AGENT>` | Target a specific tool instead of all detected tools. Can be used more than once |
| `--oauth` | Configure the direct `https://mcp.railway.com` endpoint so the MCP client handles OAuth. Takes precedence over `--remote` |
| `--local` | Configure the in-process local server (`railway mcp local`) instead of the default connection |
| `--remote` | Configure the default CLI connection to `mcp.railway.com`. This is already the default, and the flag is kept as a compatibility alias |

## Choose a connection

The MCP server supports credential reuse through the CLI or direct OAuth
through the MCP client.

| Connection | Install command | Authentication |
|------------|-----------------|----------------|
| CLI (default) | `railway mcp install` | Reuses your `railway login` credentials |
| OAuth | `railway mcp install --oauth` | OAuth managed by the MCP client |

The CLI connection keeps credentials out of editor configuration. It refreshes
your Railway access token when needed and forwards requests to
`mcp.railway.com`. Run `railway login` if a tool call reports that you aren't
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

The installed entry depends on the target tool and connection.

| Agent | CLI (default) | OAuth | Local server (`--local`) |
|-------|---------------|-------|--------------------------|
| Claude Code | `command: "railway"`, `args: ["mcp"]` | `type: "http"`, `url: "https://mcp.railway.com"` | `command: "railway"`, `args: ["mcp", "local"]` |
| Cursor | `command: "railway"`, `args: ["mcp"]` | `url: "https://mcp.railway.com"` | `command: "railway"`, `args: ["mcp", "local"]` |
| Factory Droid | `type: "stdio"`, `command: "railway"`, `args: ["mcp"]`, `disabled: false` | `type: "http"`, `url: "https://mcp.railway.com"`, `disabled: false` | `type: "stdio"`, `command: "railway"`, `args: ["mcp", "local"]`, `disabled: false` |
| GitHub Copilot | `type: "local"`, `command: "railway"`, `args: ["mcp"]`, `tools: ["*"]` | `type: "http"`, `url: "https://mcp.railway.com"`, `tools: ["*"]` | `type: "local"`, `command: "railway"`, `args: ["mcp", "local"]`, `tools: ["*"]` |
| OpenCode | `type: "local"`, `command: ["railway", "mcp"]`, `enabled: true` | `type: "remote"`, `url: "https://mcp.railway.com"`, `enabled: true` | `type: "local"`, `command: ["railway", "mcp", "local"]`, `enabled: true` |
| OpenAI Codex | `command = "railway"`, `args = ["mcp"]` | `url = "https://mcp.railway.com"` | `command = "railway"`, `args = ["mcp", "local"]` |

`railway mcp install` merges the Railway server entry into existing configs without removing other MCP servers.

**Note:** Configurations that run `railway mcp proxy` continue to work and
connect to `mcp.railway.com`. Re-run `railway mcp install` to update them to
the bare `railway mcp` form.

## Examples

These examples cover detected tools, targeted installs, and OAuth.

### Install MCP for detected tools

Run the install command without selectors to configure detected tools with
the default CLI connection.

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

### Install MCP with OAuth

Use direct OAuth when your editor can authenticate an HTTP MCP server without
the CLI.

```bash
railway mcp install --oauth
```

## Connect through the CLI

MCP clients connect to the Railway MCP server through the CLI by running:

```bash
railway mcp
```

The process communicates with the editor over stdio and forwards requests to
`mcp.railway.com` over HTTPS, attaching your `railway login` credentials to
each request. The `railway mcp install` command writes this configuration for
supported tools automatically.

## Connect with OAuth

MCP clients that support OAuth can connect directly to
`https://mcp.railway.com`. The client manages OAuth without using the Railway
CLI. Run `railway mcp install --oauth` to write this configuration for
supported tools.

## Run the server locally

The CLI also ships an in-process MCP server for machines that can't reach
`mcp.railway.com`, for example on egress-restricted networks. It talks
directly to the Railway API using your CLI credentials and exposes a
different tool set from `mcp.railway.com`. MCP clients start it by running:

```bash
railway mcp local
```

Pass `--local` to the install command to write this configuration for
supported tools:

```bash
railway mcp install --local
```

## Related

These pages cover agent setup and the MCP server's capabilities.

- [railway setup](/cli/setup)
- [Railway MCP Server](/ai/mcp-server)
- [Agent Skills](/ai/agent-skills)
