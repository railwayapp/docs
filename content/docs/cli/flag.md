---
title: railway flag
description: Manage feature flags from the command line.
---

Create, inspect, and target [feature flags](/feature-flags) for a project.

<Banner variant="info">The `flag` command manages [feature flags](/feature-flags), which are available through <a href="/platform/priority-boarding" target="_blank">Priority Boarding</a>. It's under active development, and its commands and flags may change in breaking ways.</Banner>

## Usage

```bash
railway flag <COMMAND> [OPTIONS]
```

## Subcommands

| Subcommand | Aliases | Description |
|------------|---------|-------------|
| `list` | `ls` | List feature flags for a project |
| `set` | | Set a flag's default value, or attach a targeting rule with `--when` |
| `unset` | | Remove a targeting rule from a flag |
| `delete` | `rm`, `remove` | Delete a feature flag |

## Target a project

Feature flags belong to a project. Pass the project as a global option, so it works on every subcommand:

```bash
railway flag list --scope project:<project-id>
```

To avoid repeating the option, set `RAILWAY_FLAGS_SCOPE`. The examples below assume this variable is set:

```bash
export RAILWAY_FLAGS_SCOPE=project:<project-id>
```

## Examples

### List flags

```bash
railway flag list
```

Add `--full` to show rule IDs and empty rule sections.

### Set a flag's default

The type is inferred from the value: `true` or `false` becomes `bool`, a number becomes `number`, valid JSON becomes `json`, and anything else becomes `string`.

```bash
railway flag set checkout.v2 true
railway flag set theme "blue"
railway flag set api-rate-limit 100
railway flag set model-config '{"name":"small","temperature":0.2}'
```

Pass `--type` to set the type explicitly. Changing an existing flag's type clears its rules and requires `--force --type <type>`.

### Attach a targeting rule

`--when` adds a rule that serves the value when its condition matches, instead of changing the default. The flag must already exist.

```bash
railway flag set checkout.v2 true --when 'plan == "enterprise"'
railway flag set checkout.v2 true --when "bucket(key) < 0.25"
```

Rules are keyed by `--rule-id`. Reuse an ID to replace a rule. Omit it and the CLI derives a stable ID from the name and expression.

### Roll out to a percentage of a segment

Combine conditions with `&&` and `||` in a single rule. This serves `true` to 25% of enterprise users:

```bash
railway flag set checkout.v2 true \
  --when 'plan == "enterprise" && bucket(key) < 0.25'
```

### Remove a rule

```bash
railway flag unset checkout.v2 --rule-id enterprise-on
```

### Delete a flag

```bash
railway flag delete checkout.v2
```

## Targeting expressions

`--when` takes a CEL-style expression or raw JSON.

| Form | Example |
|------|---------|
| Comparison | `plan == "enterprise"`, `region == "us-west"` |
| List membership | `plan in ["enterprise", "pro"]` |
| Percentage rollout | `bucket(key) < 0.25` |
| Boolean logic | `plan == "enterprise" && bucket(key) < 0.25`, `!(plan == "free")` |

Comparison operators are `==`, `!=`, `<`, `<=`, `>`, `>=`, `contains`, and `matches`. Bucket thresholds are between 0 and 1, so `< 0.25` is 25%. Target rules on the attributes your app passes in the [evaluation context](/feature-flags#read-a-flag), like `plan` or `region`. The bucket attribute is the stable key each subject is hashed on, typically the `key` in that context.

## Options

### Global options

| Flag | Description |
|------|-------------|
| `--scope <SCOPE>` | Project target in the format `project:<id>` |
| `--json` | Output in JSON format |

### Options for `set`

| Argument or flag | Description |
|------------------|-------------|
| `<NAME>` | Flag name. Letters, numbers, dots, dashes, and underscores. Required |
| `<VALUE>` | Default value, or the rule's value when `--when` is passed. Required |
| `--when <EXPRESSION>` | Attach a targeting rule with this condition instead of changing the default |
| `--rule-id <ID>` | Stable rule ID for `--when`. Defaults to a hash of the name and expression |
| `--type <TYPE>` | Flag type: `bool`, `string`, `number`, or `json`. Inferred from the value when omitted |
| `--force` | Allow replacing an existing flag's type, which clears its rules |

### Options for `list`

| Flag | Description |
|------|-------------|
| `--full` | Show rule IDs and empty rule sections |

### Options for `unset`

| Argument or flag | Description |
|------------------|-------------|
| `<NAME>` | Flag name. Required |
| `--rule-id <ID>` | Rule ID to remove. Required |

### Options for `delete`

| Argument or flag | Description |
|------------------|-------------|
| `<NAME>` | Flag name to delete. Required |

## Related

- [Feature flags](/feature-flags)
- [railway setup](/cli/setup)
