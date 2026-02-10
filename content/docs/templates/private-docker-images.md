---
title: Private Docker Images
description: Create templates with private Docker images to distribute proprietary code through Railway and uniquely monetize.
---

Templates can include private Docker images, letting you distribute proprietary code without exposing your source. Users deploy your template and Railway handles authentication with your registry.

This is useful for:
- Maintainers who want to distribute solely through Railway to maximize earnings
- Products that are premium versions of open source projects
- Proprietary add-ons or plugins

## Setting up private images

To add a private Docker image to your template:

1. In the template editor, add a service with a Docker image source
2. Enter your registry credentials in the service settings (username and password for Dockerhub, username and access token for Github registry)
3. Railway encrypts and stores the credentials securely

When users deploy your template, Railway authenticates with your registry to pull the image. Users see that the service uses hidden registry credentials, but cannot access the credentials themselves.

<Banner variant="warning">
To protect your credentials, SSH access is disabled and users cannot modify the Docker image source for services with hidden registry credentials.
</Banner>

## Combining with kickbacks

Private image templates are eligible for the same [kickback rates](/templates/kickbacks) as other templates. You earn commission when users deploy and run your private image templates.

For open source maintainers, make a hosted-only version of your tooling to capitalize on the commission you get from Railway templates.
