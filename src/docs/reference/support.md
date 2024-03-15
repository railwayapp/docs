---
title: Support
---

Railway offers numerous tiers of support for our users.

## Support Tiers

Visit the [Help Station](https://help.railway.app/support) to view your support tier and available resources.

| Plan          | Support                                                                                                |
| ------------- | ------------------------------------------------------------------------------------------------------ |
| Trial & Hobby | [Community](#help-station) only                                                                        |
| Pro           | [Community](#help-station), [Private Threads](#private-threads), and [Business Class](#business-class) |
| Enterprise    | [Custom](#enterprise) & all of the above                                                               |

## Community

<Banner variant="info">
Please ensure that you've searched for your issue before starting a new discussion, follow the guidelines in [How To Ask For Help](#how-to-ask-for-help), and abide by our [Code of Conduct](https://help.railway.app/community-code-of-conduct).
</Banner>

Railway conducts its support over our [Help Station](https://help.railway.app/support) platform. It hosts our community of 500,000+ users and developers, and provides a dedicated section for Pro users to receive a guaranteed response from us ([Private Threads](#private-threads)).

<Image
src="https://res.cloudinary.com/railway/image/upload/v1708556761/docs/help-station-3_b14jbh.png"
alt="Screenshot of Railway Help Station"
layout="intrinsic"
width={2033} height={1380} quality={100} />

The [Help Station](https://help.railway.app/support) is where you can find answers to common questions, ask questions, and get in touch with the Railway team.

We encourage you to reach out to the community for help with your project. The community is a great place to get help with your project, learn new things, and meet other developers.

### Private Threads

<Banner variant="primary" iconName="star">
Private Threads is only available to Pro plan users.
</Banner>

**Private Threads** in Railway's [Help Station](https://help.railway.app/support) is a dedicated support feature for Pro plan users.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1708556944/docs/priv-thread_bhjt9g.png"
alt="Screenshot of creating Private Threads in Railway Help Station"
layout="intrinsic"
width={780} height={377} quality={100} />

Private threads are:

- Only visible to you, your team members, and Railway employees
- Guaranteed a response from Railway within 3-5 business days

To create a Private Thread, visit [Help Station -> Support](https://help.railway.app/support) and click on the `+ New Private Thread` button.

For teams and companies requiring SLOs and higher-priority support over chat, sign up for [Business Class](#business-class).

### Discord

We have a vibrant Discord community of over 20,000+ users and developers. You can find the Railway Discord at [https://discord.gg/railway](https://discord.gg/railway).

Please ask your questions in the <a href="https://discord.com/channels/713503345364697088/1006629907067064482" target="_blank">✋ ｜ help</a> channel, and refrain from pinging anyone with the Team or Conductor roles.

## Refunds

You can request for a refund in [Account -> Billing](https://railway.app/account/billing) under **Billing History**:

<Image
src="https://res.cloudinary.com/railway/image/upload/v1708555357/docs/billing-refund_wg7aja.png"
alt="Screenshot of refund request button inside Account -> Billing"
layout="intrinsic"
width={989} height={231} quality={100} />

If you do not see a refund button next to your invoice, you are ineligible for a refund.

## How To Ask For Help

When you reach out for help, it's important that you help us help you! Please include as much information as you can, including but not limited to:

- Description of the issue you're facing
- IDs (Project ID, Service Name/ID, Deployment ID, etc.)
- Railway environment of your service/deployment
- Error messages and descriptions
- Logs (build and/or deploy)
- Link to GitHub repo/code or template you're using, if applicable

## Business Class

For teams and large companies who need dedicated support, we offer Business Class. It's support and success designed for those who need the full attention of Railway. Business Class support is a dedicated support channel with SLOs for your company.

Reach out to us at [team@railway.app](mailto:team@railway.app) for more information on how to sign up.

### Chat Bridges

For Business Class customers, we offer Direct Support over chat channels. This allows you to have a dedicated channel for your team to communicate with Railway.

- In Discord, you'll have access to a **#direct-support** channel, allowing you to create a dedicated channel with us
- In Slack, we'll embed Railway Engineers into one of your workspace's channels
- If you'd like to set this up over other channels (e.g. Microsoft Teams), let us know

**Discord Chat Bridge**

- When you sign up for Business Class, you gain access to a channel in Discord called **#direct-support**
- From within the **#direct-support** channel, click the `Join Channel` button to create a channel dedicated to your team

Reach out to us at [team@railway.app](mailto:team@railway.app) on setting up dedicated chat bridges.

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

### Uptime Calculation

As part of this offering, we agree to provide a monthly summary on the uptime of the components of Railway. Customers are provided an RCA to any outages on the Routing Layer.

### Audits

Security audits can be provided by request.

## Enterprise

For enterprises, we offer everything in [Business Class](#business-class) along with custom support tailored to your needs. Reach out to us at [team@railway.app](mailto:team@railway.app) for more information.
