---
title: Quickstart
description: Get started with Login with Railway in 5 steps.
---

This guide walks through implementing Login with Railway for a web application using the authorization code flow. By the end, you'll have working code that authenticates users and makes API requests on their behalf.

## 1. Create an OAuth App

Navigate to your workspace settings → **Developer** → **New OAuth App**, and enter the app name and one or more redirect URIs. The redirect URIs you configure must exactly match what your application sends in authorization requests.

<Banner variant="info">
For native apps, use `http://127.0.0.1:3000/callback` (not `localhost`), or a custom URL scheme like `myapp://callback`.
</Banner>

After creating the app, copy the client ID and client secret. The secret is only shown once.

## 2. Redirect to Authorization

When a user wants to sign in, redirect their browser to the authorization endpoint:

```
https://backboard.railway.com/oauth/auth
  ?response_type=code
  &client_id=YOUR_CLIENT_ID
  &redirect_uri=https://yourapp.com/callback
  &scope=openid+email+profile
  &state=RANDOM_STATE_VALUE
```

- `response_type`: Must be `code`
- `client_id`: Your OAuth app's client ID
- `redirect_uri`: Must exactly match a registered URI
- `scope`: Space-separated permissions; `openid` is required
- `state`: Random string for CSRF protection; verify it matches when redirected back

For additional security, add PKCE parameters. While optional for web apps, PKCE is mandatory for native apps. See [Creating an App](/reference/oauth/creating-an-app) for details.

## 3. Exchange Code for Tokens

After the user approves, they are redirected to your `redirect_uri` with a `code` parameter. Exchange it for tokens using Basic authentication:

```bash
curl -X POST https://backboard.railway.com/oauth/token \
  -u "YOUR_CLIENT_ID:YOUR_CLIENT_SECRET" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=authorization_code" \
  -d "code=AUTHORIZATION_CODE" \
  -d "redirect_uri=https://yourapp.com/callback"
```

Response:

```json
{
  "access_token": "...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "id_token": "ey...",
  "scope": "openid email profile"
}
```

The `access_token` authenticates API requests and expires in one hour. The `id_token` is a signed JWT to verify the user's identity.

## 4. Get User Info

Retrieve the authenticated user's profile:

```bash
curl https://backboard.railway.com/oauth/me \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

```json
{
  "sub": "user_abc123",
  "email": "user@example.com",
  "name": "Jane Developer",
  "picture": "https://avatars.githubusercontent.com/u/12345"
}
```

- The `sub` claim is the user's ID. You can use this to associate the Railway account with a user in your application.

## 5. Make API Requests

Use the access token with the [Public API](/guides/public-api):

```bash
curl https://backboard.railway.com/graphql/v2 \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query": "query { me { name email } }"}'
```

```json
{
  "data": {
    "me": {
      "name": "Jane",
      "email": "jane.doe@example.tld"
    }
  }
}
```

## Next Steps

- [Login & Tokens](/reference/oauth/login-and-tokens): Token lifecycle and refresh tokens for long-lived access
- [Scopes & User Consent](/reference/oauth/scopes-and-user-consent): Available scopes and permissions
- [Fetching Workspaces or Projects](/reference/oauth/fetching-workspaces-or-projects): Query resources users granted access to
