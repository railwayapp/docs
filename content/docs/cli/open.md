---
title: railway open
description: Open your project dashboard in the browser.
---

Open the Railway dashboard for the currently linked project in your default browser.

## Usage

```bash
railway open [OPTIONS]
```

## Options

| Flag | Description |
|------|-------------|
| `-p, --print` | Print the URL instead of opening it |

## Examples

### Open Dashboard

```bash
railway open
```

Opens the project dashboard in your default browser.

### Print URL Only

```bash
railway open --print
```

Outputs the dashboard URL without opening it. Useful for copying or scripting.

## Related

- [railway status](/cli/status)
- [railway link](/cli/link)
