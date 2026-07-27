---
title: Telemetry
description: What the Railway CLI collects and how to opt out.
---

The Railway CLI collects usage telemetry to help improve the developer experience.

## What is collected

| Field | Description |
|-------|-------------|
| Command name | The command that was run (e.g. `up`, `deploy`) |
| Subcommand name | The subcommand, if any (e.g. `list` in `variable list`) |
| Duration | How long the command took to execute, in milliseconds |
| Success | Whether the command completed successfully |
| Error message | A truncated error message if the command fails |
| OS | The operating system (e.g. `linux`, `macos`, `windows`) |
| Architecture | The CPU architecture (e.g. `x86_64`, `aarch64`) |
| CLI version | The version of the Railway CLI |
| CI | Whether the command was run in a CI environment |

No project source code, or environment variable values are collected.

## Opting out

Set either environment variable to `1` to disable telemetry:

```bash
export DO_NOT_TRACK=1
# or
export RAILWAY_NO_TELEMETRY=1
```

`DO_NOT_TRACK` follows the [Console Do Not Track](https://consoledonottrack.com/) convention. `RAILWAY_NO_TELEMETRY` is a Railway-specific alternative.
