---
title: Support
description: Learn about Railway's support channels.
---

Railway provides support services tailored to customer needs across different subscription tiers. Support tier and prioritization is determined by your current plan level.

## Support Tier Overview

### Trial, Free, Hobby

Users on Trial, Free, and Hobby plans have access to community-driven support through [Central Station](#central-station) or [Discord](#discord). While Railway employees may participate in community discussions, responses are not guaranteed for these tiers.

### Pro 

Users on the Pro plan receive direct support from Railway through [Central Station](#central-station), with typical response times of 3-5 business days. Please note that the Pro tier does not include SLOs or [application-level support](#application-level-support).

### Enterprise & Business Class

Organizations requiring SLOs and enhanced support should consider upgrading to [Business Class](#business-class) support. Please refer to the [Business Class](#business-class) section for comprehensive details.

## Email Support

Railway does not provide support via email. All support requests should be directed to [Central Station](#central-station) or [Discord](#discord). Email communication is reserved for the following specific purposes:

- Sales inquiries: [team@railway.com](mailto:team@railway.com)
- Security reports: [bugbounty@railway.com](mailto:bugbounty@railway.com)
- Abuse reports: [abuse@railway.com](mailto:abuse@railway.com)
- Privacy inquiries: [privacy@railway.com](mailto:privacy@railway.com)

Emails outside these categories may not receive a response.

## Application-Level Support

Railway generally does not provide application-level support, such as debugging your code, fixing bugs in your application, or helping you with third-party services. We may provide these services on a case-by-case basis for Business Class / Enterprise customers. If you need help with your application, we recommend reaching out to the community on [Central Station](https://station.railway.com) or [Discord](https://discord.gg/railway).

## Central Station

Railway conducts its support over the [Central Station](https://station.railway.com) platform.

It hosts our community of 1,600,000+ users and developers. It is where you can find answers to common questions, ask questions, and get in touch with the Railway team.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1743120744/central-station_x3txbu.png"
alt="Screenshot of Railway Central Station"
layout="intrinsic"
width={1737} height={913} quality={100} />

Please ensure that you've searched for your issue before creating a new thread, follow the guidelines in [How To Ask For Help](#how-to-ask-for-help), and abide by our [Code of Conduct](https://station.railway.com/community-code-of-conduct).

### Private Threads

You create a **Private Thread** on [Central Station](https://station.railway.com/support) if you need to share sensitive information, such as invoices or personal data. Private Threads are only visible to you and Railway employees.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1743120858/private-thread_en0bkd.png"
alt="Screenshot of Railway Central Station - Private Threads"
layout="intrinsic"
width={1436} height={455} quality={100} />

Private Threads have a slower response time because only Railway employees can see them. We recommend you to only create a Private Thread if you need to share sensitive information.

Railway may make the thread public for community involvement if we determine that there is no sensitive information in your thread.

## Discord

We have a vibrant Discord community of over 28,000+ users and deveYou can find the Railway Discord at [https://discord.gg/railway](https://discord.gg/railway).

Please ask your questions in the <a href="https://discord.com/channels/713503345364697088/1006629907067064482" target="_blank">✋ ｜ help</a> channel, and refrain from pinging anyone with the `Team` or `Conductor` roles.

## Slack

Railway offers Slack Connect channels to Enterprise plan customers with a minimum committed spend of $2,000/month. Customers can raise issues, coordinate their migration over to Railway, and provide feedback within a Slack Connect channel.

Additionally, the solutions team at Railway may provide a shared Slack Connect channel to facilitate better communication and support.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1733324712/docs/cs-2024-12-04-22.20_bms1sa.png"
alt="Screenshot of Slack"
layout="intrinsic"
width={571} height={743} quality={100} />

Enterprise teams with $2,000/month committed spend can create a Slack Connect channel within the Workspace settings page:

<Image
src="https://res.cloudinary.com/railway/image/upload/v1733324438/docs/cs-2024-12-04-23.00_uvchnr.png"
alt="Screenshot of Slack Account Linking"
layout="intrinsic"
width={845} height={157} quality={100} />

Users in a Slack Connect channel can invite their team members using the Slack interface or by pressing the `Join Slack` button again to initiate new invites.

## Business Class

For companies who need dedicated support, we offer Business Class.

Business Class is support and success designed for those who need the full attention of Railway. Business Class support is a dedicated support channel with SLOs for your company. Workspaces become eligible for Business Class support after $2,000/mo in spend.

Reach out to us at [team@railway.com](mailto:team@railway.com) to enable your SLO.

### Business Class SLOs

We prioritize Business Class customers over all other support requests.

| Severity                             | Acknowledgement Time |
| ------------------------------------ | -------------------- |
| P1 (Outages, Escalations)            | One hour - 24/7      |
| P2 (Bugs)                            | Same Business Day    |
| P3 (Integrations, General Questions) | Two Business Days    |

For Enterprise customers with $2,000/month committed spend who have a shared 
Slack Connect channel with us, you have access to "Critical" urgency level 
support requests:

<Image
src="https://res.cloudinary.com/railway/image/upload/v1733325632/docs/cs-2024-12-04-23.20_smvweu.png"
alt="Screenshot of Critical urgency level in Slack"
layout="intrinsic"
width={392} height={255} quality={100} />

This feature is also available on [Central Station](#central-station) for Business Class customers:

<Image
src="https://res.cloudinary.com/railway/image/upload/v1759234073/docs/critical-issue-private-threads_kdxpvb.png"
alt="Screenshot of Critical urgency level in Central Station"
layout="intrinsic"
width={781} height={282} quality={100} />

Opening a Critical ticket allows you to page our support on-call directly for an immediate response. Please only use this for production outages or critical platform issues preventing your team from using Railway.

### Definition of Priorities

| Priority | Surface Areas                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1        | **Outages that impact production**. This covers the following components: incidents declared on <a href="https://status.railway.com/" target="_blank">status.railway.com</a> including and especially incidents with end-customer impact (e.g. inability to login to the Dashboard), customer workload-impacting issues due to high load requiring intervention from Railway (e.g. requiring additional resources beyond your current limits). |
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

### Compliance & Audits

Security audits can be provided by request. For most customers, we can provide our security and compliance documentation can be accessed via Railway's Trust Center at [trust.railway.com](https://trust.railway.com). Please sign in with your Railway account's email address to access Trust Center.

## Enterprise

For enterprises, we offer everything in [Business Class](#business-class) along with custom support tailored to your needs. Railway can enter into a contractual SLA under our negotiated pricing offering. Reach out to us at [team@railway.com](mailto:team@railway.com) for more information.

## How To Ask For Help

When you reach out for help, it's important that you help us help you! Please include as much information as you can, including but not limited to:

- Description of the issue you're facing
- IDs (Project ID, Service Name/ID, Deployment ID, etc.)
- Railway environment of your service/deployment
- Error messages and descriptions
- Logs (build and/or deploy)
- Link to GitHub repo/code or template you're using, if applicable

Please note that Railway does not provide [application-level support](#application-level-support).
