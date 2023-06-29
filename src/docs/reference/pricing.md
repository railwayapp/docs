---
title: Pricing
---

## Introduction

Railway plans and pricing are designed to support you however you work. Usage-based pricing means that you are only charged for the resources you actually use — this helps prevent runaway cloud costs and provides assurances that you’re always getting the best deal possible on your cloud spend.

In addition to usage-based pricing, you will need a basic subscription to use Railway. These plans are detailed below.

## Free Trial

As a new user, you can take the platform for a spin by starting a free trial. The trial gives access to basic features and includes a one-time grant of $5 for usage.

Full Trial users can deploy code and plugins, while Limited Trial users can only deploy plugins.

Your trial experience depends on whether Railway can verify your account. Read more about verification (link to below).

## Plans

Railway offers three plans in addition to a free trial:

- Hobby — For indie hackers and developers to build and deploy personal projects
- Pro — For professional developers and their teams shipping to production
- Enterprise — For dev teams building and deploying production applications with the need for enterprise features related to compliance, SLAs, and account management

## Plan Pricing

- Hobby → $5 / mo, including $5 of usage
- Pro → $20 / seat / mo
- Enterprise → Custom pricing

Read more about the plans here: railway.app/pricing.

## Usage Pricing

Railway charges for the core components of compute that you consume. These include:

- RAM → $10 / GB / mo ($0.000231 / GB / minute)
- CPU → $20 / vCPU / mo ($0.000463 / vCPU / minute)
- Network → $0.10 / GB ($0.000000095367432 / KB)

As well as optional add-ons:

- [Volume storage](/reference/volumes) → $0.25 / GB / mo

