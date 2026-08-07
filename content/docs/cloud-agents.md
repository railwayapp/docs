---
title: Cloud agents
description: Run Claude Code, Codex, or Grok CLI on a persistent Railway virtual machine using your own credentials. Launch from the CLI, keep several sessions open at once, and pick up where you left off.
---

<Banner variant="primary">Cloud agents are available through <a href="/platform/priority-boarding" target="_blank">Priority Boarding</a>. Breaking changes may occur.</Banner>

A cloud agent is a persistent Linux virtual machine that runs a coding agent signed in as you.

Each cloud agent is scoped to a Railway [environment](/environments) and keeps its disk between runs, so the work an agent did yesterday is still there when you reconnect.

Railway supports three coding agents: Claude Code, Codex, and Grok CLI.

## How it works

Every supported coding agent is already installed on the machine image, and Railway configures them on each boot. Launching installs nothing, so an agent is ready to work as soon as the machine is running.

Railway reads your credentials on your own machine and writes them to the VM over SSH. It doesn't store them: they never become a Railway variable, part of an image, or an argument on a command line.

Work happens in durable sessions. A session survives the SSH connection that started it, so closing your terminal doesn't stop the agent, and reconnecting attaches to the same screen rather than starting over.

## Launch an agent

Two commands launch a cloud agent, and both accept the same flags.

Use [`railway code`](/cli/code) to launch one agent and hand your terminal to it:

```bash
railway code --claude
```

Use [`railway ca`](/cli/ca) to browse your projects, agents, and sessions in a terminal interface first:

```bash
railway ca
```

Both read the same preferences, so the choice between them is whether you want to browse before you launch.

## Choose where agents run

Cloud agents live in a project environment. Set a default once, and every launch uses it:

```bash
railway ca setup
```

The setup flow can create a project named "Cloud Agents" for you, or point at one you already have. You can change the default later in setup, or with `^t` in `railway ca`.

Railway resolves the target in this order:

| Order | Source |
|-------|--------|
| 1 | The `--project` and `--environment` flags |
| 2 | The default project saved by `railway ca setup` |
| 3 | The [linked project](/cli/link) in the working directory |
| 4 | `railway ca setup`, which Railway opens when nothing above applies |

The saved default takes precedence over a linked directory. Linking describes what you deploy, so running `railway code` inside a service's checkout doesn't put an agent in that project.

## Reuse and create agents

Railway remembers one agent per environment. Running `railway code` again reuses it, which keeps your disk and avoids paying for a second machine.

When there's no local record of which agent to use, such as on a second computer, Railway adopts your existing agent in that environment. It only considers agents you own, so it can't attach your credentials to a teammate's machine. If you own several and Railway can't tell which one you mean, it lists them and asks you to pick one with `railway ca`.

Pass `--new` to create a fresh agent instead of reusing one:

```bash
railway code --claude --new
```

## Manage the agent lifecycle

Cloud agents have no idle timeout, so nothing stops one on its own. Disconnecting puts the agent to sleep, which stops billing for compute and keeps the disk. The next launch wakes it with your work in place.

| Action | How |
|--------|-----|
| Sleep on disconnect | Default behavior |
| Stay running after you disconnect | `railway code --keep-awake` |
| Destroy the agent and its disk | `railway code --rm` |
| Sleep, wake, or delete a specific agent | `railway ca`, then `s`, `w`, or `d` |

<Banner variant="warning">
A running agent bills for compute even when nothing is connected to it. Use `--keep-awake` when you want a task to continue after you disconnect, and expect the cost.
</Banner>

Waking a machine takes longer than resuming a session. Railway reports the agent as waking until the VM is up, then as running.

## Deliver credentials

Each coding agent signs in differently, so each one carries its credential differently.

| Agent | Flag | Credential |
|-------|------|------------|
| Claude Code | `--claude` | A token minted by `claude setup-token`, cached in `~/.railway/claude-code-token` and reused. Set `CLAUDE_CODE_OAUTH_TOKEN` or `ANTHROPIC_API_KEY` to skip minting |
| Codex | `--codex` | Your local `~/.codex/auth.json` |
| Grok CLI | `--grok` | Your local `~/.grok/auth.json` |

Claude Code's local sign-in uses a rotating refresh token, which is why Railway mints a separate token for the VM instead of copying it. Minting opens your browser once. To mint a replacement after revoking a token, or when authentication fails on an agent you already have, run:

```bash
railway code --claude --refresh-auth
```

Add `--gh` to include your GitHub token, read with `gh auth token`, so `git` and `gh` can reach your repositories over HTTPS from inside the agent:

```bash
railway code --claude --gh
```

Minting runs the `claude` binary on your machine, so Claude Code must be installed locally even though the VM is what uses the token.

Running `railway logout` deletes the cached token from your machine. Revoking it upstream is separate.

## Sync your skills

Cloud agents can bring the [agent skills](/ai/agent-skills) you use locally. Turn this on in `railway ca setup` and pick which directory to read:

- `~/.claude/skills`
- `~/.codex/skills`
- `~/.grok/skills`
- `~/.agents/skills`

Railway packs that directory on each launch and unpacks it into `~/.railway-skills` on the VM, then links each skill into `~/.claude/skills`, `~/.codex/skills`, and `~/.grok/skills`. Syncing is add-only: it links a skill only when nothing already holds that name, so Railway's own skills stay the versions baked into the image.

Two limits apply. A packed directory over 2 MB warns, and one over 10 MB fails before Railway creates a machine. Railway skips the upload when the contents haven't changed since the last launch.

Turning skills sync off later leaves whatever is already on an agent.

## Set variables

Variables reach a cloud agent when it's created, so pair them with `--new`:

```bash
railway code --codex --new --variable DATABASE_URL=postgres.DATABASE_URL
```

Values can reference variables from other services in the environment, using either the short form above or the full `${{postgres.DATABASE_URL}}` form. Railway resolves them when the agent is created. See [Variables](/variables) for the reference syntax.

Load variables from a file with `--env-file`. Any `--variable` flag overrides a file entry with the same key:

```bash
railway code --codex --new --env-file .env
```

## Store preferences

`railway ca setup` writes your answers to `~/.railway/agent-prefs.json` with owner-only permissions.

| Field | Holds |
|-------|-------|
| `agent` | The coding agent to launch when no flag is passed |
| `default_project` | The project and environment agents run in |
| `skills` | Whether to sync skills, and which directory to read |
| `theme` | The color theme `railway ca` draws with |

A flag always beats the file. `RAILWAY_CA_AGENT` overrides the saved agent for a single run.

To read the file back without opening it:

```bash
railway ca setup --show
```

## Work in the VM

Sessions start in `/app`, which is where the coding agent is configured to work. Files written anywhere on the disk persist between runs.

Every session runs on the same machine, so several agents working at once share one disk. Two agents editing the same files will conflict, the same as two terminals would.
