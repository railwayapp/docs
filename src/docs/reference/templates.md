---
title: Templates
description: Learn how Railway’s Kickback program rewards template publishers for their contributions.
---

Templates provide a way to jumpstart a project by giving users the means to package a service or set of services into a reusable and distributable format.

As a Railway user, you can create and publish templates for others to use, or you can deploy templates from our [template marketplace](https://railway.com/templates).

For information on how to create, publish, and deploy templates, visit our [Templates guides](/guides/templates).

## Kickback program

If you publish a template, and it is deployed into other users' projects, you are eligible for a 50% kickback of the usage cost incurred. You can receive kickback earnings in Railway Credits or with Cash Withdrawal.

Read more about the kickback program [here](https://railway.com/open-source-kickback).

### Kickback Eligibility Requirements

To be eligible for template kickbacks, your template must meet the following requirements:

- **Marketplace**: Your template must be published to the [template marketplace](https://railway.com/templates). Private and unpublished templates are not eligible.
- **Terms of Service**: Your project must abide by Railway's [Fair Use Policy](https://railway.com/legal/fair-use) and [Terms of Service](https://railway.com/legal/terms). Templates that violate Railway's Terms of Service may be removed and kickback payments deemed ineligible.

### How Kickback Earnings Calculation Works

- **Kickback Rate**: Templates receive a **50%** kickback of the usage costs incurred by users deploying your template.
- **Calculation**: Kickbacks are calculated based on the proportional resource usage cost of your template services. For example, if a user pays $20 in platform fees, then incurs $200 of usage from your template, you are eligible for a $100 kickback (50% of $200).
- **Minimum Payout**: The minimum kickback payout is **$0.01**. Any kickback amount below this threshold will not be processed.

### Verified Template Partners

Verified Template Partners are part of Railway's official [partner program](https://railway.com/partners) and receive a 25% kickback rate. Verified partner templates receive significant benefits:

- Featured placement in the template marketplace with verification badges
- Access to Railway's user base as a new acquisition channel
- Anonymous telemetry and aggregated user feedback on your templates

Learn more on our [Verified Partner Program page](https://railway.com/partners)

## Earnings and Withdrawals

By default, your template kickbacks are automatically converted into Railway Credits. But we also offer cash withdrawals. Visit the `/earnings` tab inside your account settings for more details. There you can add your details and request a withdrawal.

<Banner variant="warning">Cash withdrawals are **not** supported in countries like **Brazil, China, and Russia**. A full list of supported countries is available on the earnings page.</Banner>

### FAQ

#### How do I start earning cash?

- Simply flip the switch on the Earnings page marked `Direct Deposit to Railway Credits`. This will stop auto-depositing your earnings into our credits system. You will then begin accruing cash in your `Available Balance`.

#### How do I request a withdrawal?

- Follow the instructions inside the `Earnings` tab. We use Stripe Connect to handle withdrawals. After completing the onboarding process, you will be able to request a withdrawal.

#### Why is my country not supported?

- Due to local regulations and compliance requirements, certain regions are not eligible for cash withdrawals. You can choose from the 130+ countries that are supported in the onboarding process.

#### Can I make manual withdrawals to credits too?

- Yes! Choose `to Credits` in the dropdown and then make your withdrawal request.

#### I have earned a lot of kickbacks from a template, but this page says my available balance is $0. Why?

- The current kickback method is to automatically apply your kickbacks as Railway credits. You can opt out of this if you wish to start accruing cash.

#### Can I still use the older, automatic-credits setting?

- Yes. This behavior is enabled by default. You can opt out of it, and back in to it, at any time. Simply use the switch on the Earnings page marked `Direct Deposit to Railway Credits`.

#### What is the minimum and maximum withdrawal amount?

- For now, withdrawals may be made in $100 - $10,000 increments.

#### What is the timeframe from withdrawal request to payout?

- Withdrawals are usually processed instantly. Once processed, the funds will usually take up to 10 business days to reach your account. Depending on your region and bank, this may take longer.

## Updatable Templates

When you deploy any services from a template based on a GitHub repo, every time you visit the project in Railway, we will check to see if the project it is based on has been updated by its creator.

If it has received an upstream update, we will create a branch on the GitHub repo that was created when deploying the template, allowing for you to test it out within a PR deploy.

If you are happy with the changes, you can merge the pull request, and we will automatically deploy it to your production environment.

<Banner variant="info">
If you're curious, you can read more about how we built updatable templates in this <Link href="https://blog.railway.com/p/updatable-starters" target="_blank">blog post</Link>.
</Banner>

Note that this feature only works for services based on GitHub repositories. At this time, we do not have a mechanism to check for updates to Docker images from which services may be sourced.
