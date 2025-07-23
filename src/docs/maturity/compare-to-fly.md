---
title: Railway vs. Fly
description: Compare Railway and Fly.io on deployment model, scaling, pricing and developer workflow
---

At a high level, both Railway and Fly.io can be used to deploy your app. Both platforms share several similarities:

- You can deploy your app from a Docker image or by importing your app’s source code from GitHub.
- Apps are deployed to a long-running server.
- Apps can have persistent storage through volumes.
- Public and private networking are included out-of-the-box.
- Multi-region deployments.
- Both platforms’ infrastructure runs on hardware that’s owned and operated in data centers across the globe.
- Healthchecks to guarantee zero-downtime deployments.

That said, there are differences between both platforms when it comes to the overall developer experience that can make Railway a better fit for you.

## Deployment model & scaling

### Fly

When you deploy your app to Fly, your code runs on lightweight Virtual Machines (VMs) called [Fly Machines](https://fly.io/docs/machines/). Each machine needs a defined amount of CPU and memory. You can either choose from [preset sizes](https://fly.io/docs/about/pricing/#started-fly-machines) or configure them separately, depending on your app’s needs.

Machines come with two types of virtual CPUs: `shared` and `performance`.

Shared CPUs are the more affordable option. They guarantee a small slice of CPU time (around 6%) but can burst to full power when there’s extra capacity. This makes them ideal for apps that are mostly idle but occasionally need to handle traffic—like APIs or web servers. Just keep in mind that heavy usage can lead to throttling.

Performance CPUs, by contrast, give you dedicated access to the CPU at all times. There’s no bursting or throttling, making them a better choice for workloads that require consistent, high performance.

Scaling your app

When scaling your app, you have one of two options:

1. Scale a machine’s CPU and RAM:  you will need to manually pick a larger instance. You can do this using the Fly CLI or API.
2. Increase the number of running machines. There are two options:
    1. You can manually increase the number of running machines using the Fly CLI or API.
    2. Fly can automatically adjust the number of running or created Fly Machines dynamically. Two forms of autoscaling are supported.
        1. Autostop/autostart Machines: You create a “pool” of Machines in one or more regions and Fly’s Proxy start/suspend Machines based on incoming requests.  With this option, Machines are never created or deleted, you need to specify how many machines your app will need.
        2. Metrics-based autoscaling: this is not supported out-of-the-box. However, you can deploy [`fly-autoscaler`](https://github.com/superfly/fly-autoscaler) which polls metrics and automatically creates/deletes or starts/stops existing Machines based on the metrics you define.
        

![Scaling your app on Fly.io](https://res.cloudinary.com/railway/image/upload/v1753083711/docs/scaling-your-app-on-fly_pe6clo.png)

### Railway

Railway automatically manages compute resources for you. Your deployed services can scale up or down based on incoming workload without manual configuration of metrics/thresholds or picking instance sizes. Each plan includes defined CPU and memory limits that apply to your services.

You can scale horizontally by deploying multiple replicas of your service. Railway automatically distributes public traffic randomly across replicas within each region. Each replica runs with the full resource limits of your plan.

For example, if you're [on the Pro plan](/reference/pricing/plans), each replica gets 32 vCPU and 32 GB RAM. So, deploying 3 replicas gives your service a combined capacity of 96 vCPU and 96 GB RAM.

```text
Total resources = number of replicas × maximum compute allocation per replica
```

Replicas can be placed in different geographical locations. The platform automatically routes public traffic to the nearest region, then randomly distributes requests among the available replicas within that region.


<video
  src="https://res.cloudinary.com/railway/video/upload/v1753083716/docs/replicas_dmvuxp.mp4"
  muted
  autoplay
  loop
  controls
>
Add replicas to your service
</video>

You can also set services to start on a schedule using a crontab expression. This lets you run scripts at specific times and only pay for the time they’re running.

## Pricing

### Fly

Fly charges for compute based on two primary factors: machine state and CPU type (`shared`  vs. `performance`)

Machine state determines the base charge structure. Started machines incur full compute charges, while stopped machines are only charged for root file system (rootfs) storage. The rootfs size depends on your OCI image plus [containerd](https://containerd.io/) optimizations applied to the underlying file system. 

[Pricing for different preset sizes is available in Fly's documentation](https://fly.io/docs/about/pricing/#started-fly-machines). You can get a discount by reserving compute time blocks. This requires paying the annual amount upfront, then receiving monthly credits equal to the "per month" rate. Credits expire at month-end and do not roll over to subsequent months. The trade-off is you might end up paying for unused resources.

![Fly compute presets pricing](https://res.cloudinary.com/railway/image/upload/v1753083710/docs/fly-pricing_fpda5v.png)

One important consideration is that Fly Machines incur cost based *on running time*. Even with zero traffic or resource utilization, you pay for the entire duration a machine remains in a running state. While machines can be stopped to reduce costs, any time spent running generates full compute charges regardless of actual usage.

### Railway

Railway follows a usage-based pricing model that depends on how long your service runs and the amount of resources it consumes.

```text
Active compute time x compute size (memory and CPU)
```

If you spin up multiple replicas for a given service, you’ll only be charged for the active compute time for each replica.

![Railway autoscaling](https://res.cloudinary.com/railway/image/upload/v1753083711/docs/railway-autoscaling_nf5hrc.png)

## Developer Workflow & CI/CD

### Fly

Fly provides a CLI-first experience through `flyctl`, allowing you to create and deploy apps, manage Machines and volumes, configure networking, and perform other infrastructure tasks directly from the command line.

However, Fly lacks built-in CI/CD capabilities. This means you can't:

- Create isolated preview environments for every pull request.
- Perform instant rollbacks.

To access these features, you'll need to integrate third-party CI/CD tools like [GitHub Actions.](https://github.com/features/actions)

Similarly, Fly doesn't include native environment support for development, staging, and production workflows. To achieve proper environment isolation, you must create separate organizations for each environment and link them to a parent organization for centralized billing management.

For monitoring, Fly automatically collects metrics from every application using a fully-managed Prometheus service based on VictoriaMetrics. The system scrapes metrics from all application instances and provides data on HTTP responses, TCP connections, memory usage, CPU performance, disk I/O, network traffic, and filesystem utilization.

The Fly dashboard includes a basic Metrics tab displaying this automatically collected data. Beyond the basic dashboard, Fly offers a managed Grafana instance at [fly-metrics.net](http://fly-metrics.net) with detailed dashboards and query capabilities using MetricsQL as the querying language. You can also connect external tools through the Prometheus API.

![fly-metrics.net](https://res.cloudinary.com/railway/image/upload/v1753083710/docs/fly-metrics.net_d6r3cs.png)


Advanced features like alerting and custom dashboards require working with multiple tools and query languages, creating a learning curve for teams wanting sophisticated monitoring capabilities. 

Additionally, Fly doesn't support webhooks, making it more difficult to build integrations with external services.

### Railway

Railway follows a dashboard-first experience, while [also providing a CLI](https://docs.railway.com/guides/cli). In Railway, you create a project for each app you’re building. A project is a collection of services and databases. This can include frontend, API, background workers, API, analytics database, queues and so much more. All in a unified deployment experience that supports real-time collaboration.

![Railway architecture](https://res.cloudinary.com/railway/image/upload/v1737785173/docs/the-basics/project_canvas_dxpzxe.png)

Additionally, Railway offers a template directory that makes it easy to self-host open-source projects with just a few clicks. If you publish a template and others deploy it in their projects, you’ll earn a 50% kickback of their usage costs.

Check out all templates at [railway.com/deploy](http://railway.com/deploy) 

<video
  src="https://res.cloudinary.com/railway/video/upload/v1753083712/docs/railway.com_templates_zcydjb.mp4"
  muted
  autoplay
  loop
  controls
>
Railway templates
</video>

You also get:

- First-class support for environments so you can isolate production, staging, development, testing, etc.
- GitHub integration with support for provisioning isolated preview environments for every pull request.
- Ability to do instant rollbacks for your deployments.

Each Railway project includes a built-in observability dashboard that provides a customizable view into chosen metrics, logs, and data all in one place

[Screenshot of the Observability Dashboard](https://docs.railway.com/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Frailway%2Fimage%2Fupload%2Fv1717179720%2FWholescreenshot_vc5l5e.png&w=3840&q=80)

Finally, Railway supports creating webhooks which allow external services to listen to events from Railway

![Webhooks](https://res.cloudinary.com/railway/image/upload/v1753083711/docs/railway-webhooks_r4ervy.png)


## Summary

| Category                 | Railway                                                                            | Fly.io                                                                                                                                       |
| ------------------------ | ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Scaling                  | Auto-scaling included (no manual config); supports horizontal scaling via replicas | Manual vertical/horizontal scaling or horizontal autoscaling (via `fly-autoscaler`); two autoscaling options (autostop/start, metrics-based) |
| Compute Pricing          | Usage-based where you’re only billed for active compute time                       | Based on machine uptime (started = full price); unused time still billed unless stopped                                                      |
| CI/CD Integration        | Built-in GitHub integration with preview environments and instant rollbacks        | No built-in CI/CD; requires third-party tools like GitHub Actions                                                                            |
| Environments Support     | First-class support for multiple environments (dev, staging, prod, etc.)           | Requires creating separate orgs per environment                                                                                              |
| Monitoring & Metrics     | Built-in observability dashboard (metrics, logs, data all in one place)            | Prometheus-based metrics + optional Grafana (`fly-metrics.net`) for deep dives                                                               |
| Webhooks & Extensibility | Webhook support for integrations                                                   | No support for outbound webhooks                                                                                                             |
| Developer Experience     | Dashboard-first, supports real-time team collaboration, CLI available              | CLI-first (`flyctl`) for all management tasks                                                                                                |


## Migrate from Fly.io to Railway

To get started, [create an account on Railway](https://railway.com/new). You can sign up for free and receive $5 in credits to try out the platform.


1. “Choose Deploy from GitHub repo”, connect your GitHub account, and select the repo you would like to deploy.
    
    ![Railway Deploy New Project](https://res.cloudinary.com/railway/image/upload/v1753083710/docs/railway-new-project_tte4eb.png)
    

2. If your project is using any environment variables or secrets:
    1. Click on the deployed service.
    2. Navigate to the “Variables” tab.
    3. Add a new variable by clicking the “New Variable” button. Alternatively, you can import a `.env` file by clicking “Raw Editor” and adding all variables at once.
    

![Railway Variables](https://res.cloudinary.com/railway/image/upload/v1753083710/docs/railway-variables_iq3rgd.png)

1. To make your project accessible over the internet, you will need to configure a domain:
    1. From the project’s canvas, click on the service you would like to configure.
    2. Navigate to the “Settings” tab.
    3. Go to the “Networking” section.
    4. You can either:
        1. Generate a Railway service domain: this will make your app available under a `.up.railway.app` domain.
        2. Add a custom domain: follow the DNS configuration steps.


## Need help or have questions?

If you need help along the way, the [Railway Discord](http://discord.gg/railway) and [Help Station](https://station.railway.com/) are great resources to get support from the team and community.

For larger workloads or specific requirements, you can [book a call with the Railway team](https://cal.com/team/railway/work-with-railway) to explore how we can best support your project.