---
title: Troubleshoot cloud agents
description: Resolve cloud-agent access, SSH failures, local versus remote OpenCode chats, Beta startup, provider authentication, and desktop configuration issues.
---

Start by finding the existing agent:

```bash
railway ca list
```

Use its name or ID while troubleshooting. A failed connection can leave a successfully created agent running; reconnect to that machine before creating another.

## A command or app flag is missing

Update the Railway CLI:

```bash
railway upgrade
```

Then check `railway code --help` or `railway ca desktop --help`. OpenCode2 uses the separate `--opencode2` flag. Cloud agents require the **Cloud Agents** feature in [Priority Boarding](/platform/priority-boarding).

## Claude or Codex cannot connect

Make sure the VM is awake, then check shell access:

```bash
railway ca wake <agent-name>
railway ca ssh <agent-name> -- bash
```

If shell access works, rerun the requested Desktop setup against that agent and restart the app. Claude lists **Railway · &lt;agent-name&gt;** in the Code environment dropdown; Codex lists the generated SSH alias under its SSH connections.

If you used a custom `--ssh-config`, confirm the desktop app can read that configuration. The setup checks use the file you selected, while Codex normally discovers hosts from `~/.ssh/config`.

## OpenCode connects to your computer

A default server change does not move an existing chat. Open **Home → Projects → Railway: &lt;agent-name&gt; → /app → New session**, using the matching OpenCode edition.

Ask the session to execute `hostname` and `pwd` with its terminal tool. A model's answer about its hostname without executing a command does not verify the connection.

Use `railway ca desktop --opencode --agent <agent-name>` for standard Desktop or `--opencode2` for Beta. `railway code --opencode` prints manual Desktop settings and offers a local terminal connection; it does not automatically update Desktop settings.

## OpenCode has a server but gives no response

Check these independently:

1. The selected project belongs to the Railway server and the client edition matches it.
2. The agent is awake and its server is running. Rerun the matching Desktop setup or named `connect` command to start and verify it.
3. The remote OpenCode server has a signed-in provider and a selected model. The server connection password is separate from provider authentication.

To inspect startup output, open a shell on the agent and read the managed server log:

```bash
railway ca ssh <agent-name> -- bash
```

Then on the agent:

```bash
tail -n 100 ~/.railway/desktop/opencode/server.log
```

Review logs before sharing them; they can include details from your configuration.

## Beta startup is taking a long time

The first OpenCode2 process downloads and verifies the current Beta runtime. This can take several minutes. Wait for Railway's HTTPS readiness check to complete.

A failed download reports an error and preserves the previous cached runtime. Rerun setup against the agent already created:

```bash
railway ca desktop --opencode2 --agent <agent-name>
```

An already running server is reused. A new process checks for a newer Beta release.

## Beta asks me to sign in again

Current Beta provider accounts are in its credential database. Update the Railway CLI so it can import those accounts, then rerun Beta setup against the existing agent.

Check the credential source printed by the CLI. The default is `~/.local/share/opencode/opencode.db`, with XDG and `OPENCODE_DB` overrides supported. If the Beta store exists but is empty, an old standard `auth.json` is deliberately not substituted.

If there is no active provider account to copy, connect one in the remote Beta project or run `opencode2 auth login` on the agent. See [provider sign-in](/cloud-agents/configuration#provider-sign-in).

## The public app port is occupied

OpenCode serves through the agent's port `8080`. Setup refuses to stop an unrelated process using that port. Stop that process yourself if it is no longer needed, or choose `--new` to create a separate machine.

## Desktop settings were saved but the app did not open

Open the selected app manually. On macOS, a LaunchServices restart failure can occur after configuration has already been saved. The CLI reports this as a manual-reopen notice.

If settings still appear stale, quit the app, rerun setup for the same agent and edition, and reopen it. Quit OpenCode before configuration on Windows and Linux.

## SSH fails during creation

Errors such as `mm_send_fd: sendmsg(0): Message too long` or `mux_client_request_session: send fds failed` can occur with older CLI provisioning through an OpenSSH multiplexed connection. Update Railway, then retry against the existing agent instead of creating another one.

For an OpenCode2 server and local client:

```bash
railway code --opencode2 --agent <agent-name>
```

The current CLI streams the provisioning script over SSH input. If the error persists, check `railway ca ssh <agent-name> -- bash` and the agent's status to separate a transport problem from server startup.

## My project or files are missing

The CLI uses the directory's linked project before the saved default. Inspect `railway ca setup --show` and use explicit project/environment flags when needed. A deleted project link can fall back to the default; use `railway link` to repair it.

Your local repository is not automatically uploaded. [Clone it on the agent](/cloud-agents/quickstart#give-it-a-project) and open its remote directory. A new VM from `--new` has a separate disk from your previous agent.
