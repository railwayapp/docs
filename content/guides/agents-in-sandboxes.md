---
title: Use Agents in Railway Sandboxes
description: Drive Railway sandboxes from your local AI coding agent. Spin up isolated environments for development, run agents against your real infrastructure, and use the create, configure, checkpoint, and fork loop to move fast.
date: "2026-06-24"
tags:
  - agents
  - sandboxes
  - claude
  - cli
topic: ai
---

<Banner variant="primary">Sandboxes are available through <a href="/platform/priority-boarding" target="_blank">Priority Boarding</a>. Breaking changes may occur.</Banner>

A [sandbox](/sandboxes) is a short-lived, isolated Linux environment you provision on demand, run commands in, and destroy. This guide covers how to fold sandboxes into your development loop and let your local AI coding agent drive them.

Two layers of agents come together here. Your local agent, like Claude Code or Codex running on your laptop, drives sandboxes through the [Railway CLI](/cli) or the [TypeScript SDK](/sandboxes#typescript-sdk). Inside the sandbox, the same agent harnesses ship in the default image, so the environment can run untrusted code, test against real infrastructure, and do the work without you bootstrapping a toolchain each time.

By the end, you'll understand where sandboxes fit in your flow: create an environment from a known base, configure it for the task, checkpoint the prepared state, fork it when the work branches, and tear it all down when you're done.

## Why sandboxes for development

A sandbox isn't a shell floating off to the side. Because it lives in a Railway [environment](/environments), it can join the same [private network](/networking/private-networking) as the rest of your services. That changes what an agent can do inside one.

- **Isolation for untrusted work.** Run agent-generated code, dependency installs, and migrations in a throwaway environment instead of on your machine.
- **Access to real infrastructure.** Create a sandbox on the private network and it can reach the [Postgres](/databases/postgresql), [Redis](/databases/redis), and internal services already in your project, so agents test against the same infrastructure they'll ship against.
- **A branchable workspace.** Snapshot expensive setup once, then boot or fork as many copies as you need. Each new run is one command, not a fresh bootstrap.

## The development loop

The loop most teams adopt with sandboxes looks like this:

```txt
template -> create -> configure -> checkpoint -> create/fork -> verify -> destroy
```

Each step maps to a sandbox primitive:

1. **Template:** build a reusable base with your common packages and tooling.
2. **Create:** start a sandbox from that base.
3. **Configure:** clone a repo, install dependencies, write guidance files, seed variables.
4. **Checkpoint:** snapshot the prepared state into a named, server-side snapshot.
5. **Create or fork:** boot fresh sandboxes from the checkpoint, or fork a running one when the work branches.
6. **Verify:** run the agent, run tests, inspect the result.
7. **Destroy:** tear down the temporary sandboxes and reclaim the resources.

The point of the loop is that an agent doesn't rebuild the world every time. It carries forward the useful state and throws away the rest.

## Prerequisites

- A Railway account with [Sandboxes](/sandboxes) enabled through [Priority Boarding](/platform/priority-boarding).
- The [Railway CLI](/cli) installed and logged in with `railway login`.
- A project linked with `railway link`.
- Node.js 22+ if you plan to use the [TypeScript SDK](/sandboxes#typescript-sdk).

## Let your local agent drive sandboxes

Your local coding agent can operate sandboxes the same way it operates the rest of Railway: through the CLI, guided by [Railway Agent Skills](/ai/agent-skills). Install the CLI and configure agent support in one step:

```bash
railway setup agent
```

This adds skills that teach Claude Code, Codex, OpenCode, and Cursor how to drive Railway, including the [`railway sandbox`](/cli/sandbox) commands. Once the skills are installed, you can ask your local agent to create a sandbox, run a command in it, checkpoint it, or fork it, and it knows which commands to run.

The rest of this guide shows the two interfaces your agent drives: the CLI for terminal-driven work, and the SDK for building sandboxes into an application.

## The CLI loop

For most development work, you don't need to write code around a sandbox. The CLI gives you the full loop from your terminal, and the [`railway sandbox`](/cli/sandbox) reference covers every subcommand.

Build a reusable template with your base tooling:

```bash
railway sandbox template build \
  --name node-agent-base \
  -c "apt-get update && apt-get install -y git curl build-essential" \
  -c "curl -fsSL https://bun.sh/install | bash" \
  --wait
```

Start a sandbox from it on the private network so it can reach your services:

```bash
railway sandbox create --template node-agent-base --private-network
```

Run the setup. The CLI keeps an active sandbox for the session, so most commands need no ID:

```bash
railway sandbox exec -- git clone https://github.com/your-org/your-app /root/workspace
railway sandbox exec -- 'cd /root/workspace && /root/.bun/bin/bun install'
```

Checkpoint the prepared state so you can return to it from any machine:

```bash
railway sandbox checkpoint create app-base
```

Boot a fresh sandbox from the checkpoint and run an agent against the code:

```bash
railway sandbox create --checkpoint app-base
railway sandbox exec -- bash -lc 'codex "fix the failing tests and explain the patch"'
```

To see a dev server the sandbox is running, start it in the background with `--detach`, then forward the port back to your machine:

```bash
railway sandbox exec --detach -- 'cd /root/workspace && /root/.bun/bin/bun run dev'
railway sandbox forward 3000
```

When the work branches, fork the active sandbox to try a second approach without disturbing the first:

```bash
railway sandbox fork
railway sandbox exec -- 'cd /root/workspace && /root/.bun/bin/bun run typecheck'
```

Destroy the sandbox when you're done. A short [idle timeout](/sandboxes#idle-timeout) also tears it down automatically:

```bash
railway sandbox destroy
```

## The SDK loop

When you want to build sandboxes into an application, the [TypeScript SDK](/sandboxes#typescript-sdk) is the programmatic interface. It's <a href="https://github.com/railwayapp/railway-ts-sdk" target="_blank">open source on GitHub</a>. Install it with `bun add railway`, or scaffold a new project with `bun create railway@latest`.

The minimal shape creates a sandbox, runs a command, and destroys it:

```ts
import { Sandbox } from "railway";

const sandbox = await Sandbox.create();

const result = await sandbox.exec("git --version");
console.log(result.stdout);

await sandbox.destroy();
```

`Sandbox.create()` reads `RAILWAY_API_TOKEN` and `RAILWAY_ENVIRONMENT_ID` from the environment and resolves once the sandbox is running and ready to accept commands.

### Prepare a base and checkpoint it

The loop gets useful when you stop treating each sandbox as a one-off machine. Define a template for the repeatable base, create a sandbox from it on the private network, run the expensive setup once, then checkpoint the prepared workspace:

```ts
import { Sandbox } from "railway";

const base = Sandbox.template()
  .withPackages("git", "curl", "build-essential")
  .run("curl -fsSL https://bun.sh/install | bash");

const sandbox = await Sandbox.create(base, {
  idleTimeoutMinutes: 30,
  env: {
    RAILWAY_API_TOKEN: process.env.RAILWAY_API_TOKEN!,
    DATABASE_URL: "${{Postgres.DATABASE_URL}}",
  },
  networkIsolation: "PRIVATE",
});

await sandbox.exec(
  "git clone https://github.com/your-org/your-app /root/workspace",
);

await sandbox.files.write(
  "/root/workspace/AGENTS.md",
  [
    "# sandbox guidance",
    "Work in /root/workspace.",
    "Write important results to files before the turn ends.",
  ].join("\n"),
);

const install = await sandbox.exec("/root/.bun/bin/bun install", {
  cwd: "/root/workspace",
});

if (install.exitCode !== 0) {
  console.error(install.stderr);
}

await sandbox.checkpoint("app-base");
```

A few things are happening here:

- The [`${{Postgres.DATABASE_URL}}`](/variables/reference#template-syntax) syntax resolves a Railway variable reference when the sandbox is created.
- [`networkIsolation: "PRIVATE"`](/sandboxes#networking) joins the sandbox to your environment's private network.
- [`sandbox.files.write`](/sandboxes#files) writes an `AGENTS.md` guidance file straight into the workspace, so an agent running inside knows how to behave.

The template handles the repeatable base. The sandbox does the live work. The checkpoint captures the state after the costly setup, so later runs skip it.

**Note:** Sandboxes use [mise](https://mise.jdx.dev/) for the default toolchain. For non-interactive `exec` calls, run commands through `bash -lc` to get the same configured environment the sandbox image expects.

### Run a long-lived agent and detach

A command started with `exec` runs on the sandbox independently of the client that started it, so an agent keeps working even if your process disconnects. Boot a sandbox from the checkpoint, start the agent, and detach with a durable session name:

```ts
import { Sandbox } from "railway";

const sandbox = await Sandbox.create("app-base", {
  env: {
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY!,
  },
});

const agent = sandbox.exec(
  'bash -lc \'claude "inspect the failing tests and propose a fix"\'',
  {
    cwd: "/root/workspace",
    onStdout: (chunk) => process.stdout.write(chunk),
    onStderr: (chunk) => process.stdout.write(chunk),
  },
);

const sessionName = await agent.sessionName;
await agent.detach();

console.log(`Agent is running in session ${sessionName}`);
```

[Long-running commands](/sandboxes#long-running-commands) keep going in the sandbox after you detach. Reattach later from any process by passing the session name back to `exec`:

```ts
const sandbox = await Sandbox.connect(process.env.SANDBOX_ID!);

await sandbox.exec(
  { sessionName: process.env.AGENT_SESSION! },
  {
    resumeFromLastRead: true,
    onStdout: (chunk) => process.stdout.write(chunk),
  },
);
```

You aren't forced to keep one local process alive to keep the work going. The sandbox is where the work happens, and getting back into that state is one call away.

### Fork when the work branches

[Checkpoints](/sandboxes#checkpoints) are best for reusable bases. [Forks](/sandboxes#forking) are best when the work branches from something already running. A fork clones a running sandbox's filesystem into a new, independent one: files are preserved, running processes are not. That's usually what you want, since you copy the workbench, not the half-running experiment.

Install dependencies once, then fork per task to run independent agent attempts in parallel:

```ts
const base = await Sandbox.create("app-base");

const typescriptUpgrade = await base.fork();
const authRefactor = await base.fork();

await Promise.all([
  typescriptUpgrade.exec(
    "bash -lc \"codex 'upgrade this app to TypeScript 5.8 and run tests'\"",
    { cwd: "/root/workspace" },
  ),
  authRefactor.exec(
    "bash -lc \"opencode 'refactor the auth middleware and run tests'\"",
    { cwd: "/root/workspace" },
  ),
]);
```

This is the pattern behind apps like the <a href="https://github.com/codyde/repo-review-agent" target="_blank">Repo Review Agent</a>, which prepares a repository once, checkpoints it, then creates one sandbox per agent: one for tests, one for architecture, one for security, one for product polish. When each run finishes, it collects the results and destroys the temporary sandbox.

## Agents bundled in the default image

The default sandbox image includes [Claude Code](https://docs.anthropic.com/en/docs/claude-code/overview), <a href="https://developers.openai.com/codex/cli/" target="_blank">Codex</a>, <a href="https://opencode.ai/docs/" target="_blank">OpenCode</a>, and <a href="https://pi.dev/" target="_blank">Pi</a>. You don't spend the first minutes of every session reinstalling a harness you've set up many times before.

For now, you pass each agent its configuration or API key. Set the key when you create the sandbox so it's available to every command:

```bash
railway sandbox create --checkpoint app-base --variable ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY
```

In the SDK, pass the key through the `env` option as shown in the long-lived agent example above. Agents that persist credentials to disk, like signing in with `claude auth login` over SSH, keep those credentials through a checkpoint, so you can sign in once and snapshot the authenticated state.

## Templates, checkpoints, and forks

The three primitives look similar but serve different points in the loop.

| Primitive | What it captures | When to use it |
|-----------|------------------|----------------|
| [Template](/sandboxes#templates) | An ordered list of build steps, content-addressed and cached | A repeatable base: install common packages, set up language tooling, prewarm a known environment |
| [Checkpoint](/sandboxes#checkpoints) | The disk of a running sandbox as a named, server-side snapshot | After expensive live setup: cloned repo, installed dependencies, generated assets, migrated fixtures |
| [Fork](/sandboxes#forking) | A clone of a running sandbox into another running sandbox | When the work branches right now: compare two fixes, run parallel agent attempts |

A template is built from instructions and rebuilds cheaply. A checkpoint outlives its source sandbox, so you can destroy the original and still create from the checkpoint later. A fork needs a running source and copies its disk, not its processes.

## Next steps

Explore these resources to go deeper on sandboxes and agents:

- [Sandboxes](/sandboxes): concepts, the SDK reference, networking, and limits.
- [`railway sandbox` CLI reference](/cli/sandbox): templates, checkpoints, forks, exec, and port forwarding.
- [Railway for Agents](/agents): the broader agent setup with the CLI, MCP, and skills.
- [Agent Skills](/ai/agent-skills): teach your local agent to drive Railway.
- [Running Agents on Railway](/guides/running-agents-on-railway): deploy an always-on, autonomous agent as a service.
</content>
</invoke>
