---
title: Cron Jobs
---

Cron Jobs allow you to start a service based on a crontab expression. This means the service is expected to execute a task, and terminate as soon as that task is finished. Make sure the service doesn't leave any resources open, such as database connections, because otherwise the service won't terminate and Railway wont't start it again until the previous execution has finished.

If you are already using a scheduling library or system in your service such as [node-cron](https://www.npmjs.com/package/node-cron) or [Quartz](http://www.quartz-scheduler.org/), Railway cron jobs are a substitute of them that allows you to save resources between executions.

## Crontab expressions

A crontab expression is a scheduling format used in Unix-like operating systems to specify when and how often a command or script should be executed automatically. It consists of five fields separated by spaces, representing different units of time. These fields specify the minute, hour, day of the month, month, and day of the week when the command should be executed.

We use the same format for scheduling redeploys in Railway.

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

Let's break down each field:

- Minute (0-59): Represents the minute of the hour when the command should be executed. An asterisk (`*`) denotes any value, meaning the command will be executed every minute, or you can specify a specific minute value (e.g., 0, 15, 30).

- Hour (0-23): Represents the hour of the day when the command should be executed. You can specify a specific hour value (e.g., 0, 6, 12), or use an asterisk (`*`) to indicate any hour.

- Day of the month (1-31): Represents the day of the month when the command should be executed. You can specify a specific day value (e.g., 1, 15, 31), or use an asterisk (`*`) to indicate any day.

- Month (1-12): Represents the month when the command should be executed. You can specify a specific month value (e.g., 1, 6, 12), or use an asterisk (`*`) to indicate any month.

- Day of the week (0-7, where both 0 and 7 represent Sunday): Represents the day of the week when the command should be executed. You can specify a specific day value (e.g., 0-Sunday, 1-Monday, etc.), or use an asterisk (`*`) to indicate any day of the week.

Note that schedules are based on UTC (Coordinated Universal Time).

## Frequency

The shortest time between successive executions of a cron job cannot be less than 15 minutes.

## Examples

- Run a command every hour at the 30th minute:

  `30 * * * *`

- Run a command every day at 3:15 PM:

  `15 15 * * *`

- Run a command every Monday at 8:00 AM:

  `0 8 * * 1`

- Run a command every month on the 1st day at 12:00 AM:

  `0 0 1 * *`

- Run a command every Sunday at 2:30 PM in January:

  `30 14 * 1 0`

- Run a command every weekday (Monday to Friday) at 9:30 AM:

  `30 9 * * 1-5`

- Run a command every 15 minutes:

  `*/15 * * * *`

- Run a command every 2 hours:

  `0 */2 * * *`

- Run a command every 2nd day of the month at 6:00 AM:

  `0 6 2 * *`

## Service execution

Scheduled services should exit as soon as they are done with the task they are responsible to perform. Thus, the process should close any connections, such as database connections, to exit properly.

At this moment, Railway won't terminate your process in any scenario. However, cron jobs may be skipped if the service is in the build/deploy stage when the next scheduled execution happens.
