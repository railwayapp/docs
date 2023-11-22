---
title: Environments
---

Railway environments give you an isolated instance of all databases and services in a project.  You can then use them to -

- Have development environments for each team member that are identical to the
  production environment
- Have separate staging and production environments

## How it Works

When you create an environment, Railway will provision the same services in the new environment as the `production` environment, and deploys are then scoped to the different environments.

### Environment Deploys

Running [`railway up`](/reference/cli-api#up) with an environment selected from the CLI will create a deployment using the variables from the Environment.

### Ephemeral Environments

If you enable [Pull Request Deploys](/how-to/setup-environments#enable-pr-environments), a temporary environment is spun up to support the Pull Request deploy. These environments are deleted as soon as these PRs are merged or closed.

## Forking and merging environments

Environments in Railway can be forked and merged. 

Forking an environment creates a new environment with the services and variables of the original environment.

Changes in a forked environment are not propagated automatically to the parent environment. Instead, changes are stored in a changeset that you can review at any point in time.

At this moment only changes in environment variables can be merged, but we are working on adding support for any other changes made to a service or plugin.

## Support

For more information on how to manage environments, including forking and merging, refer to the [how to guide](/how-to/setup-environments).