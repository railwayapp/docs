---
title: Templates
description: Everything you need to know about Railway templates.
---

Templates provide a way to jumpstart a project by giving users the means to package a service or set of services into a reusable and distributable format.

As a Railway user, you can create and publish templates for others to use, or you can deploy templates from our [template marketplace](https://railway.com/templates).

## Highlights

|                                                  |                                                                                                                                                                                                                                      |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Bootstrap Projects**                           | Templates are the best way to bootstrap a project by enabling you to provision a service or set of services in a matter of clicks. Choose a template to deploy from the marketplace, or create your own from your personal scaffold. |
| **Best Practices**                               | Creating templates can get complex, but these best practices will help you create templates that are easy to use and maintain.                                                                                                       |
| **Community Clout**                              | When you publish a template, it is placed into our template marketplace for all users of the Railway community to take advantage.                                                                                                    |
| [**Kickback Program**](/templates/kickbacks)     | Earn kickbacks from template usage, up to 50% for open source templates with active community support. Get rewarded for building quality templates that help the community.                                                          |

## Pushing Updates to Template Consumers

As a template author, you can push updates to all users who have deployed your template. When you merge changes to the root branch (typically `main` or `master`) of your template's GitHub repository, Railway will automatically detect these changes and notify users who have deployed your template that an update is available.

Users will receive a notification about the update and can choose to apply it to their deployment when they're ready.

<Banner variant="info">
**Best Practice**: Keep your template's changelog up to date and document breaking changes clearly so that consumers understand what's changing when they receive update notifications.
</Banner>

Note that this feature only works for templates based on GitHub repositories. Docker image-based templates cannot be automatically updated through this mechanism.

## Private Docker Images

If your template includes a private Docker image, you can provide your registry credentials without exposing them to users who deploy your template.

To set this up, add a service with a Docker image source in the template editor, then enter your registry credentials in the service settings. Railway encrypts and stores these credentials securely.

When users deploy your template, Railway automatically authenticates with your registry to pull the image. Users will only see that the service uses hidden registry credentials, not the credentials themselves.

<Banner variant="warning">
To protect your credentials, SSH access is disabled and users cannot modify the Docker image source for services with hidden registry credentials.
</Banner>

## Updatable Templates

When you deploy any services from a template based on a GitHub repo, Railway will check to see if the template has been updated by its creator.

If an upstream update is available, you will receive a notification. You can then choose to apply the update to your deployment when you're ready.

<Banner variant="info">
If you're curious, you can read more about how we built updatable templates in this <Link href="https://blog.railway.com/p/updatable-starters" target="_blank">blog post</Link>.
</Banner>

Note that this feature only works for services based on GitHub repositories. At this time, we do not have a mechanism to check for updates to Docker images from which services may be sourced.
