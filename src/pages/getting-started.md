---
title: Getting Started
---

Railway is a deployment platform where you can provision infrastructure,
develop with that infrastructure locally, and then deploy to the cloud.

The following guide will get you up and running quickly by covering the following
3 steps:

1. Creating a project from a starter
2. Developing the project locally
3. Deploying to the cloud

You will need Node or Homebrew installed to install the Railway CLI.

In this guide we will deploy a simple Web Server running NextJS and Prisma.

## Create a Project

Create a new Railway project by visiting [dev.new](https://dev.new). We will deploy a starter to show how quick you can get up and running on Railway.

Press Command + K and select "Deploy Starter"

You will be prompted with a grid of starters. Railway supports a number of languages out of the box and can provision infrastructure like databases to extend your applications. These are what we call Plugins; they can be added and removed at any time.

In the starter selection grid, select `NextJS Prisma`.

This will create a repo using the starter as a base on your linked GitHub account. If you don't have a linked GitHub account, you will be prompted to link an account to deploy.

Once the project is created you will land on your project dashboard.

This is your _mission control_. Your project's infrastructure, [environments](develop/environments), and [deployments](deploy/railway-up) are all
controlled from here.

### Install and Link the CLI

Clone the repo you created locally on your machine.
(Tip: you can navigate directly to the Project's repo from the deployment pane.)

The Railway CLI allows you to connect your code to your infrastructure.

Install with [Brew](https://brew.sh), [NPM](https://www.npmjs.com/package/@railway/cli), or [scoop](develop/cli#install):

```bash
brew install railwayapp/railway/railway
# or
npm i -g @railway/cli
```

After signing in, if you are in your project's directory, you can link your project to a directory:

```bash
railway link [projectId]
```

The `projectId` is available on your project dashboard under the Setup page. If you were logged in to
the Railway dashboard when you created your project, you can run `railway login`
before init, which will allow you to select from all your existing projects.

## Developing Locally

When developing locally, you can connect to your infrastructure by running your code with the command.

```bash
railway run <cmd>
```

We will inject all the environment variables inside your current Railway
[environment](develop/environments). This allows your application to take advantage of your plugins and any environment variables you wish to set up.

Locally install the project dependencies by running the following command.

```bash
yarn
```

Then start the development server with the environment variables sourced by Railway through the CLI like so.

```bash
railway run yarn dev
```

Lets make a tiny change to our application to see if everything is working.
Open `src/pages/index.tsx` in a text editor of your choice and change line 79 of the `<h1>` JSX tag to `My Todos`.

If you are running the dev server locally, you'll see the change.

Save the file, and now we are ready to deploy.

## Deploy

To deploy your current directory, run the following command. Make sure you are in the project root directory in your terminal.

```bash
railway up
```

This will create a [deployment](deploy/railway-up) using the current project and
environment. Click the returned link to see the build and deploy logs.

For projects based off of a GitHub repo like a starter, [auto deploys](deploy/github-triggers) are automatically enabled. Commits on main trigger a redeploy. You can also enable ephemeral deploy environments for PRs made in GitHub Repos.

After your deployment completes, you can see your new deployment live at the deployment's URL. At this stage, you can even add a custom domain to the Project and enable multiple environments to isolate your production environment.

## Closing

Railway aims to be the simplest way to develop, deploy, and diagnose issues with your application. There are additional features we haven't covered in this guide but are worth exploring.

1. Railway automagically manages your environment variables for plugins. Add Postgres -> that project instantly gets access.
2. Railway lets you create parallel, identical environments for PRs/testing.
3. Railway lets you run as much (or as little) compute as you'd like with its usage based pricing and a metrics dashboard included in every project.
4. Adding team members to your projects is as easy as sending them an invite link.

As your Project scales, Railway scales with you by supporting with multiple members per Project, Teams, and Autoscaling- leaving you to focus on what matters: your code.

Happy Building!

### Join the Community

Chat with Railway members, ask questions, and hang out on our [community Discord](https://discord.gg/xAm2w6g) with fellow builders! We'd love to have you.
