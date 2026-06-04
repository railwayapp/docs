---
title: AI
description: Integrate Railway with your AI coding assistants using the Railway Agent, plugins, Agent Skills, and the MCP Server.
---

Railway provides tools for integrating with AI coding assistants, letting you manage your infrastructure through natural language.

## Integration options

### Railway Agent

The [Railway Agent](/ai/railway-agent) is a chat-based assistant built directly into the Railway dashboard. It can manage services, diagnose failing deployments, and open pull requests to fix issues in your code.

- Runs inside the Railway dashboard with no setup required
- Creates and configures services, variables, databases, and networking
- Automatically diagnoses failed deployments and proposes fixes

[Get started with the Railway Agent →](/ai/railway-agent)

### Plugins

[Railway plugins](/ai/plugins) package agent skills and MCP configuration for AI coding tools that support plugin marketplaces.

- Supports Claude Code, OpenAI Codex, and Cursor
- Includes the `use-railway` skill and MCP configuration
- Provides tool-specific setup for [Codex](/ai/codex) and [Cursor](/ai/cursor)

[Get started with plugins →](/ai/plugins)

### Agent skills

[Agent Skills](/ai/agent-skills) are an open format for extending AI coding assistants with specialized knowledge about Railway. The `use-railway` skill guides AI agents to perform tasks like deploying services, managing environments, and querying metrics.

- Works with Claude Code, Cursor, OpenAI Codex, and OpenCode
- Install with a single command
- Covers project setup, deployments, networking, observability, and more

[Get started with Agent Skills →](/ai/agent-skills)

### MCP server

The [Railway MCP Server](/ai/mcp-server) implements the Model Context Protocol, enabling direct communication between AI assistants and your Railway infrastructure. Choose between the local server (runs through the Railway CLI) or the hosted remote server at `mcp.railway.com` (OAuth, no local install).

- One command to install: `railway mcp install` (add `--remote` for the hosted server)
- Create projects, deploy templates, manage environments, pull variables
- Works with Cursor, VS Code, Claude Code, Codex, Copilot, Factory Droid, OpenCode, Windsurf, Cline, and Devin

[Get started with MCP Server →](/ai/mcp-server)
