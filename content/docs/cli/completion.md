---
title: railway completion
description: Generate shell completion scripts.
---

Generate shell completion scripts for the Railway CLI.

## Usage

```bash
railway completion <SHELL>
```

## Supported Shells

- `bash`
- `zsh`
- `fish`
- `powershell`
- `elvish`

## Examples

### Bash

```bash
railway completion bash > /etc/bash_completion.d/railway
```

Or add to your `~/.bashrc`:

```bash
source <(railway completion bash)
```

### Zsh

```bash
railway completion zsh > "${fpath[1]}/_railway"
```

Or add to your `~/.zshrc`:

```bash
source <(railway completion zsh)
```

### Fish

```bash
railway completion fish > ~/.config/fish/completions/railway.fish
```

### PowerShell

```powershell
railway completion powershell >> $PROFILE
```

## Related

- [railway upgrade](/cli/upgrade)
