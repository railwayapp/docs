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

You can create an environment under Settings > Environments. When you create an environment, Railway will provision the same services in the new environment as the `production` environment.

<Image src="https://res.cloudinary.com/railway/image/upload/v1644621886/docs/Environments.gif"
            alt="Screenshot of Environments Page"
            layout="responsive"
            width={800} height={434} quality={100} />

## Environment Deploys

Running `railway up` with an environment selected from the CLI will create a deployment using the variables from the Environment.

## Ephemeral Environments

If you enable [Pull Request Deploys](/deploy/deployments), a temporary environment is spun up to support the Pull Request deploy. These environments are deleted as soon as these PRs are merged or closed.

## Forking and merging environments

Environments in Railway can be forked and merged. Forking an environment means that a new environment will be available to you that will recreate all the the services, plugins, and variables that the original environment had. Changes in a forked environment are not propagated automatically to the parent environment or any other environment. Instead, any change made to a forked environment will be stored in a log of changes that we call changesets that you can review at any point in time.

You can fork an environment from the environment selector dropdown in the navigation bar, which will fork the active environment. Alternatively you can fork an environment in the Environments section in the project settings.

In Railway's UI you'll see a little dock widget at the bottom of the project canvas when a forked environment is active. By clicking on it a side panel will open and will show you the list of changesets made into the active environment that haven't been propagated yet to the parent environment. In this side panel you can select which changes you want to propagate to the parent environment.

<Image src="https://res.cloudinary.com/railway/image/upload/v1690454775/environment-dock_niocez.png"
            alt="Screenshot of Merge Widget"
            layout="intrinsic"
            width={210 } height={45} quality={100} />

Once you've selected which changes you want to propagate, just clicking the merge button will apply the changes to the parent environment. During the review you can even override some values. This is useful if for example you start using an external service and you need a new environment variable to store an API key, but this API key is different for each environment.

<Image src="https://res.cloudinary.com/railway/image/upload/v1690455300/environment-merge_ktyx7a.png"
            alt="Screenshot of Merge Panel"
            layout="responsive"
            width={429} height={439} quality={100} />

At this moment only changes in environment variables can be merged, but we are working on adding support for any other changes made to a service or plugin.
