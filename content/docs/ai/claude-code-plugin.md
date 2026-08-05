---
title: Claude Code plugin
description: Install the Railway plugin for Claude Code to manage your infrastructure with natural language.
---

The Railway plugin for <a href="https://claude.ai/code" target="_blank">Claude Code</a> packages the [`use-railway` skill](/ai/agent-skills#the-use-railway-skill), Railway's hosted MCP server, supporting scripts, and hooks for managing Railway projects and deployments from your terminal.

Install the plugin from Anthropic's official marketplace, or install the version from the Railway source repository when you want to test repository changes directly.

## Prerequisites

Before installing the plugin, set up these requirements:

- <a href="https://claude.ai/code" target="_blank">Claude Code</a>
- A <a href="https://railway.com/login" target="_blank">Railway account</a>

The hosted MCP connection doesn't require the Railway CLI. Install and authenticate the [Railway CLI](/cli) when you want Claude Code to use local project context or CLI workflows.

## Install from the official marketplace

Install the published Railway plugin from Anthropic's official Claude Code marketplace:

```plaintext
/plugin install railway@claude-plugins-official
```

After installation, ask Claude Code to deploy a service, check project status, manage an environment, or perform another task covered by the [`use-railway` skill](/ai/agent-skills#the-use-railway-skill).

## Install from the source repository

Add the Railway marketplace and install its plugin to use the version published directly from the source repository:

```plaintext
/plugin marketplace add railwayapp/railway-skills
/plugin install railway@railway-skills
/reload-plugins
```

You can also browse the marketplace through `/plugin` and select the **Discover** tab.

## Update a source installation

Refresh the Railway marketplace to update an installation from the source repository:

```plaintext
/plugin marketplace update railway-skills
```

You can also enable auto-updates for the marketplace through `/plugin` under the **Marketplaces** tab.

## What's included

The Claude Code plugin installs these components:

- The `use-railway` skill provides workflows for project setup, deployments, troubleshooting, environment configuration, networking, observability, and more.
- The hosted Railway MCP server connects Claude Code to Railway through OAuth without depending on local CLI state.
- The auto-approve hook approves single Railway CLI and Railway API helper invocations that pass its shell safety checks.

## Install only the agent skill

Install the agent skill without the Claude Code plugin when you don't need the hosted MCP configuration or hooks:

```bash
railway skills install
```

See [Agent Skills](/ai/agent-skills) for installation options and the full list of capabilities.

## View the source

The Railway Claude Code plugin is open-source in the <a href="https://github.com/railwayapp/railway-skills" target="_blank">Railway skills repository</a>.
