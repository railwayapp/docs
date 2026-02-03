---
title: Optimize Usage
description: Optimize your Railway projects for budget-friendly billing by setting limits and activating app sleep.
---

Railway provides controls over resource usage in the form of usage limits and auto-sleeping of inactive services.

## Configuring Usage Limits

Usage Limits allow you to set a maximum limit on your usage for a billing cycle.

Visit the <a href="https://railway.com/workspace/usage" target="_blank">Workspace Usage page</a> to set the usage limits. Once you click the <kbd>Set Usage Limits</kbd> button, you will see a modal above where you can set a <kbd>Custom email alert</kbd> and a <kbd>Hard limit</kbd>.

<Image src="https://res.cloudinary.com/railway/image/upload/v1743193518/docs/usage-limits_pqlot9.png" alt="Usage Limits Modal" layout="responsive" width={1200} height={1075} />

#### Setting Limits for Workspaces

If you want to set a usage limit for a different workspace that you are an admin of, use the account switcher in the top left corner of your dashboard to access that workspace's usage page.

### Custom Email Alert

Configure a soft limit by setting a threshold in Custom email alert. When your resource usage reaches the specified amount, we will email you that this threshold has been met and resources continue running.

### Hard Limit

Configure a hard limit to take resources offline once usage meets the specified threshold.

Multiple emails will be sent as your usage approaches your hard limit:

1. When your usage reaches 75% of your hard limit
2. When your usage reaches 90% of your hard limit
3. When your usage reaches 100% of your hard limit and workloads have been taken down.

<Banner variant="danger">Setting a hard limit is a possibly destructive action as you're risking having all your resources shut down once your usage crosses the specified amount.</Banner>

Find more information about Usage Limits in the [reference page](/reference/usage-limits).

## Use Private Networking

Using [Private Networking](/guides/private-networking) when communicating with other services (such as databases) within your Railway project will help you avoid unnecessary Network Egress costs.

### With Databases

Communicate with your Railway database over private networking by using the `DATABASE_URL` environment variable, instead of `DATABASE_PUBLIC_URL`:

### With Other Services

If your Railway services need to communicate with each other, you can find the service's private URL in the service settings:

<Image src="https://res.cloudinary.com/railway/image/upload/v1743193518/docs/private-networking_nycfyk.png" alt="Private Network URL" layout="responsive" width={1558} height={1156} />

Learn more about Railway's Private Networking [here](/guides/private-networking).

## Enabling Serverless

Enabling Serverless on a service tells Railway to stop a service when it is inactive, effectively reducing the overall cost to run it.

To enable Serverless, toggle the feature on within the service configuration pane in your project:

<Image src="https://res.cloudinary.com/railway/image/upload/v1696548703/docs/scale-to-zero/appSleep_ksaewp.png"
alt="Enable App Sleep"
layout="intrinsic"
width={700} height={460} quality={100} />

1. Navigate to your service's settings > Deploy > Serverless
2. Toggle "Enable Serverless"
3. To _disable_ Serverless, toggle the setting again

Read more about how Serverless works in the [Serverless Reference page](/reference/app-sleeping).

## Resource Limits

Resource limits are a way to limit the maximum amount of resources available to a service.

To toggle resource limits, navigate to your service's settings > Deploy > Resource Limits.

<Image
  src="https://res.cloudinary.com/railway/image/upload/v1721917970/resource-limits.png"
  alt="Resource Limits setting"
  layout="intrinsic"
  width={1298}
  height={658}
  quality={80}
/>

### Use Resource Limits

<Banner variant="warning">
Setting resource limits too low will cause your service to crash.
</Banner>

Using resource limits makes sense in scenarios where:

1. You don't want to risk a high bill due to unexpected spikes in usage
2. You are okay with the service crashing if it exceeds the limit
