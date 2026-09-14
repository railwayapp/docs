---
title: Create your first sandbox
description: Create a Railway sandbox, run commands, fork its filesystem, verify that changes stay isolated, and clean up with the CLI or JavaScript SDK.
---

Create a Linux VM, run code in it, and destroy it when you're done. This guide gives you a short CLI path and a runnable SDK example that copies a file into a fork and proves the original stays unchanged.

You need a Railway account and an existing [project](/projects) with an [environment](/environments). Sandboxes are available on every plan and consume [resource usage](/sandboxes#pricing). The SDK example runs two sandboxes at once.

## Try it from your terminal

### 1. Link your project

Install the [Railway CLI](/cli#installing-the-cli), or run `railway upgrade` if you already have it. In a local directory, sign in and select the project and environment to use:

```bash
railway login
railway link
```

### 2. Create a sandbox

```bash
railway sandbox create
```

The CLI makes the new sandbox active. Commands below target that sandbox without requiring its ID.

### 3. Run a command

```bash
railway sandbox exec -- node -e 'console.log("Hello from Railway")'
```

The command prints:

```text
Hello from Railway
```

For an interactive shell, run `railway sandbox ssh`. See the [SSH setup instructions](/cli/sandbox#options-for-ssh) if you need to configure a key.

### 4. Destroy the sandbox

```bash
railway sandbox destroy
railway sandbox list
```

Once destruction completes, the sandbox no longer appears in the default list. Destroyed sandboxes remain visible with `railway sandbox list --all`.

## Build it into your application

This example uses the [TypeScript SDK](/sandboxes#typescript-sdk) from a JavaScript module. It requires Node.js 22 or later.

### 1. Install the SDK

Create a local directory for the example:

```bash
mkdir railway-sandbox-quickstart
cd railway-sandbox-quickstart
npm init -y
npm install railway
```

### 2. Set your Railway Variables

We recommend storing your credentials in [Railway Variables](/variables), so your application can use the same configuration on Railway and during local development.

Create an [account or workspace API token](/integrations/api#account-tokens-and-workspace-tokens) with access to your project. Open your application's service in the target environment, select **Variables**, and add `RAILWAY_API_TOKEN` with your token as its value. If you don't have a service yet, [create an empty service](/services#creating-a-service). Review and apply the staged variable change.

Railway provides `RAILWAY_ENVIRONMENT_ID` for the service's environment, so you don't need to copy it manually.

To use these variables locally, install the [Railway CLI](/cli#installing-the-cli), then run the following commands from your example directory. When linking, select the project, environment, and service where you added the token:

```bash
railway login
railway link
```

[`railway run`](/cli/run) injects that service's variables into your local process. [Sealed variables](/variables#sealed-variables) aren't available to local CLI commands, so the token must be an unsealed variable for this local example.

For this example, leave `RAILWAY_TOKEN` unset: that variable selects project-token authentication and takes precedence over `RAILWAY_API_TOKEN`.

<Collapse slug="local-env-file" title="Alternative: use a local .env file">

For a standalone local example, create a `.env` file in your example directory:

```dotenv
RAILWAY_API_TOKEN=<your-account-or-workspace-token>
RAILWAY_ENVIRONMENT_ID=<your-environment-id>
```

Replace both placeholders. Copy the [environment ID](/integrations/api#resource-ids) from the project's command palette with `Cmd+K` or `Ctrl+K`. Keep `.env` out of version control.

</Collapse>

### 3. Create, fork, and verify

Save this as `sandbox.mjs`:

```js
import assert from "node:assert/strict";
import { Sandbox } from "railway";

const base = await Sandbox.create();

try {
  await base.files.write("/app/greeting.txt", "hello");

  const fork = await base.fork();

  try {
    // The fork starts with the source's files.
    assert.equal(await fork.files.read("/app/greeting.txt"), "hello");

    await fork.files.write("/app/greeting.txt", "hello from fork");
    const result = await fork.exec("cat /app/greeting.txt");

    // exec returns nonzero exits instead of throwing them.
    assert.equal(result.exitCode, 0, result.stderr);
    console.log("Fork:", result.stdout);

    // Changes in the fork leave the source unchanged.
    const original = await base.files.read("/app/greeting.txt");
    assert.equal(original, "hello");
    console.log("Base:", original);
  } finally {
    await fork.destroy();
  }
} finally {
  await base.destroy();
}
```

`Sandbox.create()` and `fork()` wait until their sandbox is running. The fork gets a copy of the filesystem and boots fresh, without the source's running processes or memory. The nested `finally` blocks request cleanup even if a command or assertion fails.

### 4. Run the example

Run locally with your Railway Variables:

```bash
railway run node sandbox.mjs
```

If you chose the local `.env` alternative, use:

```bash
node --env-file=.env sandbox.mjs
```

Expected output:

```text
Fork: hello from fork
Base: hello
```

This verifies both that the fork received the original file and that changing it left the source unchanged. Open the project's **Sandboxes** tab to confirm both VMs are destroyed after the script finishes. If you interrupt the process before cleanup runs, destroy any remaining sandboxes from that tab or with the CLI.

## Choose your next step

- [Run a coding agent](/guides/agents-in-sandboxes) with provider credentials and a repository
- [Save a checkpoint](/sandboxes#checkpoints) to reuse prepared files after the source sandbox is destroyed
- [Connect to a database](/sandboxes#networking) with `PRIVATE` networking and connection variables
- [Expose a preview](/sandboxes#public-domains) on a Railway-provided URL, or forward a port to your machine
- [Set an idle timeout](/sandboxes#idle-timeout) for your workload and keep explicit cleanup in your code

For all SDK operations, configuration, and limits, see the [Sandboxes reference](/sandboxes). For terminal commands, see the [CLI reference](/cli/sandbox).
