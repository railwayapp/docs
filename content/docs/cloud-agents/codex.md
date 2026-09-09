---
title: Codex Desktop
description: Open a Railway cloud agent as a remote project in Codex Desktop. Configure SSH, carry your Codex sign-in, and work with code on a persistent Railway VM.
---

Give Codex Desktop a project on a Railway computer. The app connects over SSH, and Codex reads files, runs commands, and makes changes on your cloud agent.

<CloudAgentConnection app="Codex Desktop" />

## Connect Codex Desktop

Complete the [CLI setup](/cloud-agents/quickstart#prepare-your-computer) and install the Codex desktop app with SSH connections available.

Run on your computer:

```bash
railway ca desktop --codex
```

Railway creates or wakes the cloud agent, prepares Codex with your available local sign-in, and writes a concrete SSH host alias to `~/.ssh/config`. The command checks the SSH connection and remote tool availability before reporting its results.

Codex discovers the host through your SSH configuration. The CLI does not need to edit Codex's project database.

## Open a remote project

1. Restart Codex after setup.
2. Open **Settings → Connections → SSH**.
3. Add or enable the host printed by Railway, such as **railway-agent-my-agent**.
4. Choose `/app`, or your repository's directory on the agent, as a remote project.
5. Start a new chat in that remote project.

The app starts its remote Codex server through SSH. Your remote project uses the cloud agent's files and shell. See [OpenAI's SSH connection guide](https://learn.chatgpt.com/docs/remote-connections#connect-to-an-ssh-host) for the app's connection controls.

A new agent has a development environment ready for your code. [Clone your repository](/cloud-agents/quickstart#give-it-a-project) on the agent and select that remote folder. Railway setup does not copy your local repository or move an existing local chat.

## Keep a workspace for a project

Use `--new` when you want a fresh machine:

```bash
railway ca desktop --codex --new
```

Configure an existing machine:

```bash
railway ca desktop --codex --agent <agent-name>
```

Select the desired remote directory when you add the project in Codex. A generated SSH alias identifies the machine; it can serve multiple project folders on that machine.

Claude and Codex can share a cloud agent:

```bash
railway ca desktop --claude --codex --agent <agent-name>
```

Both apps work with the same disk. Coordinate edits when separate sessions use the same files, or use separate repositories or worktrees.

## Bring your Codex sign-in

Railway can copy your local `~/.codex/auth.json` to the agent over SSH. If you've already signed in locally, the setup prints which credential it is using. A working remote credential is preserved on reuse.

If nothing is available locally, setup can still prepare the agent; complete Codex's sign-in on the remote machine. See [provider sign-in](/cloud-agents/configuration#provider-sign-in) and [configuration](/cloud-agents/configuration) for skills and MCP import behavior.

## Reconnect and stop compute

Return to the remote project while the machine is awake. To stop compute and keep the disk:

```bash
railway ca sleep <agent-name>
```

Wake it before opening another remote chat:

```bash
railway ca wake <agent-name>
```

Codex cannot wake the Railway machine itself. Sleeping stops its running processes; reopening the remote project starts the processes needed for the new connection.

## Use Codex from the terminal

```bash
railway code --codex
```

This opens Codex in Railway CA's terminal interface. Use `railway ca` to select and reconnect to its running terminal sessions.

To run a noninteractive task, pass Codex arguments after `--`:

```bash
railway code --codex -- exec "explain this codebase"
```

## Preview or remove setup

```bash
railway ca desktop --codex --agent <agent-name> --dry-run
```

Dry run previews the local configuration without creating or waking an agent. To remove its managed SSH entry:

```bash
railway ca desktop --codex --agent <agent-name> --remove
```

The VM remains, and saved projects in Codex may still be listed. Removing the shared SSH alias affects every app using it.

[Troubleshoot a desktop connection →](/cloud-agents/troubleshooting#claude-or-codex-cannot-connect)
