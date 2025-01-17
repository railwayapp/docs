---
title: Railway Metal
---

Railway Metal is the next generation of Railway's underlying infrastructure.
It is built on hardware that we own and operate in datacenters around the world.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1736893474/docs/m0_homdt8.png"
alt="Railway Metal Region"
layout="responsive"
width={1184} height={322} quality={80} />

Learn more about how we built it in our blog post [So You Want to Build Your Own Data Center](https://blog.railway.com/p/data-center-build-part-one).

## Why?

We are making this move as part of our commitment to providing best-in-class
infrastructure for our users. This change enables us to improve our platform's
performance, unlock additional features, increase reliability, and make
Railway more cost-effective for all users.

With Railway Metal, you can expect the following benefits:

- **Regions for Trial & Hobby plan users**: Railway Metal will be available to
  all users, including Trial & Hobby Plan users. Trial & Hobby plan users will
  be able to deploy services on all four Railway Metal regions in the US,
  Europe, and Southeast Asia.

- **Cheaper Pricing**: Running our own hardware lets us reduce prices. Once
  Railway Metal is Generally Available, all users can expect to pay up to 50%
  less for Network Egress, and up to 40% less for Disk Usage.

- **Improved Performance**: Services on Railway will run faster. Our new CPUs
  are more powerful with higher core count and better performance per-core.
  Volume read/write performance will also be significantly faster as all
  of our disks are NVMe SSDs, which are faster than the disks we could offer
  before.

- **Enhanced Reliability**: With Railway Metal, we are able to manage the
  hardware, software, and networking stack end-to-end. This allows us to move
  faster and fix problems more quickly. (For instance, before Railway Metal,
  incidents such as [a single host failure](https://status.railway.com/cm44jp6qh00jydhwlyxsix3vl) would often take us ~60 minutes to bring the host back up. With our own
  hardware, we can bring the host back up significantly faster.)

- **Improved Networking**: We connect directly to major internet providers and
  other cloud platforms worldwide, giving you faster connections in and out
  of Railway.

- **Higher Available Resources**: Railway Metal has greater capacity that we
  will be increasing over time, allowing us to offer you more computing
  resources on-demand.

- **Unlocks More Features**: With our own hardware and networking stack, we
  can power more advanced features that were not possible before, such as
  Static Inbound IPs, Anycast Edge Network, High-Availability Volumes, etc.

## Regions & Availability

Railway Metal is available to all users, including Trial & Hobby Plan users.

Each Railway Metal region is located in a datacenter that was chosen
strategically to provide the best possible performance and reliability.

We are in the process of expanding our Railway Metal regions, and we expect to
have all regions available by the end of Q1'2025 (by 31 March 2025).

| Railway Metal Region       | Status                            |
| -------------------------- | --------------------------------- |
| US West (California)       | 🟢 Active                         |
| US East (Virginia)         | 🟢 Active                         |
| Europe West (Amsterdam)    | 🟠 End of Q1'2025 (31 March 2025) |
| Southeast Asia (Singapore) | 🟠 End of Q1'2025 (31 March 2025) |

## Gradual Upgrade

We will gradually move services without a [volume](/reference/volumes)
to Railway Metal as we increase the pool of our hardware and its capabilities.

When this happens, you may see a new deploy initiated by Railway in your service:

<Image
src="https://res.cloudinary.com/railway/image/upload/v1736969764/docs/m1_zw5m4f.png"
alt="Automatic upgrade banner"
layout="responsive"
width={1704} height={434} quality={80} />

Because this is a new deploy of your latest Active deployment, the behaviour
will be the same as if you've manually issued a new deploy. As such, you may
notice that:

- There may be a brief downtime during the upgrade. To prevent this, ensure
  you have [Health Checks](/reference/healthchecks) set up for your service

- All ephemeral storage (such as `/tmp`, etc.) will be wiped. To prevent this,
  use [Volume](/reference/volumes) to store data persistently. All storage is
  considered ephemeral unless they're on a Railway Volume

Note that the above generally applies to deploying a new version of
your service. The upgrade to Railway Metal is irrelevant to the behaviour
you may run into above - they are the same as if you were to manually deploy
a new version of your service.

For services in `US West (Oregon)`, Railway will not move your service to
Railway Metal if your service [references another service](/guides/variables#referencing-another-services-variable-example) with a volume.
This is to prevent any cross-regional networking latency spikes for your
service. Refer to [this FAQ](#im-experiencing-slow-network-performance-after-switching-to-us-west-california-railway-metal-region-what-should-i-do) for more information.

### Rollback

If you encounter any issues with your service after the upgrade, you can
rollback to the previous version by clicking `Rollback` button in the banner
above.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1736970652/docs/m4_rtxp2z.png"
alt="Automatic rollback"
layout="responsive"
width={1338} height={608} quality={80} />

### Manual rollback

To rollback manually, modify your service's `Settings -> Deploy -> Regions`
and select regions without the `Metal (New)` tag.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1736970930/docs/m3_kvwdgd.png"
alt="Manual rollback"
layout="responsive"
width={1140} height={560} quality={80} />

## Known Limitations

- Railway Metal is currently unavailable for services with a [volume](/reference/volumes)
- For Pro users, [Static IPs](/reference/static-outbound-ips) is currently unavailable on Railway Metal regions

## Timeline

Our transition to Railway Metal will happen in phases. Here's what you can
expect:

| Date                                | What's Happening                                                                                                                                                          | Status |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| Starting December 26th, 2024        | All new deploys on newly-created services without a [volume](/reference/volumes) by Trial & Hobby users will use Railway Metal by default.                                | 🟢     |
| Starting January 1st, 2025          | We will be gradually upgrading services _without a [volume](/reference/volumes)_ to Railway Metal. You can learn more about the gradual upgrade [here](#gradual-upgrade). | 🟠     |
| Starting January 31st, 2025         | All new deploys on all services _without a [volume](/reference/volumes)_ by Trial & Hobby users will use Railway Metal by default.                                        | 🔘     |
| Starting February 14th, 2025        | All new deploys on all services _without a [volume](/reference/volumes)_ by Pro & Enterprise users will use Railway Metal by default.                                     | 🔘     |
| Starting March 14th, 2025           | All new deploys on services _with a [volume](/reference/volumes)_ by Trial & Hobby users will use Railway Metal by default.                                               | 🔘     |
| Starting March 28th, 2025           | All new deploys on services _with a [volume](/reference/volumes)_ by Pro & Enterprise users will use Railway Metal by default.                                            | 🔘     |
| In Q2'2025 (after March 31st, 2025) | We will begin migrating services _with a [volume](/reference/volumes)_ to Railway Metal. We will share more details about this as we get closer to the date.              | 🔘     |

## FAQ

### Is this a free upgrade?

Yes.

### How do I receive the upgrade sooner?

Go to your service's `Settings -> Deploy -> Regions`, and select any region
with the `Metal (New)` tag.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1736970930/docs/m3_kvwdgd.png"
alt="Manual rollback"
layout="responsive"
width={1140} height={560} quality={80} />

Refer to [Regions & Availability](#regions--availability) to see the regions
available for Railway Metal.

### How do I know if I'm on Railway Metal?

To check if your service is running on Railway Metal, go to your service's
`Settings -> Deploy -> Regions`. If you are on Railway Metal, you will see a
`Metal (New)` tag next to the region.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1736970930/docs/m3_kvwdgd.png"
alt="Manual rollback"
layout="responsive"
width={1140} height={560} quality={80} />

### Is Railway Metal stable?

Yes. We have been running a growing amount of deployments on it for the past
several months. As of the time of this writing, there are ~40,000 deployments
on Railway Metal, and we have not seen any significant issues.

### Is there downtime if I upgrade?

Upgrading to Railway Metal re-deploys your service. This may cause a brief
period of downtime as your new deploy is being set up. You can set up
[Health Checks](/reference/healthchecks) to prevent this.

### What is the difference between Railway Metal and regions?

Railway Metal refers to our own hardware and infrastructure. Regions refer to
the physical location of the datacenter where the hardware is located.

### I'm experiencing slow network performance after switching to US West (California) Railway Metal region. What should I do?

You may experience increased latency if your application is communicating with
other services (such as databases) in `US West (Oregon)`. This is caused by the
physical distance between Oregon (our current region) and California
(Railway Metal region).

We recommend switching back to the `US West (Oregon)` region if you are
experiencing increased latency after upgrading to `US West (California)`.
See [Manual rollback](#manual-rollback) for instructions.

### How do I opt-out?

There is no way to opt-out of Railway Metal. Please [reach out to us](#getting-help)
if you have any concerns.

## Getting Help

Please reach out to us [on our Help Station](https://help.railway.com/feedback/feedback-railway-metal-a41f03a1) if you run into any issues. You can also reach out to us over [Slack](/reference/support#slack) if you are
a Pro or [Business Class / Enterprise](/reference/support#business-class)
customer.
