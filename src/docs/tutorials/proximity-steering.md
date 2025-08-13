---
title: Setting up Proximity Steering using Cloudflare
description: Learn how to set up proximity steering using Cloudflare in this step-by-step tutorial.
---

## What is Proximity Steering?

> Proximity steering routes visitors ... to the closest physical data center.

_Source: <a href="https://developers.cloudflare.com/load-balancing/understand-basics/traffic-steering/steering-policies/proximity-steering/" target="_blank">Proximity steering</a>_

Sometimes also referred to as Geo-Load Balancing.

## About this Tutorial

As Railway does not offer native Proximity Steering at this time, we instead need to place Cloudflare in front of our services to do this for us.

This tutorial aims to provide a simple step-by-step guide on setting everything up on Cloudflare to ensure Proximity Steering works flawlessly!

**Objectives**

In this tutorial, you will learn how to do the following in Cloudflare -

- Create a Health monitor.
- Create pools for each region.
- Set up the Proximity Load Balancer.

**Prerequisites**

**In Railway -**

- Have two or more identical services deployed in two or more different regions in Railway.

  Duplicating a service can be done by right clicking and selecting **Duplicate**, opening its service settings and changing the region, then clicking **Deploy**.

  The services should be configured with a Railway-generated domain, do not assign a custom domain. It is also helpful to indicate the region in the domain.

  It's recommended to use [shared variables](/guides/variables#shared-variables) or [reference variables](/guides/variables#referencing-another-services-variable) for duplicated services to keep variables in sync.

<Image src="https://res.cloudinary.com/railway/image/upload/v1722015743/docs/tutorials/proximity-load-balancing/region_services_u10ukp.png"
alt="screenshot of two railway services in different regions"
layout="responsive"
width={890} height={435} quality={100} />

- Have a `/health` or similar endpoint in the services deployed to Railway, which should return a 200 status code when queried.

  This allows Cloudflare to check the health of our Railway services so they can handle region failover. As a bonus this can also be used on Railway to achieve [zero-downtime deployments](/reference/healthchecks).

**In Cloudflare -**

- Have your desired domain setup with Cloudflare's nameservers, they have a general guide for that [here](https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/).

- Have **SSL/TLS** mode set to **Full**.

  **SSL/TLS → Overview → Full**

- Have **Always Use HTTPS** enabled.
  **SSL/TLS → Edge Certificates → Always Use HTTPS**
  This ensures that Railway avoids managing the insecure redirect, which would otherwise lead to an incorrect redirection to an upstream endpoint.

## 1. Creating a Health Monitor

- Open the Load Balancing page.

  **Traffic → Load Balancing**

<Image src="https://res.cloudinary.com/railway/image/upload/v1722015860/docs/tutorials/proximity-load-balancing/load_balancing_page_yn5bm8.png"
alt="screenshot of the load balancing page"
layout="responsive"
width={1060} height={555} quality={100} />

- Click **Manage Monitors** and then **Create**.

- Enter your desired name for this health monitor.

- Choose **HTTPS** as the type.

- Enter your health endpoint path

  Example - `/health`

- Leave Port 443 as the default.

<Image src="https://res.cloudinary.com/railway/image/upload/v1722015787/docs/tutorials/proximity-load-balancing/health_monitor_oty6pd.png"
alt="screenshot of the cloudflare health monitor"
layout="responsive"
width={1060} height={315} quality={100} />

- Click **Save**.

## 2. Creating the Pools

- Go back to the Load Balancing page.

- Click **Manage Pools** and then **Create**.

- Fill out the name and description and leave **Endpoint Steering** as its default of **Random**, it will not be used with only a single endpoint.

- Enter the endpoint name, using the service name is ideal.

- For the **Endpoint Address** we use the Railway generated domain.

  Example - `my-service-us-west2.up.railway.app`

  This should only be the domain, excluding both the scheme and trailing slash.

- For the weight option we will use a value of **1**.

- Click **Add host header** and enter the same value as used for the Endpoint Address.

  This step is important since Railway uses host-based routing and requires the host header to know how to route the incoming requests from Cloudflare.

- Remove the second empty endpoint.

  Our pool only needs to contain a single endpoint as Railway handles single region replicas for us.

<Image src="https://res.cloudinary.com/railway/image/upload/v1722015878/docs/tutorials/proximity-load-balancing/pool_settings_config_qh5s1k.png"
alt="screenshot of end endpoint settings in the pool creator"
layout="responsive"
width={1060} height={600} quality={100} />

