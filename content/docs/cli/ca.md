---
title: railway ca
description: Browse and manage cloud agents, configure desktop app connections, and launch persistent coding sessions from the terminal.
---

Browse your projects, launch [cloud agents](/cloud-agents), and connect to their terminal sessions. Set up Claude Desktop, Codex Desktop, OpenCode, or OpenCode2 Beta with `railway ca desktop`.

<Banner variant="info">Cloud agents require access through <a href="/platform/priority-boarding">Priority Boarding</a>. Update the CLI with <code>railway upgrade</code> for the latest client integrations.</Banner>

## Usage

```bash
railway ca [COMMAND] [OPTIONS]
```

With no arguments, `railway ca` opens the terminal interface. Launch flags open the coding session in Railway CA; `railway ca start` skips the interface. OpenCode flags on `ca` run the coding client on the cloud agent. Use [`railway code --opencode` or `--opencode2`](/cli/code#opencode-local-clients) for local terminal clients.

## Subcommands

| Subcommand | Description |
|------------|-------------|
| `setup` | Configure the default project, coding agent, skills, and theme |
| `start` | Launch a coding agent without the Railway CA interface |
| `desktop` | Prepare a cloud agent and configure a local desktop app |
| `list` | List your agents across projects, or within an explicit scope |
| `create [NAME]` | Create a VM without attaching a coding client |
| `ssh [AGENT] [-- COMMAND...]` | Attach to an existing agent's terminal session or run a command |
| `sleep [AGENT]` | Stop compute and processes while retaining the disk |
| `wake [AGENT]` | Wake an existing agent |
| `delete [AGENT]` | Delete an agent and its disk, after confirmation |

`AGENT` accepts a name or ID. When omitted for lifecycle commands, Railway uses the directory's agent or the sole candidate and reports candidates when it cannot choose. `--project` and `--environment` narrow the scope.

## Launch options

`railway ca` and `railway ca start` share the launch options in the [`railway code` reference](/cli/code#options). Choose `--claude`, `--codex`, `--grok`, `--railway`, `--opencode`, or `--opencode2`. With no flag, the saved default applies, overridden by `RAILWAY_CA_AGENT` when set.

```bash
railway ca --opencode2
railway ca start --codex --new
```

Agents remain running after disconnect. Use `railway ca sleep` to stop compute; the legacy `--keep-awake` flag is no longer needed.

## Desktop

Prepare the remote tool and its local app connection:

<CodeBlock>
  <CodeTab label="Claude Desktop" lang="bash">{"railway ca desktop --claude"}</CodeTab>
  <CodeTab label="Codex Desktop" lang="bash">{"railway ca desktop --codex"}</CodeTab>
  <CodeTab label="OpenCode" lang="bash">{"railway ca desktop --opencode"}</CodeTab>
  <CodeTab label="OpenCode2 Beta" lang="bash">{"railway ca desktop --opencode2"}</CodeTab>
</CodeBlock>

| Option | Description |
|--------|-------------|
| `--claude` | Write SSH configuration and Claude Desktop's named environment |
| `--codex` | Write the SSH alias discovered by Codex Desktop |
| `--opencode` | Start the standard OpenCode server and save its Desktop connection and project |
| `--opencode2` | Prepare the Beta runtime and server and save its Beta Desktop connection and project |
| `--agent <NAME_OR_ID>` | Use an existing agent |
| `--new` | Always create a fresh VM; conflicts with `--agent` and `--remove` |
| `--dir <PATH>` | Remote starting directory, default `/app`; choose the remote folder in Codex itself |
| `--alias <NAME>` | Override the generated `railway-agent-<name>` SSH alias |
| `--ssh-config <PATH>` | SSH file to write, default `~/.ssh/config` |
| `--dry-run` | Preview setup without local changes or creating, waking, or changing a VM |
| `--remove` | Remove managed local configuration and stop a managed OpenCode server on an awake VM |
| `--no-verify` | Skip SSH probes; OpenCode HTTPS authentication is still checked |
| `-p`, `--project <PROJECT>` | Project ID |
| `-e`, `--environment <ENVIRONMENT>` | Environment name or ID |

App flags can be combined for the same VM, such as `--claude --codex`. Standard and Beta OpenCode flags cannot be combined. Without `--new`, setup reuses and wakes an agent where possible, creating one if needed.

Claude and Codex connect over SSH. Restart the app after setup and select the remote environment or project. OpenCode starts a server on the agent's HTTPS app endpoint, using port `8080`, and saves its generated username/password and project in the selected Desktop edition. An occupied port fails without stopping the other process.

On macOS, OpenCode setup restarts the selected running app. Quit it before setup on Windows/Linux. Select **Home → Projects → Railway: &lt;agent-name&gt; → /app → New session**. Existing chats retain their server.

The Beta runtime downloads on first startup, which can take several minutes. See [OpenCode2 Beta](/cloud-agents/opencode/beta) for updates and provider-account import.

`--remove` leaves the VM and disk intact and does not wake a sleeping agent. It removes the shared managed SSH entry, so other apps using that alias are affected. `--remove` conflicts with `--dry-run` and `--dir`.

App walkthroughs: [Claude Desktop](/cloud-agents/claude), [Codex Desktop](/cloud-agents/codex), [OpenCode](/cloud-agents/opencode), and [OpenCode2 Beta](/cloud-agents/opencode/beta).

## Configure cloud agents

`railway ca setup` writes your choices to `~/.railway/agent-prefs.json`.

| Option | Description |
|--------|-------------|
| `-y`, `--yes` | Keep existing preferences or choose defaults without prompts; used when stdout is not a terminal |
| `--show` | Print preferences and exit |
| `--reset` | Remove saved preferences |

Skills sync is off when selecting fresh noninteractive defaults. See [configuration](/cloud-agents/configuration) for sources and import behavior.

## List and create

```bash
railway ca list --json
railway ca create my-agent --project <project-id> --environment production --json
```

`list --all` includes agents belonging to other members and requires an explicit `--environment`. It does not grant access to their credentials or sessions.

`create` supports `--variable`, `--env-file`, `--no-wait`, and `--json`. `--no-wait` returns once creation is requested; it does not mean the agent is ready.

## SSH and lifecycle

```bash
railway ca ssh <agent-name> -- bash
railway ca sleep <agent-name>
railway ca wake <agent-name>
railway ca delete <agent-name>
```

`ssh --session <name>` selects a durable terminal session. `ssh` targets an existing awake VM and does not create one if it cannot find the name.

`sleep --all` sleeps all your running agents, narrowed by an environment filter when supplied. `wake --no-wait` returns before readiness. `delete --yes` skips its confirmation.

Sleep stops processes while retaining files. After waking OpenCode, rerun Desktop setup or a named local-client `connect` command to restart the managed server. See [agent lifecycle](/cloud-agents/manage#sleep-wake-and-delete).

## The interface

The menu offers **New Session**, **New Cloud Agent**, and **Manage Cloud Agents**, with a prompt for a task and a target project. New Session selects an existing agent; New Cloud Agent creates a fresh machine. The tree only adds child rows when actual terminal sessions exist, and loading appears in the agent's status icon.

### Keys

| Key | Action |
|-----|--------|
| `↑` `↓` | Move between rows |
| `→` `←` | Open and close a row |
| `enter` | Open a row or connect to a session |
| `shift+esc` or `^]` | Stop typing in a session |
| `n` | Start a session on an agent or an agent on a project |
| `x` | End the session |
| `s` / `w` / `d` | Sleep, wake, or delete the agent |
| `c` | Copy a session's SSH command |
| `r` | Refresh |
| `t` | Set the prompt's target |
| `^t` | Change the target project |
| `⌥f` | Toggle the full-width session view |
| `shift+enter` | Leave the interface and connect full screen |
| `⌥t` | Cycle theme |
| `⌥s` | Open setup |
| `esc` | Return to the menu |
| `^c` | Quit |

In the coding-agent picker and prompt footer, **Tab** switches OpenCode to **OpenCode2 [Beta]** and back. **Shift+Tab** cycles coding agents. Press `?` for the full key reference in the active view.

### Mouse

Click a row to select it and double-click a session to connect. In a connected session, scroll with the wheel, open links by clicking, and drag to select and copy text. When the coding agent handles mouse input, hold Shift while dragging to select text instead.
