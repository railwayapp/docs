---
title: GitHub Actions Post-Deploy
description: Learn how to use GitHub Actions to run post-deployment commands.
---

[Github Actions](https://github.com/features/actions) come with a pretty neat set of features to automate your workflows. In this post, we talk about using Github Actions to run post-deploy actions.

At Railway, we've set up Github triggers for automatic deployments when you push to a selected branch, and with Github Actions, you can automate several parts of your development workflow. Recently, within our [Discord](https://discord.gg/railway) and [Slack](/reference/support#slack), we've had a couple of users ask us how they'd go about running commands or webhooks after their app is deployed so we thought it'd be a good idea to publish a short tutorial doing just that, with Github Actions.

## The Action

Since Railway makes the deployment status available to Github, we'll be using the `deployment_status` event to trigger our action. This event is triggered when a deployment status changes, and we'll be using the `success` state to trigger our action.

Make a new file in your repository called `.github/workflows/post-deploy.yml` and add the following -

```yaml
name: Post-Deployment Actions

on:
  deployment_status:
    states: [success]

jobs:
  post-deploy:
    runs-on: ubuntu-latest
    if: github.event.deployment_status.state == 'success'
    steps:
      - name: Debug - Print github.event object
        run: |
          echo "github.event context:"
          echo '${{ toJSON(github.event) }}'
          
      # Only run if this is a production environment deployment that succeeded
      - name: Run post-deploy actions
        if: github.event.deployment.environment == 'production'
        run: |
          echo "Production deployment succeeded"
```

If you have your repository deploying to multiple services, you can modify the `if` condition to check for the service you want to run the command for -

```yaml
if: github.event.deployment.environment == 'production' && github.event.deployment.payload.serviceId == '<service-id>'
```
You can also see what `github.event` contains and build your own conditions from there.

Information on how to find the Service ID and Environment IDs as needed can be found [here](https://docs.railway.com/guides/public-api#resource-ids).

It's that simple! You can now customize the final run step to execute any commands or send webhooks using Curl or other methods of your choice.

## Conclusion

We hope this tutorial has been helpful and that you'll find it useful for your own projects. If you have any questions or feedback, please feel free to reach out to us on [Discord](https://discord.gg/railway), [Slack](/reference/support#slack) or the [Central Station](https://station.railway.com). Happy coding!