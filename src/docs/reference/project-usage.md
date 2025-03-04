---
title: Project Usage
description: Learn how users can see the resource usage of their projects.
---

Users are billed monthly based on their project's per-minute usage. All services within a project's environments contribute to the resources billed. The rates are as follows:

1. **RAM** → $0.000231 / GB / minute
2. **CPU** → $0.000463 / vCPU / minute
3. **Network Egress** → $0.000000047683716 / KB (effective March 3rd, 2025)
   - Previous rate: $0.000000095367432 / KB until March 2nd, 2025
4. **Volume Storage** → $0.000003472222222 / GB / minute (effective March 3rd, 2025)
   - Previous rate: $0.000005787037037 / GB / minute until March 2nd, 2025

> **Note:** Effective March 3rd, 2025, Railway has reduced the pricing for Network Egress from $0.10/GB to $0.05/GB and Volume Storage from $0.25/GB to $0.15/GB.

Users can see the usage of their projects under <a href="https://railway.com/account/usage" target="_blank">the usage page</a>.

<Image src="https://res.cloudinary.com/railway/image/upload/v1631917786/docs/project-usage_gd43fq.png"
alt="Screenshot of Expanded Project Usage Pane"
layout="intrinsic"
width={491} height={286} quality={80} />

### Billing Period Usage

This section outlines the current usage within a billing period, as well as any discounts and credits the user has applied to their account.

In addition to the current usage, the user can see their estimated resource usage for the current billing period.

### Usage by Project

The chart shows the cumulative usage for the billing period. If you delete a project, Railway will still count the usage towards your total.

The Current and Estimated cost metrics show the current resource usage and the estimated usage by the end of the billing period.
