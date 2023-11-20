---
title: Create a Template
---

Creating a template allows you to capture your infrastructure in a reusable and distributable format.  By defining services, environment configuration, network settings, etc., you lay the foundation for others to deploy the same software stack with the click of a button.

## How to Create a Template

You can either create a template from scratch or base it off of an existing project.

### Starting from Scratch

The [Railway button page](https://railway.app/button) allows you to create templates to offer a 1-click deploy on Railway experience.

Services within a template can be deployed from any public Github repository, or directly from a Docker image in Docker Hub or Github Container Registry.

<Image src="https://res.cloudinary.com/railway/image/upload/v1656470421/docs/template-editor_khw8n6.png"
alt="Template Editor"
layout="intrinsic"
width={1218} height={1120} quality={80} />

Simply name the template, add and configure the services and click `Create Template`.

### Convert a Project into a Template

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

## Configuring Services

Whether you are building from scratch or have started from an existing project, once you are on the [template creation page](https://railway.app/button), you will see various configuration options for each service added to your template.

In addition to the Source, you can configure the following fields to enable successful deploys for template users:

- [Enable Public Networking](/how-to/exposing-your-app)
- [Root Directory (Helpful for monorepos)](/how-to/deploy-a-monorepo)
- [Start command](/how-to/deployments#start-command)
- [Healthcheck Path](/how-to/configure-deployment-lifecycle#configure-healthcheck-endpoint)
- [Volume mount path](/how-to/use-volumes)
- [Variables](/how-to/use-variables) (with an optional description default value)

### Specifying a Branch

When adding services to a template, you can enter a url to a GitHub repo's branch to have a user clone that instead of the `main` branch.

### Template Variables Functions

Template variable functions allow you to dynamically generate variables (or parts of a variable) on demand when the template is deployed.

<Image src="https://res.cloudinary.com/railway/image/upload/v1690581532/docs/screenshot-2023-07-28-15.31.42_tjgp1e.png"
alt="Template Variable Functions"
layout="intrinsic"
width={624} height={497} quality={100} />

When a template is deployed, all functions are executed and the result replaces the `${{ ... }}` in the variable. For example, you can use them to generate a random password for a database, or to generate a random string for a secret. You can see an example of what the variable will look like after all the functions execute when creating the template.

The current template variable functions are:

- `secret(length?: number, alphabet?: string)`: Generates a random secret (32 chars by default).  You can generate random Hex or Base64 secrets by passing the appropriate alphabet.
    
    - Base64: `secret(32, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/')`
    - Hex: `secret(32, '0123456789ABCDEF')`

- `randomInt(min?: number, max?: number)`: Generates a random integer between min and max (defaults to 0 and 100)

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

## Sharing your Templates

After you create your template, you may want to share your work with the public and let others clone your project.

### Deploy on Railway Button

Upon template creation, you are provided with the Template URL where your template can be found and deployed.  

To complement your template, we also provide a `Deploy on Railway` button which you can include in your README or embed it into a website.
![https://railway.app/button.svg](https://railway.app/button.svg)
The button is located at [https://railway.app/button.svg](https://railway.app/button.svg).

For examples and more information about the button, head over to our [Deploy On Railway Button](/deploy/deploy-on-railway-button) page.

## Kickback program

If your published template is deployed into other users' projects, you are immediately eligible for a 25% kickback, in the form of Railway credits, of the usage cost incurred by those users.  That means if a user deploys your template, and the usage of the services cost the user $100, you could receive $25 in Railway credits.

### Important things to note
- Your template must be published to the marketplace to be eligible for kickback.
- For Hobby users with a $5 discount, only usage in excess of the discount is counted in the kickback.
- Platform fees are not included in the kickback, but usage fees of the platform are included.  Examples of platform fees are:
  - Cost of Subscription Plan ($5 for Hobby, $20 for Pro)
  - Additional Team Seats
  
  As an example, if a user pays $20 in platform fees, then incurs $200 of usage from your template, you are eligible for a $50 kickback (25% of $200).
- Currently, the minimum kickback our program supports is $1, meaning usage of your template must incur at least $4 in usage after discounts and/or platform fees.  We are working to enable fractional kickbacks (< $1).
- All service types and resource usage of those services (compute, volume, egress, etc) *do count* towards the kickback.

Read more about the kickback program [here](https://railway.app/open-source-kickback).