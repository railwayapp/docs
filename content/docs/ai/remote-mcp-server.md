---
title: Railway Remote MCP Server
description: Connect AI coding agents to Railway over OAuth — no local install, no CLI login, no token files.
---

The Railway Remote MCP Server is a hosted [Model Context Protocol (MCP)](https://modelcontextprotocol.org) endpoint at `mcp.railway.com`. Any MCP-compatible agent — Claude, Cursor, Codex, GitHub Copilot, and others — can connect, authenticate through your Railway account in the browser, and start managing projects, services, and deployments directly from your editor.

Unlike the [local MCP server](/ai/mcp-server), which runs on your machine and depends on the [Railway CLI](/cli), the remote MCP server lives at Railway and authenticates via OAuth. There's nothing to install and no tokens to manage on disk.

## Prerequisites

- A [Railway account](https://railway.com/login)
- An MCP-compatible client (Claude, Cursor, Codex, GitHub Copilot, Droid, OpenCode, or any other client that supports remote MCP over HTTP)

## Setup

The easiest way to get connected is to visit [railway.com/mcp](https://railway.com/mcp). The landing page shows click-to-copy configuration for every supported editor and a one-click install button for Cursor.

When your client first connects to `mcp.railway.com`, Railway opens a browser window asking you to approve access. Once you consent, the client receives a short-lived access token and starts making authenticated tool calls — no API keys required.

### Claude Code

```bash
claude mcp add railway --transport http https://mcp.railway.com
```

The first tool call will prompt you to authenticate.

### Cursor

One-click install from [railway.com/mcp](https://railway.com/mcp), or add the following to `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "railway": {
      "url": "https://mcp.railway.com"
    }
  }
}
```

### Codex

```json
{
  "railway": {
    "type": "url",
    "url": "https://mcp.railway.com"
  }
}
```

### GitHub Copilot

Add to your VS Code `settings.json`:

```json
{
  "mcp": {
    "servers": {
      "railway": {
        "type": "http",
        "url": "https://mcp.railway.com"
      }
    }
  }
}
```

### Droid

```bash
droid mcp add railway https://mcp.railway.com
```

### OpenCode

Add to `opencode.json`:

```json
{
  "mcp": {
    "railway": {
      "type": "remote",
      "url": "https://mcp.railway.com"
    }
  }
}
```

### Other clients

Any client that supports remote MCP over HTTP can connect. The generic configuration:

```json
{
  "railway": {
    "type": "http",
    "url": "https://mcp.railway.com"
  }
}
```

## Example usage

The `railway-agent` tool is the most powerful entry point — it hands your request to Railway's AI agent, which has access to a much broader set of tools internally (log analysis, debugging, service configuration, database setup) than what's exposed as direct MCP tools. Reach for it whenever a task needs more than a single CRUD operation.

* **Debug a failing deployment**

  ```text
  Use the railway agent to figure out why my backend service is
  crashing on deploy
  ```

* **Set up a database end-to-end**

  ```text
  Ask the railway agent to add a Postgres database to my project,
  wire up the DATABASE_URL variable, and redeploy the API service
  ```

* **Investigate unexpected behavior**

  ```text
  Have the railway agent look at recent logs for my worker service
  and summarize any errors
  ```

For simpler operations, the direct tools work well on their own:

* **List your projects**

  ```text
  Show me all my Railway projects
  ```

* **Redeploy a service**

  ```text
  Redeploy my api service in the production environment
  ```

* **Create a new project**

  ```text
  Create a new Railway project called "checkout-service"
  ```

## Available tools

The remote MCP server exposes a focused set of tools. For anything more complex, delegate to `railway-agent`.

* **Account**

  * `whoami` — profile information for the authenticated user

* **Projects**

  * `list-projects` — list all projects you have access to
  * `create-project` — create a new project in a workspace
  * `list-services` — list services and environments within a project

* **Deployments**

  * `redeploy` — redeploy the latest deployment of a service
  * `accept-deploy` — commit staged environment changes and deploy (destructive; clients will prompt for confirmation)

* **Agent**

  * `railway-agent` — send a natural-language request to Railway's AI agent for complex or multi-step operations

## Security considerations

* **OAuth scoping.** When you consent, you choose which workspaces and projects the client can access. Tokens are short-lived and can be revoked at any time from your Railway account settings.
* **Destructive actions.** Tools that modify state (`redeploy`, `accept-deploy`, `railway-agent`) are marked destructive at the protocol level. MCP clients that respect these hints will prompt for confirmation before running them.
* **Review actions.** Always review what the agent proposes before approving destructive changes — especially in production environments.
* **Project tokens are not accepted.** The remote MCP server requires a user identity for billing and audit trails.

## Feature requests

Let us know what you'd like to see next on the [Central Station feedback board](https://station.railway.com/feedback/model-context-protocol-for-railway-railw-c040b796).
