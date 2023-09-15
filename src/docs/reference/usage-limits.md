---
title: Usage Limits
---

<PriorityBoardingBanner />

Usage Limits allow you to set a maximum limit on your usage for a billing cycle. If your resource usage for the billing cycle exceeds the limit you configured, we will shut down your workloads to prevent them from incurring further resource usage.

## Configuring usage limits

<Image src="https://res.cloudinary.com/railway/image/upload/v1694775828/usage-limits_hzv9ee.png" alt="Usage Limits Modal" layout="responsive" width={1252} height={1150} />

You can visit your [account usage page](https://railway.app/account/usage) to set the usage limits for your account. Once you click the <kbd>Set Usage Limits</kbd> button, you will see the modal above where you can set a <kbd>Custom email threshold</kbd> and a <kbd>Hard limit</kbd>.

<Banner variant="info">The link above takes you to the usage page for your personal account. If you want to set a usage limit for your team, you can use the account switcher in the top left corner of your dashboard to access the team's usage.</Banner>

## Custom email threshold

You can think of this as a _soft limit_. When your resource usage reaches the specified amount, we will email you that this threshold has been met. Your resources will remain unaffected.

## Hard limit

Think of the hard limit as the absolute maximum amount you're willing to spend on your infrastructure. Once your resource usage within a billing cycle meets your hard limit, all your resources will be slept and thereby taken offline to prevent further usage.

We will send you multiple reminders as your usage approaches your hard limit:

1. When your usage reaches 75% of your hard limit
2. When your usage reaches 90% of your hard limit

If your resources are taken down, we will send you another email notifying you of the same.

<Banner variant="danger">Setting a hard limit is a possibly destructive action as you're risking having all your resources shut down once your usage crosses the specified amount.</Banner>

## FAQ

<Collapse title="Can I set a usage limit?">
Usage limits are available for all users on the Pro plan and for users on the usage-based version of the Hobby plan.
</Collapse>

<Collapse title="Do I need to set a hard limit to set a custom email threshold?">
No. You can leave the hard limit blank if you simply want to be notified at a particular amount of usage.
</Collapse>

<Collapse title="What is the minimum hard limit?">
The minimum amount you can specify as the hard limit is $20.
</Collapse>

<Collapse title="How can I restart my resources if I hit my usage limit?">
To restart your resources, you can either remove your usage limit or set it to a higher amount.
</Collapse>

<Collapse title="Will my resources be automatically started during the next billing cycle?">
No. Once your resources are shut down, it is your responsibility to restart them.
</Collapse>
