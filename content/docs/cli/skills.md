---
title: railway skills
description: Install or remove Railway agent skills for AI coding tools.
---

Install or remove the Railway [agent skills](/ai/agent-skills) for AI coding tools such as Claude Code, Cursor, Factory Droid, GitHub Copilot, OpenAI Codex, and OpenCode.

Skills are always installed to `~/.agents/skills` (the universal `.agents` directory). They are also installed to any detected tool directories (for example `~/.claude/skills`, `~/.cursor/skills`). Use `--agent` to target specific tools instead of auto-detection.

## Usage

```bash
railway skills [COMMAND] [OPTIONS]
```

Running `railway skills` with no subcommand is equivalent to `railway skills install`.

## Subcommands

| Subcommand | Aliases | Description |
|------------|---------|-------------|
| `install` | `add`, `update` | Install or update Railway agent skills |
| `remove` | `rm`, `uninstall` | Remove Railway agent skills |

## Options

| Flag | Description |
|------|-------------|
| `--agent <AGENT>` | Target specific agent(s) instead of auto-detection. Can be passed multiple times |

## Supported agents

| Agent | Value | Install location |
|-------|-------|------------------|
| Universal (`.agents`) | `universal` | `~/.agents/skills` |
| Claude Code | `claude-code` | `~/.claude/skills` |
| Cursor | `cursor` | `~/.cursor/skills` |
| Factory Droid | `factory-droid` | `~/.factory/skills` |
| GitHub Copilot | `copilot` | `~/.copilot/skills` |
| OpenAI Codex | `codex` | `~/.codex/skills` |
| OpenCode | `opencode` | `~/.config/opencode/skills` |

When run without `--agent`, the universal `.agents` directory is always included, and other tools are added when their config directory exists on disk.

## Examples

### Install skills for detected tools

```bash
railway skills install
```

### Install skills for a specific tool

```bash
railway skills install --agent cursor
```

### Install skills for multiple tools

```bash
railway skills install --agent claude-code --agent copilot
```

### Update existing skills

```bash
railway skills update
```

`update` is an alias for `install` and re-downloads the latest skills from the upstream repository.

### Remove skills

```bash
railway skills remove
```

### Remove skills from a specific tool

```bash
railway skills remove --agent cursor
```

## Related

- [Agent Skills](/ai/agent-skills)
- [railway setup](/cli/setup)
- [railway mcp](/cli/mcp)
