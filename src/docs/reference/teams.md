---
title: Workspaces
description: Learn how you can manage a workspaces within Railway.
---

Workspaces are how organizations are represented within Railway. A default workspaces is made with your account, and new ones can be created via the Pro or Enterprise plans.

For more information, visit our [documentation on pricing](/reference/pricing) or <a href="https://railway.com/pricing" target="_blank">railway.com/pricing</a>.

> **Note:** Effective March 3rd, 2025, for users on Railway hosted metal instances, all seat costs will be waived.

## Creating a Workspace

Organizations can create a workspace by heading to the <a href="https://railway.com/new/workspace" target="_blank">Create Workspace</a> page and entering the required information.

## Managing Workspaces

You can open your workspace's settings page to manage members and see billing information by clicking the gear icon next to the name of your workspace on the dashboard.

## Inviting Members

Under the People tab of the settings page, you can invite members.

There are three roles for Workspace members:

- Admin: Full administration of the Workspace and all Workspace projects
- Member: Access to all Workspace projects
- Deployer: View projects and deploy through commits to repos via GitHub integration.

_Note_: Changes that trigger a deployment will skip the approval requirement when the author has a Deployer role (or higher) and their GitHub account is connected.

## Trusted Domains

Trusted domains may be configured on the workspace settings page. Note that workspace members added via trusted domain will be billed at the normal rate.

<Image 
    src="https://res.cloudinary.com/railway/image/upload/v1733955730/docs/t-d_jbtbm7.png"
    width="1200"
    height="548"
    alt="Trusted domains are configurable via the workspace settings"
/>

You can automate the onboarding of new workspace members with trusted domains. Railway users that sign up with one of the trusted domains associated with your workspace will automatically be granted access to the workspace with the specified role (see above).

For example, new users with `example.com` email addresses will automatically be added to your workspaces that have the `example.com` trusted domain.

We verify that you have administrative access to the domain by looking for services in your workspace that use this domain or a subdomain. Make sure to [setup a custom domain](/guides/public-networking#custom-domains) on your service before adding it as a trusted domain.

## Transferring Projects

Transfer projects from another Workspace or Hobby workspace easily. Detailed instructions can be found [here](/guides/projects#transferring-projects).

## Invoicing and Billing

Railway offers a consumption-based pricing model for your projects. You don't get charged for resources you don't use, instead, Railway charges by the minute for each vCPU and memory resource your service uses.

However, if you expect to use a consistent amount of resources for large companies, you can contact us for a quote and demo. Railway will work with you to find a solution that works for your needs. We are willing to offer Purchase Orders and concierge onboarding for large companies.

### Committed Spend Tiers

Railway offers committed spend tiers for customers with consistent usage needs. Instead of negotiated contract pricing, customers can commit to a specific monthly threshold to [unlock additional features and services.](/reference/pricing/plans#committed-spend-tiers)

Monthly thresholds for addons is found in our [commited spend pricing](/reference/pricing#committed-spend-tiers).

Reach out to us at [team@railway.com](mailto:team@railway.com) for more information.

## FAQs

### How do I get my Pro seat costs waived?

As of March 3rd, 2025, Railway waives all seat costs for users on Railway hosted metal instances. To qualify for this benefit:

1. Your workspace must be on the Pro plan
2. Your services must be quality for metal pricing and run on Railway hosted metal instances
3. This waiver will be automatically applied for your next monthly invoice

If you're interested in moving to Railway hosted metal instances to take advantage of this benefit, please [contact our team](mailto:team@railway.com) to discuss your requirements and set up a dedicated host solution.

The seat cost waiver provides significant savings for workspaces of all sizes, especially as your workspace grows. This is part of our commitment to providing more flexible and cost-effective pricing options for our customers.
