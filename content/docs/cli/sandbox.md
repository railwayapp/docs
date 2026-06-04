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
| `list` | `ls` | List sandboxes in the environment |
| `ssh` | `connect` | Connect to a sandbox over SSH |
| `exec` | | Run a single command inside a sandbox |
| `destroy` | `rm`, `delete` | Destroy a sandbox |

## Active sandbox

`create` sets the new sandbox as the active sandbox. The `ssh`, `exec`, and `destroy` commands act on the active sandbox when you don't pass an ID, so a typical session needs no IDs at all. Running `ssh` or `exec` against a specific sandbox makes that one active.

Pass `--id <ID>` (or a positional ID for `destroy`) to target a specific sandbox instead. `list` marks the active sandbox with an asterisk.

## Examples

### Create a sandbox

```bash
railway sandbox create
```

### Create a sandbox with an idle timeout

```bash
railway sandbox create --idle-timeout-minutes 30
```

Railway auto-destroys the sandbox after it sits [idle](/sandboxes#idle-timeout) for the given number of minutes. The default is 30 minutes, and the value can range from 1 to 120.

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
| `--idle-timeout-minutes <N>` | Minutes the sandbox can sit [idle](/sandboxes#idle-timeout) before it is auto-destroyed (default 30, range 1 to 120) |
| `--json` | Output the created sandbox as JSON |

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
