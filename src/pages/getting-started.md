---
title: Getting Started
---

Railway is a deployment platform where you can provision infrastructure,
develop with that infrastructure locally, and then deploy to the cloud.

In this guide we will deploy a simple To-Do App running NextJS and Prisma using a starter.

(Gif of the To-Do App)

We will get you up and running quickly by covering the following 3 steps:

1. Creating a project from a starter
2. Developing the project locally
3. Deploying to the cloud

You will need [Node](https://nodejs.org/en/download/) or [Homebrew](https://brew.sh/) on your machine to install the Railway CLI.

## Create a Project

First, to deploy the NextJS Prisma starter, we will make a new [project](develop/projects).

Railway offers a Command Palette that exposes all actions that one can do on the platform. We will use this menu to create our project.

Press the Command + K key combination and type "New Project".

<NextImage src="https://res.cloudinary.com/railway/image/upload/v1643696774/docs/CleanShot_2022-02-01_at_01.15.37_2_p85zsa.gif"
alt="Screenshot of Metrics Page"
layout="intrinsic"
width={800} height={440} quality={80} />

You can also create a project by [navigating to dev.new](https://dev.new). One of the many ways you can create a new project on Railway.

You will then be be prompted with a menu of options. Select "Deploy Starter" from the list.

### Deploy the Next JS Prisma Starter

Railway offers 40+ starters on the platform of varying type. Under the search bar at the top right of the page, type `NextJS Prisma`.

(Gif of typing the query)

The grid will narrow down to your query. Click the `NextJS Prisma` starter to deploy it.

Railway requires that you have a valid GitHub account linked to deploy a starter. If there is no account associated with your Railway account, you will be prompted to link an account.

Let's leave the default settings as is in the Deploy menu and click deploy.

When you click deploy, Railway will create a repo using the `NextJS Prisma` starter as the source on your linked GitHub account and kick off an initial deploy after the project is created.

(Gif of deploy)

Once the project is created you will land on your project dashboard.

This is your _mission control_. Your project's infrastructure, [environments](develop/environments), and [deployments](deploy/railway-up) are all
controlled from here.

Congrats! After the initial deployment finalizes, your web server is ready to go. Within the web server service deployed- you can click on the deployment link to go to your web app. In the next step, we will personalize your new web app.

## Developing Locally

So far Railway spun up a Postgres instance and a web server providing all the needed variables on deploy. However, we will need these variables locally when developing our app locally.

In this step, we will use the Railway CLI to run your app locally with all the variables you need to connect to your infrastructure.

Lets begin by cloning the repo you created on your machine.

(Tip: you can navigate directly to the Project's repo from the deployment pane using the Command Palette.)

### Install and Link the CLI

As mentioned, we use the Railway CLI to connect your code to your infrastructure.

Install with [Brew](https://brew.sh), [NPM](https://www.npmjs.com/package/@railway/cli), or [Scoop](develop/cli#install):

(Note: Brew works best on M1 Macs.)

```bash
brew install railwayapp/railway/railway
# or
npm i -g @railway/cli
```

Log in to your account by running the login command.

```bash
railway login
```

After signing in, if you are in your project's directory, you can link your repo to the starter project:

(Gif of Link)

```bash
railway link
```

### Run and Develop Your App

When developing locally, you can connect to your infrastructure by running your code with the command. Our code needs the Postgres DB connection variables to persist the To-Dos locally, `railway run` makes that possible.

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
Open `src/pages/index.tsx` in a text editor of your choice and change line 79 of the `<h1>` JSX tag to the following string.

```javascript
<h1>My Todos</h1>
```

If you are running the dev server locally, you'll see the change.

Save the file, and now we are ready to deploy.

## Deploy

To deploy your current directory, run the following command. Make sure you are in the project root directory in your terminal.

```bash
railway up
```

(Gif of Railway Up)

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
