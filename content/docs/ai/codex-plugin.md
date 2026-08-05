---
title: Codex plugin
description: Install the Railway plugin for OpenAI Codex to deploy and manage Railway infrastructure with Agent Skills and hosted MCP.
---

The Railway plugin for <a href="https://openai.com/codex" target="_blank">OpenAI Codex</a> packages the [`use-railway` skill](/ai/agent-skills#the-use-railway-skill) with Railway's [hosted MCP server](/ai/mcp-server). It connects to your Railway account through OAuth and works from supported Codex plugin surfaces.

## Install the published plugin

ChatGPT and Codex use the same public plugin directory, so the Railway listing is available from either product.

1. Open the <a href="https://chatgpt.com/plugins/plugin_asdk_app_6a502589384081919c5decf93496c9d1" target="_blank">Railway plugin listing</a> from Codex.
2. Click the plus button to install the plugin.
3. Connect your Railway account when prompted.
4. Start a new task or session to use the plugin.

In Codex CLI, enter `/plugins` to open the plugin browser, find **Railway**, and install it from the public directory.

## Install from the source repository

Add the Railway marketplace when you want to use the version published directly from the source repository:

```bash
codex plugin marketplace add railwayapp/railway-skills
```

Start Codex, enter `/plugins`, select the Railway marketplace, and install the Railway plugin. Start a new session after installation so Codex can load the plugin's skills and tools.

## What's included

The Codex plugin installs these components:

- The `use-railway` skill provides Railway-specific workflows for setup, deployment, configuration, and operations.
- The hosted Railway MCP server provides authenticated access to Railway projects and infrastructure.

## View the source

The Railway Codex plugin is open-source in the <a href="https://github.com/railwayapp/railway-skills" target="_blank">Railway skills repository</a>.
