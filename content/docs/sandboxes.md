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

`exec` starts a command and returns a handle. Await the handle to get the final result. `exec` doesn't throw on a non-zero exit code, so inspect `exitCode` instead.

```ts
const result = await sandbox.exec("npm run build", { timeoutSec: 120 });

result.exitCode;  // number | null (null when a signal ended the command)
result.stdout;    // string
result.stderr;    // string
result.truncated; // true if the output was truncated
result.timedOut;  // true if the command hit timeoutSec
```

Pass `timeoutSec` to kill the command after a deadline and resolve with `timedOut: true`. Without it, the command runs until it exits, so you can run long-lived processes like agents, dev servers, and builds. See [Long-running commands](#long-running-commands) to stream their output and detach or reattach the session.

### Long-running commands

A command started with `exec` runs on the sandbox independently of the client that started it. The handle exposes a durable `sessionName`, so you can stop streaming a command and reattach to it later, even from a different process. This suits agents, dev servers, and any job that outlives a single connection.

Stream output as it arrives with the `onStdout` and `onStderr` callbacks:

```ts
const handle = sandbox.exec("npm run agent", {
  onStdout: (chunk) => process.stdout.write(chunk),
  onStderr: (chunk) => process.stderr.write(chunk),
});

const result = await handle; // resolves when the command exits
```

To stop following the output without ending the command, call `detach()`. It resolves with the session name. The command keeps running, and you reattach later by passing that name back to `exec`.

```ts
const handle = sandbox.exec("npm run agent");
const sessionName = await handle.sessionName;

await handle.detach(); // stop streaming; the command keeps running

// Later, from any process with access to the environment:
const reattached = await Sandbox.connect(sandbox.id);
const result = await reattached.exec(
  { sessionName },
  { onStdout: (chunk) => process.stdout.write(chunk) },
);
```

Reattaching replays the output retained for the session, then follows it live. Pass `resumeFromLastRead: true` to receive only the output produced since the server's last read, instead of replaying from the start.

Call `handle.kill(signal)` to terminate a running command. It sends the signal (`TERM` by default) to the command's process group, and the handle then resolves with the command's exit. Detaching leaves the command running. Killing ends it.

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

`idleTimeoutMinutes` sets how long a sandbox can sit [idle](#idle-timeout) before Railway automatically destroys it. Set it high enough to cover the gaps between steps in reconnect workflows, and low enough to avoid paying for idle compute. Without it, the sandbox uses the plan default. The default and allowed range depend on your plan, so see [Idle timeout](#idle-timeout) for the per-plan values.

### Examples

For complete, runnable code, see the <a href="https://github.com/railwayapp/railway-ts-sdk/tree/main/examples/sandboxes" target="_blank">sandbox examples</a> in the SDK repository.

## CLI

The Railway CLI can create, fork, connect to, run commands in, forward ports into, and destroy sandboxes, build templates, and seed variables at create time. See [railway sandbox](/cli/sandbox) for all subcommands and options.

## Sandbox limits per environment

Each environment can run a fixed number of sandboxes at once, based on your workspace's [plan](/pricing/plans). The cap applies per environment, not per project or workspace.

| Plan | Sandboxes per environment |
|------|---------------------------|
| Trial | 10 |
| Free | 10 |
| Hobby | 50 |
| Pro | 100 |

Enterprise workspaces share the Pro cap of 100 sandboxes per environment.

Only sandboxes in the `CREATING` or `RUNNING` state count toward the cap. Destroyed sandboxes don't. Creating a sandbox past the cap fails with an error.

## Timeouts and output

A sandbox enforces an idle timeout: how long it can sit idle before Railway destroys it. Commands have a separate timeout that works differently in the CLI and the SDK.

| Limit | Default | Maximum |
|-------|---------|---------|
| Idle timeout (Hobby and Pro) | 30 minutes | 120 minutes |
| Idle timeout (Trial and Free) | 5 minutes | 5 minutes |

The idle timeout default and maximum depend on your plan, as shown above.

In the CLI, `railway sandbox exec` stops a command after 2 minutes by default, up to a maximum of 10 minutes set with `--timeout`. In the SDK, a command has no timeout unless you set `timeoutSec`, so [long-running commands](#long-running-commands) keep going until they exit. The `truncated` field on an exec result reports when captured output was cut short.

### Idle timeout

A sandbox is considered idle when you haven't interacted with it for longer than its idle timeout. Interacting means running a command (`exec`) or sending a command over an SSH session. Every interaction resets the timer, so the countdown always starts from your most recent interaction.

The idle timeout only counts your interactions with the sandbox, not anything running inside it. A process, server, or job running in the sandbox doesn't keep it alive on its own. Once a sandbox stays idle past its timeout, Railway shuts it down automatically.

Set the idle timeout with `idleTimeoutMinutes` in the SDK or `--idle-timeout-minutes` in the CLI. On the Hobby and Pro plans it defaults to 30 minutes and can be set from 1 to 120 minutes. On the Trial and Free plans it defaults to 5 minutes and can be set from 1 to 5 minutes. Setting a value above your plan's maximum returns an error.

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

To run commands or move data in and out of a sandbox in either mode, use `exec` or SSH. To reach a server running inside the sandbox from your machine, forward its port with [`railway sandbox forward`](/cli/sandbox).

## Pricing

Sandboxes are billed by resources (CPU, memory, network egress) consumed. You pay only for what a sandbox uses while it runs, so destroying sandboxes when you're done, or setting a short idle timeout, keeps costs down. Idle sandboxes still consume resources that we bill for.

Sandbox VM resources are billed at

| Resource | price |
|----------|------------|
| Memory | $0.00000001929012 MB•second ($50 GB / month) |
| vCPU | $0.00000001929012 vCPU•second ($50 vCPU / month) |
| Egress | $0.05 GB |

