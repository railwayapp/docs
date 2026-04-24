---
title: AI
description: Integrate Railway with your AI coding assistants using Agent Skills, the Claude Code plugin, and the MCP Server.
---

Railway provides tools for integrating with AI coding assistants, letting you manage your infrastructure through natural language.

## Integration options

### Railway Agent

The [Railway Agent](/ai/railway-agent) is a chat-based assistant built directly into the Railway dashboard. It can manage services, diagnose failing deployments, and open pull requests to fix issues in your code.

- Runs inside the Railway dashboard with no setup required
- Creates and configures services, variables, databases, and networking
- Automatically diagnoses failed deployments and proposes fixes

[Get started with the Railway Agent →](/ai/railway-agent)

### Agent skills

[Agent Skills](/ai/agent-skills) are an open format for extending AI coding assistants with specialized knowledge about Railway. The `use-railway` skill guides AI agents to perform tasks like deploying services, managing environments, and querying metrics.

- Works with Claude Code, Cursor, OpenAI Codex, and OpenCode
- Install with a single command
- Covers project setup, deployments, networking, observability, and more

[Get started with Agent Skills →](/ai/agent-skills)

### Claude Code plugin

The [Railway plugin for Claude Code](/ai/claude-code-plugin) provides the `use-railway` agent skill, hooks, and supporting scripts through Claude Code's plugin marketplace.

- Install through the Claude Code plugin manager
- Includes hooks and scripts alongside the agent skill
- Auto-update support through the marketplace

[Get started with the Claude Code plugin →](/ai/claude-code-plugin)

### MCP server

The [Railway MCP Server](/ai/mcp-server) implements the Model Context Protocol, enabling direct communication between AI assistants and your Railway infrastructure.

- One-click installation for Cursor
- Create projects, deploy templates, manage environments
- Pull environment variables directly into your workflow

[Get started with MCP Server →](/ai/mcp-server)