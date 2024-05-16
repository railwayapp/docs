---
title: Pricing FAQs
---

General common Questions & Answers related to Railway's pricing.

### Can I try Railway without a credit-card?

Yes. As a new Railway user, you can sign up for a [Free Trial](/reference/pricing/free-trial). You will receive a one-time grant of $5 to use on resources.

### What payment methods are accepted?

Railway accepts credit cards for plan subscriptions, usage, and to purchase prepaid credits. We support invoice payments for customers on the Enterprise plan.

### What will it cost to run my app?

With Railway, you are billed for the [subscription fee](/reference/pricing/plans#plan-subscription-pricing) of the plan you're subscribed to, and the [resource usage](/reference/pricing/plans#resource-usage-pricing) of your workloads.

To understand how much your app will cost to run on Railway, we recommend you to:

1. Deploy your project with the [Trial](/reference/pricing/free-trial) or Hobby plan
2. Allow it to run for one week
3. Check your Estimated Usage in the [Usage Section](https://railway.app/account/usage) of your account

Keeping it running for one week allows us to rack up sufficient metrics to provide you with an estimate of your usage for the current billing cycle. You can then use this information to extrapolate the cost you should expect.

We are unable to give exact quotes or estimates for how much it will cost to run your app because it is highly dependent on what you're deploying.

For a rough approximation of the cost for running your app, try our [pricing calculator](https://railway.app/pricing#usage-estimation).

If you are supporting a commercial application, we highly recommend you to upgrade to the Pro plan for higher resource limits and access to [priority support](/reference/support#priority-threads).

### How do I prevent spending more than I want to?

**Usage Limits**

You can set [Usage Limits](/reference/usage-limits) to prevent unexpected costs. We recommend doing this if you'd like to cap your maximum bill every month.

**Private Networking**

Using [Private Networking](/guides/private-networking) when communicating with other services (such as databases) within your Railway project will help you avoid unnecessary Network Egress costs.

**App Sleeping**

Turning on [App Sleeping](/reference/app-sleeping) (aka "Serverless") may reduce the resource usage cost of a service. With App Sleeping enabled, Railway will pause your app if no traffic detected over a 10 minute period. When traffic is detected, your app will automatically resume.

### Why is my resource usage higher than expected?

You can check your resource usage in the [Usage Section](https://railway.app/account/usage) of your account. This includes a breakdown of your resource usage by project, along with the resource it's consuming (CPU, Memory, Network, etc.)

Common reasons for high resource usage include:

- Memory leaks in your application, causing it to consume more memory than necessary
- Higher traffic than usual, causing your app to consume more CPU and/or Network
- Certain templates or apps may be inherently more resource-intensive than others
- If you notice high egress cost in your bill, ensure that you are connecting to your Railway databases over [Private Networking](/guides/private-networking)
- If you have [PR deploys](/develop/environments#ephemeral-environments) enabled in your project, Railway will deploy a mirror copy of your workload(s) based on the environment it forks from (`production` by default). You are billed for those workload(s) running in the ephemeral environment

Unfortunately, we are unable to assist with figuring out why your bill is higher than normal, as it is entirely dependent on what you have deployed. Resource usage is billed in a manner akin to how a utility company operates: they can tell you the amount of electricity you've consumed, but they can't explain the reasons for your high usage. Similarly, we can only provide information on the quantity of resources you consume, not the reasons behind it.

### Why am I charged for more than $5 on the Hobby plan?

Railway's pricing has two components: a monthly subscription fee, and resource usage costs. While the Hobby plan includes $5 of resource usage per month, you are charged for any usage that exceeds this amount.

Learn more [here](/reference/pricing/plans#included-usage).

### How do I view/manage/cancel my subscription?

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

### What happens when I cancel my subscription?

When you cancel your subscription, if you're on Hobby, Pro, or Enterprise, your plan will remain active through the end of your current billing period, and any usage will be charged at the end of the period.

If you are on the Hobby plan and using prepaid credits as your payment method, your subscription will be canceled immediately and any credit balance you may have will be forfeited.

### What happens if the payment fails for my subscription?

If your subscription payment fails, we retry the payment method on file over several days. We also inform you of the payment failure, in case your payment method needs to be updated.

If payment continues to fail, we flag your services to be stopped and send you a warning.

If we do not receive payment, your services are stopped until all open invoices have been paid.

### I am a freelancer or represent an agency. How do I manage my billing relationships with my clients?

Create a Pro plan on Railway and add the client to the team. If you run into issues when it's time to hand over your workload to your client, you can reach out to us over our [Help Station](https://help.railway.app).

### How do I request a refund?

You can request for a refund in [Account -> Billing](https://railway.app/account/billing) under **Billing History**:

<Image
src="https://res.cloudinary.com/railway/image/upload/v1708555357/docs/billing-refund_wg7aja.png"
alt="Screenshot of refund request button inside Account -> Billing"
layout="intrinsic"
width={989} height={231} quality={100} />

If you do not see a refund button next to your invoice, you are ineligible for a refund. **This decision is final** and we will not issue refunds for invoices that have been deemed ineligible.

Railway offers refunds at its sole discretion. If your invoice contains resource usage costs, we may not be able to issue a refund as those were resources you have consumed (in a manner akin to how a utility company charges for electricity or water).

If you'd like to stop using Railway, please remove your projects and cancel your subscription immediately. See "[How do I view/manage/cancel my subscription?](/reference/pricing/faqs#how-do-i-viewmanagecancel-my-subscription)" for further information.
