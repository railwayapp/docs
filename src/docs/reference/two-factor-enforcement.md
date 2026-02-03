---
title: Two-Factor Authentication Enforcement
description: Learn how workspace admins can require two-factor authentication for all workspace members.
---

<Banner variant="info">
2FA Enforcement is available on the [Pro plan](/reference/pricing/plans) and above.
</Banner>

Two-Factor Authentication (2FA) Enforcement allows workspace admins to require all members to have 2FA enabled on their account before accessing the workspace.

## Enabling 2FA Enforcement

<Image src="https://res.cloudinary.com/railway/image/upload/v1723752559/docs/reference/2fa/enable-2fa-enforcement.png"
alt="Screenshot of 2FA Enforcement toggle in workspace People settings"
layout="responsive"
width={1610} height={398} quality={80} />

To enable 2FA enforcement for your workspace:

1. Navigate to your workspace's <a href="https://railway.com/workspace/people" target="_blank">People settings</a>.
2. Toggle the **Require 2FA** option.

You must be a workspace admin with 2FA already enabled on your account to configure this setting.

Once enabled, enforcement takes effect immediately. Members who haven't set up 2FA will be prompted to configure it before they can access the workspace.

## Behavior


<Image src="https://res.cloudinary.com/railway/image/upload/v1723752559/docs/reference/2fa/2fa-enforcement-modal.png"
alt="Screenshot of 2FA setup prompt when accessing a workspace with 2FA enforcement"
layout="responsive"
width={836} height={744} quality={80} />

When 2FA enforcement is enabled:

- Existing members without 2FA are prompted to set it up before accessing the workspace.
- Members can still be [invited](/reference/workspaces#inviting-members) to the workspace. They can accept the invite, but must enable 2FA before accessing workspace resources.
- Users joining via [Trusted Domains](/reference/workspaces#trusted-domains) are added to the workspace, but must enable 2FA before accessing workspace resources.
- New members cannot view or interact with workspace projects until 2FA is configured.

## Access Methods

- **Dashboard and CLI**: All workspace members must have 2FA enabled to access the workspace through the Railway dashboard or [CLI](/guides/cli).
- **API Tokens**: Token-based access (such as project tokens or workspace tokens used for CI/CD pipelines and automated deployments) remains valid without 2FA. This ensures your automated workflows continue to function without interruption.

## Disabling 2FA Enforcement

Workspace admins can disable 2FA enforcement at any time through the workspace's People settings. Once disabled, members are no longer required to have 2FA enabled to access the workspace.
