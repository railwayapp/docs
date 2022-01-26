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

Deploys are also scoped to a specific Railway environment. When you create a [GitHub Trigger](/deploy/integrations#github-integration) you can specify which environment to use. When you [deploy with up](/deploy/railway-up), the current environment will be used.

## Create an Environment

You can create an environment under Settings > Environments. When you create an environment, Railway provisions another copy of existing plugins from the `production` environment.

<NextImage  src="https://res.cloudinary.com/railway/image/upload/v1631917785/docs/create-env_hrgfme.png" 
            alt="Screenshot of Environments Page"
            layout="responsive"
            width={1082} 
            height={733}
            quality={80} />

## Environment Deploys

Running `railway up` with an environment selected from the CLI will create a deploy using the variables from the Environment.

## Ephemeral Environments

If you enable Pull Request [Deploys](/deploy/deployments), a temporary environment is spun up to support the Pull Request deploy. These environments are deleted as soon as these PRs are merged or closed.
