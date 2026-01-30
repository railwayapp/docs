---
title: Managing an App
description: Configure and manage your OAuth applications.
---

After creating an OAuth app, you may need to update its configuration, rotate credentials, or eventually delete it.

## Accessing App Settings

To manage an OAuth app, go to your workspace settings and navigate to **Developer**.

- See and copy the client ID
- Update the application name
- Update the description
- Update the redirect URIs
- Update the logo
- Create or revoke client secrets

The settings page shows your app's client ID, which you can copy for use in your application. You can also edit the app's name (shown to users on the consent screen) and manage the redirect URIs where users are sent after authorization.

## Client Secrets

Client secrets authenticate your application during the token exchange. Only web (confidential) applications use client secrets; native (public) applications rely on PKCE instead.

You can generate additional client secrets from the app settings page. This is useful when you need to rotate credentials or deploy to a new environment.

Client secrets do not expire.

### Revoking a Secret

If a secret is compromised or no longer needed, revoke it from the app settings. Before revoking, ensure your application is configured with a different valid secret, or users will be unable to complete the OAuth flow.

## Deleting an App

Deleting an OAuth app is immediate and irreversible. All tokens issued through that app become invalid instantly. Users who authorized your app will see it removed from their authorized apps list, and any applications relying on those tokens will fail to authenticate.

To delete an app, scroll to the bottom of the app settings page and click **Delete App**.

## Dynamic Client Registration Management

OAuth apps created through [Dynamic Client Registration](/reference/oauth/creating-an-app#dynamic-client-registration) work differently. They don't appear in the workspace settings UI and must be managed entirely through the API.

When you register a client dynamically, the response includes a registration access token. This token authorizes management operations on that specific client. Store it securely. Without it, you cannot update or delete the client.

Updating a dynamic client will always delete the client secret and create a new one.
