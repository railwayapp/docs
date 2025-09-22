---
title: Viewing Metrics
description: Discover resource usage for your services on Railway via the Metrics tab.
---

Railway provides resource usage information on deployments within a service which can be used to diagnose issues with a project's performance.

## Accessing Service Metrics

Access a service's metrics by clicking on a service in the project canvas, and going to the "Metrics" tab.

<Image src="https://res.cloudinary.com/railway/image/upload/v1758559063/docs/metrics-sum_tvdwlc.png"
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

If a service has multiple replicas, you can view metrics as a combined sum or per replica. Learn more in the [Metrics Reference](/reference/metrics#metrics-with-multiple-replicas).