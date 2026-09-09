---
title: Terminal sessions
description: Run Claude Code, Codex, Grok, Railway Agent, OpenCode, or OpenCode2 Beta inside a Railway cloud agent and manage sessions from your terminal.
---

Launch a coding agent directly on a Railway cloud agent and work with it through your terminal. Railway CA gives you one place to browse your machines, start sessions, and return to work that's still running.

The coding agent and its terminal interface run on the Railway machine. Your computer connects over SSH; your code, tools, and session processes stay on the cloud agent.

## Start a session

Follow the [quickstart prerequisites](/cloud-agents/quickstart#prepare-your-computer) to enable Cloud Agents, install the Railway CLI, and sign in. Then choose a coding agent:

<CloudAgentTools />

| Coding agent | Launch command |
|--------------|----------------|
| Claude Code | `railway code --claude` |
| Codex | `railway code --codex` |
| Grok | `railway code --grok` |
| Railway Agent | `railway code --railway` |
| OpenCode | `railway code --opencode remote` |
| OpenCode2 Beta | `railway code --opencode2 remote` |

Railway creates or reuses a cloud agent, carries available credentials, and opens the session in Railway CA. Add `--new` to start with a fresh machine and disk:

```bash
railway code --claude --new
```

Railway Agent uses the Railway credentials already on the machine. Other coding agents can use eligible sign-ins from your computer or ask you to authenticate on the agent. See [credentials and configuration](/cloud-agents/configuration).

OpenCode's `remote` action runs both its client and server on the cloud agent. Without `remote`, the command prepares a server and offers to connect a client on your computer. [OpenCode2 Beta](/cloud-agents/opencode/beta) downloads its runtime on first startup, which can take several minutes.

## Choose an agent interactively

Open the Railway CA menu to browse machines and sessions or start a new one:

```bash
railway ca
```

The launch picker includes the coding agents above and a shell. On the OpenCode option, press **Tab** to switch between standard OpenCode and OpenCode2 Beta.

Save your default coding agent, project, and skills preferences with:

```bash
railway ca setup
```

Running `railway code` without an agent flag uses that preference. If OpenCode is your default, it offers the local-client flow; use an explicit `--opencode remote` or `--opencode2 remote` command for a session inside Railway CA.

## Work with a repository

A new machine starts in `/app`. You can ask the coding agent to clone a repository and work in it, or open a shell:

```bash
railway ca ssh <agent-name> -- bash
```

Then clone your project:

```bash
cd /app
gh repo clone OWNER/REPOSITORY
```

Launching from a local repository does not upload its source files. See [give it a project](/cloud-agents/quickstart#give-it-a-project) for the first-task walkthrough.

## Manage and return to sessions

Inside Railway CA, press **Option+F** to show the agent tree and **Option+N** to start another session. Each machine shows its existing sessions beneath its name. Select a running session to return to it.

A terminal disconnect leaves the machine and its active sessions running. Open `railway ca` again to reconnect. Exiting the coding agent itself ends that session's process.

Stop compute when you're finished:

```bash
railway ca sleep <agent-name>
```

Sleep keeps the disk and stops running processes. After waking the machine, start a new process to continue; saved history depends on the coding agent. See [manage agents and sessions](/cloud-agents/manage).

## Additional installed tools

The development image also includes **pi**, **Cursor CLI**, and **Factory Droid**. These are available from a shell and use their own sign-in flows. The Railway CLI's launch picker and automatic credential transfer cover the agents listed above.

Open a shell with `railway ca ssh <agent-name> -- bash`, then run `pi`, `cursor-agent`, or `droid`. Complete the tool's authentication on the cloud agent as needed.

## Connect a local app instead

You can also use Railway as a remote environment for [Claude Desktop](/cloud-agents/claude), [Codex Desktop](/cloud-agents/codex), or [OpenCode Desktop and local terminal clients](/cloud-agents/opencode). Choose that path when you want to work through an app on your computer.
