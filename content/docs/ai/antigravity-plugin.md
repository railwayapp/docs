---
title: Antigravity plugin
description: Install the Railway plugin for Google Antigravity to manage Railway infrastructure with Agent Skills and hosted MCP.
---

The Railway plugin for Google Antigravity packages the [`use-railway` skill](/ai/agent-skills#the-use-railway-skill) with Railway's [hosted MCP server](/ai/mcp-server). It connects Antigravity to Railway workflows for deployments, configuration, monitoring, and troubleshooting.

## Install from the source repository

Clone the Railway skills repository, then install the plugin from its `plugins/railway` directory.

```bash
git clone https://github.com/railwayapp/railway-skills.git
agy plugin install ./railway-skills/plugins/railway
```

Run `agy plugin list` to confirm that `railway` is installed and enabled.

To install from the Antigravity app instead:

1. Click **Customizations** in the sidebar, then select **Plugins**.
2. Click **+ Install from URL**.
3. Enter the local path to `railway-skills/plugins/railway`.

Connect your Railway account when Antigravity prompts you to authenticate the Railway MCP server.

## Use Railway in Antigravity

Invoke the skill directly with `/use-railway`, or ask Antigravity to work with Railway:

- Deploy this app to Railway
- Check the Railway status for this project
- Debug my latest failed Railway deployment

## What's included

The Antigravity plugin installs these components:

- The `use-railway` skill provides Railway-specific workflows for setup, deployment, configuration, and operations.
- The hosted Railway MCP server provides authenticated access to Railway projects and infrastructure. Antigravity lists it as `railway-mcp`.

To configure the MCP server without the plugin, run `railway mcp install --agent antigravity`. See [`railway mcp`](/cli/mcp).

## View the source

The Railway Antigravity plugin is open-source in the <a href="https://github.com/railwayapp/railway-skills/tree/main/plugins/railway" target="_blank">Railway skills repository</a>.
