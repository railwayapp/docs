---
title: Railway for Agents
description: Set up Railway for AI coding agents — install the CLI, configure MCP, and add agent skills in one step.
---

Railway exposes a CLI, a local MCP server, a hosted remote MCP server, and an open agent skills format. AI coding agents can use any of them to deploy services, manage environments, and operate Railway on behalf of a user.

## Get set up

Install the Railway CLI and configure agent support — skills, MCP, and authentication — in one command:

```bash
bash <(curl -fsSL cli.new) --agents -y
```

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
    description="Local MCP server that runs through the Railway CLI. Best for agent operations on a logged-in machine."
    href="/ai/mcp-server"
    icon="Monitor"
    tone="blue"
  />
  <Card
    title="Remote MCP"
    description="Hosted MCP server at mcp.railway.com. Browser OAuth, no local CLI required."
    href="/ai/remote-mcp-server"
    icon="LinkSquare"
    tone="purple"
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

- **Local MCP** — preferred for agent-native operations: project and service discovery, deployment status, bounded logs, variables, domains, templates, metrics, and scoped mutations.
- **Railway CLI** — preferred when the task depends on local machine state: current-directory deploys, `railway up`, `railway run`, SSH, and local linking.
- **Remote MCP** — preferred when the user wants hosted OAuth MCP, or when local CLI configuration is unavailable.
- **Agent Skills** — install alongside any of the above so agents arrive with Railway-specific procedural knowledge instead of guessing.
