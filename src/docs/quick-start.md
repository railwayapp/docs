---
title: Quick Start Tutorial
---

Railway is a deployment platform that lets you provision infrastructure, develop locally with that infrastructure, and deploy to the cloud or simply run ready-made software from our template marketplace.

**In this guide we will cover two different topics to get you quickly started with the platform -**

2. **Deploying your project** - Bring your code and let Railway handle the rest.

2. **Deploying a template** - Ideal for deploying pre-configured software with minimal effort.

For our project, we'll utilize a basic <a href="https://github.com/railwayapp-templates/nextjs-basic" target="_blank">NextJS app</a>, and for the template deployment, we'll use the <a href="https://railway.app/template/umami-analytics" target="_blank">Umami template</a>.

## Deploying Your Project

To deploy our NextJS app, we will make a new <a href="/overview/the-basics#project--project-canvas" target="_blank">project</a>.

- Open up the <a href="/overview/the-basics#dashboard--projects" target="_blank">dashboard</a> → Click **New Project**.

- Choose the **GitHub repo** option.

<Image src="https://res.cloudinary.com/railway/image/upload/v1723688396/docs/quick-start/new_project_yqozgu.png"
alt="screenshot of new project menu with deploy from github selected"
layout="responsive"
width={836} height={860} quality={100} />

    *Railway requires a valid GitHub account to be linked. If your Railway account isn't associated with one, you will be prompted to link it.*

- Search for your GitHub project and click on it.

<Image src="https://res.cloudinary.com/railway/image/upload/v1723688396/docs/quick-start/new_github_project_wrwxu8.png"
alt="screenshot of new project menu with nextjs repo selected"
layout="responsive"
width={836} height={596} quality={100} />

- Choose either **Deploy Now** or **Add variables**.

<Image src="https://res.cloudinary.com/railway/image/upload/v1723688396/docs/quick-start/deploy_now_dmvyhf.png"
alt="screenshot of new project menu with deploy now option selected"
layout="responsive"
width={836} height={620} quality={100} />

    **Deploy Now** will immediately start to build and deploy your selected repo.

    **Add Variables** will bring you to your service and ask you to add variables, when done you will need to click the **Deploy** button at the top of your canvas to initiate the deployment.

    *For brevity we will choose **Deploy Now**.*

Once the project and service are created you will land on your project canvas, This is your _mission control_. Your project's infrastructure, <a href="/guides/environments" target="_blank">environments</a>, and <a href="/guides/deployments" target="_blank">deployments</a> are all
controlled from here.

<Image src="https://res.cloudinary.com/railway/image/upload/v1723688396/docs/quick-start/project_canvas_nextjs_l1meyt.png"
alt="screenshot of new project menu with deploy now option selected"
layout="responsive"
width={1365} height={820} quality={100} />

Congrats! Once the initial deployment is complete, your app is ready to go. If applicable, generate a domain by clicking <a href="https://docs.railway.app/guides/public-networking#railway-provided-domain" target="_blank">Generate Domain</a> within the <a href="https://docs.railway.app/overview/the-basics#service-settings" target="_blank">service settings</a> panel.

**Additional Information -**

If anything fails during this time, you can explore your <a href="https://docs.railway.app/guides/logs#build--deploy-panel" target="_blank">build or deploy logs</a> for clues. A helpful tip is to scroll through the entire log; important details are often missed, and the actual error is rarely at the bottom!

If you're stuck don't hesitate to open a <a href="https://help.railway.app/questions" target="_blank">Help Thread</a>.

## Deploying a Template

Railway's <a href="https://railway.app/templates" target="_blank">template marketplace</a> offers over 650+ unique templates that have been created both by the community and Railway!

Deploying a template is not too dissimilar to deploying a GitHub repo -

- Open up the <a href="/overview/the-basics#dashboard--projects" target="_blank">dashboard</a> → Click **New Project**.

- Choose **Deploy a template**.

<Image src="https://res.cloudinary.com/railway/image/upload/v1723688397/docs/quick-start/template_new_project_d316nq.png"
alt="screenshot of new project menu with deploy a template option selected"
layout="responsive"
width={836} height={860} quality={100} />

- Search for your desired template.

    *Hint: If your desired template isn't found feel free to <a href="https://help.railway.app/questions" target="_blank">reach out to the community</a>.*

- Click on the template you want to deploy.

<Image src="https://res.cloudinary.com/railway/image/upload/v1723688396/docs/quick-start/template_new_umami_syevx0.png"
alt="screenshot of new project menu the umami template selected"
layout="responsive"
width={836} height={644} quality={100} />

    *Hint: Generally it's best to choose the template with a combined higher deployment and success count.*

- Fill out any needed information that the template may require.

    In the case of our Umami template we don't need to provide any extra information.

<Image src="https://res.cloudinary.com/railway/image/upload/v1723688396/docs/quick-start/template_config_options_orzndo.png"
alt="screenshot of the deploy umami template screen"
layout="responsive"
width={932} height={908} quality={100} />

- Click **Deploy**.

Railway will now provision a new project with all services and configurations that where defined in the template.

Thats it, deploying a template is as easy as a few clicks!

<Image src="https://res.cloudinary.com/railway/image/upload/v1723688397/docs/quick-start/project_canvas_umami_mxcmwo.png"
alt="screenshot of project canvas showing umami and postgres"
layout="responsive"
width={1365} height={820} quality={100} />

## Closing

Railway aims to be the simplest way to develop, deploy, and diagnose issues with your application.

As your Project scales, Railway scales with you by supporting multiple Teams, and vertical scaling; leaving you to focus on what matters: your code.

Happy Building!

### What to Explore Next

- **[Environments](/guides/environments)** - Railway lets you create parallel, identical environments for PRs/testing.

- **[Observability Dashboard](/guides/observability)** - Railway's built-in observability dashboard offers a customizable view of metrics, logs, and usage in one place.

- **[Project Members](/reference/project-members)** - Adding members to your projects is as easy as sending them an invite link.

- **[Staged Changes](/guides/staged-changes)** - When you make changes to your Railway project, such as adding or removing components and configurations, these updates will be gathered into a changeset for you to review and apply.

### Join the Community

Chat with Railway members, ask questions, and hang out in our <a href="https://discord.gg/railway" target="_blank">community Discord</a> with fellow builders! We'd love to have you!
