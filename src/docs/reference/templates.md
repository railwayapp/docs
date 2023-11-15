---
title: Templates
---

Templates provide a way to jumpstart a project by giving users the means to package a service or set of services into a reusable and distributable format.

There are two main ways to interact with templates in Railway - creation and deployment.

## Creation

Creating a template allows you to capture your infrastructure in a reusable and distributable format. By defining services, environment configuration, network settings, etc., you lay the foundation for others to deploy the same software stack with the click of a button.

### How to Create a Template

You can either create a template from scratch or base it off of an existing project.

#### Starting from Scratch

The [Railway button page](https://railway.app/button) allows you to create templates to offer a 1-click deploy on Railway experience.

Services within a template can be deployed from any public Github repository, or directly from a Docker image in Docker Hub or Github Container Registry.

<Image src="https://res.cloudinary.com/railway/image/upload/v1656470421/docs/template-editor_khw8n6.png"
alt="Template Editor"
layout="intrinsic"
width={1218} height={1120} quality={80} />

Simply name the template, add and configure the services and click `Create Template`.

#### Convert a Project into a Template

You can also convert an existing project into a template by heading over to your project settings page. We will automatically identify and add all the required services.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1680277820/CleanShot_2023-03-31_at_19.47.55_2x_yvr9hb.png"
alt="Generate template from project"
layout="intrinsic"
width={1599}
height={899}
quality={80}
/>

Within the Project Settings, you can convert your project into a ready-made Template for other users by pressing the `Create Template` button.

Once the template has been generated, you will be taken to the template creation page to confirm the settings and finalize the template creation.

### Configuring Services

Whether you are building from scratch or have started from an existing project, once you are on the [template creation page](https://railway.app/button), you will see various configuration options for each service added to your template.

In addition to the Source, you can configure the following fields to enable successful deploys for template users:

- [Enable Public Networking](/deploy/exposing-your-app)
- [Root Directory (Helpful for monorepos)](/deploy/monorepo)
- [Start command](/deploy/deployments#start-command)
- [Healthcheck Path](/deploy/healthchecks)
- [Volume mount path](/reference/volumes)
- [Variables](/develop/variables) (with an optional description default value)

#### Specifying a Branch

When adding services to a template, you can enter a url to a GitHub repo's branch to have a user clone that instead of the `main` branch.

#### Template Variables Functions

Template variable functions allow you to dynamically generate variables (or parts of a variable) on demand when the template is deployed.

<Image src="https://res.cloudinary.com/railway/image/upload/v1690581532/docs/screenshot-2023-07-28-15.31.42_tjgp1e.png"
alt="Template Variable Functions"
layout="intrinsic"
width={624} height={497} quality={100} />

When a template is deployed, all functions are executed and the result replaces the `${{ ... }}` in the variable. For example, you can use them to generate a random password for a database, or to generate a random string for a secret. You can see an example of what the variable will look like after all the functions execute when creating the template.

The current template variable functions are:

- `secret(length?: number, alphabet?: string)`: Generates a random secret (32 chars by default). You can generate random Hex or Base64 secrets by passing the appropriate alphabet.

  - Base64: `secret(32, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/')`
  - Hex: `secret(32, '0123456789ABCDEF')`

- `randomInt(min?: number, max?: number)`: Generates a random integer between min and max (defaults to 0 and 100)

### Publishing a Template

Once you create a template, you have the option to publish it. Publishing a template will add it to our [templates page](https://railway.app/templates). Simply click the publish button and fill out the form to publish your template.

<Image src="https://res.cloudinary.com/railway/image/upload/v1680281251/CleanShot_2023-03-31_at_20.46.28_2x_tjjpna.png"
  alt="Template publishing form"
  layout="intrinsic"
  width={1514}
  height={2490}
  quality={80}
/>

### Managing your Templates

You can see all of your templates on your [Account's Templates page](https://railway.app/account/templates). Templates are separated into Personal and Published templates. You can edit, publish/unpublish and delete templates whenever you'd like!

<Image src="https://res.cloudinary.com/railway/image/upload/v1680281548/CleanShot_2023-03-31_at_20.51.43_2x_j8a83x.png"
 alt="Account templates page"
 layout="intrinsic"
 height={3080}
 width={3100}
 quality={80}
/>

### Sharing your Templates

After you create your template, you may want to share your work with the public and let others clone your project.

#### Deploy on Railway Button

Upon template creation, you are provided with the Template URL where your template can be found and deployed.

To complement your template, we also provide a `Deploy on Railway` button which you can include in your README or embed it into a website.
![https://railway.app/button.svg](https://railway.app/button.svg)
The button is located at [https://railway.app/button.svg](https://railway.app/button.svg).

For examples and more information about the button, head over to our [Deploy On Railway Button](/deploy/deploy-on-railway-button) page.

## Kickback program

If your published template is deployed into other users' projects, you are immediately eligible for a 25% kickback, in the form of Railway credits, of the usage cost incurred by those users. That means if a user deploys your template, and the usage of the services cost the user $100, you could receive $25 in Railway credits.

#### Important things to note

- Your template must be published to the marketplace to be eligible for kickback.
- For Hobby users with a $5 discount, only usage in excess of the discount is counted in the kickback.
- Platform fees are not included in the kickback, but usage fees of the platform are included. Examples of platform fees are:

  - Cost of Subscription Plan ($5 for Hobby, $20 for Pro)
  - Additional Team Seats

  As an example, if a user pays $20 in platform fees, then incurs $200 of usage from your template, you are eligible for a $50 kickback (25% of $200).

- The minimum kickback our program supports is $0.01, meaning usage of your template must incur at least $0.04 in usage after discounts and/or platform fees.
- All service types and resource usage of those services (compute, volume, egress, etc) _do count_ towards the kickback.

Read more about the kickback program [here](https://railway.app/open-source-kickback).

## Deployment

Templates allow you to deploy a fully configured project that is automatically
connected to infrastructure. Examples of templates are -

- NextJS app with Prisma
- Django app connected to Postgres
- Elixir Phoenix webserver
- Discord/Telegram bots

You can find featured templates on our
[dedicated templates page](https://railway.app/templates).

### Service Source

Templates can be made up of one or many services, and when you deploy a template, each service within the template is deployed to your Railway project.

Services can be sourced from a GitHub repository, or directly from a Docker image in Docker Hub or GitHub Container Registry. The source is defined by the template creator.

If any service in a template you have deployed is sourced from a GitHub repository, a copy of that repository will be created in your own GitHub account upon deployment. Your personal copy of the repository is used as the source of the service in your Railway project.

### Updatable Templates

When you deploy any services from a template based on a GitHub repo, every time you visit the project in Railway, we will check to see if the project it is based on has been updated by its creator.

If it has received an upstream update, we will create a branch on the GitHub repo that was created when deploying the template, allowing for you to test it out within a PR deploy.

If you are happy with the changes, you can merge the pull request, and we will automatically deploy it to your production environment.

<Banner variant="info">
If you're curious, you can read more about how we built updatable templates in this <Link href="https://blog.railway.app/p/updatable-starters">blog post</Link>.
</Banner>

Note that this feature only works for services based on GitHub repositories. At this time, we do not have a mechanism to check for updates to Docker images from which services may be sourced.
