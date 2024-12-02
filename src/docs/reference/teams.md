---
title: Teams
---

Teams are how organizations are represented within Railway. Teams can be created via the Pro or Enterprise plans.

For more information, visit our [documentation on pricing](/reference/pricing) or <a href="https://railway.com/pricing" target="_blank">railway.com/pricing</a>.

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

*Note*: Changes that trigger a deployment will skip the approval requirement when the author has a Deployer role (or higher) and their Github account is connected.

## Trusted Domains

You can automate the onboarding of new team members with trusted domains. Railway users that sign up with one of the trusted domains associated with your team will automatically be granted access to the team with the specified role (see above).

For example, new users with `example.com` email addresses will automatically be added to your teams that have the `example.com` trusted domain.

We verify that you have administrative access to the domain by looking for services in your team that use this domain or a subdomain. Make sure to [setup a custom domain](/guides/public-networking#custom-domains) on your service before adding it as a trusted domain.

## Transferring Projects

Transfer projects from another Team or Hobby workspace easily.  Detailed instructions can be found [here](/guides/projects#transferring-projects).

## Invoicing and Billing

Railway offers a consumption-based pricing model for your projects. You don't get charged for resources you don't use, instead, Railway charges by the minute for each vCPU and memory resource your service uses.

However, if you expect to use a consistent amount of resources for large companies, you can contact us for a quote and demo. Railway will work with you to find a solution that works for your needs. We are willing to offer Purchase Orders and concierge onboarding for large companies.

Reach out to us at [team@railway.com](mailto:team@railway.com) for more information.
