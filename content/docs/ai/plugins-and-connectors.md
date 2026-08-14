---
title: Plugins and connectors
description: Choose a Railway integration for ChatGPT, Codex, Claude, Claude Code, Grok Build, or Cursor.
---

Railway provides official plugins and connectors that give AI assistants access to Railway workflows and infrastructure. Plugins can package the [`use-railway` skill](/ai/agent-skills#the-use-railway-skill) with the [hosted Railway MCP server](/ai/mcp-server), while connectors expose the hosted server directly.

## Choose an integration

Each integration has a dedicated setup guide:

- [ChatGPT plugin](/ai/chatgpt-plugin) for using Railway from ChatGPT Work.
- [Codex plugin](/ai/codex-plugin) for using Railway from Codex or Codex CLI.
- [Claude connector](/ai/claude-connector) for connecting Claude directly to Railway through OAuth.
- [Claude Code plugin](/ai/claude-code-plugin) for terminal workflows with the Railway skill and hooks.
- [Grok Build plugin](/ai/grok-build-plugin) for using Railway from xAI's coding agent.
- [Cursor plugin](/ai/cursor-plugin) for using Railway from Cursor.

**Note:** These integrations give an outside assistant access to Railway. For the reverse, giving Railway's own agent access to tools like Notion, Linear, or Sentry, see [Agent Connectors](/ai/agent-connectors).

## View the source

The Railway plugins, skill, hooks, and marketplace manifests are open-source in the <a href="https://github.com/railwayapp/railway-skills" target="_blank">Railway skills repository</a>.
