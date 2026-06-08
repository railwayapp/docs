---
title: railway sandbox
description: Manage ephemeral sandboxes.
---

Create, connect to, run commands in, and destroy ephemeral [sandboxes](/sandboxes) in a Railway environment.

<Banner variant="info">The `sandbox` command requires sandboxes to be enabled for your account through <a href="/platform/priority-boarding" target="_blank">Priority Boarding</a>. It's under active development, and its commands and flags may change in breaking ways.</Banner>

## Usage

```bash
railway sandbox <COMMAND> [OPTIONS]
```

## Aliases

- `railway sandboxes`
- `railway sbx`

## Subcommands

| Subcommand | Aliases | Description |
|------------|---------|-------------|
| `create` | `new` | Create a sandbox and set it as the active sandbox |
| `fork` | | Fork a sandbox into a new one and set it as the active sandbox |
| `template` | | Build and manage sandbox templates |
| `list` | `ls` | List sandboxes in the environment |
| `ssh` | `connect` | Connect to a sandbox over SSH |
| `exec` | | Run a single command inside a sandbox |
| `destroy` | `rm`, `delete` | Destroy a sandbox |

## Active sandbox

`create` and `fork` set the new sandbox as the active sandbox. The `ssh`, `exec`, `fork`, and `destroy` commands act on the active sandbox when you don't pass an ID, so a typical session needs no IDs at all. Running `ssh` or `exec` against a specific sandbox makes that one active.

Pass `--id <ID>` (or a positional ID for `fork` and `destroy`) to target a specific sandbox instead. `list` marks the active sandbox with an asterisk.

## Examples

### Create a sandbox

```bash
railway sandbox create
```

### Create a sandbox with an idle timeout

```bash
railway sandbox create --idle-timeout-minutes 30
```

