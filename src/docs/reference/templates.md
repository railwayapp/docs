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

**Kickback Rates:**

- Templates receive a **15%** kickback of the usage costs incurred by users deploying your template.
- Support Bonus: Additional 10% (25% total) when actively supporting users via your [Template Queue](https://station.railway.com/my-template-queue)
- Open source templates receive 2x the rate (30% base, 50% with support)

**Calculation:** Kickbacks are calculated based on the proportional resource usage cost of your template services. For example, if a user pays $20 in platform fees, then incurs $200 of usage from your template, you are eligible for up to a $100 kickback (50% of $200 for an open source template with active support).

**Minimum Payout:** The minimum kickback payout is $0.01. Any kickback amount below this threshold will not be processed.

### Supporting Your Template Users

When users have questions about your template, they'll appear in your [Template Queue](https://station.railway.com/my-template-queue) in Central Station. You'll get an email when new questions come in, plus occasional reminders if questions are waiting. 

Answering these questions earns you the additional 10% support bonus and helps users deploy your template successfully.

Manage notification preferences in your [account settings](https://railway.com/account/notifications) under "Template Queue Emails".

<Image src="https://res.cloudinary.com/railway/image/upload/v1764639904/Template_Queue_Email_Notifications_qbfqg9.png" alt="Template Queue Emails" width={1800} height={1284} quality={100} />

## Partner Program

Templates exist because of the community, but also because of the underlying technologies being in demand to deploy on Railway. Partners are owners of the technologies in the template marketplace.

With Railway's [Partner Program](https://railway.com/partners), partners can:
- Recommend optimal configurations for the technology in the template through verified templates
- Receive commission from templates using their technology
- Understand their OSS user base better through surfaced user questions
- Receive anonymous telemetry of how their technology is used on Railway
- Participate in co-marketing to Railway's large community

### Basic Partners

Basic Partners are part of Railway's official [partner program](https://railway.com/partners) and receive a the same kickback rate as creators. They verify templates to suggest optimal use of their technology on the template marketplace. Verified partner templates receive significant benefits:

- Featured placement in the template marketplace with verification badges
- Access to Railway's user base as a new acquisition channel
- Anonymous telemetry and aggregated user feedback on your templates

See all [verified templates here](https://railway.com/deploy?category=verified).

### Technology Partners

Technology Partners receive all the benefits Basic Partners do, with a few additional benefits: 
- Commission on all templates using their technology on Railway (even if they didn't create them)
- A dedicated page for their technology on Railway, [like so](https://railway.com/deploy/cms/directus)
- More extensive co-marketing with Railway for additional visibility

#### Technology Partner Commission

Technology partners get commission on all templates using their technology on Railway, even if they did not create them. This commission is in addition to the kickback the community template creator receives. Technology Partners receive the same kickback rates as stated above: 15% base, and if template questions are answered, all the way upto 25% commission. This is for their effort in maintaining their technology. They are listed as a "maintainer" on the templates they receive commission on.

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

#### What if I there are no questions for my template?

- If there are no questions, you will reveive the full 25% kickback for your template.

## Pushing Updates to Template Consumers

As a template author, you can push updates to all users who have deployed your template. When you merge changes to the root branch (typically `main` or `master`) of your template's GitHub repository, Railway will automatically detect these changes and notify users who have deployed your template that an update is available.

Users will receive a notification about the update and can choose to apply it to their deployment when they're ready.

<Banner variant="info">
**Best Practice**: Keep your template's changelog up to date and document breaking changes clearly so that consumers understand what's changing when they receive update notifications.
</Banner>

Note that this feature only works for templates based on GitHub repositories. Docker image-based templates cannot be automatically updated through this mechanism.

## Private Docker Images

If your template includes a private Docker image, you can provide your registry credentials without exposing them to users who deploy your template.

To set this up, add a service with a Docker image source in the template editor, then enter your registry credentials in the service settings. Railway encrypts and stores these credentials securely.

When users deploy your template, Railway automatically authenticates with your registry to pull the image. Users will only see that the service uses hidden registry credentials, not the credentials themselves.

<Banner variant="warning">
To protect your credentials, SSH access is disabled and users cannot modify the Docker image source for services with hidden registry credentials.
</Banner>

## Updatable Templates

When you deploy any services from a template based on a GitHub repo, Railway will check to see if the template has been updated by its creator.

If an upstream update is available, you will receive a notification. You can then choose to apply the update to your deployment when you're ready.

<Banner variant="info">
If you're curious, you can read more about how we built updatable templates in this <Link href="https://blog.railway.com/p/updatable-starters" target="_blank">blog post</Link>.
</Banner>

Note that this feature only works for services based on GitHub repositories. At this time, we do not have a mechanism to check for updates to Docker images from which services may be sourced.
