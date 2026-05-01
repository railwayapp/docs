---
title: railway ssh
description: Connect to a service via SSH and manage SSH keys.
---

Open an interactive shell session inside a deployed Railway service container, or manage the SSH keys registered with your Railway account.

Railway uses your system `ssh` client to connect to `ssh.railway.com`. You must have an SSH key registered with Railway before you can connect. The CLI prompts you to register a local key the first time you run `railway ssh`.

## Usage

```bash
railway ssh [OPTIONS] [COMMAND...]
railway ssh keys [SUBCOMMAND] [OPTIONS]
```

## Options

| Flag | Description |
|------|-------------|
| `-p, --project <ID>` | Project to connect to (defaults to linked project) |
| `-s, --service <SERVICE>` | Service to connect to (defaults to linked service) |
| `-e, --environment <ENV>` | Environment to connect to (defaults to linked environment) |
| `-d, --deployment-instance <ID>` | Specific deployment instance ID to connect to |
| `--session [NAME]` | Connect inside a persistent tmux session that reconnects automatically. Defaults to `railway` |
| `-i, --identity-file <PATH>` | Path to a private key to forward to ssh, like `ssh -i` |

## Examples

### Interactive shell

```bash
railway ssh
```

Opens an interactive shell in the service container.

### Run a single command

```bash
railway ssh -- ls -la
```

PTY allocation is autodetected. Interactive tools like `vim` or `htop` work when both stdin and stdout are terminals; piped input runs without a PTY so output stays clean for scripts and CI.

### Persistent tmux session

```bash
railway ssh --session
```

Connects inside a tmux session named `railway`. If the connection drops, the CLI reconnects and reattaches to the same session. Pass a name to use a different session:

```bash
railway ssh --session debug
```

Railway installs tmux in the container automatically if it isn't already installed.

### Connect to a specific deployment instance

```bash
railway ssh --deployment-instance <instance-id>
```

### Use a specific identity file

```bash
railway ssh -i ~/.ssh/railway_ed25519
```

When set, the CLI skips its local `~/.ssh` scan and forwards the key directly to `ssh`.

## Manage SSH keys

Use the `keys` subcommand to register, list, and remove SSH keys for your Railway account or workspace.

```bash
railway ssh keys [SUBCOMMAND] [OPTIONS]
```

### Subcommands

| Subcommand | Description |
|------------|-------------|
| `list` | List SSH keys registered with Railway (default when no subcommand is given) |
| `add` | Register a local SSH key with Railway |
| `remove` | Remove a registered SSH key |
| `github` | Import SSH keys from your linked GitHub account |

### Options

| Flag | Description |
|------|-------------|
| `--workspace <WORKSPACE_ID>` | Operate on workspace-owned keys instead of your personal keys |
| `--key <PATH>` | Path to the public key file (for `add`) |
| `--name <NAME>` | Name for the registered key (for `add`) |
| `--2fa-code <CODE>` | 2FA code for verification (for `remove`) |

### List registered keys

```bash
railway ssh keys
```

### Add a key

```bash
railway ssh keys add --key ~/.ssh/id_ed25519.pub --name "laptop"
```

Run without flags to pick from your local `~/.ssh` keys interactively.

### Remove a key

```bash
railway ssh keys remove
```

### Import keys from GitHub

```bash
railway ssh keys github
```

GitHub keys belong to your personal account and can't be imported directly into a workspace. To register a GitHub key for a workspace, import it first, then add it with `--workspace`.

### Workspace-owned keys

Workspace keys grant SSH access to every service in the workspace. Adding or removing workspace keys requires workspace **Admin** access.

```bash
railway ssh keys --workspace <workspace-id>
railway ssh keys add --workspace <workspace-id> --key ~/.ssh/id_ed25519.pub
```

When you authenticate with a workspace-scoped `RAILWAY_API_TOKEN`, the CLI operates on workspace keys automatically. SSH key management isn't supported with project tokens (`RAILWAY_TOKEN`); use a workspace API token or run `railway login`.

## Known limitations

VS Code Remote-SSH isn't supported. Connecting to a Railway service through the Remote-SSH extension fails because the Railway SSH server doesn't expose the operations Remote-SSH needs to install and run its server inside the container. Use `railway ssh` directly for shell access.

## Use cases

- Debugging production issues
- Running database migrations
- Accessing language REPLs (Rails console, Django shell)
- Inspecting log files
- Troubleshooting network issues

## Related

- [railway connect](/cli/connect)
- [railway logs](/cli/logs)
