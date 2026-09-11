---
title: Cloud agents
description: Run coding agents in Railway or connect your local app to a persistent development environment. Launch terminal sessions, connect Desktop, and return to your work.
---

<Banner variant="primary">Cloud agents are available through <a href="/platform/priority-boarding">Priority Boarding</a>. Breaking changes may occur.</Banner>

Your coding agents, running on Railway. Give them a persistent development environment with your tools, credentials, and project files. Start sessions through the Railway CLI, or connect an app on your computer.

Railway prepares the environment and carries available coding-agent credentials from your machine. Your files stay on the agent's disk, and the machine stays running when you disconnect. Sleep it when you're done and wake it when you're ready to work again.

## Run agents in Railway

Launch a coding agent directly on the Railway machine and work with it through your terminal. Browse your agents, start sessions, and return to running work in Railway CA.

<CloudAgentTools />

```bash
railway code --claude
```

Use `railway ca` to choose an agent interactively or return to a session. OpenCode and OpenCode2 use `railway code --opencode remote` and `railway code --opencode2 remote` to run both client and server on the machine.

[Start a terminal session →](/cloud-agents/terminal)

## Connect your local app

Keep using an app on your computer, with Railway as its remote environment. Claude Desktop, Codex Desktop, and OpenCode have dedicated setup flows for connecting to the cloud agent.

<CloudAgentClients />

OpenCode supports both Desktop and local terminal clients, including [OpenCode2 Beta](/cloud-agents/opencode/beta).

[Choose your connection →](/cloud-agents/quickstart#choose-your-connection)

## How cloud agents work

Each cloud agent is a personal virtual machine in a Railway project environment. In both workflows, coding tools execute and edit files on that machine. You choose whether to use a session in Railway CA or a connected local app.

<CloudAgentConnection app="Your terminal or desktop app" transport="SSH or HTTPS" />

Railway CA terminal sessions and Claude and Codex Desktop connections use SSH. OpenCode Desktop and local terminal clients connect to an authenticated HTTPS server on the agent.

The disk lasts for the life of the agent. Closing a connection keeps the VM running. Sleeping stops its processes and compute billing while retaining files; deleting the agent removes its disk. See [manage agents and sessions](/cloud-agents/manage).

Agents hold your credentials and are owned by you. Normal CLI discovery and connection pickers show your own agents. Administrative listing of other members' agents is separate from connecting to their sessions.

## What's on the machine

Agents use an Ubuntu development image with coding tools, an authenticated Railway CLI and GitHub CLI, and a full development toolchain:

- Claude Code, Codex, Grok CLI, Railway Agent, and OpenCode; [OpenCode2 Beta](/cloud-agents/opencode/beta) downloads its runtime when first started.
- Git and GitHub CLI access using the GitHub credential available to the agent.
- Node.js with pnpm and yarn, Python with uv, and `mise` for additional toolchains.
- Utilities including ripgrep, jq, PostgreSQL tools, SQLite, build tools, and Chromium.

Sessions start in `/app`. Clone a repository there or choose another remote directory in your connection setup. Launching from a local repository selects context and eligible configuration to carry; it does not upload your repository files.

### Additional installed tools

The image also includes pi, Cursor CLI, and Factory Droid. Run them from a shell and complete their own sign-in flows. These tools are separate from the Railway CLI's integrated launch choices; see [additional installed tools](/cloud-agents/terminal#additional-installed-tools).

## Quick start

Follow the [interactive quickstart](/cloud-agents/quickstart) to install the CLI, choose how you want to work, and get the right launch command. Railway creates or wakes an agent and prepares the selected coding tool. Add `--new` to your launch command when you want a fresh VM.

## Keep working across connections

Use a cloud agent for a refactor, a long test run, or a workspace you want to return to from a desktop app. Sessions started in Railway CA survive a terminal disconnect. OpenCode's managed server continues running after its client disconnects. Desktop apps manage their own chat and reconnection behavior.

When you're finished, stop compute with the agent name printed during setup:

```bash
railway ca sleep <agent-name>
```

Sleeping ends running processes and terminal sessions. Files and saved conversation history remain on disk; launch a new process when you return.

## Serve traffic from an agent

Each agent has a public HTTPS domain serving port `8080`, available inside the VM as `RAILWAY_PUBLIC_DOMAIN`. The domain remains the same across sleep and wake.

OpenCode's managed server uses this port. To serve another app there, use a separate agent or stop the managed OpenCode server first. Setup refuses to replace an unrelated process on the port.

Deploy a [Railway service](/services) for production traffic.

## Pricing

A running agent bills for compute while it is awake, including when no client is connected. Sleeping stops compute billing and keeps the disk. Coding-provider usage follows your provider's account or API billing separately.

See [VM pricing](/pricing/plans#vm-pricing) for current rates, and [manage agents](/cloud-agents/manage#sleep-wake-and-delete) for lifecycle commands.

## Specs and limits

VM size follows your workspace plan and isn't configurable:

| Plan | vCPU | Memory |
|------|------|--------|
| Trial | 2 | 1 GB |
| Free | 2 | 1 GB |
| Hobby | 2 | 2 GB |
| Pro | 4 | 4 GB |

Enterprise workspaces use Pro sizing. Creation is limited to 25 agents per user per day.

## Explore cloud agents

- [Quickstart](/cloud-agents/quickstart): choose your workflow, connect, and do your first task.
- [Terminal sessions](/cloud-agents/terminal): launch coding agents in Railway CA and return to running work.
- [Manage agents and sessions](/cloud-agents/manage): select projects, create agents, reconnect, sleep, and delete.
- [Credentials and configuration](/cloud-agents/configuration): carry sign-ins, skills, MCP configuration, and variables.
- [Troubleshooting](/cloud-agents/troubleshooting): diagnose connection, startup, and provider sign-in issues.
- CLI references: [`railway ca`](/cli/ca) and [`railway code`](/cli/code).
