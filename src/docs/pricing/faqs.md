---
title: Pricing FAQs
description: General common Questions & Answers related to Railway's pricing.
---

General common Questions & Answers related to Railway's pricing.

### Can I try Railway without a credit-card?

Yes. As a new Railway user, you can sign up for a [Free Trial](/reference/pricing/free-trial). You will receive a one-time grant of $5 to use on resources.

### What payment methods are accepted?

Railway only accepts credit cards for plan subscriptions. We also support custom invoicing for customers on the Enterprise plan.

### What will it cost to run my app?

With Railway, you are billed for the [subscription fee](/reference/pricing/plans#plan-subscription-pricing) of the plan you're subscribed to, and the [resource usage](/reference/pricing/plans#resource-usage-pricing) of your workloads.

To understand how much your app will cost to run on Railway, we recommend that you:

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

### How do I view or upgrade my current plan?

Your current plan is listed in the Account Selector in the top left corner of your Dashboard. You can also view your active plan and upgrade options from the [Plans](https://railway.com/workspace/plans) page. 

### How do I cancel my subscription?

To cancel your active subscription, go to the "Active Plan" section of your [Billing](https://railway.com/workspace/billing) page and click `Cancel Plan`. 

When you cancel your subscription, Railway will stop all deployments in your workspace to prevent further charges. Your plan will remain active until the end of your billing cycle. 

### How do I add or update billing information?

To add or update your Billing information, go to the [Billing](https://railway.com/workspace/billing) page. In the "Billing Info" section, you can add or update the following information: 
- Payment Method
- Billing Email
- Billing Address
- Tax ID / VAT number

When Billing Information is added or updated, it will be reflected on all future invoices from Railway. 

### How is Sales Tax/VAT handled?

Railway may collect applicable sales tax and VAT on your account based on your billing location and local tax requirements, where and when applicable. When assessed and collected, Sales Tax/VAT is explicitly outlined on your invoice.

To ensure accurate tax assessment, Workspace Admins must verify that their billing information, including Billing Address, Organization Name, and Tax ID (when applicable), is accurate. Organization Name and Tax ID are not required when using Railway for personal use.

To view and manage your subscription, visit the [billing section](https://railway.com/workspace/billing) of your workspace.

### How do I remove my saved payment method from my account?

If your subscription is canceled and you have no pending invoices, you can remove your saved payment method by doing the following:

1. Go to the [billing page](https://railway.com/workspace/billing) for your workspace
2. Click "Delete" in the payment method section

### What happens if the payment fails for my subscription?

If your subscription payment fails, we retry the payment method on file over several days. We also inform you of the payment failure, in case your payment method needs to be updated.

If payment continues to fail, we flag your services to be stopped and send you a warning.

If we do not receive payment, your services are stopped until all open invoices have been paid.

### My services were stopped, what do I do?

Your [services](/overview/the-basics#services) may be stopped by Railway for the following reasons, along with their solutions -

- **Usage limits reached:** You've hit your [usage limits](/reference/usage-limits). Increase your usage limit, remove it entirely, or wait for the usage limit to reset.

- **Trial credits exhausted:** You've run out of [trial credits](/reference/pricing/free-trial#how-does-the-trial-work). Consider upgrading to [a paid plan](/reference/pricing/plans#plans) to continue using the service.

- **Failed payment:** Your payment method has failed. Update your payment method and [pay your outstanding invoice](https://railway.com/workspace/billing).

- **Unpaid invoice:** You have an outstanding invoice. [Pay your outstanding invoice](https://railway.com/workspace/billing).

Railway will automatically redeploy your services once the underlying issue is resolved, as long as it is resolved within a period of 30 days. After that, you will have to redeploy them manually from the Removed deployment's [3-dot menu](/reference/deployments#deployment-menu).

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

Before you re-issue an invoice, please ensure your [billing information is up-to-date](/reference/pricing/faqs#how-do-i-add-or-update-billing-information).

Once your invoice has been re-issued, it will contain the latest billing
information, and appear in your **Billing History**.

If you do not receive the re-issued invoice within 24 hours, please reach
out to us at [station.railway.com](https://station.railway.com).
