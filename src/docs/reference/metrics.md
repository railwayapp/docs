---
title: Metrics
description: Discover resource usage for your services on Railway via the Metrics tab.
---

Railway provides resource usage information on deployments within a service, which can be used to diagnose issues with a project's performance.

## How it Works

For each service, Railway captures metric data. These metrics are then made available in graphs within a service's panel, under the metrics tab.

## Metrics with multiple replicas

When a service runs multiple replicas, you can view metrics in two ways: **Sum** or **Replica**.

_Note: Public network traffic metrics are only available in the Sum view._

### Sum view

![Viewing the sum of all replica metrics](https://res.cloudinary.com/railway/image/upload/v1758559063/docs/metrics-sum_tvdwlc.png)

In **Sum** view, metrics from all replicas are combined. For example, if you have two replicas using 100 MB of memory each, the metrics tab will show 200 MB.

### Replica view

![Viewing metrics of individual replicas](https://res.cloudinary.com/railway/image/upload/v1758559063/docs/metrics-per-replica_skc17b.png)

In **Replica** view, you can see metrics for each replica individually. This is useful for diagnosing issues with specific replicas or spotting if some regions are under- over overutilized.

The total from all replicas may differ slightly from the Sum view due to rounding or overlapping instances during zero-downtime deployments.

## Provided Metrics

The following metrics are provided:

- CPU
- Memory
- Disk Usage
- Network

## Viewing Metrics

For information on how to view and read metrics, visit [this guide](/guides/metrics).
