---
title: railway mcp
description: Connect to Remote MCP, run Local MCP, or install the Railway MCP server into AI coding tools.
---

Connect AI coding tools to Remote MCP at `mcp.railway.com`, run Local MCP, or
install either configuration into supported tools.

## Usage

Run the command without a subcommand to connect to Remote MCP, or choose a
subcommand to run the local server or install MCP configuration.

```bash
railway mcp [COMMAND] [OPTIONS]
```

Running `railway mcp` with no subcommand proxies Remote MCP over stdio. The
proxy authenticates every request with your `railway login` credentials, so
connecting doesn't require a second authentication. This is the command used
by the MCP client configurations that `railway mcp install` writes.

**Note:** Connecting to Remote MCP by default and the `local` subcommand
require CLI version 5.44.0 or later. On earlier versions, `railway mcp` starts
the local server.

## Subcommands

Use a subcommand to run Local MCP or write editor configuration.

| Subcommand | Description |
|------------|-------------|
| `install` | Install Railway's MCP server config into AI coding tools |
| `local` | Serve Local MCP over stdio, without reaching `mcp.railway.com` |
| `proxy` | Proxy `mcp.railway.com` over stdio. Behaves the same as running `railway mcp` with no subcommand, and is kept so configurations written before the proxy became the default keep working |

## Options for `install`

The install command can target specific tools and select which server and
authentication method to configure.

| Flag | Description |
|------|-------------|
| `--agent <AGENT>` | Target a specific tool instead of all detected tools. Can be used more than once |
| `--oauth` | Configure the direct `https://mcp.railway.com` endpoint so the MCP client handles OAuth. Takes precedence over `--remote` |
| `--local` | Configure Local MCP (`railway mcp local`) instead of the Remote MCP default |
| `--remote` | Configure Remote MCP through the CLI proxy. This is the default, and the flag is kept as a compatibility alias |

## Choose a server

Railway provides Remote MCP and Local MCP. Remote MCP supports CLI credential
reuse through a local proxy or direct OAuth through the MCP client.

| Server | Install command | Authentication |
|--------|-----------------|----------------|
| Remote MCP (default) | `railway mcp install` | Reuses your `railway login` credentials through the CLI proxy |
| Remote MCP with OAuth | `railway mcp install --oauth` | OAuth managed by the MCP client |
| Local MCP | `railway mcp install --local` | Railway credentials available to the local CLI |

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

| Agent | Remote MCP through CLI proxy | Remote MCP with OAuth | Local MCP |
|-------|------------------------------|-----------------------|-----------|
| Claude Code | `command: "railway"`, `args: ["mcp"]` | `type: "http"`, `url: "https://mcp.railway.com"` | `command: "railway"`, `args: ["mcp", "local"]` |
| Cursor | `command: "railway"`, `args: ["mcp"]` | `url: "https://mcp.railway.com"` | `command: "railway"`, `args: ["mcp", "local"]` |
| Factory Droid | `type: "stdio"`, `command: "railway"`, `args: ["mcp"]`, `disabled: false` | `type: "http"`, `url: "https://mcp.railway.com"`, `disabled: false` | `type: "stdio"`, `command: "railway"`, `args: ["mcp", "local"]`, `disabled: false` |
| GitHub Copilot | `type: "local"`, `command: "railway"`, `args: ["mcp"]`, `tools: ["*"]` | `type: "http"`, `url: "https://mcp.railway.com"`, `tools: ["*"]` | `type: "local"`, `command: "railway"`, `args: ["mcp", "local"]`, `tools: ["*"]` |
| OpenCode | `type: "local"`, `command: ["railway", "mcp"]`, `enabled: true` | `type: "remote"`, `url: "https://mcp.railway.com"`, `enabled: true` | `type: "local"`, `command: ["railway", "mcp", "local"]`, `enabled: true` |
| OpenAI Codex | `command = "railway"`, `args = ["mcp"]` | `url = "https://mcp.railway.com"` | `command = "railway"`, `args = ["mcp", "local"]` |

`railway mcp install` merges the Railway server entry into existing configs without removing other MCP servers.

**Note:** Configurations that run `railway mcp proxy` continue to work and
connect to Remote MCP. Re-run `railway mcp install` to update them to the
bare `railway mcp` form.

## Examples

These examples cover detected tools, targeted installs, Remote MCP, and Local
MCP.

### Install Remote MCP for detected tools

Run the install command without selectors to configure detected tools with
Remote MCP through the CLI proxy.

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

### Install Remote MCP with OAuth

Use direct OAuth when your editor can authenticate an HTTP MCP server without
the CLI.

```bash
railway mcp install --oauth
```

### Install Local MCP

Pass `--local` to configure the local stdio server instead of Remote MCP.

```bash
railway mcp install --local
```

## Connect to Remote MCP through the CLI proxy

MCP clients connect to Remote MCP through the CLI by running:

```bash
railway mcp
```

The process communicates with the editor over stdio and forwards requests to
`mcp.railway.com` over HTTPS, attaching your `railway login` credentials to
each request. The `railway mcp install` command writes this configuration for
supported tools automatically.

## Run Local MCP

MCP clients that use the local stdio server should run:

```bash
railway mcp local
```

Local MCP talks directly to the Railway API using your CLI credentials and
never reaches `mcp.railway.com`. Choose it when your machine can't reach
`mcp.railway.com`, for example on egress-restricted networks.

## Connect directly to Remote MCP

MCP clients that support OAuth can connect directly to Remote MCP at
`https://mcp.railway.com`. The client manages OAuth without using the Railway
CLI proxy. Run `railway mcp install --oauth` to write this configuration for
supported tools.

## Related

These pages cover agent setup and the MCP server's capabilities.

- [railway setup](/cli/setup)
- [Railway MCP Server](/ai/mcp-server)
- [Agent Skills](/ai/agent-skills)
