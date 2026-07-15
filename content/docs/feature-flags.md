---
title: Feature Flags
description: Define typed feature flags with targeting rules for a Railway project, and read them at runtime with the TypeScript SDK, CLI, or MCP.
---

<Banner variant="primary">Feature Flags are available through <a href="/platform/priority-boarding" target="_blank">Priority Boarding</a>. Breaking changes may occur.</Banner>

Feature flags are a typed configuration registry scoped to a project. Each flag has a default value and optional targeting rules evaluated at read time.

Use feature flags to:

- Enable a feature for your team before rolling it out to everyone
- Roll out a new pricing model or algorithm to 10% of users and adjust based on metrics
- Gate capabilities by plan without maintaining separate builds
- Turn off an expensive endpoint or enable maintenance mode without a deploy
- Change runtime values like rate limits or batch sizes without redeploying

Feature flags are not environment variables. For static per-environment secrets and config, use [Variables](/variables).

## How it works

Each flag has a default value and, optionally, some rules. A rule is a condition plus the value to serve when that condition is true.

When your app reads a flag, it passes context about who's asking, then gets a value back:

```typescript
const on = flags.getBoolean("checkout-v2", {
  key: "user_8f3a",
  plan: "enterprise",
});
```

Railway checks the flag's rules against that context. A rule like "serve `true` when plan is enterprise" matches, so `on` is `true`. For a user on the free plan, no rule matches, so `on` falls back to the flag's default.

A read always returns a value: the matching rules' value when they agree, otherwise the default. Your app doesn't call Railway on every read either. The SDK keeps a copy of your flags in memory and refreshes it in the background, so reads are instant.

## Flag types

Every flag has one of four types, fixed when you create it.

| Type | Use it for | Example default |
|---|---|---|
| `bool` | On/off gates and kill switches | `false` |
| `string` | Variants, modes, or a single string value | `"classic"` |
| `number` | Runtime knobs like rate limits or batch sizes | `100` |
| `json` | Structured config read as one object | `{"model":"small"}` |

## Dashboard

Manage project flags from the dashboard:

1. Open a project, then navigate to **Settings → Feature Flags**.
2. Click **Create flag**, then set a name, type, default value, and optional targeting rules.
3. Project admins can create, edit, and delete flags. Members with read access can view them.

### Targeting rules

A rule has a **When** condition and a **Serve** value. The condition is one of:

- **Attribute**: compare a context attribute against a value, for example `plan` equals `enterprise`.
- **Rollout %**: enter a **Key** attribute to hash on and a percentage. The rule matches that share of subjects, held stable by the key.

Add several rules to a flag to layer targeting. All matching rules must agree on the served value; otherwise the default wins. The dashboard builder writes one condition per rule. To combine conditions in a single rule with `AND`/`OR`, use the [CLI](/cli/flag) or API.

## TypeScript SDK

