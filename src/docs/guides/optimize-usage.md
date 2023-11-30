---
title: Optimize Usage
---

Railway provides controls over resource usage in the form of usage limits and auto-sleeping of inactive services.

## Configuring Usage Limits

Usage Limits allow you to set a maximum limit on your usage for a billing cycle.

Visit the <a href="https://railway.app/account/usage" target="_blank">Account Usage page</a> to set the usage limits. Once you click the <kbd>Set Usage Limits</kbd> button, you will see a modal above where you can set a <kbd>Custom email alert</kbd> and a <kbd>Hard limit</kbd>.

<Image src="https://res.cloudinary.com/railway/image/upload/v1694775828/usage-limits_hzv9ee.png" alt="Usage Limits Modal" layout="responsive" width={1252} height={1150} />

#### Setting Limits for Teams

If you want to set a usage limit for your team, use the account switcher in the top left corner of your dashboard to access the team's usage page.

### Custom email alert

Configure a soft limit by setting a threshold in Custom email alert.  When your resource usage reaches the specified amount, we will email you that this threshold has been met and resources continue running.

### Hard limit

Configure a hard limit to take resources offline once usage meets the specified threshold.

Multiple emails will be sent as your usage approaches your hard limit:

1. When your usage reaches 75% of your hard limit
2. When your usage reaches 90% of your hard limit
3. When your usage reaches 100% of your hard limit and workloads have been taken down.

<Banner variant="danger">Setting a hard limit is a possibly destructive action as you're risking having all your resources shut down once your usage crosses the specified amount.</Banner>

Find more information about Usage Limits in the [reference page](/reference/usage-limits).

## Enabling App Sleeping

<PriorityBoardingBanner />

Enabling App Sleep on a service tells Railway to stop a service when it is inactive, effectively reducing the overall cost to run it.

To enable App Sleeping, toggle the feature on within the service configuration pane in your project:

<Image src="https://res.cloudinary.com/railway/image/upload/v1696548703/docs/scale-to-zero/appSleep_ksaewp.png"
alt="Enable App Sleep"
layout="intrinsic"
width={700} height={460} quality={100} />

1. Navigate to your service's settings > Deploy > App Sleeping
2. Toggle "Enable App Sleeping"
3. To _disable_ App Sleeping, toggle the setting again

Read more about how App Sleeping works in the [App Sleeping Reference page](/reference/app-sleeping).