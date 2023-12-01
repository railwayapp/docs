---
title: Webhooks
---

Webhooks can be used to notify your own application of deployment status changes.

<Image src="https://res.cloudinary.com/railway/image/upload/v1631917802/docs/webhooks_nslim0.png"
alt="Screenshot of Webhooks Menu"
layout="responsive"
width={823} height={324} quality={80} />

## How it Works

When a deployment's status changes, Railway will send a notification via HTTP to the URL provided in the webhook configuration.

Deployment states can be found [here](/reference/deployments#deployment-states).

## Muxers

Webhooks contain Muxers which will automatically identify webhook URLs and transform the payload based on where it's going. Below are the currently supported Muxers:
- Discord
- Slack

## Setting up a webhook

For information on how to setup webhooks, visit [this guide](/guides/webhooks).