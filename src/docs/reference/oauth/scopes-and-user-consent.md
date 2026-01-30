---
title: Scopes & User Consent
description: Configure OAuth scopes to request appropriate permissions from users.
---

Scopes define what permissions your application requests from users. Each scope grants access to specific data or capabilities, and users see exactly what you're asking for on the consent screen. Requesting only the scopes you need improves user trust and reduces the permissions your application needs to manage securely.

## Available Scopes

| Scope | Description |
|-------|-------------|
| `openid` | Required for all requests. |
| `email` | Access user's email address in claims |
| `profile` | Access user's name and picture in claims |
| `offline_access` | Receive refresh tokens (requires `prompt=consent`) |
| `workspace:viewer` | Viewer access to user-selected workspaces |
| `workspace:member` | Member access to user-selected workspaces |
| `workspace:admin` | Admin access to user-selected workspaces |
| `project:viewer` | Viewer access to user-selected projects |
| `project:member` | Member access to user-selected projects |

The `offline_access` scope grants [refresh tokens](/reference/oauth/login-and-tokens#refresh-tokens), but only when combined with `prompt=consent` in the authorization request. Refresh tokens allow your application to obtain new access tokens after the original expires, enabling long-running access without requiring users to re-authenticate.

Workspace and project scopes grant access to Railway resources. These are selective: the user chooses which specific workspaces or projects to share during consent. Your application only receives access to the resources they select, not their entire account.

<Banner variant="info">
The scope you request sets the maximum access level, but the user's actual role may be lower. For example, if your app requests `workspace:admin` but the user is only a member, the token will have member-level access.
</Banner>

## Claims

Claims are attributes about the user which can be accessed through the `/oauth/me` endpoint. Which claims you receive depends on the scopes the user approved:

| Claim | Required Scope |
|-------|----------------|
| `sub` | `openid` |
| `email` | `email` |
| `name` | `profile` |
| `picture` | `profile` |

The `sub` claim is the user's unique, stable identifier within Railway. Use this to associate their Railway account with records in your application's database.

## Consent Screen

When a user authorizes your application, a consent screen is displayed showing your app's name and the permissions you're requesting. This transparency lets users make informed decisions about what access to grant.

### Workspace and Project Selection

When your app requests workspace or project scopes, the consent screen allows users to select which workspaces or projects they want to grant access to.

- For workspace scopes (`workspace:viewer`, `workspace:member`, `workspace:admin`), users pick from their available workspaces. Your application receives access only to the workspaces they select.
- For project scopes (`project:viewer`, `project:member`), users pick from projects across all their workspaces.

### Automatic Consent

If a user has previously authorized your application with the same or broader scopes, the consent screen may be skipped and users are redirected immediately.

However, if you request workspace or project scopes, users might want to change which resources they share, but the consent screen may be skipped.

To always show the consent screen, add `prompt=consent` to your authorization request.

## Role Permissions

Workspace and project scopes map to [Workspace Roles](/reference/teams#inviting-members) and [Project Member Roles](/reference/project-members#scope-of-permissions). The access your application receives through these scopes matches what a user with that role could do through the Railway dashboard or API.

## Missing a Scope?

If the available scopes don't cover your use case, we'd love to hear about it. Share your feedback on <a href="https://central.railway.com" target="_blank">Central Station</a> so we can learn about what you're building.