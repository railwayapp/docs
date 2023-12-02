---
title: Quick Start Tutorial
---

Railway is a deployment platform where you can provision infrastructure,
develop with that infrastructure locally, and then deploy to the cloud.

In this guide, we will deploy a simple To-Do App running [NextJS](https://nextjs.org/docs/getting-started) and [Prisma](https://www.prisma.io/docs/) using a template.

<Image src="/images/getting-started/1-railway-getting-started.gif"
alt="Preview of What The Guide is Building"
layout="intrinsic"
width={800} height={455} quality={100} />

We will get you up and running quickly by covering the following three steps:

1. Creating a project from a template
2. Developing the project locally
3. Deploying to the cloud

You will need [Node](https://nodejs.org/en/download/) to run the project locally. And you will need either Node or [Homebrew](https://brew.sh/) on your machine to install the Railway CLI. We will use [Yarn](https://yarnpkg.com/) for our examples locally.

## Create a Project

First, to deploy the NextJS Prisma template, we will make a new [project](develop/projects).

Railway offers a Command Palette that exposes all actions that one can do on the platform. We will use this menu to create our project.

Press the Command + K key combination and type "New Project".

<Image src="/images/getting-started/2-railway-getting-started-create-a-project.gif"
alt="Command K in Action"
layout="intrinsic"
width={800} height={455} quality={80} />

Under the list of options in the menu, select "Deploy Template".

### Deploy the Next JS Prisma Template

Railway offers 50+ templates ranging from blogs to self-hosted apps. In the Command Palette, type `NextJS Prisma`.

Alternatively, you can deploy the template from the [Template marketplace](https://railway.app/templates).

<Image src="/images/getting-started/3-railway-getting-started-deploy-template.gif"
alt="Deploy the Template"
layout="intrinsic"
width={800} height={448} quality={80} />

Click the `NextJS Prisma` template to deploy it.

Railway requires that you have a valid GitHub account linked to deploy a template. If there is no account associated with your Railway account, you will be prompted to link an account.

Let's go with the default settings in the Deploy menu and click the "deploy" button.

When you click deploy, Railway will create a repo using the `NextJS Prisma` template as the source on your linked GitHub account and kick off an initial deploy after the project is created.

Once the project is created you will land on your project dashboard.

This is your _mission control_. Your project's infrastructure, [environments](develop/environments), and [deployments](deploy/deployments) are all
controlled from here.

You should see a [Postgres database](databases/postgresql) in the project dashboard, we use this to persist our To-Dos in the app.

Congrats! After the initial deployment finalizes, your web server ready to go. All you need to do now is to find the domain.  Within the service settings panel, the domain is listen under Deployments.  

You can also find it in the [Settings](deploy/exposing-your-app) tab under Public Networking.

<Image
src="/images/getting-started/4-railway-getting-started-domain-link.png"
alt="Screenshot of adding Service Domain"
layout="responsive"
width={800} height={287} quality={80} />

Navigate to your domain to see the app live.

In the next step, we will personalize your new web app.

## Developing Locally

So far Railway spun up a Postgres instance and a web server providing all the needed variables on deploy. We will connect to that very same Postgres instance locally to help us develop our app.

Begin by cloning the repo you created on your machine.

(Tip: you can navigate directly to the Project's repo from the deployment pane using the Command Palette.)

### Install and Link the CLI

The Railway CLI connects your code to your infrastructure.

Install with [Brew](https://brew.sh), [NPM](https://www.npmjs.com/package/@railway/cli), or [Scoop](develop/cli#install):

(Note: Brew works best on M1 Macs.)

```bash
brew install railway
```
or
```
npm i -g @railway/cli
```

Log in to your account by running the login command:
```bash
railway login
```

Then, when you are in your project's directory, link your repo to the template project with the following command:
```bash
railway link
```

<Image src="/images/getting-started/5-railway-getting-started-link-cli.gif"
alt="Linking the Project via CLI"
layout="intrinsic"
width={800} height={303} quality={80} />

`railway link` makes the Railway CLI aware of project variables when you run development commands locally. Something we will explore in depth in the next section.

### Run and Develop Your App

When developing locally, it's likely that you'll need environment variables to store sensitive connection strings. Railway provides those variables whenever you run the following command:
```bash
railway run <cmd>
```

We will inject all the environment variables inside your current Railway
[environment](develop/environments). This allows your application to take advantage of your plugins and any environment variables you wish to set up.

Locally install the project dependencies by running the following command:
```bash
yarn
```

Our code needs the Postgres DB connection variables to persist the To-Dos locally, `railway run` makes that possible.
Start the development server with the environment variables sourced by Railway through the CLI like so:
```bash
railway run yarn dev
```

<Image src="/images/getting-started/6-railway-getting-started-run-locally.gif"
alt="Developing Locally"
layout="intrinsic"
width={800} height={483} quality={100} />

Let's make a tiny change to our application to see if everything is working.
Open `src/pages/index.tsx` in a text editor of your choice and change line 79 of the `<h1>` JSX tag to the following string.

```javascript
<h1 className={styles.title}>My Todos</h1>
```

If you are running the dev server locally, you'll see the change. Feel free to change anything within the project as well! We can't stop you.

Once you are done, save the file. If you're in a Git repository, you may also commit and push to your remote Git repository. In the next step, we will show you how easy it is to deploy your changes.

## Deploy

To deploy your current directory, run the following command. Make sure you are in the project root directory in your terminal.

```bash
railway up
```

<Image src="/images/getting-started/7-railway-getting-started-build-deploy.gif"
alt="Railway Up in Action"
layout="intrinsic"
width={800} height={486} quality={100} />

This will create a [deployment](deploy/railway-up) using the current project and
environment. Click the returned link to see the build and deploy logs.

For projects based on a GitHub repo like a template, [auto deploys](deploy/deployments#deploy-triggers) are automatically enabled. Commits on the main branch trigger a redeploy. You can also enable ephemeral deploy environments for PRs made in GitHub Repos.

After your deployment completes, you can see your new deployment live at the deployment's URL. If you added To-Dos while developing locally, you should see them on your deployment live. In a proper project, you would enable multiple environments to isolate your production environment.

<Image src="/images/getting-started/8-railway-getting-started-data-persistence.gif"
alt="App Deployed From Local to Production"
layout="intrinsic"
width={800} height={486} quality={100} />

This is only the beginning, there are many features we haven't yet covered in this guide that we will touch on in the next step.

## Closing

Railway aims to be the simplest way to develop, deploy, and diagnose issues with your application. Railway offers additional features that are worth exploring:
1. Railway lets you create parallel, identical environments for PRs/testing.
2. Railway lets you run as much (or as little) compute as you'd like with its usage-based pricing and a metrics dashboard included in every project.
3. Adding team members to your projects is as easy as sending them an invite link.
4. Railway supports projects of any size, you can deploy additional services to the same project or deploy subdirectories of a monorepo.

As your Project scales, Railway scales with you by supporting multiple members per Project, Teams, and Autoscaling- leaving you to focus on what matters: your code.

Happy Building!

### Join the Community

Chat with Railway members, ask questions, and hang out on our [community Discord](https://discord.gg/xAm2w6g) with fellow builders! We'd love to have you.
