---
title: Railway MCP Server
description: Connect AI coding agents to Railway through Remote MCP or Local MCP.
---

The Railway MCP Server implements the <a href="https://modelcontextprotocol.org" target="_blank">Model Context Protocol (MCP)</a>. It lets AI assistants create projects, deploy templates, manage environments, pull variables, and redeploy services.

Railway offers two MCP servers:

* **Remote MCP** runs at `mcp.railway.com` and is the default. The `railway mcp` command connects your editor to it through the [Railway CLI](/cli), reusing your `railway login` credentials so no second authentication is required. Editors that support OAuth can also connect directly.
* **Local MCP** runs in-process through the Railway CLI on your machine. Start it with `railway mcp local` when your machine can't reach `mcp.railway.com`.

**Note:** Connecting to Remote MCP by default and the `railway mcp local`
command require CLI version 5.44.0 or later.

## Quick start

Install the Railway CLI and configure agent skills, MCP, and authentication in
one command. Select the options to generate the setup command:

<AgentInstallCommand />

If the CLI is already installed, skip the bootstrap and run:

```bash
railway setup agent          # Remote MCP through the CLI proxy (default)
railway setup agent --oauth  # Remote MCP with OAuth
railway setup agent --local  # Local MCP
```

Read on for per-editor manual configuration, the available tool list, and security considerations.

## Per-editor configuration

If you'd rather configure an editor manually, or want to inspect what
`railway mcp install` writes, use the selector to switch between Remote MCP
through the CLI proxy, Remote MCP with OAuth, and local stdio:

<McpInstallGuide />

`railway mcp install` merges the Railway server entry into existing configs without removing other MCP servers. Re-run it any time to update.

## Understanding MCP

The **Model Context Protocol (MCP)** defines a standard for how AI applications (hosts) can interact with external tools and data sources through a client-server architecture.

* **Hosts**: Applications such as Cursor, VS Code, Claude Code, or Windsurf that connect to MCP servers.
* **Clients**: The layer within hosts that maintains one-to-one connections with individual MCP servers.
* **Servers**: Standalone programs (like the Railway MCP Server) that expose tools and workflows for managing external systems.

Remote MCP runs on Railway's infrastructure. The `railway mcp` command connects to it over stdio and attaches credentials from your `railway login` session to each request, and editors that support OAuth can connect directly instead. The Local MCP server (`railway mcp local`) translates natural language requests into CLI workflows powered by the [Railway CLI](/cli) without reaching `mcp.railway.com`.

## Prerequisites

The server and authentication method determine which local tools and credentials you need.

* **Remote MCP** requires a <a href="https://railway.com/login" target="_blank">Railway account</a>. The default `railway mcp` connection requires an installed CLI and a `railway login` session so it can reuse those credentials. Direct OAuth doesn't require the CLI.
* **Local MCP** requires an installed and authenticated [Railway CLI](/cli).

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

* **Debug a failing deployment** (remote-only `railway-agent` tool)

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

The Railway MCP Server exposes the following tools. Your AI assistant selects tools based on your request.

### Remote MCP

Remote MCP exposes the following tools. Use `railway-agent` for multi-step
operations.

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

### Local MCP

Local MCP runs through the Railway CLI and exposes these tools:

* **Account:** `whoami`
* **Projects and services:** `list_workspaces`, `list_projects`,
  `create_project`, `list_services`, `create_service`, `remove_service`,
  `connect_service_source`, `disconnect_service_source`, `link_service`,
  `get_service_config`, `update_service`, and `scale_service`
* **Environments and deployments:** `create_environment`, `link_environment`,
  `environment_status`, `list_deployments`, and `deploy`
* **Variables:** `list_variables`, `set_variables`, and
  `add_reference_variable`
* **Domains:** `generate_domain`, `list_domains`, `domain_status`,
  `update_domain`, `delete_domain`, and `retry_domain_certificate`
* **Networking:** `list_tcp_proxies`, `get_tcp_proxy`, `create_tcp_proxy`,
  `remove_tcp_proxy`, `private_network_status`, and `private_network_update`
* **Templates:** `search_templates` and `deploy_template`
* **Storage:** `create_bucket`, `remove_bucket`, `create_volume`,
  `update_volume`, and `remove_volume`
* **Observability:** `get_logs`, `service_metrics`, `http_requests`,
  `http_error_rate`, and `http_response_time`
* **Documentation:** `docs_search` and `docs_fetch`

## Security considerations

The Railway MCP Server runs CLI commands or invokes Railway APIs on your
behalf. Local MCP marks destructive tools with protocol-level hints and returns
a preview before requiring `confirm: true`. You should still:

* **Review actions** requested by the LLM before approving them, especially
  destructive ones (`remove_service`, `delete_domain`, `remove_tcp_proxy`,
  `remove_bucket`, `remove_volume`, `redeploy`, `accept-deploy`, and
  `railway-agent`).
* **Restrict access** to ensure only trusted users can invoke the MCP server.
* **Avoid production risks** by limiting usage to non-critical environments where possible.

For Remote MCP:

* **CLI proxy authentication.** The proxy reads and refreshes your `railway login` credentials. Editor configuration doesn't contain a long-lived Railway credential.
* **OAuth scoping.** With direct OAuth, you choose which workspaces and projects the client can access. Tokens are short-lived and can be revoked from your Railway account settings.
* **Destructive actions** are marked at the protocol level. Clients that respect these hints will prompt for confirmation.
* **Project tokens are not accepted.** Remote MCP requires a user identity for billing and audit trails.

## Feature requests

Share feature requests on the <a href="https://station.railway.com/feedback/model-context-protocol-for-railway-railw-c040b796" target="_blank">Railway MCP Server Central Station post</a>.
