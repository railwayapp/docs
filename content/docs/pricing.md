---
title: Pricing
description: Learn how Railway's pricing works - usage-based pricing with plans designed to scale with your needs.
---

Railway uses a transparent pricing model: you pay a base subscription fee plus the resources you actually consume.

## How it works

Railway's pricing has two components:

| Component | Description |
| --- | --- |
| **Subscription** | A flat monthly fee based on your plan tier |
| **Resource Usage** | Pay only for the CPU, memory, storage, and egress you actually use |

Your subscription fee goes toward your resource usage - if you're on the Hobby plan at $5/month and use $3 in resources, you just pay the $5 subscription. If you use $8 in resources, you pay $8 total.

## Plans at a glance

| Plan | Price | Best For |
| --- | --- | --- |
| **Free** | $0/mo | Experimentation with $1 of free resources |
| **Hobby** | $5/mo | Personal projects and side hustles |
| **Pro** | $20/mo | Production apps and teams |
| **Enterprise** | Custom | Compliance, SLAs, and dedicated support |

All paid plans include generous resource allowances, with the subscription fee counting toward your usage.

## Resource pricing

| Resource | Price |
| --- | --- |
| **RAM** | $10 / GB / month |
| **CPU** | $20 / vCPU / month |
| **Network Egress** | $0.05 / GB |
| **Volume Storage** | $0.15 / GB / month |

You're billed by the minute for compute resources, so you only pay for what you use.

## Railway Agent

The [Railway Agent](/ai/railway-agent) is billed separately, based on the LLM tokens it uses on your behalf.

We pass through the exact cost of the underlying models with no markup. Pricing is based on input and output tokens, priced per the model used for each step:

| Model | Used for |
| --- | --- |
| **Claude Opus 4.6** | Complex reasoning, multi-step diagnosis, code changes |
| **Claude Sonnet 4.6** | Most general agent tasks |
| **Claude Haiku 4.5** | Lightweight lookups and quick actions |

The agent routes each request to the smallest model that can handle it, so costs stay proportional to the difficulty of the task. Total agent usage appears as a separate line item on your invoice.

Agent usage draws from the same included credit as the rest of your plan — the $5 on Hobby and $20 on Pro that already covers your compute also covers your agent usage. You're only charged beyond that once your combined compute and agent spend exceeds what your subscription includes.

Per-token rates for each model are published on Anthropic's pricing page: <a href="https://www.anthropic.com/pricing" target="_blank">anthropic.com/pricing</a>.

## Learn more

- [Plans](/pricing/plans) - Detailed breakdown of each plan's features and limits
- [Free Trial](/pricing/free-trial) - Get started with $5 in free credits
- [FAQs](/pricing/faqs) - Common questions about billing and usage
- [Cost Control](/pricing/cost-control) - Tools and tips to manage your spending

Ready to see the full pricing details? Visit <a href="https://railway.com/pricing" target="_blank">railway.com/pricing</a>.