Railway auto-destroys the sandbox after it sits [idle](/sandboxes#idle-timeout) for the given number of minutes. The default and allowed range depend on your plan, so see [Idle timeout](/sandboxes#idle-timeout) for the per-plan values.

### Create a sandbox on the private network

```bash
railway sandbox create --private-network
```

The sandbox joins the environment's private network and can reach your other services. See [Private networking](#private-networking).

### Fork a sandbox

```bash
railway sandbox fork
```

This forks the active sandbox. The new sandbox becomes active, so a following `ssh` or `exec` targets the fork. Pass an ID to fork a specific sandbox.

```bash
railway sandbox fork sbx_abc123
```

### List sandboxes

```bash
railway sandbox list
```

### Connect to the active sandbox

```bash
railway sandbox ssh
```

### Connect to a specific sandbox

```bash
railway sandbox ssh --id sbx_abc123
```

### Run a command over SSH instead of opening a shell

```bash
railway sandbox ssh -- ls -la
```

### Run a single command

```bash
railway sandbox exec -- npm run build
```

### Run a command in a specific sandbox with a timeout

```bash
railway sandbox exec --id sbx_abc123 --timeout 120 -- npm test
```

`exec` writes the command's output to your terminal and exits with the command's exit code.

### Destroy the active sandbox

```bash
railway sandbox destroy
```

### Destroy a specific sandbox

```bash
railway sandbox destroy sbx_abc123
```

## Options for `create`

| Flag | Description |
|------|-------------|
| `--idle-timeout-minutes <N>` | Minutes the sandbox can sit [idle](/sandboxes#idle-timeout) before it is auto-destroyed. The default and range depend on your plan |
| `--variable <KEY=VALUE>` | Set a variable on the sandbox. Repeatable and comma-separable. See [Variables](#variables) |
| `--env-file <PATH>` | Load variables from a `.env` file. Repeatable. `--variable` overrides matching keys |
| `--template <NAME_OR_ID>` | Create from a built template, by local name or template ID. See [Templates](#templates) |
| `--private-network` | Join the environment's private network instead of the default isolated mode |
| `--json` | Output the created sandbox as JSON |

## Options for `fork`

| Argument or flag | Description |
|------------------|-------------|
| `[ID]` | Source sandbox ID to fork. Defaults to the active sandbox |
| `--id <ID>` | Source sandbox ID, as an alternative to the positional argument |
| `--idle-timeout-minutes <N>` | Minutes the new sandbox can sit [idle](/sandboxes#idle-timeout) before it is auto-destroyed. The default and range depend on your plan |
| `--variable <KEY=VALUE>` | Set a variable on the fork. Repeatable and comma-separable. The fork doesn't inherit the source's variables |
| `--env-file <PATH>` | Load variables from a `.env` file. Repeatable. `--variable` overrides matching keys |
| `--private-network` | Join the environment's private network. The fork doesn't inherit the source's network mode |
| `--json` | Output the created sandbox as JSON |

The source sandbox must be running. The fork clones its filesystem into a new sandbox in the same environment and boots fresh, so files are preserved but running processes are not.

## Options for `list`

| Flag | Description |
|------|-------------|
| `--json` | Output in JSON format |

## Options for `ssh`

| Argument or flag | Description |
|------------------|-------------|
| `--id <ID>` | Sandbox ID to connect to. Defaults to the active sandbox |
| `-i, --identity-file <PATH>` | Path to an identity (private key) file, like `ssh -i` |
| `[-- COMMAND]` | Command to run instead of an interactive shell |

Connecting over SSH requires an SSH key on your Railway account. See [railway ssh](/cli/ssh) for key setup, and add keys at [Account Settings -> SSH Keys](https://railway.com/account/ssh-keys).

## Options for `exec`

| Argument or flag | Description |
|------------------|-------------|
| `--id <ID>` | Sandbox ID to run in. Defaults to the active sandbox |
| `--timeout <SECONDS>` | Per-command timeout in seconds (default 120, maximum 600) |
| `-- COMMAND` | Command to run, after `--`. Required |

## Options for `destroy`

| Argument or flag | Description |
|------------------|-------------|
| `[ID]` | Sandbox ID to destroy. Defaults to the active sandbox |
| `--id <ID>` | Sandbox ID to destroy, as an alternative to the positional argument |

## Templates

A template is a pre-built filesystem snapshot you can boot sandboxes from, which saves setup time. You build one from an ordered list of shell instructions. Railway content-addresses each template by the hash of its instructions and caches the snapshot for about 7 days, so rebuilding an identical template is an instant cache hit.

| Subcommand | Aliases | Description |
|------------|---------|-------------|
| `template build` | `create`, `new` | Build a template from shell instructions |
| `template status` | | Show the build status of a template |
| `template list` | `ls` | List templates this CLI has built |

The CLI stores the templates it builds locally, so you can reference one by a name you assign with `--name` or by its template ID.

### Build a template

```bash
railway sandbox template build --name dev -c "npm i -g pnpm" --wait
```

Pass `-c` once per build step. Steps run in order, and each must exit 0 within 10 minutes. The `--wait` flag polls until the build reports `READY` or `FAILED`.

### Create a sandbox from a template

```bash
railway sandbox create --template dev
```

Reference the template by the local name you gave it or by its template ID.

### Options for `template build`

| Flag | Description |
|------|-------------|
| `-c, --command <SHELL_COMMAND>` | Shell instruction to run while building. Repeatable, runs in order. Required |
| `--name <NAME>` | Local name for the template, usable with `create --template <NAME>` |
| `--base-image-digest <DIGEST>` | Base image digest to build on. Defaults to the standard sandbox image |
| `--wait` | Wait for the build to finish, polling until `READY` or `FAILED` |
| `--json` | Output as JSON |

`template status <ID_OR_NAME>` and `template list` each accept `--json`.

## Variables

`create` and `fork` can seed environment variables into a sandbox. They're available to every command, over both `exec` and SSH.

Set variables inline with `--variable`. The flag is repeatable and comma-separable.

```bash
railway sandbox create --variable NODE_ENV=production --variable PORT=8080
railway sandbox create --variable NODE_ENV=production,PORT=8080
```

A comma splits the value only when every segment is its own `KEY=VALUE` pair, so values that contain commas stay intact.

Load variables from a `.env` file with `--env-file`, which is also repeatable. When the same key is set in both places, `--variable` flags take precedence.

```bash
railway sandbox create --env-file .env
```

Values can reference other Railway variables, resolved server-side when the sandbox is created. Use the bare `Service.VARIABLE` form or the full `${{Service.VARIABLE}}` form.

```bash
railway sandbox create \
  --variable DATABASE_URL=Postgres.DATABASE_URL \
  --private-network
```

Resolving a reference to a service's internal address requires the private network, so pair internal-URL references with `--private-network`.

## Private networking

By default a sandbox is isolated: it has outbound internet access but can't reach other services in your environment over private networking. Pass `--private-network` to `create` or `fork` to place the sandbox on the environment's private network, so it can reach services like `postgres.railway.internal` and they can reach it. See [Networking](/sandboxes#networking) for the full description of both modes.

## Common options

These flags apply to every subcommand.

| Flag | Description |
|------|-------------|
| `-e, --environment <ENV>` | Environment name or ID. Defaults to the linked environment |
| `-p, --project <PROJECT>` | Project ID. Defaults to the linked project |

Without these flags, the CLI uses your linked project and environment. In an interactive shell with no link, the CLI prompts you to select a workspace, project, and environment. In a non-interactive shell with no link, pass both `--project` and `--environment`, or run [railway link](/cli/link) first.

## Related

- [Sandboxes](/sandboxes)
- [railway ssh](/cli/ssh)
- [railway link](/cli/link)
