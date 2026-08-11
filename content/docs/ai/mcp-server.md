---
title: Railway MCP Server
description: Connect AI coding agents to Railway through a local server, the CLI-authenticated proxy, or hosted OAuth.
---

The <a href="https://github.com/railwayapp/railway-mcp-server" target="_blank">Railway MCP Server</a> implements the <a href="https://modelcontextprotocol.org" target="_blank">Model Context Protocol (MCP)</a> and enables natural language interaction with your Railway projects and infrastructure. Ask your IDE or AI assistant to create projects, deploy templates, manage environments, pull variables, redeploy services, and more.

Railway offers three ways to connect:

* **Local MCP** runs through the [Railway CLI](/cli) on your machine and uses local CLI context.
* **Hosted MCP through the CLI proxy** runs `railway mcp proxy` locally, uses your `railway login` session, and forwards requests to `mcp.railway.com`.
* **Hosted MCP through editor OAuth** connects the editor directly to `mcp.railway.com`. It doesn't require a local CLI after configuration.

## Quick start

Install the Railway CLI and configure agent skills, MCP, and authentication in
one command. Toggle the options to tailor the command to what you want set up:

<AgentInstallCommand />

If the CLI is already installed, skip the bootstrap and run:

```bash
railway setup agent                  # Local MCP
railway setup agent --remote         # Hosted MCP through the CLI proxy
railway setup agent --remote --oauth # Hosted MCP through editor OAuth
```

Read on for per-editor manual configuration, the available tool list, and security considerations.

## Per-editor configuration

If you'd rather configure an editor manually, or want to inspect what
`railway mcp install` writes, use the selector to switch between local stdio,
the hosted CLI proxy, and direct hosted OAuth:

<McpInstallGuide />

`railway mcp install` merges the Railway server entry into existing configs without removing other MCP servers. Re-run it any time to update.

## Understanding MCP

The **Model Context Protocol (MCP)** defines a standard for how AI applications (hosts) can interact with external tools and data sources through a client-server architecture.

* **Hosts**: Applications such as Cursor, VS Code, Claude Code, or Windsurf that connect to MCP servers.
* **Clients**: The layer within hosts that maintains one-to-one connections with individual MCP servers.
* **Servers**: Standalone programs (like the Railway MCP Server) that expose tools and workflows for managing external systems.

The local Railway MCP Server translates natural language requests into CLI workflows powered by the [Railway CLI](/cli). The hosted MCP server runs on Railway's infrastructure. It accepts short-lived credentials from the CLI proxy or an OAuth session managed by the editor.

## Prerequisites

The connection method determines which local tools and credentials you need.

* **Local MCP** requires an installed and authenticated [Railway CLI](/cli).
* **Hosted MCP through the CLI proxy** requires an installed CLI and a `railway login` session.
* **Hosted MCP through editor OAuth** requires a <a href="https://railway.com/login" target="_blank">Railway account</a>. It doesn't require a local CLI after configuration.

## Example usage

Use prompts that describe the Railway outcome you want the agent to produce.

* **Create and deploy a new app**

  ```text
  Create a Next.js app in this directory and deploy it to Railway.
  Also assign it a domain.
  ```

* **Deploy from a template**

  ```text
  Deploy a Postgres database
  ```

* **Pull environment variables**

  ```text
  Pull environment variables for my project and save them to a .env file
  ```

* **Debug a failing deployment** (hosted-only `railway-agent` tool)

  ```text
  Use the railway agent to figure out why my backend service is
  crashing on deploy
  ```

* **Redeploy a service**

  ```text
  Redeploy my api service in the production environment
  ```

* **Manage feature flags**

  ```text
  List feature flags for project <projectId>
  ```

  ```text
  Set the checkout-v2 feature flag to true on project <projectId>
  ```

## Available MCP tools

The Railway MCP Server provides a curated set of tools. Your AI assistant calls these automatically based on the context of your request.

### Local MCP

The local server runs through the Railway CLI and exposes a broader set of CRUD tools:

* **Status**
  * `check-railway-status`: verify CLI installation and authentication
* **Projects & services**
  * `list-projects`, `create-project-and-link`
  * `list-services`, `link-service`
  * `deploy`: deploy a service
  * `deploy-template`: deploy from the <a href="https://railway.com/deploy" target="_blank">Railway Template Library</a>
* **Environments**
  * `create-environment`, `link-environment`
* **Configuration**
  * `list-variables`, `set-variables`
  * `generate-domain`
* **Observability**
  * `get-logs`

### Hosted MCP

The hosted server exposes a focused set of tools plus a powerful agent entry
point. For multi-step work, delegate to `railway-agent`.

* **Account**
  * `whoami`
* **Projects**
  * `list-projects`, `create-project`, `list-services`
* **Feature flags**
  * `list-feature-flags`, `get-feature-flag`
  * `set-feature-flag`, `delete-feature-flag` (admin; destructive delete is marked at the protocol level)
* **Deployments**
  * `redeploy`
  * `accept-deploy`: commit staged changes and deploy (destructive; clients prompt for confirmation)
* **Agent**
  * `railway-agent`: hand a natural-language request to Railway's AI agent for multi-step operations like log analysis, debugging, and service configuration

## Security considerations

The Railway MCP Server runs CLI commands or invokes Railway APIs on your behalf. Destructive operations are intentionally excluded from the local server's tool list, but you should still:

* **Review actions** requested by the LLM before approving them, especially destructive ones (`redeploy`, `accept-deploy`, `railway-agent`).
* **Restrict access** to ensure only trusted users can invoke the MCP server.
* **Avoid production risks** by limiting usage to non-critical environments where possible.

For the hosted server specifically:

* **CLI proxy authentication.** The proxy reads and refreshes your `railway login` credentials. Editor configuration doesn't contain a long-lived Railway credential.
* **OAuth scoping.** With direct editor OAuth, you choose which workspaces and projects the client can access. Tokens are short-lived and can be revoked from your Railway account settings.
* **Destructive actions** are marked at the protocol level. Clients that respect these hints will prompt for confirmation.
* **Project tokens are not accepted.** The hosted MCP server requires a user identity for billing and audit trails.

## Feature requests

Share feature requests on the <a href="https://station.railway.com/feedback/model-context-protocol-for-railway-railw-c040b796" target="_blank">Railway MCP Server Central Station post</a>.
