---
title: Quick Start Tutorial
---

Railway is a deployment platform that lets you provision infrastructure, develop locally with that infrastructure, and deploy to the cloud or simply run ready-made software from our template marketplace.

**In this guide we will cover two different topics to get you quickly started with the platform -**

1. Deploying a template.

2. Deploying your own project.

For our template deployment, we'll use the <a href="https://railway.app/template/umami-analytics" target="_blank">Umami template</a>, and for the project, we'll utilize a basic <a href="https://github.com/railwayapp-templates/nextjs-basic" target="_blank">NextJS app</a> app.

## Deploying Your Own Project

To deploy our NextJS app, we will make a new <a href="/overview/the-basics#project--project-canvas" target="_blank">project</a>.

- Open up the [dashboard](/overview/the-basics#dashboard--projects) → Click **New Project**.

- Choose the **GitHub repo** option.

<!-- image here -->

    Railway requires a valid GitHub account to be linked. If your Railway account isn't associated with one, you will be prompted to link it.

- Search for your GitHub project and click on it.

<!-- image here -->

- Choose either **Deploy Now** or **Add variables**.

<!-- image here -->

    **Deploy Now** will immediately start to build and deploy your selected repo.

    **Add Variables** will bring you to your service and ask you to add variables, when done you will need to click the **Deploy** button at the top of your canvas to initiate the deployment.

    *For brevity we will choose **Deploy Now**.*

Once the project and service is created you will land on your project canvas, This is your _mission control_. Your project's infrastructure, [environments](/guides/environments), and [deployments](/guides/deployments) are all
controlled from here.

At this stage Railway will attempt to [build your application](/reference/deployments#how-it-works) with nixpacks, or a Dockerfile if present.

You can view the progress of the build by clicking on the service and then Clicking **View Logs**.

Congrats! Once the initial deployment is complete, your app is ready to go. If applicable, generate a domain by clicking [Generate Domain](https://docs.railway.app/guides/public-networking#railway-provided-domain) within the [service settings](https://docs.railway.app/overview/the-basics#service-settings) panel.

**Additional Information -**

If anything fails during this time, you can explore your [build or deploy logs](https://docs.railway.app/guides/logs#build--deploy-panel) for clues. A helpful tip is to scroll through the entire log; important details are often missed, and the actual error is rarely at the bottom!

If you're stuck don't hesitate to open a [Help Thread](https://help.railway.app/questions).

## Deploying a Template

Railway's [template marketplace](https://railway.app/templates) offers over 650+ unique templates that have been created both by the community and Railway!

Deploying a template is not too dissimilar to deploying a GitHub repo -

- Open up the [dashboard](/overview/the-basics#dashboard--projects) → Click **New Project**.

- Choose **Deploy a template**.

<!-- TODO: Finish -->

## Closing

Railway aims to be the simplest way to develop, deploy, and diagnose issues with your application. Railway offers additional features that are worth exploring:

- **[Environments](/guides/environments)** - Railway lets you create parallel, identical environments for PRs/testing.

- **[Observability Dashboard](/guides/observability)** - Railway’s built-in observability dashboard offers a customizable view of metrics, logs, and usage in one place.

- **[Project Members](/reference/project-members)** - Adding members to your projects is as easy as sending them an invite link.

- **[Staged Changes](/guides/staged-changes)** - When you make changes to your Railway project, such as adding or removing components and configurations, these updates will be gathered into a changeset for you to review and apply.

As your Project scales, Railway scales with you by supporting multiple Teams, and vertical scaling; leaving you to focus on what matters: your code.

Happy Building!

### Join the Community

Chat with Railway members, ask questions, and hang out in our [community Discord](https://discord.gg/railway) with fellow builders! We'd love to have you!
