---
title: OpenCode
description: Connect OpenCode Desktop or your local terminal client to an authenticated OpenCode server on a Railway cloud agent. Launch, reconnect, and carry provider sign-ins.
---

Keep OpenCode on your computer and give it a development environment on Railway. The CLI starts an authenticated OpenCode server on a cloud agent, checks its HTTPS connection, and gives your client everything it needs to connect.

<CloudAgentConnection app="OpenCode Desktop or terminal" transport="HTTPS" />

Cloud agents ship OpenCode 2. Every flow in this guide uses the `--opencode` flag, whether you connect Desktop, connect a local terminal client, or run OpenCode inside Railway CA.

## Install OpenCode on your computer

Install the OpenCode 2 terminal client with one of the official methods. The <a href="https://opencode.ai/v2/docs/" target="_blank">OpenCode documentation</a> lists other package managers and the Desktop downloads.

<CodeBlock>
  <CodeTab label="curl" lang="bash">{"curl -fsSL https://opencode.ai/v2/install | bash"}</CodeTab>
  <CodeTab label="Homebrew" lang="bash">{"brew install anomalyco/tap/opencode-v2"}</CodeTab>
  <CodeTab label="npm" lang="bash">{"npm install -g @opencode/cli"}</CodeTab>
</CodeBlock>

The installer at `opencode.ai/install` (without `/v2`) installs OpenCode 1.x, which does not match the server on your cloud agent. If you skip this step, Railway offers to install the terminal client when you choose to connect.

## Connect OpenCode Desktop

Complete the [CLI setup](/cloud-agents/quickstart#prepare-your-computer). Install and open OpenCode Desktop once, then run:

```bash
railway ca desktop --opencode
```

Railway creates or wakes the cloud agent, starts the OpenCode server in the background, and checks the authenticated HTTPS connection. It then saves the server URL, username, password, default server, and remote project in OpenCode Desktop. You don't need to run a separate server command.

On macOS, setup restarts a running OpenCode app to apply the settings. Quit Desktop before setup on Windows or Linux. If the configuration is saved but the app can't reopen, open it manually.

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

OpenCode's client/server architecture lets the local interface use tools and files on the remote server. See the <a href="https://opencode.ai/v2/docs/cli/" target="_blank">OpenCode CLI reference</a> for client flags.

## Reconnect to an existing server

```bash
railway code --opencode connect
```

Railway discovers running OpenCode servers on agents you own. One match connects directly; multiple matches open a picker labeled **workspace/project/cloud-agent name**.

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
OPENCODE_SERVER_USERNAME=opencode OPENCODE_SERVER_PASSWORD='<server-password>' opencode --server 'https://<agent-domain>'
```

The client connects to the server's configured directory and takes no local filesystem argument. The password authenticates access to your coding server; provider sign-in is separate. Keep the printed password private.

## Run entirely inside Railway CA

```bash
railway code --opencode remote
```

Both the client and server run on the cloud agent, and your terminal opens OpenCode inside Railway CA. This flow does not launch your local OpenCode client. Add `--new` for a fresh VM, or use `railway ca --opencode` to open the same session from the Railway CA interface.

## Choose a fresh agent

```bash
railway code --opencode --new
railway ca desktop --opencode --new
```

Choose one command for your preferred interface. New OpenCode agents get names such as `oc-railg-3ed`. Existing agents keep their names; see [agent naming](/cloud-agents/manage#agent-names).

## Project directory

The OpenCode server uses its startup directory, defaulting to `/app`. Choose a different directory when preparing a server with `--dir`:

```bash
railway code --opencode --new --dir /app/my-project
```

Desktop setup accepts the same option. Clone or create your project on the agent before pointing a server at its directory. To work in a repository cloned beneath `/app`, you can also keep the default directory and tell OpenCode which subdirectory contains the project.

## Provider sign-in

Railway imports your active OpenCode provider accounts from your computer when it prepares the server, and preserves credentials already configured on the agent. It transfers provider credentials, not your local chats or sessions.

If no provider is available to copy, connect one from the remote session, or open a shell with `railway ca ssh <agent-name> -- bash` and run `opencode auth login`. Provider login is separate from the server username and password printed by Railway. See [credentials and configuration](/cloud-agents/configuration#opencode-accounts).

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
