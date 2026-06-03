---
title: Sandboxes
description: Provision ephemeral, isolated Linux environments on Railway. Create them from the dashboard, CLI, or TypeScript SDK, run commands in them, and tear them down when done.
---

<Banner variant="primary">Sandboxes are available through <a href="/platform/priority-boarding" target="_blank">Priority Boarding</a>. Breaking changes may occur.</Banner>

Sandboxes are short-lived Linux environments you can provision on demand, run commands in, and destroy.

Each sandbox is scoped to a Railway [environment](/environments) and runs on Railway's VM primitive, giving you isolated, on-demand compute for anything you'd run on a VM.

## How it works

Each sandbox is a programmatically controllable, fully isolated container. You create one, run commands against it with `exec`, and destroy it when you're done. Sandboxes start from a clean Debian base and are ready to `exec` against once `Sandbox.create()` resolves.

## Dashboard

Navigate to the **Sandboxes** tab in your project to view, create, and destroy sandboxes.

You can SSH into a running sandbox directly without leaving the dashboard. If you have SSH keys configured in your Railway account, you can also copy the SSH command from the dashboard to use in your terminal of choice.

To add SSH keys to your account, go to [Account Settings -> SSH Keys](https://railway.com/account/ssh-keys).

## TypeScript SDK

The SDK is the primary interface for working with sandboxes programmatically.

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

Four static methods cover every way to get a `Sandbox`:

```ts
// Provision a new sandbox
const sandbox = await Sandbox.create();

// Provision from a template (see Templates below)
const sandbox = await Sandbox.create(template);

// Reattach to an existing sandbox by id
const sandbox = await Sandbox.connect("sbx_abc123");
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
const sandbox = await Sandbox.connect("sbx_abc123");
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

`idleTimeoutMinutes` sets how long a sandbox can sit idle before Railway automatically destroys it. Set it high enough to cover the gaps between steps in reconnect workflows, and low enough to avoid paying for idle compute. Without it, the sandbox uses Railway's default idle timeout.

The SDK is safe to import in the browser and edge runtimes. Environment variables are only read where a runtime exposes them. Provide credentials explicitly in those contexts.

## CLI

The Railway CLI can create, connect to, run commands in, and destroy sandboxes. See [railway sandbox](/cli/sandbox) for all subcommands and options.

## Caveats

File access (`sandbox.files.*`), port exposure (`sandbox.expose()`), streaming `exec`, and background processes are not yet available.
