---
title: Cloud agents
description: Run Claude Code, Codex, or Grok CLI on a persistent Railway virtual machine. Hand off tasks, manage sessions from the terminal or dashboard, and reconnect with your work still in place.
---

<Banner variant="primary">Cloud agents are available through <a href="/platform/priority-boarding" target="_blank">Priority Boarding</a>. Breaking changes may occur.</Banner>

Cloud agents are persistent virtual machines on Railway, built for running coding agents. Launch Claude Code, Codex, or Grok CLI on Railway infrastructure, hand it a task, and close your laptop. The agent keeps its disk between runs, so the work is still there when you come back.

Each agent runs signed in as you, using the subscriptions and credentials you already have. The VM ships with a full development toolchain, a pre-authenticated Railway CLI and GitHub CLI, and a public URL, so an agent can build, run, and demo work with no setup.

## Quick start

Four steps take you from nothing to a running agent you can hand work to.

### 1. Install the Railway CLI

```bash
curl -fsSL agents.railway.com | sh
```

Sign in with `railway login`. Other install methods are covered in the [CLI docs](/cli#installing-the-cli).

### 2. Configure cloud agents

```bash
railway ca setup
```

Setup asks four questions and saves the answers, so later launches need no flags:

- **Default project**: where your agents live. Let Railway create a "Cloud Agents" project, or pick an existing one.
- **Default coding agent**: Claude Code, Codex, or Grok CLI.
- **Skills**: whether to bring your local [agent skills](/ai/agent-skills) to every agent.
- **Theme**: the colors `railway ca` draws with.

### 3. Launch an agent

Pick the path that fits how you work:

**Terminal interface.** Run `railway ca`, type a task into the prompt, and press `enter`. Railway creates the agent and hands it your task:

```bash
railway ca
```

<Image
  src="/cloud-agents/ca-menu.png"
  alt="The railway ca menu with a prompt box, New Session, New Cloud Agent, and Manage Cloud Agents actions, and a target project indicator"
  layout="responsive"
  width={2672}
  height={1521}
  quality={100}
/>

**Direct launch.** Run `railway code` to launch your default coding agent and hand your terminal to it:

```bash
railway code
```

**Dashboard.** Navigate to the **Agents** tab in your project, pick a coding agent, describe the task, and launch. The agent runs in an embedded console you can watch and type into.

### 4. Return to your work

Sessions keep running after you disconnect. Come back with any of:

- `railway ca`, which shows your agents and the sessions still running on them. Press `enter` on a session to reconnect.
- `railway code`, which wakes your agent and drops you back into the coding agent.
- SSH, for a plain shell on the machine: press `c` on a session in `railway ca`, or click **Copy SSH** in the dashboard, and paste the command.

The rest of this page unpacks how agents behave and every way to drive them.

## How cloud agents work

A cloud agent is one virtual machine, scoped to a Railway [environment](/environments) and owned by you. Every supported coding agent is installed on the machine image and configured on each boot, so launching installs nothing.

The disk persists for the life of the agent. Disconnecting puts the agent to sleep, which stops compute billing and keeps the disk, and the next launch wakes it with your files in place.

Agents are personal. They hold your credentials, so Railway never attaches you to a teammate's agent, and teammates never see yours in the CLI.

### What's on the machine

Agents start from an Ubuntu image built for development work:

- Claude Code, Codex, and Grok CLI, preinstalled and configured on boot
- git and the GitHub CLI, authenticated with your GitHub token so `git` and `gh` reach your repositories
- The Railway CLI, pre-authenticated against your account
- Node.js LTS with pnpm and yarn, Python with uv, and `mise` for other toolchains on demand
- Common tools: ripgrep, jq, `psql`, sqlite3, build-essential, and a Chromium browser the agents can drive

### Serve traffic from an agent

Each agent gets a public domain that serves port 8080 and stays the same across sleep and wake. The domain is available inside the VM as `RAILWAY_PUBLIC_DOMAIN`, so an agent can start a dev server and hand you a live URL to review its work.

For production traffic, deploy a [service](/services) with a [public domain](/networking/public-networking) instead.

## Manage agents in the dashboard

The **Agents** tab in your project lists every agent with a live status: working, needs input, or ready. Create one by picking a coding agent and optionally describing a goal.

Opening an agent shows an embedded console with a tab per session, so you can watch an agent work, answer its questions, and start new sessions from the browser. The agent's page also links its public domain, copies an SSH command, and destroys the agent when you're done.

## Manage agents in the terminal

Select **Manage Cloud Agents** in `railway ca` to open a tree of your projects, environments, agents, and sessions, with the connected session rendered beside it:

<Image
  src="/cloud-agents/ca-manage.png"
  alt="The railway ca manage view with a project tree on the left and a connected Claude Code session running a task on the right"
  layout="responsive"
  width={2672}
  height={1521}
  quality={100}
/>

The keys you'll use most:

| Key | Does |
|-----|------|
| `enter` | Connects to a session and types in it |
| `shift+esc` or `^]` | Returns the keyboard to the tree |
| `n` | Starts another session on the agent |
| `s` / `w` / `d` | Sleeps, wakes, or deletes the agent |
| `c` | Copies an SSH command for the session |
| `^t` | Changes the target project |

Press `?` for the full list, or see the [`railway ca` reference](/cli/ca).

Give a session the whole screen with `⌥f`, which restores the tree when pressed again. `shift+enter` leaves the interface entirely and connects full screen:

<Image
  src="/cloud-agents/ca-full-screen.png"
  alt="A full screen Claude Code session in railway ca, with keys to restore the tree, stop typing, and switch sessions"
  layout="responsive"
  width={2672}
  height={1521}
  quality={100}
/>

## Launch with railway code

`railway code` is the launcher without the interface: one command that wakes or creates your agent, delivers your credential, and hands your terminal to the coding agent.

```bash
railway code --claude
```

With no agent flag it launches the default saved by `railway ca setup`. Arguments after `--` pass through to the coding agent, and Railway exits when the agent finishes:

```bash
railway code --codex -- exec "explain this codebase"
```

All flags are covered in the [`railway code` reference](/cli/code).

## Work in sessions

Work happens in durable sessions. A session survives the connection that started it, so closing your terminal doesn't stop the agent, and reconnecting attaches to the same session rather than starting over.

An agent can run several sessions at once. Press `n` on an agent in `railway ca`, or start one from the dashboard, and each session gets its own terminal. Sessions share the agent's one disk, so two agents editing the same files will conflict, the same as two terminals would.

Sleeping an agent stops its processes, including running sessions. The coding agent's conversation history lives on the disk, so the next launch picks up where it left off.

Sessions start in `/app`, which is where the coding agents are configured to work.

## Choose where agents run

Cloud agents live in a project environment. Railway resolves the target in this order:

| Order | Source |
|-------|--------|
| 1 | The `--project` and `--environment` flags |
| 2 | The default project saved by `railway ca setup` |
| 3 | The [linked project](/cli/link) in the working directory |
| 4 | `railway ca setup`, which Railway opens when nothing above applies |

Change the default in setup, or with `^t` in `railway ca`.

## Reuse and create agents

Railway remembers one agent per environment. Running `railway code` again reuses it, which keeps your disk and avoids paying for a second machine. When there's no local record, such as on a second computer, Railway adopts the agent you own in that environment. If you own several and Railway can't tell which one you mean, it asks you to pick one with `railway ca`.

Pass `--new` to create a fresh agent, and `--name` to name it:

```bash
railway code --claude --new --name reviews
```

## Manage the agent lifecycle

Cloud agents have no idle timeout, so nothing stops one on its own. Disconnecting puts the agent to sleep. The next launch wakes it with your work in place.

| Action | How |
|--------|-----|
| Sleep on disconnect | Default behavior |
| Stay running after you disconnect | `railway code --keep-awake` |
| Destroy the agent and its disk | `railway code --rm` |
| Sleep, wake, or delete a specific agent | `railway ca`, then `s`, `w`, or `d` |

<Banner variant="warning">
A running agent bills for compute even when nothing is connected to it. Use `--keep-awake` when you want a task to continue after you disconnect, and expect the cost.
</Banner>

An agent reports one of six statuses: starting, running, sleeping, crashed, failed, or deleting. A crashed or failed agent can't be woken. Create a new one with `--new`.

### Pricing

Cloud agents run on Railway's virtual machine primitive and bill at [VM rates](/pricing/plans#vm-pricing-beta): $50 per vCPU and $50 per GB of memory per month, prorated to the minute, plus $0.05 per GB of network egress. A sleeping agent doesn't bill for compute.

### Specs and limits

VM size follows your workspace [plan](/pricing/plans) and isn't configurable:

| Plan | vCPU | Memory |
|------|------|--------|
| Trial | 2 | 1 GB |
| Free | 2 | 1 GB |
| Hobby | 2 | 2 GB |
| Pro | 4 | 4 GB |

Enterprise workspaces use the Pro sizing. Creation is limited to 25 agents per user per day.

## Deliver credentials

Railway reads your coding agent's credential on your own machine and writes it to the VM over SSH. It doesn't store the credential: it never becomes a Railway variable, part of an image, or an argument on a command line.

| Agent | Flag | Credential |
|-------|------|------------|
| Claude Code | `--claude` | A token minted by `claude setup-token`, cached in `~/.railway/claude-code-token` and reused. Set `CLAUDE_CODE_OAUTH_TOKEN` or `ANTHROPIC_API_KEY` to skip minting |
| Codex | `--codex` | Your local `~/.codex/auth.json` |
| Grok CLI | `--grok` | Your local `~/.grok/auth.json` |

Claude Code's local sign-in uses a rotating refresh token, which is why Railway mints a separate token for the VM instead of copying it. Minting runs the `claude` binary on your machine and opens your browser once. If minting fails, Railway asks you to run `claude setup-token` yourself and paste the result. To mint a replacement after revoking a token, or when authentication fails on an agent you already have, run:

```bash
railway code --claude --refresh-auth
```

Running `railway logout` deletes the cached token from your machine. Revoking it upstream is separate.

## Sync your skills

Cloud agents can bring the [agent skills](/ai/agent-skills) you use locally. Turn this on in `railway ca setup` and pick which directory to read:

- `~/.claude/skills`
- `~/.codex/skills`
- `~/.grok/skills`
- `~/.agents/skills`

Railway packs that directory on each launch, unpacks it on the VM, and links each skill into the skills directory of all three coding agents. Syncing is add-only: it links a skill only when nothing already holds that name, so Railway's own skills stay the versions baked into the image.

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

## Connect over SSH

Every agent accepts SSH, which gives you a plain shell alongside whatever the coding agent is doing:

```bash
ssh agent:<environment-id>:<agent-id>@ssh.railway.com
```

Copy a ready-made command with `c` on a session in `railway ca`, or with **Copy SSH** on the agent's dashboard page. The agent must be awake to accept a connection.
