---
title: Grok Bot plugin
description: Install the Railway plugin for Grok Bot to deploy and manage Railway infrastructure through the hosted Railway MCP server.
---

The Railway plugin for Grok Bot packages the [`use-railway` skill](/ai/agent-skills#the-use-railway-skill) with Railway's [hosted MCP server](/ai/mcp-server). It connects to your Railway account through OAuth, so your bots can deploy, configure, monitor, and troubleshoot Railway infrastructure from a conversation.

## Install the plugin

Install Railway from the plugins directory in Grok Bot:

1. Launch Grok Bot.
2. Open the plugins UI.
3. Enter `railway` in the search field.
4. Click **Add** next to the Railway plugin in the results.

<Image
  src="/grok-bot/grok-bot-add-plugin.png"
  alt="The Grok Bot plugins UI with railway entered in the search field and the Railway plugin shown in the results with an Add button"
  layout="responsive"
  width={3680} height={2390} quality={100}
/>

## Authenticate with Railway

After adding the plugin, connect it to your Railway account. Authentication is handled by the Railway remote MCP server's OAuth flow.

1. Open the Railway plugin page in Grok Bot.
2. Under **Accounts**, click **Authenticate** next to the default account.
3. Complete the Railway OAuth flow when your browser opens.

<Image
  src="/grok-bot/grok-bot-authenticate.png"
  alt="The Railway plugin page in Grok Bot showing a default account marked Needs auth with an Authenticate button"
  layout="responsive"
  width={3680} height={2390} quality={100}
/>

To connect more than one Railway account, click **Add Another Account** and authenticate each one separately.

## Use Railway in Grok Bot

Ask a bot for the Railway outcome you want. Common use cases include:

- Create deployments of the applications you build
- Query performance data from the logs your applications collect
- Create routines in Grok that summarize application usage daily
- Coordinate releases between multiple bots

<Image
  src="/grok-bot/grok-bot-example.png"
  alt="A Grok Bot conversation where the bot pulls connection logs for the most recent Railway deployment and summarizes request counts, status codes, latency, and resource usage"
  layout="responsive"
  width={3680} height={2390} quality={100}
/>

## What's included

The Grok Bot plugin installs these components:

- The `use-railway` skill provides Railway-specific workflows for setup, deployment, configuration, and operations.
- The hosted Railway MCP server provides authenticated access to Railway projects and infrastructure.

## View the source

The Railway plugin is open-source in the <a href="https://github.com/railwayapp/railway-skills" target="_blank">Railway skills repository</a>.
