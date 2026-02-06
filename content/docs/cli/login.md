---
title: railway login
description: Login to your Railway account.
---

Login to your Railway account to authenticate the CLI.

## Usage

```bash
railway login [OPTIONS]
```

## Options

| Flag | Description |
|------|-------------|
| `-b, --browserless` | Login without opening a browser (uses pairing code) |

## Examples

### Browser login (default)

Opens your default browser to authenticate:

```bash
railway login
```

### Browserless login

Use this in environments without a browser (e.g., SSH sessions):

```bash
railway login --browserless
```

This displays a pairing code and URL. Visit the URL and enter the code to authenticate.

## Environment variables

If `RAILWAY_TOKEN` or `RAILWAY_API_TOKEN` is set, the CLI will use that token instead of prompting for login. See [Tokens](/cli#tokens) for more information.

## Related

- [railway logout](/cli/logout)
- [railway whoami](/cli/whoami)
- [Global Options](/cli/global-options)
