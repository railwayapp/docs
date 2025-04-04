---
title: Metrics
description: Discover resource usage for your services on Railway via the Metrics tab.
---

Railway provides resource usage information on deployments within a service, which can be used to diagnose issues with a project's performance.

## How it Works

For each service, Railway captures metric data. These metrics are then made available in graphs within a service's panel, under the metrics tab.

## How it works - with multiple replicas

When a service has multiple replicas, the metrics from all replicas are summed up and displayed in the metrics tab, for example, if you have 2 replicas, each using 100 MB of memory, the memory usage displayed in the metrics tab will be 200 MB.

## Provided Metrics

The following metrics are provided:

- CPU
- Memory
- Disk Usage
- Network

## Viewing Metrics

For information on how to view and read metrics, visit [this guide](/guides/metrics).
