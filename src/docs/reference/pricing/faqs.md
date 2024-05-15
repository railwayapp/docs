---
title: Pricing FAQs
---

Common Questions & Answers related to Railway's pricing.

## Cost

### What will it cost to run my app?

With Railway, you are billed for the [subscription fee](/reference/pricing/plans#plan-subscription-pricing) of the plan you're subscribed to, and the [resource usage](/reference/pricing/plans#resource-usage-pricing) of your workloads.

We are unable to give exact quotes or estimates for how much it will cost to run your app because it is highly dependent on what you're deploying. To understand how much your app will cost to run on Railway, we recommend you to:

1. Deploy your project with the Trial or Hobby plan
2. Allow it to run for one week
3. Check your Estimated Usage in the [Usage Section](https://railway.app/account/usage) of your account

Keeping it running for one week allows us to rack up sufficient metrics to provide you with an estimate of your usage for the current billing cycle. You can then use this information to extrapolate the cost you should expect.

For a rough approximation of the cost for running your app, try our [pricing calculator](https://railway.app/pricing#usage-estimation).

If you are supporting a commercial application, we highly recommend you to upgrade to the Pro plan for higher resource limits and access to [priority support](/reference/support#priority-threads).

### How do I prevent spending more than I want to?

You can set [Usage Limits](/reference/usage-limits) to prevent unexpected costs. We recommend doing this if you'd like to cap your maximum bill every month.

### Why is my usage higher than expected?

[todo]

- check resource usage under https://railway.app/account/usage and look at projects consuming high resources and troubleshoot why it's doing so
- could be a memory leak
- could be more traffic

Unfortunately, we can't assist with figuring out why your bill is higher than normal, as it is entirely dependent on what you have deployed. As an analogy, our position on this is similar to how a utilities company operates: they can tell you how much electricity you've used, but they can't tell you why you're using so much. We can only tell you how much resources you consume, not why.

## General

### Can I upgrade or downgrade at any time?

You can upgrade any time, and when you do, you will get to the features of your new plan, as well as access to more powerful resources, immediately. When you downgrade, the changes will take effect at the beginning of your next billing cycle.

### What happens when I cancel my subscription?

When you cancel your subscription, if you're on Hobby, Pro, or Enterprise, your plan will remain active through the end of your current billing period, and any usage will be charged at the end of the period.

If you are on the Hobby plan and using prepaid credits as your payment method, your subscription will be canceled immediately and any credit balance you may have will be forfeited.

### How do I request a refund?

You can request for a refund in [Account -> Billing](https://railway.app/account/billing) under **Billing History**:

<Image
src="https://res.cloudinary.com/railway/image/upload/v1708555357/docs/billing-refund_wg7aja.png"
alt="Screenshot of refund request button inside Account -> Billing"
layout="intrinsic"
width={989} height={231} quality={100} />

If you do not see a refund button next to your invoice, you are ineligible for a refund.

## Billing

### What is the difference between subscription and resource usage?

There are two main components to your bill:

| Component          | Description                                                             |
| ------------------ | ----------------------------------------------------------------------- |
| **Subscription**   | Cost of the plan you're on: `[cost per seat] x [purchased seats]`       |
| **Resource Usage** | Cost of the resources you've consumed: `[cost per unit] x [used units]` |

Subscription is a flat fee you pay monthly for the tier you're subscribed to, and Resource Usage varies according to your resource consumption for the month.

### How do I view and manage my subscription?

To view and manage your subscription, visit the [billing section](https://railway.app/account/billing) of the Railway dashboard.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1715777336/docs/manage-subscription_ssyxhg.png"
alt="Screenshot of refund request button inside Account -> Billing"
layout="intrinsic"
width={565} height={508} quality={100} />

Clicking on "Manage Subscription" will allow you to:

- Update your billing information (billing address, tax ID, etc.)
- Retrieve past invoices
- Cancel your subscription

### What payment methods are accepted?

Railway accepts credit cards for plan subscriptions, usage, and to purchase prepaid credits. We support invoice payments for customers on the Enterprise plan.

### Can I try Railway without a credit-card?

Yes. As a new Railway user, you can sign up for a free Trial. You will receive a one-time grant of $5 to use on resources.

### I prefer to prepay. Is that possible?

Yes. You can use prepaid credits as a payment method on Railway if you prefer to prepay for Railway's services. You will still need to pay a monthly subscription fee, as well as for any usage. Those amounts will be deducted from your credit balance.

### What happens if I use credits as a payment method and my account runs out of credits?

If you are using credits as a payment method and your credit balance reaches zero, you will no longer be able to deploy to Railway and we will stop all of your workloads. You will have a grace period to add new credits before we purge your data.

### What happens if the payment fails for my subscription?

If your subscription payment fails, we retry the payment method on file over several days. We also inform you of the payment failure, in case your payment method needs to be updated.

If payment continues to fail, we flag your services to be stopped and send you a warning. If we do not receive payment, your services are stopped until all open invoices have been paid.

### Why was I charged for a partial month of usage?

Railway has an automated system in place which can result in a partial amount of your bill being charged to your payment method, earlier in the billing cycle.

This is intended to ensure that your account remains in good standing, and helps us to mitigate risk and fraud.

### I am a freelancer or represent an agency. How do I manage my billing relationships with my clients?

Create a Pro plan on Railway and add the client to the team. If you run into issues when it's time to hand over your workload to your client, [email us](mailto:team@railway.app) for help on onboarding your client to Railway.
