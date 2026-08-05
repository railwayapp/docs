---
title: Cursor plugin
description: Install the Railway plugin for Cursor to manage Railway infrastructure with Agent Skills and hosted MCP.
---

The Railway plugin for Cursor packages the [`use-railway` skill](/ai/agent-skills#the-use-railway-skill) with Railway's [hosted MCP server](/ai/mcp-server). It connects Cursor to Railway workflows for deployments, configuration, monitoring, and troubleshooting.

## Install from the Cursor Marketplace

Install Railway from the <a href="https://cursor.com/marketplace/railway" target="_blank">Cursor Marketplace</a>:

```plaintext
/add-plugin railway
```

Connect your Railway account when Cursor prompts you to authenticate.

## Install from the source repository

Add the Railway repository as a plugin source when you want to use the version published directly from source:

1. Open **Settings** in Cursor.
2. Select **Plugins**.
3. Enter `https://github.com/railwayapp/railway-skills` in **Search or Paste Link**.
4. Select the Railway plugin.
5. Click **Add to Cursor**.

## What's included

The Cursor plugin installs these components:

- The `use-railway` skill provides Railway-specific workflows for setup, deployment, configuration, and operations.
- The hosted Railway MCP server provides authenticated access to Railway projects and infrastructure.

## View the source

The Railway Cursor plugin is open-source in the <a href="https://github.com/railwayapp/railway-skills" target="_blank">Railway skills repository</a>.
