---
title: Claude connector
description: Connect Railway to Claude through OAuth and Railway's hosted MCP server.
---

The Railway connector gives Claude access to Railway projects and infrastructure through the [hosted Railway MCP server](/ai/mcp-server). It uses Railway OAuth and doesn't require the Railway CLI.

## Connect Railway to Claude

Add Railway from Claude's connectors directory:

1. Open the <a href="https://claude.ai/directory/connectors/railway" target="_blank">Railway connector listing</a>.
2. Click **Connect** or **Install**.
3. Follow the authentication prompts to connect your Railway account.
4. Start a conversation and ask Claude to use Railway.

Once connected, the Railway connector is available across supported Claude surfaces.

## Choose between the connector and Claude Code plugin

Use the integration that matches where you work:

- Use the Claude connector for direct access to Railway's hosted MCP tools from Claude.
- Use the [Claude Code plugin](/ai/claude-code-plugin) for terminal workflows that also need the `use-railway` skill, supporting scripts, and Railway hooks.

## Manage the connector

Manage or disconnect Railway from **Customize → Connectors** in Claude. The connector uses the access granted to your Railway account.
