---
title: Controlling GitHub Autodeploys
description: Learn how to configure GitHub autodeployments.
---

[Services linked to a GitHub repository](/services#deploying-from-a-github-repo) automatically deploy when new commits are pushed to the connected branch.

## Configure the GitHub branch for deployment triggers

To update the branch that triggers automatic deployments, go to your Service Settings and choose the appropriate trigger branch.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1713907838/docs/autodeploy-config_w5msox.png"
alt="Screenshot of GitHub Integration"
layout="responsive"
width={903} height={523} quality={80} />

## Disable automatic deployments

Click **Disable** to stop deploying automatically on new commits.

To manually trigger a deployment from the latest commit, open the Command Palette (`CMD + K`) and select **Deploy Latest Commit**. This deploys the latest commit from the currently connected GitHub branch.

## Enable automatic deployments

Autodeploy can be disabled if the project is missing required GitHub permissions, or if a project member disabled it previously.

To re-enable autodeploy, click **Enable**.

## Requirements for autodeploy

Autodeploy works only when at least one project member has a connected GitHub account with contributor access to the repository.

Public repositories where no project member has contributor access cannot use autodeploy.

If you cannot enable autodeploy, see [Troubleshooting](#troubleshooting).


## Wait for CI

<Banner variant="info">
  Please make sure you have{" "}
  <a href="https://github.com/settings/installations" target="_blank">accepted the updated GitHub permissions</a>
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

### Enabling wait for CI

If your workflow satisfies the requirements above, you will see the `Wait for CI` flag in service settings.

<Image src="https://res.cloudinary.com/railway/image/upload/v1730324753/docs/deployments/waitforci_dkfsxy.png" alt="Check Suites Configuration" layout="responsive" width={1340} height={392} quality={80} />

Toggle this on to ensure Railway waits for your GitHub Actions to run successfully before triggering a new deployment.

When enabled, deployments will be moved to a `WAITING` state while your workflows are running.

If any workflow fails, the deployments will be `SKIPPED`.

When all workflows are successful, deployments will proceed as usual.

## Troubleshooting

### Can't enable autodeploy

If autodeploy is disabled and cannot be re-enabled, check the following:

1. At least one project member has a connected GitHub account with contributor access to the repository.
2. The Railway GitHub App has access to the repository in GitHub installation settings.
3. The Railway GitHub App has no pending permission updates in GitHub.
4. After resolving access or permissions issues, wait a few minutes for Railway caches to refresh.
5. Disconnect and reconnect the repository in your service settings.
6. In the project canvas, click **Add** -> **GitHub Repository** -> **Refresh** to force a cache refresh.
7. If the issue persists, uninstall and reinstall the Railway GitHub App.

### Autodeploy enabled, but no deployment triggered

If autodeploy is enabled but the service is not deploying, check the following:

1. Check deployment history for skipped deployments. Click **Show Skipped** if needed.
2. If deployments are skipped due to watch paths, update watch paths to include the changed files.
3. If watch paths are configured, empty commits do not trigger a redeploy. Open the Command Palette (`CMD + K`) and use **Deploy Latest Commit** instead.
4. Check the [Railway status page](https://status.railway.com/) and [GitHub status page](https://www.githubstatus.com/) for known issues with webhook delivery.

### Before contacting support

If these checks pass and the issue continues, contact [support](https://station.railway.com) and include:

1. The linked project, service and environment.
2. The name of the GitHub repository where deployments are not triggering.
3. The Git branch name.
4. The Git commit SHA(s) that were not deployed and the UTC timestamp(s) for those commits.
