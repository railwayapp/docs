---
title: Environments
---

Railway environments give you an isolated instance of all databases and services in a project.
You can use them to

- Have development environments for each team member that are identical to the
  production environment
- Have separate staging and production environments

Each environment has the same services. This applies to database services, when added to the
project, an instance of that service is created for each environment.

Deploys are also scoped to a specific Railway environment. When you create a [GitHub Trigger](/deploy/integrations#github-integration) you can specify which environment to use. When you [deploy with up](/deploy/railway-up), the current environment will be used.

## Create an Environment

You can create an environment under Settings > Environments. When you create an environment, Railway provisions the same services from the `production` environment.

<Image src="https://res.cloudinary.com/railway/image/upload/v1644621886/docs/Environments.gif" 
            alt="Screenshot of Environments Page"
            layout="responsive"
            width={800} height={434} quality={100} />

## Environment Deploys

Running `railway up` with an environment selected from the CLI will create a deployment using the variables from the Environment.

## Ephemeral Environments

If you enable Pull Request [Deploys](/deploy/deployments), a temporary environment is spun up to support the Pull Request deploy. These environments are deleted as soon as these PRs are merged or closed.
