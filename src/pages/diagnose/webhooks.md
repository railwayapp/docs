---
title: Webhooks
---
Webhooks can be used to notify your own application of deployment status changes.

<NextImage src="https://res.cloudinary.com/railway/image/upload/v1631917802/docs/webhooks_nslim0.png"
alt="Screenshot of Webhooks Menu"
layout="responsive"
width={823} height={324} quality={80} />

## Setting up a webhook
Complete the following steps to setup a webhook:

1. Open an existing project on Railway.
2. Click on the deployments menu.
3. Navigate to the settings tab.
4. Input your desired webhook URL into the input under "Build and Deploy Webhooks".
5. Click the checkmark to the right of the input to save.

The URL you provide will receive a webhook payload when the current project's deploy status changes.  This will be executed across all environments in the project.

To see what payload will be transmitted to the URL, you can expand the "Example webhook payload" panel.

## Muxers
Webhooks contain Muxers which will automatically identify webhook URLs and transform the payload based on where it's going.  Below are the currently supported Muxers.

- Discord

## Setting up a webhook for Discord
Discord supports integrating directly with webhooks. To enable this on a server you will need to be an admin or otherwise have the appropriate permissions.

1. On Discord, open the settings for a server text channel.  This menu can be accessed via the cogwheel/gear icon where the channel is listed on the server.
2. Click on the integrations tab.
3. Click on the webhooks option.
4. You will see an option to create a new webhook, click this button and fill out your preferred bot name and channel.
5. Once created, you will have the option to copy the new webhook URL.  Copy that URL.
6. Back in Railway, open the project you wish to integrate with.
7. Click on the project's deployments menu.
8. Navigate to the settings tab.
9. Input the copied webhook URL into the input under "Build and Deploy Webhooks".
10. Click the checkmark to the right of the input to save.

At this point, the Discord Muxer will identify the URL and change the payload to accommodate the Discord integration.  You can see this if you expand the payload preview panel.

You are now done!  When your project deploys again, that Discord channel will get updates on the deploy!