---
title: Use Cases
---

Railway is suited for a variety of use-cases. This page will walk-through what the platform is perfect for today and our recommendations for apps of all sizes.

As mentioned in our philosophy document. Railway will make a best effort to provide all the information a developer needs to make the best choice for their workload. 

## Is Railway Production Ready?

Many of our customers use Railway to reliably deploy their applications to customers at scale. With that said, Production standards are going to be different depending on what your users expect. We have a companies that use Railway in a variety of different verticals such as:

- Enterprise SaaS
- Consumer Social
- Education
- E-Commerce
- Crypto
- ML/AI
- Agencies

Companies on Railway range from hobby projects, to extremely fast growing startups, to publicly traded companies. Railway has been incrementally adopted from using the platform as a developer's scratchpad before writing Terraform to hand off to an Ops. team or being implemented end to end. 

Railway's been in operation for now for more than three years and we have served billions of requests, with 100s of millions of deploys serving millions of end-users simultaneously.


## Railway Scale

All of these verticals deploy workloads that may require high bandwidth operations or intensive compute.

However, service scale on the platform is not unbounded. As a foundational infrastructure company, we understand that customers may outpace our pace of improvement for the platform. Even though 32 vCPU and 32 GB of memory sounds like a lot (with up to 20 replicas) on the Pro plan, when faced with hyper-growth: throwing more resources at the issue might be your best bet until long term optimizations can be made by your team.

Railway will gladly bump up your service limits within your tier of service to meet your needs. Even so, we will be frank and honest if you may need to seek elsewhere to augment your workloads with extra compute. If your compute needs outpace our Pro offering, consider our Enterprise plans where we offer even greater limits and capacity planning, [contact us to learn more](mailto:team@railway.app).

### Databases

We have customers using our databases for their production environment with no issue. Railway's plugins are optimized for a batteries included development experience. They are good for applications that are prioritizing velocity and iteration speed over scale.

Our databases are provided with no SLAs, are not highly available, and scale only to the limits of your plan. We don't think they are suitable for anything mission-critical, like if you wanted to start a bank.

We advise developers to:
- Configure backups 
- Run-book and restore their backups
- Configure secondaries to connect to in-case of a disaster situation

Included in our planned near-term work for databases on Railway are built in backups, additional database metrics, and SSH access into the running database. 

As mentioned before: we don't believe in vendor lock-in here at Railway, if your needs outpace us, consider other vendors like PlanetScale (for MySQL) or Cockroach (for Postgres).

### Metrics

Railway provides up to 7 days worth of data on service information such as:
- CPU
- Memory
- Disk Usage
- Network

We also overlay commit and deployment behavior to correlate issues with application health to deployments. This is on top of the service logs that are continually delivered to users viewing a particular deployment of a service.

For service logs, we store logs for up to 90 days for Pro plan workspaces.

Included in our planned near-term work for logging and observability on Railway are improvements to structured logging compatibly, and OpenTelemetry compatible endpoints.

It is common for teams who wish to have additional observability to use an additional monitoring tool that maintains a longer time horizon of data such as New Relic, Sentry, or Datadog. Within projects, deploying a Datadog Agent is as easy as deploying the template and providing your Datadog API Keys.

### Networking

Railway doesn't have a hard bandwidth limit to the broader internet. 

We will get in contact when your outbound bandwidth exceed 100GB/month, but we happily lift that limit for legitimate customers. As such, we have had projects handle unexpected traffic and features on major media publications. It is something we are very proud of. With that said, if you need to control where your traffic is allowed to come from such as setting up firewall rules, we recommend setting up Cloudflare to handle this aspect of your application.

Private networking bandwidth is un-metered.

We do have plans to provide static IPs, and allowing people to set up firewall rules to control permitted traffic within their projects.


### Service Level Objectives

Railway does meet SLOs for companies who have greater need for incident, support, and business planning responsiveness. We provide this via Business Class, offered as an add-on to Pro plans and included in all Enterprise plans. [More info.](/support/business-class)


### Will Railway exist in 10 years?

A common question we get in conversations with (rightly) skeptical developers is the above question. Most documentation pages don't address the meta question of a company's existence but how we run *our* business affects yours. 

The short and simple answer is: **Yes**. 

Railway aims to exist for a very long time. Railway has presence on existing public clouds, while also building out presence on co-location providers. As a company, we have been structured sustainably with a first principles approach to every expense while growing sustainably.


### Unsupported Use-Cases

Unfortunately, our platform isn't yet well-equipped to handle the following verticals that require extensive Gov't certification or GPU compute:

- Government
- Traditional Banking
- Machine Learning Compute

FedRAMP is planned to be on

### Status on Certifications

Railway is undergoing the certification process, for more information see our [compliance documentation page](/maturity/compliance).

## General Recommendations

A document like this can only go so far. We have a standing invitation for any team who needs an extended scale use-case to reach out to us directly by e-mailing [team@railway.app](mailto:team@railway.app), or via our [Discord server](https://discord.gg/railway). We would be happy to answer any additional questions you may have.
