---
title: Use-cases
---

Railway is suited for a variety of use-cases. This page will walk-through what the platform is perfect for today and our recommendations for apps of all sizes.

## Philosophy

Railway is a deployment platform that helps developers deliver their software through the entire application life-cycle through git native tooling, composable infrastructure, and built in instrumentation. We design and develop our product features to serve what we consider to be the three primary stages of software development:
- Development
- Deployment
- Diagnosis

We believe that most developer oriented products attempt to target one or more stages within the software development cycle. Railway provides solutions for developers for all of these stages, whereas some vendors focus on specific stages.

Railway is a company staffed with people who know that developers would prefer to use tools that they are familiar with. We believe software should be "take what you need, and leave what you don't." As a result, we are comfortable recommending additional vendors if we feel their needs might be acutely met by them. Our goal is for your unique need to be served, so you can focus on delivering for your customers.

We think that companies should be as upfront as possible about their product and offerings to help you come to a decision that is best for your team and users. With that said, let's talk about the number one use-case: delivering apps to users in a Production environment.

## Is Railway Production Ready?

Many of our customers use Railway to reliably deploy their applications to customers at scale. With that said, Production standards are going to be different depending on what your users expect. We have a companies that use Railway in a variety of different verticals such as:
- Enterprise SaaS
- Consumer Social
- Crypto/DAOs
- Agency Work

All of these verticals deploy workloads that may require high bandwidth operations or intensive compute. However, service scale on the platform is not unbounded. As a foundational infrastructure company, we understand that customers may outpace our pace of improvement for the platform. Even though 96 vCPU and 240 GB of memory sounds like a lot, when faced with hyper-growth: throwing more resources at the issue might be your best bet until long term optimizations can be made by your team.

Railway will gladly bump up your service limits within your tier of service to meet your needs. Even so, we will be frank and honest if you may need to seek elsewhere to augment your workloads with extra compute.

### Databases

We have customers using our DBs for their production environment with no issue. Railway's plugins are optimized for a batteries included development experience. They are good for applications that are prioritizing velocity and iteration speed over scale.

Our databases are provided with no SLAs, are not highly available, and scale only to the limits of your plan. We don't think they are suitable for anything mission-critical, like if you wanted to start a bank.

Included in our planned near-term work for databases on Railway are backups, multiple instances of the same offering of database within a project environment, and additional database metrics. We do not offer timelines for items on the road-map.

As mentioned before: we don't believe in vendor lock-in here at Railway, so if your needs outpace us, consider other vendors like PlanetScale (for MySQL) or Cockroach (For Postgres).

### Metrics

Railway provides up to 7 days worth of data on service information such as:
- CPU
- Memory
- Disk Usage
- Network

We also overlay commit and deployment behavior to correlate issues with application health to deployments. This is on top of the service logs that are continually delivered to users viewing a particular deployment of a service.

It is common for teams who wish to have additional observability to use an additional monitoring tool that maintains a longer time horizon of data such as New Relic or Datadog. Within projects, deploying a Datadog Agent is as easy as using our provided Dockerfile and providing your Datadog API Keys.

### Networking

Railway doesn't have a hard bandwidth limit within Projects and the broader internet. We throttle outbound bandwidth when you exceed 100GB/month, but we happily lift that limit for legitimate customers. As such, we have had projects handle unexpected traffic and features on major media publications. It is something we are very proud of. With that said, if you need to control where your traffic is allowed to come from such as setting up firewall rules, we recommend setting up Cloudflare to handle this aspect of your application.

We do have plans to include private networking, static IPs, and allowing people to set up firewall rules to control permitted traffic within their projects.

## Unsupported Use-Cases

Our policy for being forthcoming and frank applies to unsavory information that we need to share. Unfortunately, our platform isn't yet well-equipped to handle the following verticals that require extensive certification or GPU compute:
- Medical
- Government
- Traditional Banking
- Machine Learning Compute

SoC2 and HIPAA BAA service agreements are on the roadmap but the work is not yet underway nor delivered in the near-term.

### Status on Certifications

The long answer is we have several fundamental platform changes incoming (multi-region, additional scaling solutions) that would affect our audits. If we were to undergo certification, we would have to amend the certifications quickly.

## General Recommendations

A document like this can only go so far. We have a standing invitation for any team who needs an extended scale use-case to reach out to us directly by e-mailing [contact@railway.app](mailto:contact@railway.app), or via our [Community Discord server](https://discord.gg/railway). We would be happy to answer any additional questions you may have.
