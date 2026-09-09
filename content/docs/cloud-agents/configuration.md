---
title: Credentials and configuration
description: Bring provider sign-ins, skills, MCP configuration, and environment variables to Railway cloud agents. Understand what is copied and what stays local.
---

Cloud-agent setup prepares your coding tools with the local configuration available to the CLI. Reusing an agent preserves its files and working provider credentials.

## Three separate connections

| Credential | Purpose |
|------------|---------|
| Railway login and SSH access | Create, manage, and reach your cloud agent |
| Coding-provider sign-in | Authenticate Claude, Codex, OpenCode providers, or Grok |
| OpenCode server username/password | Let an OpenCode client connect to the agent's HTTPS server |

Signing in to a model provider does not replace the OpenCode server password. An authenticated OpenCode connection can still need a provider account before it can answer a prompt.

## Provider sign-in

Railway reads available provider credentials locally and transfers them over SSH. It does not put the provider credential in an image, a Railway environment variable, or the SSH command arguments. Working credentials already present on a reused agent are preserved.

| Coding agent | Local credential source |
|--------------|-------------------------|
| Claude Code | A token minted with `claude setup-token`, cached in `~/.railway/claude-code-token`; `CLAUDE_CODE_OAUTH_TOKEN` or `ANTHROPIC_API_KEY` can supply one directly |
| Codex | `~/.codex/auth.json` |
| Grok CLI | `~/.grok/auth.json` |
| OpenCode | Its data directory's `auth.json`, normally `~/.local/share/opencode/auth.json` |
| OpenCode2 Beta | Active provider accounts in its credential database, normally `~/.local/share/opencode/opencode.db` |
| Railway Agent | Railway credentials already configured on the VM |

With no local credential to copy or mint, the agent can still start. Complete the coding tool's sign-in on the remote machine. The CLI prints which local source it uses when one is available.

### Claude tokens

Claude's local sign-in uses rotating credentials. Railway mints a separate token for the VM with `claude setup-token`, which can open a browser on your computer. The cached token is reused on subsequent launches.

To replace a revoked or failing token, target the agent's environment and run:

```bash
railway code --claude --refresh-auth
```

This clears the cached local and selected remote credential and runs the minting flow again. `railway logout` removes the cached local Claude token; upstream revocation is separate.

### OpenCode2 Beta accounts

Beta's credential database stores provider accounts separately from the legacy JSON file. Railway transfers the active account for each provider, including the metadata it needs, and excludes local chats, sessions, and MCP credentials. Temporary transfer files are removed after import.

The CLI respects XDG data paths and `OPENCODE_DB`. Legacy `auth.json` is considered only when no Beta credential store exists. An initialized but empty Beta store does not cause an old JSON sign-in to be restored.

To sign in directly, open a shell with `railway ca ssh <agent-name> -- bash`, then run `opencode2 auth login`. You can also connect a provider through Beta while using the remote project.

## OpenCode server authentication

Railway generates a username/password connection for the OpenCode server and checks it over HTTPS before reporting readiness. It prints these values for manual connection and, during Desktop setup, saves them in the selected app's settings.

The same agent reuses its saved server credentials on subsequent setup. Treat the printed password as access to your coding server and project files. It is separate from the provider credentials described above.

## Sync your skills

Use `railway ca setup` to enable personal skill sync and choose a directory:

- `~/.claude/skills`
- `~/.codex/skills`
- `~/.grok/skills`
- `~/.agents/skills`
- `~/.config/opencode/skills`

The CLI lets you select skills from the source. It packages eligible skill directories and uploads changes during launch. Existing names on the agent are preserved, including Railway's own installed skills. Disabling sync later leaves previously copied skills on the VM.

Packed skills over 2 MB produce a warning; over 10 MB fail before creating an agent. Bulk directories such as `.git` and `node_modules`, and environment files, are excluded.

## Import project MCP configuration

Launch from your repository to import eligible servers from its `.mcp.json`. The CLI searches from the current directory toward the repository root. Disabled entries and servers managed by Railway are excluded, and imported names receive a `user-` prefix.

Import is enabled by default and can be disabled in `~/.railway/agent-prefs.json` with `"mcp": { "enabled": false }`. The same preference can exclude specific server names. Existing servers outside the imported namespace are preserved.

The remote machine must be able to run a configured command or reach its server URL. A URL using `localhost` refers to the cloud agent when used there. Importing configuration does not copy every application's OAuth session.

## Set variables

Variables are supplied when an agent is created. Pair them with `--new`:

```bash
railway code --codex --new --variable DATABASE_URL=postgres.DATABASE_URL
```

Values can reference other services in the same environment. See [Variables](/variables) for reference syntax.

Load variables from a file:

```bash
railway code --opencode2 --new --env-file .env.agent
```

Repeated `--env-file` inputs are supported; `--variable` overrides matching file entries. These options do not update an already running agent's environment.

## Local Desktop configuration

`railway ca desktop` adds a managed entry to `~/.ssh/config`. Claude also receives an entry in `~/.claude/settings.json`. Codex discovers the SSH alias itself. OpenCode receives a server connection and remote project in its own Desktop store, with standard and Beta handled independently.

Use `--dry-run` to preview configuration, `--ssh-config <path>` to select a different SSH file, and `--alias <name>` to choose the host alias. Apps that read the default SSH file need access to the alternate configuration if you change it.

Setup preserves unrelated settings and backs up the files it changes. `--remove` removes the managed connection; it is separate from deleting the VM.

[Desktop setup reference →](/cli/ca#desktop)
