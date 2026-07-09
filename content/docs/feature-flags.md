---
title: Feature Flags
description: Define typed feature flags with targeting rules for your Railway projects.
---

Feature flags are a typed configuration registry scoped to your project. Each flag has a default value and optional targeting rules evaluated at read time.

Use feature flags to:

- Ship a risky rewrite dark and flip it on for your own team before anyone else sees it
- Roll a new pricing model or algorithm out to 10% of users, watch metrics, then go wide
- Gate enterprise-only capabilities by plan without maintaining separate builds
- Kill switch an expensive endpoint or flip on `maintenance-mode` mid-incident without a deploy
- Tune runtime knobs — rate limits, batch sizes, model parameters — as `number` or `json` values that change without redeploying

Feature flags are not environment variables. For static per-environment secrets and config, use [Variables](/variables).

## Dashboard

1. Open a project → **Settings → Feature Flags**
2. Create a flag: name, type (`bool`, `string`, `number`, `json`), default, and optional targeting rules
3. Project admins can create, edit, and delete flags

### Targeting rules

Each rule has:

- **Attribute** — compare a context attribute (for example `plan`)
- **Rollout %** — bucket on a key attribute with a percentage threshold
- **Serve** — value returned when the rule matches

All matching rules must agree on the served value; otherwise the default wins.

## Railway TypeScript SDK

Install the [Railway TypeScript SDK](https://github.com/railwayapp/railway-ts-sdk) and set a [project token](/integrations/api#project-token) as the `RAILWAY_TOKEN` variable on your service. Initialization is then zero-config — the project token authenticates the SDK and pins the flag scope to its project:

```typescript
import { flags } from "railway";

await flags.init();

// Context is a flat bag of attributes; `key` is the stable identity
// used for percentage rollouts.
const enabled = flags.getBoolean("checkout-v2", { key: userId, plan: "enterprise" }, false);

// evaluate* variants also return the resolution reason and rule trace.
const limit = flags.evaluateNumber("api-rate-limit", { key: userId }, 100);
```

The SDK polls the registry in the background and evaluates flags in-process, so reads are synchronous and never block a request.

Token resolution order: explicit `token` option → `RAILWAY_TOKEN` (project token, recommended) → `RAILWAY_API_TOKEN` (account bearer token, last resort).

## AI agents and MCP

Remote MCP (`https://mcp.railway.com`) exposes feature flag tools:

| Tool | Role | Description |
|---|---|---|
| `list-feature-flags` | viewer | List a project's flags |
| `get-feature-flag` | viewer | Inspect one flag |
| `set-feature-flag` | admin | Create a flag or update its default |
| `delete-feature-flag` | admin | Delete a flag |

Example prompts:

```text
List feature flags for my Railway project
```

```text
Set the checkout-v2 feature flag default to true on project <projectId>
```

Install agent tooling with `railway setup agent --remote`. See [Railway MCP Server](/ai/mcp-server) and [Agent Skills](/ai/agent-skills).

## CLI

Manage flags with `railway flag`:

```bash
railway flag list
railway flag set checkout.v2 true
railway flag set theme "blue"
railway flag set checkout.v2 true --when 'plan == "enterprise"'
railway flag set checkout.v2 true --when "bucket(user_id) < 0.25"
railway flag unset checkout.v2 --rule-id enterprise-on
railway flag delete checkout.v2
```

`--when` attaches a targeting rule instead of changing the default. Use `--json` for machine-readable output.

## Related

- [Variables](/variables) — environment-scoped configuration
