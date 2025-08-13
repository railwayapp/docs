---
title: GitHub Actions Self Hosted Runners
description: Learn how to deploy your own scalable self hosted GitHub Actions Runners on Railway. Build your own fleet of runners for your Enterprise and then scale your self-hosted runners with Railway replicas for blazing fast builds.
---

<Image src="https://res.cloudinary.com/railway/image/upload/v1746477484/docs/github-actions/j7y3ibttsmfepak5ohcb.png
"
alt="screenshot of a deployment of a self hosted GitHub Actions runner on Railway"
layout="responsive"
width={1211} height={820} quality={100} />

Deploying [GitHub Actions Self Hosted Runners](https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners/about-self-hosted-runners) on Railway is an excellent way to run your own CI infrastructure because you only [pay for what you use](/reference/pricing/plans). With self-hosted runners, you also unlock the ability to cache expensive and time-consuming dependencies (`node_modules`, `cargo`, etc.) or large git repositories. Best of all, Railway's built-in [replicas](/reference/scaling#horizontal-scaling-with-replicas) means you can scale your runners horizontally, or even distribute them to different regions with just a click and redeploy. You'll save build times and costs over using standard runners, _AND_ you'll unlock more sophistocated workflows to streamline building your app.

In this guide you'll learn:

1. The basics to deploy a GitHub Actions Self Hosted Runner on Railway.
1. How to authenticate self-hosted runners on Railway with your GitHub Organization or Enterprise.
1. How to scale up [replicas](/reference/scaling#horizontal-scaling-with-replicas) to serve bigger Actions workloads.
1. Best Practices for configuring your self-hosted runners on Railway.

**Quickstart:** [Deploy your self-hosted Runners with our Railway template](https://railway.com/new/template/pXId5Q?teamId=d546a817-7743-4892-b03a-f5a75df596f9).

## Deploy a GitHub self-hosted runner on Railway

1. Navigate to the [GitHub Actions self-hosted Runner Template](https://railway.com/new/template/pXId5Q?teamId=d546a817-7743-4892-b03a-f5a75df596f9). You'll notice the template requires an `ACCESS_TOKEN`. This token, along with our `RUNNER_SCOPE` will determine _where_ our self-hosted runners get registered on GitHub. Thankfully, this template supports self registration of your runners -- which means you can dynamically scale up or down the number of runners you have just by adjusting your `replicas`!

2. Set your `RUNNER_SCOPE` to `org`. We want to set up our self-hosted runners to register with a GitHub Organization, so any repositories within our organization can use the same pool of runners. This is super useful because you don't have to set up permissions for every single repository!

If you have a GitHub Enterprise, you can similarly set up your runners using an `ACCESS_TOKEN`, you just need to set your `RUNNER_SCOPE` as `ent` instead.

If you need additional configuration, then you can simply [add a variable to your Service](https://github.com/myoung34/docker-github-actions-runner?tab=readme-ov-file#environment-variables).

## Setup a GitHub ACCESS_TOKEN

For this guide, we will create a new [GitHub Fine-Grained Personal Access Token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#fine-grained-personal-access-tokens). These are modern personal access tokens that obey the [principle of least priviledge](https://en.wikipedia.org/wiki/Principle_of_least_privilege), making them easy to secure, revoke, and audit!

**Note:** You need to have Admin access to the organization for which you are making the `ACCESS_TOKEN`.

<Image src="https://res.cloudinary.com/railway/image/upload/v1746477254/docs/github-actions/g9uzz9dksi80zsazlohk.png
"
alt="screenshot of a GitHub Fine Grained Access Token"
layout="responsive"
width={1131} height={702} quality={100} />

1. Create a new fine-grained personal access token. [Navigate to your Settings -> Developer Settings -> Personal Access Token -> Fine-grained tokens -> Generate New Token](https://github.com/settings/personal-access-tokens)
1. Set the Resource owner as your Organization. Alternatively, if you are using a `ent` `RUNNER_SCOPE`, select your Enterprise.
1. Set Expiration
1. Under Permissions, Select Organization Permissions -> Self Hosted Runners -> Read and Write (If Enterprise, select Enterprise instead).
1. Click Generate. Save your `ACCESS_TOKEN` in a safe place! You won't see it again. (Save it in a Password Vault as an API Key!)
1. DONE. You don't need any other permissions!

## Scaling up your Railway Self Hosted Runners

<Image src="https://res.cloudinary.com/railway/image/upload/v1746476747/docs/github-actions/edwass7m7pn35zx8xqw9.png
"
alt="screenshot of scaling up your Railway self hosted Runners with Railway Replicas"
layout="responsive"
width={1328} height={690} quality={100} />

1. Navigate to the Settings tab of your Service to the Region area.
1. Change the number next to your region from `1` to your desired number of replicas.
1. Click Deploy.
1. Done! Your new replicas will automatically spin up and register themselves with GitHub.

## View Your Registered Self Hosted Runners

<Image src="https://res.cloudinary.com/railway/image/upload/v1746477028/docs/github-actions/g0twzm5fhqrgjhtltrec.png
"
alt="screenshot of viewing your Registered self hosted runners"
layout="responsive"
width={1271} height={776} quality={100} />

You can view all your runners by navigating to your organization's Actions -> Runners page at https://github.com/organizations/(your-organization-name)/settings/actions/runners?page=1

## Routing Actions Jobs

You can route jobs by simply changing the `LABELS` variable. By default, we include the `railway` label on runners you make through the [Template](https://railway.com/new/template/pXId5Q?teamId=d546a817-7743-4892-b03a-f5a75df596f9). `LABELS` is a comma (no spaces) delimited list of all the labels you want to appear on that runner. This enables you to [route jobs](https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners/using-self-hosted-runners-in-a-workflow#using-custom-labels-to-route-jobs) with the specificity that your workflows need, while still allowing you to make runners available for your entire Organization.

## Setting up GitHub Actions workflows for Pull Requests

GitHub Actions uses workflow files located in `.github/workflows/<workflow>.yml`. You can easily incorporate pre-built steps to get up-and-running quickly.

- When you want to run a workflow every time a pull request is opened, set the `on` key to `pull_request` in your `.github/workflows/<workflow>.yml`.

- Set the `runs-on` key when you want to route your workflow job to a particular runner. Use a comma delimited list for greater specificity. For example, a `[self-hosted, linux, x86, railway]` workflow needs to match all labels to an appropriate runner in order to route the job correctly.

## Example GitHub Actions Workflow

If you've never made a workflow before, here is a basic out-of-the-box example of a NuxtJS project using Bun to execute an `eslint` check.

```yml
name: eslint check

on:
  pull_request:
    branches:
      - main

permissions:
  contents: read

jobs:
  build:
    name: Check
    runs-on: [self-hosted, railway]

    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}

      - name: Install bun
        uses: oven-sh/setup-bun@v2

      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: 22

      - name: Cache Files
        uses: actions/cache@v4
        with:
          path: |
            ~/.bun/install/cache
            path: ${{ github.workspace }}/**/node_modules
            path: ${{ github.workspace }}/**/.nuxt
          key: ${{ runner.os }}-bun-${{ hashFiles('**/bun.lock', 'nuxt.config.ts', 'app.config.ts', 'app.vue') }}

      - name: Install packages
        run: bun install --prefer-offline

      - name: Lint
        run: bun run lint
```

## Best Practices

1. **Only use private repositories and disable forks:** Make sure when using self-hosted runners, that you only attach them to private repositories. A known attack vector is for a malicious actor to fork a public repository and then exfiltrate your private keys from your self-hosted runners by executing workflows on them. Disabling forks can also mitigate this attack, and it's a good idea in general for locking down security on your repositories!

1. **Seal your `ACCESS_KEY`:** While all variables are encrypted on Railway, you can prevent prying eyes (including your future self) from ever viewing your API Key. Navigate to the Variables tab and next to the `ACCESS_KEY` variable click the three-dots-menu `...` -> `Seal`. Make sure your `ACCESS_KEY` is stored in a secure Password Vault before doing this!

1. **Security Harden your self-hosted Runners:** [Security Hardening](https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions) will make your runners robust and prevent any concerns about your build infrastructure. GitHub's [detailed guide](https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions) can help you secure secrets, authentication, auditing, and managing your runners. Similarly [dduzgun-security](https://github.com/dduzgun-security/github-self-hosted-runners) and [Wiz](https://www.wiz.io/blog/github-actions-security-guide) both have excellent guides to securing your runners that are worth your time.

### Known Limitations

- Because Railway containers are non-priveleged, GitHub Workflows that [build-and-then-mount](https://github.com/super-linter/super-linter) containers on the same host (i.e. Docker-in-Docker) will fail.

- Using the Serverless Setting on this Service is _not_ recommended and will result in idle runners disconnecting from GitHub and needing to reauthenticate. GitHub Runners have a 50 second HTTP longpoll which keeps them alive. While the runners in this template can automatically reauth with an `ACCESS_TOKEN` it will result in unnecessary offline / abandoned runners. If you want your runners to deauthenticate and spin down, consider using ephemeral runners instead.

### Troubleshooting self-hosted runner communication

> A self-hosted runner connects to GitHub to receive job assignments and to download new versions of the runner application. The self-hosted runner uses an HTTPS long poll that opens a connection to GitHub for 50 seconds, and if no response is received, it then times out and creates a new long poll. The application must be running on the machine to accept and run GitHub Actions jobs.

GitHub's [documentation details all of the different endpoints](https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners/communicating-with-self-hosted-runners) your self-hosted runner needs to communicate with. If you are operating in a [GitHub Allow List](https://docs.github.com/en/enterprise-cloud@latest/organizations/keeping-your-organization-secure/managing-security-settings-for-your-organization/managing-allowed-ip-addresses-for-your-organization) environment you must add your self-hosted runners IP Address to this allow list for communication to work.

If you are using a [proxy server](https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners/using-a-proxy-server-with-self-hosted-runners), refer to GitHub's documentation on configuring your self-hosted runner. You can simply add the required environment variables by adding them to the Variables tab of your Service.

### Cost Comparison

On Railway you only [pay for what you use](/reference/pricing/plans), so you'll find your GitHub workflows are significantly cheaper. For this guide we tested over ~2,300 1 minute builds on Railway self-hosted runners and our usage costs were `$1.80` compared to [GitHub's Estimated Hosted Runner](https://github.com/pricing/calculator?feature=actions) cost of `$18.40` for the same workload. Even better? We had 10x Railway replicas with 32 vCPU and 32GB RAM for this test, meaning that our actions workflows would never slow down.

On other platforms you pay for the _maximum available_ vCPUs and Memory. On Railway, you're only paying for usage, or in the below screenshot, the filled in purple area. This enables your workloads to still burst up to the _maximum available_ resources you have configured, with no tradeoffs on cost.

<Image src="https://res.cloudinary.com/railway/image/upload/v1746386242/docs/github-actions/urc6rirvsb3folwoqoml.png"
alt="screenshot of Railway's Observability dashboard demonstrating burstable usage of Memory"
layout="responsive"
width={1604} height={800} quality={100} />
