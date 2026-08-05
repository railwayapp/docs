---
title: ChatGPT plugin
description: Install the Railway plugin for ChatGPT to deploy and manage Railway infrastructure through the hosted Railway MCP server.
---

The Railway plugin for ChatGPT packages the [`use-railway` skill](/ai/agent-skills#the-use-railway-skill) with Railway's [hosted MCP server](/ai/mcp-server). It connects to your Railway account through OAuth, so ChatGPT can access Railway tools without the Railway CLI.

## Install the plugin

The Railway plugin is available through the public plugin directory shared by ChatGPT and Codex.

1. Open the <a href="https://chatgpt.com/plugins/plugin_asdk_app_6a502589384081919c5decf93496c9d1" target="_blank">Railway plugin listing</a> in ChatGPT Work.
2. Click the plus button to install the plugin.
3. Connect your Railway account when prompted.
4. Start a new chat to use the plugin.

## Use Railway in ChatGPT

Ask ChatGPT for the Railway outcome you want, such as deploying an application, checking deployment status, or investigating logs. ChatGPT selects the Railway plugin when it matches your request.

To select the plugin explicitly, type `@` in the prompt and choose **Railway**.

## What's included

The ChatGPT plugin installs these components:

- The `use-railway` skill provides Railway-specific workflows for setup, deployment, configuration, and operations.
- The hosted Railway MCP server provides authenticated access to Railway projects and infrastructure.

## View the source

The Railway plugin is open-source in the <a href="https://github.com/railwayapp/railway-skills" target="_blank">Railway skills repository</a>.
