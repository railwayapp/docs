---
title: OpenCode
description: Connect OpenCode Desktop or your local terminal client to an authenticated OpenCode server on a Railway cloud agent. Launch, reconnect, and carry provider sign-ins.
---

Keep OpenCode on your computer and give it a development environment on Railway. The CLI starts an authenticated OpenCode server on a cloud agent, checks its HTTPS connection, and gives your client everything it needs to connect.

<CloudAgentConnection app="OpenCode Desktop or terminal" transport="HTTPS" />

## Choose your edition

This guide covers standard OpenCode. **[OpenCode2 Beta →](/cloud-agents/opencode/beta)** has its own Desktop app, runtime, and `--opencode2` commands. Its guide covers automatic Desktop setup, local terminal connections, and running Beta inside Railway CA.

## Connect OpenCode Desktop

Complete the [CLI setup](/cloud-agents/quickstart#prepare-your-computer). Install and open [OpenCode Desktop](https://opencode.ai/download) once, then run:

```bash
railway ca desktop --opencode
```

Railway creates or wakes the cloud agent, starts `opencode serve` in the background, and saves the authenticated server, default server, and remote project in standard OpenCode Desktop. You do not need to run a separate server command.

On macOS, setup restarts a running OpenCode app to apply the settings. Quit Desktop before setup on Windows or Linux. If the configuration is saved but the app cannot reopen, open it manually.

### Start a chat on the cloud agent

1. Open **Home** with `Cmd+B` on macOS or `Ctrl+B` on Windows/Linux.
2. Under **Projects**, find **Railway: &lt;agent-name&gt;**.
3. Open `/app`, or the directory you chose with `--dir`.
4. Use the project's menu to start a **New session**.

<Banner variant="info">Choose the Railway project when starting a session. Changing the default server does not move existing chats; a chat opened against your local server continues to run locally.</Banner>

To verify, ask OpenCode to run `hostname` and `pwd` using its terminal tool. Compare the output with the selected remote project.

## Use your local terminal client

```bash
railway code --opencode
```

Railway prepares the same cloud server and prints its Desktop connection settings and a terminal connection command. Press **Enter** to launch your local OpenCode client. If it is missing, Railway offers to install it first.

Declining or canceling either prompt leaves the server running and prints the details so you can connect later. The local-client flow prints Desktop settings for manual entry; use `railway ca desktop --opencode` to write them automatically.

OpenCode's [client/server architecture](https://opencode.ai/docs/server/) lets the local interface use tools and files on the remote server.

## Reconnect to an existing server

```bash
railway code --opencode connect
```

Railway discovers running standard OpenCode servers on agents you own. One match connects directly; multiple matches open a picker labeled **workspace/project/cloud-agent name**.

Connect to a known agent by name or ID:

```bash
railway code --opencode connect <agent-name>
```

A named connection can wake an agent with a saved server configuration and restart its server. It does not create a new VM. In a noninteractive terminal, the CLI prints connection details instead of launching a client; use a name or ID when there are multiple candidates.

## Connect manually

Use the values printed by Railway when you add a server in Desktop:

| Setting | Value |
|---------|-------|
| Name | The cloud agent's name |
| Server | The agent's printed HTTPS URL |
| Username | `opencode` |
| Password | The generated password printed by setup |
| Directory | `/app`, or your chosen remote directory |

The printed terminal command has this form. Replace the URL and password placeholders with your connection details:

```bash
OPENCODE_SERVER_USERNAME=opencode OPENCODE_SERVER_PASSWORD='<server-password>' opencode attach 'https://<agent-domain>' --dir /app
```

The password authenticates access to your coding server. Provider sign-in is separate; setup can carry the provider credentials in your local OpenCode `auth.json`. Keep the printed password private.

## Run entirely inside Railway CA

```bash
railway code --opencode remote
```

Both the client and server run on the cloud agent, and your terminal opens OpenCode inside Railway CA. This flow does not launch your local OpenCode client.

## Choose a fresh agent or project directory

```bash
railway code --opencode --new
railway ca desktop --opencode --new
```

Choose one command for your preferred interface. New standard OpenCode agents get names such as `oc-railg-3ed`. Existing agents keep their names; see [agent naming](/cloud-agents/manage#agent-names).

To configure an existing agent's remote directory:

```bash
railway ca desktop --opencode --agent <agent-name> --dir /app/my-project
```

The local terminal flow also accepts `--dir`. Clone or create your project on the agent before using its directory.

## Sleep and return

```bash
railway ca sleep <agent-name>
```

Sleep keeps the disk and stops the server. To return from Desktop, rerun setup:

```bash
railway ca desktop --opencode --agent <agent-name>
```

Or use the named `connect` command for your local terminal. Setup reuses the saved server credentials. There is no local SSH tunnel to keep running.

## Remove the connection

```bash
railway ca desktop --opencode --agent <agent-name> --remove
```

This stops the managed server on a running agent and removes its local Desktop connection, project, and shared SSH entry. It does not wake a sleeping agent or delete its disk. Use `railway ca sleep` or `railway ca delete` to manage the VM itself.

For a preview without changes, use `--dry-run` with the setup command. Existing Desktop configuration is backed up before changes.

[OpenCode troubleshooting →](/cloud-agents/troubleshooting#opencode-connects-to-your-computer)