See [railway.app/pricing](http://railway.app) for detailed usage pricing and pricing calculator.

Keep in mind, if your project has PR deploys enabled, Railway deploys a mirror copy of your service(s) based on the environment it forks from (`production` by default). You are billed for the services that are spun while the ephemeral environment is active.

## Add-on services

Railway offers [Business Class Support](https://www.notion.so/5c47cc42b2cb456c85d125b512bb8763?pvs=21) as an add-on service for teams on the Pro plan (Business Class Support is included with Enterprise). Contact us to get started.

## Credits

Credits are available on Railway as part of the Trial plan as well as a payment method for users who prefer to prepay for their subscription and usage on Railway.

### One-time grant of credits on the Trial plan

Users who create a Trial new account receive a free one-time grant of $5. Railway will expend any free credit before consuming any paid credits.

### Credits as a payment method on the Hobby plan

On Railway, you can pay for your Hobby plan subscription and any additional usage with pre-purchased credits. This results in some specific behavior.

- If your usage within a billing period exceeds your credit balance, you will no longer be able to deploy, and your projects will be paused
- If you cancel your Hobby plan subscription, any remaining credit balance will be lost

## Billing Management

[Billing Management](https://docs.railway.app/reference/pricing#billing-management)

You can add and manage your payment info under the billing page and see historical billing usage under the account billing page: [railway.app/account/billing](https://railway.app/account/billing)

Within this page, you can also top-up on credits for your account if you prefer to pay for the Hobby plan in a prepaid fashion.

## Verification

Verification is a fraud prevention measure designed to filter out spammy actors while incentivizing legitimate actors.

Verification status depends on a number of factors, including the age and activity of your GitHub account.

If you have trouble getting verified (often because your GitHub account is not up to the verification standard), don’t fret! You are still able to use a credit card and purchase Railway plans.

Verification is an automated process, and we do not respond to requests for verification.

## FAQs

Common questions related to pricing.

### Plans

**Which plan is right for me?**

    - **Hobby** is for indie hackers and developers to build and deploy personal projects
    - **Pro** is for professional developers and their teams shipping to production
    - **Enterprise** is for dev teams building and deploying production applications with the need for enterprise features related to compliance, SLAs, and account management

**Can I add collaborators to my project?**

    Railway’s Pro and Enterprise plans are designed for collaboration. These plans allow you to add members to your team and manage their permissions.
    Read more about adding members to your Pro or Enterprise team [here](https://docs.railway.app/reference/teams#inviting-members).

**I’ve heard that Railway waives the subscription fee for some users on the Hobby plan. Can I get the Hobby plan subscription fee waived?**

    Railway waives the monthly Hobby plan subscription fee for a small set of active builders on the platform. Eligibility is automatically assessed based on several factors, including your usage on the platform, your GitHub account, and more. To see if you qualify, go to [link]. Unfortunately, we cannot manually grant verification status.

### Trial

**How do I get started with the free Trial?**

    If you do not already have a Railway account, you can sign up for a free Trial here.

**How does the Trial work?**

    When you sign up for the free Trial, you will receive a one-time grant of $5 in credits that you can use to try out Railway. The credits will be applied towards any usage on the platform and do not expire. If you upgrade to a plan while you still have a credit balance from the trial, the remaining balance will carry over to your new plan.

**What resources can I access during the Trial?**

    During the trial, you can access the same features as on the Hobby plan, however you will be limited to 500MB of RAM and shared (rather than dedicated) vCPU cores.

    As a trial user, you can always spin-up Plugins. However, to deploy code, you must have a verified account. [Read about verification](https://www.notion.so/Feature-gating-and-limits-e8a30eb3e3a74101b83f238d0f5c6111?pvs=21).

**What’s the difference between the Limited Trial and the Full Trial?**

    If you connect your GitHub account, and we are able to verify it against a set of parameters, you will be on the Full Trial where you can deploy both code and plugins.

    If you do not connect a GitHub account, or we are not able to verify your account, you will be on the Limited Trial, where you can only deploy plugins.

    While you’re on the Limited Trial, you can initiate verification at any time in order to access the Full Trial experience.

**How far will the $5 one-time Trial grant last?**

    The longevity of your one-time trial grant depends on how many resources you consume. A project that uses most of the resources available on the Trial plan 24/7 will consume the credits in roughly a month, while a simple webserver may be able to run for several months before running out.

### Usage

**How is usage billed?**

    Railway charges for the core components of compute that you consume. These include:

    - GB RAM used. Billed by the minute.
    - Cores of vCPU used. Billed by the minute.
    - GB of Network Egress. Billed by the kb.

    Railway offers additional add-ons that are usage-based:

    - GB Volume. Billed by the minute.

    Prices are listed here.

**What will it cost to run my app?**

    With Railway, you are only billed for the resources you consume at any given time. If you want to approximate the cost of running your app, try our calculator.

**How does included usage work on the Hobby plan?**

    Your Hobby plan subscription includes $5 of usage per month. If your total usage at the end of your billing period is $5 or less, you will not be charged for usage. If your total usage exceeds $5 in any given billing period, you will be charged the delta.

**Does included usage on the Hobby plan accumulate over time?**

    Included usage is reset at the end of every billing cycle and does not accumulate over time.

**Can I set limits for maximum usage within a billing period?**

    Usage limits are coming to Railway. In the meantime, if you are on the Hobby plan and you want a guarantee that you keep under a certain spending threshold, you can set up credits as your payment method.

### Billing

**What is the difference between subscription and usage?**

    There are two main components to your bill:

    - **Subscription**: Cost of the plan you’re on (`cost per seat` * `purchased seats`)
    - **Usage**: Cost of the resources you’ve consumed: (`cost per unit` * `used units`)

**How do I view and manage my subscription?**

    To view and manage your subscription, visit your account page.

**How can I get a receipt?**

    When you make a payment, you will receive an email with your invoice and receipt attached. You can also find your billing history in the [billing section](https://railway.app/account/billing) of the Railway dashboard.

**How can I add company information to my invoice?**

    Head to the [billing section](https://railway.app/account/billing) in your dashboard and click “Manage Subscription.” From there, you can update your billing information, including billing address and Tax ID.

**What payment methods are accepted?**

    Railway accepts credit cards for plan subscriptions, usage, and to purchase prepaid credits. We support invoice payments for customers on the Enterprise plan.

**Can I try Railway without a credit-card?**

    Yes. As a new Railway user you can sign up for a free Trial. You will receive a one-time grant of $5 to use on resources.

**I am a freelancer or represent an agency. How do I manage my billing relationships with my clients?**

    Create a Pro plan on Railway and add the client to the team. If you run into issues when it’s time to pass on your workload to your client, email us — and we can help onboard your client to Railway.

**I prefer to prepay. Is that possible?**

    Yes. You can use prepaid credits as a payment method on Railway if you prefer to prepay for Railway’s services. You will still need to pay a monthly subscription fee, as well as for any usage. Those amounts will be deducted from your credit balance.

**What happens if I use credits as a payment method and my account runs out of credits?**

    If you are using credits as a payment method and you credit balance reaches zero, you will no longer be able to deploy to Railway and we will stop all of your workloads. You will have a grace period to add new credits before we purge your data.

### General

**Can I upgrade or downgrade at any time?**

    You can upgrade any time, and when you do, you will get to the features of your new plan, as well as access to more powerful resources, immediately. When you downgrade, the changes will take effect at the beginning of your next billing cycle.

**What happens when I cancel my subscription?**

    When you cancel your subscription, if you’re on Hobby, Pro, or Enterprise, your plan will remain active through the end of your current billing period, and any usage will be charged at the end of the period.

    If you are on the Hobby plan and using prepaid credits as your payment method, your subscription will be canceled immediately and any credit balance you may have will be forfeited.
