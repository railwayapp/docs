---
title: Deploying a Monorepo to Railway
---

## What is a Monorepo?

A monorepo is a project directory structure in which multiple, co-dependent codebases (such as a frontend and a backend) are maintained within the same repository, and in some cases, share common packages.

## About This Tutorial

Deploying a monorepo in Railway requires some extra configuration to get the applications up and running.

This tutorial aims to provide a simple step-by-step on how to deploy a frontend and backend from an isolated monorepo, one of the most commonly deployed types of monorepo. 

The procedure outlined in this tutorial can easily be adapted to deploy different apps that are contained within a isolated monorepo as well.

For more information on deploying a shared monorepo check out our <a href="/guides/monorepo#deploying-a-shared-monorepo" target="_blank">guide</a> that explains some of the specific configurations you would need.

**Objectives**

In this tutorial, you will learn how to -

- Create an empty project.
- Rename a project.
- Create empty services.
- Rename services.
- Generate domains for services.
- Set variables on a service.
- Connect a GitHub repo to a service. 

**Prerequisites**

To be successful using this tutorial, you should already have a monorepo that follows the same structure as the [example repo](https://github.com/railwayapp-templates/monorepo-example).

Or feel free to use the example repo to follow along!

**About the Example repo**

To demonstrate the process, a sample monorepo has been prepared -

- https://github.com/railwayapp-templates/monorepo-example

The frontend is built with [React](https://react.dev/) and [Vite](https://vitejs.dev/), and the static files are served with [Caddy](https://caddyserver.com/).

The backend, built with [Go](https://go.dev/), will stream quotes that will be displayed on the frontend.

**Let's get started!**

## 1. Create a New Empty Project

- From [your dashboard](https://railway.com/dashboard) click `+ New Project`

<Image src="https://res.cloudinary.com/railway/image/upload/v1721269034/docs/tutorials/monorepo/dashboard_zojmjg.png"
alt="Screenshot of dashboard"
layout="responsive"
width={1280} height={511} quality={100} />

- Choose `Empty project`

<Image src="https://res.cloudinary.com/railway/image/upload/v1721269027/docs/tutorials/monorepo/new_project_hxiif2.png"
alt="Screenshot of new project page"
layout="responsive"
width={345.5} height={388} quality={100} />

**Note:** We chose an empty project instead of deploying from a GitHub repo since we want to set up the project before deploying.

## 2. Project Setup

- Give the project an applicable name, this makes the project recognizable in your dashboard. You can do this in the Settings tab on the top right of the page.

<Image src="https://res.cloudinary.com/railway/image/upload/v1721269026/docs/tutorials/monorepo/project_settings_ym1vul.png"
alt="Screenshot of project settings"
layout="responsive"
width={1381} height={731} quality={100} />

- Click `Update`

## 3. Service Creation

- Add **two** new **empty** services from the `+ Create` button in the top right of the project canvas.

<Image src="https://res.cloudinary.com/railway/image/upload/v1721269020/docs/tutorials/monorepo/create_menu_gtpxtb.png"
alt="Screenshot of create menu"
layout="responsive"
width={735} height={510} quality={100} />

**Note:** We chose an empty service instead of deploying from a GitHub repo since we want to set up the service before deploying.

The result will look like this -

<Image src="https://res.cloudinary.com/railway/image/upload/v1721269019/docs/tutorials/monorepo/two_services_unamed_nmwimm.png"
alt="Screenshot of project canvas with two empty services"
layout="responsive"
width={766} height={450} quality={100} />

- Give them both applicable names.

    **Note:** This can be done easiest via the right-click context menu.

<Image src="https://res.cloudinary.com/railway/image/upload/v1721269022/docs/tutorials/monorepo/naming_a_service_qy7sg5.png"
alt="Screenshot of naming a service"
layout="responsive"
width={766} height={450} quality={100} />

In the case of this tutorial, they will be named `Frontend` and `Backend`

<Image src="https://res.cloudinary.com/railway/image/upload/v1721269024/docs/tutorials/monorepo/deploy_button_gmnqf8.png"
alt="Screenshot showing the deploy button"
layout="responsive"
width={766} height={450} quality={100} />

- Click the `Deploy` button to create these two services.

## 4. Domain Setup

Both of these services will need to be exposed publicly, so let's add public domains to both of them -

- Click on the service and then open its settings menu.

<Image src="https://res.cloudinary.com/railway/image/upload/v1721269032/docs/tutorials/monorepo/service_settings_networking_ckrss1.png"
alt="Screenshot showing the service settings"
layout="responsive"
width={1381} height={760} quality={100} />

- Click on `Generate Domain`

- Do these steps for both services, so that they both have public domains.

## 5. Variable Setup

For our example monorepo the Frontend service needs a `VITE_BACKEND_HOST` variable, and our backend needs an `ALLOWED_ORIGINS` variable.

Let's add the Frontend variable first.

- Click on Frontend service, then the `Variables` tab

- Add the required variable -

    ```plaintext
    VITE_BACKEND_HOST=${{Backend.RAILWAY_PUBLIC_DOMAIN}}
    ```
It should look like this once added:

<Image src="https://res.cloudinary.com/railway/image/upload/v1721269049/docs/tutorials/monorepo/adding_frontend_variables_jqn4rf.png"
alt="Screenshot showing the frontend service variables"
layout="responsive"
width={1386} height={760} quality={100} />

Now let's add the Backend variable.

- Click on the Backend service, then the `Variables` tab

- Add the required variable -

    ```plaintext
    ALLOWED_ORIGINS=${{Frontend.RAILWAY_PUBLIC_DOMAIN}}
    ```

It should look like this once added:

<Image src="https://res.cloudinary.com/railway/image/upload/v1721269042/docs/tutorials/monorepo/adding_backend_variables_aplgej.png"
alt="Screenshot showing the backend service variables"
layout="responsive"
width={1386} height={760} quality={100} />

- Click the `Deploy` button to save these changes.

**Notes:**

- The variables used here are reference variables, learn more about them [here](https://docs.railway.com/guides/variables#referencing-another-services-variable).

- Both the Frontend and Backend variables reference each other's public domains. The `RAILWAY_PUBLIC_DOMAIN` variable will be automatically updated whenever you deploy or re-deploy a service.

- See a list of additional variables [here](https://docs.railway.com/reference/variables#railway-provided-variables).

## 6. Directory Setup

Both of our apps deploy from subdirectories of our monorepo, so we need to tell Railway where they are located.

- Open the Frontend service to its service settings and you will see a **Root Directory** option, in this case, we will set it to `/frontend`

<Image src="https://res.cloudinary.com/railway/image/upload/v1721269052/docs/tutorials/monorepo/frontend_root_dir_e52vkz.png"
alt="Screenshot showing the frontend root directory"
layout="responsive"
width={1386} height={760} quality={100} />

- Open the Backend service settings and we will set its root directory to `/backend`

<Image src="https://res.cloudinary.com/railway/image/upload/v1721269046/docs/tutorials/monorepo/backend_root_dir_misneo.png"
alt="Screenshot showing the backend root directory"
layout="responsive"
width={1386} height={760} quality={100} />

- Click the `Deploy` button to save these changes.

## 7. Connecting the Repo

Now we need to configure the source of the service where the code is deployed.

- Open the service settings for each service and connect your monorepo.

Frontend

<Image src="https://res.cloudinary.com/railway/image/upload/v1721269039/docs/tutorials/monorepo/frontend_repo_connect_llgsmf.png"
alt="Screenshot showing the frontend repo connected"
layout="responsive"
width={1386} height={760} quality={100} />

Backend

<Image src="https://res.cloudinary.com/railway/image/upload/v1721269044/docs/tutorials/monorepo/backend_repo_connect_evt8v3.png"
alt="Screenshot showing the backend repo connected"
layout="responsive"
width={1386} height={760} quality={100} />

- Click the `Deploy` button to finally deploy your applications

**Your services should now start building and then deploy.**

## Conclusion

Congratulations! You have setup a project, setup services, added variables and deployed your monorepo project to Railway.  The Frontend service should be accessible on its public domain to access the deployed website.
