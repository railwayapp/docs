---
title: Running a Scheduled Job
description: Learn how to run cron jobs on Railway.
---

Scheduled Jobs, or Cron Jobs, allow you to start a service on a defined schedule.

Services configured as cron jobs are expected to execute a task, and terminate as soon as that task is finished, leaving no open resources.

## Configuring a Cron Job

To configure a cron job -

1. Select a service and go to the Settings section.
2. Within "Cron Schedule", input a [crontab expression](/reference/cron-jobs#crontab-expressions).
3. Once the setting is saved, the service will run according to the cron schedule.

Find more information about cron jobs, including examples of cron expressions, in the [reference page for Cron Jobs](/reference/cron-jobs).

## Why Isn't My Cron Running as Scheduled?

An important requirement of a service that runs as a Cron, is that it terminates on completion and leaves no open resources. If the code that runs in your Cron service does not exit, subsequent executions of the Cron will be skipped.

If you see that a previous execution of your Cron service has a status of `Active`, the execution is still running and any new executions will not be run.

For more information on Service execution requirements, see the [Service Execution Requirements](/reference/cron-jobs#service-execution-requirements) section of the Cron Jobs reference.
