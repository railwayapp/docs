---
title: SAML Single Sign-On
description: Learn about how to configure and use SAML Single Sign-On (SSO) for your Railway workspace.
---

<Banner variant="info">
SAML SSO is available on [Railway Enterprise](/maturity/enterprise).
</Banner>

**SAML Single Sign-On (SSO)** allows workspace members to sign in using your organization’s Identity Provider (IdP), including Okta, Auth0, Microsoft Entra ID, Google Workspace, and more.

New users signing in with your Identity Provider are automatically added to your workspace as [workspace members](/reference/teams#managing-workspaces).

## Configuring SAML SSO

<Image src="https://res.cloudinary.com/railway/image/upload/v1743471483/docs/saml-settings_zig2cw.png"
alt="Screenshot of SAML Settings and Trusted Domains"
layout="responsive"
width={1782} height={1660} quality={80} />

To configure SAML SSO, go to your workspace’s <a href="https://railway.com/workspace/people" target="_blank">People settings</a>. You must be a workspace admin with access to your Identity Provider’s configuration panel.

1. Add your organization’s email domain(s) as [**Trusted Domains**](/reference/teams#trusted-domains).
2. In the **SAML Single Sign-On** section, click **Configure** and follow the guided setup to connect your Identity Provider to Railway.
3. Optionally, [enforce SAML SSO](#enforcing-saml-sso) to require members to log in through your Identity Provider.

Once configured, users can [login using SAML SSO](#login-using-sso) using their organization email. Existing users must update their Railway email if it differs from their Identity Provider email.

_If you’re a Railway Enterprise customer and don’t see the SAML settings in your workspace, please contact us._

## Enforcing SAML SSO

<Image src="https://res.cloudinary.com/railway/image/upload/v1743471483/docs/enforce-saml_m0jqgn.png"
alt="Screenshot of enforcing SAML SSO in a workspace"
layout="responsive"
width={1878} height={820} quality={80} />

Workspace admins can **enforce SAML SSO** to ensure all members access the workspace with your Identity Provider.

- **Enable enforcement** by toggling "Members need to login with SAML SSO."
- Only workspace admins already logged in with SAML SSO can enable enforcement.
- When enforcement is active, users not authenticated with SAML SSO can’t open the workspace or access its resources.
- Enforcement takes effect immediately. Active users without SAML authentication will be prompted to re-authenticate.

Note: Enforcement will not limit which login methods a user can use. Because Railway users can be members of multiple workspaces, they can still log in with other methods, but must use SAML SSO to access the SAML-enforced workspace.

<video src="https://res.cloudinary.com/railway/video/upload/v1753470547/docs/saml-enforcement-demo_upg3hq.mp4" controls autoplay loop muted style={{ borderRadius: 10 }}></video>

## Login using SSO

After SAML SSO is enabled, users can log in using their organization’s email by selecting _"Log in using Email"_ → _"Log in using SSO"_.

Alternatively, go directly to https://railway.com/login#login-saml.

Railway also supports IdP-initiated SSO, allowing users to access Railway directly from their Identity Provider’s dashboard.