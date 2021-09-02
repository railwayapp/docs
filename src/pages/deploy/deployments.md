---
title: Deployments
---

## Deployments

Project Deployments are attempts to build and deliver your application. 

Deployments can be in the following states
- Building
- Deploying
- Success
- Failure 

Railway lists all current deployments and historical deployments under the Deployments page on your Project dashboard.

Successful deploys are assigned two addresses out of the box: a friendly name address and an address with a hash. They both point to the same live deployment.

If there happens to be an issue with the start command of your application, Railway will attempt to retry the deploy 3 times until timeout.

### Bad Gateway

If you get a Bad Gateway when you attempt to visit the deployment URL, it could be that your `PORT` variable is misconfigured. Railway needs an explicit port to listen on to expose the application to the internet. You can provide a `PORT` variable under the Variables page in your project.

## Deploy Triggers

A new deploy is triggered when the command `railway up` is executed. Projects that are linked to a GitHub repo automatically deploy when new commits are detected in the `main` branch.

You can configure additional deployment triggers such as when a new PR is created using the [GitHub Trigger's integration](integrations#github-integration).

## Deployment Actions

### Rollback

Users can rollback to previous deploys if mistakes were made. A deployment rollback will revert to the previously successful deployment. Both the Docker image and custom variables are restored during the rollback process.

To perform a rollback, click the three dots at the end of the deployment, you will then be asked to confirm your rollback.

### Logs

Railway allows users to see running logs of your application to help with monitoring. Railway displays the last 10,000 lines of logs available for a deployment. 

### Singleton Deploys

For those who prefer to keep only one deploy active, you can enable singleton deploys under the Settings tab of the Deployments page. This setting is useful for bots where there might be conflicts with log ins. 

### Delete Deployments

Users can cancel deployments in progress by clicking the three dots at the end of the deployment tab and select Abort deployment. This will cancel the deployment in progress.

If a deployment is completed, you can delete a live deploy by clicking the the three dots at the end of the deployment tab and select Remove. This will remove the deployment and stop any further project usage. 


