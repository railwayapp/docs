---
title: Cost Control
description: Optimize your Railway projects for budget-friendly billing by setting limits and activating serverless.
---

Railway provides controls over resource usage in the form of usage limits, resource limits, private networking, and serverless auto-sleeping of inactive services.

## Usage limits

Usage Limits allow you to set a maximum limit on your usage for a billing cycle. If your resource usage for the billing cycle exceeds the limit you configured, we will shut down your workloads to prevent them from incurring further resource usage.

### Configuring usage limits

<Image src="https://res.cloudinary.com/railway/image/upload/v1743193518/docs/usage-limits_pqlot9.png" alt="Usage Limits Modal" layout="responsive" width={1200} height={1075} />

Visit the <a href="https://railway.com/workspace/usage" target="_blank">Workspace Usage page</a> to set the usage limits. Once you click the <kbd>Set Usage Limits</kbd> button, you will see a modal where you can set a <kbd>Custom email alert</kbd> and a <kbd>Hard limit</kbd>.

<Banner variant="info">The link above takes you to the usage page for your personal account. If you want to set a usage limit for your team, you can use the account switcher in the top left corner of your dashboard to access the team's usage page.</Banner>

### Custom email alert

You can think of this as a _soft limit_. When your resource usage reaches the specified amount, we will email you that this threshold has been met. Your resources will remain unaffected.

### Hard limit

Once your resource usage hits the specified hard limit, all your workloads will be taken offline to prevent them from incurring further resource usage. Think of the hard limit as the absolute maximum amount you're willing to spend on your infrastructure.

We will send you multiple reminders as your usage approaches your hard limit:

1. When your usage reaches 75% of your hard limit
2. When your usage reaches 90% of your hard limit
3. When your usage reaches 100% of your hard limit and workloads have been taken down.

<Banner variant="danger">Setting a hard limit is a possibly destructive action as you're risking having all your resources shut down once your usage crosses the specified amount.</Banner>

### Usage limits FAQ

<Collapse title="Can I set a usage limit?">
Yes, usage limits are available for all subscription plans.
</Collapse>

<Collapse title="Do I need to set a hard limit to set a custom email alert?">
No. You can leave the hard limit blank if you simply want to be notified at a particular amount of usage.
</Collapse>

<Collapse title="What is the minimum hard limit?">
The minimum amount you can specify as the hard limit is $10.
</Collapse>

<Collapse title="How can I restart my resources if I hit my usage limit?">
To restart your resources, increase your usage limit or remove it entirely. Railway will automatically redeploy your stopped services once the limit is raised or removed. If automatic recovery fails for any service, you can manually redeploy from the deployment's [3-dot menu](/deployments#deployment-menu).
</Collapse>

<Collapse title="Will my resources be automatically started during the next billing cycle?">
Railway will try to automatically restart your resources during the next billing cycle, but if automatic recovery fails for any service, you can manually redeploy from the deployment's [3-dot menu](/deployments#deployment-menu).
</Collapse>

## Resource limits

Resource limits allow you to limit the maximum amount of CPU and memory available to a service.

To configure resource limits, navigate to your service's settings > Deploy > Resource Limits.

<Image
  src="https://res.cloudinary.com/railway/image/upload/v1721917970/resource-limits.png"
  alt="Resource Limits setting"
  layout="intrinsic"
  width={1298}
  height={658}
  quality={80}
/>

<Banner variant="warning">
Setting resource limits too low will cause your service to crash.
</Banner>

Using resource limits makes sense in scenarios where:

1. You don't want to risk a high bill due to unexpected spikes in usage
2. You are okay with the service crashing if it exceeds the limit

## Use private networking

Using [Private Networking](/networking/private-networking) when communicating with other services (such as databases) within your Railway project will help you avoid unnecessary Network Egress costs.

### With databases

Communicate with your Railway database over private networking by using the `DATABASE_URL` environment variable, instead of `DATABASE_PUBLIC_URL`.

### With other services

If your Railway services need to communicate with each other, you can find the service's private URL in the service settings:

<Image src="https://res.cloudinary.com/railway/image/upload/v1743193518/docs/private-networking_nycfyk.png" alt="Private Network URL" layout="responsive" width={1558} height={1156} />

Learn more about Railway's Private Networking [here](/networking/private-networking).

## Enabling serverless

Enabling Serverless on a service tells Railway to stop a service when it is inactive, effectively reducing the overall cost to run it.

To enable Serverless, toggle the feature on within the service configuration pane in your project:

<Image src="https://res.cloudinary.com/railway/image/upload/v1696548703/docs/scale-to-zero/appSleep_ksaewp.png"
alt="Enable App Sleep"
layout="intrinsic"
width={700} height={460} quality={100} />

1. Navigate to your service's settings > Deploy > Serverless
2. Toggle "Enable Serverless"
3. To _disable_ Serverless, toggle the setting again

Read more about how Serverless works in the [Serverless page](/deployments/serverless).
