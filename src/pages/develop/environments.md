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

<NextImage  src="/images/variables.png" 
            alt="Screenshot of Project Variables on Railway Dashboard"
            layout="responsive"
            width={1205} 
            height={901}
            quality={100} />


You can view all variables for the current environment with `railway vars` and change the environment with `railway environment`.
