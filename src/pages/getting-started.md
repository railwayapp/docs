---
title: Getting Started
---

Railway is an infrastructure platform where you can provision infrastructure,
develop with that infrastructure locally, and then deploy to the cloud.

## Create a Project

Create a new Railway project by visiting [dev.new](https://dev.new) and
selecting what you want to do. Plugins can be added and removed at any time.
Once the project is created you will land on your project dashboard. This is
your _mission control_. Your projects infrastructure,
[environments](/environments), and [deployment](/deployments/up) are all
controlled from here.

## Install the CLI

The Railway CLI allows you to connect your code to your infrastructure. After
[installing it](/cli/installation), you can connect to your project with

```bash
railway init [projectId]
```

The `projectId` is available on your project dashboard. If you were logged in to
the Railway dashboard when you created your project, you can run `railway login`
before init which will allow you to select from all your existing projects.


## Develop Locally

When developing locally, you can connect to your infrastructure by running your
code with

```bash
railway run CMD
```

We will inject all the environment variables inside your current Railway
[environment](/environments).

## Deploy

To deploy your current directory, run

```bash
railway up
```

This will create a [deployment](/deployment/up) using the current project and
environment. Click the returned link to see the build and deploy logs.

You can also setup [auto deploys](/deployment/github-triggers) so that a deploy
is created everytime you push to a branch.
