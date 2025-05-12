---
title: Pricing FAQs
description: General common Questions & Answers related to Railway's pricing.
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
3. Check your Estimated Usage in the [Usage Section](https://railway.com/workspace/usage) of your Workspace settings

Keeping it running for one week allows us to rack up sufficient metrics to provide you with an estimate of your usage for the current billing cycle. You can then use this information to extrapolate the cost you should expect.

We are unable to give exact quotes or estimates for how much it will cost to run your app because it is highly dependent on what you're deploying.

For a rough approximation of the cost for running your app, try our [pricing calculator](https://railway.com/pricing#usage-estimation).

If you are supporting a commercial application, we highly recommend you to upgrade to the Pro plan for higher resource limits and access to [priority support](/reference/support#priority-threads).

### How do I prevent spending more than I want to?

Check out our [guide on optimizing usage](/guides/optimize-usage).

### Why is my resource usage higher than expected?

You can check your resource usage in the [Usage Section](https://railway.com/workspace/usage) of your Workspace settings. This includes a breakdown of your resource usage by project, along with the resource it's consuming (CPU, Memory, Network, etc.)

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

### Why is there an "Applied balance" on my invoice?

When the amount due on your invoice is less than $0.50, and you do not have a credit balance, Railway marks the invoice as paid and registers the amount to your credit balance as a debit to be charged on a future invoice.

### How do I view/manage/cancel my subscription?

To view and manage your subscription, visit the [billing section](https://railway.com/workspace/billing) of your workspace.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1743469115/manage-subscription_qnqfjb.png"
alt="Screenshot of refund request button inside Account -> Billing"
layout="intrinsic"
width={1200} height={635} quality={100} />

Clicking on "Manage Subscription" will allow you to:

- Update your billing information (billing address, tax ID, etc.)
- Retrieve past invoices
- Cancel your subscription

### What happens when I cancel my subscription?

When you cancel your subscription, if you're on Hobby, Pro, or Enterprise, your plan will remain active through the end of your current billing period, and any usage will be charged at the end of the period.

If you are on the Hobby plan and using prepaid credits as your payment method, your subscription will be canceled immediately and any credit balance you may have will be forfeited.

### How do I switch to the auto-renewing Hobby plan billing model?

At this time, we do not directly support switching from a prepaid credit-based plan to an auto-renewing subscription.

You can, however, cancel your current plan, wait until you exhaust your remaining credits, and then sign back up on the auto-renewing plan.

**Note:** Cancelling your subscription does not immediately stop your [services](/overview/the-basics#services). Services will run until you exhaust your remaining credits.

<p><span style={{color: "var(--tw-prose-counters)"}}>1.</span> Cancel your current plan.</p>

    - Head over to the <a href="https://railway.com/workspace/billing" target="_blank">Billing page</a> of your workspace.
    - Click on **Manage Subscription**.
    - Click on **Cancel Plan**.

<p><span style={{color: "var(--tw-prose-counters)"}}>2.</span> Wait until you exhaust your remaining credits.</p>

<p><span style={{color: "var(--tw-prose-counters)"}}>3.</span> Sign up for the auto-renewing Hobby plan.</p>

        - Head over to the <a href="https://railway.com/workspace/plans" target="_blank">Plans page</a>.
        - Click **Deploy with Hobby**.
        - Enter your billing information.
        - Click on **Subscribe to Hobby Plan**.

        You are now on the auto-renewing subscription model.

### What happens if the payment fails for my subscription?

If your subscription payment fails, we retry the payment method on file over several days. We also inform you of the payment failure, in case your payment method needs to be updated.

If payment continues to fail, we flag your services to be stopped and send you a warning.

If we do not receive payment, your services are stopped until all open invoices have been paid.

### My services were stopped, what do I do?

Your [services](/overview/the-basics#services) may be stopped by Railway for the following reasons, along with their solutions -

- **Usage limits reached:** You've hit your [usage limits](/reference/usage-limits). Increase your usage limit or wait until the next billing period.

- **Trial credits exhausted:** You've run out of [trial credits](/reference/pricing/free-trial#how-does-the-trial-work). Consider upgrading to [a paid plan](/reference/pricing/plans#plans) to continue using the service.

- **Hobby credits exhausted:** You've run out of [prepaid credits](/reference/pricing/plans#credits). Add more credits to your account.

- **Failed payment:** Your payment method has failed. Update your payment method and [pay your outstanding invoice](https://railway.com/workspace/billing).

- **Unpaid invoice:** You have an outstanding invoice. [Pay your outstanding invoice](https://railway.com/workspace/billing).

In all cases, you can redeploy your services once the underlying issue is resolved, this can be done from the Removed deployment's [3-dot menu](/reference/deployments#deployment-menu).

**Note:** Although Railway will remove your deployment for any of the above reasons, Railway will not remove the [volume](/overview/the-basics#volumes) attached to the service.

### I am a freelancer or represent an agency. How do I manage my billing relationships with my clients?

Create a Pro plan on Railway and add the client to the workspace. If you run into issues when it's time to hand over your workload to your client, you can reach out to us over our [Central Station](https://station.railway.com).

### Why did I receive another invoice after cancelling my subscription?

You may receive an invoice containing charges for Resource Usage after you cancel your subscription. These are resource usages you have consumed in that billing cycle that we reserve the right to charge you for.

### How do I request a refund?

Please refer to [Pricing -> Refunds](/reference/pricing/refunds).

### Requesting an invoice re-issuance

If you encounter "This invoice can no longer be paid on Stripe" error or need
your Tax ID added to a previous invoice, follow the steps below to get an
invoice reissued.

1. Go to your workspace's billing page at [https://railway.com/workspace/billing](https://railway.com/workspace/billing). Ensure you select the correct workspace using the Workspace Switcher in the top left corner.

2. Scroll to **Billing History**. For the invoice you want to reissue, click on the Gear icon next to it and select **Re-issue**.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1747010826/docs/cs-2025-05-12-08.14_3_lrlrz9.png"
alt="Screenshot of invoice options"
layout="intrinsic"
width={507} height={231} quality={100} />

3. Follow the instructions in the pop-up:

<Image
src="https://res.cloudinary.com/railway/image/upload/v1747010832/docs/cs-2025-05-12-08.14_fyi63w.png"
alt="Screenshot of invoice re-issuance"
layout="intrinsic"
width={876} height={557} quality={100} />

Before you re-issue an invoice, please ensure your [billing information is
up-to-date](#how-do-i-viewmanagecancel-my-subscription).

Once your invoice has been re-issued, it will contain the latest billing
information, and appear in your **Billing History**.

If you do not receive the re-issued invoice within 24 hours, please reach
out to us at [station.railway.com](https://station.railway.com).
