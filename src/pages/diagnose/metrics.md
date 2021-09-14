---
title: Metrics
---

<NextImage src="/images/metrics.png"
alt="Screenshot of Metrics Page"
layout="intrinsic"
width={440} height={405} quality={80} />

Railway allows you to see system information related to your deployments. 

We provide the following graphs that provide insight into your application's load to help you diagnose application performance.

- CPU
- Memory
- Disk Usage
- Network

When you view your project's metrics, we show you the graphs tied to the selected environment in your Project dashboard. 

We currently keep 7 days worth of metrics data. 

### Deployment Information

<NextImage src="/images/commit-metrics.png"
alt="Screenshot of Metric Timeseries Page"
layout="responsive"
width={864} height={345} quality={80} />

Your project maintains a continuous timeseries for all your deployments, not just the latest one. Deployments appear on the graph so you can see which commit may have caused a spike in resources.

## Plugin Metrics

In addition to metrics on your Project, we provide usage information about your plugins tied to your Project if you have any provisioned. You will see them below your application's metrics. 