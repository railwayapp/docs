---
title: Controlling Github Autodeploys
---

[Services that are linked to a GitHub repo](/how-to/create-and-manage-services#deploying-from-a-github-repo) automatically deploy when new commits are detected in the connected branch.

## Configure the GitHub branch for deployment triggers

To update the branch that triggers automatic deployments, go to your Service Settings and choose the appropriate trigger branch.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1699395694/docs/deployTrigger_tuxk5l.png"
alt="Screenshot of GitHub Integration"
layout="responsive"
width={1103} height={523} quality={80} />

### Disable Automatic Deployments

To disable automatic deployment, simply choose `Disable Trigger` from your Service Settings.

## Enable Check Suites

<Banner variant="info">
  Please make sure you have{" "}
  <Link href="https://github.com/settings/installations">accepted our updated GitHub permissions</Link>{" "}
  required for this feature to work.
</Banner>

Enable the `Check Suites` flag in service settings to ensure Railway waits for your GitHub Actions to run successfully before triggering a new deployment.

<Image src="https://res.cloudinary.com/railway/image/upload/v1671003153/docs/check-suites.png" alt="Check Suites Configuration" layout="responsive" width={1340} height={392} quality={80} />

When enabled, deployments will be moved to a `WAITING` state while your workflows are running. 

If any workflow fails, the deployments will be `SKIPPED`. 

When all workflows are successful, deployments will proceed as usual.