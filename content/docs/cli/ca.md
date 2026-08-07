---
title: railway ca
description: Browse, launch, and manage cloud agents from a terminal interface.
---

Browse your projects, launch [cloud agents](/cloud-agents), and connect to the sessions running on them.

<Banner variant="info">The `ca` command requires cloud agents to be enabled for your account through <a href="/platform/priority-boarding" target="_blank">Priority Boarding</a>. It's under active development, and its commands and flags may change in breaking ways.</Banner>

## Usage

```bash
railway ca [COMMAND] [OPTIONS]
```

Running `railway ca` with no arguments opens the terminal interface. Passing any launch option skips it and launches directly, the same as [`railway code`](/cli/code).

## Subcommands

| Subcommand | Description |
|------------|-------------|
| `setup` | Configure the default project, coding agent, skills sync, and theme |
| `start` | Launch a cloud agent without opening the interface |

## Options

These options apply to `railway ca` and `railway ca start`, and are the same ones [`railway code`](/cli/code) takes.

| Option | Description |
|--------|-------------|
| `--claude` | Launch Claude Code |
| `--codex` | Launch Codex |
| `--grok` | Launch Grok CLI |
| `--new` | Create a fresh agent instead of reusing this environment's |
| `--keep-awake` | Leave the agent running on disconnect instead of sleeping it |
| `--rm` | Destroy this environment's agent and exit |
| `--refresh-auth` | Re-mint the Claude credential on an agent that already has one |
| `--name <NAME>` | Name a newly created agent |
| `--gh` | Include your GitHub token, read with `gh auth token` |
| `--variable <KEY=VALUE>` | Set a variable on a newly created agent (repeatable) |
| `--env-file <PATH>` | Load variables from a `.env` file (repeatable) |
| `-p`, `--project <PROJECT>` | Project ID |
| `-e`, `--environment <ENVIRONMENT>` | Environment name or ID |

With no agent option, `railway ca` launches the coding agent saved by `railway ca setup`. Set `RAILWAY_CA_AGENT` to override the saved agent for one run.

## Configure cloud agents

`railway ca setup` asks four questions and writes the answers to `~/.railway/agent-prefs.json`: where agents run, which coding agent to launch, whether to sync your skills, and which theme to draw with. See [Getting started](/cloud-agents/getting-started) for a walkthrough.

| Option | Description |
|--------|-------------|
| `-y`, `--yes` | Skip the prompts, keeping existing preferences |
| `--show` | Print the saved preferences and exit |

Running `railway ca` on a machine with no preferences opens the same flow.

## The interface

The menu offers three actions, a prompt to describe a task, and the target project the prompt lands in.

| Action | Description |
|--------|-------------|
| **New Session** | Start another session on an agent you already have |
| **New Cloud Agent** | Create a machine in the target project |
| **Manage Cloud Agents** | Open the tree of projects, agents, and sessions |

Typing a task into the prompt and pressing `enter` launches an agent with that task. Press `^t` to change the target project, which also updates the default saved by setup.

**Note:** New Session asks which agent to use when the target holds more than one. When the target holds none, it says so rather than creating a machine, which is what New Cloud Agent is for.

### Keys

Press `?` for the full list. The keys below act on whatever the cursor is on.

| Key | Does |
|-----|------|
| `↑` `↓` | Move up and down |
| `→` `←` | Open and close a row |
| `enter` | Open a row, or connect to a session and type in it |
| `shift+esc` or `^]` | Stop typing in a session |
| `n` | Start a session on an agent, or an agent on a project |
| `x` | End the session |
| `s` | Sleep the agent |
| `w` | Wake the agent |
| `d` | Delete the agent, after a confirmation |
| `c` | Copy an SSH command for the session |
| `r` | Refresh |
| `t` | Set the prompt's target |
| `⌥f` | Give the session the whole screen, and restore the tree when pressed again |
| `shift+enter` | Leave the interface and connect to the session full screen |
| `⌥t` | Cycle the color theme |
| `⌥s` | Open setup |
| `esc` | Return to the menu |
| `^c` | Quit |

### Mouse

Click a menu card to open it, or the prompt box to type in it. In the tree, click a row to select it and double-click a session to connect.

In a connected session, the wheel scrolls the agent's output and clicking a link opens it in your browser. Drag to select text, which copies it when you release.

When the coding agent handles the mouse itself, clicks reach the agent so its own clickable output works. Hold `shift` while dragging to select text instead.

## Examples

### Open the interface

```bash
railway ca
```

### Configure cloud agents

```bash
railway ca setup
```

### Print your preferences

```bash
railway ca setup --show
```

### Launch without the interface

```bash
railway ca start --claude
```

### Launch a fresh agent

```bash
railway ca start --codex --new
```

### Launch into a specific environment

```bash
railway ca start --claude --project my-project --environment production
```
