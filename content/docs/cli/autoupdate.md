---
title: railway autoupdate
description: Manage Railway CLI auto-update preferences.
---

Manage auto-update preferences for the Railway CLI on your local machine.

The command controls whether the CLI can automatically download or run updates
for the installed binary. It doesn't change any project, environment, or
service settings.

## Usage

```bash
railway autoupdate <COMMAND>
```

## Subcommands

| Subcommand | Aliases | Description |
|------------|---------|-------------|
| `enable` | `on` | Enable automatic updates |
| `disable` | `off` | Disable automatic updates |
| `status` | | Show current auto-update status |
| `skip` | | Skip the current pending version |

## Examples

### Show auto-update status

```bash
railway autoupdate status
```

Shows whether automatic updates are enabled, disabled by local preference,
disabled by environment, or disabled in CI.

### Enable automatic updates

```bash
railway autoupdate enable
```

Enables automatic updates unless they are disabled by `RAILWAY_NO_AUTO_UPDATE`
or by a CI environment.

### Disable automatic updates

```bash
railway autoupdate disable
```

Disables future automatic updates. You can still update the CLI manually with
`railway upgrade`.

### Skip a pending update

```bash
railway autoupdate skip
```

Skips the current pending version. Automatic updates resume when a newer version
is released.

## Related

- [railway upgrade](/cli/upgrade)
- [railway docs](/cli/docs)
