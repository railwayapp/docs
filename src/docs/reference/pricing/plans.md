---
title: Pricing Plans
description: Learn about Railway's plans and pricing.
---

Railway plans and pricing are designed to give you maximum resources while only charging you for your usage. We charge a base subscription price, which goes towards your resources and usage.

## Plans

Railway offers four plans in addition to a [Trial](/reference/pricing/free-trial):

|                |                                                                                                                                                    |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Free**       | For running small apps with $1 of free credit per month                                                                                             |
| **Hobby**      | For indie hackers and developers to build and deploy personal projects                                                                             |
| **Pro**        | For professional developers and their teams shipping to production                                                                                 |
| **Enterprise** | For teams building and deploying production applications with the need for enterprise features related to compliance, SLAs, and account management |

### Subscription Pricing

Each Railway account needs an active subscription. The base subscription fee allows you to use the Railway platform and features included in the tier of your subscription. The subscription fee goes towards your usage-costs on the platform.

| Plan           | Price       |
| -------------- | ----------- |
| **Free**       | $0 / month  |
| **Hobby**      | $5 / month  |
| **Pro**        | $20 / month |
| **Enterprise** | Custom      |

Read more about our plans at <a href="https://railway.com/pricing" target="_blank">railway.com/pricing</a>.

Curious about potential savings? [Upload your current invoice](https://railway.com/pricing#pricing-invoice) and see how much you can save by running your workloads on Railway.

### Default Plan Resources

Depending on the plan you are on, you are allowed to use up these resources per service.

| Plan           | **Replicas** | **RAM**      | **CPU**        | **Ephemeral Storage** | **Volume Storage** | **Image Size** |
| -------------- | ------------ | ------------ | -------------- | --------------------- | ------------------ | -------------- |
| **Trial**      | **0**        | **1 GB**     | **2 vCPU**     | **1 GB**              | **0.5 GB**         | **4 GB**       |
| **Free**       | **0**        | **0.5 GB**   | **1 vCPU**     | **1 GB**              | **0.5 GB**         | **4 GB**       | 
| **Hobby**      | **6**        | **48 GB**    | **48 vCPU**    | **100 GB**            | **5 GB**           | **100 GB**     |
| **Pro**        | **42**       | **1 TB**     | **1,000 vCPU** | **100 GB**            | **1 TB \***        | **Unlimited**  |
| **Enterprise** | **50**       | **2.4 TB**   | **2,400 vCPU** | **100 GB**            | **5 TB \***        | **Unlimited**  |

Note that these are maximum values and include replica multiplication.

\* For Volumes, Pro users and above can self-serve to increase their volume up to 250 GB. Check out [this guide](/guides/volumes#growing-the-volume) for information.

### Resource Usage Pricing

On top of the base subscription fee above, Railway charges for the resources that you consume.

You are only charged for the resources you actually use, which helps prevent runaway cloud costs and provides assurances that you're always getting the best deal possible on your cloud spend.

| Resource                                 | Resource Price                                        |
| ---------------------------------------- | ----------------------------------------------------- |
| **RAM**                                  | $10 / GB / month ($0.000231 / GB / minute)            |
| **CPU**                                  | $20 / vCPU / month ($0.000463 / vCPU / minute)        |
| **Network Egress**                       | $0.05 / GB ($0.000000047683716 / KB)                  |
| [**Volume Storage**](/reference/volumes) | $0.15 / GB / month ($0.000003472222222 / GB / minute) |

To learn more about controlling your resource usage costs, read our FAQ on [How do I prevent spending more than I want to?](/reference/pricing/faqs#how-do-i-prevent-spending-more-than-i-want-to)

## Included Usage

The Hobby plan includes $5 of resource usage per month.

If your total resource usage at the end of your billing period is $5 or less, you will not be charged for resource usage. If your total resource usage exceeds $5 in any given billing period, you will be charged the delta.

Included resource usage is reset at the end of every billing cycle and does not accumulate over time.

**Examples**:

- If your resource usage is $3, your total bill for the cycle will be $5. You are only charged the subscription fee because your resource usage is below $5 and therefore included in your subscription
- If your resource usage is $7, your total bill for the cycle will be $7 ($5 subscription fee + $2 of usage), because your resource usage exceeds the included resource usage

Similarly, the Pro plan includes $20 of resource usage per month and the same examples and billing logic apply. If your usage stays within $20, you'll only pay the subscription fee. If it exceeds $20, you'll be charged the difference on top of the subscription.

### Additional Services

Railway offers [Business Class Support](/reference/support#business-class) as an add-on service to the Pro plan. Business Class Support is included with Enterprise. [Contact us](mailto:team@railway.com?subject=Business%20Class%20Support) to get started.

## Image Retention Policy

Railway retains images for a period of time after a deployment is removed. This is to allow for rollback to a previous deployment.

| Plan             | **Policy**    |
| ---------------- | ------------- |
| **Free / Trial** | **24 hours**  |
| **Hobby**        | **72 hours**  |
| **Pro**          | **120 hours** |
| **Enterprise**   | **360 hours** |

When a deployment is removed, the image will be retained for the duration of the policy.

Rolling back a removed deployment within the retention policy will restore the previous image, settings, and all variables with a new deployment; no redeployment is required.

A removed deployment that is outside of the retention policy will not have the option to rollback; instead, you will need to use the redeploy feature. This will rebuild the image from the original source code with the deployment's original variables.

## Committed Spend Tiers

Railway offers committed spend tiers for customers with consistent usage needs. Instead of negotiated contract pricing, customers can commit to a specific monthly spend level to unlock additional features and services.

For example, customers who commit to a $10,000/month spend rate can access dedicated hosts, with all pricing going towards their usage. This approach provides more flexibility and transparency compared to traditional contract pricing.

| Feature                    | Commitment Spend | Description                                                                                                      |
| -------------------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------- |
| **90-day log history**     | $200/month       | Extended log retention for better historical analysis and auditing.                                              |
| **HIPAA BAAs**             | $1,000/month     | HIPAA Business Associate Agreements for compliant health data handling. Requires a year commitment paid monthly. |
| **Slack Connect channels** | $2,000/month     | Dedicated Slack Connect channels for enhanced communication and support with the Railway team.                   |
| **SLOs**                   | $2,000/month     | Service Level Objectives to ensure and track application performance.                                            |
| **Dedicated Hosts**        | $10,000/month    | Custom dedicated infrastructure for enhanced performance and control.                                            |

To learn more about committed spend tiers, please [contact our team](mailto:team@railway.com?subject=Business%20Class%20Support).

### One-time Grant of Credits on the Free Trial

Users who create a new Trial account receive a free one-time grant of $5. Railway will expend any free credit before consuming any purchased credits. Trial plan users are unable to purchase credits without upgrading to the Hobby plan.

Learn more about Railway's Free Trial [here](/reference/pricing/free-trial).

## Partial Month Charges

In some cases, your billing method may be charged for the partial amount of your bill earlier in the billing cycle.
This ensures that your account remains in good standing, and helps us mitigate risk and fraud.

## FAQs

### Which plan is right for me?

- **Hobby** is for indie hackers and developers to build and deploy personal projects
- **Pro** is for professional developers and their teams shipping to production
- **Enterprise** is for dev teams building and deploying production applications with the need for enterprise features related to compliance, SLAs, and account management

### Can I upgrade or downgrade at any time?

You can upgrade any time, and when you do, you will get to the features of your new plan, as well as access to more powerful resources, immediately. When you downgrade, the changes will take effect at the beginning of your next billing cycle.

### What is the difference between subscription and resource usage?

There are two main components to your bill:

| Component          | Description                                                             |
| ------------------ | ----------------------------------------------------------------------- |
| **Subscription**   | Cost of the plan you're on                                              |
| **Resource Usage** | Cost of the resources you've consumed: `[cost per unit] x [used units]` |

Subscription is a flat fee you pay monthly for the tier you're subscribed to, and Resource Usage varies according to your resource consumption for the month.

### Can I add collaborators to my project?

Railway's Pro and Enterprise plans are designed for collaboration. These plans allow you to add members to your team and manage their permissions.

Read more about adding members to your Pro or Enterprise team [here](/reference/workspaces#inviting-members).

### How long does Railway keep my volume data if I am no longer on a paid plan?

Railway will delete your data from the platform as per the timeline below after sufficient warning.

| Plan                   | Days                       |
| ---------------------- | -------------------------- |
| **Free or Trial plan** | 30 days after expiry       |
| **Hobby plan**         | 60 days after cancellation |
| **Pro plan**           | 90 days after cancellation |

### Is the Hobby Plan free?

No. The Hobby Plan is $5 a month, and it includes a resource usage credit of $5. Even if you do not use the $5 in usage (CPU, Memory, egress), you always pay the $5 subscription fee.

### Can I get the Hobby plan subscription fee waived?

Railway waives the monthly Hobby plan subscription fee for a small set of active builders on the platform.

Eligibility is automatically assessed based on several factors, including your usage on the platform, your GitHub account, and more. If you qualify, you will be notified in the Dashboard or when you upgrade to the Hobby plan. If you do not qualify, you will not be eligible for the waiver.

This is a fully automated process, and Railway does not respond to requests for waiver.

### I prefer to prepay. Is that possible?

Not anymore as of March 30th, Railway requires the use of a post-paid card.

### What happens if I use credits as a payment method and my account runs out of credits?

If you are using credits as a payment method and your credit balance reaches zero, your subscription will be cancelled. You will no longer be able to deploy to Railway and we will stop all of your workloads. To resolve this, you will need to sign up for a new subscription after topping up sufficient credits.

### Why was I charged for a partial month of usage?

Railway has an automated system in place which can result in a partial amount of your bill being charged to your payment method, earlier in the billing cycle.

This is intended to ensure that your account remains in good standing, and helps us to mitigate risk and fraud.
