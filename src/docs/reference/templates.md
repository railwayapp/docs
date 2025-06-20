---
title: Templates
description: Learn how Railway’s Kickback program rewards template publishers for their contributions.
---

Templates provide a way to jumpstart a project by giving users the means to package a service or set of services into a reusable and distributable format.

As a user in Railway, you can create and publish templates for others to use, or you can deploy templates from our <a href="https://railway.com/templates" target="_blank">template marketplace</a>.

For information on how to create, publish, and deploy templates, visit our [Templates guides](/guides/templates).

## Kickback program

If you publish a template, and it is deployed into other users' projects, you are immediately eligible for a 50% kickback of the usage cost incurred, in the form of Railway credits.  

If a user deploys your template, and the usage of the services cost the user $100, you would receive $50 in Railway credits or $50 in cash (USD).

Read more about the kickback program <a href="https://railway.com/open-source-kickback" target="_blank">here</a>.

### Kickback Eligibility Requirements
- Your template must be published to the marketplace to be eligible for kickback.
- For Hobby users with a $5 discount, only usage in excess of the discount is counted in the kickback.
- All service types and resource usage of those services (compute, volume, egress, etc) *do count* towards the kickback.
- Platform fees are not included in the kickback, but usage fees of the platform are included. Examples of platform fees are:

  - Cost of Subscription Plan ($5 for Hobby, $20 for Pro)
  - Additional Team Seats

  As an example, if a user pays $20 in platform fees, then incurs $200 of usage from your template, you are eligible for a $100 kickback (50% of $200).

- The minimum kickback our program supports is $0.01, meaning usage of your template must incur at least $0.04 in usage after discounts and/or platform fees.

## Earnings and Withdrawals

By default, your template kickbacks are automatically converted into Railway Credits. But we also offer cash withdrawals. Visit the `/earnings` tab inside your account settings for more details. There you can add your details and request a withdrawal.

### FAQ

#### How do I start earning cash?

- Simply flip the switch on the Earnings page marked `Direct Deposit to Railway Credits`. This will stop auto-depositing your earnings into our Credits system. You will then begin accruing cash in your `Available Balance`.

#### How do I request a withdrawal?

- Follow the instructions inside the `Earnings` tab. We currently allow withdrawals to GitHub Sponsors and Buy Me a Coffee. After adding your account details you will request a withdrawal. Our team will receive the request and process it right away.

#### Can I make manual withdrawals to credits too?

- Yes! Choose the `Credits` checkbox and then make your withdrawal request.

#### I have earned a lot of kickbacks from a template, but this page says my available balance is $0. Why?

- The current kickback method is to automatically apply your kickbacks as Railway Credits. You can opt out of this if you wish to start accruing cash.

#### Can I still use the older, automatic-credits setting?

- Yes. This behavior is enabled by default. You can opt out of it, and back in to it, at any time. Simply use the switch on the Earnings page marked `Direct Deposit to Railway Credits`.

#### What is the minimum and maximum withdrawal amount?

- For now, withdrawals may be made in $100 - $5000 increments.

#### What is the timeframe from withdrawal request to payout?

- We will process withdrawals within 5 - 7 business days of receiving your request.

## Updatable Templates

When you deploy any services from a template based on a GitHub repo, every time you visit the project in Railway, we will check to see if the project it is based on has been updated by its creator.

If it has received an upstream update, we will create a branch on the GitHub repo that was created when deploying the template, allowing for you to test it out within a PR deploy.

If you are happy with the changes, you can merge the pull request, and we will automatically deploy it to your production environment.

<Banner variant="info">
If you're curious, you can read more about how we built updatable templates in this <Link href="https://blog.railway.com/p/updatable-starters" target="_blank">blog post</Link>.
</Banner>

Note that this feature only works for services based on GitHub repositories. At this time, we do not have a mechanism to check for updates to Docker images from which services may be sourced.
