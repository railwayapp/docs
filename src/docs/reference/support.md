---
title: Support
---

Railway offers numerous tiers of support for our users.

## Support Tiers

| Plan          | Support                                                                               |
| ------------- | ------------------------------------------------------------------------------------- |
| Trial & Hobby | [Community](#help-station) only                                                       |
| Pro           | [Community Priority Threads](#priority-threads) and [Business Class](#business-class) |
| Enterprise    | [Custom](#enterprise) & all of the above                                              |

## Help Station

Railway conducts its support over our [Help Station](https://help.railway.app) platform.

It hosts our community of 500,000+ users and developers. It is where you can find answers to common questions, ask questions, and get in touch with the Railway team.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1708556761/docs/help-station-3_b14jbh.png"
alt="Screenshot of Railway Help Station"
layout="intrinsic"
width={2033} height={1380} quality={100} />

Please ensure that you've searched for your issue before creating a new thread, follow the guidelines in [How To Ask For Help](#how-to-ask-for-help), and abide by our [Code of Conduct](https://help.railway.app/community-code-of-conduct).

### Priority Threads

For Pro plan users, threads created in the [Help Station](https://help.railway.app) are treated as **High Priority**. These threads are guaranteed a response from the Railway team within 3-5 business days (if community members are unable to help).

We pay special attention to threads created by Pro users and ensure that questions or concerns are resolved in a timely manner.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1715282870/docs/pro-priority-threads_pxyodo.png"
alt="Screenshot of Railway Help Station - Priority Threads"
layout="intrinsic"
width={772} height={269} quality={100} />

For teams and companies requiring SLOs and higher-priority support over chat, sign up for [Business Class](#business-class).

### Private Threads

You create a **Private Thread** on [Help Station](https://help.railway.app/support) if you need to share sensitive information, such as invoices or personal data. Private Threads are only visible to you and Railway employees.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1715282996/docs/priv-threads_lus6tx.png"
alt="Screenshot of Railway Help Station - Private Threads"
layout="intrinsic"
width={747} height={352} quality={100} />

Private Threads have a slower response time (at most 2 business days) because only Railway employees can see them. We recommend you to only create a Private Thread if you need to share sensitive information.

We may make the thread public for community involvement if we determine that there is no sensitive information in your thread.

## Discord

We have a vibrant Discord community of over 20,000+ users and developers. You can find the Railway Discord at [https://discord.gg/railway](https://discord.gg/railway).

Please ask your questions in the <a href="https://discord.com/channels/713503345364697088/1006629907067064482" target="_blank">✋ ｜ help</a> channel, and refrain from pinging anyone with the `Team` or `Conductor` roles.

## Slack

Railway offers non-SLO Slack channels to companies and prospective customers of planned significant use. Customers can raise issues, coordinate their migration over to the platform, and provide feedback within a Slack connect channel.

Sufficiently adopted Pro Workspaces can create a Slack Connect channel for their team and the Railway team within the Workspace settings page.

### Slack Account Linking

<Image
src="https://res.cloudinary.com/dbnvcdbk1/image/upload/v1718999607/CleanShot_2024-06-21_at_15.52.19_mh1uej.png"
alt="Screenshot of Slack Account Linking"
layout="intrinsic"
width={534} height={278} quality={100} />

The Railway team is building out functionality to natively conduct support operations within Slack connect channels. Connecting your Slack Account to your Railway Account allows the team to get insight into issues affecting your workloads. [To link your Slack account to your Railway account, you can navigate to your Account settings page on Railway and follow the instructions provided.](https://railway.app/account)

_Permissions_ - Railway only asks for permissions to link your Slack ID and your Workspace ID, we can't see any messages outside of the Slack Connect channel if you have one set up.

## How To Ask For Help

When you reach out for help, it's important that you help us help you! Please include as much information as you can, including but not limited to:

- Description of the issue you're facing
- IDs (Project ID, Service Name/ID, Deployment ID, etc.)
- Railway environment of your service/deployment
- Error messages and descriptions
- Logs (build and/or deploy)
- Link to GitHub repo/code or template you're using, if applicable

## Business Class

For teams and companies who need dedicated support, we offer Business Class.

Business Class is support and success designed for those who need the full attention of Railway. Business Class support is a dedicated support channel with SLOs for your company.

Reach out to us at [team@railway.app](mailto:team@railway.app) for more information on how to sign up.

### Business Class SLOs

| Severity                             | Acknowledgement Time |
| ------------------------------------ | -------------------- |
| P1 (Outages, Escalations)            | One hour - 24/7      |
| P2 (Bugs)                            | Same Business Day    |
| P3 (Integrations, General Questions) | Two Business Days    |

### Definition of Priorities

| Priority | Surface Areas                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1        | **Outages that impact production**. This covers the following components: incidents declared on <a href="https://status.railway.app/" target="_blank">status.railway.app</a> including and especially incidents with end-customer impact (e.g. inability to login to the Dashboard), customer workload-impacting issues due to high load requiring intervention from Railway (e.g. requiring additional resources beyond your current limits). |
| 2        | **Issues related to Railway features**. This covers features offered by Railway, including but not limited to our Dashboard, CLI, and platform-level features such as Deployments, Environments, Private Networking, Volumes.                                                                                                                                                                                                                  |
| 3        | **Integration work and general questions related to Railway**. This covers customer-related requests involving integrating Railway with other services (e.g. fronting your Railway workload with a DDoS protection service), leveraging tools to use Railway the way you like (e.g. IaC provisioning/Terraform), or questions about Railway features or its platform.                                                                          |

### Business Class Response Hours

We offer support during business hours, and prioritize requests from Business Class customers:

- Business hours are Monday through Friday, 9am to 9pm Pacific Time
- Exceptions apply to our business hours during P1 outages where the team will be on-call 24/7
- The team may reply outside of business hours, but we do not guarantee a response outside of business hours

### Business Class Resource Limits

For Business Class customers, Railway increases resource limits beyond the standard limits on a need-based basis. Contact the team through your dedicated communication channel to increase limits.

### Uptime Calculation

As part of this offering, we agree to provide a monthly summary on the uptime of the components of Railway. Customers are provided an RCA to any outages on the Routing Layer.

### Audits

Security audits can be provided by request.

## Enterprise

For enterprises, we offer everything in [Business Class](#business-class) along with custom support tailored to your needs. Reach out to us at [team@railway.app](mailto:team@railway.app) for more information.
