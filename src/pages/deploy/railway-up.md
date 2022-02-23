---
title: Railway Up
---

<Image src="https://res.cloudinary.com/railway/image/upload/v1645147674/docs/railwayup_q2mqwx.gif"
alt="Screenshot of Railway Up"
layout="intrinsic"
width={800} height={364} quality={80} />

Use the [Railway CLI](/develop/cli) to kickoff a deploy within a service in a project from the
command line. In a [connected project](/develop/cli#connect) run

```bash
railway up
```

The current directory will be deployed to the currently selected Railway project
and environment. If there is only one service in the project, `up` will deploy to that target.
Run [`railway status`](/reference/cli-api#status) to see
which project and environment will be used.

If there is more than one service within a project, the CLI will prompt you which service to [deploy](/deploy/deployments) to.

All deployments will appear within the service on your project canvas.
Clicking on the build will bring up the build and deploy logs. Each deploy gets
a unique URL and is considered immutable.

## Up Behavior

If pointed to a GitHub service, the `up` deploy build will replace the active deploy with the `up` service. When an empty service is selected within the deployment prompt, the empty service will become a CLI service.

## Port Variable

If you are starting a server, you need to use the `PORT` environment variable.
This is how Railway can expose your deployment. If you see a "Bad Gateway"
error, you most likely are not listening on `PORT`.
