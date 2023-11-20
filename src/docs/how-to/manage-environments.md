---
title: Manage Environments
---

Railway supports complex development workflows through environments, giving you isolated instances of all databases and services in a project.

## Create an Environment

Create an environment under Settings > Environments.

When you create an environment, Railway will provision the same services in the new environment as the `production` environment.

<Image src="https://res.cloudinary.com/railway/image/upload/v1644621886/docs/Environments.gif"
            alt="Screenshot of Environments Page"
            layout="responsive"
            width={800} height={434} quality={100} />

## Enable PR Environments

Railway can spin up a temporary environment whenever you open a Pull Request.  To enable PR environments, go to your Project Settings -> Environments tab.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1699568846/docs/enablePrEnv_f5n2hx.png"
alt="Screenshot of Deploy Options"
layout="responsive"
width={480} height={156} quality={80} />

When enabled, a temporary environment is spun up to support the Pull Request deploy. These environments are deleted as soon as these PRs are merged or closed.

### How come my GitHub PR won't deploy?

Railway will not deploy a PR branch from a user who is not in your team or invited to your project without their associated GitHub account.

## Forking and merging environments

Environments in Railway can be forked and merged.  Changes in a forked environment are not propagated automatically to the parent environment or any other environment.

### Fork an environment

Fork an environment from the environment selector dropdown in the navigation bar.  Alternatively you can fork an environment in the Environments section in the project settings.

### Merge changes from a forked environment

In Railway's UI you'll see a dock widget at the bottom of the project canvas when a forked environment is active. 

<Image src="https://res.cloudinary.com/railway/image/upload/v1690454775/environment-dock_niocez.png"
            alt="Screenshot of Merge Widget"
            layout="intrinsic"
            width={210 } height={45} quality={100} />

Clicking on it will reveal a side panel with a list of changesets made into the active environment that haven't been propagated yet to the parent environment. 

<Image src="https://res.cloudinary.com/railway/image/upload/v1690455300/environment-merge_ktyx7a.png"
            alt="Screenshot of Merge Panel"
            layout="responsive"
            width={429} height={439} quality={100} />

Select which changes you want to propagate to the parent environment and click `Merge` to apply the changes.  Note that you can override values if you do not want to apply them to the parent environment.

At this moment only changes in environment variables can be merged, but we are working on adding support for any other changes made to a service.