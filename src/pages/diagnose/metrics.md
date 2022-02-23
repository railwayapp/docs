---
title: Metrics
---

<Image src="https://res.cloudinary.com/railway/image/upload/v1645223702/docs/metrics_angr0b.png"
alt="Screenshot of Metrics Page"
layout="intrinsic"
width={1576} height={1100} quality={80} />

Railway allows you to see resource usage information related to your deployments within a service.

We provide the following graphs that provide insight into your application's load to help you diagnose application performance.

- CPU
- Memory
- Disk Usage
- Network

When you view your project's metrics, we show you the graphs tied to the selected environment in your service's metrics tab.

We currently keep 7 days worth of metrics data.

### Deployment Information

<Image src="https://res.cloudinary.com/railway/image/upload/v1645223703/docs/usage-commit_fkvbqj.png"
alt="Screenshot of Metric Timeseries Commit Information"
layout="responsive"
width={904} height={726} quality={80} />

Your project maintains a continuous timeseries for all your deployments within a service, not just the latest one. Deployments appear on the graph so you can see which commit may have caused a spike in resources.