- Click **Configure coordinates for Proximity Steering** and enter the latitude and longitude for your service region.

  | Region    |  Latitude |   Longitude |
  | --------- | --------: | ----------: |
  | US East   | 39.005111 |  -77.491333 |
  | US West   | 37.353111 | -121.936278 |
  | EU West   | 52.379139 |    4.900278 |
  | Singapore |  1.307222 |  103.790583 |

<Image src="https://res.cloudinary.com/railway/image/upload/v1722015901/docs/tutorials/proximity-load-balancing/pool_settings_proximity_rybg2r.png"
alt="screenshot of the proximity settings in the pool creator"
layout="responsive"
width={1060} height={600} quality={100} />

- Select the Monitor dropdown and add our **Health** monitor that we created earlier.

- Choose the applicable health check region according to the region where the Railway service was deployed.

<Image src="https://res.cloudinary.com/railway/image/upload/v1722015844/docs/tutorials/proximity-load-balancing/pool_settings_health_ydlzvo.png"
alt="screenshot of the health settings in the pool creator"
layout="responsive"
width={1060} height={375} quality={100} />

- Click **Save**.

- Create another pool for your other services that are deployed in your desired regions, and follow the same procedure.

This should be the end result, two or more pools -

<Image src="https://res.cloudinary.com/railway/image/upload/v1722015821/docs/tutorials/proximity-load-balancing/pools_w1gext.png"
alt="screenshot of adding pools in the load balancer creator"
layout="responsive"
width={1060} height={435} quality={100} />

## 3. Creating the Load Balancer

- Go back to the Load Balancing page.

- Click **Create Load Balancer**.

- Enter the desired hostname or leave as the default for the root hostname.

  You may need to remove the leading period from the default hostname.

<Image src="https://res.cloudinary.com/railway/image/upload/v1722016030/docs/tutorials/proximity-load-balancing/load_balancer_hostname_pfeolj.png"
alt="screenshot of the hostname in the load balancer creator"
layout="responsive"
width={1060} height={315} quality={100} />

- Click **Next**.

- Add all the pools that were previously setup.

<Image src="https://res.cloudinary.com/railway/image/upload/v1722016015/docs/tutorials/proximity-load-balancing/load_balancer_pools_egolib.png"
alt="screenshot of selected pools in the load balancer creator"
layout="responsive"
width={1060} height={585} quality={100} />

- Select the appropriate fallback pool.

<Image src="https://res.cloudinary.com/railway/image/upload/v1722015976/docs/tutorials/proximity-load-balancing/load_balancer_fallback_pool_krelrk.png"
alt="screenshot of fallback pool in the load balancer creator"
layout="responsive"
width={1060} height={260} quality={100} />

- Click **Next**.

- Monitors have already been setup on both pools, Click **Next**.

- Choose **Proximity steering**.

<Image src="https://res.cloudinary.com/railway/image/upload/v1722015998/docs/tutorials/proximity-load-balancing/load_balancer_traffic_steering_bv3kwm.png"
alt="screenshot of traffic steering options in the load balancer creator"
layout="responsive"
width={1060} height={585} quality={100} />

- Click **Next**.

- If needed, create Custom Rules, otherwise click **Next**.

- Review the Load Balancing setup, if all looks good click **Save and Deploy**.

## Conclusion

After that process you should see something like the following -

<Image src="https://res.cloudinary.com/railway/image/upload/v1722015766/docs/tutorials/proximity-load-balancing/load_balancer_exgakv.png"
alt="screenshot of the finished load balancer"
layout="responsive"
width={1060} height={585} quality={100} />

That's all for the setup! You can now open your domain and Cloudflare will automatically route your requests to the Railway service you are in closest proximity to.

**Additional Resources**

This tutorial covers setting up a Proximity Load Balancer on Cloudflare but does not cover all the settings and configurations Cloudflare offers.

We recommend checking out these resources from Cloudflare:

- [What is load balancing?](https://developers.cloudflare.com/learning-paths/load-balancing/concepts/load-balancing/)
- [Proximity steering](https://developers.cloudflare.com/load-balancing/understand-basics/traffic-steering/steering-policies/proximity-steering/)
- [Components of a load balancer](https://developers.cloudflare.com/learning-paths/load-balancing/concepts/load-balancer-components/)
- [Monitors and health checks](https://developers.cloudflare.com/learning-paths/load-balancing/concepts/health-checks/)
- [Session affinity](https://developers.cloudflare.com/learning-paths/load-balancing/planning/session-affinity/)
- [Override HTTP Host headers](https://developers.cloudflare.com/load-balancing/additional-options/override-http-host-headers/)
