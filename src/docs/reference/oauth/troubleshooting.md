---
title: Troubleshooting
description: Common issues and solutions for Login with Railway.
---

Implementing OAuth can involve subtle issues that produce confusing errors. This guide covers the most common problems developers encounter with Login with Railway and how to resolve them.

## Invalid Redirect URI

The `redirect_uri` in your authorization request must exactly match one of the URIs you registered when creating your OAuth app. This is a strict string comparison, not a URL pattern match.

Common causes of mismatch:
- Trailing slashes: `https://app.com/callback` vs `https://app.com/callback/`
- HTTP vs HTTPS: `http://localhost:3000` vs `https://localhost:3000`
- Port differences: `https://app.com` vs `https://app.com:443`
- Path differences: `/callback` vs `/oauth/callback`

Double-check your registered URIs in the workspace settings and ensure your application uses the exact same string.

## PKCE Requirements

Native applications (mobile apps, desktop apps, CLIs, SPAs) must use PKCE. If you're building a native app and your authorization request doesn't include `code_challenge` and `code_challenge_method=S256`, the flow will fail.

## Native App Token Exchange

For public clients (native apps), don't include a client secret. Instead, provide the PKCE code verifier:

```bash
curl -X POST https://backboard.railway.com/oauth/token \
  -d "grant_type=authorization_code" \
  -d "code=AUTH_CODE" \
  -d "redirect_uri=EXACT_REDIRECT_URI" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "code_verifier=YOUR_CODE_VERIFIER"
```

If you include a client secret with a native app, the request will fail. Native apps authenticate through PKCE, not secrets.

## Code Already Used or Expired

Authorization codes are single-use and short-lived. If your application attempts to exchange the same code twice, or waits too long before exchanging it, the request fails.

Ensure your token exchange happens immediately after receiving the code, and that your application doesn't retry failed exchanges with the same code.

## No Refresh Token in Response

To receive a refresh token, your authorization request must include both the `offline_access` scope and `prompt=consent`.

## Refresh Token Stopped Working

Refresh tokens expire after one year. If a user hasn't used your application in over a year, their refresh token is no longer valid, and they'll need to re-authenticate.

Refresh tokens may also be rotated. When you exchange a refresh token for a new access token, the response includes a `refresh_token` field. Initially this might be the same value, but it will eventually return a new token. Always store and use the refresh token from your most recent token response.

## Authorization Revoked After Using Refresh Token

If your user's authorization is suddenly revoked when using a refresh token, you likely used an old, already-rotated token. As a security measure, using a rotated refresh token immediately revokes the entire authorization. This behavior helps detect potentially leaked tokens. The user will need to re-authorize your application.

To avoid this, always store and use the `refresh_token` from your most recent token response, even if it appears unchanged.

## Too Many Refresh Tokens

Each user authorization can have a maximum of 100 refresh tokens. If your application requests more than 100 refresh tokens for the same user (for example, by repeatedly going through the full OAuth flow instead of using existing refresh tokens), the oldest tokens are revoked automatically without notice.

## Access Token Expired

Access tokens last one hour. If API requests start failing with authentication errors, check whether the token has expired. Use your refresh token to obtain a new access token, or if you don't have a refresh token, redirect the user through the OAuth flow again.

## Workspace Query Returns Not Authorized

When querying workspaces with a workspace scope, you must also have the `email` and `profile` scopes. Without them, the API cannot resolve workspace membership, and the query returns an empty array.

Ensure your authorization request includes all three:

```
&scope=openid email profile workspace:viewer
```

## ID Token Missing Claims

ID tokens do not include user claims like `email`, `name`, or `picture`. To retrieve these, call the `/oauth/me` endpoint with your access token:

```bash
curl https://backboard.railway.com/oauth/me \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

The claims returned depend on which scopes were approved (`email` for email, `profile` for name and picture).