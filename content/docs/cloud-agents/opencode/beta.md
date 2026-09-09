---
title: OpenCode2 Beta
description: Run OpenCode2 Beta on a Railway cloud agent and connect from Beta Desktop or your local opencode2 client. Includes runtime downloads, authentication, and reconnecting.
---

Use OpenCode2 Beta with a persistent Railway workspace. Railway prepares the latest official Beta runtime on your cloud agent and connects the Beta desktop app or terminal client to its authenticated HTTPS server.

<CloudAgentConnection app="OpenCode2 Beta" transport="HTTPS" />

<Banner variant="info">OpenCode2 Beta has its own runtime and Desktop configuration. Use <code>--opencode2</code> throughout this guide. <code>--opencode</code> targets standard OpenCode.</Banner>

## Connect Beta Desktop

Complete the [CLI setup](/cloud-agents/quickstart#prepare-your-computer), then install and open the desktop app from the [official OpenCode Beta repository](https://github.com/anomalyco/opencode-beta).

Create a fresh Beta agent:

```bash
railway ca desktop --opencode2 --new
```

Railway downloads the Beta runtime on the agent, starts its server in the background, and checks the authenticated public connection. It then saves the URL, username, password, default server, and remote project in **OpenCode Beta** Desktop.

**The first startup can take several minutes.** Wait for the CLI to finish checking the HTTPS connection before connecting.

On macOS, setup restarts the running Beta app to apply settings. Quit it before setup on Windows/Linux. A saved configuration can still be used if automatic reopening fails; open Beta Desktop manually.

## Start a remote Beta session

1. Open **Home** with `Cmd+B` on macOS or `Ctrl+B` on Windows/Linux.
2. Under **Projects**, choose **Railway: &lt;agent-name&gt;**.
3. Open `/app`, or the server directory selected during setup.
4. Start a **New session** from that project.

Existing local chats retain their original server. Setting the new server as the default does not transfer those chats. Ask the new session to execute `hostname` and `pwd` to verify its remote tools and directory.

## Launch your local Beta terminal client

```bash
railway code --opencode2 --new
```

Railway creates the cloud server and prints connection details for both terminal and manual Desktop setup. Press **Enter** to connect with your local `opencode2` client. Railway checks for the Beta client at this point and offers to install it if missing.

Standard OpenCode and OpenCode2 are detected and installed independently. The local installer does not install the Beta desktop app.

Canceling the launch or installation prompt leaves the cloud server running and prints its connection details. Omit `--new` to reuse an existing agent where possible.

## Reconnect

Find your running Beta servers:

```bash
railway code --opencode2 connect
```

One match connects directly. Multiple matches show a **workspace/project/cloud-agent name** picker. Standard OpenCode servers are excluded.

Connect directly by name or ID, including to wake an agent with a saved Beta server:

```bash
railway code --opencode2 connect <agent-name>
```

For manual connection, use the command printed by Railway. It has this form; replace the placeholders with your server's details:

```bash
OPENCODE_SERVER_USERNAME=opencode OPENCODE_SERVER_PASSWORD='<server-password>' opencode2 --server 'https://<agent-domain>'
```

Beta uses `--server`. The [standard OpenCode client](/cloud-agents/opencode#connect-manually) uses `attach`. Use the client edition matching the server.

To configure Desktop manually, add the printed server URL, username, and password, then open the remote project directory. Use `railway ca desktop --opencode2 --agent <agent-name>` to save these settings automatically.

## Run Beta entirely inside Railway CA

```bash
railway code --opencode2 remote
```

This runs both client and server on the cloud agent and opens the terminal session inside Railway CA. Add `--new` for a fresh VM:

```bash
railway code --opencode2 remote --new
```

You can also use `railway ca --opencode2`. In Railway CA's new-session picker, highlight **OpenCode** and press **Tab** to switch to **OpenCode2 [Beta]**. Tab also switches editions in the prompt footer; Shift+Tab cycles coding agents.

## Runtime updates

Each new Beta process checks the latest official release. Railway downloads the Linux package for the agent's architecture, verifies its published SHA-256, and extracts the CLI runtime. A verified cached runtime is reused until the release changes.

Running sessions retain their executable. If an update fails, startup reports the error and preserves the previous runtime. Reconnecting to an already running server reuses that server.

New Beta agents have names such as `oc2-railg-3ed`, so you can distinguish them from standard OpenCode agents. See [agent naming](/cloud-agents/manage#agent-names).

## Provider sign-in

Beta stores provider accounts in its local credential database. Railway imports the active account for each provider from that database, while preserving credentials already configured on the agent. It transfers provider credentials, not your local chats or sessions.

The default source is `~/.local/share/opencode/opencode.db`; custom XDG data paths and `OPENCODE_DB` are respected. Legacy `auth.json` is used only when no Beta credential store exists. If the Beta store exists but has no active credentials, Railway does not restore an old legacy sign-in.

If no provider is available to copy, connect one from the remote Beta session or run `opencode2 auth login` in a shell on the agent. This provider login is separate from the server username and password printed by Railway.

## Project directory

The Beta server uses its startup directory, defaulting to `/app`. The local client connects to that server without a local filesystem argument.

Choose the directory when preparing a new server with `--dir`. Changing the startup directory of an already configured Beta server requires a fresh agent; the CLI reports this instead of silently connecting to a different directory. To work in a repository cloned beneath `/app`, tell Beta which subdirectory contains the project.

## Sleep, restart, or remove

Stop compute while keeping files:

```bash
railway ca sleep <agent-name>
```

To wake the agent and restart its server for Desktop:

```bash
railway ca desktop --opencode2 --agent <agent-name>
```

For your local terminal, use the named `connect` command. Both paths reuse saved server credentials.

To remove the managed Desktop connection and stop the server on a running VM:

```bash
railway ca desktop --opencode2 --agent <agent-name> --remove
```

This leaves the agent and disk in place. Use `--dry-run` on the setup command to preview configuration without creating or waking a VM.

[Troubleshoot Beta startup and sign-in →](/cloud-agents/troubleshooting#beta-startup-is-taking-a-long-time)
