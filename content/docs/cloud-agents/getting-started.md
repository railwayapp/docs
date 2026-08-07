---
title: Getting started with cloud agents
description: Configure cloud agents with railway ca setup, launch your first agent, and manage agents and sessions from the terminal.
---

<Banner variant="primary">Cloud agents are available through <a href="/platform/priority-boarding" target="_blank">Priority Boarding</a>. Breaking changes may occur.</Banner>

This page takes you from an unconfigured machine to a running [cloud agent](/cloud-agents) you can reconnect to.

Setup asks where agents run, which coding agent to launch, whether to bring your skills, and which theme to use. It saves the answers, so later launches need no flags.

## Before you start

You need three things in place:

- The [Railway CLI](/cli) installed and signed in with `railway login`
- Cloud agents enabled for your account through [Priority Boarding](/platform/priority-boarding)
- Claude Code, Codex, or Grok CLI installed on your machine

Railway reads the coding agent's credential from your machine. Codex and Grok CLI need a completed local sign-in. Claude Code mints a token in your browser the first time you launch, so it doesn't.

## Set up cloud agents

Start the configuration flow:

```bash
railway ca setup
```

Running `railway ca` on a machine with no preferences opens the same flow, so you can start there instead.

<Steps>
  <Step title="Choose where agents run">
    Select **Create a default project** to have Railway make a project named "Cloud Agents", or **Use an existing project** to pick one you already have. Select **Skip** to choose a target on each launch instead.

    This becomes your default project. Every launch creates and finds agents there unless you pass `--project` and `--environment`.
  </Step>
  <Step title="Choose a coding agent">
    Select Claude Code, Codex, or Grok CLI. Setup marks the agents it finds a local configuration directory for.

    This is the agent that runs when you launch without `--claude`, `--codex`, or `--grok`.
  </Step>
  <Step title="Decide about skills">
    Answer whether to bring your own [agent skills](/ai/agent-skills) to cloud agents. Setup counts what it found and asks which directory to read when more than one holds skills.

    Syncing is add-only, so it never replaces a skill the agent already has. Setup skips this question when it finds no skills of yours to send.
  </Step>
  <Step title="Pick a theme">
    Select a color theme for `railway ca`.

    Setup then prints what it saved and the path it wrote to, `~/.railway/agent-prefs.json`. Run `railway ca setup --show` to read it back later.
  </Step>
</Steps>

## Launch your first agent

With setup finished, launch the agent you configured:

```bash
railway code
```

Railway creates a machine in your default project, delivers your credential, and starts the coding agent in your terminal. The first launch takes longer than later ones because it creates the VM.

To describe the task up front instead, open the terminal interface and type it into the prompt:

```bash
railway ca
```

Press `enter` to launch. Railway hands the text to the agent as it starts.

## Manage agents and sessions

`railway ca` opens on a menu with three actions:

| Action | Does |
|--------|------|
| **New Session** | Starts another session on an agent you already have |
| **New Cloud Agent** | Creates a machine in the target project |
| **Manage Cloud Agents** | Opens the tree of projects, agents, and sessions |

Select **Manage Cloud Agents** to see your workspaces, projects, environments, agents, and the sessions running on each agent. The pane on the right shows the session you're connected to.

These keys act on whatever the cursor is on:

| Key | Does |
|-----|------|
| `enter` | Connects to a session and types in it |
| `shift+esc` or `^]` | Stops typing and returns the keyboard to the tree |
| `n` | Starts another session on this agent |
| `x` | Ends the session |
| `s` | Puts the agent to sleep |
| `w` | Wakes the agent |
| `d` | Deletes the agent, after a confirmation |
| `c` | Copies an SSH command for the session |
| `⌥f` | Gives the session the whole screen, and restores the tree when pressed again |
| `shift+enter` | Leaves the interface and connects to the session full screen |
| `?` | Lists every key |

Press `esc` to return to the menu, and `^c` to quit.

## Reconnect to your work

Sessions outlive the connection that started them. Closing your terminal leaves the agent working, and the next `railway ca` shows the session still running.

Disconnecting puts the agent to sleep, which stops compute billing and keeps the disk. Running `railway code` again wakes it with your files in place. To keep an agent running after you disconnect, launch it with `--keep-awake`.

## Next steps

Explore these resources to get more out of cloud agents:

- [Cloud agents](/cloud-agents)
- [`railway ca`](/cli/ca)
- [`railway code`](/cli/code)
- [Agent skills](/ai/agent-skills)
