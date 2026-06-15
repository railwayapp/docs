---
title: Sandboxes
description: Provision ephemeral, isolated Linux environments on Railway. Create them from the dashboard, CLI, or TypeScript SDK, run commands in them, read and write their files, and tear them down when done.
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

Set `cwd` to run the command in a directory, and `env` to layer extra environment variables over the sandbox's own:

```ts
const result = await sandbox.exec("pnpm test", {
  cwd: "/app",
  env: { CI: "true" },
});
```

The command fails if `cwd` doesn't exist. Per-command `env` values travel inside the command string, so they're visible to `ps` inside the sandbox. For secrets, set `env` when you [create the sandbox](#configuration) instead. Both options apply to fresh commands only, and are rejected when you reattach to a session by name.

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

### Files

`sandbox.files` reads and writes files on a running sandbox's filesystem.

| Method | Description |
|--------|-------------|
| `read` | Read a file as text, bytes, or a stream |
| `write` | Create or overwrite a file, creating parent directories |
| `list` | List a directory's entries |
| `stat` | Get metadata for a path |
| `exists` | Check whether a path exists |
| `mkdir` | Create a directory, including parents |
| `rename` | Move or rename a file or directory |
| `remove` | Delete a file or empty directory |

#### Reading and writing

Write a file and read it back:

```ts
await sandbox.files.write(
  "/app/config.json",
  JSON.stringify({ port: 8080 }),
);

const text = await sandbox.files.read("/app/config.json"); // string
const bytes = await sandbox.files.read("/data/model.bin", {
  format: "bytes",
}); // Uint8Array
```

`write` creates the file and creates missing parent directories automatically.

Files are created with mode `0644` by default. Pass `mode` to set permissions, for example to make a script executable:

```ts
await sandbox.files.write("/app/run.sh", "#!/bin/sh\necho hello\n", {
  mode: 0o755,
});
```

`write` accepts several content types, which differ in how they recover from a dropped connection:

| `write` input | How it uploads |
|---------------|----------------|
| `string`, `Uint8Array`, `ArrayBuffer`, `Blob` | Buffered, retried automatically on a dropped connection |
| `ReadableStream`, `AsyncIterable<Uint8Array>` | Streamed without buffering, one-shot (not retried) |
| `() => stream` (a factory) | Streamed without buffering, retried by calling the factory again |

Streaming lets you push a file larger than memory. A bare stream isn't retried, so an error mid-transfer fails with `RailwayConnectionError` and can leave a partial file.

Pass a factory so a retry reads a fresh stream:

```ts
import { createReadStream } from "node:fs";

await sandbox.files.write(
  "/data/dataset.bin",
  () => createReadStream("./dataset.bin"),
);
```

Read a file as a stream to pull large files without filling memory, or read a byte range. Use `offset` and `length` to read from the start, or `fromEnd` with `length` to tail the end of a file:

```ts
const stream = await sandbox.files.read("/data/out.bin", {
  format: "stream",
});
for await (const chunk of stream) process.stdout.write(chunk);

const tail = await sandbox.files.read("/var/log/app.log", {
  length: 4096,
  fromEnd: true,
});
```

#### Listing

List a directory and read each entry's metadata:

```ts
for (const entry of await sandbox.files.list("/app")) {
  console.log(entry.name, entry.size, entry.isDir, entry.modTime);
}
```

#### Removing

`remove` deletes a single file or empty directory. For recursive deletes, run `sandbox.exec("rm -rf ...")`.

Reading a missing path throws `SandboxFileNotFoundError`. Other failures throw `SandboxFilesError`, which reports the failing `operation` and `path`.

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

### Checkpoints

A checkpoint is a named snapshot of a sandbox's disk, stored server-side in the environment. Capture one from a running sandbox after expensive setup, then boot new sandboxes from it by name, from any process with access to the environment.

```ts
const sandbox = await Sandbox.create();
await sandbox.exec("npm install");

await sandbox.checkpoint("after-deps");
await sandbox.destroy();

// Later, from any process with access to the environment:
const fresh = await Sandbox.create("after-deps");
await fresh.exec("npm test"); // sees the installed dependencies
```

`checkpoint(name)` requires a running sandbox, which keeps running during the capture. The call resolves once the checkpoint is bootable, so a sandbox with a lot of changed disk takes longer to capture. Reusing a name replaces that checkpoint with the new capture.

Like a [fork](#forking), a sandbox created from a checkpoint boots fresh from a copy of the disk: files are preserved, running processes are not. Unlike a fork, the source sandbox doesn't need to exist anymore. Use a checkpoint for a base you reuse across sessions, and a fork to branch a live sandbox.

Manage the environment's checkpoints with static methods:

```ts
const checkpoints = await Sandbox.checkpoints(); // newest first

await Sandbox.renameCheckpoint("after-deps", "node-base");
await Sandbox.deleteCheckpoint("node-base");
```

Each entry's `key` field holds the checkpoint name, and `renameCheckpoint` and `deleteCheckpoint` take that name. Deleting a checkpoint also deletes its underlying disk snapshot.

The number of checkpoints an environment can hold matches its plan's sandbox limit, listed in [Sandbox limits](#sandbox-limits-per-environment). Checkpoints are counted separately from running sandboxes, and replacing a checkpoint by reusing its name doesn't increase the count.

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
  env: { NODE_ENV: "production" },
});
```

`idleTimeoutMinutes` sets how long a sandbox can sit [idle](#idle-timeout) before Railway automatically destroys it. Set it high enough to cover the gaps between steps in reconnect workflows, and low enough to avoid paying for idle compute. Without it, the sandbox uses the plan default. The default and allowed range depend on your plan, so see [Idle timeout](#idle-timeout) for the per-plan values.

`env` bakes environment variables into the sandbox, available to every command over both `exec` and SSH for the sandbox's lifetime. Use it for values a command needs at runtime, including secrets. Values can reference other Railway variables, for example `${{shared.NPM_TOKEN}}`, resolved when the sandbox is created. `create` and `fork` both accept `env`, and a fork doesn't inherit the source's variables.

### Examples

For complete, runnable code, see the <a href="https://github.com/railwayapp/railway-ts-sdk/tree/main/examples/sandboxes" target="_blank">sandbox examples</a> in the SDK repository.

## CLI

The Railway CLI can create, fork, connect to, run commands in, forward ports into, and destroy sandboxes, build templates, capture and boot from checkpoints, and seed variables at create time. See [railway sandbox](/cli/sandbox) for all subcommands and options.

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

A sandbox enforces an idle timeout: how long it can sit idle before Railway destroys it. Commands have a separate, optional timeout.

| Limit | Default | Maximum |
|-------|---------|---------|
| Idle timeout (Hobby and Pro) | 30 minutes | 120 minutes |
| Idle timeout (Trial and Free) | 5 minutes | 5 minutes |

The idle timeout default and maximum depend on your plan, as shown above.

In the CLI, `railway sandbox exec` streams output live and runs the command until it exits, unless you pass `--timeout <SECONDS>`, a client-side deadline. When the deadline expires, the command receives `SIGTERM` and `exec` exits with code 124. Use `--detach` to start a command in the background and get a session name back, then `--session <name>` to reattach later. In the SDK, a command has no timeout unless you set `timeoutSec`, so [long-running commands](#long-running-commands) keep going until they exit. The `truncated` field on an exec result reports when captured output was cut short.

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

To run commands in a sandbox in either mode, use `exec` or SSH, and to move files in and out, use the [files API](#files). To reach a server running inside the sandbox from your machine, forward its port with [`railway sandbox forward`](/cli/sandbox).

## Pricing

Sandboxes are billed by resources (CPU, memory, network egress) consumed. You pay only for what a sandbox uses while it runs, so destroying sandboxes when you're done, or setting a short idle timeout, keeps costs down. Idle sandboxes still consume resources that we bill for.

Sandbox VM resources are billed at

| Resource | price |
|----------|------------|
| Memory | $0.00000001929012 MB•second ($50 GB / month) |
| vCPU | $0.00000001929012 vCPU•second ($50 vCPU / month) |
| Egress | $0.05 GB |
