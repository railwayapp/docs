---
title: Setting up Proximity Load Balancing using Cloudflare
---

### What is Proximity Load Balancing?

>Proximity steering routes visitors ... to the closest physical data center.

*Source: [Proximity steering](https://developers.cloudflare.com/load-balancing/understand-basics/traffic-steering/steering-policies/proximity-steering/)*

## About this Tutorial

As Railway does not yet offer native Geo or Proximity Load Balancing we instead need to place Cloudflare in front of our services to do this for us.

This tutorial aims to provide a simple step-by-step on how to set up everything on Cloudflare in order to have Proximity Load Balancing working flawlessly!

**Objectives**

In this tutorial, you will learn how to -

- Create a Health monitor.
- Create pools for each region.
- Set up a Proximity Load Balancer. 

**Prerequisites**

- Have two or more identical services deployed into two or more different regions.

<Image src="https://res.cloudinary.com/railway/image/upload/v1721850558/docs/tutorials/proximity-load-balancing/region_services_nj83ni.png"
alt="screenshot of two railway services in different regions"
layout="responsive"
width={820} height={365} quality={100} />

    Duplicate a service to another region is as simple as right clicking and selecting **Duplicate**, opening its service settings and changing the region, then clicking **Deploy**.

    The services you have deployed into the multiple regions **should only** have a Railway generated domain on them, it also helps to have the domains indicate the region.

- Have your desired domain setup with Cloudflare's nameservers, they have a general guide for that [here](https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/).

- Have **SSL/TLS** mode set to **Full** - **SSL/TLS → Overview → Full**

- Have **Always Use HTTPS** enabled - **SSL/TLS → Edge Certificates → Always Use HTTPS**
    
    This is to prevent Railway from needing to handle the insecure redirect as that would result in being redirected away to an upstream endpoint.

- Have a `/health` or similar endpoint that returns a status code of 200.

    This allows Cloudflare to check the health of our Railway services so they can handle region failover. As a bonus this can also be used on Railway to achieve [zero-download deployments](https://docs.railway.app/reference/healthchecks).


## 1. Creating a Health Monitor

- Open the Load Balancing page.

    **Traffic → Load Balancing**

<Image src="https://res.cloudinary.com/railway/image/upload/v1721850555/docs/tutorials/proximity-load-balancing/load_balancing_page_cgqtga.png"
alt="screenshot of the load balancing page"
layout="responsive"
width={1036} height={556} quality={100} />

- Click "Manage Monitors" and then "Create"

- Enter your desired name for this health monitor.

- Choose **HTTPS** as the type.

- Enter your health endpoint path, e.g. `/health`

- Leave Port 443 as the default.

<Image src="https://res.cloudinary.com/railway/image/upload/v1721850556/docs/tutorials/proximity-load-balancing/pool_settings_health_dlqtig.png"
alt="screenshot of the cloudflare health monitor"
layout="responsive"
width={1036} height={351} quality={100} />

- Click "Save"

## 2. Creating the Pools

- Go back to the Load Balancing page.

- Click "Manage Pools" and then "Create"

- Fill out the name and description, leave "Endpoint Steering" as its default, it will not be used with only a single endpoint.

- Enter the endpoint name, using the service name here is a good idea.

- For the "Endpoint Address" we use the Railway generated domain for our us-west1 service, e.g. `region-us-west1.up.railway.app` without the scheme or a trailing slash.

- For the weight option we will use a value of 1.

- Click "Add host header" and enter the same value as used for the Endpoint Address

    **Note:** Railway does host based routing so we need to set the host header so they know how to route the incoming requests from Cloudflare.

- Remove the second empty endpoint.

    **Note:** Our pool only needs to contain a single endpoint as Railway handles single region replicas for us.

<Image src="https://res.cloudinary.com/railway/image/upload/v1721850555/docs/tutorials/proximity-load-balancing/pool_settings_config_yulkcl.png"
alt="screenshot of end endpoint settings in the pool creator"
layout="responsive"
width={1036} height={581} quality={100} />

- Click **"Configure co-ordinates for Proximity Steering"** and enter the Latitude and Longitude that can be found in this [JSON file](https://www.google.com/about/datacenters/json/locations.json).

<Image src="https://res.cloudinary.com/railway/image/upload/v1721850556/docs/tutorials/proximity-load-balancing/pool_settings_proximity_tdzn7u.png"
alt="screenshot of the proximity settings in the pool creator"
layout="responsive"
width={1036} height={576} quality={100} />

- Select the Monitor dropdown and add our **Health** monitor we created earlier.

- Choose the applicable health check region according to the region that the Railway service was deployed to.

<Image src="https://res.cloudinary.com/railway/image/upload/v1721850556/docs/tutorials/proximity-load-balancing/pool_settings_health_dlqtig.png"
alt="screenshot of the health settings in the pool creator"
layout="responsive"
width={1036} height={351} quality={100} />

- Click "Save"

- Create another pool for your other services that are deployed into your desired regions, follow the same procedure.

This should be the end result, two or more pools -

<Image src="https://res.cloudinary.com/railway/image/upload/v1721850557/docs/tutorials/proximity-load-balancing/pools_llpjxd.png"
alt="screenshot of adding pools in the load balancer creator"
layout="responsive"
width={1036} height={406} quality={100} />

## 3. Creating the Load Balancer

- Go back to the Load Balancing page.

- Click "Create Load Balancer"

- Enter the desired hostname or leave as the default for the root hostname.

    **Note:** You may need to remove the leading period from the default hostname.

<Image src="https://res.cloudinary.com/railway/image/upload/v1721850555/docs/tutorials/proximity-load-balancing/load_balancer_hostname_efu1zu.png"
alt="screenshot of the hostname in the load balancer creator"
layout="responsive"
width={1036} height={286} quality={100} />  

- Click "Next"

- Add all the pools that were previously setup.

<Image src="https://res.cloudinary.com/railway/image/upload/v1721850555/docs/tutorials/proximity-load-balancing/load_balancer_pools_x5ujeg.png"
alt="screenshot of selected pools in the load balancer creator"
layout="responsive"
width={1036} height={561} quality={100} />

- Select the appropriate fallback pool.

<Image src="https://res.cloudinary.com/railway/image/upload/v1721850555/docs/tutorials/proximity-load-balancing/load_balancer_fallback_pool_g7cmfm.png"
alt="screenshot of fallback pool in the load balancer creator"
layout="responsive"
width={1036} height={256} quality={100} />

- Click "Next"

- Monitors have already been setup on both pools, Click "Next"

- Choose "Proximity steering"

<Image src="https://res.cloudinary.com/railway/image/upload/v1721850555/docs/tutorials/proximity-load-balancing/load_balancer_traffic_steering_l7fgu7.png"
alt="screenshot of traffic steering options in the load balancer creator"
layout="responsive"
width={1036} height={560} quality={100} />

- Click "Next"

- If needed, Create a Custom Rule, otherwise click "Next"

- Review the Load Balancing setup, if all looks good click "Save and Deploy"

## Conclusion

After that process you should see something like the following -

<Image src="https://res.cloudinary.com/railway/image/upload/v1721850555/docs/tutorials/proximity-load-balancing/load_balancer_gjgwrt.png"
alt="screenshot of the finished load balancer"
layout="responsive"
width={1036} height={560} quality={100} />

Thats all for the setup, you can now open your domain and Cloudflare will automatically route your request to the Railway service you are in closest proximity to.