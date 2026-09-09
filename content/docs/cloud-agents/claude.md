---
title: Claude Desktop
description: Connect Claude Code in Claude Desktop to a Railway cloud agent. Set up its SSH environment, carry your sign-in, and work on a persistent remote project.
---

Use Claude Desktop to work on a Railway cloud agent. Claude Code runs on the remote machine, with its development tools and persistent disk, while you prompt it and review changes in Desktop.

<CloudAgentConnection app="Claude Desktop" />

## Connect Claude Desktop

Complete the [CLI setup](/cloud-agents/quickstart#prepare-your-computer) and install [Claude Desktop](https://code.claude.com/docs/en/desktop-quickstart) with access to its Code tab.

Run on your computer:

```bash
railway ca desktop --claude
```

Railway creates or wakes your agent, prepares Claude Code and available credentials, and saves its connection. It adds an SSH host to `~/.ssh/config` and a named environment to Claude's settings.

The output identifies your agent and its host alias, such as `railway-agent-my-agent`.

## Open your Railway environment

1. Restart Claude Desktop and open **Code**.
2. Before starting a session, open the **environment dropdown**.
3. Select **Railway · &lt;agent-name&gt;**, the SSH environment created by Railway.
4. Open `/app`, or the remote project directory you chose during setup, and start a task.

Claude's environment choice determines where its commands execute. Railway appears as a named SSH connection; Claude's separately labeled **Remote** option uses Anthropic's cloud. See [Claude's SSH sessions documentation](https://code.claude.com/docs/en/desktop#ssh-sessions) for the app's controls.

On a fresh agent, [clone your repository](/cloud-agents/quickstart#give-it-a-project) before asking Claude to work on it. Your computer's repository is not automatically copied to the VM.

## Choose an agent or directory

Create a fresh machine:

```bash
railway ca desktop --claude --new
```

Point Desktop at an existing agent and remote folder:

```bash
railway ca desktop --claude --agent <agent-name> --dir /app/my-project
```

The directory should exist on the agent. Repeating setup updates the managed connection instead of adding duplicates. You can configure Claude and Codex for the same machine in one command:

```bash
railway ca desktop --claude --codex --agent <agent-name>
```

## Bring your sign-in

Railway prepares Claude's remote credential using the same flow as `railway code --claude`. It can mint a token with your local `claude setup-token`, or use `CLAUDE_CODE_OAUTH_TOKEN` or `ANTHROPIC_API_KEY` when supplied. A working credential on an existing agent is reused.

If there is no local credential to carry, you can sign in on the cloud agent. See [credentials and configuration](/cloud-agents/configuration#provider-sign-in) for authentication and refresh instructions.

Your selected skills and eligible project MCP configuration also follow the launch preferences. Desktop's connection runs against the tools and files on the VM.

## Come back later

While the agent is awake, reopen its SSH environment in Claude Desktop. Closing the app does not sleep the VM.

When you've finished using the machine:

```bash
railway ca sleep <agent-name>
```

Before connecting again:

```bash
railway ca wake <agent-name>
```

Desktop cannot wake a sleeping agent itself. Sleeping retains files and saved history but ends running processes.

## Use Claude from the terminal

```bash
railway code --claude
```

This opens Claude Code inside Railway CA. Use `railway ca` to browse and reconnect to its running terminal sessions. Desktop chats and Railway CA terminal sessions have their own interfaces; setting up Desktop does not move an existing local chat onto the VM.

## Preview or remove setup

Preview the configuration without creating, waking, or changing an agent:

```bash
railway ca desktop --claude --agent <agent-name> --dry-run
```

Remove the managed Claude connection and shared SSH entry:

```bash
railway ca desktop --claude --agent <agent-name> --remove
```

Removal leaves the VM and its files in place. Removing the shared SSH entry also affects other apps using that alias; rerun their setup if needed.

[Troubleshoot a desktop connection →](/cloud-agents/troubleshooting#claude-or-codex-cannot-connect)
