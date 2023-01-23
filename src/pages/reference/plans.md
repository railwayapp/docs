---
title: Plans
---

Railway has multiple plans that fit your need on the platform. Projects inherit the caps of the plan that the user has. Projects that are made within a team belong to the team and aren't tied to a Railway user.

## Starter Plan

Starter plans are designed to help you evaluate Railway and are fit for hobbyist projects. You get access to all features on Railway and you have no limits to the amount of projects you can provision.

Starter plans get $5 of credits that do not accumulate.

Starter plans also have an execution limit, users get 500 execution hours per month. Hours get consumed if you at least have one service live.

If you have one service, it will deplete the 500-hour reserve at a normal rate. If you have two services, the timer will also deplete at a normal rate.

Once you have run out of hours for that month, your deployment will be suspended until the next month, where you have to manually restart it.

**Tier Offering**

- Max to 512 MB of RAM
- Shared vCPU capacity
- Up to 1 GB of Disk (Shared between plugins)
- $5 of monthly usage
- Limited to 500 execution hours per month
  - [See how execution hours are calculated](#execution-time-limit)
- Project deploys are stood down if credit limit OR execution hour limit is reached
- Plugin connection strings are changed then hidden when usage is reached _(your data is not deleted)_
- Need to redeploy projects after the new monthly credit is applied to your account
- Max 5 members per project
- Max 3 concurrent deploys per user
-- If another deploy is attempted, Railway will remove the oldest deploy. This is intended as an anti-spam measure. If you need more concurrent deploys, please upgrade to the Developer plan.

## Developer Plan Offering

When you add a credit card or have a prepaid credit balance on your account, your account is upgraded to the Developer plan. The $5 of monthly credit no longer comes with an execution limit. You are billed for any usage above $5 on your account. The developer plan is meant for hobbyist workloads.

Developer plan projects have increased limits: limits are raised as projects approach them up to the hard cap listed here.

If a user unsubscribes or runs out of prepaid credits, the user returns to the Starter plan and the previous limits reapply.

**Tier Offering**

- Max up to 8 GB of RAM
- Max up to 8 vCPU cores
- Max 100 GB of Disk (Soft cap)
- Max 5 members per project

The Developer Plan is meant for serious hobbyist use-cases. We do urge companies to upgrade to the Teams plan for a commercial license to use Railway.

### Upgrading to the Developer Plan

To upgrade to the Developer Plan on the Usage Pay as you go Model your card must be a valid payment method.

This includes:

- Credit/Debit cards - we accept most credit cards, some exceptions include RBI, refer below

This does not include:

- Prepaid cards - examples include Visa gift cards
- Empty cards - your card must have an active balance

For those looking to Prepay their credit balance we support the following payment methods.

Credits can be bought with:

- Credit/Debit cards - we accept most credit cards
- RBI cards - you can buy credits with an RBI card
- Prepaid cards - you can buy credits with a prepaid card

Credits cannot be bought with:

- PayPal - neither PayPal balance nor linked cards on PayPal
- Cryptocurrencies - we only support fiat currencies

## Team Plan Offering

Team plan projects are designed to provide the most resources for all your scaled needs. The team plan has project usage charged in addition to the number of seats that the team pays for.

Unlike the starter and developer projects, team members within a team can access all team projects.

**Tier Offering**

- Default up to 32 GB RAM
- Default up to 32 vCPU cores
- Up to 2 TB of Disk

If you need more limits as your application scales, reach out to us within your direct support channel. We would be more than happy to bump up those limits on a case-by-case basis. Note: Companies who wish to use Railway for commercial use must be on the team plan.

## Fair Use

If we deem that projects violate the [fair use](https://railway.app/legal/fair-use) policy, Railway will shut down any violating projects.

## Execution Time Limit

**Only applies to the Starter Plan. Paid plans on Railway are exempt from this limit.**

Execution hours are how we measure how long an account has at least one deploy.

However, they are not a direct measurement of the time your app has been up. It is a separate measure of your app's compute usage.

Railway limits free accounts to 500 hours of continuous uptime. If you have a deployment live, time is consumed.

### Example Calculation

In practice, if a free-plan user has **2 services**, an API and a PostgreSQL database.

The user also has 2 environments, one for production, and one for testing.

The user starts the month with 500 execution hours.

| Days elapsed | Real world hours elapsed | Execution Hours remaining |
| ------------ | ------------------------ | ------------------------- |
| 0            | 0                        | 500                       |
| 1            | 24                       | 476                       |
| 2            | 48                       | 452                       |
| 3            | 72                       | 428                       |
| 4            | 96                       | 404                       |
| **5**        | **120**                  | **380**                   |

With that current arrangement, their app will stay up for ~21 days.

Successful and crashed deployments will continue to consume execution hours unless they are manually removed.

This is because a crashed deployment continues to occupy deployment space, even if it doesn't use any compute resources.

In order to save on execution hours, you will need to remove all running deploys and databases. Railway doesn't automatically sleep your applications.