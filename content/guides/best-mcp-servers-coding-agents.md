---
title: Connect the Best MCP Servers to Your Coding Agent
description: Config snippets for connecting nine widely used MCP servers to Claude Code, Cursor, and VS Code, covering GitHub, Postgres, browser automation, docs lookup, error tracking, and deployment.
date: "2026-07-29"
tags:
  - mcp
  - agents
  - ai
topic: ai
---

The [Model Context Protocol](https://modelcontextprotocol.io) (MCP) is an open standard that lets a coding agent call external tools: query a database, open a pull request, drive a browser, read production logs. Out of the box, a coding agent can already read and edit files and run shell commands; MCP servers are how it reaches everything else. An MCP server exposes the tools, and your agent connects to it and calls them as needed.

This guide connects nine such servers to Claude Code, Cursor, and VS Code, with a config snippet for each.

## How MCP servers connect

There are two transport types, and the config differs by type, not by server:

- **Local (stdio)**: the client launches the server as a subprocess on your machine. You configure a command and arguments.
- **Remote (Streamable HTTP)**: the server is hosted. You configure a URL, and the client usually authenticates via OAuth in the browser.

Prefer the remote endpoint when a server offers one. There is nothing to install, nothing to keep updated, and auth is handled by OAuth instead of long-lived API keys sitting in a config file. See [local vs. remote MCP servers](/guides/local-vs-remote-mcp-servers) for the full tradeoff.

## Where each client keeps its config

**Claude Code** manages servers with the `claude mcp` command:

```bash
# Local (stdio) server
claude mcp add <name> -- <command> [args...]

# Remote (HTTP) server
claude mcp add --transport http <name> <url>
```

**Cursor** reads `~/.cursor/mcp.json` (global) or `.cursor/mcp.json` in the project root. Servers live under an `mcpServers` key:

```json
{
  "mcpServers": {
    "my-server": {
      "command": "npx",
      "args": ["-y", "some-mcp-package"]
    },
    "my-remote-server": {
      "url": "https://example.com/mcp"
    }
  }
}
```

**VS Code** (with GitHub Copilot) reads `.vscode/mcp.json` in the workspace. Servers live under a `servers` key and declare a `type`:

```json
{
  "servers": {
    "my-server": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "some-mcp-package"]
    },
    "my-remote-server": {
      "type": "http",
      "url": "https://example.com/mcp"
    }
  }
}
```

The snippets below show the Claude Code command and the Cursor JSON for each server. Translating to VS Code is mechanical: same command or URL, `servers` key instead of `mcpServers`, plus a `type` field.

## 1. GitHub

The official GitHub MCP server gives your agent tools for issues, pull requests, code search, CI runs, and repository management. The win is closing the loop: the agent writes the fix, opens the PR, reads the failing check, and pushes the follow-up commit without you tabbing to the browser.

GitHub hosts a remote endpoint, so there is nothing to install:

```bash
claude mcp add --transport http github https://api.githubcopilot.com/mcp/
```

```json
{
  "mcpServers": {
    "github": {
      "url": "https://api.githubcopilot.com/mcp/"
    }
  }
}
```

The client opens a browser window for OAuth on first use. If your organization blocks the remote endpoint, GitHub also ships the server as a Docker image (`ghcr.io/github/github-mcp-server`) you can run locally with a personal access token.

## 2. Filesystem

The reference filesystem server (`@modelcontextprotocol/server-filesystem`) gives an agent scoped read/write access to directories you name explicitly. Coding agents can already touch the project they run in; this server matters when the agent needs a directory outside its working tree, such as a shared notes folder or a second repository, without granting access to your whole disk.

Requires Node.js. The paths you pass as arguments are the only ones the server will touch:

```bash
claude mcp add filesystem -- npx -y @modelcontextprotocol/server-filesystem ~/notes ~/other-repo
```

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/you/notes",
        "/Users/you/other-repo"
      ]
    }
  }
}
```

## 3. Postgres

Postgres MCP Pro (`postgres-mcp`) lets an agent inspect schemas, run queries, and analyze slow query plans. This changes debugging: the agent reads your real schema instead of working from your description of it, and when a query is slow it runs `EXPLAIN` itself.

Requires Python with [uv](https://docs.astral.sh/uv/) installed. Run it in restricted mode so the agent gets read-only access:

```bash
claude mcp add postgres \
  --env DATABASE_URI=postgresql://user:pass@localhost:5432/mydb \
  -- uvx postgres-mcp --access-mode=restricted
```

```json
{
  "mcpServers": {
    "postgres": {
      "command": "uvx",
      "args": ["postgres-mcp", "--access-mode=restricted"],
      "env": {
        "DATABASE_URI": "postgresql://user:pass@localhost:5432/mydb"
      }
    }
  }
}
```

Point `DATABASE_URI` at a development database. Giving an agent unrestricted access to production data is a decision to make deliberately, not a default.

## 4. Playwright

Microsoft's Playwright MCP server (`@playwright/mcp`) drives a real browser: navigate, click, fill forms, take screenshots, read the accessibility tree. For frontend work this closes the verification gap. The agent makes a UI change, loads the page, and checks the result instead of assuming the change worked because it compiled.

Requires Node.js:

```bash
claude mcp add playwright -- npx -y @playwright/mcp@latest
```

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"]
    }
  }
}
```

