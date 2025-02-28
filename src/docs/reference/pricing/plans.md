---
title: Pricing Plans
description: Learn about Railway's plans and pricing.
---

Railway plans and pricing are designed to support you however you work. We charge a base subscription fee for the plan you sign up to, on top of your resource and add-on usages.

## Plans

Railway offers three plans in addition to a [Free Trial](/reference/pricing/free-trial):

|                |                                                                                                                                                    |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Hobby**      | For indie hackers and developers to build and deploy personal projects                                                                             |
| **Pro**        | For professional developers and their teams shipping to production                                                                                 |
| **Enterprise** | For teams building and deploying production applications with the need for enterprise features related to compliance, SLAs, and account management |

### Subscription Pricing

Each Railway account needs an active subscription. The base subscription fee allows you to use the Railway platform and features included in the tier of your subscription.

| Plan           | Price                     |
| -------------- | ------------------------- |
| **Hobby**      | $5 / month                |
| **Pro**        | $20 / team member / month |
| **Enterprise** | Custom                    |

Read more about our plans at <a href="https://railway.com/pricing" target="_blank">railway.com/pricing</a>.

### Default Plan Resources

Depending on the plan you are on, you are allowed to use up these resources per service.

| Plan           | **RAM**    | **CPU**     | **Ephemeral Storage** | **Volume Storage** |
| -------------- | ---------- | ----------- | --------------------- | ------------------ |
| **Trial**      | **0.5 GB** | **2 vCPU**  | **1 GB**              | **0.5 GB**         | 
| **Hobby**      | **8 GB**   | **8 vCPU**  | **10 GB**            | **5 GB**           |
| **Pro**        | **32 GB**  | **32 vCPU** | **100 GB**            | **50 GB****          |
| **Enterprise** | **64 GB**  | **64 vCPU** | **100 GB**            | **50 GB****          |

Note that these are initial values and users on the Pro and Enterprise plans can request limit increases.  

**For Volumes, Pro users and above can self-serve to increase their volume up to 250 GB.  Check out [this guide](/guides/volumes#growing-the-volume) for information.

### Resource Usage Pricing

On top of the base subscription fee above, Railway charges for the resources that you consume.

You are only charged for the resources you actually use, which helps prevent runaway cloud costs and provides assurances that you're always getting the best deal possible on your cloud spend.

| Resource                                                   | Resource Price                                               |
| ---------------------------------------------------------- | ------------------------------------------------------------ |
| **RAM**                                                    | $10 / GB / month ($0.000231 / GB / minute)                   |
| **CPU**                                                    | $20 / vCPU / month ($0.000463 / vCPU / minute)               |
| **Network Egress**                                         | $0.10 / GB ($0.000000095367432 / KB) ― _from August 1, 2023_ |
| (Optional Add-on) [**Volume Storage**](/reference/volumes) | $0.25 / GB / month ($0.000005787037037 / GB / minute)        |

To learn more about controlling your resource usage costs, read our FAQ on [How do I prevent spending more than I want to?](/reference/pricing/faqs#how-do-i-prevent-spending-more-than-i-want-to)

## Included Usage

The Hobby plan includes $5 of resource usage per month.

If your total resource usage at the end of your billing period is $5 or less, you will not be charged for resource usage. If your total resource usage exceeds $5 in any given billing period, you will be charged the delta.

Included resource usage is reset at the end of every billing cycle and does not accumulate over time.

**Examples**:

- If your resource usage is $3, your total bill for the cycle will be $5. You are only charged the subscription fee because your resource usage is below $5 and therefore included in your subscription
- If your resource usage is $7, your total bill for the cycle will be $7 ($5 subscription fee + $2 of usage), because your resource usage exceeds the included resource usage

The Pro plan **does not include any usage credits**. You will be billed for resource usage on top of the full subscription fee.

### Additional Services

Railway offers [Business Class Support](/reference/support#business-class) as an add-on service to the Pro plan. Business Class Support is included with Enterprise. [Contact us](mailto:team@railway.com) to get started.

## Credits

Credits are available on Railway as a payment method for Hobby plan users who prefer to pre-pay for their subscription and usage on Railway.

### Credits As a Payment Method

On Railway, you can pay for your Hobby plan subscription and resource usage with pre-purchased credits. When using credits as a payment method, keep in mind that:

- You must carry a credit balance sufficient to cover usage + the Hobby plan fee, otherwise your project will be paused and your subscription cancelled. If your subscription is cancelled, you will be required to resubscribe
- If your usage within a billing period exceeds your credit balance, you will no longer be able to deploy, and your projects will be paused
- If you cancel your subscription, any remaining credit balance will be lost

Credits as a payment method is only available for Hobby plan users.

### Purchasing Credits

You can purchase credits from your account's [Usage page](https://railway.com/account/usage).

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
| **Subscription**   | Cost of the plan you're on: `[cost per seat] x [purchased seats]`       |
| **Resource Usage** | Cost of the resources you've consumed: `[cost per unit] x [used units]` |

Subscription is a flat fee you pay monthly for the tier you're subscribed to, and Resource Usage varies according to your resource consumption for the month.

### Can I add collaborators to my project?

Railway's Pro and Enterprise plans are designed for collaboration. These plans allow you to add members to your team and manage their permissions.

Read more about adding members to your Pro or Enterprise team [here](/reference/teams#inviting-members).

### Is the Hobby Plan free?

No. The Hobby Plan is $5 a month, and it includes a resource usage credit of $5. Even if you do not use the $5 in usage (CPU, Memory, egress), you always pay the $5 subscription fee.

### Can I get the Hobby plan subscription fee waived?

Railway waives the monthly Hobby plan subscription fee for a small set of active builders on the platform.

Eligibility is automatically assessed based on several factors, including your usage on the platform, your GitHub account, and more. If you qualify, you will be notified in the Dashboard or when you upgrade to the Hobby plan. If you do not qualify, you will not be eligible for the waiver.

This is a fully automated process, and Railway does not respond to requests for waiver.

### I prefer to prepay. Is that possible?

Yes. You can use prepaid credits as a payment method on Railway if you prefer to prepay for Railway's services. You will still need to pay a monthly subscription fee, as well as for any usage. Those amounts will be deducted from your credit balance.

### What happens if I use credits as a payment method and my account runs out of credits?

If you are using credits as a payment method and your credit balance reaches zero, your subscription will be cancelled. You will no longer be able to deploy to Railway and we will stop all of your workloads. To resolve this, you will need to sign up for a new subscription after topping up sufficient credits.

### Why was I charged for a partial month of usage?

Railway has an automated system in place which can result in a partial amount of your bill being charged to your payment method, earlier in the billing cycle.

This is intended to ensure that your account remains in good standing, and helps us to mitigate risk and fraud.
