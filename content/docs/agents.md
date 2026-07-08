---
title: Railway for Agents
description: Set up Railway for AI coding agents — install the CLI, configure MCP, and add agent skills in one step.
---

Railway exposes a CLI, a local MCP server, a hosted remote MCP server, and an open agent skills format. AI coding agents can use any of them to deploy services, manage environments, and operate Railway on behalf of a user.

## Get set up

Install the Railway CLI and configure agent support — skills, MCP, and authentication — in one command. Toggle the options to tailor the command to what you want set up:

<AgentInstallCommand />


If you already have the Railway CLI installed:

```bash
railway setup agent
```

## Choose your integration

<CardGrid columns={2}>
  <Card
    title="Railway CLI"
    description="Deploys, environments, services, logs, and local development from the terminal."
    href="/cli"
    icon="Bash"
    tone="red"
  />
  <Card
    title="Railway MCP"
    description="Local stdio or hosted OAuth — toggle between modes on a single page. Works with Cursor, Claude Code, VS Code, Codex, Copilot, Droid, OpenCode, Windsurf, and more."
    href="/ai/mcp-server"
    icon="Monitor"
    tone="blue"
  />
  <Card
    title="Plugins"
    description="Plugin packages install Railway skills and MCP configuration together for tools with plugin marketplaces."
    href="/ai/plugins"
    icon="Folder"
    tone="yellow"
  />
  <Card
    title="Agent Skills"
    description="The use-railway skill teaches AI coding agents how to operate Railway. Works with Claude Code, Cursor, Codex, OpenCode, Copilot, and Factory Droid."
    href="/ai/agent-skills"
    icon="Star"
    tone="green"
  />
</CardGrid>

## When to use each

- **Railway MCP (Local)** — preferred for agent-native operations on a logged-in machine: project and service discovery, deployment status, bounded logs, variables, domains, templates, metrics, and scoped mutations.
- **Railway MCP (Remote)** — preferred when the user wants hosted OAuth MCP, or when local CLI configuration is unavailable. Also exposes the powerful `railway-agent` tool for multi-step operations.
- **Railway CLI** — preferred when the task depends on local machine state: current-directory deploys, `railway up`, `railway run`, SSH, and local linking.
- **Plugins** — preferred when your coding tool supports plugin marketplaces and you want host-managed installation for Railway skills and MCP configuration.
- **Agent Skills** — install alongside any of the above so agents arrive with Railway-specific procedural knowledge instead of guessing.
