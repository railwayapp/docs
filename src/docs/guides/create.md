---
title: Create a Template
description: Learn how to create reusable templates on Railway to enable effortless one-click deploys.
---

Creating a template allows you to capture your infrastructure in a reusable and distributable format.

By defining services, environment configuration, network settings, etc., you lay the foundation for others to deploy the same software stack with the click of a button.

If you [publish your template](/guides/publish-and-share) to the <a href="https://railway.com/templates" target="_blank">marketplace</a>, you can even <a href="https://railway.com/open-source-kickback" target="_blank">collect a kickback</a> from the usage of it!

## How to Create a Template

You can either create a template from scratch or base it off of an existing project.

### Starting from Scratch

To create a template from scratch, head over to the <a href="https://railway.com/compose" target="_blank">template composer</a> then add and configure your services:

- Add a service by clicking the `Add New` button in the top right-hand corner, or through the command palette (`CMD + K` -> `+ New Service`)
- Select the service source (GitHub repo or Docker Image)
- Configure the service variables and settings

  <Image src="https://res.cloudinary.com/railway/image/upload/v1715724184/docs/templates-v2/composer_aix1x8.gif"
  alt="Template Editor"
  layout="intrinsic"
  width={900} height={1120} quality={80} />

- Once you've added your services, click `Create Template`
- You will be taken to your templates page where you can copy the template URL to share with others

Note that your template will not be available on the template marketplace, nor will be eligible for a kickback, until you [publish](/guides/publish-and-share) it.

### Private Repo Support

It's now possible to specify a private GitHub repo when creating a template.

This feature is intended for use among [Teams](/reference/teams) and [Organizations](/reference/teams). Users supporting a subscriber base may also find this feature helpful to distribute closed-source code.

To deploy a template that includes a private repo, look for the `GitHub` panel in the `Account Integrations` section of [General Settings](https://railway.com/account). Then select the `Edit Scope` option to grant Railway access to the desired private repos.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1721350229/docs/github-private-repo_m46wxu.png"
alt="Create a template from a private GitHub repositories"
layout="intrinsic"
width={1599}
height={899}
quality={80}
/>

If you do not see the `Edit Scope` option, you may still need to connect GitHub to your Railway account.

### Convert a Project Into a Template

You can also convert an existing project into a ready-made Template for other users.

- From your project page, click `Settings` in the right-hand corner of the canvas
- Scroll down until you see **Generate Template from Project**
- Click `Create Template`

<Image
src="https://res.cloudinary.com/railway/image/upload/v1743198969/docs/create-template_ml13wy.png"
alt="Generate template from project"
layout="intrinsic"
width={1200}
height={380}
quality={80}
/>

- You will be taken to the template composer page, where you should confirm the settings and finalize the template creation

## Configuring Services

Configuring services using the <a href="https://railway.com/compose" target="_blank">template composer</a> is very similar to building a live project in the canvas.

Once you add a new service and select the source, you can configure the following to enable successful deploys for template users:

- **Variables tab**
  - Add required [Variables](/guides/variables).
    _Use [reference variables](/guides/variables#reference-variables) where possible for a better quality template_
- **Settings tab**
  - Add a [Root Directory](/guides/monorepo) (Helpful for monorepos)
  - [Enable Public Networking](/guides/public-networking) with TCP Proxy or HTTP
  - Set a custom [Start command](/guides/start-command)
  - Add a [Healthcheck Path](/guides/healthchecks#configure-the-healthcheck-path)
- **Add a volume**
  - To add a volume to a service, right-click on the service, select Attach Volume, and specify the [Volume mount path](/guides/volumes)

### Specifying a Branch

To specify a particular GitHub branch to deploy, simply enter the full URL to the desired branch in the Source Repo configuration. For example -

- This will deploy the `main` branch: `https://github.com/railwayapp-templates/postgres-ssl`
- This will deploy the `new` branch: `https://github.com/railwayapp-templates/postgres-ssl/tree/new`

### Template Variable Functions

Template variable functions allow you to dynamically generate variables (or parts of a variable) on demand when the template is deployed.

<Image src="https://res.cloudinary.com/railway/image/upload/v1743198983/docs/template-variables_dp5pg5.png"
alt="Template Variable Functions"
layout="intrinsic"
width={1200} height={428} quality={100} />

When a template is deployed, all template variable functions are executed and the result replaces the `${{ ... }}` in the variable.

Use template variables to generate a random password for a database, or to generate a random string for a secret.

The current template variable functions are:

1. `secret(length?: number, alphabet?: string)`: Generates a random secret (32 chars by default).

   **Tip:** You can generate Hex or Base64 secrets by constructing the appropriate alphabet and length.

   - `openssl rand -base64 16` → `${{secret(22, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/")}}==`
   - `openssl rand -base64 32` → `${{secret(43, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/")}}=`
   - `openssl rand -base64 64` → `${{secret(86, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/")}}==`
   - `openssl rand -hex 16` → `${{secret(32, "abcdef0123456789")}}`
   - `openssl rand -hex 32` → `${{secret(64, "abcdef0123456789")}}`
   - `openssl rand -hex 64` → `${{secret(128, "abcdef0123456789")}}`

   Or even generate a UUIDv4 string -

   `${{secret(8, "0123456789abcdef")}}-${{secret(4, "0123456789abcdef")}}-4${{secret(3, "0123456789abcdef")}}-${{secret(1, "89ab")}}${{secret(3, "0123456789abcdef")}}-${{secret(12, "0123456789abcdef")}}`

2. `randomInt(min?: number, max?: number)`: Generates a random integer between min and max (defaults to 0 and 100)

## Managing Your Templates

You can see all of your templates on your <a href="https://railway.com/workspace/templates" target="_blank">Workspace's Template page</a>. Templates are separated into Personal and Published templates.

You can edit, publish/unpublish and delete templates.

<Image src="https://res.cloudinary.com/railway/image/upload/v1743199089/docs/templates_xyphou.png"
 alt="Account templates page"
 layout="intrinsic"
 width={1200}
 height={668}
 quality={80}
/>
