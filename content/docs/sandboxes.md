---
title: Sandboxes
description: Provision ephemeral, isolated Linux environments on Railway. Create them from the dashboard, CLI, or TypeScript SDK, run commands in them, and tear them down when done.
---

<Banner variant="primary">Sandboxes are available through <a href="/platform/priority-boarding" target="_blank">Priority Boarding</a>. Breaking changes may occur.</Banner>

Sandboxes are short-lived Linux environments you can provision on demand, run commands in, and destroy.

Each sandbox is scoped to a Railway [environment](/environments) and runs on Railway's virtual machine primitive, giving you isolated, on-demand compute for anything you'd run on a VM.

## How it works

Each sandbox is a programmatically controllable, fully isolated virtual machine. You create one, run commands against it with `exec`, and destroy it when you're done. Sandboxes start from a clean Debian base and are ready to `exec` against once `Sandbox.create()` resolves.

## Dashboard

Navigate to the **Sandboxes** tab in your project to view, create, and destroy sandboxes.

You can SSH into a running sandbox directly without leaving the dashboard. If you have SSH keys configured in your Railway account, you can also copy the SSH command from the dashboard to use in your terminal of choice.

To add SSH keys to your account, go to [Account Settings -> SSH Keys](https://railway.com/account/ssh-keys).

## TypeScript SDK

The SDK is the primary interface for working with sandboxes programmatically. It's <a href="https://github.com/railwayapp/railway-ts-sdk" target="_blank">open source on GitHub</a>.

**Note:** The SDK is under active development while sandboxes are in Priority Boarding, and its API may change in breaking ways between releases.

### Installation

```bash
bun add railway
```

Or scaffold a new project with the SDK preconfigured:

```bash
bun create railway@latest
```

### Quick start

```ts
import { Sandbox } from "railway";

// reads RAILWAY_API_TOKEN + RAILWAY_ENVIRONMENT_ID from the environment
const sandbox = await Sandbox.create();

const { stdout } = await sandbox.exec("echo hello");
console.log(stdout);

await sandbox.destroy();
```

`Sandbox.create()` resolves once the sandbox is `RUNNING` and ready to accept commands.

### Creating a sandbox

These static methods cover every way to get a `Sandbox`:

```ts
// Provision a new sandbox
const sandbox = await Sandbox.create();

// Provision from a template (see Templates below)
const sandbox = await Sandbox.create(template);

// Fork a running sandbox (see Forking below)
const sandbox = await Sandbox.create(source);

// Reattach to an existing sandbox by id
const sandbox = await Sandbox.connect(sandbox.id);
// throws `SandboxNotFoundError` if the sandbox does not exist in the environment.

// List all sandboxes in the environment
const sandboxes = await Sandbox.list();
```

### Running commands

`exec` runs a command to completion and returns its result. It doesn't throw on a non-zero exit code. Inspect `exitCode` instead.

```ts
const result = await sandbox.exec("npm run build", { timeoutSec: 120 });

result.exitCode;  // number
result.stdout;    // string
result.stderr;    // string
result.truncated; // true if output exceeded the capture limit
result.timedOut;  // true if the command hit timeoutSec
```

Without `timeoutSec`, a command times out after 2 minutes, and the maximum is 10 minutes. If `stdout` or `stderr` exceeds the [capture limit](#timeouts-and-output), the result is truncated and `result.truncated` is `true`.

### Destroying a sandbox

Use `destroy()` for explicit teardown, or `await using` to destroy automatically when the scope exits, even on throw.

```ts
// Explicit
await sandbox.destroy();

// Automatic via await using (requires Node.js 22+)
await using sandbox = await Sandbox.create();
await sandbox.exec("pytest");
// destroyed automatically here
```

### Reconnecting

A sandbox outlives the process that created it. Reattaching by id is useful in serverless and multi-step workflows.

```ts
const sandbox = await Sandbox.connect(idString);
await sandbox.exec("cat /tmp/state.json");
```

Call `sandbox.refresh()` to re-read the sandbox and update its `status` and other fields in place.

### Templates

A template is a reusable base: an ordered list of build steps that Railway builds once, content-addresses, and caches. Creating a sandbox from a template forks that cached build instead of starting from scratch.

This lets you start a sandbox from a pre-built base, saving spin-up time.

```ts
const base = Sandbox.template()
  .withPackages("ffmpeg", "git")
  .withEnv({ NODE_ENV: "production" })
  .workdir("/app")
  .run("npm install");

const sandbox = await Sandbox.create(base);
await sandbox.exec("ffmpeg -version");
```

`SandboxTemplate` is immutable. Every method returns a new template, so a base can branch into variants without mutation.

The template builder exposes these methods:

| Method | Effect |
|--------|--------|
| `.run(command)` | Add a raw build step |
| `.withPackages(...names)` | Install Debian packages via `apt-get` |
| `.withEnv({ KEY: "value" })` | Set environment variables for subsequent steps |
| `.workdir(dir)` | Set the working directory for subsequent steps |
| `.build(options?)` | Build and cache the template ahead of time |

`Sandbox.create(template)` builds the template automatically. Call `.build()` explicitly only to pre-warm the cache before the first `create`.

### Forking

Forking clones a running sandbox's filesystem into a new, independent sandbox. The fork boots fresh from a copy of the source's disk, so files are preserved but running processes and memory are not. Use it to branch a sandbox after expensive setup, for example installing dependencies once and forking per task.

```ts
const base = await Sandbox.create();
await base.exec("npm install");

const fork = await base.fork();
await fork.exec("npm test"); // sees the installed dependencies, isolated from base
```

`Sandbox.create(source)` is equivalent to `source.fork()`. The source must be `RUNNING`, and the fork is created in the same environment. Pass `idleTimeoutMinutes` or `networkIsolation` to set them on the fork, which doesn't inherit them from the source.

### Configuration

`token` and `environmentId` each resolve in order: an explicit option in the configuration object, then an environment variable.

| Option | Environment variable |
|--------|---------------------|
| `token` | `RAILWAY_API_TOKEN` |
| `environmentId` | `RAILWAY_ENVIRONMENT_ID` |

Pass explicit values to override:

```ts
const sandbox = await Sandbox.create({
  token: process.env.MY_TOKEN,
  environmentId: process.env.MY_ENV_ID,
  idleTimeoutMinutes: 30,
});
```

`idleTimeoutMinutes` sets how long a sandbox can sit [idle](#idle-timeout) before Railway automatically destroys it. Set it high enough to cover the gaps between steps in reconnect workflows, and low enough to avoid paying for idle compute. Without it, the sandbox uses the default of 30 minutes. The value can range from 1 to 120 minutes.

### Examples

For complete, runnable code, see the <a href="https://github.com/railwayapp/railway-ts-sdk/tree/main/examples/sandboxes" target="_blank">sandbox examples</a> in the SDK repository.

## CLI

The Railway CLI can create, fork, connect to, run commands in, and destroy sandboxes, build templates, and seed variables at create time. See [railway sandbox](/cli/sandbox) for all subcommands and options.

## Sandbox limits per environment

Each environment can run a fixed number of sandboxes at once, based on your workspace's [plan](/pricing/plans). The cap applies per environment, not per project or workspace.

| Plan | Sandboxes per environment |
|------|---------------------------|
| Trial | 10 |
| Free | 10 |
| Hobby | 50 |
| Pro | 100 |

Enterprise workspaces share the Pro cap of 100 sandboxes per environment.

Only sandboxes that are pending or running count toward the cap. Destroyed sandboxes don't. Creating a sandbox past the cap fails with an error.

## Timeouts and output

A sandbox enforces two timeouts: how long a single command can run, and how long the sandbox can sit idle before Railway destroys it.

| Limit | Default | Maximum |
|-------|---------|---------|
| Idle timeout | 30 minutes | 120 minutes |
| Command timeout | 2 minutes | 10 minutes |

Set the per-command timeout with `timeoutSec` in the SDK or `--timeout` in the CLI.

### Idle timeout

A sandbox is considered idle when you haven't interacted with it for longer than its idle timeout. Interacting means running a command (`exec`) or sending a command over an SSH session. Every interaction resets the timer, so the countdown always starts from your most recent interaction.

The idle timeout only counts your interactions with the sandbox, not anything running inside it. A process, server, or job running in the sandbox doesn't keep it alive on its own. Once a sandbox stays idle past its timeout, Railway shuts it down automatically.

Set the idle timeout with `idleTimeoutMinutes` in the SDK or `--idle-timeout-minutes` in the CLI. It defaults to 30 minutes and can range from 1 to 120 minutes.

## Networking

Every sandbox has outbound internet access through a NAT gateway. Whether it can reach the rest of your environment over the [private network](/private-networking) depends on its network isolation mode, set when you create or fork it.

| Mode | Behavior |
|------|----------|
| `ISOLATED` | Default. Outbound internet access only. The sandbox can't reach other services in the environment over private networking, and they can't reach it. |
| `PRIVATE` | The sandbox joins the environment's private network and keeps outbound internet access. It can reach other services over private networking, for example `postgres.railway.internal`, and they can reach it. |

A sandbox is `ISOLATED` unless you opt into `PRIVATE`, so existing sandboxes are unaffected.

In the SDK, pass `networkIsolation` when you create or fork a sandbox, and read it back from `sandbox.networkIsolation`:

```ts
const sandbox = await Sandbox.create({ networkIsolation: "PRIVATE" });
sandbox.networkIsolation; // "ISOLATED" | "PRIVATE"
```

In the CLI, pass `--private-network` to `railway sandbox create` or `railway sandbox fork`.

To run commands or move data in and out of a sandbox in either mode, use `exec` or SSH.

## Pricing

Sandboxes are billed by resources (CPU, memory, network egress) consumed. You pay only for what a sandbox uses while it runs, so destroying sandboxes when you're done, or setting a short idle timeout, keeps costs down. Railway hasn't announced sandbox pricing yet.
