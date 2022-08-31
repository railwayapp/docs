---
title: Templates
---

Templates allow you to deploy a fully configured project that is automatically
connected to infrastructure. Examples of templates are:

- NextJS app with Prisma
- Django app connected to Postgres
- Elixir Phoenix webserver
- Discord/Telegram bots

You can find featured templates on our
[dedicated templates page](https://railway.app/templates).

## Updating Templates

Every time you visit your project on Railway, we will check to see if the project it is based on has been updated by its maker.

If it has, we will prompt you to update your project. On confirmation, we will create a branch on Github and open a PR environment for you on Railway. This way, we don’t replace your production environment and you can test things out within the PR deploy.

Once you’re happy with the changes, you can merge the PR and your production deployment will be updated to the latest version.

## Creating Templates

The button allows you to create templates to offer a 1-Click deploy on Railway experience. Services within a template can point to any public repository.

<Image src="https://res.cloudinary.com/railway/image/upload/v1656470421/docs/template-editor_khw8n6.png"
alt="Screenshot of Template Editor"
layout="intrinsic"
width={609} height={520} quality={80} />

![Railway Button](https://railway.app/button.svg)

Configure your own button at
[railway.app/button](https://railway.app/button) where you can define the repo
to deploy, plugins to install, and required env vars.

### Managing Templates

<Image src="https://res.cloudinary.com/railway/image/upload/v1656470419/docs/template-manager_ki6byi.png"
alt="Screenshot of Expanded Project Usage Pane"
layout="intrinsic"
width={973} height={562} quality={80} />

You can see all of your templates that you created within your [Account's Templates page](https://railway.app/account/templates). You can edit your Template at any time.

## Deploy a Stable Version

Upon successful deployment of any service within a project linked to a template, we create a version of that service that contains the `commitSha` of the commit and the title of that commit that was deployed as the content.

This version becomes selectable within the template deploy UI for users to choose. If users need to use an older or experimental version of your template deployed? A dropdown is present giving your users control on what version to deploy. Users can choose between the last stable version of the template or experiment by deploying the latest version.
