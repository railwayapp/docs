---
title: Controlling GitHub Autodeploys
description: Learn how to configure GitHub autodeployments.
---

[Services that are linked to a GitHub repo](/guides/services#deploying-from-a-github-repo) automatically deploy when new commits are detected in the connected branch.

## Configure the GitHub Branch for Deployment Triggers

To update the branch that triggers automatic deployments, go to your Service Settings and choose the appropriate trigger branch.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1713907838/docs/triggerBranch_tzf9q3.png"
alt="Screenshot of GitHub Integration"
layout="responsive"
width={903} height={523} quality={80} />

### Disable Automatic Deployments

To disable automatic deployment, simply hit `Disconnect` in the Service Settings menu.

*Note: To manually trigger a deployment from the latest commit, use the Command Pallette: `CMD + K` -> "Deploy Latest Commit".  This will deploy the latest commit from the **Default** branch in GitHub.*

*Currently, there is no way to force a deploy from a branch other than the Default without connecting it in your service settings.*

## Wait for CI

<Banner variant="info">
  Please make sure you have{" "}
  <a href="https://github.com/settings/installations" target="_blank">accepted our updated GitHub permissions</a>
  required for this feature to work.
</Banner>

To ensure Railway waits for your GitHub Actions to run successfully before triggering a new deployment, you should enable **Wait for CI**.

#### Requirements

- You must have a GitHub workflow defined in your repository.  
- The GitHub workflow must contain a directive to run on push:

    ```plaintext
    on:
      push:
        branches:
          - main
    ```

### Enabling Wait for CI

If your workflow satisfies the requirements above, you will see the `Wait for CI` flag in service settings.

<Image src="https://res.cloudinary.com/railway/image/upload/v1730324753/docs/deployments/waitforci_dkfsxy.png" alt="Check Suites Configuration" layout="responsive" width={1340} height={392} quality={80} />

Toggle this on to ensure Railway waits for your GitHub Actions to run successfully before triggering a new deployment.

When enabled, deployments will be moved to a `WAITING` state while your workflows are running.

If any workflow fails, the deployments will be `SKIPPED`.

When all workflows are successful, deployments will proceed as usual.
