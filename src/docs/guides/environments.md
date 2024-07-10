---
title: Using Environments
---

Railway supports complex development workflows through environments, giving you isolated instances of all services in a project.

## Create an Environment

1. Select `+ New Environment` from the environment drop down in the top navigation. You can also go to Settings > Environments.
2. Choose which type of environment to create -

   - **Duplicate Environment** creates a copy of the selected environment, including services, variables, and configuration.

     When the duplicate environment is created, all services and their configuration will be staged for deployment.
     _You must review and approve the [staged changes](/guides/staged-changes) before the services deploy._

   - **Empty Environment** creates an empty environment with no services.

## Sync Environments

You can easily sync environments to _import_ one or more services from one environment into another environment.

1. Ensure your current environment is the one that should _receive_ the synced service(s)
2. Click `Sync` at the top of the canvas
3. Select the environment from which to sync changes
4. Upon sync, each service card that has received a change will be tagged "New", "Edited", "Removed"
5. Review the [staged changes](/guides/staged-changes) by clicking Details on the staged changes banner
6. Click "Deploy" once you are ready to apply the changes and re-deploy

<Image src="https://res.cloudinary.com/railway/image/upload/v1706310620/docs/staged-changes/canvas_kgihlb.png"
            alt="Staged changes on Railway canvas"
            layout="responsive"
            width={1108} height={770} quality={100} />

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

### Bot PR Environments

You can enable automatic PR environment creation for PRs opened by GitHub bots (Dependabot, Renovatebot) using the `Enable Bot PR Environments` toggle on the Environments tab in the Project Settings page.

<Image
  src="https://res.cloudinary.com/railway/image/upload/v1720605990/bot-pr-envs_sa3tlo.png"
  alt="Bot PR Environments toggle"
  layout="responsive"
  width={1468}
  height={439}
  quality={80}
/>

## Forked Environments

As of January 2024, forked environments have been deprecated in favor of Isolated Environments with the ability to Sync.

Any environments forked prior to this change will remain, however, you must adopt the [Sync Environments](#sync-environments) flow, in order to merge changes into your base environment.
