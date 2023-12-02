---
title: Deploy a Template
---

Templates allow you to deploy a fully configured project that is automatically
connected to infrastructure. Examples of templates are -

- NextJS app with Prisma
- Django app connected to Postgres
- Elixir Phoenix webserver
- Discord/Telegram bots

You can find featured templates on our <a href="https://railway.app/templates" target="_blank">template marketplace</a>.

Simply find a template you want, and click the `Deploy` button.

## Service Source

Templates can be made up of one or many services, and when you deploy a template, each service within the template is deployed to your Railway project.

Services can be sourced from a GitHub repository, or directly from a Docker image in Docker Hub or GitHub Container Registry.  The source is defined by the template creator.

If any service in a template you have deployed is sourced from a GitHub repository, a copy of that repository will be created in your own GitHub account upon deployment.  Your personal copy of the repository is used as the source of the service in your Railway project.

## Updatable Templates

When you deploy any services from a template based on a GitHub repo, every time you visit the project in Railway, we will check to see if the project it is based on has been updated by its creator.

If it has received an upstream update, we will create a branch on the GitHub repo that was created when deploying the template, allowing for you to test it out within a PR deploy.

If you are happy with the changes, you can merge the pull request, and we will automatically deploy it to your production environment.

<Banner variant="info">
If you're curious, you can read more about how we built updatable templates in this <a href="https://blog.railway.app/p/updatable-starters" target="_blank">blog post</a>
</Banner>

Note that this feature only works for services based on GitHub repositories.  At this time, we do not have a mechanism to check for updates to Docker images from which services may be sourced.