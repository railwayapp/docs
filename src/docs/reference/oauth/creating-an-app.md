---
title: Creating an App
description: Create and configure OAuth applications for Login with Railway.
---

OAuth apps are created within a workspace and allow your application to authenticate users with their Railway account. Only **workspace admins** can create and manage apps. Before implementing the OAuth flow, you need to register your app to obtain client credentials and configure how it interacts with the authorization server.

## App Types

Two types of OAuth applications are supported:

| Type | Client Secret | PKCE | Auth Method |
|------|---------------|------|-------------|
| Web (Confidential) | Required | Recommended | `client_secret_basic` or `client_secret_post` |
| Native (Public) | None | Required | `none` |

### Web Applications

Web applications are confidential clients. They run on servers you control, where a client secret can be stored securely.

Even though web apps have a client secret, implementing PKCE is strongly recommended. PKCE protects against authorization code interception if an attacker manages to observe the redirect.

### Native Applications

Native applications include mobile apps, desktop applications, command-line tools, and single-page applications running entirely in the browser. These are public clients because any secrets embedded in them could be extracted by users or attackers. You cannot trust that a secret will remain confidential.

Native apps authenticate using PKCE exclusively. Do not send a client secret, otherwise the token request will fail.

## Creating an App

To register a new OAuth app, go to your workspace settings, navigate to **Developer**, and click **New OAuth App**. Enter a name that users will recognize on the consent screen, add your redirect URI(s), and select the appropriate app type.

For web applications, a client secret is generated after creation. Copy this immediately. It's displayed only once. Store it securely in your application's configuration, such as an environment variable or secrets manager. Never commit it to version control.

## Redirect URIs

Redirect URIs specify where users are sent after they authorize (or deny) your application. You can register multiple URIs to support different environments. For example, `http://localhost:3000/callback` for local development and `https://yourapp.com/callback` for production.

When initiating authorization, the `redirect_uri` parameter must exactly match one of your registered URIs. This includes the scheme, host, port, and path. If they don't match, the authorization request fails with an `invalid_redirect_uri` error.

## PKCE (Proof Key for Code Exchange)

PKCE adds a layer of protection to the authorization code flow. Without PKCE, an attacker who intercepts an authorization code could potentially exchange it for tokens. With PKCE, they would also need the code verifier: a secret that never travels through the redirect.

Add the code challenge to your authorization request:

```
https://backboard.railway.com/oauth/auth
  ?response_type=code
  &client_id=YOUR_CLIENT_ID
  &redirect_uri=https://yourapp.com/callback
  &scope=openid
  &code_challenge=CODE_CHALLENGE
  &code_challenge_method=S256
```

When exchanging the authorization code for tokens, include the original code verifier:

```bash
curl -X POST https://backboard.railway.com/oauth/token \
  -u "YOUR_CLIENT_ID:YOUR_CLIENT_SECRET" \
  -d "grant_type=authorization_code" \
  -d "code=AUTHORIZATION_CODE" \
  -d "redirect_uri=https://yourapp.com/callback" \
  -d "code_verifier=CODE_VERIFIER"
```

## Dynamic Client Registration

OAuth 2.0 Dynamic Client Registration is supported, allowing applications to register OAuth clients programmatically rather than through the UI. This is useful for development tools that need to bootstrap OAuth configuration.

### Endpoint

```
POST https://backboard.railway.com/oauth/register
```

Dynamic registration requests are subject to rate limits to prevent abuse.

### Managing Dynamic Clients

Clients created through dynamic registration are managed exclusively through the Dynamic Client Registration Management API. They don't appear in the workspace settings UI. When you register a client, the response includes a registration access token. Use this token to update or delete the client later.

Store the registration access token securely alongside your client credentials. Without it, you cannot modify or delete the dynamically registered client.
