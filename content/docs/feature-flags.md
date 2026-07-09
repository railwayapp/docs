---
title: Feature Flags
description: Define typed feature flags with targeting rules for your Railway projects and workspaces.
---

Feature flags (internally **Signals**) are a typed configuration registry scoped to a **project** or **workspace**. Each flag has a default value and optional targeting rules evaluated at read time.

Use feature flags when you need:

- Typed defaults (`bool`, `string`, `number`, `json`)
- Targeting by attributes (for example `plan = enterprise`)
- Percentage rollouts keyed on stable attributes (for example `workspace_id`)
- A central registry that apps poll at runtime (via the SDK or GraphQL)

Feature flags are **not** environment variables. For static per-environment secrets and config, use [Variables](/docs/variables).

## Scopes

| Scope | Owner string | Managed from |
|---|---|---|
| Project | `project:<projectId>` | Project **Settings → Feature Flags** |
| Workspace | `workspace:<workspaceId>` | Workspace settings (read-only in project settings) |

Runtime apps read **one scope** at a time. Project and workspace registries are separate namespaces.

## Dashboard

1. Open a project → **Settings → Feature Flags**
2. Create a flag: name, type, default, optional targeting rules
3. Project admins can create, edit, and delete project-scoped flags
4. Workspace-scoped flags appear in a read-only section when they exist

### Targeting rules

Each rule has:

- **Attribute** — compare a context attribute (for example `plan`)
- **Rollout %** — bucket on a key attribute with a percentage threshold (0–100 in the UI; stored as 0–1)
- **Serve** — value returned when the rule matches

All matching rules must agree on the served value; otherwise the default wins.

## Runtime SDK

Install the [Railway TypeScript SDK](https://github.com/railwayapp/railway-ts-sdk) and initialize flags for your scope:

```typescript
import { flags } from "railway";

await flags.init({
  scope: { projectId: process.env.RAILWAY_PROJECT_ID! },
});

const enabled = flags.getBoolean("checkout-v2", {
  targetingKey: userId,
  attributes: { plan: "enterprise" },
});
```

The SDK polls the registry and evaluates flags in-process using the same resolver as the API.

## GraphQL API

Public GraphQL operations include `signals`, `signal`, `signalCreate`, `signalDefaultSet`, `signalRuleSet`, `signalRuleUnset`, and `signalDelete`. Pass an explicit `owner` (`project:<id>` or `workspace:<id>`).

See the [GraphQL overview](/docs/integrations/api/graphql-overview) for authentication.

## AI agents and MCP

Remote MCP (`https://mcp.railway.com`) exposes feature flag tools:

| Tool | Role | Description |
|---|---|---|
| `list-feature-flags` | viewer | List project flags; includes workspace flags when present |
| `get-feature-flag` | viewer | Inspect one flag |
| `set-feature-flag` | admin | Create a flag or update its default |
| `delete-feature-flag` | admin | Delete a project-scoped flag |

Example prompts:

```text
List feature flags for my Railway project
```

```text
Set the checkout-v2 feature flag default to true on project <projectId>
```

Install agent tooling with `railway setup agent --remote`. See [Railway MCP Server](/docs/ai/mcp-server) and [Agent Skills](/docs/ai/agent-skills).

## CLI

When available in your CLI version:

```bash
railway flag list --project <project-id> --json
railway flag checkout-v2 true --project <project-id>
```

Upgrade with `railway upgrade --yes` if `railway flag` is not found.

## Related

- [Variables](/docs/variables) — environment-scoped configuration
- [Priority Boarding](/docs/platform/priority-boarding) — account beta program (unrelated to project feature flags)
