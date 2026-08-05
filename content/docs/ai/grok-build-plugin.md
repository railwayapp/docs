---
title: Grok Build plugin
description: Install the Railway plugin for Grok Build from xAI's official plugin marketplace.
---

The Railway plugin for Grok Build packages the [`use-railway` skill](/ai/agent-skills#the-use-railway-skill), Railway's [hosted MCP server](/ai/mcp-server), and Railway workflow hooks. Railway publishes the plugin through the <a href="https://github.com/xai-org/plugin-marketplace" target="_blank">official xAI plugin marketplace</a>.

## Install the plugin

Install Railway from the marketplace in Grok Build:

1. Run `grok` to start an interactive session.
2. Enter `/marketplace` to open the extensions modal at the **Marketplace** tab.
3. Select **Railway**.
4. Click **Install**.
5. Connect your Railway account when Grok prompts you to authenticate.

## What's included

The Grok Build plugin installs these components:

- The `use-railway` skill provides Railway-specific workflows for setup, deployment, configuration, and operations.
- The hosted Railway MCP server provides authenticated access to Railway projects and infrastructure.
- Railway hooks support safety-checked Railway CLI and API helper workflows.

## View the source

The official xAI marketplace entry installs the Railway plugin from the <a href="https://github.com/railwayapp/railway-skills/tree/main/plugins/railway" target="_blank">Railway skills repository</a> at a pinned commit.
