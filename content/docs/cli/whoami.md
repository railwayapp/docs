---
title: railway whoami
description: Get the current logged in user.
---

Display information about the currently logged in user.

## Usage

```bash
railway whoami [OPTIONS]
```

## Options

| Flag | Description |
|------|-------------|
| `--json` | Output in JSON format |

## Examples

### Display current user

```bash
railway whoami
```

Output:
```
Logged in as John Doe (john@example.com) 👋
```

### JSON output

```bash
railway whoami --json
```

Output:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "workspaces": [
    {
      "id": "workspace-id",
      "name": "My Team"
    }
  ]
}
```

## Related

- [railway login](/cli/login)
- [railway logout](/cli/logout)
