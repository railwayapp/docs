---
title: Authorized Apps
description: Manage applications you've authorized to access your Railway account.
---

When you authorize a third-party application through Login with Railway, you grant it access to your account based on the scopes you approved. You can review or revoke app authorization at any time from your account settings.

## Viewing Authorized Apps

To see which applications have access to your Railway account, go to **Account Settings** and navigate to **Apps**. This page lists every OAuth application you've authorized, and what permissions each app has.

For apps with workspace or project scopes, you'll see which specific resources you shared, and can add or remove access to workspaces or projects.

## Revoking Access

To completely remove an app's access to your account, click on the app and select **Revoke Access**. This immediately invalidates all tokens the app holds. The app can no longer make API calls on your behalf.

You can always re-authorize the app later. If you visit the app again and go through its OAuth flow, you'll see the consent screen asking you to approve the same (or different) permissions. This is a fresh authorization, not a restoration of the previous one.
