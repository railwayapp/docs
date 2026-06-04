---
title: Plugins
description: Install Railway plugins for AI coding tools such as Claude Code, OpenAI Codex, and Cursor.
---

Railway plugins package Railway agent skills and MCP configuration for AI coding tools that support plugin marketplaces. Use a plugin when you want the host tool to manage Railway's skill and MCP setup as one installable package.

## Supported plugins

The [Railway skills repository](https://github.com/railwayapp/railway-skills) packages Railway for the following plugin hosts:

| Tool | Plugin support | Guide |
|------|----------------|-------|
| Claude Code | Claude Code plugin marketplace | [Claude Code plugin](/ai/claude-code-plugin) |
| OpenAI Codex | Codex plugin manifest | [OpenAI Codex](/ai/codex) |
| Cursor | Cursor plugin manifest and team marketplace support | [Cursor](/ai/cursor) |

Each plugin uses the same `use-railway` skill. The skill gives agents Railway-specific guidance for project setup, deployments, troubleshooting, variables, networking, observability, and docs lookup.

## What plugins include

Railway plugin packages install the Railway agent surface into the host tool. The exact files depend on the host, but the package can include:

- The [`use-railway` skill](/ai/agent-skills#the-use-railway-skill)
- Railway MCP configuration that starts `railway mcp`
- Host-specific plugin metadata for marketplace discovery
- Supporting scripts and hooks where the host supports them

The MCP configuration runs through the local [Railway CLI](/cli). Install and authenticate the CLI before using plugin-provided MCP tools.

## Choose a plugin

Use the page for your AI coding tool:

- [Claude Code plugin](/ai/claude-code-plugin) explains the Claude Code marketplace install flow.
- [OpenAI Codex](/ai/codex) explains how the Railway Codex plugin is packaged and installed.
- [Cursor](/ai/cursor) explains Cursor marketplace and team marketplace installation.

## Use skills or MCP without plugins

Plugins are optional. If your tool doesn't support plugins, or you prefer CLI-managed setup, use [Railway for Agents](/agents). That page covers the `railway setup agent` flow for installing skills, configuring MCP, and checking Railway authentication.

Use one setup path for a tool at a time. Plugin installs and CLI-managed setup can both write skill or MCP configuration for the same host.
