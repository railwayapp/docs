---
title: GitHub Actions PR Environment
description: Learn how to use the CLI in a GitHub Action to create environments for PRs
---

[Github Actions](https://github.com/features/actions) come with a pretty neat set of features to automate your workflows. In this post, we talk about using Github Actions alongside the [Railway CLI](https://github.com/railwayapp/cli) to create specific environments for any PR that is created, alongside closing it whenever it is closed/merged.

This can be useful if you need to create a branch on a [Neon](https://neon.tech) database, allowing you to automatically inject the correct database url.

## The Action

Make a new file in your repository called `.github/workflows/railway-pr-envs.yml` and add the following -

```yaml
# NOTE
# if you have 2fa on your account, the pr close part of the action will hang (due to 2fa not being supported non-interactively)

name: Manage PR environments (Railway)

on:
  pull_request:
    types: [opened, closed]

env:
    RAILWAY_API_TOKEN: "" # get this in account settings (make sure this is NOT a project token), and scope it to your account (not a workspace)
    SERVICE_ID: "" # service ID to inject database variable into
    ENV_NAME: "" # the environment variable name to inject (e.g DATABASE_URL)
    ENV_VALUE: "" # the value to inject
    DUPLICATE_FROM_ID: "" # railway environment to duplicate from
    LINK_PROJECT_ID: "" # project ID
    # TEAM_ID: "" if you are linking to a project in team, uncomment this

jobs:
    pr_opened:
        if: github.event.action == 'opened'
        runs-on: ubuntu-latest
        container: ghcr.io/railwayapp/cli:latest
        steps:
        - name: Link to project
          run: railway link --project ${{ env.LINK_PROJECT_ID }} --environment ${{ env.DUPLICATE_FROM_ID }} # --team ${{ env.TEAM_ID }} # uncomment this if you are linking to a team project  
        - name: Create Railway Environment for PR
          run: railway environment new pr-${{ github.event.pull_request.number }} --copy ${{ env.DUPLICATE_FROM_ID }} --service-variable ${{ env.SERVICE_ID }} "${{ env.ENV_NAME }}=${{ env.ENV_VALUE }}"

    pr_closed:
        if: github.event.action == 'closed'
        runs-on: ubuntu-latest
        container: ghcr.io/railwayapp/cli:latest
        steps:
        - name: Link to project
          run: railway link --project ${{ env.LINK_PROJECT_ID }} --environment ${{ env.DUPLICATE_FROM_ID }} # --team ${{ env.TEAM_ID }} # uncomment this if you are linking to a team project       
        - name: Delete Railway Environment for PR
          run: railway environment delete pr-${{ github.event.pull_request.number }} || true
```

**Note:** if you are using a team project, you need to ensure that the token specified is scoped to your account, not a workspace.

This can very easily be modified to run commands in order to find variables and values, and can simply be passed as flags to the railway environment create command.

## Conclusion

We hope this tutorial has been helpful and that you'll find it useful for your own projects. If you have any questions or feedback, please feel free to reach out to us on [Discord](https://discord.gg/railway), [Slack](/reference/support#slack) or the [Central Station](https://station.railway.com). Happy coding!
