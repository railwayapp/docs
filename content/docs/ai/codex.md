---
title: OpenAI Codex
description: Install and use the Railway plugin for OpenAI Codex.
---

OpenAI Codex can use Railway through the Railway plugin. The plugin packages the `use-railway` skill and Railway MCP configuration so Codex can deploy, configure, monitor, and troubleshoot Railway projects.

## What the plugin includes

The Railway Codex plugin is packaged from the [Railway skills repository](https://github.com/railwayapp/railway-skills). It includes:

- The [`use-railway` skill](/ai/agent-skills#the-use-railway-skill)
- Railway MCP configuration that starts `railway mcp`
- Codex plugin metadata for marketplace discovery

The plugin-provided MCP configuration uses the local [Railway CLI](/cli). Install and authenticate the CLI before using Railway MCP tools in Codex.

## Install the plugin

When Railway is available in your Codex plugin library:

1. Open Codex.
2. Select **Plugins**.
3. Browse the plugin library.
4. Search for Railway.
5. Install the Railway plugin.

After installation, ask Codex to deploy services, check project status, inspect logs, configure variables, or perform any workflow covered by the `use-railway` skill.

## Example prompts

Use natural language prompts that describe the Railway task you want Codex to perform:

```plaintext
Deploy this app to Railway.
```

```plaintext
Check the Railway status for this project.
```

```plaintext
Debug the latest Railway deployment.
```

## Use Codex without the plugin

Plugins are optional. If Railway isn't available in your Codex plugin library, use [Railway for Agents](/agents) to configure Codex with Railway skills and MCP through the CLI-managed setup flow.

Use one setup path for Codex at a time. Plugin installs and CLI-managed setup can both write Railway skill or MCP configuration.

## Source

The Railway Codex plugin is open-source and available on [GitHub](https://github.com/railwayapp/railway-skills).
