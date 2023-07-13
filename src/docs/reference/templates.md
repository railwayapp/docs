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

## Updatable Templates

Every time you visit a project deployed from a template, we will check to see if the project it is based on has been updated by its creator.

If it has received an upstream update, we will create a branch on the GitHub repo that was created when deploying the template, allowing for you to test it out within a PR deploy. If you are happy with the changes, you can merge the pull request, and we will automatically deploy it to your production environment.

<Banner variant="info">
If you're curious, you can read more about how we built updatable templates in this <Link href="https://blog.railway.app/p/updatable-starters">blog post</Link>.
</Banner>

## Creating a Template

The [Railway button page](https://railway.app/button) allows you to create templates to offer a 1-click deploy on Railway experience. Services within a template can point to any public repository.

<Image src="https://res.cloudinary.com/railway/image/upload/v1656470421/docs/template-editor_khw8n6.png"
alt="Template Editor"
layout="intrinsic"
width={609} height={520} quality={80} />

Configure your own button at
[railway.app/button](https://railway.app/button) where you can define the repo
to deploy, plugins to install, and required env vars.

### Specifying a Branch

When adding services to a template, you can enter a url to a GitHub repo's branch to have a user clone that instead of the `main` branch.

### Additional Configuration

You can configure the following fields to enable successful deploys for template users:
- Root Directory (Helpful for monorepos)
- Start command
- Healthcheck Path
- Variables (with an optional description default value)

## Convert a Project into a Template

You can also convert an existing project into a template by heading over to your project settings page. We will automatically identify and add all the required services and plugins.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1680277820/CleanShot_2023-03-31_at_19.47.55_2x_yvr9hb.png"
alt="Generate template from project"
layout="intrinsic"
width={1599}
height={899}
quality={80}
/>

Within the Project Settings, you can convert your project into a ready-made Template for other users by pressing the "Create Template" button.

## Publishing a Template

Once you create a template, you have the option to publish it. Publishing a template will add it to our [templates page](https://railway.app/templates). Simply click the publish button and fill out the form to publish your template.

<Image src="https://res.cloudinary.com/railway/image/upload/v1680281251/CleanShot_2023-03-31_at_20.46.28_2x_tjjpna.png"
  alt="Template publishing form"
  layout="intrinsic"
  width={1514}
  height={2490}
  quality={80}
/>

## Managing your Templates

You can see all of your templates on your [Account's Templates page](https://railway.app/account/templates). Templates are separated into Personal and Published templates. You can edit, publish/unpublish and delete templates whenever you'd like!

<Image src="https://res.cloudinary.com/railway/image/upload/v1680281548/CleanShot_2023-03-31_at_20.51.43_2x_j8a83x.png"
 alt="Account templates page"
 layout="intrinsic"
 height={3080}
 width={3100}
 quality={80}
/>
