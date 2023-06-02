---
title: Pricing
---

<Banner variant="info">
  New plans were announced in early June, 2023. The migration window will be open from **July 3, 2023** - **August 1, 2023**, after which all existing Railway users will be migrated automatically.
  <br /><br />For full details, read the [blogpost](https://railway.app/blog) and check out the [Migration Guide](https://railway.app/blog). 
</Banner>

Railway offers a consumption-based pricing model for your projects. You don't get charged for resources you don't use, instead, Railway charges by the minute for each vCPU and memory resource your service uses.

[You can see the offerings of each tier on this page.](/reference/plans)

## Pricing Rates

Railway computes the usage cost with the following formula:

`Num Services` x (`Service Time` (in minutes) x (`Memory usage` (in GB)) + `vCPU usage` (in cores))

And our rates for usage are as follows:

**Memory** - $10 / GB per month ($0.000231 / GB / minute)

**vCPU** - $20 / vCPU per month ($0.000463 / vCPU / minute)

Keep in mind, if your project has PR deploys enabled, Railway deploys a mirror copy of your service(s) based on the environment it forks from (`production` by default). You are billed for the services that are spun while the ephemeral environment is active.

## Billing Management

You can add and manage your payment info under the billing page and see historical billing usage under the account billing page: [railway.app/account/billing](https://railway.app/account/billing)

Within this page, you can also top up on credits for your account if you prefer to pay for the Hobby Plan in a prepaid fashion.

## Credit Behavior

Every new account gets a free one-time grant of $5.

Railway will expend any free credit before consuming any paid credits.
