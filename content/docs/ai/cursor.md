---
title: Cursor
description: Install and use the Railway plugin for Cursor.
---

Cursor can use Railway through the Railway plugin. The plugin packages the `use-railway` skill and Cursor MCP configuration so Cursor can deploy, configure, monitor, and troubleshoot Railway projects.

## What the plugin includes

The Railway Cursor plugin is packaged from the [Railway skills repository](https://github.com/railwayapp/railway-skills). It includes:

- The [`use-railway` skill](/ai/agent-skills#the-use-railway-skill)
- Cursor MCP configuration that starts `railway mcp`
- Cursor plugin metadata for marketplace discovery

The plugin-provided MCP configuration uses the local [Railway CLI](/cli). Install and authenticate the CLI before using Railway MCP tools in Cursor.

## Install from Cursor Marketplace

When Railway is listed in the Cursor Marketplace:

1. Open the marketplace panel in Cursor.
2. Search for Railway.
3. Install the Railway plugin.

After installation, ask Cursor to deploy services, check project status, inspect logs, configure variables, or perform any workflow covered by the `use-railway` skill.

## Distribute through a team marketplace

Teams and Enterprise admins can distribute Railway from the GitHub repository as a team marketplace:

1. Open the Cursor dashboard.
2. Go to **Settings**.
3. Open **Plugins**.
4. In **Team Marketplaces**, click **Import**.
5. Paste `https://github.com/railwayapp/railway-skills`.
6. Review the parsed `railway` plugin.
7. Optional: Set team access groups.
8. Name and save the marketplace.
9. Install the plugin from Cursor's marketplace panel, or mark it as required for a distribution group.

## Example prompts

Use natural language prompts that describe the Railway task you want Cursor to perform:

```plaintext
Deploy this app to Railway.
```

```plaintext
Add a Postgres database to this Railway project.
```

```plaintext
Check the latest deployment logs and diagnose the failure.
```

## Use Cursor without the plugin

Plugins are optional. If Railway isn't available in Cursor, use [Railway for Agents](/agents) to configure Cursor with Railway skills and MCP through the CLI-managed setup flow.

Use one setup path for Cursor at a time. Plugin installs and CLI-managed setup can both write Railway skill or MCP configuration.

## Source

The Railway Cursor plugin is open-source and available on [GitHub](https://github.com/railwayapp/railway-skills).
