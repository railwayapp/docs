---
title: railway starship
description: Output metadata for Starship prompt integration.
---

Output project metadata in JSON format for Starship prompt integration.

## Usage

```bash
railway starship
```

This command is primarily used for [Starship](https://starship.rs/) prompt integration to display Railway project information in your terminal prompt.

## Output

Returns JSON containing the linked project information:

```json
{
  "project": "project-id",
  "name": "my-project",
  "environment": "environment-id",
  "environmentName": "production"
}
```

## Related

- [railway status](/cli/status)
