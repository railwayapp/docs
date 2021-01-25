---
title: Environments
---

Railway environments give you an isolated instance of all plugins in a project.
You can use them to

- Have development environments for each team member that are identical to the
  production environment
- Have separate staging and production environments

Each environment has the same plugins. When a new plugin is added to the
project, an instance of that plugin is created for each environment.

Deploys are also scoped to a specific Railway environment. When you create a [GitHub Trigger](/deployment/github-triggers) you can specify which environment to use. When you [deploy with up](/deployment/up), the current environment will be used.

## Variables

Project variables are provided whenever you build, deploy, or run `railway run`.
Together these variables form your Railway environment. Each
plugin provides the necessary environment variables needed to use it (such as
`DATABASE_URL` for the PG plugin). You can also specify custom variables on the
project variables page.

![](https://railway.app/api/asset?assetUrl=https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F8ff4bcd0-3185-4be7-bae8-0126b2f29487%2Fvariables.png&blockId=94bf3b6f-7c7a-44b2-bb3c-9592788566c9)

You can view all variables for the current environment with `railway env` and change the environment with `railway environment`.
