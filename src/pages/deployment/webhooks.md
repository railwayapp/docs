---
title: Webhooks
---
Webhooks can be used to notify your own application of deployment status changes.

## Setting up a webhook
To setup a webhook, first navigate to an existing project.  Then click on the deploy menu and then the settings tab.

Here you will see a section titled "Build and Deploy Webhooks".  Under here you may input a URL.  This URL will receive a webhook payload when the current project's deploy status changes.  This will be executed across all environments in the project.

To see what payload will be transmitted to the URL, you can expand the "Example webhook payload" panel.

## Muxers
Webhooks contain Muxers which will automatically identify webhook URLs and transform the payload based on where it's going.  Below are the currently supported Muxers.

- Discord

## Setting up a webhook for Discord
On discord, open an existing text channel in a server you administer.

Under the integrations tab, you will see an option for webhooks.  Click the webhook button, and then create a new webhook bot.

Once created, you will have the option to copy the new webhook bot's URL.  Copy that URL, and paste it into your Railway project's webhook URL input.

At this point, the Discord Muxer will identify the URL and change the payload to accomodate the Discord integration.  You can see this if you expand the payload preview panel.

You are now done!  When your project deploys again, that Discord channel will get updates on the deploy!