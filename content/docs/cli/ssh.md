---
title: railway ssh
description: Connect to a service via SSH.
---

Open an interactive shell session inside a deployed Railway service container.

## Usage

```bash
railway ssh [OPTIONS] [COMMAND...]
```

## Options

| Flag | Description |
|------|-------------|
| `-p, --project <ID>` | Project to connect to (defaults to linked project) |
| `-s, --service <SERVICE>` | Service to connect to (defaults to linked service) |
| `-e, --environment <ENV>` | Environment to connect to (defaults to linked environment) |
| `-d, --deployment-instance <ID>` | Specific deployment instance ID to connect to |
| `--session [NAME]` | Use a tmux session (installs tmux if needed) |

## Examples

### Interactive Shell

```bash
railway ssh
```

Opens a bash shell in the service container.

### Run a Single Command

```bash
railway ssh -- ls -la
```

### SSH with tmux Session

```bash
railway ssh --session
```

Creates a persistent tmux session that reconnects automatically if disconnected.

### SSH to Specific Service

```bash
railway ssh --service backend
```

## Use Cases

- Debugging production issues
- Running database migrations
- Accessing language REPLs (Rails console, Django shell, etc.)
- Inspecting log files
- Troubleshooting network issues

## How It Works

Railway SSH uses a custom WebSocket-based protocol (not standard SSH). This means:

- No SSH daemon required in your container
- Secure communication through Railway's authentication
- Works with any container that has a shell available

## Limitations

- No SCP/SFTP file transfer
- No SSH tunneling or port forwarding
- No IDE integration (VS Code Remote-SSH)

## Related

- [railway connect](/cli/connect)
- [railway logs](/cli/logs)
