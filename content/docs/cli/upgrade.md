---
title: railway upgrade
description: Upgrade the Railway CLI to the latest version.
---

Upgrade the Railway CLI to the latest version.

## Usage

```bash
railway upgrade [OPTIONS]
```

## Options

| Flag | Description |
|------|-------------|
| `--check` | Show install method and upgrade command without upgrading |

## Examples

### Upgrade CLI

```bash
railway upgrade
```

Automatically detects your install method and runs the appropriate upgrade command.

### Check Install Method

```bash
railway upgrade --check
```

Output:
```
Install method: Homebrew
Binary path: /opt/homebrew/bin/railway
Upgrade command: brew upgrade railway
```

## Supported Install Methods

| Method | Upgrade Command |
|--------|----------------|
| Homebrew | `brew upgrade railway` |
| npm | `npm update -g @railway/cli` |
| Bun | `bun update -g @railway/cli` |
| Cargo | `cargo install railwayapp` |
| Scoop | `scoop update railway` |
| Shell | `bash <(curl -fsSL cli.new)` |

## Manual Upgrade

If automatic detection fails, you can manually run the upgrade command for your install method.

## Related

- [CLI Installation](/cli#installing-the-cli)
