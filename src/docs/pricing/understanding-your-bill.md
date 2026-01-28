---
title: Understanding Your Bill
description: Learn how Railway billing works, why you're charged when idle, and how to read your invoice.
---

This guide explains how Railway billing works in practice, helping you understand your charges and avoid unexpected costs.

## How Railway Billing Works

Your subscription fee ($5 Hobby, $20 Pro) is a minimum usage commitment. It covers your first $5 or $20 of resource usage each month.

At the end of each billing cycle:
- **Usage ≤ plan amount**: You owe nothing extra, just your subscription for the next month
- **Usage > plan amount**: You pay the difference between your actual usage and what your plan already covered

Your invoice combines two periods:
- **Subscription** (billed in advance): Your minimum commitment for the upcoming month
- **Usage overage** (billed in arrears): Any resource usage from the previous month that exceeded your plan's included amount

**Example (Pro plan):** Your December 21 invoice includes:
- $20 Pro subscription for Dec 21 – Jan 21 (next month)
- $0 overage if Nov 21 – Dec 21 usage was under $20, OR the amount over $20 if you exceeded it

In some cases, Railway may charge a partial amount earlier in the billing cycle to ensure your account remains in good standing and to help mitigate fraud.

## Why You're Charged When Your App Has No Traffic

A common question: "Why am I being charged when my app has no traffic?"

The key concept is that **you pay for allocated resources, not traffic**. When your service is running, it consumes CPU and RAM regardless of whether it's actively handling requests.

Think of it like electricity: you pay for appliances that are plugged in and running, not just when you're actively using them. A server running idle still uses memory to stay loaded and CPU cycles to stay responsive.

### Solutions to Reduce Idle Costs

| Solution                                            | Description                                              |
| --------------------------------------------------- | -------------------------------------------------------- |
| [Serverless](/reference/app-sleeping)               | Automatically stops services when inactive               |
| [Usage Limits](/reference/usage-limits)             | Set spending caps to prevent unexpected charges          |
| Delete unused services                              | Remove services you no longer need                       |
| [Private Networking](/guides/private-networking)    | Reduce egress costs by keeping traffic internal          |

## Understanding Included Usage

Both paid plans include a usage credit that offsets your resource consumption:

| Plan       | Subscription | Included Usage |
| ---------- | ------------ | -------------- |
| **Hobby**  | $5/month     | $5             |
| **Pro**    | $20/month    | $20            |

**How it works:**

1. Your subscription fee goes toward your resource usage
2. If usage stays within the included amount, you only pay the subscription fee
3. If usage exceeds the included amount, you pay the difference

**Examples (Hobby plan):**

| Resource Usage | Subscription | Included Usage Applied | Total Bill |
| -------------- | ------------ | ---------------------- | ---------- |
| $3             | $5           | $3                     | $5         |
| $5             | $5           | $5                     | $5         |
| $8             | $5           | $5                     | $8         |
| $15            | $5           | $5                     | $15        |

**Important:** Included usage credits reset each billing cycle. They do not accumulate or roll over to the next month. If you use $2 this month, you don't get $8 next month.

## Reading Your Invoice

Your Railway invoice contains several line items. Here's what each means:

<Image src="https://res.cloudinary.com/railway/image/upload/v1769474205/docs/bill_screenshot_elzqtf.png" alt="Example Railway invoice showing resource usage, subscription, included usage discount, and applied balance" width={1666} height={1546} quality={100} />

### Subscription Charges

The flat fee for your plan appears as a line item:
- "Hobby plan" - $5.00
- "Pro plan" - $20.00

Pro and Enterprise workspaces also show a per-seat line item:
- "Pro (per seat)" - $0.00 (seats are free, this line just shows the member count)

### Resource Usage Charges

Resources are listed by type with the unit and billing period:

| Line Item                             | Meaning                                      |
| ------------------------------------- | -------------------------------------------- |
| "Disk (per GB / min)"                 | Volume storage charges                       |
| "Network (per MB)"                    | Outbound data transfer (egress) charges      |
| "vCPU (per vCPU / min)"               | CPU usage charges                            |
| "Memory (per MB / min)"               | RAM usage charges                            |

Each line item shows the quantity used, unit price, and total amount for the billing period.

### Included Usage

Your plan's included usage appears as a discount in the invoice summary:
- "Hobby plan included usage ($5.00 off)"
- "Pro plan included usage ($20.00 off)"

The amount in parentheses shows the maximum credit available. The actual discount applied equals your resource usage up to that maximum. For example, if your resource usage is $15.39 on the Pro plan, you'll see "-$15.39" applied even though the max is $20.00.

### Applied Balance

"Applied balance" appears in the invoice summary when you have account credits or small amounts carried forward:

- **Credit applied**: If you have credits on your account (from refunds, promotions, or previous overpayments), they appear as a negative "Applied balance" reducing your amount due
- **Small amounts deferred**: If your total invoice is less than $0.50, Railway marks it as paid and carries the amount forward to your next invoice

### Tax and VAT

If applicable based on your billing location, you may see:
- "Sales Tax" or "VAT" as a separate line item

Ensure your [billing information](https://railway.com/workspace/billing) is accurate to receive correct tax assessment.

## Common Causes of Unexpected Charges

### High Network Egress

Network egress (outbound data transfer) is charged at $0.05/GB. Common causes of high egress:

- **Not using private networking for databases**: If your app connects to your Railway database using the public URL instead of the private URL, all that traffic counts as egress. Use `DATABASE_URL` (private) instead of `DATABASE_PUBLIC_URL`.
- **Large file transfers**: Serving large files, images, or videos directly from your service.
- **API responses**: High-traffic APIs returning large payloads.

**Solution:** Use [private networking](/guides/private-networking) for all service-to-service communication within Railway.

### PR Deploys / Ephemeral Environments

When you have [PR deploys](/develop/environments#ephemeral-environments) enabled, Railway creates a copy of your environment for each pull request. These environments run real services that consume real resources.

If you have 5 open PRs, you may be running 5x your normal workload.

**Solution:** Close PRs promptly or disable PR deploys if you don't need them.

### Idle Services Still Running

Services consume resources even when not handling traffic. If you have development, staging, or test environments running continuously, they add up.

**Solution:** Enable [Serverless](/reference/app-sleeping) on services that don't need to be always-on, or delete unused services.

### Memory Leaks

If your application has a memory leak, it will gradually consume more RAM over time until it hits limits or gets restarted. This inflates your memory costs.

**Solution:** Monitor your service metrics for growing memory usage and fix leaks in your application code.

## Related Resources

- [Plans and Pricing](/reference/pricing/plans) - Detailed pricing information
- [Pricing FAQs](/reference/pricing/faqs) - Common pricing questions
- [Optimize Usage](/guides/optimize-usage) - Guide to reducing costs
- [Usage Limits](/reference/usage-limits) - Set spending caps
- [Serverless](/reference/app-sleeping) - Auto-stop inactive services
- [Private Networking](/guides/private-networking) - Reduce egress costs
