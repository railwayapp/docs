---
title: Railway MCP Server (Experimental)
description: Learn about the official Railway MCP (Model Context Protocol) server and how to use it.
---


The [Railway MCP Server](https://github.com/railwayapp/railway-mcp-server) is a [Model Context Protocol (MCP)](https://modelcontextprotocol.org) server that enables natural language interaction with your Railway projects and infrastructure.

With this server, you can ask your IDE or AI assistant to create projects, deploy templates, create/select environments, or pull environment variables.


> 🚨 The Railway MCP Server is **highly experimental**. Expect bugs and missing features. By design, destructive actions (e.g., deleting services or environments) are excluded, but you should still carefully review any tool executions before running them.

The Railway MCP Server is open-source and available on [GitHub](https://github.com/railwayapp/railway-mcp-server).

## Understanding MCP and Railway MCP Server

The **Model Context Protocol (MCP)** defines a standard for how AI applications (hosts) can interact with external tools and data sources through a client-server architecture.

* **Hosts**: Applications such as Cursor, VS Code, Claude Desktop, or Windsurf that connect to MCP servers.
* **Clients**: The layer within hosts that maintains one-to-one connections with individual MCP servers.
* **Servers**: Standalone programs (like the Railway MCP Server) that expose tools and workflows for managing external systems.

The **Railway MCP Server** acts as the server in this architecture, translating natural language requests into CLI workflows powered by the [Railway CLI](/guides/cli).

## Prerequisites

To get started with the MCP server, you need to have the [Railway CLI](/guides/cli) installed and authenticated.

## Installation

### Cursor

You can one-click install the MCP server in Cursor by clicking the "Add to Cursor" button below:

[![Install MCP Server](https://cursor.com/deeplink/mcp-install-dark.svg)](https://cursor.com/en/install-mcp?name=Railway&config=eyJjb21tYW5kIjoibnB4IC15IEByYWlsd2F5L21jcC1zZXJ2ZXIifQ%3D%3D)

Alternatively, you can add the following configuration to your `.cursor/mcp.json` file manually:

```json
{
  "mcpServers": {
    "Railway": {
      "command": "npx",
      "args": ["-y", "@railway/mcp-server"]
    }
  }
}
```

### VS Code

Add the following configuration to your `.vscode/mcp.json` file:

```json
{
  "servers": {
    "Railway": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@railway/mcp-server"]
    }
  }
}
```


### Claude Code

To install the MCP server in Claude Code, you can use the following command:

```bash
claude mcp add Railway npx @railway/mcp-server
```


## Example Usage

* **Create and deploy a new app**

  ```text
  Create a Next.js app in this directory and deploy it to Railway.
  Also assign it a domain.
  ```

* **Deploy from a template**

  ```text
  Deploy a Postgres database
  ```

  ```text
  Deploy a single node ClickHouse database
  ```

* **Pull environment variables**

  ```text
  Pull environment variables for my project and save them to a .env file
  ```

* **Create a new environment**

  ```text
  Create a development environment called `development` 
  cloned from production and set it as linked
  ```

## Available MCP Tools

The Railway MCP Server provides a curated set of tools. Your AI assistant will automatically call these tools based on the context of your request.

* **Status**

  * `check-railway-status` — Verify CLI installation and authentication

* **Project Management**

  * `list-projects` — List all projects
  * `create-project-and-link` — Create a project and link it to the current directory

* **Service Management**

  * `list-services` — List project services
  * `link-service` — Link a service to the current directory
  * `deploy` — Deploy a service
  * `deploy-template` — Deploy from the [Railway Template Library](https://railway.com/deploy)

* **Environment Management**

  * `create-environment` — Create a new environment
  * `link-environment` — Link environment to current directory

* **Configuration & Variables**

  * `list-variables` — List environment variables
  * `set-variables` — Set environment variables
  * `generate-domain` — Generate a Railway domain

* **Monitoring & Logs**

  * `get-logs` — Retrieve service logs

## Security Considerations

Under the hood, the Railway MCP Server runs the [Railway CLI](/guides/cli) commands. While destructive operations are intentionally excluded and not exposed as MCP tools, you should still:

* **Review actions** requested by the LLM before running them.
* **Restrict access** to ensure only trusted users can invoke the MCP server.
* **Avoid production risks** by limiting usage to local development and non-critical environments.

## Feature requests

The Railway MCP Server is a work in progress. We are actively working on adding more tools and features. If you have a feature request, leave your feedback on this [Central Station](https://station.railway.com/feedback/model-context-protocol-for-railway-railw-c040b796) post.