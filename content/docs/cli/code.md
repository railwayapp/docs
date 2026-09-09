---
title: railway code
description: Launch a coding agent on Railway, connect a local OpenCode client to a cloud server, or reconnect to an existing server.
---

Launch a coding tool on a [cloud agent](/cloud-agents) with your available credentials. Claude Code, Codex, Grok CLI, and Railway Agent open inside Railway CA. OpenCode and OpenCode2 prepare a cloud server and offer to connect your local terminal client.

<Banner variant="info">Cloud agents require access through <a href="/platform/priority-boarding">Priority Boarding</a>. Update the CLI with <code>railway upgrade</code> for the latest client integrations.</Banner>

## Usage

```bash
railway code [OPTIONS] [-- <AGENT_ARGS>...]
railway code --opencode [remote | connect [AGENT]] [OPTIONS]
railway code --opencode2 [remote | connect [AGENT]] [OPTIONS]
```

For automatic desktop app configuration, use [`railway ca desktop`](/cli/ca#desktop).

## Coding agents

Choose one coding agent:

| Option | Behavior |
|--------|----------|
| `--claude` | Launch Claude Code inside Railway CA |
| `--codex` | Launch Codex inside Railway CA |
| `--grok` | Launch Grok CLI inside Railway CA |
| `--railway` | Launch Railway Agent with credentials already on the VM |
| `--opencode` | Start or reuse a standard OpenCode server and offer to connect locally |
| `--opencode2` | Start or reuse an OpenCode2 Beta server and offer to connect locally |

With no coding-agent flag, the default saved by `railway ca setup` is used. `RAILWAY_CA_AGENT` overrides that preference for one invocation. OpenCode editions use separate clients and server configurations.

## Options

| Option | Description |
|--------|-------------|
| `--new` | Create a fresh agent |
| `--name <NAME>` | Override the name of a newly created agent |
| `--agent <NAME_OR_ID>` | Select an existing agent for an OpenCode flow; conflicts with `--new` |
| `--dir <PATH>` | Remote server project directory for OpenCode local-client setup, default `/app` |
| `--refresh-auth` | Clear and re-mint the cached local and selected remote Claude credential |
| `--variable <KEY=VALUE>` | Set a variable on a new agent; repeatable |
| `--env-file <PATH>` | Load variables for a new agent; repeatable, with `--variable` taking precedence |
| `-p`, `--project <PROJECT>` | Select a project ID |
| `-e`, `--environment <ENVIRONMENT>` | Select an environment name or ID |
| `--rm` | Destroy the selected environment's remembered agent and exit; prefer `railway ca delete` to select by name and confirm |

Agents stay running when you disconnect. `--keep-awake` is accepted for compatibility and is no longer needed. Stop compute with `railway ca sleep <agent-name>`.

## OpenCode local clients

```bash
railway code --opencode
railway code --opencode2
```

Choose the command matching your edition. Railway creates or wakes an agent, prepares available credentials and configuration, starts its authenticated HTTPS server, and prints:

- Server URL, username, password, and directory for manual Desktop setup.
- A command to connect directly from your computer.
- A Railway command to reconnect later.

Press **Enter** to launch the local terminal client. The CLI checks for the matching client, offers installation if it is missing, and connects after installation. Canceling either prompt keeps the server running and prints the details again.

This flow does not write Desktop settings. Use [`railway ca desktop`](/cli/ca#desktop) for automatic app configuration.

## OpenCode remote

```bash
railway code --opencode remote
railway code --opencode2 remote --new
```

`remote` runs both client and server inside the cloud agent and opens the session in Railway CA. It does not launch a local OpenCode client. `--dir` is for local-client server setup and cannot be used with `remote`.

## OpenCode connect

```bash
railway code --opencode connect
railway code --opencode2 connect <agent-name-or-id>
```

`connect` uses your local client. Without a selector, it discovers compatible running servers on agents you own. One match connects directly; multiple matches show a **workspace/project/cloud-agent name** picker. It filters standard and Beta servers separately.

An explicit name or ID connects to that agent and can wake a saved server. If names are ambiguous, select by ID. This command does not create a new agent or install a server on an unrelated machine.

Connection actions do not accept creation settings such as `--new`, `--name`, `--variable`, or `--env-file`, or a new `--dir`. Use the server's saved directory.

In noninteractive terminals, local-client flows print connection details without prompting, installing, or opening a client. Multiple candidates require a name or ID.

## Where the agent runs

Explicit project/environment flags take priority, followed by the directory's linked context, then your saved default. When none is available, interactive setup resolves the target. A stale link to a deleted project can fall back to the default.

Railway reuses an existing agent where possible. `--new` creates a separate disk. New OpenCode names use `oc-<label>-<suffix>` or `oc2-<label>-<suffix>`; `--name` overrides them. See [agent selection and naming](/cloud-agents/manage).

## Credentials

Launch carries available local provider credentials over SSH and preserves working credentials already on the VM. Missing local authentication allows the agent to start and the coding tool to request sign-in remotely.

OpenCode2 imports active provider accounts from its Beta credential database and downloads its latest official runtime on startup. The first start may take several minutes. See [OpenCode2 Beta](/cloud-agents/opencode/beta) and [credentials and configuration](/cloud-agents/configuration).

## Agent arguments

Put coding-agent arguments after `--`. This runs the requested command directly rather than entering the interactive launch flow:

```bash
railway code --codex -- exec "explain this codebase"
```

For a Beta standalone task:

```bash
railway code --opencode2 -- run --standalone "explain this project"
```

## Examples

Create an OpenCode server on a fresh named agent:

```bash
railway code --opencode --new --name reviews
```

Create a Beta agent with variables:

```bash
railway code --opencode2 --new --env-file .env.agent
```

Run Codex with a service-variable reference:

```bash
railway code --codex --new --variable DATABASE_URL=postgres.DATABASE_URL
```

Run a coding session without the Railway CA interface:

```bash
railway ca start --codex
```

For guided setup, see [the cloud agents quickstart](/cloud-agents/quickstart).
