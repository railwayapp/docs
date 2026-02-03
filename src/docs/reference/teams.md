---
title: Workspaces
description: Learn how you can manage a workspaces within Railway.
---

Workspaces are how organizations are represented within Railway. A default workspaces is made with your account, and new ones can be created via the Pro or Enterprise plans.

For more information, visit our [documentation on pricing](/reference/pricing) or <a href="https://railway.com/pricing" target="_blank">railway.com/pricing</a>.

## Creating a Workspace

Organizations can create a workspace by heading to the <a href="https://railway.com/new/workspace" target="_blank">Create Workspace</a> page and entering the required information.

## Managing Workspaces

You can open your workspace's settings page to manage members and see billing information by clicking the gear icon next to the name of your workspace on the dashboard.

## Inviting Members

Under the People tab of the settings page, you can invite members. Adding or removing team members does not incur any additional seat cost.

There are three roles for Workspace members:

- Admin: Full administration of the Workspace and all Workspace projects
- Member: Access to all Workspace projects
- Deployer: View projects and deploy through commits to repos via GitHub integration.

|                              | Admin | Member | Deployer |
| :--------------------------- | :---: | :----: | :------: |
| Automatic GitHub deployments |  ✔️   |   ✔️   |    ✔️    |
| CLI deployments              |  ✔️   |   ✔️   |    ❌    |
| Creating variables           |  ✔️   |   ✔️   |    ❌    |
| Modifying variables          |  ✔️   |   ✔️   |    ❌    |
| Deleting variables           |  ✔️   |   ✔️   |    ❌    |
| Modifying service settings   |  ✔️   |   ❌   |    ❌    |
| Creating services            |  ✔️   |   ✔️   |    ❌    |
| Deleting services            |  ✔️   |   ❌   |    ❌    |
| Viewing logs                 |  ✔️   |   ✔️   |    ❌    |
| Creating volumes             |  ✔️   |   ✔️   |    ❌    |
| Deleting volumes             |  ✔️   |   ❌   |    ❌    |
| Creating new projects        |  ✔️   |   ✔️   |    ❌    |
| Deleting projects            |  ✔️   |   ❌   |    ❌    |
| Adding additional members    |  ✔️   |   ❌   |    ❌    |
| Removing members             |  ✔️   |   ❌   |    ❌    |
| Changing member roles        |  ✔️   |   ❌   |    ❌    |
| Adding trusted domains       |  ✔️   |   ❌   |    ❌    |
| Making a withdrawal          |  ✔️   |   ❌   |    ❌    |
| Accessing billing settings   |  ✔️   |   ❌   |    ❌    |
| Accessing audit logs         |  ✔️   |   ❌   |    ❌    |

_Note:_ Changes that trigger a deployment will skip the approval requirement when the author has a Deployer role (or higher) and their GitHub account is connected.

## Trusted Domains

Trusted Domains let you automatically onboard new members to your workspace. When a Railway user signs up with an email address matching one of your trusted domains, they're added to your workspace with the assigned role.

For example, users signing up with `@railway.com` are automatically added to the workspace that has `railway.com` as a trusted domain.

<Image 
  src="https://res.cloudinary.com/railway/image/upload/v1733955730/docs/trusted-domains_oaqfgt.png"
  width="1528"
  height="898"
  alt="Trusted domains are configurable via the workspace settings"
/>

### Verifying a Trusted Domain

Before adding a Trusted Domain, you must verify ownership by adding your email domain as a [custom domain](/guides/public-networking#custom-domains) on a Railway service.

You can verify a parent domain using a subdomain. For example, adding `verify.example.com` as a custom domain allows you to add `example.com` as trusted domain.

If you don't already have a service using your domain, you can set up a temporary service to verify your domain:

1. Create a new **empty service** in any project (a temporary new project works fine).
2. **Deploy** the service.
3. Open the service and go to the **Settings** tab.
4. Scroll to **Networking -> Custom Domain**.
5. **Add your email domain** (or a subdomain). Leave the port field empty.
6. Click **Add Domain** and follow the DNS setup instructions. If you use Cloudflare or a similar provider, make sure to **disable the proxy**.
7. Wait until the domain is verified.
8. Go to the <a href="https://railway.com/workspace/people" target="_blank">**Trusted Domain settings**</a> and add your email domain. Assign the default role for new members.
9. After the domain is verified and added, you can safely remove the temporary service and DNS record.

Additional notes and troubleshooting:

- You can verify a trusted domain by adding a subdomain (e.g., add `verify.example.com` as custom domain and use `example.com` as trusted domain).
- Opening the domain in your browser can speed up verification.
- Trusted Domains are only verified when added. Once verified, the custom domain and its DNS record can be removed safely.

## Transferring Projects

Transfer projects from another Workspace or Hobby workspace easily. Detailed instructions can be found [here](/guides/projects#transferring-projects).

## Invoicing and Billing

Railway offers a consumption-based pricing model for your projects. You don't get charged for resources you don't use, instead, Railway charges by the minute for each vCPU and memory resource your service uses.

However, if you expect to use a consistent amount of resources for large companies, you can contact us for a quote and demo. Railway will work with you to find a solution that works for your needs. We are willing to offer Purchase Orders and concierge onboarding for large companies.

### Committed Spend Tiers

Railway offers committed spend tiers for customers with consistent usage needs. Instead of negotiated contract pricing, customers can commit to a specific monthly threshold to [unlock additional features and services.](/reference/pricing/plans#committed-spend-tiers)

Monthly thresholds for addons is found in our [committed spend pricing](/reference/pricing#committed-spend-tiers).

Reach out to us at [team@railway.com](mailto:team@railway.com) for more information.
