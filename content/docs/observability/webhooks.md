---
title: Webhooks
description: Learn how to set up webhooks on Railway to receive real-time updates for deployments and events.
---

Webhooks can be used to notify your own application of deployment status changes and alerts. They are configured per project.

<Image src="https://res.cloudinary.com/railway/image/upload/v1763768800/new-webhooks_lhw6p2.png"
alt="New Webhook"
layout="responsive"
width={821} height={485} quality={80} />

## Setup a webhook

Complete the following steps to setup a webhook:

1. Open an existing Project on Railway.
1. Click on the `Settings` button in the top right-hand corner.
1. Navigate to the Webhooks tab.
1. Input your desired webhook URL.
1. Optional: specify which events to receive notifications for.
1. Click `Save Webhook`.

The URL you provide will receive a webhook payload when any service's deployment status changes or an alert is triggered. This will be executed across all environments in the project.

## Platform events

Webhooks can be used to receive notifications for a variety of events on the platform:

- **Deployment status changes** - Available deployment states can be found in the [Deployments reference](/deployments#deployment-states).
- **Volume usage alerts** - Notifications when volumes approach capacity.
- **CPU/RAM monitor alerts** - Notifications when resource usage exceeds thresholds.

## Webhook payload

When an event occurs, Railway sends a JSON payload to your configured webhook URL.

### Example payload

```json
{
  "type": "Deployment.failed",
  "details": {
    "id": "8107edff-4b8e-44fc-b43a-04566e847a2a",
    "source": "GitHub",
    "status": "SUCCESS",
    "branch": "...",
    "commitHash": "...",
    "commitAuthor": "...",
    "commitMessage": "...",
  },
  "resource": {
    "workspace": { "id": "<workspace id>", "name": "<workspace name>" },
    "project": { "id": "<project id>", "name": "<project name>" },
    "environment": { "id": "<environment id>", "name": "<environment name>", "isEphemeral": false },
    "service": { "id": "<service id>", "name": "<service name>" },
    "deployment": { "id": "<deployment id>" }
  },
  "severity": "WARNING",
  "timestamp": "2025-11-21T23:48:42.311Z"
}
```

## Testing webhooks

The `Test Webhook` button will send a test payload to the specified webhook URL.

Note: For security reasons, test webhooks are sent from the frontend client, which may result in Cross-Origin Resource Sharing (CORS) restrictions. This typically presents as a delivery failure when using the test webhook functionality.

## Muxers: provider-specific webhooks

For certain webhook URLs, Railway will automatically transform the payload to match the destination (we call these Muxers). This makes it easy to use webhooks without having to write your own middleware to format the request body.

Currently supported providers:

- Discord
- Slack

### Setting up a webhook for discord

Discord supports integrating directly with webhooks. To enable this on a server you will need to be an admin or otherwise have the appropriate permissions.

1. On Discord, open the settings for a server text channel. This menu can be accessed via the cogwheel/gear icon where the channel is listed on the server.
2. Click on the integrations tab.
3. Click on the webhooks option.
4. You will see an option to create a new webhook, click this button and fill out your preferred bot name and channel.
5. Once created, you will have the option to copy the new webhook URL. Copy that URL.
6. Back in Railway, open the project you wish to integrate with.
7. Click on the project's deployments menu.
8. Navigate to the settings tab.
9. Input the copied webhook URL into the input under "Build and Deploy Webhooks".
10. Click the checkmark to the right of the input to save.

At this point, the Discord Muxer will identify the URL and change the payload to accommodate the Discord integration. You can see this if you expand the payload preview panel.

You are now done! When your project deploys again, that Discord channel will get updates on the deployment!

### Setting up a webhook for slack

Slack supports integrating directly with webhooks.

1. Enable incoming webhooks for your Slack instance (Tutorial <a href="https://api.slack.com/messaging/webhooks#enable_webhooks" target="_blank">here</a>)
1. Generate a `hooks.slack.com` webhook URL for your channel (Tutorial <a href="https://api.slack.com/messaging/webhooks#create_a_webhook" target="_blank">here</a>)
1. Open up Railway, navigate to your project's Webhook tab.
1. Paste the url from slack

<Image
src="https://res.cloudinary.com/railway/image/upload/v1737947755/docs/webhooks/wo4tuyv9dy7gjgiq2j7j.png"
alt="Slack Webhook"
layout="responsive"
width={1466} height={810} quality={80} />

## Troubleshooting

Having issues with webhooks? Check out the [Troubleshooting guide](/troubleshooting) or reach out on our <a href="https://discord.gg/railway" target="_blank">Discord</a>.
