---
title: Pricing
---

Railway offers a consumption-based pricing model for your projects. You don't get charged for resources you don't use—Railway charges by the minute for each vCPU and memory resource your service uses.

Users who upgrade to the Developer plan get unlimited execution time on their workloads and increased service limits compared to users on the Starter plan.

[You can see the limits of each tier on this page.](/reference/limits)

## Pricing Rates

Railway computes the usage cost with the following formula:
`Num Services` x (`Service Time` (in minutes) x (`Memory usage` (in GB) + `vCPU usage` (in cores))

And our rates for usage are as follows:

Memory - $10 / GB per month ($0.000231 / GB / minute)
vCPU - $20 / vCPU per month ($0.000463 / vCPU / minute)

There is no minimum service cost; you aren't billed if your app uses no resources or crashes. Likewise, we don't bill for build time on the platform. 

Keep in mind, if your project has PR deploys, Railway deploys a mirror copy of your service(s) based off the environment deploys fork from. You are billed for the services that are spun while the ephemeral environment is active. 

## Billing Management

You can add and manage your payment info under the billing page and see historical billing usage under the account billing page: [railway.app/account/billing](https://railway.app/account/billing)

Within this page, you can also top up on credits for your account if you prefer to pay for the Developer Plan in a prepaid fashion. 

You can't load prepaid credits on your account while using the usage-based payment method for the Developer Plan.

## Credit Behavior

Every account gets $5 of included credit per month. Users who upgrade to the Developer Plan have no execution time limit on their credits.

Railway will expend any free credit before consuming any paid credits. If users prepay to use the Developer Plan and expend all credits, the account is demoted to the Starter plan.

## Execution Time Limit

Exclusively on the Starter Plan, Railway limits accounts to 500 hours of uptime. Each service counts against this limit. In practice, if a user only has one service running, they expend the hours at a standard rate. (Around 21 days of continuous uptime) If they have two services running, such as a DB and a service, the hours consume twice the rate. (Around ten and a half days of continuous uptime). Crashed deploys count towards your uptime.



