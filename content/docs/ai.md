---
title: AI
description: Explore Cloud Agents, Railway Agent, and Railway's MCP server, skills, and plugins for your AI tools.
---

Run your coding agent on Railway, manage infrastructure through chat, or connect your favorite assistant to Railway's tools. Choose where you want to start.

<CardGrid columns={3}>
  <Card title="Cloud Agents" description="Your coding agent on a persistent Railway computer." href="#cloud-agents" icon="Monitor" />
  <Card title="Railway Agent" description="An assistant for your Railway infrastructure." href="#railway-agent" icon="Railway" />
  <Card title="MCP, Skills, Plugins" description="Railway tools for the assistant you already use." href="#mcp-skills-plugins" icon="Star" />
</CardGrid>

## Cloud Agents

Your coding agents, running on Railway. Give them a persistent development environment with your tools, credentials, and project files. Start sessions through the Railway CLI, or connect an app on your computer.

### Run agents in Railway

Launch and manage coding sessions from your terminal. Choose your agent, give it a task, and return to running sessions through `railway ca`.

<CloudAgentTools />

```bash
railway code --claude
```

[Start a terminal session →](/cloud-agents/terminal)

### Connect your local app

Use Railway as the remote environment for an app on your computer. These integrations prepare your connection so you can open a remote project and start working.

<CloudAgentClients />

[Choose your connection →](/cloud-agents/quickstart#choose-your-connection) · [Explore Cloud Agents](/cloud-agents)

## Railway Agent

The Railway Agent works directly in your dashboard. Ask it to inspect a deployment, configure a service, or investigate a failed build. It can propose code fixes and open pull requests for you to review.

[Get started with Railway Agent →](/ai/railway-agent)

Extend where it works and what it can access:

- **[Agent Connectors](/ai/agent-connectors)** bring Notion, Linear, Sentry, and your own MCP servers into a conversation.
- **[Slack and Discord](/ai/agent-integrations)** let your team mention Railway to inspect and manage projects from chat.

## MCP, Skills, Plugins

Give your existing assistant access to Railway. These integrations let it deploy applications, inspect projects, and manage infrastructure from the tools you already use.

- **[MCP server](/ai/mcp-server)** connects your assistant to Railway's hosted infrastructure tools.
- **[Agent Skills](/ai/agent-skills)** teach your coding assistant how to deploy and operate Railway.
- **[Plugins and connectors](/ai/plugins-and-connectors)** package Railway integrations for Claude, Codex, ChatGPT, Cursor, and more.

[Set up Railway for your assistant →](/agents)
