---
title: Railway Up
---

<Image src="https://res.cloudinary.com/railway/image/upload/v1631917786/docs/railway-up_h4as0c.png"
alt="Screenshot of Railway Up"
layout="intrinsic"
width={333} height={64} quality={80} />

Use the [Railway CLI](/develop/cli) to deploy your project from the
command line. In a [connected project](/develop/cli#connect) run

```bash
railway up
```

The current directory will be deployed to the currently selected Railway project
and environment. If there is only one service in the project, `up` will deploy to that target.
Run [`railway status`](/reference/cli-api#status) or run `up` with `-v` or `--verbose` to see
which project and environment will be used.

If there is more than one service within a project, the CLI will prompt you which service to deploy to.

All deployments will appear within the service on your project canvas.
Clicking on the build will bring up the build and deploy logs. Each deploy gets
a unique URL and is considered immutable.

## Port Variable

If you are starting a server, you need to use the `PORT` environment variable.
This is how Railway can expose your deployment. If you see a "Bad Gateway"
error, you most likely are not listening on `PORT`.
