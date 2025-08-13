---
title: Environments
description: Understanding environments and their use cases in your Railway projects.
---

Railway environments give you an isolated instance of all services in a project.

## How it Works

All projects in Railway are created with a `production` environment by default. Once a project has been created, new environments can be created and configured to complement any development workflow.

## Types of Environments

#### Persistent Environments

Persistent environments are intended to persist but remain isolated from production with regard to their configuration.

For example, it is a common pattern to maintain a `staging` environment that is configured to auto-deploy from a `staging` branch and with variables relevant to `staging`.

#### PR Environments

[PR Environments](/guides/environments#enable-pr-environments) are temporary. They are created when a Pull Request is opened on a branch and are deleted as soon as the PR is merged or closed.

## Environment Isolation

All changes made to a service are scoped to a single environment. This means that you can make changes to a service in an environment without affecting other environments.

## Use Cases

Environments are generally used for isolating changes from the production environment, to iterate and test before pushing to production.

- Have development environments for each team member that are identical to the
  production environment
- Have separate staging and production environments that auto-deploy when changes are made to different branches in a code repository.

## Support

Explore the [Environments](/guides/environments) guide for more information on how to use and manage environments.
