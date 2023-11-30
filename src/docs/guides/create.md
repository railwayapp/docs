---
title: Create a Template
---

Creating a template allows you to capture your infrastructure in a reusable and distributable format.  By defining services, environment configuration, network settings, etc., you lay the foundation for others to deploy the same software stack with the click of a button.

## How to Create a Template

You can either create a template from scratch or base it off of an existing project.

### Starting from Scratch

The <a href="https://railway.app/button" target="_blank">Railway button page</a>. allows you to create templates to offer a 1-click deploy on Railway experience.

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

Whether you are building from scratch or have started from an existing project, once you are on the <a href="https://railway.app/button" target="_blank">template creation page</a>, you will see various configuration options for each service added to your template.

In addition to the Source, you can configure the following fields to enable successful deploys for template users:

- [Enable Public Networking](/guides/public-networking)
- [Root Directory (Helpful for monorepos)](/guides/deploy-a-monorepo)
- [Start command](/guides/start-command)
- [Healthcheck Path](/guides/healthchecks-and-restarts#configure-healthcheck-endpoint)
- [Volume mount path](/guides/volumes)
- [Variables](/guides/variables) (with an optional description default value)

### Specifying a Branch

When adding services to a template, you can enter a url to a GitHub repo's branch to have a user clone that instead of the `main` branch.

### Template Variable Functions

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

## Managing your Templates

You can see all of your templates on your <a href="https://railway.app/account/templates" target="_blank">Account's Template page</a>. Templates are separated into Personal and Published templates. You can edit, publish/unpublish and delete templates whenever you'd like!

<Image src="https://res.cloudinary.com/railway/image/upload/v1680281548/CleanShot_2023-03-31_at_20.51.43_2x_j8a83x.png"
 alt="Account templates page"
 layout="intrinsic"
 height={3080}
 width={3100}
 quality={80}
/>