Read flags at runtime with the [Railway TypeScript SDK](https://github.com/railwayapp/railway-ts-sdk), which is <a href="https://github.com/railwayapp/railway-ts-sdk" target="_blank">open source on GitHub</a>.

```bash
bun add railway
```

**Note:** The SDK is under active development while feature flags are in Priority Boarding, and its API may change in breaking ways between releases.

### Authentication

The recommended setup uses a [project token](/integrations/api#project-token), which authenticates the SDK and identifies the project that owns the flags.

Set the project token as the `RAILWAY_TOKEN` variable on your service. The SDK reads it automatically and infers the project from the token:

```typescript
import { flags } from "railway";

await flags.init();
```

You don't need to set `RAILWAY_PROJECT_ID` or pass a project ID when you use a project token.

When you pass a project token directly, set `authType` to `"project-token"`. The SDK still infers the project from the token:

```typescript
await flags.init({
  token: myProjectToken,
  authType: "project-token",
});
```

An account token doesn't identify a project. If you use one instead, pass the project explicitly or rely on the `RAILWAY_PROJECT_ID` variable injected into Railway deployments:

```typescript
await flags.init({
  token: myAccountToken,
  scope: { projectId: "<project-id>" },
});
```

Token resolution order is the explicit `token` option, then `RAILWAY_TOKEN` (project token, recommended), then `RAILWAY_API_TOKEN` (account token). Without a project token or an explicit or injected project ID, `init()` throws.

### Read a flag

Reads are synchronous. Pass the flag name, an evaluation context, and a fallback:

```typescript
// bool: gate a feature
const checkoutV2 = flags.getBoolean("checkout-v2", { key: userId }, false);

// string: pick a variant
const theme = flags.getString("ui-theme", { key: userId }, "classic");

// number: tune a runtime knob without redeploying
const rateLimit = flags.getNumber("api-rate-limit", { key: userId }, 100);

// json: read structured config as one object
const model = flags.getJson<{ name: string; temperature: number }>(
  "model-config",
  { key: userId },
  { name: "small", temperature: 0.2 },
);
```

The context is a flat bag of attributes. `key` is the stable identity used for percentage rollouts. Any other attributes, like `plan` or `region`, are matched against targeting rules.

**Note:** The fallback is returned only when the flag can't be read: the registry hasn't synced yet, the flag doesn't exist, or its type doesn't match. When the flag exists but no rule matches, the read returns the flag's configured default.

### Inspect a resolution

Each read has an `evaluate*` variant that returns the value along with why it resolved that way:

```typescript
const { value, reason, trace } = flags.evaluateBoolean(
  "checkout-v2",
  { key: userId },
  false,
);
// reason: "TARGETING_MATCH", "SPLIT", "NO_MATCH", "NOT_FOUND", ...
```

`trace` lists each rule that was checked and whether it matched, which is useful when a flag doesn't resolve the way you expect.

### Roll out to a percentage of a segment

Combine attribute targeting with a percentage rollout to ship progressively. Create a rule that serves `true` to 25% of enterprise users with the [CLI](/cli/flag):

```bash
railway flag set checkout-v2 true --scope project:<project-id> \
  --when 'plan == "enterprise" && bucket(key) < 0.25'
```

Your app reads the flag with the same attributes the rule targets:

```typescript
const enabled = flags.getBoolean(
  "checkout-v2",
  { key: userId, plan: user.plan },
  false,
);
```

Bucketing is deterministic, so the same subject stays in or out of the rollout across reads. Raise the threshold to widen the rollout, with no deploy.

A rule that buckets on `key` needs a `key` in the read context. Without one, the flag returns its default instead of applying the rollout, so a missing key never rolls a feature out at random. The bucket attribute doesn't have to be `key`: you can hash on any attribute you pass, such as `accountId`. Passing `{ key: ... }` is the convention, and it also exposes the value as `targetingKey`. In the dashboard, the rollout rule's **Key** field is where you name the attribute to hash on.

## CLI

Manage flags with `railway flag`. See the [full command reference](/cli/flag) for every subcommand and option.

```bash
railway flag list --scope project:<project-id>
railway flag set checkout.v2 true --scope project:<project-id>
railway flag set theme "blue" --scope project:<project-id>
railway flag set checkout.v2 true --scope project:<project-id> \
  --when 'plan == "enterprise"'
railway flag set checkout.v2 true --scope project:<project-id> \
  --when "bucket(key) < 0.25"
railway flag unset checkout.v2 --scope project:<project-id> \
  --rule-id enterprise-on
railway flag delete checkout.v2 --scope project:<project-id>
```

Pass `--scope project:<project-id>` to target the project that owns the flags. You can set `RAILWAY_FLAGS_SCOPE=project:<project-id>` to avoid repeating the option. Use `--json` for machine-readable output.

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

## Related

- [railway flag](/cli/flag) (CLI command reference)
- [Variables](/variables) (environment-scoped configuration)
