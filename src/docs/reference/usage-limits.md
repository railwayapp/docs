---
title: Usage Limits
---

Usage Limits allow you to set a maximum limit on your usage for a billing cycle. If your resource usage for the billing cycle exceeds the limit you configured, we will shut down your workloads to prevent them from incurring further resource usage.

## Configuring Usage Limits

<Image src="https://res.cloudinary.com/railway/image/upload/v1694775828/usage-limits_hzv9ee.png" alt="Usage Limits Modal" layout="responsive" width={1252} height={1150} />

Visit your [account usage page](https://railway.com/account/usage) to set the usage limits. Once you click the <kbd>Set Usage Limits</kbd> button, you will see a modal above where you can set a <kbd>Custom email alert</kbd> and a <kbd>Hard limit</kbd>.

<Banner variant="info">The link above takes you to the usage page for your personal account. If you want to set a usage limit for your team, you can use the account switcher in the top left corner of your dashboard to access the team's usage page.</Banner>

## Custom Email Alert

You can think of this as a _soft limit_. When your resource usage reaches the specified amount, we will email you that this threshold has been met. Your resources will remain unaffected.

## Hard Limit

Once your resource usage hits the specified hard limit, all your workloads will be taken offline to prevent them from incurring further resource usage. Think of the hard limit as the absolute maximum amount you're willing to spend on your infrastructure.

We will send you multiple reminders as your usage approaches your hard limit:

1. When your usage reaches 75% of your hard limit
2. When your usage reaches 90% of your hard limit

We will send you another email if your workloads are taken down due to your specified usage limits.

<Banner variant="danger">Setting a hard limit is a possibly destructive action as you're risking having all your resources shut down once your usage crosses the specified amount.</Banner>

## FAQ

<Collapse title="Can I set a usage limit?">
Usage limits are available for all users on the Pro plan and for users on the automatic payment Hobby plan model.

Usage limits are not available for users on the prepaid plans. Instead, the amount of credits you load determines the hard limit.
</Collapse>

<Collapse title="Do I need to set a hard limit to set a custom email alert?">
No. You can leave the hard limit blank if you simply want to be notified at a particular amount of usage.
</Collapse>

<Collapse title="What is the minimum hard limit?">
The minimum amount you can specify as the hard limit is $10.
</Collapse>

<Collapse title="How can I restart my resources if I hit my usage limit?">
To restart your resources, you can either increase your usage limit or remove it entirely.

For guidance on restarting your resources, please refer to our [FAQ](/reference/pricing/faqs#my-services-were-stopped-what-do-i-do) section.
</Collapse>

<Collapse title="Will my resources be automatically started during the next billing cycle?">
No. Once your resources are shut down, it is your responsibility to restart them.
</Collapse>
