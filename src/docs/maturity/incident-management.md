---
title: Incident Management
description: Learn how Railway handles incident management.
---

## Introduction

Railway understands the importance of effective incident management procedures. We do what we can to minimize downtime, mitigate the impact of incidents, and ensure the smooth operation of our systems. In the interest of transparency, we publish as much of our procedure to keep our customers in the know on how we handle and learn from incidents.

## Monitoring + Reporting

Railway has a robust monitoring system in place to proactively detect and address any potential incidents. We continuously monitor our infrastructure, including servers, networks, and applications, to ensure their smooth operation. By monitoring key metrics and performance indicators, we can identify any anomalies or potential issues before they escalate into full-blown incidents.

However, it's important to note that while we strive to stay ahead of incidents, there may be situations where unforeseen issues arise. In such cases, we rely on qualitative customer feedback to help us identify and address any issues promptly. We encourage our customers to report any problems they encounter through our [Central Station](https://station.railway.com), [Slack](/reference/support#slack), or [Discord](https://discord.gg/railway).

## Status Page + Uptime

Railway's uptime and incident retrospective can be accessed on the Railway Instatus page at https://railway.instatus.com/. On this page, you can view the historical uptime of Railway's systems and services. Additionally, you can find detailed information about past incidents, including retrospectives that provide insights into how incidents were handled and what measures were taken to prevent similar issues in the future.

For Enterprise customers, we offer SLOs and guarantees of service that may not be represented on the uptime dashboard.

## Incident Severity

Railway catalogues incident's in the following buckets.

- **High**: the incident is potentially catastrophic to Railway Corporation and/or disrupts
  Railway Corporation’s day-to-day operations; violation of contractual requirements is likely. Ex. Any business level impact to 25 percent of our customers for one hour or more. All incidents within this severity get public communications.
- **Medium**: the incident will cause harm to one or more business units within Railway
  Corporation and/or will cause delays to a customer business unit’s activities.
- **Low**: the incident is a clear failure of a component, but will not substantively impact the business. Railway still performs retrospectives within this severity.

### Responsible Disclosure

Enterprise customers get Root Cause Analysis, and we attempt to publish event retrospectives on [https://blog.railway.com/engineering](https://blog.railway.com/engineering)