By default it operates on the accessibility snapshot rather than screenshots, which is faster and cheaper in tokens. Pass `--headless` if you do not want a browser window appearing while the agent works.

## 5. Fetch

The reference fetch server (`mcp-server-fetch`) retrieves a URL and converts the page to markdown. It is the simplest server on this list and one of the most used: pulling a changelog, a GitHub issue thread, or an API's documentation page into context without you copy-pasting it.

Requires Python with uv installed:

```bash
claude mcp add fetch -- uvx mcp-server-fetch
```

```json
{
  "mcpServers": {
    "fetch": {
      "command": "uvx",
      "args": ["mcp-server-fetch"]
    }
  }
}
```

Some clients ship a built-in fetch tool. If yours does, skip this one.

## 6. Railway

The [Railway MCP server](/ai/mcp-server) connects your agent to your Railway projects and infrastructure: create projects, deploy services, provision databases from templates, pull environment variables, read deploy logs, and hand multi-step debugging to Railway's own agent. It turns "deploy this and tell me why staging is failing" into something the agent does rather than something it explains to you.

If you have the [Railway CLI](/cli) installed, one command configures your detected clients:

```bash
railway setup agent
```

Or wire it manually. The remote endpoint authenticates via OAuth:

```bash
claude mcp add --transport http railway https://mcp.railway.com
```

```json
{
  "mcpServers": {
    "railway": {
      "url": "https://mcp.railway.com"
    }
  }
}
```

The default CLI configuration (`command: "railway"`, `args: ["mcp"]`) shares the CLI's authentication and linked-project context, which is convenient when your agent works inside a repo already linked to a Railway project. The OAuth endpoint, by contrast, needs no local install. Both paths include the `railway-agent` tool for multi-step operations like log analysis and failure diagnosis. Full tool lists and per-editor tables are in the [MCP server docs](/ai/mcp-server).

## 7. Context7

Context7 (by Upstash) fetches version-specific library documentation into the agent's context. Models are trained on a snapshot of the ecosystem; when you are on a framework version newer than the model's training data, Context7 supplies current, accurate API docs instead of letting the agent hallucinate from an older release.

It offers a remote endpoint:

```bash
claude mcp add --transport http context7 https://mcp.context7.com/mcp
```

```json
{
  "mcpServers": {
    "context7": {
      "url": "https://mcp.context7.com/mcp"
    }
  }
}
```

A local variant exists as `npx -y @upstash/context7-mcp` if you prefer stdio; either way, higher rate limits require an API key from context7.com.

## 8. Sentry

Sentry's hosted MCP server gives an agent access to your error tracking: search issues, read stack traces and breadcrumbs, and pull the full event context for a crash. Pasting a stack trace into a chat loses the surrounding data; letting the agent query Sentry directly keeps release, environment, and frequency attached to the error it is fixing.

```bash
claude mcp add --transport http sentry https://mcp.sentry.dev/mcp
```

```json
{
  "mcpServers": {
    "sentry": {
      "url": "https://mcp.sentry.dev/mcp"
    }
  }
}
```

Authentication is OAuth against your Sentry organization. The agent sees only the projects your account can see.

## 9. Memory

The reference memory server (`@modelcontextprotocol/server-memory`) maintains a local knowledge graph the agent can write to and read across sessions. Facts you would otherwise repeat every session, such as architecture decisions, naming conventions, or the reason a workaround exists, persist between conversations.

Requires Node.js:

```bash
claude mcp add memory -- npx -y @modelcontextprotocol/server-memory
```

```json
{
  "mcpServers": {
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    }
  }
}
```

By default the graph is stored in a JSON file alongside the package; set the `MEMORY_FILE_PATH` environment variable to keep it somewhere durable. Many agents now have their own persistent memory features, so check what your client already does before adding this.

## Keep the tool list small

Every connected server adds tool definitions to the agent's context on every request, and that cost compounds fast: connect a dozen servers and you pay for thousands of tokens of tool schemas before the conversation even starts, while the agent gets worse at picking the right one. So connect only the three or four servers your current work actually needs, scope them per project where your client supports it, and remove the ones you stop using.

Two other habits worth keeping:

- **Review before approving.** MCP tools act with your credentials. Clients prompt before tool calls by default; keep it that way for anything that writes, deploys, or deletes.
- **Prefer OAuth over pasted keys.** Remote servers with OAuth issue short-lived, revocable tokens. A key in a JSON config file is neither.

## Next steps

- [Build and deploy your own MCP server](/guides/mcp-server) when no existing server covers your app's data.
- [Choose between local and remote MCP servers](/guides/local-vs-remote-mcp-servers) for the transport tradeoffs in depth.
- [Railway MCP server reference](/ai/mcp-server) for the full tool list and per-editor config tables.
- [Running agents on Railway](/guides/running-agents-on-railway) to host the agent itself, not just its tools.
