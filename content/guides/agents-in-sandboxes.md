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

A [sandbox](/sandboxes) is a short-lived, isolated Linux environment you provision on demand, run commands in, and destroy. This guide covers how to fold sandboxes into your development loop and let agents do real work inside them.

Two layers of agents come together here. Your local agent, like Claude Code or Codex running on your laptop, drives sandboxes through the [Railway CLI](/cli) or the [TypeScript SDK](/sandboxes#typescript-sdk). Inside the sandbox, the same agent harnesses ship in the default image, so the environment can run untrusted code, test against your real infrastructure, and do the work without you bootstrapping a toolchain each time.

The guide builds toward a concrete example: the <a href="https://github.com/codyde/repo-review-agent" target="_blank">Repo Review Agent</a>, an app that prepares a repository once, then fans out one sandbox per agent to review it for bugs, architecture, security, and product polish. By the end, you'll understand where each sandbox primitive fits in that flow.

## Why sandboxes for development

A sandbox isn't a shell floating off to the side. Because it lives in a Railway [environment](/environments), it can join the same [private network](/networking/private-networking) as the rest of your services. That changes what an agent can do inside one.

- **Isolation for untrusted work.** Run agent-generated code, dependency installs, and migrations in a throwaway environment instead of on your machine.
- **Access to real infrastructure.** Create a sandbox on the private network and it can reach the [Postgres](/databases/postgresql), [Redis](/databases/redis), and internal services already in your project, so agents test against the same infrastructure they'll ship against.
- **A branchable workspace.** Snapshot expensive setup once, then boot or fork as many copies as you need. Each new run is one command, not a fresh bootstrap.

## The development loop

The loop most teams adopt with sandboxes looks like this:

```txt
create -> configure -> checkpoint -> create/fork -> verify -> destroy
```

Each step maps to a sandbox primitive:

1. **Create:** start a sandbox. The default image already ships git, Node, npm, and the agent harnesses, so most work needs no setup image.
2. **Configure:** clone a repo, install dependencies, sign agents in, write guidance files, seed variables.
3. **Checkpoint:** snapshot the prepared state into a named, server-side snapshot.
4. **Create or fork:** boot fresh sandboxes from the checkpoint, or fork a running one when the work branches.
5. **Verify:** run the agent, run tests, inspect the result.
6. **Destroy:** tear down the temporary sandboxes and reclaim the resources.

The point of the loop is that an agent doesn't rebuild the world every time. It carries forward the useful state and throws away the rest.

## Prerequisites

- A Railway account with [Sandboxes](/sandboxes) enabled through [Priority Boarding](/platform/priority-boarding).
- The [Railway CLI](/cli) installed and logged in with `railway login`.
- A project linked with `railway link`.
- Node.js 22+ if you plan to use the [TypeScript SDK](/sandboxes#typescript-sdk).

## Drive sandboxes from the CLI

For most development work, you don't need to write code around a sandbox. The CLI gives you the full loop from your terminal, and the [`railway sandbox`](/cli/sandbox) reference covers every subcommand. Your local agent can run these same commands once you install [Railway Agent Skills](/ai/agent-skills) with `railway setup agent`, which teaches Claude Code, Codex, OpenCode, and Cursor how to drive Railway.

### Sign agents in once and checkpoint the result

The agent harnesses are in the image, but each one still needs credentials. Sign them in once, then capture a checkpoint so every later sandbox boots already authenticated. This is the one-time configuration the Repo Review Agent depends on.

Create a sandbox and open a shell in it:

```bash
railway sandbox create
railway sandbox ssh
```

Inside the sandbox, sign in to each agent you plan to use:

```bash
claude auth login    # Anthropic OAuth
codex login          # OpenAI / ChatGPT
opencode auth login  # choose a provider, then paste the key
```

`claude`, `codex`, and `opencode` each persist credentials to disk, so they survive a checkpoint. Pi has no interactive login and reads its key from `ANTHROPIC_API_KEY` at runtime, so you pass that key in at create time instead.

Exit the shell and capture the authenticated state under a name you'll reuse:

```bash
railway sandbox checkpoint create agent-box
```

The checkpoint is stored server-side in the environment, so you can destroy the original sandbox and still boot from `agent-box` from any machine.

### Run the loop

Create a sandbox on the private network so it can reach your other services. The default image already has the toolchain, so there's nothing to pre-install:

```bash
railway sandbox create --checkpoint agent-box --private-network
```

Clone a repo and install dependencies. The CLI keeps an active sandbox for the session, so these commands need no ID. Run non-interactive commands through `bash -lc` to get the sandbox's configured [mise](https://mise.jdx.dev/) toolchain:

```bash
railway sandbox exec -- bash -lc 'git clone https://github.com/codyde/repo-review-agent /root/workspace'
railway sandbox exec -- bash -lc 'cd /root/workspace && npm ci'
```

Checkpoint the prepared workspace so you can return to it without repeating the clone and install:

```bash
railway sandbox checkpoint create repo-ready
```

Boot a fresh sandbox from that checkpoint and run an agent against the code:

```bash
railway sandbox create --checkpoint repo-ready
railway sandbox exec -- bash -lc 'cd /root/workspace && codex exec "review the repo for likely bugs and explain what you would change"'
```

To watch a dev server the sandbox is running, start it in the background with `--detach`, then forward the port back to your machine. The Repo Review Agent binds `PORT=8080`, so forward `8080`:

```bash
railway sandbox exec --detach -- bash -lc 'cd /root/workspace && npm run dev'
railway sandbox forward 8080
```

When the work branches, fork the active sandbox to try a second approach without disturbing the first, then destroy what you no longer need:

```bash
railway sandbox fork
railway sandbox exec -- bash -lc 'cd /root/workspace && npm run build'
railway sandbox destroy
```

A short [idle timeout](/sandboxes#idle-timeout) also tears a sandbox down automatically if you forget.

## Build the flow into an app with the SDK

When you want sandboxes inside an application instead of your terminal, the [TypeScript SDK](/sandboxes#typescript-sdk) is the programmatic interface. It's <a href="https://github.com/railwayapp/railway-ts-sdk" target="_blank">open source on GitHub</a>. Install it with `bun add railway`, or scaffold a new project with `bun create railway@latest`.

The minimal shape creates a sandbox, runs a command, and destroys it:

```ts
import { Sandbox } from "railway";

const sandbox = await Sandbox.create();

const result = await sandbox.exec("git --version");
console.log(result.stdout);

await sandbox.destroy();
```

`Sandbox.create()` reads `RAILWAY_API_TOKEN` and `RAILWAY_ENVIRONMENT_ID` from the environment and resolves once the sandbox is running and ready to accept commands.

The Repo Review Agent builds the full loop on top of that. Its flow, defined in `src/lib/review.server.ts`, runs end to end on each review:

```txt
create from agent-box -> clone -> install/build -> checkpoint -> sandbox per agent -> review -> destroy
```

The sections below walk through that pipeline.

### Share one set of sandbox options

Every sandbox in the app is created with the same token, environment, idle timeout, and the provider keys the harnesses read at runtime. The app centralizes them so each `create` call is consistent:

```ts
import { Sandbox } from "railway";

function sandboxOptions() {
  return {
    token: process.env.RAILWAY_API_TOKEN!,
    environmentId: process.env.RAILWAY_ENVIRONMENT_ID!,
    idleTimeoutMinutes: 30,
    env: {
      // Pi reads ANTHROPIC_API_KEY at runtime; the others fall back to it.
      ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY!,
      OPENAI_API_KEY: process.env.OPENAI_API_KEY!,
      OPENCODE_API_KEY: process.env.OPENCODE_API_KEY!,
    },
  };
}
```

`env` bakes variables into the sandbox for its whole lifetime, available to every command. Values can reference other Railway variables, for example [`${{Postgres.DATABASE_URL}}`](/variables/reference#template-syntax), resolved when the sandbox is created. Pair an internal reference with `networkIsolation: "PRIVATE"` so the sandbox can resolve it over the [private network](/sandboxes#networking).

### Prepare the repository once, then checkpoint it

Boot the base sandbox from the `agent-box` checkpoint you captured with the CLI, clone the target repo, install dependencies, and run a build to verify the workspace is sound. Then checkpoint the prepared state under a fresh name:

```ts
const base = await Sandbox.create("agent-box", sandboxOptions());

// Clone and install in one shell so the working directory carries across.
await base.exec(
  "bash -lc 'git clone --depth 1 https://github.com/codyde/repo-review-agent /root/workspace && cd /root/workspace && npm ci'",
);

// Drop guidance for the agents that will run inside.
await base.files.write(
  "/root/workspace/AGENTS.md",
  [
    "# sandbox guidance",
    "Work in /root/workspace.",
    "Do not modify files. Write findings to the final message.",
  ].join("\n"),
);

// Verify the workspace builds before snapshotting it.
const build = await base.exec("bash -lc 'cd /root/workspace && npm run build'", {
  timeoutSec: 900,
});
if (build.exitCode !== 0) console.error(build.stderr);

const checkpoint = `repo-ready-${process.env.JOB_ID}`;
await base.checkpoint(checkpoint);
```

`exec` doesn't throw on a non-zero exit code, so the app inspects `exitCode` and `timedOut` after each step. The [`base.files.write`](/sandboxes#files) call writes an `AGENTS.md` guidance file straight into the workspace, so an agent running inside knows how to behave. The checkpoint captures the cloned, installed, verified workspace, so every agent run skips that setup.

### Fan out one sandbox per agent

With the prepared checkpoint in hand, the app creates one sandbox per agent and runs each harness in headless mode against the same starting state. Because every sandbox boots from the same checkpoint, the reviews are isolated and run in parallel:

```ts
const agents = [
  { id: "codex", prompt: "Review this repo for likely bugs and missing tests." },
  { id: "claude", prompt: "Review this repo for architecture and maintainability risks." },
  { id: "opencode", prompt: "Triage this repo for security issues: auth, secrets, injection." },
  { id: "pi", prompt: "Review this repo from a product and UX angle." },
];

function commandFor(id: string, prompt: string) {
  switch (id) {
    case "codex":
      return `codex exec --json --dangerously-bypass-approvals-and-sandbox ${quote(prompt)}`;
    case "claude":
      return `claude --print --output-format json --permission-mode dontAsk ${quote(prompt)}`;
    case "opencode":
      return `opencode run --format json -- ${quote(prompt)}`;
    case "pi":
      return `pi --print --mode json --no-session --approve --tools read,grep,find,ls ${quote(prompt)}`;
  }
}

const results = await Promise.all(
  agents.map(async (agent) => {
    const sandbox = await Sandbox.create(checkpoint, sandboxOptions());
    try {
      const result = await sandbox.exec(
        `bash -lc 'cd /root/workspace && ${commandFor(agent.id, agent.prompt)}'`,
        { timeoutSec: 900 },
      );
      return { id: agent.id, summary: result.stdout };
    } finally {
      await sandbox.destroy().catch(() => {});
    }
  }),
);
```

Each harness runs with the flags that make it non-interactive: `--print` and `--permission-mode dontAsk` for Claude Code, `codex exec` with approvals bypassed, `opencode run`, and `pi --print --approve`. The `--json` and `--format json` flags give the app structured output it can parse into a summary per agent. `quote` shell-escapes the prompt so it travels safely inside the `bash -lc` string. Wrapping every sandbox run in `try`/`finally` guarantees the sandbox is destroyed even when a review throws.

### Clean up the base and the checkpoint

When all reviews finish, destroy the base sandbox and delete the temporary checkpoint so neither counts against your [environment's sandbox limit](/sandboxes#sandbox-limits-per-environment):

```ts
await base.destroy().catch(() => {});
await Sandbox.deleteCheckpoint(checkpoint, sandboxOptions()).catch(() => {});
```

The reusable `agent-box` checkpoint stays in place. The next review boots from it again, so the only per-run cost is the clone, install, and the agent work itself.

### Keep a long-lived agent running after you disconnect

A command started with `exec` runs on the sandbox independently of the client that started it, so an agent keeps working even if your process disconnects. Start the agent, grab its durable `sessionName`, and detach:

```ts
const sandbox = await Sandbox.create("repo-ready", sandboxOptions());

const agent = sandbox.exec(
  `bash -lc 'cd /root/workspace && claude -p "review src/lib/review.server.ts and propose improvements"'`,
  { onStdout: (chunk) => process.stdout.write(chunk) },
);

const sessionName = await agent.sessionName;
await agent.detach(); // stop streaming; the command keeps running
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

### Fork instead of recreating when the work branches

The app creates a new sandbox per agent from the checkpoint, but forking is an option when you're branching from a sandbox that's already running. A [fork](/sandboxes#forking) clones a running sandbox's filesystem into a new, independent one: files are preserved, running processes are not. Install dependencies once, then fork per task:

```ts
const base = await Sandbox.create("repo-ready", sandboxOptions());

const bugReview = await base.fork();
const securityReview = await base.fork();

await Promise.all([
  bugReview.exec(
    "bash -lc \"cd /root/workspace && codex exec 'find likely bugs in src/lib/review.server.ts, then run npm run build'\"",
  ),
  securityReview.exec(
    "bash -lc \"cd /root/workspace && opencode run 'audit the sandbox exec calls for command injection'\"",
  ),
]);
```

A fork copies the workbench, not the half-running experiment, which is usually what you want when you split one prepared workspace into parallel attempts.

## Agents bundled in the default image

The default sandbox image includes [Claude Code](https://docs.anthropic.com/en/docs/claude-code/overview), <a href="https://developers.openai.com/codex/cli/" target="_blank">Codex</a>, <a href="https://opencode.ai/docs/" target="_blank">OpenCode</a>, and <a href="https://pi.dev/" target="_blank">Pi</a>. You don't spend the first minutes of every session reinstalling a harness you've set up many times before.

For now, you pass each agent its configuration or API key. There are two ways to get credentials into a sandbox:

- **Sign in and checkpoint** for harnesses that persist credentials to disk, like `claude auth login`. The authenticated state survives the checkpoint, as shown in [the CLI setup above](#sign-agents-in-once-and-checkpoint-the-result).
- **Pass a key at create time** for harnesses that read from the environment, like Pi reading `ANTHROPIC_API_KEY`. Use `--variable` in the CLI or the `env` option in the SDK:

```bash
railway sandbox create --checkpoint agent-box --variable ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY
```

## Templates, checkpoints, and forks

The three primitives look similar but serve different points in the loop.

| Primitive | What it captures | When to use it |
|-----------|------------------|----------------|
| [Template](/sandboxes#templates) | An ordered list of build steps, content-addressed and cached | A repeatable base for tooling the default image doesn't include |
| [Checkpoint](/sandboxes#checkpoints) | The disk of a running sandbox as a named, server-side snapshot | After expensive live setup: signed-in agents, cloned repo, installed dependencies |
| [Fork](/sandboxes#forking) | A clone of a running sandbox into another running sandbox | When the work branches right now: parallel agent attempts from one prepared workspace |

A template is built from instructions and rebuilds cheaply, but the Repo Review Agent skips it because git, Node, npm, and the agents already ship in the image. A checkpoint outlives its source sandbox, so you can destroy the original and still create from it later. A fork needs a running source and copies its disk, not its processes.

## Next steps

Explore these resources to go deeper on sandboxes and agents:

- [Sandboxes](/sandboxes): concepts, the SDK reference, networking, and limits.
- [`railway sandbox` CLI reference](/cli/sandbox): templates, checkpoints, forks, exec, and port forwarding.
- [Railway for Agents](/agents): the broader agent setup with the CLI, MCP, and skills.
- [Agent Skills](/ai/agent-skills): teach your local agent to drive Railway.
- [Running Agents on Railway](/guides/running-agents-on-railway): deploy an always-on, autonomous agent as a service.
