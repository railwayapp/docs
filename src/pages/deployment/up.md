---
title: Railway Up
---

Use the [Railway CLI](/cli/quick-start) to deploy your project from the
command line. In a [connected project](/cli/quick-start#connect) run

```bash
railway up
```

The current directory will be deployed to the currently selected Railway project
and environment. Run [`railway status`](/cli/api-reference#status) to see
which project and environment will be used.

All deployments will appear in the deployments view on your project dashboard.
Clicking on the build will bring up the build and deploy logs. Each deploy gets
a unique URL and is considered immutable.

## Port Variable

If you are starting a server, you need to use the `PORT` environment variable.
This is how Railway can expose your deployment. If you see a "Bad Gateway"
error, you most likely are not listening on `PORT`.

## Singleton Deploys

If you only ever want a single deployment per environment live at a time, you
can toggle the singleton deploy flag in your project deployment settings. When a
new **successful** deploy goes live, we will spin down all older deploys that
are connected to that environment.

This is a useful setting for bots. If a new version of the bot is deployed, you
want older bots to be taken offline so you don't get duplicated messages.
