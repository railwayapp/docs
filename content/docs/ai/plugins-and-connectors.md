---
title: Plugins and connectors
description: Install Railway integrations for ChatGPT, Codex, Claude, Claude Code, Grok Build, and Cursor.
---

Railway provides official plugins and connectors that give AI assistants access to Railway workflows and infrastructure. Plugins pair the [`use-railway` skill](/ai/agent-skills#the-use-railway-skill) with the [hosted Railway MCP server](/ai/mcp-server), while connectors expose the hosted server directly.

## Install the ChatGPT and Codex plugin

ChatGPT and Codex share one Railway plugin listing. The plugin includes the `use-railway` skill and the hosted Railway MCP server.

1. Open the <a href="https://chatgpt.com/plugins/plugin_asdk_app_6a502589384081919c5decf93496c9d1" target="_blank">Railway plugin listing</a> from a supported ChatGPT or Codex surface.
2. Select the plus button to install the plugin.
3. Connect your Railway account when prompted.
4. Start a new chat or task to use the plugin.

To install the version from the Railway source repository in Codex, add `railwayapp/railway-skills` as a marketplace source from **Plugins → More → Add more**.

## Connect Railway to Claude

The Railway connector gives Claude access to the hosted Railway MCP server. It uses Railway OAuth and doesn't require the Railway CLI on your computer.

Open the <a href="https://claude.ai/directory/connectors/railway" target="_blank">Railway connector in Claude's directory</a>, then follow the prompts to add the connector and authenticate your Railway account.

Use the Claude Code plugin when you work from the terminal and want the `use-railway` skill and Railway hooks in addition to the hosted MCP connection.

## Install the Claude Code plugin

The Railway plugin for <a href="https://claude.ai/code" target="_blank">Claude Code</a> includes the `use-railway` skill, the hosted Railway MCP server, supporting scripts, and a safety-checked auto-approve hook for single Railway CLI and API helper invocations.

Install the published plugin from Anthropic's official marketplace:

```plaintext
/plugin install railway@claude-plugins-official
```

To install the version from the Railway source repository instead, add its marketplace and install the plugin:

```plaintext
/plugin marketplace add railwayapp/railway-skills
/plugin install railway@railway-skills
/reload-plugins
```

After installation, ask Claude Code to deploy a service, check project status, manage an environment, or perform another task covered by the [`use-railway` skill](/ai/agent-skills#the-use-railway-skill).

See the [Claude Code plugin guide](/ai/claude-code-plugin) for prerequisites, source marketplace installation, updates, and the full list of included components.

## Install the Grok Build plugin

Railway is published in the <a href="https://github.com/xai-org/plugin-marketplace" target="_blank">official xAI plugin marketplace</a>. The Grok Build plugin includes the `use-railway` skill and the hosted Railway MCP server.

1. Run `grok`.
2. Open the extensions modal with `/plugins`.
3. Select the **Marketplace** tab.
4. Select `railway`.
5. Press `i` to install the plugin.

## Install the Cursor plugin

The Railway plugin for Cursor includes the `use-railway` skill and the hosted Railway MCP server. Install it from the <a href="https://cursor.com/marketplace/railway" target="_blank">Cursor Marketplace</a>:

```plaintext
/add-plugin railway
```

To install the version from the Railway source repository instead, open **Settings → Plugins**, paste `https://github.com/railwayapp/railway-skills` into **Search or Paste Link**, and click **Add to Cursor**.

## View the source

The Railway plugins, skill, hooks, and marketplace manifests are open-source in the <a href="https://github.com/railwayapp/railway-skills" target="_blank">Railway skills repository</a>.
