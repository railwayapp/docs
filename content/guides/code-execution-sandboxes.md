---
title: Run Code-Execution Sandboxes for AI Agents
description: Run AI-generated code in isolated, disposable sandboxes on Railway. What a code-execution sandbox is, why agents need one, and how to create, checkpoint, fork, and destroy sandboxes from the CLI or the TypeScript SDK.
date: "2026-07-29"
tags:
  - sandboxes
  - agents
  - code-execution
  - security
topic: ai
---

<Banner variant="primary">Sandboxes are available through <a href="/platform/priority-boarding" target="_blank">Priority Boarding</a>. Breaking changes may occur.</Banner>

A code-execution sandbox is an isolated, short-lived environment where an AI agent can run code without putting anything else at risk. The agent writes code, the sandbox executes it, the results come back, and the environment is destroyed. Nothing the code does inside the sandbox touches your machine, your production services, or the next task's sandbox.

In this guide we cover why agents need sandboxes, what a sandbox has to provide, and how to run one on Railway.

## Why agents need a sandbox

An agent that only reads and writes text is safe by construction. An agent that executes code is not. Generated code can delete files, exfiltrate environment variables, install malware, or loop forever. It does not have to be malicious to be dangerous; it only has to be wrong.

Running that code on the machine that hosts the agent means every mistake lands somewhere that matters. A sandbox moves execution somewhere that does not. The blast radius of a bad `rm`, a hostile dependency, or an infinite loop is one disposable environment.

Sandboxes also solve a second problem: reproducibility. An agent that runs tasks in fresh, identical environments produces results that do not depend on leftover state from the last run.

## What a sandbox has to provide

Four properties matter, whatever provider you use:

- **Isolation.** The sandbox cannot reach the host or other tenants. Filesystem, processes, and network are separate.
- **Fast boot.** Agents create sandboxes per task. An environment that takes minutes to provision breaks the loop.
- **Snapshot and restore.** Setup is expensive (clone, install, authenticate). A sandbox you can snapshot once and boot many times amortizes it.
- **Guaranteed teardown.** Sandboxes that outlive their task leak money. Destruction should be explicit and also automatic when you forget.

## Sandboxes on Railway

A Railway [sandbox](/sandboxes) is a short-lived, isolated Linux environment you create on demand, run commands in, and destroy. The default image ships git, Node, npm, and the common agent harnesses. Sandboxes live in a Railway [environment](/environments), so they can optionally join the same [private network](/networking/private-networking) as your other services, or run fully isolated from it.

The lifecycle maps directly onto the four properties above:

```txt
create -> exec -> checkpoint -> create/fork -> destroy
```

An [idle timeout](/sandboxes#idle-timeout) tears down sandboxes you forget about.

## Run one from the CLI

With the [Railway CLI](/cli) installed and a project linked:

```bash
railway sandbox create
railway sandbox exec -- bash -lc 'echo "print(2+2)" > task.py && python3 task.py'
railway sandbox destroy
```

That is the whole loop: an environment appears, runs untrusted code, and disappears. The [`railway sandbox`](/cli/sandbox) reference covers every subcommand, including `ssh`, `fork`, and port forwarding.

## Run one from the TypeScript SDK

When the sandbox belongs inside an application, for example an agent backend that executes generated code per request, use the [TypeScript SDK](/sandboxes#typescript-sdk):

```ts
import { Sandbox } from "railway";

const sandbox = await Sandbox.create();

const result = await sandbox.exec("bash -lc 'python3 -c \"print(2+2)\"'");
console.log(result.stdout, result.exitCode);

await sandbox.destroy();
```

`Sandbox.create()` reads `RAILWAY_API_TOKEN` and `RAILWAY_ENVIRONMENT_ID` from the environment and resolves once the sandbox accepts commands. `exec` does not throw on a non-zero exit code; inspect `exitCode` and `stderr` yourself, since exit codes are signal, not failure, when the code under test is the thing being evaluated.

Wrap execution in `try`/`finally` so the sandbox is destroyed even when a run throws:

```ts
const sandbox = await Sandbox.create();
try {
  const result = await sandbox.exec("bash -lc 'cd /root/workspace && npm test'", {
    timeoutSec: 600,
  });
  return { passed: result.exitCode === 0, output: result.stdout };
} finally {
  await sandbox.destroy().catch(() => {});
}
```

## Amortize setup with checkpoints

Most agent tasks share setup: clone the repository, install dependencies, configure tools. Do it once, snapshot it, and boot every task from the snapshot:

```bash
railway sandbox create
railway sandbox exec -- bash -lc 'git clone https://github.com/your-org/your-repo /root/workspace && cd /root/workspace && npm ci'
railway sandbox checkpoint create repo-ready
```

Every subsequent task starts from the prepared state:

```bash
railway sandbox create --checkpoint repo-ready
```

A [checkpoint](/sandboxes#checkpoints) is stored server-side and outlives the sandbox it was taken from. When work branches mid-task, [fork](/sandboxes#forking) the running sandbox instead: a fork clones the filesystem into a new independent sandbox, so two approaches can run in parallel from the same prepared state.

## Control what the sandbox can reach

Isolation is a choice per sandbox. By default, keep execution cut off from your infrastructure. When the agent's task is to test against real services, create the sandbox on the project's private network so it can reach Postgres, Redis, and internal APIs:

```bash
railway sandbox create --checkpoint repo-ready --private-network
```

Untrusted code with database access is a bigger blast radius. Point networked sandboxes at a development [environment](/environments), not production.

## Next steps

- [Use Agents in Railway Sandboxes](/guides/agents-in-sandboxes): the full development loop, including driving sandboxes from Claude Code and fanning out one sandbox per agent.
- [Sandboxes](/sandboxes): concepts, SDK reference, networking, and limits.
- [Running Agents on Railway](/guides/running-agents-on-railway): deploy the agent itself as an always-on service.
- [Deploy an AI Agent with Async Workers](/guides/ai-agent-workers): queue sandbox-running tasks behind an API.
