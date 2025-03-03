---
title: Workspaces
description: Learn how you can manage a workspaces within Railway.
---

Workspaces are how organizations are represented within Railway. A default workspaces is made with your account, and new ones can be created via the Pro or Enterprise plans.

For more information, visit our [documentation on pricing](/reference/pricing) or <a href="https://railway.com/pricing" target="_blank">railway.com/pricing</a>.

> **Note:** Effective March 3rd, 2024, for users on Railway hosted metal instances, all seat costs will be waived.

## Creating a Team

Organizations can create a team by heading to the <a href="https://railway.com/new/team" target="_blank">Create Team</a> page and entering the required information.

## Managing Teams

You can open your team's settings page to manage team members and see billing information by clicking the gear icon next to the name of your team on the dashboard.

## Inviting Members

Under the People tab of the settings page, you can invite members to access the project.

There are three roles for Team members:

- Admin: Full administration of the Team and all Team projects
- Member: Access to all Team projects
- Deployer: View projects and deploy through commits to repos via github integration.

_Note_: Changes that trigger a deployment will skip the approval requirement when the author has a Deployer role (or higher) and their Github account is connected.

## Trusted Domains

Trusted domains may be configured on the team settings page. Note that team members added via trusted domain will be billed at the normal rate.

<Image 
    src="https://res.cloudinary.com/railway/image/upload/v1733955730/docs/t-d_jbtbm7.png"
    width="600"
    height="300"
    alt="Trusted domains are configurable via the team settings"
/>

You can automate the onboarding of new team members with trusted domains. Railway users that sign up with one of the trusted domains associated with your team will automatically be granted access to the team with the specified role (see above).

For example, new users with `example.com` email addresses will automatically be added to your teams that have the `example.com` trusted domain.

We verify that you have administrative access to the domain by looking for services in your team that use this domain or a subdomain. Make sure to [setup a custom domain](/guides/public-networking#custom-domains) on your service before adding it as a trusted domain.

## Transferring Projects

Transfer projects from another Team or Hobby workspace easily. Detailed instructions can be found [here](/guides/projects#transferring-projects).

## Invoicing and Billing

Railway offers a consumption-based pricing model for your projects. You don't get charged for resources you don't use, instead, Railway charges by the minute for each vCPU and memory resource your service uses.

However, if you expect to use a consistent amount of resources for large companies, you can contact us for a quote and demo. Railway will work with you to find a solution that works for your needs. We are willing to offer Purchase Orders and concierge onboarding for large companies.

### Committed Spend Tiers

As of March 3rd, 2024, Railway offers committed spend tiers for customers with consistent usage needs. Instead of negotiated contract pricing, customers can commit to a specific monthly spend level to unlock additional features and services.

For example, customers who commit to a $10,000/month spend rate can access dedicated hosts as an add-on, with all pricing going towards their usage. This approach provides more flexibility and transparency compared to traditional contract pricing.

To learn more about committed spend tiers and available add-ons, please [contact our team](mailto:team@railway.com).

Reach out to us at [team@railway.com](mailto:team@railway.com) for more information.

## FAQs

### How do I get my Pro seat costs waived?

As of March 3rd, 2024, Railway waives all seat costs for users on Railway hosted metal instances. To qualify for this benefit:

1. Your workspace must be on the Pro plan
2. Your services must be running on Railway hosted metal instances
3. This waiver will be automatically applied by the time of your invoice close date

If you're interested in moving to Railway hosted metal instances to take advantage of this benefit, please [contact our team](mailto:team@railway.com) to discuss your requirements and set up a dedicated host solution.

The seat cost waiver provides significant savings for teams of all sizes, especially as your team grows. This is part of our commitment to providing more flexible and cost-effective pricing options for our customers.
