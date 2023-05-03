---
title: Getting Started
---

    ![Railway](./images/todo-app.png)

In this getting started, you deploy a simple To-Do App running NextJS and Prisma using a template. 
To do this, complete the following procedures:

1. Create a project from a template.
2. Develop the project locally.
3. Deploy to the cloud.

### Before you Start

Railway deploys projects from GitHub to the cloud. So, to use Railway, you need a Railway Account and GitHub account. If you haven't created a GitHub account, do that first.

To create a Railway account you can provide a username/password or link your GitHub account to log into Railway. If you haven't done it yet, go ahead and [create a Railway Account](#) now. When you have successfully created your account, the Railway dashboard is displayed:

![Railway](./images/dashboard.png)

 The dashboard is your _mission control_. Your project's infrastructure, environments, and deployments are all controlled from the dashboard. 


## Create a project from a template

Railway offers 50+ templates ranging from blogs to self-hosted apps. The To-Dos application you are creating is a self-hosted NextJS Prisma app.  To create this app from the Railway template, do this:

1. If you haven't already, open the Railway Dashboard.
2. Choose **New Project** button.

   The system presents a display area:

   ![Railway](./images/new-project.png)

3. Choose **NextJS Prisma** from the dropdown.

    You'll see next to every template, Railway tells you the project language.

   ![Railway](./images/dropdown.png)

4. Enter the details for your project's GitHub repository.

    The details page has a lot of information. For example, Railway tells you the components created with this template. The GitHub service and a database. You can see that the [template source code is available in GitHub](https://github.com/railwayapp-templates) for you to review. Railway also asks you for details about the GitHub repository your app will live in.

   ![Railway](./images/project-details.png)

5. Press **Deploy**

    Railway creates a repo in GitHub for you using the **NextJS Prisma** template as the source. It creates a Postgres instance with the repo to persist the application To-do list. Finally, Railway kicks off an initial deploy of your application.

4. Take a minute to review your deployed application in your dashboard.

    You can see that the Postgres plugin and the deployed `nextjs` app.

    ![Railway](./images/deployed-proj.png)


5. Click on the `nextjs` app to open the app details.

    You can see the that the deployed application is already being served. 

    ![Railway](./images/find-deploy.png)

6. Open the application.

    ![Railway](./images/todo-app.png)


## Develop the project locally

If you try to add a To-do to the app now, you will find you can't. You need to develop locally to get your app to work. The Railway dashboard provides some quick tips for doing this:

![Railway](./images/local-set-up.png)


So far Railway spun up a Postgres instance and a web server providing all the needed variables on deploy. TTo locate the GitHub source repository:

1. From the dashboard, choose the deployed nextjs project.
2. Click on Settings.
3. Scroll to the Source Repo value.
4. Click on the repo to open GitHub.
5. Copy the 'git clone' command appropriate for your environment.
6. Enter the command in your local shell.
7. Change into your new repo.
8. Install the Railway CLI.




 IN THIS  connect to that very same Postgres instance locally to help us develop our app.

1. Clone the Git repository for your template to your local environment.

3. Link to your project

    ```bash
    $ railway link 16605f74-44c7-4f65-802d-c10d8911517b
    A newer version of the Railway CLI is available, please update to: v3.3.1
    🚨 Not logged in.
    Run railway login
    ```

4. Correct this by logging in.

    ```
    railway login
    Press Enter to open the browser (^C to quit)
    🚅 Logging in... No dice? Try railway login --browserless
    🚊 Logging in... 
    🎉 Logged in as Moxiegirl (myemail@gmail.com)
    ```

Lets begin by cloning the repo you created on your machine.

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

Log in to your account by running the login command.

```bash
railway login
```

Then, when you are in your project's directory, link your repo to the template project with the following command.

```bash
railway link
```


`railway link` makes the Railway CLI aware of project variables when you run development commands locally. Something we will explore in depth in the next section.

### Run and Develop Your App

When developing locally, it's likely that you'll need environment variables to store sensitive connection strings. Railway provides those variables whenever you run the following command.

```bash
railway run <cmd>
```

We will inject all the environment variables inside your current Railway
[environment](develop/environments). This allows your application to take advantage of your plugins and any environment variables you wish to set up.

Locally install the project dependencies by running the following command.

```bash
yarn
```

Our code needs the Postgres DB connection variables to persist the To-Dos locally, `railway run` makes that possible.
Start the development server with the environment variables sourced by Railway through the CLI like so.

```bash
railway run yarn dev
```

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

<Image src="https://res.cloudinary.com/railway/image/upload/v1643748653/docs/railwayup_vhkdv8.gif"
alt="Railway Up in Action"
layout="intrinsic"
width={800} height={498} quality={100} />

This will create a [deployment](deploy/railway-up) using the current project and
environment. Click the returned link to see the build and deploy logs.

For projects based off of a GitHub repo like a template, [auto deploys](deploy/deployments#deploy-triggers) are automatically enabled. Commits on the main branch trigger a redeploy. You can also enable ephemeral deploy environments for PRs made in GitHub Repos.

After your deployment completes, you can see your new deployment live at the deployment's URL. If you added To-Dos while developing locally, you should see them on your deployment live. In a proper project, you would enable multiple environments to isolate your production environment.

This is only the beginning, there are many features we haven't yet covered in this guide that we will touch on in the next step.

## Closing

Railway aims to be the simplest way to develop, deploy, and diagnose issues with your application. Railway offers additional features that are worth exploring.

1. Railway lets you create parallel, identical environments for PRs/testing.
2. Railway lets you run as much (or as little) compute as you'd like with its usage based pricing and a metrics dashboard included in every project.
3. Adding team members to your projects is as easy as sending them an invite link.
4. Railway supports projects of any size, you can deploy additional services to the same project or deploy subdirectories of a monorepo.

As your Project scales, Railway scales with you by supporting multiple members per Project, Teams, and Autoscaling- leaving you to focus on what matters: your code.

Happy Building!

### Join the Community

Chat with Railway members, ask questions, and hang out on our [community Discord](https://discord.gg/xAm2w6g) with fellow builders! We'd love to have you.
