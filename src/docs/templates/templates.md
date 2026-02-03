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
| [**Partner Program**](/templates/partners)       | Technology owners can join Railway's partner program to receive commission on templates, get featured placement, and participate in co-marketing.                                                                                     |
| [**Template Updates**](/templates/updates)       | Push updates to users who deployed your template, or receive notifications when templates you've deployed have been updated.                                                                                                          |

## Private Docker Images

If your template includes a private Docker image, you can provide your registry credentials without exposing them to users who deploy your template.

To set this up, add a service with a Docker image source in the template editor, then enter your registry credentials in the service settings. Railway encrypts and stores these credentials securely.

When users deploy your template, Railway automatically authenticates with your registry to pull the image. Users will only see that the service uses hidden registry credentials, not the credentials themselves.

<Banner variant="warning">
To protect your credentials, SSH access is disabled and users cannot modify the Docker image source for services with hidden registry credentials.
</Banner>
