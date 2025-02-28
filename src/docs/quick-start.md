---
title: Quick Start Tutorial
description: Get started with Railway in minutes! This Quick Start tutorial walks you through deploying your first app via GitHub, the CLI, a Docker image, or a template.
---

Railway is a deployment platform that lets you provision infrastructure, develop locally with that infrastructure, and deploy to the cloud or simply run ready-made software from our template marketplace.

**In this guide we will cover two different topics to get you quickly started with the platform -**

1. **Deploying your project** - Bring your code and let Railway handle the rest.

    **[Option 1](/quick-start#deploying-your-project---from-github)**  - Deploying from **GitHub**.

    **[Option 2](/quick-start#deploying-your-project---with-the-cli)** - Deploying with the **[CLI](/guides/cli)**.

    **[Option 3](/quick-start#deploying-your-project---from-a-docker-image)** - Deploying from a **Docker Image**.

3. **Deploying a <a href="reference/templates" target="_blank">template</a>** - Ideal for deploying pre-configured software with minimal effort.

To demonstrate deploying directly from a GitHub repository through Railway's dashboard, we'll be using a basic <a href="https://github.com/railwayapp-templates/nextjs-basic" target="_blank">NextJS app</a> that was prepared for this guide.


For the template deployment, we'll use the <a href="https://railway.com/template/umami-analytics" target="_blank">Umami template</a> from our <a href="https://railway.com/templates" target="_blank">template marketplace</a>.

## Deploying Your Project - From GitHub

If this is your first time deploying code on Railway, we recommend <a href="https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo" target="_blank">forking</a> the previously mentioned <a href="https://github.com/railwayapp-templates/nextjs-basic" target="_blank">NextJS app</a>'s repository so that you can follow along.

To get started deploying our NextJS app, we will first make a new <a href="/overview/the-basics#project--project-canvas" target="_blank">project</a>.

- Open up the <a href="/overview/the-basics#dashboard--projects" target="_blank">dashboard</a> → Click **New Project**.

- Choose the **GitHub repo** option.

<Image src="https://res.cloudinary.com/railway/image/upload/v1723752559/docs/quick-start/new_project_uyqqpx.png"
alt="screenshot of new project menu with deploy from github selected"
layout="responsive"
width={836} height={860} quality={100} />

*Railway requires a valid GitHub account to be linked. If your Railway account isn't associated with one, you will be prompted to link it.*

- Search for your GitHub project and click on it.

<Image src="https://res.cloudinary.com/railway/image/upload/v1723752559/docs/quick-start/new_github_project_pzvabz.png"
alt="screenshot of new project menu with nextjs repo selected"
layout="responsive"
width={836} height={596} quality={100} />

- Choose either **Deploy Now** or **Add variables**.

    **Deploy Now** will immediately start to build and deploy your selected repo.

    **Add Variables** will bring you to your service and ask you to add variables, when done you will need to click the **Deploy** button at the top of your canvas to initiate the first deployment.

    *For brevity we will choose **Deploy Now**.*

<Image src="https://res.cloudinary.com/railway/image/upload/v1723752558/docs/quick-start/deploy_now_pmrqow.png"
alt="screenshot of new project menu with deploy now option selected"
layout="responsive"
width={836} height={620} quality={100} />

When you click **Deploy Now**, Railway will create a new project for you and kick off an initial deploy after the project is created.

**Once the project is created you will land on your <a href="/quick-start#the-canvas" target="_blank">Project Canvas</a>**.

## Deploying Your Project - With the CLI

As with the [Deploy from GitHub guide](/quick-start#deploying-your-project---from-github), if you're deploying code with the CLI for the first time, it's recommended to <a href="https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo" target="_blank">fork</a> the <a href="https://github.com/railwayapp-templates/nextjs-basic" target="_blank">NextJS app</a>'s repository to follow along. Since we'll be deploying local code, you'll also need to <a href="https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository" target="_blank">clone</a> the forked repository.

The CLI can create a new project entirely from the command line, we will use it to scaffold our project.

- Open up a command prompt inside of our local project.

- Run `railway init`

    This will create a new empty project with the name we provided, which will be used for any subsequent commands.

<Image src="https://res.cloudinary.com/railway/image/upload/v1723752558/docs/quick-start/railway_init_rglt5w.png"
alt="screenshot of the command line after railway init was run"
layout="responsive"
width={836} height={233} quality={100} />

Deploying your code is now only a single command away.

- Run `railway up`

    The CLI will now scan our project files, compress them, and upload them to Railway's backend for deployment.

<Image src="https://res.cloudinary.com/railway/image/upload/v1723752558/docs/quick-start/railway_up_vns3u4.png"
alt="screenshot of the command line after railway up was run"
layout="responsive"
width={836} height={214} quality={100} />

**You can now run `railway open` and you will taken to your [Project Canvas](/quick-start#the-canvas)**.

## Deploying Your Project - From a Docker Image

Railway supports deploying pre-built Docker images from the following registries:

- <a href="https://hub.docker.com" target="_blank">Docker Hub</a>
- <a href="https://ghcr.io" target="_blank">GitHub Container Registry</a>
- <a href="https://quay.io" target="_blank">RedHat Container Registry</a>
- <a href="https://docs.gitlab.com/ee/user/packages/container_registry" target="_blank">GitLab Container Registry</a>

To get started deploying a Docker image, we will first make a new <a href="/overview/the-basics#project--project-canvas" target="_blank">project</a>.

- Open up the <a href="/overview/the-basics#dashboard--projects" target="_blank">dashboard</a> → Click **New Project**.

- Choose the **Empty project** option.

<Image src="https://res.cloudinary.com/railway/image/upload/f_auto,q_auto/v1727281981/docs/quick-start/emptyproject_q8vqfz.png"
alt="screenshot of new project menu with deploy from github selected"
width={836} height={714} quality={100} />

After the project is created, you will land on the <a href="/quick-start#the-canvas" target="_blank">Project Canvas</a>. A panel will appear prompting you to Add a Service.

<Image src="https://res.cloudinary.com/railway/image/upload/f_auto,q_auto/v1727281215/docs/quick-start/add_a_service.png"
alt="screenshot of add a service panel on the canvas"
layout="responsive"
width={1422} height={1284} quality={100} />

- Click **Add a Service** and select the **Docker Image** option from the modal that pops up.

<Image src="https://res.cloudinary.com/railway/image/upload/f_auto,q_auto/v1727280789/docs/quick-start/select_docker_image_bdyltc.png"
alt="screenshot of select docker image option selected"
layout="responsive"
width={1693} height={1347} quality={100} />

- In the **Image name** field, enter the name of the Docker image, e.g, `blueriver/nextjs` and press Enter.

<Image src="https://res.cloudinary.com/railway/image/upload/f_auto,q_auto/v1727280788/docs/quick-start/blueriver_docker_image_zcn9py.png"
alt="screenshot of example docker image name, blueriver/nextjs in modal"
layout="responsive"
width={1775} height={1157} quality={100} />

If you're using a registry other than Docker Hub (such as GitHub, GitLab, Quay), you need to provide the full Docker image URL from the respective registry.

<Image src="https://res.cloudinary.com/railway/image/upload/f_auto,q_auto/v1727280788/docs/quick-start/enter_docker_image_name_rzjbis.png"
alt="screenshot of docker image name entry in modal"
layout="responsive"
width={1987} height={1409} quality={100} />

- Press Enter and click **Deploy**.

Railway will now provision a new service for your project based on the specified Docker image.

And that's it! 🎉 Your project is now ready for use.

**Note:** Deploying from a [private Docker registry is available on the Pro plan](/guides/services#deploying-a-private-docker-image).

## The Canvas

Whether you deploy your project through the dashboard with GitHub or locally using the CLI, you'll ultimately arrive at your project canvas.

<Image src="https://res.cloudinary.com/railway/image/upload/f_auto,q_auto/v1723752560/docs/quick-start/project_canvas_nextjs_c6bjbq.png"
alt="screenshot of the project canvas showing our nextjs deploy"
layout="responsive"
width={1363} height={817} quality={100} />

This is your _mission control_. Your project's infrastructure, <a href="/guides/environments" target="_blank">environments</a>, and <a href="/guides/deployments" target="_blank">deployments</a> are all
controlled from here.

Once the initial deployment is complete, your app is ready to go. If applicable, generate a domain by clicking <a href="/guides/public-networking#railway-provided-domain" target="_blank">Generate Domain</a> within the <a href="/overview/the-basics#service-settings" target="_blank">service settings</a> panel.

**Additional Information -**

If anything fails during this time, you can explore your <a href="/guides/logs#build--deploy-panel" target="_blank">build or deploy logs</a> for clues. A helpful tip is to scroll through the entire log; important details are often missed, and the actual error is rarely at the bottom!

If you're stuck don't hesitate to open a <a href="https://station.railway.com/questions" target="_blank">Help Thread</a>.

## Deploying a Template

Railway's <a href="https://railway.com/templates" target="_blank">template marketplace</a> offers over 650+ unique templates that have been created both by the community and Railway!

Deploying a template is not too dissimilar to deploying a GitHub repo -

- Open up the <a href="/overview/the-basics#dashboard--projects" target="_blank">dashboard</a> → Click **New Project**.

- Choose **Deploy a template**.

<Image src="https://res.cloudinary.com/railway/image/upload/f_auto,q_auto/v1723752559/docs/quick-start/template_new_project_k9kfrh.png"
alt="screenshot of new project menu with deploy a template option selected"
layout="responsive"
width={836} height={860} quality={100} />

- Search for your desired template.

    *Hint: If your desired template isn't found feel free to <a href="https://station.railway.com/questions" target="_blank">reach out to the community</a>.*

- Click on the template you want to deploy.

<Image src="https://res.cloudinary.com/railway/image/upload/f_auto,q_auto/v1723752558/docs/quick-start/template_new_umami_j4la5d.png"
alt="screenshot of new project menu the umami template selected"
layout="responsive"
width={836} height={644} quality={100} />

*Hint: Generally it's best to choose the template with a combined higher deployment and success count.*

- Fill out any needed information that the template may require.

    In the case of our Umami template, we don't need to provide any extra information.

<Image src="https://res.cloudinary.com/railway/image/upload/f_auto,q_auto/v1723752558/docs/quick-start/template_config_options_zaxbko.png"
alt="screenshot of the deploy umami screen with no extra configurations needed"
layout="responsive"
width={932} height={908} quality={100} />

- Click **Deploy**.

Railway will now provision a new project with all services and configurations that were defined in the template.

That's it, deploying a template is as easy as a few clicks!

<Image src="https://res.cloudinary.com/railway/image/upload/f_auto,q_auto/v1723752560/docs/quick-start/project_canvas_umami_lb759i.png"
alt="screenshot of the project canvas showing umami and postgres"
layout="responsive"
width={1363} height={817} quality={100} />

## Closing

Railway aims to be the simplest way to develop, deploy, and diagnose issues with your application.

As your Project scales, Railway scales with you by supporting multiple Teams, vertical scaling, and horizontal scaling; leaving you to focus on what matters: your code.

Happy Building!

### What to Explore Next

- **[Environments](/guides/environments)** - Railway lets you create parallel, identical environments for PRs/testing.

- **[Observability Dashboard](/guides/observability)** - Railway's built-in observability dashboard offers a customizable view of metrics, logs, and usage in one place.

- **[Project Members](/reference/project-members)** - Adding members to your projects is as easy as sending them an invite link.

- **[Staged Changes](/guides/staged-changes)** - When you make changes to your Railway project, such as adding or removing components and configurations, these updates will be gathered into a changeset for you to review and apply.

### Join the Community

Chat with Railway members, ask questions, and hang out in our <a href="https://discord.gg/railway" target="_blank">Discord community</a> with fellow builders! We'd love to have you!