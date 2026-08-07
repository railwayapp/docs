---
title: AI
description: Integrate Railway with AI assistants using plugins, connectors, Agent Skills, and the Railway MCP Server.
---

Railway provides tools for integrating with AI coding assistants, letting you manage your infrastructure through natural language.

## Integration options

### Railway Agent

The [Railway Agent](/ai/railway-agent) is a chat-based assistant built directly into the Railway dashboard. It can manage services, diagnose failing deployments, and open pull requests to fix issues in your code.

- Runs inside the Railway dashboard with no setup required
- Creates and configures services, variables, databases, and networking
- Automatically diagnoses failed deployments and proposes fixes

[Get started with the Railway Agent →](/ai/railway-agent)

### Context Sources

[Context Sources](/ai/context-sources) connect Notion, Linear, Sentry, and your own MCP servers to Railway's agents. Attach a source to a chat from the Context picker, and the agent can use its tools while it works.

- One-click connections for Notion, Linear, and Sentry, plus support for any custom MCP server
- Works in both the Railway Agent and dev.new
- Each connection is personal: it runs with the credentials of whichever member connected it

[Get started with Context Sources →](/ai/context-sources)

### Agent integrations

[Agent integrations](/ai/agent-integrations) bring the Railway Agent into your team chat on Slack and Discord. Mention **@Railway** to inspect deployments, read logs, and make changes without leaving the conversation.

- Install from your account settings with one click per platform
- Each teammate acts with their own Railway access; usage bills to the linked workspace
- Currently in beta

[Get started with agent integrations →](/ai/agent-integrations)

### Agent skills

[Agent Skills](/ai/agent-skills) are an open format for extending AI coding assistants with specialized knowledge about Railway. The `use-railway` skill guides AI agents to perform tasks like deploying services, managing environments, and querying metrics.

- Works with Claude Code, Cursor, OpenAI Codex, and OpenCode
- Install with a single command
- Covers project setup, deployments, networking, observability, and more

[Get started with Agent Skills →](/ai/agent-skills)

### Plugins and connectors

Railway provides [official plugins and connectors](/ai/plugins-and-connectors) for ChatGPT, Codex, Claude, Claude Code, Grok Build, and Cursor. These integrations package Railway workflows for each assistant and connect to the hosted Railway MCP server.

- Install from the plugin or connector directory built into your assistant
- Use the `use-railway` skill and hosted Railway MCP server from supported plugin hosts
- Connect Claude directly through Railway OAuth without a local CLI installation

[Get started with plugins and connectors →](/ai/plugins-and-connectors)

### MCP server

The [Railway MCP Server](/ai/mcp-server) implements the Model Context Protocol, enabling direct communication between AI assistants and your Railway infrastructure. Choose between the local server (runs through the Railway CLI) or the hosted remote server at `mcp.railway.com` (OAuth, no local install).

- One command to install: `railway mcp install` (add `--remote` for the hosted server)
- Create projects, deploy templates, manage environments, pull variables
- Works with Cursor, VS Code, Claude Code, Codex, Copilot, Factory Droid, OpenCode, Windsurf, Cline, and Devin

[Get started with MCP Server →](/ai/mcp-server)
