---
title: Cloud agents quickstart
description: Choose between running a coding agent in Railway CA and connecting a local app, then launch your first task on a cloud agent.
---

Choose how you want to work: run a coding session through the Railway CLI, or connect an app on your computer. Railway prepares the cloud agent so you can choose a project on that machine and start a task.

## Prepare your computer

Enable **Cloud Agents** in [Priority Boarding](/platform/priority-boarding), and install the [Railway CLI](/cli#installing-the-cli). This installer also offers Railway tooling for your coding agents:

```bash
curl -fsSL agents.railway.com | sh
```

If you already have Railway installed, update it for the latest client integrations:

```bash
railway upgrade
```

Sign in and choose your defaults:

```bash
railway login
railway ca setup
```

Setup saves your default project, coding agent, skills preferences, and theme. A directory's linked project takes precedence over the default project. Use `--project` and `--environment` when you want to select the target explicitly.

Available local provider credentials can be carried to the agent; if there is no local sign-in to copy, sign in on the cloud agent when prompted. Railway Agent uses the Railway credentials already on the VM.

For a Desktop connection, install and open the app at least once before configuring it. For an OpenCode local terminal connection, Railway offers to install a missing client after you choose to connect.

## Choose your connection

First choose **Run agents in Railway** or **Connect your local app**, then select the coding agent or app. Both workflows execute coding tools and work with files on the cloud agent. Run the generated command on your computer:

<CloudAgentLauncher />

For terminal controls and reconnecting, see [terminal sessions](/cloud-agents/terminal). For local app setup, use [Claude Desktop](/cloud-agents/claude), [Codex Desktop](/cloud-agents/codex), [OpenCode](/cloud-agents/opencode), or [OpenCode2 Beta](/cloud-agents/opencode/beta).

## Give it a project

A new agent starts with a development environment and `/app` as its workspace. Your local source files are not automatically uploaded.

Open a shell on the agent, using the name printed by setup:

```bash
railway ca ssh <agent-name> -- bash
```

Clone your repository into its workspace. Replace `OWNER/REPOSITORY` with your repository:

```bash
cd /app
gh repo clone OWNER/REPOSITORY
```

Open `/app/REPOSITORY` in the connected desktop app, or change to it in your terminal session. You can also ask the coding agent to clone the repository for you.

For OpenCode2, the server uses the directory selected at startup. You can begin at `/app` and ask it to work in the cloned repository; see [Beta project directories](/cloud-agents/opencode/beta#project-directory) before changing the server's directory.

## Start a task

Give the agent a bounded first task, for example:

```text
Read this repository, explain how to run it, and run its existing tests.
Summarize any failures before changing code.
```

You are working on the Railway machine's filesystem. To confirm the connection, ask the agent to **run** `hostname` and `pwd` in its terminal and report the output. Check the selected remote environment or project in your desktop app as well.

## Return to your work

Closing a client keeps the cloud agent running. Reopen the remote project in your desktop app, use `railway ca` to reconnect to a running terminal session, or reconnect an OpenCode terminal client:

<CodeBlock>
  <CodeTab label="OpenCode" lang="bash">{"railway code --opencode connect <agent-name>"}</CodeTab>
  <CodeTab label="OpenCode2 Beta" lang="bash">{"railway code --opencode2 connect <agent-name>"}</CodeTab>
</CodeBlock>

## Stop compute when you're finished

```bash
railway ca sleep <agent-name>
```

Sleep retains files and stops running processes, including terminal sessions. For a Railway CA session, wake the agent with `railway ca wake <agent-name>`, then start a new session through `railway ca`. For Claude or Codex Desktop, wake the agent before reconnecting. For an OpenCode local app, rerun its Desktop setup or named `connect` command to wake the agent and restart its server.

[Manage agents and sessions →](/cloud-agents/manage)
