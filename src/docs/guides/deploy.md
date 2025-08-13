---
title: Deploy a Template
description: Learn how to deploy Railway templates.
---

Templates allow you to deploy a fully configured project that is automatically
connected to infrastructure.

You can find featured templates on our <a href="https://railway.com/templates" target="_blank">template marketplace</a>.

## Template Deployment Flow

To deploy a template -

- Find a template from the marketplace and click `Deploy Now`
- If necessary, configure the required variables, and click `Deploy`
- Upon deploy, you will be taken to your new project containing the template service(s)
  - Services are deployed directly from the defined source in the template configuration
  - After deploy, you can find the service source by going to the service's settings tab
  - Should you need to make changes to the source code, you will need to [eject from the template repo](#eject-from-template-repository) to create your own copy. See next section for more detail.

_Note: You can also deploy templates into existing projects, by clicking `+ New` from your project canvas and selecting `Template`._

## Eject from Template Repository

<Banner variant="info">
As of March 2024, the default behavior for deploying templates, is to attach to and deploy directly from the template repository.  Therefore, you will not automatically get a copy of the repository on deploy.  Follow the steps below to create a repository for yourself.
</Banner>

By default, services deployed from a template are attached to and deployed directly from the template repository. In some cases, you may want to have your own copy of the template repository.

Follow these steps to eject from the template repository and create a mirror in your own GitHub account.

1. In the [service settings](/overview/the-basics#service-settings), under Source, find the **Upstream Repo** setting
2. Click the `Eject` button
3. Select the appropriate GitHub organization to create the new repository
4. Click `Eject service`

## Updatable Templates

When you deploy any services from a template based on a GitHub repo, every time you visit the project in Railway, we will check to see if the project it is based on has been updated by its creator.

If it has received an upstream update, we will create a branch on the GitHub repo that was created when deploying the template, allowing for you to test it out within a PR deploy.

If you are happy with the changes, you can merge the pull request, and we will automatically deploy it to your production environment.

If you're curious, you can read more about how we built updatable templates in this <a href="https://blog.railway.com/p/updatable-starters" target="_blank">blog post</a>

_Note: This feature only works for services based on GitHub repositories. At this time, we do not have a mechanism to check for updates to Docker images from which services may be sourced._
