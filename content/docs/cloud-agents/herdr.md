---
title: Herdr
description: Set up Herdr to create and connect to Railway cloud agents. Run coding tools in remote terminal workspaces and manage machines from the sidebar.
---

<a href="https://herdr.dev" target="_blank">Herdr</a> is a terminal workspace manager. Its Railway plugin connects workspaces to your cloud agents over SSH.

<Banner variant="info">Cloud agents are a preview feature available through <a href="/platform/priority-boarding">Priority Boarding</a>.</Banner>

## Set up Herdr

Install the [Railway CLI](/cli#installing-the-cli), enable **Cloud Agents** in [Priority Boarding](/platform/priority-boarding), and sign in with `railway login`.

Check that your CLI is 5.62.0 or later and lists `herdr` as a subcommand:

```bash
railway --version
railway ca --help
```

If it doesn't, run `railway upgrade` and check again. Older versions can pass `herdr new` to your coding tool instead of starting Herdr setup.

On macOS or Linux, install Herdr 0.9 or later:

```bash
curl -fsSL https://herdr.dev/install.sh | sh
```

Homebrew users can run `brew install herdr` instead. Open Herdr:

```bash
herdr
```

In a terminal under **Local**, install the Railway plugin once:

```bash
railway ca herdr install
```

Then create a cloud agent for Codex. This always creates a fresh VM; to reuse one, [connect an existing agent](#connect-an-existing-agent).

```bash
railway ca herdr new --codex
```

Choose a project, environment, and agent name when prompted. Railway creates the VM, copies your available Codex credentials, and prepares its Herdr workspace. Accept Herdr's remote installation prompt if one appears.

Select **app** under the machine in the sidebar to use Codex. Complete any workspace trust or provider sign-in prompts. The session starts in `/app`. [Clone your repository there](/cloud-agents/quickstart#give-it-a-project) or ask Codex to clone it for you.

To use another coding tool, replace `--codex` with `--claude`, `--grok`, or `--railway`. Omitting the flag opens a coding-agent picker.

## Connect an existing agent

In **Local**, open the Railway agent picker:

```bash
railway ca herdr agents
```

Select your agent, then **connect**. Railway wakes it if needed. If it isn't already in Herdr, choose a coding tool to prepare, then select the machine's **app** workspace in the sidebar.

The plugin adds these shortcuts in **Local**. With Herdr's default prefix, press `Ctrl+B`, release it, then press the second key:

| Keys | Action |
|------|--------|
| `Ctrl+B`, then `Shift+A` | Open the Railway agent picker |
| `Ctrl+B`, then `Shift+S` | Choose an agent to wake. If only one is sleeping, wake it directly. |

## Sleep and return

Closing Herdr leaves the VM running. To stop compute, open the agent picker in **Local**, select the agent, and choose **sleep**. This keeps its files and disables its Herdr connection. When you sleep a VM from a remote workspace, a connected Herdr client may wake it again.

To return, open the picker in **Local** and choose **wake** or **connect**. Select **app** in the sidebar once the machine is ready. Sleeping stops running processes. Saved files and conversation history remain on disk.

The picker also has a **delete** action, which removes the VM and its disk after confirmation. See [agent lifecycle](/cloud-agents/manage#sleep-wake-and-delete) for billing and persistence details.

## Retry setup

If setup fails after creating the VM, open `railway ca herdr agents` in **Local** and choose **connect** for that agent. The CLI retries incomplete setup on the same machine.

`new` and `agents` run the required bootstrap for you. You don't need to run `bootstrap` or `watch` during normal setup. See the [command reference](/cli/ca#herdr) for manual recovery commands.

If the sidebar shows an outdated machine status, run this in **Local**:

```bash
railway ca herdr sync
```

## Remove the plugin

Run this in **Local** to unlink the plugin, stop its watcher, and remove its shortcuts:

```bash
railway ca herdr install --remove
```

Your cloud agents and saved Herdr machines remain. Sleep or delete agents through the picker before removing the plugin, or use the [CLI lifecycle commands](/cli/ca#ssh-and-lifecycle).
