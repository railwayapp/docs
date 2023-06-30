---
title: Pricing
---

## Introduction

Railway plans and pricing are designed to support you however you work. We charge a base subscription fee for the plan you sign up to, on top of your resource and add-on usages.

The base subscription fee allows you to use the Railway platform and features included in the tier of your subscription.

Usage-based pricing means that you are only charged for the resources you actually use - this helps prevent runaway cloud costs and provides assurances that you're always getting the best deal possible on your cloud spend.

## Free Trial

As a new user, you can take the platform for a spin by starting a free trial. The trial gives access to basic features and includes a one-time grant of $5 for usage. Full Trial users can deploy code and databases, while Limited Trial users can only deploy databases.

Your trial experience depends on whether Railway can verify your account. Read more about verification [here](#verification).

## Plans

Railway offers three plans in addition to a free trial:

- **Hobby**: For indie hackers and developers to build and deploy personal projects
- **Pro**: For professional developers and their teams shipping to production
- **Enterprise**: For teams building and deploying production applications with the need for enterprise features related to compliance, SLAs, and account management

### Plan Pricing

- **Hobby**: $5 / mo, including $5 of usage
- **Pro**: $20 / seat / mo
- **Enterprise**: Custom pricing

Read more about our plans at [railway.app/pricing](https://railway.app/pricing).

### Usage Pricing

Railway charges for the resources that you consume. These include:

- **RAM**: $10 / GB / mo ($0.000231 / GB / minute)
- **CPU**: $20 / vCPU / mo ($0.000463 / vCPU / minute)
- **Network Egress**: $0.10 / GB ($0.000000095367432 / KB)
- (Optional Add-on) [**Volume Storage**](/reference/volumes): $0.25 / GB / mo ($0.000005787037037 / GB / minute)

Refer to [railway.app/pricing](http://railway.app/pricing) for additional details and a calculator you can use for estimating your costs.

<Banner variant="info">
If you have [PR deploys](/develop/environments#ephemeral-environments) enabled in your project, Railway will deploy a mirror copy of your workload(s) based on the environment it forks from (`production` by default). You are billed for those workload(s) running in the ephemeral environment.
</Banner>

### Additional services

Railway offers [Business Class Support](/reference/support#business-class) as an add-on service to the Pro plan (Business Class Support is included with Enterprise). [Contact us](mailto:contact@railway.app) to get started.

## Credits

Credits are available on Railway as a payment method for Hobby plan users who prefer to prepay for their subscription and usage on Railway.

### Credits as a payment method

On Railway, you can pay for your Hobby plan subscription and resource usage with pre-purchased credits. When using credits as a payment method, keep in mind that:

- If your usage within a billing period exceeds your credit balance, you will no longer be able to deploy, and your projects will be paused
- If you cancel your subscription, any remaining credit balance will be lost

Credits as a payment method is only available for Hobby plan users.

### Purchasing credits

You can purchase credits from your account's [billing page](https://railway.app/account/billing).

### One-time grant of credits on the Trial plan

Users who create a new Trial account receive a free one-time grant of $5. Railway will expend any free credit before consuming any purchased credits. Trial plan users are unable to purchase credits without upgrading to the Hobby plan.

## Billing Management

To manage your payment information, head to your account's [billing page](https://railway.app/account/billing). On this page, you can:

- Add and manage payment info
- See historical usage you were billed for
- Purchase credits for your account
- Retrieve current and past invoices

## Verification

Verification is a necessary measure to prevent abuse of the free Trial, limiting users from creating multiple accounts and reducing the risk of trial users deploying or hosting content that violates Railway’s Terms of Service.

When you sign up for a free Trial, you can connect your GitHub account to initiate verification. Your verification status depends on a number of factors, including the age and activity of your GitHub account.

If your account is not verified — either because you have not initiated the verification process or your account does not meet our criteria for verification — your trial experience will be limited to deploying plugins. Read more about the Full and Limited Trial in the FAQs.

Verification is a fully automated process, and Railway does not respond to requests for verification. If your account is not verified, you can upgrade to the Hobby plan to unlock the full Railway experience.

## FAQs

Common questions related to pricing.

### Plans

<Collapse title="Which plan is right for me?">
- **Hobby** is for indie hackers and developers to build and deploy personal projects
- **Pro** is for professional developers and their teams shipping to production
- **Enterprise** is for dev teams building and deploying production applications with the need for enterprise features related to compliance, SLAs, and account management
</Collapse>
<Collapse title="Can I add collaborators to my project?">
Railway's Pro and Enterprise plans are designed for collaboration. These plans allow you to add members to your team and manage their permissions.

Read more about adding members to your Pro or Enterprise team [here](/reference/teams#inviting-members).
</Collapse>

<Collapse title="I've heard that Railway waives the subscription fee for some users on the Hobby plan. Can I get the Hobby plan subscription fee waived?">
Railway waives the monthly Hobby plan subscription fee for a small set of active builders on the platform. Eligibility is automatically assessed based on several factors, including your usage on the platform, your GitHub account, and more. If you qualify, you will be notified in the Dashboard or when you upgrade to the Hobby plan.

Railway does not manually grant verification status.
</Collapse>

### Trial

<Collapse title="How do I get started with the free Trial?">
If you do not already have a Railway account, you can sign up for a free Trial by clicking "Login" at [railway.app](https://railway.app/).
</Collapse>

<Collapse title="How does the Trial work?">
When you sign up for the free Trial, you will receive a one-time grant of $5 in credits that you can use to try out Railway. The credits will be applied towards any usage on the platform and do not expire. If you upgrade to a plan while you still have a credit balance from the trial, the remaining balance will carry over to your new plan.
</Collapse>

<Collapse title="What resources can I access during the Trial?">
During the trial, you can access the same features as on the Hobby plan, however you will be limited to 500MB of RAM and shared (rather than dedicated) vCPU cores.

As a trial user, you can always spin-up databases. However, to deploy code, you must have a verified account. Read about verification [here](#verification).
</Collapse>

<Collapse title="What's the difference between the Limited Trial and the Full Trial?">
If you connect your GitHub account, and we are able to verify it against a set of parameters, you will be on the Full Trial where you can deploy both code and databases.

If you do not connect a GitHub account, or we are not able to verify your account, you will be on the Limited Trial, where you can only deploy plugins.

While you're on the Limited Trial, you can initiate verification at any time by visiting [railway.app/verify](https://railway.app/verify) in order to access the Full Trial experience.
</Collapse>

<Collapse title="How far will the $5 one-time Trial grant last?">
The longevity of your one-time trial grant depends on how many resources you consume. A project that uses most of the resources available on the Trial plan 24/7 will consume the credits in roughly a month, while a simple webserver may be able to run for several months before running out.
</Collapse>

### Usage

<Collapse title="How is usage billed?">
Railway charges for the core components of compute that you consume. These include:

- **RAM**: $10 / GB / mo ($0.000231 / GB / minute)
- **CPU**: $20 / vCPU / mo ($0.000463 / vCPU / minute)
- **Network Egress**: $0.10 / GB ($0.000000095367432 / KB)
- (Optional Add-on) [**Volume Storage**](/reference/volumes): $0.25 / GB / mo ($0.000005787037037 / GB / minute)

Refer to [railway.app/pricing](http://railway.app/pricing) for additional details and a calculator you can use for estimating your costs.
</Collapse>

<Collapse title="What will it cost to run my app?">
With Railway, you are only billed for the resources you consume at any given time. If you want to approximate the cost of running your app, try our calculator at [railway.app/pricing](https://railway.app/pricing).
</Collapse>

<Collapse title="How does included usage work on the Hobby plan?">
Your Hobby plan subscription includes $5 of usage per month. If your total usage at the end of your billing period is $5 or less, you will not be charged for usage. If your total usage exceeds $5 in any given billing period, you will be charged the delta.
</Collapse>

<Collapse title="Does included usage on the Hobby plan accumulate over time?">
Included usage is reset at the end of every billing cycle and does not accumulate over time.
</Collapse>

<Collapse title="Can I set limits for maximum usage within a billing period?">
Usage limits are currently unavailable, but coming soon to Railway. In the meantime, if you are on the Hobby plan and you want a guarantee that you keep under a certain spending threshold, you can set up credits as your payment method.
</Collapse>

### Billing

<Collapse title="What is the difference between subscription and usage?">
There are two main components to your bill:
- **Subscription**: Cost of the plan you're on (`[cost per seat] x [purchased seats]`)
- **Usage**: Cost of the resources you've consumed: (`[cost per unit] x [used units]`)
</Collapse>

<Collapse title="How do I view and manage my subscription?">
To view and manage your subscription, visit the [billing section](https://railway.app/account/billing) in your account page.
</Collapse>

<Collapse title="How can I get a receipt?">
When you make a payment, you will receive an email with your invoice and receipt attached. You can also find your billing history in the [billing section](https://railway.app/account/billing) of the Railway dashboard.
</Collapse>

<Collapse title="How can I add company information to my invoice?">
Head to the [billing section](https://railway.app/account/billing) in your dashboard and click "Manage Subscription." From there, you can update your billing information, including billing address and Tax ID.
</Collapse>

<Collapse title="What payment methods are accepted?">
Railway accepts credit cards for plan subscriptions, usage, and to purchase prepaid credits. We support invoice payments for customers on the Enterprise plan.
</Collapse>

<Collapse title="Can I try Railway without a credit-card?">
Yes. As a new Railway user, you can sign up for a free Trial. You will receive a one-time grant of $5 to use on resources.
</Collapse>

<Collapse title="I am a freelancer or represent an agency. How do I manage my billing relationships with my clients?">
Create a Pro plan on Railway and add the client to the team. If you run into issues when it's time to hand over your workload to your client, [email us](mailto:contact@railway.app) for help on onboarding your client to Railway.
</Collapse>

<Collapse title="I prefer to prepay. Is that possible?">
Yes. You can use prepaid credits as a payment method on Railway if you prefer to prepay for Railway's services. You will still need to pay a monthly subscription fee, as well as for any usage. Those amounts will be deducted from your credit balance.
</Collapse>

<Collapse title="What happens if I use credits as a payment method and my account runs out of credits?">
If you are using credits as a payment method and your credit balance reaches zero, you will no longer be able to deploy to Railway and we will stop all of your workloads. You will have a grace period to add new credits before we purge your data.
</Collapse>

### General

<Collapse title="Can I upgrade or downgrade at any time?">
You can upgrade any time, and when you do, you will get to the features of your new plan, as well as access to more powerful resources, immediately. When you downgrade, the changes will take effect at the beginning of your next billing cycle.
</Collapse>

<Collapse title="What happens when I cancel my subscription?">
When you cancel your subscription, if you're on Hobby, Pro, or Enterprise, your plan will remain active through the end of your current billing period, and any usage will be charged at the end of the period.

If you are on the Hobby plan and using prepaid credits as your payment method, your subscription will be canceled immediately and any credit balance you may have will be forfeited.
</Collapse>
