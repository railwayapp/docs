---
title: Railway for Agents
description: Set up Railway for AI coding agents — install the CLI, configure MCP, and add agent skills in one step.
---

Railway exposes a CLI, a hosted MCP server, and an open agent skills format. AI coding agents can use any of them to deploy services, manage environments, and operate Railway on behalf of a user.

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
    description="Connect through the CLI or OAuth. Works with Cursor, Claude Code, VS Code, Codex, Copilot, Droid, OpenCode, Windsurf, and more."
    href="/ai/mcp-server"
    icon="Monitor"
    tone="blue"
  />
  <Card
    title="Agent Skills"
    description="The use-railway skill teaches AI coding agents how to operate Railway. Works with Claude Code, Cursor, Codex, OpenCode, Copilot, and Factory Droid."
    href="/ai/agent-skills"
    icon="Star"
    tone="green"
  />
  <Card
    title="Cloud agents"
    description="Run Claude Code, Codex, or Grok CLI on a persistent Railway VM with your own credentials. Launch from the terminal and reconnect to sessions later."
    href="/cloud-agents"
    icon="Bash"
    tone="purple"
  />
</CardGrid>

## When to use each

- **Railway MCP** — preferred for agent-native operations. The `railway mcp` command connects to `mcp.railway.com` and reuses your `railway login` credentials, and editors that support OAuth can connect directly without the CLI. Exposes the powerful `railway-agent` tool for multi-step operations. (An in-process local server, `railway mcp local`, exists for machines that can't reach `mcp.railway.com`.)
- **Railway CLI** — preferred when the task depends on local machine state: current-directory deploys, `railway up`, `railway run`, SSH, and local linking.
- **Agent Skills** — install alongside any of the above so agents arrive with Railway-specific procedural knowledge instead of guessing.
- **Cloud agents** are preferred when the work should outlive the local terminal: a persistent VM running the coding agent, with sessions you can leave and reattach to.
