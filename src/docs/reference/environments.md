---
title: Environments
---

Railway environments give you an isolated instance of all services in a project.

## How it Works

All projects in Railway are created with a `production` environment by default.  Once a project has been created, new environments can be created and configured to complement any development workflow.

## Types of Environments

#### Persistent Environments

Persistent environments contain the same services as the production environment, but not the same variables.  These environments are intended to persist but remain isolated from production with regard to their configuration.  For example, a `staging` environment that is configured to auto-deploy from a `staging` branch.

#### Forked Environments

Forked environments contain the same services AND variables of the original environment.

A key difference between forked and persistent environments are changesets.  Changes in a forked environment are stored in a changeset to be reviewed and merged into the original environment.

#### PR Environments

[PR Environments](/how-to/setup-environments#enable-pr-environments) are temporary.  They are created when a Pull Request is opened on a branch and are deleted as soon as the PR is merged or closed.

## Use Cases

Environments are generally used for isolating changes from the production environment, to iterate and test before pushing to production.

- Have development environments for each team member that are identical to the
production environment
- Have separate staging and production environments that auto-deploy when changes are made to different branches in a code repository.

## Support

Explore the [Setup Environments](/how-to/setup-environments) guide for more information on how to use and manage environments.