---
title: Claude Code Plugin
description: Install the Railway plugin for Claude Code to manage your infrastructure with natural language.
---

The Railway plugin for <a href="https://claude.ai/code" target="_blank">Claude Code</a> provides skills, hooks, and tooling for managing Railway projects and deployments directly from your terminal.

The plugin is distributed through Claude Code's plugin marketplace system and installs the [`use-railway`](/ai/agent-skills#the-use-railway-skill) agent skill along with supporting scripts and hooks.

## Prerequisites

- <a href="https://claude.ai/code" target="_blank">Claude Code</a> installed (version 1.0.33 or later)
- The [Railway CLI](/cli) installed and authenticated

## Installation

<Steps>
  <Step title="Add the Railway marketplace">
    From within Claude Code, add the Railway plugin marketplace:

    ```bash
    /plugin marketplace add railwayapp/railway-skills
    ```

    This registers the Railway marketplace and makes the plugin available to install.
  </Step>
  <Step title="Install the plugin">
    Install the Railway plugin from the marketplace:

    ```bash
    /plugin install railway@railway-skills
    ```

    You can also browse and install through the interactive plugin manager by running `/plugin` and navigating to the **Discover** tab.
  </Step>
</Steps>

After installation, the plugin's skills are available in your Claude Code session. Ask your assistant to deploy services, check project status, manage environments, or perform any of the tasks covered by the [`use-railway` skill](/ai/agent-skills#the-use-railway-skill).

## Update the plugin

To update to the latest version, refresh the marketplace and reinstall:

```bash
/plugin marketplace update railway-skills
```

You can also enable auto-updates for the marketplace through the `/plugin` interface under the **Marketplaces** tab.

## What's included

The plugin installs the following components:

- **`use-railway` skill** - A route-first agent skill that covers project setup, deployments, troubleshooting, environment configuration, networking, observability, and more. See [Agent Skills](/ai/agent-skills) for the full list of capabilities. The skill includes action-oriented reference documents and a GraphQL API helper script for authenticated Railway API requests.
- **Auto-approve hook** - A `PreToolUse` hook that automatically approves Railway CLI commands and Railway API script calls, so Claude Code doesn't prompt for permission on every Railway operation.

## Alternative installation

If you prefer to install the agent skill without the Claude Code plugin system, you can use the general-purpose installer that works across multiple AI coding assistants:

```bash
curl -fsSL railway.com/skills.sh | bash
```

See [Agent Skills](/ai/agent-skills) for more details.

## Source

The Railway Claude Code plugin is open-source and available on <a href="https://github.com/railwayapp/railway-skills" target="_blank">GitHub</a>.
