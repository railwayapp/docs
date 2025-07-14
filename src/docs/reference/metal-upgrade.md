---
title: Railway Metal Upgrade
description: Get information about Railway's move to Self-Hosted Metal
---

Railway is moving to self-hosted regions across the world called Railway Metal. This page provides information about the upgrade process to Railway Metal, what to expect, and how to manage the transition.

## What is Railway Metal?

Railway Metal is Railway's next-generation infrastructure built on hardware that we own and operate in datacenters around the world. This move enables better performance, lower costs, and unlocks new features.

For a comprehensive overview of Railway Metal, its benefits, and our roadmap, please visit the [Railway Metal](/railway-metal) documentation.

## Automatic Upgrades

As part of our transition to Railway Metal, Railway will automatically migrate eligible services. When this happens:

1. You'll see a new deploy initiated by Railway in your service
2. A notification banner will appear informing you about the upgrade
3. Your service will be redeployed on Railway Metal infrastructure

<Image
src="https://res.cloudinary.com/railway/image/upload/v1740604169/CleanShot_2025-02-26_at_16.04.18_2x_uayioh.png"
alt="Automatic upgrade banner"
layout="responsive"
width={940} height={236} quality={80} />

## What to Expect During the Upgrade

When your service is upgraded to Railway Metal:

- **Brief Downtime**: There may be a short period of downtime as your service is redeployed. To minimize this, ensure you have [Health Checks](/reference/healthchecks) configured.
- **Ephemeral Storage Reset**: Any ephemeral storage (like `/tmp` directories) will be wiped. Use [Volumes](/reference/volumes) for persistent data storage.
- **Same Behavior**: The upgrade behavior is identical to a manual redeploy of your service. Any effects you'd normally expect during a redeploy will apply here as well.
- **Region Change**: Your service may be moved to a different geographical location within the same region (e.g., from US West Oregon to US West California). This is normal and part of the migration to our own hardware.

## Eligibility for Automatic Upgrades

Services will be upgraded based on our [published timeline](/railway-metal#timeline). Currently:

- Services without volumes are eligible for automatic upgrade
- Services with volumes will be eligible starting in March 2025
- Certain features like Static IPs for Pro users aren't yet available on Railway Metal regions

## Managing the Upgrade

### If You Experience Issues

If you encounter any problems after the upgrade, you can roll back to the previous infrastructure by:

1. Clicking the **Rollback** button in the upgrade notification banner

<Image
src="https://res.cloudinary.com/railway/image/upload/v1740604169/CleanShot_2025-02-26_at_16.04.18_2x_uayioh.png"
alt="Automatic upgrade banner"
layout="responsive"
width={940} height={236} quality={80} />

### Manual Rollback

You can also manually roll back by:

1. Going to your service's **Settings → Deploy → Regions**
2. Selecting regions without the **Metal (New)** tag

<Image
src="https://res.cloudinary.com/railway/image/upload/v1736970930/docs/m3_kvwdgd.png"
alt="Manual region selection"
layout="responsive"
width={1140} height={560} quality={80} />

### Opting In Early

If you'd like to upgrade to Railway Metal before your automatic migration:

1. Go to your service's **Settings → Deploy → Regions**
2. Select any region with the **Metal (New)** tag
3. Deploy your service to apply the change

## Cross-Region Considerations

If you have services that reference each other (particularly services with volumes), be aware that migrating only some services to Railway Metal may introduce latency if they end up in physically distant datacenters.

For example, if your application in US West (California) Railway Metal region communicates with a database in US West (Oregon), you may experience increased latency. In such cases, consider rolling back to the original region until all your services can migrate together.

## Getting Help

If you need assistance with your Railway Metal upgrade:

- Submit feedback through our [Central Station](https://station.railway.com/feedback/feedback-railway-metal-a41f03a1)
- Enterprise customers with $2,000/month committed spend can reach out via [Slack](/reference/support#slack)
- See our [FAQ on Railway Metal](/railway-metal#faq) for answers to common questions

Remember, this is a free upgrade for all users and is designed to provide an improved experience across all aspects of the Railway platform.
