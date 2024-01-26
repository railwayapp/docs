---
title: Using Environments
---

Railway supports complex development workflows through environments, giving you isolated instances of all services in a project.

## Create an Environment

1. Select `+ New Environment` from the environment drop down in the top navigation.  You can also go to Settings > Environments.
2. Choose which type of environment to create -
    - **Duplicate Environment** creates a copy of the selected environment, including services, variables, and configuration.  
        
        When the duplicate environment is created, all services and their configuration will be staged for deployment.
        *You must review and approve the [staged changes](#staged-changes) before the services deploy.*

    - **Empty Environment** creates an empty environment with no services.

## Staged Changes

When you make a change to a service or volume, that change will be staged.

1. The number of staged changes will be displayed in a banner in the top left corner of the canvas
2. Staged changes will appear as purple in the UI
3. Each service card that has received a change will be tagged "Edited"

<Image src="https://res.cloudinary.com/railway/image/upload/v1702077687/docs/staged-changes/wl1qxxj8mpbej70i042r.png"
            alt="Staged changes on Railway canvas"
            layout="responsive"
            width={1423} height={826} quality={100} />

### Review and Deploy Changes

To review the staged changes, click the "Details" button in the banner.  Here, you will see a diff of old and new values.  You can discard a change by clicking the "x" to the right of the change.

You can optionally add a commit message that will appear in the [activity feed](/guides/projects#viewing-recent-activity).
 
<Image src="https://res.cloudinary.com/railway/image/upload/v1702078631/docs/staged-changes/a9xic5xjerg0t6ksogzh.png"
            alt="Staged changes on Railway canvas"
            layout="responsive"
            width={1108} height={841} quality={100} />

Clicking "Deploy" will deploy all of the changes at once. Any services that are affected will be redeployed.

## Sync Environments

You can easily sync environments to _import_ one or more services from one environment into another environment.

1. Ensure your current environment is the one that should *receive* the synced service(s)
2. Click `Sync` at the top of the canvas
3. Select the environment from which to sync changes
4. Review the staged changes to keep or discard the desired services and configuration
5. Click "Deploy" once you are ready to apply the changes and re-deploy

### Caveats

- Networking changes are not yet staged and are applied immediately.
- Adding databases or templates will only affect the current environment. However, they do not yet create a commit in the history.
- When staged changes are enabled, forking environments is disabled. Staging changes is our long-term vision for environments which will incorporate the best parts of forking environments. However, at the moment the two features are incompatible.

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

## Forked Environments

As of January 2024, Forked environments have been deprecated in favor of Isolated Environments with the ability to Sync.

If you still have a forked environment, it will remain in your project until you merge it.
