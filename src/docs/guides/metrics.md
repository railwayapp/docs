---
title: Viewing Metrics
description: Discover resource usage for your services on Railway via the Metrics tab.
---

Railway provides resource usage information on deployments within a service which can be used to diagnose issues with a project's performance.

## Accessing Service Metrics

Access a service's metrics by clicking on a service in the project canvas, and going to the "Metrics" tab.

<Image src="https://res.cloudinary.com/railway/image/upload/v1645223702/docs/metrics_angr0b.png"
alt="Screenshot of Metrics Page"
layout="intrinsic"
width={1576} height={1100} quality={80} />

The following metrics are provided -

- CPU
- Memory
- Disk Usage
- Network

## Understanding the Metrics Graphs

Graphs include dotted lines to indicate when new deployments began. Up to 30 days of data is available for each project.

<Image src="https://res.cloudinary.com/railway/image/upload/v1645223703/docs/usage-commit_fkvbqj.png"
alt="Screenshot of Metric Timeseries Commit Information"
layout="responsive"
width={904} height={726} quality={80} />

Projects maintain a continuous time-series for all deployments within a service, not just the latest one. Deployments appear on the graph so users can see which commit may have caused a spike in resources.

For services with multiple replicas, the metrics from all replicas are summed up and displayed in the metrics tab, for example, if you have 2 replicas, each using 100 MB of memory, the memory usage displayed in the metrics tab will be 200 MB.
