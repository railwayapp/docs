---
title: Deployment Actions
---

Various actions can be taken on Deployments from within the Service -> Deployments tab and clicking on the three dots at the end of a previous deployment.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1645148376/docs/deployment-photo_q4q8in.png"
alt="Screenshot of Deploy View"
layout="responsive"
width={1103} height={523} quality={80} />

## Rollback

Rollback to previous deployments if mistakes were made.  To perform a rollback, click the three dots at the end of a previous deployment, you will then be asked to confirm your rollback.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1645149734/docs/rollback_mhww2u.png"
alt="Screenshot of Rollback Menu"
layout="responsive"
width={1518} height={502} quality={80} />

A deployment rollback will revert to the previously successful deployment. Both the Docker
image and custom variables are restored during the rollback process.

## Redeploy

A successful, failed, or crashed deployment can be re-deployed by clicking the three dots at the end of a previous deployment.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1666380373/docs/redeploy_ghinkb.png"
alt="Screenshot of Redeploy Menu"
layout="responsive"
width={888} height={493} quality={100} />

This will create an new deployment with the exact same code and build/deploy configuration.

## Cancel

Users can cancel deployments in progress by clicking the three dots at the end
of the deployment tab and select Abort deployment. This will cancel the
deployment in progress.

## Remove

If a deployment is completed, you can remove it by clicking the the three dots
at the end of the deployment tab and select Remove. This will remove the
deployment and stop any further project usage.

## Restart a Crashed Deployment

When a Deployment is `Crashed`, it is no longer running because the underlying process exited with a non-zero exit code - if your deployment exits successfully (exit code 0), the status will remain `Success`.

Railway automatically restarts crashed Deployments up to 10 times (depending on your [Restart Policy](/how-to/configure-deployment-lifecycle#restart-policy)). After this limit is reached, your deployment status is changed to `Crashed` and notifying webhooks & emails are sent to the project's members.

Restart a `Crashed` Deployment by visiting your project and clicking on the "Restart" button that appears in-line on the Deployment:

<Image
src="https://res.cloudinary.com/railway/image/upload/v1643239507/crash-ui_b2yig1.png"
alt="Screenshot of Deploy Options"
layout="responsive"
width={947} height={156} quality={80} />

Restarting a crashed Deployment restores the exact image containing the code & configuration of the original build. Once the Deployment is back online, its status will change back to `Success`.

You can also click within a deployment and using the Command Palette restart a deployment at any state.