---
title: Webhooks
description: Learn about webhooks on Railway.
---

Webhooks can be used to notify your own application of alerts or deployment status changes.

<Image src="https://res.cloudinary.com/railway/image/upload/v1763768800/new-webhooks_lhw6p2.png"
alt="New Webhook"
layout="responsive"
width={821} height={485} quality={80} />

## Setting up a Project webhook

For information on how to setup webhooks, visit [this guide](/guides/webhooks).

## Platform Events

Webhooks can be used to receive notifications a variety of events on the platform. This includes things like:

- Deployment status changes. Available deployment states can be found [here](/reference/deployments#deployment-states).
- Volume usage alerts.
- CPU/RAM monitor alerts.

## Muxers: Provider-specific Webhooks

Webhooks contain Muxers which will automatically transform the payload based on the webhook URL. Below are the currently supported Muxers:

- Discord
- Slack

For more information, visit [this guide](/guides/webhooks#muxers-provider-specific-webhooks).
