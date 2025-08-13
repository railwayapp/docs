---
title: Cron Jobs
description: Learn how to run cron jobs on Railway.
---

Cron Jobs allow you to start a service based on a crontab expression.

## How it Works

Railway will look for a defined cron schedule in your service settings, and execute the start command for that service on the given schedule. The service is expected to execute a task, and exit as soon as that task is finished, not leaving any resources open, such as database connections. More on [execution requirements](/reference/cron-jobs#service-execution-requirements) below.

#### Scheduling Libraries

If you are already using a scheduling library or system in your service such as [node-cron](https://www.npmjs.com/package/node-cron) or [Quartz](http://www.quartz-scheduler.org/), Railway cron jobs are a substitute of them that allows you to save resources between executions.

## Service Execution Requirements

Scheduled services should exit as soon as they are done with the task they are responsible to perform. Thus, the process should close any connections, such as database connections, to exit properly.

Currently, Railway does not automatically terminate deployments. As a result, if a previous execution is still running when the next scheduled execution is due, Railway will skip the new cron job.

## Crontab Expressions

A crontab expression is a scheduling format used in Unix-like operating systems to specify when and how often a command or script should be executed automatically.

Crontab expressions consists of five fields separated by spaces, representing different units of time. These fields specify the minute, hour, day of the month, month, and day of the week when the command should be executed.

```
* * * * *
│ │ │ │ │
│ │ │ │ └─────────── Day of the week (0 - 6)
│ │ │ └───────────── Month (1 - 12)
│ │ └─────────────── Day of the month (1 - 31)
│ └───────────────── Hour (0 - 23)
└─────────────────── Minute (0 - 59)
```

The values of these fields can be an asterisk `*`, a list of values separated by commas, a range of values (using `-`), step values (using `/`) or an integer value.

#### Field Definitions

- **Minute (0-59)**: Represents the minute of the hour when the command should be executed. An asterisk (`*`) denotes any value, meaning the command will be executed every minute, or you can specify a specific minute value (e.g., 0, 15, 30).

- **Hour (0-23)**: Represents the hour of the day when the command should be executed. You can specify a specific hour value (e.g., 0, 6, 12), or use an asterisk (`*`) to indicate any hour.

- **Day of the month (1-31)**: Represents the day of the month when the command should be executed. You can specify a specific day value (e.g., 1, 15, 31), or use an asterisk (`*`) to indicate any day.

- **Month (1-12)**: Represents the month when the command should be executed. You can specify a specific month value (e.g., 1, 6, 12), or use an asterisk (`*`) to indicate any month.

- **Day of the week (0-7, where both 0 and 7 represent Sunday)**: Represents the day of the week when the command should be executed. You can specify a specific day value (e.g., 0-Sunday, 1-Monday, etc.), or use an asterisk (`*`) to indicate any day of the week.

Note that schedules are based on UTC (Coordinated Universal Time).

## Frequency

The shortest time between successive executions of a cron job cannot be less than 5 minutes.

## Examples

- Run a command every hour at the 30th minute: `30 * * * *`

- Run a command every day at 3:15 PM: `15 15 * * *`

- Run a command every Monday at 8:00 AM: `0 8 * * 1`

- Run a command every month on the 1st day at 12:00 AM: `0 0 1 * *`

- Run a command every Sunday at 2:30 PM in January: `30 14 * 1 0`

- Run a command every weekday (Monday to Friday) at 9:30 AM: `30 9 * * 1-5`

- Run a command every 15 minutes: `*/15 * * * *`

- Run a command every 2 hours: `0 */2 * * *`

- Run a command every 2nd day of the month at 6:00 AM: `0 6 2 * *`

## FAQ

### When to use Railway's cron jobs?

- For short-lived tasks that complete quickly and exit properly, such as a daily database backup.
- When you want to save resources between task executions, as opposed to having an in-code scheduler run 24/7.

### When not to use Railway's cron jobs?

- For long-running processes that don't exit, such as a web server or discord bot.
- When you need more frequent execution than every 5 minutes.
- When you need absolute time precision. Railway does not guarantee execution times to the minute as they can vary by a few minutes.

### What time zone is used for cron jobs?

Cron jobs are scheduled based on UTC (Coordinated Universal Time).

You will need to account for timezone offsets when setting your cron schedule.

## Support

For information on how to configure cron jobs, refer to [this guide](/guides/cron-jobs).
