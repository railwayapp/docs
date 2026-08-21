---
title: Edge rules
description: Match and handle HTTP requests at Railway's edge before they reach your service.
---

Edge rules match incoming HTTP requests and handle them at Railway's edge
before they reach your service. You can block, allow, challenge, redirect, or
override caching for matching requests.

<Banner variant="info">
Edge rules require a public domain and a plan with an edge-rule allowance. Add
a [Railway-provided or custom domain](/networking/domains) before you configure
rules. The rule editor displays the limit for your plan.
</Banner>

## How edge rules work

Railway evaluates edge rules at the nearest [edge
location](/networking/edge-networking). Rules are configured for a service in
the selected environment and apply to every domain attached to that service.

The order of your rules determines how Railway handles a request:

1. Railway evaluates enabled rules from top to bottom.
2. A rule runs its action when its configured match expression evaluates to
   true.
3. The first matching terminal action decides the request outcome. Block,
   allow, challenge, and redirect are terminal actions.
4. An override cache action changes caching behavior and continues to later
   rules.
5. If no terminal action matches, Railway forwards the request to your
   service.

A challenge is terminal for a visitor without valid challenge clearance. After
the visitor passes the challenge, Railway continues evaluating later rules on
subsequent matching requests.

Saved changes propagate to Railway's edge locations within a few seconds.

## Configure edge rules

Use the rule builder in your service settings to create and order rules:

1. Open the service in the environment you want to configure.
2. Navigate to the service **Settings**.
3. In the **Edge** section, find **Edge Rules**.
4. Click **Add a rule**, or click **Manage Rules** to edit existing rules.
5. Optional: Enter a name that describes the rule.
6. Configure one or more request conditions.
7. Select the action Railway runs when the conditions match.
8. Add other rules, then drag them into evaluation order.
9. Click **Save**.

Toggle a rule off to keep its configuration without evaluating it. Remove every
rule and save to clear the ruleset.

## Match requests

Each condition compares a request attribute with a value. The available
operators depend on the attribute.

| Attribute | Operators | Behavior |
| --------- | --------- | -------- |
| Client IP | is, is not, is in, is not in | Matches an IPv4 address or CIDR range, such as `203.0.113.7` or `203.0.113.0/24`. Requests without an IPv4 source don't match. |
| Host | is, is not, is in, matches | Matches the lowercase, canonical hostname without a port. |
| Path | is, is not, contains, matches | Matches the normalized path without the query string. Path comparisons are case-sensitive. |
| Header | is, is not, contains, matches | Requires a header name. Header names are case-insensitive, and header values are case-sensitive. |

The **is in** and **is not in** operators accept comma-separated values in the
builder. Use **matches** for wildcard patterns. The `*` character matches zero
or more characters, so `/admin*` matches `/admin` and `/admin/users`. With any
other operator, `*` is a literal character.

Combine conditions with **and** or **or**. You can also add nested groups that
match all, any, or none of their conditions. A negative comparison against a
missing value doesn't match. For example, `Header x-client is not mobile`
doesn't match a request without the `x-client` header.

## Choose an action

Each rule has one action. Terminal actions stop evaluation when they match,
while an override cache action continues to later rules.

| Action | Behavior | Terminal |
| ------ | -------- | -------- |
| Block | Returns an HTTP status from 400 through 499. The default is `403`, and you can add a response body. | Yes |
| Allow | Forwards the request to your service and skips all later rules. Put allow rules above broader block or challenge rules to create exceptions. | Yes |
| Challenge | Shows a browser verification page to visitors without valid clearance. A cleared visitor continues through later rules. | Yes, until cleared |
| Redirect | Redirects to another host or an exact HTTP or HTTPS URL. Supported status codes are `301`, `302`, `307`, and `308`. Host redirects can preserve the original path and query string. | Yes |
| Override cache | Caches matching responses for a fixed time or bypasses the edge cache. A fixed time can range from 1 second through 30 days. See [CDN caching](/networking/cdn). | No |

## Order rules safely

Place narrow exceptions before broad terminal rules. For example, to let an
office network reach `/admin` while blocking everyone else:

1. Add an allow rule that matches both `/admin*` and the office IPv4 CIDR.
2. Add a block rule below it that matches `/admin*`.

The allow rule admits requests from the office network and skips the block
rule. Other requests don't match the allow rule, so Railway evaluates and
applies the block rule.

## Edit rules as JSON

Click **Edit as JSON** in the rule editor to work with the complete ruleset.
Railway validates the whole ruleset before saving it. If validation fails,
Railway displays diagnostics and doesn't change the saved rules.

