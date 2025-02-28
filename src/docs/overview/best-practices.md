---
title: Best Practices
description: Learn the best practices to maximize performance, efficiency, and scalability of your apps on Railway.
---
{/**
To keep consistency we want each topic to follow the same convention -
- What?
- When?
- Do X.
- Why?
- Image.
*/}


Railway is a highly versatile platform, offering various ways to use it, though some may be less optimal than others for most use cases. These topics aim to help you maximize both your potential and the platform's capabilities.

## Use Private Networking When Possible

[Private networking](/reference/private-networking) allows services within a [project](/overview/the-basics#project--project-canvas) to communicate internally without the need to expose them [publicly](/guides/public-networking), while also providing faster communication and increased throughput.

When configuring environment variables in your service to reference domains or URLs of other services, ensure you use the private versions of these variables, such as `RAILWAY_PRIVATE_DOMAIN` or `DATABASE_URL`.

Using the private network enables communication between services within the same project without incurring service-to-service egress costs, which is particularly beneficial when interacting with databases or other internal services.

<Image src="https://res.cloudinary.com/railway/image/upload/v1725659271/docs/best-practices/use_private_networking_son2xp.png"
alt="screenshot of a service showing the use of private networking via reference variables"
layout="intrinsic"
width={1048} height={818} quality={100} />

<span style={{'font-size': "0.9em"}}>Screenshot showing the use of the `RAILWAY_PRIVATE_DOMAIN` [variable](/reference/variables#railway-provided-variables) being used via [referencing](/guides/variables#reference-variables).</span>

## Deploying Related Services Into the Same Project

In Railway, a [project](/overview/the-basics#project--project-canvas) serves as a container for organizing infrastructure. It can encompass an application stack, a group of [services](/overview/the-basics#services), or even multiple service groups.

If you're about to head back to the [dashboard](/overview/the-basics#dashboard--projects) to deploy another service like a database, there's a quicker way - look for the `Create` button at the top right of the Project canvas. This shortcut allows you to add new services directly to your current project.

There are a few key advantages of keeping related services within the same project -

- **Private networking** - The private network is scoped to a single environment within a project, having all related services within a single project will allow you to use private networking for faster networking along with no egress fees for service-to-service communication.

- **Project clutter** - Deploying a new service or database as an entire project will quickly become overwhelming and clutter your dashboard.

- **Variable management** - Variables can be referenced between services within a project, reducing redundancy and making it easier to manage instead of having to manually copy variables between services.

<Image src="https://res.cloudinary.com/railway/image/upload/v1725659271/docs/best-practices/related_services_in_a_project_mtxuis.png"
alt="screenshot of the project canvas showing multiple linked services"
layout="intrinsic"
width={1048} height={818} quality={100} />

<span style={{'font-size': "0.9em"}}>Screenshot showing related services within a project and their connection links.</span>

## Use Reference Variables Where Applicable

[Reference variables](/guides/variables#reference-variables) allow you to dynamically reference another variable, either from a variable set on the current [service](/overview/the-basics#services) or from another service in the same [project](/overview/the-basics#project--project-canvas).

Rather than manually copying, pasting, and hard-coding variables like a public domain or those from another service, you can use reference variables to build them dynamically. Example `VITE_BACKEND_HOST=${{Backend.RAILWAY_PUBLIC_DOMAIN}}`

This approach is better than hard-coding variables, as it keeps your variable values in sync. Change your [public domain](/reference/public-domains)? The variable updates. Change your [TCP proxy](/reference/tcp-proxy)? The variable updates.

<Image src="https://res.cloudinary.com/railway/image/upload/v1725659271/docs/best-practices/use_reference_variables_h8qtik.png"
alt="screenshot of a service showing the use of reference variables"
layout="intrinsic"
width={1048} height={818} quality={100} />

<span style={{'font-size': "0.9em"}}>Screenshot showing a reference variable used to reference the Backend's domain.</span>
