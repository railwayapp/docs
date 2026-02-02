---
title: Login & Tokens
description: Understand the OAuth authorization flow and token lifecycle.
---

Login with Railway implements the OAuth 2.0 Authorization Code flow with OpenID Connect.

<Banner variant="info">
We recommend using an OAuth 2.0 / OpenID Connect library for your language or framework rather than implementing the flow manually.
</Banner>

## Initiating Login

Redirect the user to the authorization endpoint:

```
GET https://backboard.railway.com/oauth/auth
```

| Parameter | Required | Description |
|-----------|----------|-------------|
| `response_type` | Yes | Must be `code` |
| `client_id` | Yes | Your OAuth app's client ID |
| `redirect_uri` | Yes | Must exactly match a registered URI |
| `scope` | Yes | Space-separated scopes (`openid` required) |
| `state` | Recommended | Random string for CSRF protection |
| `code_challenge` | Native Apps: Required, Web Apps: Recommended | PKCE challenge |
| `code_challenge_method` | With PKCE | Must be `S256` |
| `prompt` | No | Set to `consent` to force consent screen |

### Authorization Response

If the user approves your application, they are redirected to your redirect URI with an authorization code:

```
https://yourapp.com/callback?code=AUTHORIZATION_CODE&state=abc123
```

The code is short-lived and single-use. Exchange it for tokens immediately. If the user denies access, the redirect includes an `error` parameter instead.

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
  "expires_in": 3600,
  "id_token": "...",
  "scope": "openid email profile",
  "token_type": "Bearer"
}
```

## Access Tokens

Access tokens authenticate your application's requests to Railway's API. When you call the [Public API](/guides/public-api), include the access token in the Authorization header:

```bash
curl -X POST https://backboard.railway.com/graphql/v2 \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query": "query { me { name email } }"}'
```

## Refresh Tokens

Access tokens expire after one hour. For applications that need longer-lived access (background jobs, scheduled tasks, or simply avoiding frequent re-authentication) refresh tokens provide a way to obtain new access tokens without user interaction.

### Obtaining Refresh Tokens

To receive a refresh token, your authorization request must include both the `offline_access` scope and the `prompt=consent` parameter:

```
https://backboard.railway.com/oauth/auth
  ?response_type=code
  &client_id=YOUR_CLIENT_ID
  &redirect_uri=https://yourapp.com/callback
  &scope=openid+offline_access
  &prompt=consent
```

The `prompt=consent` ensures the user sees the consent screen, which is required for granting offline access. Without it, returning users might skip consent through automatic approval, and no refresh token would be issued.

Response:

```json
{
  "access_token": "...",
  "expires_in": 3600,
  "id_token": "...",
  "refresh_token": "...",
  "scope": "openid email profile offline_access",
  "token_type": "Bearer"
}
```

### Refreshing Tokens

When your access token expires (or is about to), exchange the refresh token for a new access token:

```bash
curl -X POST https://backboard.railway.com/oauth/token \
  -u "YOUR_CLIENT_ID:YOUR_CLIENT_SECRET" \
  -d "grant_type=refresh_token" \
  -d "refresh_token=REFRESH_TOKEN"
```

```json
{
  "access_token": "...",
  "expires_in": 3600,
  "id_token": "...",
  "refresh_token": "...",
  "scope": "openid email profile offline_access",
  "token_type": "Bearer"
}
```

Refresh tokens are rotated for security. The response includes a `refresh_token` field that may initially contain the same value, but will eventually return a new token. Always store and use the refresh token from the most recent response. **Using an old, rotated token will fail, and the user would need to re-authenticate.** The new refresh token has a fresh one-year lifetime from the time of issuance.

<Banner variant="info">
Each user authorization can have a maximum of 100 refresh tokens. If you exceed this limit, the oldest tokens are revoked automatically.
</Banner>

## ID Tokens

ID tokens are JSON Web Tokens (JWTs). Unlike access tokens, which are opaque and meant for API authorization, ID tokens are designed to be parsed and validated by your application to confirm who authenticated.

### Claims

The claims are not present in the ID token, but can be obtained by calling the `/oauth/me` endpoint.

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

| Claim | Scope Required | Description |
|-------|----------------|-------------|
| `sub` | `openid` | User's unique identifier |
| `email` | `email` | User's email address |
| `name` | `profile` | User's display name |
| `picture` | `profile` | URL to user's avatar |

The `sub` claim is always present and is stable for a given user. Use it to identify returning users in your application.

## Pushed Authorization Requests (PAR)

Pushed Authorization Requests (PAR) are supported. This keeps authorization details out of browser history. Instead of passing all parameters in the browser redirect, you first POST them to the PAR endpoint:

```bash
curl -X POST https://backboard.railway.com/oauth/request \
  -u "YOUR_CLIENT_ID:YOUR_CLIENT_SECRET" \
  -d "redirect_uri=https://yourapp.com/callback" \
  -d "scope=openid email profile" \
  -d "response_type=code"
```

It returns a `request_uri` that references your stored parameters. Use this URI in the authorization redirect instead of the full parameter set.

```
https://backboard.railway.com/oauth/auth
  ?client_id=YOUR_CLIENT_ID
  &request_uri=urn:ietf:params:oauth:request_uri:abc123
```