The following ruleset implements the ordered allow and block rules described
above, then bypasses caching for `/api` requests:

```json
{
  "version": 1,
  "rules": [
    {
      "description": "Allow office access to admin",
      "priority": 10,
      "enabled": true,
      "if": {
        "and": [
          {
            "attr": "http.path",
            "op": "matches",
            "value": "/admin*"
          },
          {
            "attr": "ipv4.src",
            "op": "in",
            "value": ["203.0.113.0/24", "198.51.100.7"]
          }
        ]
      },
      "then": {
        "action": "allow"
      }
    },
    {
      "description": "Block other admin requests",
      "priority": 20,
      "enabled": true,
      "if": {
        "attr": "http.path",
        "op": "matches",
        "value": "/admin*"
      },
      "then": {
        "action": "block",
        "params": {
          "status": 403,
          "body": "Forbidden"
        }
      }
    },
    {
      "description": "Bypass cache for API requests",
      "priority": 30,
      "enabled": true,
      "if": {
        "attr": "http.path",
        "op": "matches",
        "value": "/api*"
      },
      "then": {
        "action": "cache_override",
        "params": {
          "bypass": true
        }
      }
    }
  ]
}
```

### Configure the ruleset

The ruleset object contains the schema version and the ordered rules.

| Field | Required | Description |
| ----- | -------- | ----------- |
| `version` | Yes | Schema version. Set this to `1`. |
| `rules` | Yes | Array of rule objects. |

Each rule supports these fields:

| Field | Required | Description |
| ----- | -------- | ----------- |
| `description` | No | Human-readable rule name, up to 256 characters. |
| `priority` | Yes | Unique unsigned integer that determines evaluation order. Lower values run first. |
| `enabled` | No | Whether Railway evaluates the rule. Defaults to `true`. |
| `if` | Yes | Condition clause or a nested `and`, `or`, or `not` expression. |
| `then` | Yes | Action object with an `action` name and optional `params`. |
| `id` | No | Stable rule ID. Omit it when creating a rule so Railway assigns a `rul_` ID. |

### Configure condition JSON

A condition clause uses `attr`, `op`, and `value`. Add `key` when `attr` is
`http.header`:

```json
{
  "attr": "http.header",
  "key": "x-client-type",
  "op": "eq",
  "value": "mobile"
}
```

Use the attribute and operator identifiers in the following table.

| Attribute identifier | Supported operator identifiers |
| -------------------- | ------------------------------ |
| `ipv4.src` | `eq`, `neq`, `in`, `not_in` |
| `http.host` | `eq`, `neq`, `in`, `matches` |
| `http.path` | `eq`, `neq`, `contains`, `matches` |
| `http.header` | `eq`, `neq`, `contains`, `matches` |

The `in` and `not_in` operators require an array of strings. All other
operators require one string.

Combine conditions by nesting them under `and`, `or`, or `not`:

```json
{
  "or": [
    {
      "attr": "http.path",
      "op": "matches",
      "value": "/internal*"
    },
    {
      "not": {
        "attr": "http.header",
        "key": "x-client-type",
        "op": "eq",
        "value": "trusted"
      }
    }
  ]
}
```

### Configure action JSON

The action object uses one of these shapes.

| Action | Parameters |
| ------ | ---------- |
| `block` | Optional `status` from 400 through 499 and optional `body` up to 4,096 bytes. |
| `allow` | No parameters. |
| `challenge` | No parameters. |
| `redirect` | Exactly one of `host` or `location`. Optional `status` is `301`, `302`, `307`, or `308`. Host redirects also accept `preserve_path` and `preserve_query` booleans, which default to `true`. |
| `cache_override` | Exactly one of `ttl_seconds` from `1` through `2592000`, or `bypass` set to `true`. |

## Review limits and validation

Railway enforces your plan's rule count and validates each ruleset before it
reaches the edge. The editor reports validation errors next to the affected
rule or field.

In addition to the plan limit, a ruleset has these limits:

- 64 KiB for the complete JSON ruleset.
- 32 condition clauses per rule.
- Four levels of condition expression depth.
- 256 characters per condition value and description.
- 64 entries in an `in` or `not_in` value array.
- Eight `*` wildcards per pattern.

## Related documentation

Explore these resources to learn about the networking features that interact
with edge rules:

- Use [WAF](/networking/waf) for service-wide Under Attack Mode.
- Review [CDN](/networking/cdn) for edge caching behavior and configuration.
- Read [Edge networking](/networking/edge-networking) to learn how requests
  reach Railway's edge locations.
- Configure [domains](/networking/domains) to attach Railway-provided and
  custom domains to a service.
