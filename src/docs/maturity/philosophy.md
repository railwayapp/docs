---
title: Philosophy
description: Explore Railway’s core philosophy and the principles that drive our platform.
---

Railway is a deployment platform that helps developers deliver their software through the entire application life-cycle through git native tooling, composable infrastructure, and built-in instrumentation.

We design and develop our product features to serve what we consider to be the three primary stages of software development:

- Development
- Deployment
- Diagnosis

Most developer-oriented products attempt to target one or more stages within the software development cycle. Railway provides solutions for developers for all of these stages, whereas some vendors focus on specific stages.

Railway is a company staffed with people who know developers would prefer to use tools they are familiar with. We believe software should be "take what you need, and leave what you don't." As a result, we are comfortable recommending additional vendors if they might acutely meet their needs. Our goal is for your unique need to be served so you can focus on delivering for your customers.

Companies should be as upfront as possible about their product and offerings to help you decide what is best for your team and users.

Let's talk about the number one use case: delivering apps to users in a Production environment. Railway, the company, is sustainable, building our product, team, and company to last as your projects.

## Objective

The goal of this section is to describe the processes, internal and external that companies have requested in our years of operation to help them build confidence to determine if Railway is a good fit for their company. Railway maintains a policy to be forthcoming and frank at all times. We would rather have a developer make the correct choice for their company than to adopt Railway and then come to regret that decision.

If you have any additional questions or if you require any additional disclosure you can contact us to set up a call at [team@railway.com](mailto:team@railway.com).

## Product Philosophy

Railway is focused on building an amazing developer experience. Our goal is to enable developers to deploy their code and see their work in action, without thinking about CI/CD, deployments, networking, and so forth, until they need to.

### Take What You Need

To achieve our goal, we've designed Railway to "just work", with all the necessary magic built in to achieve that. Railway at a high level reads your code repo, makes a best guess effort to build it into an [OCI compliant image](https://opencontainers.org/), and runs the image with a start command.

- Have a code repository but have yet to think about deployment? We got you. Connect your code repository and let Railway take care of the rest.
- Already built the perfect Dockerfile? Bring it. If you have a Dockerfile in your repo, we'll find it and use that to build your image.

If you've outgrown the "magic" built into deployment platforms, or are suspicious of things that are just too magical, we are happy to provide a high level overview of our architecture.

### Leave What You Don't

Streamlined deployment workflows and sane defaults are inherited by every project in Railway out of the box; but as a team of engineers, we at Railway are very aware that what works for one project does not always work for another. Or sometimes, you just need to be in control - maybe you already have a workflow you like, or maybe you need to layer Railway into existing infrastructure, and abstractions only get in your way.

That's why we've designed the platform for flexibility, wherever you need it.

On Railway, you can use the default pattern for deployment or opt to use vendor. In fact, we will even support you in your effort to integrate Railway in a unique way. Here are a couple of use cases we've helped customers take advantage of -

- Deploying to Railway from Gitlab CI/CD
- Supporting the development of a Terraform provider
- Region based routing to workloads via Cloudflare

We love working with our customers to solve interesting use cases. If you're not seeing a track for you, get in touch at [team@railway.com](mailto:team@railway.com) and we'll find it!

## High-level Architecture

As mentioned before, Railway at a high level takes your code, builds it, and throws it on running infrastructure on GCP. At a granular level Railway relies on a few systems to maintain workloads.

- Build Layer
  - Where archived folders of code or a Dockerfile (via GitHub or `railway up`) is sent to be built into an image
  - [Nixpacks](https://nixpacks.com/docs): the OSS software that reads your code and builds it via Nix
  - Image Registry: either via Dockerhub/GitHub packages, or a previously built image from Railway's Build servers
- Deployment Layer
  - Where images are ran in containers, images are pulled from the Build Layer
  - Databases on Railway are images + volumes mounted on a machine
  - Cron services are containers ran on a defined schedule
- Routing Layer
  - This is the system that Railway maintains that routes requests into your running containers and provides private networks to suites of containers.
- Logging Layer
  - A suite of machines networked running Clickhouse that store container logs. This is accessed when you open the service logs pane.
- Dashboard Layer
  - Infrastructure and code that is used to manage the above layers.
  - This also incudes any monitors that Railway uses to maintain the state of the Deployment Layer to maintain application state. (ex. Removing a deployment.)

Your code will either be in some, or all steps depending on the amount of Railway that you choose to adopt.

### Operational Procedures

Railway uses a suite of alerting vendors, additional internal tools, and PagerDuty to ensure uptime of our services described above. You can see Railway's uptime on our [Instatus page](https://railway.instatus.com/). Operational incident management reports and RCAs are available by request for those on an Enterprise plan.

### Do I have to change how I write code?

No, Railway is a deployment platform that works with your existing code. We don't require you to change how you write code or use any specific frameworks. We support all languages and frameworks that can be run in a Docker container or within Nixpacks.

### Is Railway serverless?

No, services on Railway are deployed in stateful Docker containers. The old deployments are removed on every new deploy.

We do have a feature, [App Sleeping](/reference/app-sleeping), that allows you to configure your service to "sleep" when it is inactive, and therefore will stop it from incurring usage cost while not in use.

## Book a Demo

If you're looking to adopt Railway for your business, we'd love to chat and ensure your questions are answered. [Click here to book some time with us](https://cal.com/team/railway/work-with-railway?duration=30).
