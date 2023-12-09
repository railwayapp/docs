---
title: Using Environments
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

Railway can spin up a temporary environment whenever you open a Pull Request. To enable PR environments, go to your Project Settings -> Environments tab.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1699568846/docs/enablePrEnv_f5n2hx.png"
alt="Screenshot of Deploy Options"
layout="responsive"
width={480} height={156} quality={80} />

When enabled, a temporary environment is spun up to support the Pull Request deploy. These environments are deleted as soon as these PRs are merged or closed.

### How come my GitHub PR won't deploy?

Railway will not deploy a PR branch from a user who is not in your team or invited to your project without their associated GitHub account.

## Forking and merging environments

Environments in Railway can be forked and merged. Changes in a forked environment are not propagated automatically to the parent environment or any other environment.

### Fork an environment

Fork an environment from the environment selector dropdown in the navigation bar. Alternatively you can fork an environment in the Environments section in the project settings.

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

Select which changes you want to propagate to the parent environment and click `Merge` to apply the changes. Note that you can override values if you do not want to apply them to the parent environment.

At this moment only changes in environment variables can be merged, but we are working on adding support for any other changes made to a service.

## Staged Changes

<PriorityBoardingBanner />

Staged changes is a feature that touches many parts of the Railway dashboard. At its core, it allows you to group multiple changes together and deploy them all at once. Other changes include

- A updated settings page for both services and volumes
- All changes are now scoped to an environment
- A new activity feed that shows all the changes made

You can enable staged changes for your account on the [feature flags](https://railway.app/account/feature-flags) page.

### Making changes

When you make a change to a service or volume, that change will be staged.

1. The number of staged changes will be displayed in a banner in the top left corner of the canvas
2. Staged changes will appear as purple in the UI

<Image src="https://res.cloudinary.com/railway/image/upload/v1702077687/docs/staged-changes/wl1qxxj8mpbej70i042r.png"
            alt="Staged changes on Railway canvas"
            layout="responsive"
            width={1423} height={826} quality={100} />

You can discard the changes by opening up the 3-dot menu in the banner.

Clicking "Details" will open up a modal that shows all the changes that have been staged. You can optionally add a commit message that will appear in the activity feed.

<Image src="https://res.cloudinary.com/railway/image/upload/v1702078631/docs/staged-changes/a9xic5xjerg0t6ksogzh.png"
            alt="Staged changes on Railway canvas"
            layout="responsive"
            width={1108} height={841} quality={100} />

Clicking "Deploy" will deploy all of the changes at once. Any services that are affected will be redeployed.

### Isolated environments

When staged changes are enabled, all changes are scoped to an environment. This means that you can make changes to an environment without affecting other environments.

### Activity feed

The activity feed shows all the changes that have been made to a project. This includes changes to services and volumes. You can click on a change to see everything that was committed.

<Image src="https://res.cloudinary.com/railway/image/upload/v1702078916/docs/staged-changes/t16znkj2e7v88j5h4lb3.png"
            alt="Commit activity feed"
            layout="responsive"
            width={1273} height={777} quality={100} />

### Bringing in services from other environments

Since adding new volumes and services is now scoped to the current environment, you may want to _import_ a service added from another environment. To do this you can open up the new service menu. Any service that is not currently in the current environment will appear at the top of the list. When selected you can choose if you want to import the configuration from another environment, or start from scratch.

<Image src="https://res.cloudinary.com/railway/image/upload/v1702078916/docs/staged-changes/itar4aqayjwhqcfns7lk.png"
            alt="Importing service from another environment"
            layout="responsive"
            width={736} height={522} quality={100} />

### Caveats

- Networking changes are not yet staged and are applied immediately.
- Adding databases or templates will only affect the current environment. However, they do not yet create a commit in the history.
- When staged changes are enabled, forking environments is disabled. Staging changes is our long-term vision for environments which will incorporate the best parts of forking environments. However, at the moment the two features are incompatible.

### Feedback

Staged changes is big change to the Railway dashboard. We'd love to hear your [feedback on the feature](https://community.railway.app).
