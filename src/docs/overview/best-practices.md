---
title: Best Practices
---

Railway is a highly versatile platform, offering various ways to use it, though some may be less optimal than others for most use cases. the topics here aim to help you maximize the platform's potential.

## Use Private networking

[Private networking](/reference/private-networking) allows services within a project to communicate internally without the need to expose them publicly, while also providing faster communication and increased throughput.

<Image src="https://res.cloudinary.com/railway/image/upload/v1725659271/docs/best-practices/use_private_networking_son2xp.png"
alt="screenshot of a service showing the use of private networking via reference variables"
layout="intrinsic"
width={1048} height={818} quality={100} />

<span style={{'font-size': "0.9em"}}>Screenshot showing the use of the `RAILWAY_PRIVATE_DOMAIN` [variable](https://docs.railway.app/reference/variables#railway-provided-variables) being used via [referencing](/guides/variables#reference-variables).</span>

The private network has no egress fees, allowing you to avoid service-to-service egress costs when communicating with a database or other services within the same project.

## Deploying related Services into the same Project

It can be all too easy to create a new project each time you deploy a database or service, but there are a few reasons to keep related services within the same project.

<Image src="https://res.cloudinary.com/railway/image/upload/v1725659271/docs/best-practices/related_services_in_a_project_mtxuis.png"
alt="screenshot of the project canvas showing multiple linked services"
layout="intrinsic"
width={1048} height={818} quality={100} />

<span style={{'font-size': "0.9em"}}>Screenshot showing related services within a project and their connection links.</span>

- **Private networking** - The private network is scoped to a single environment within a project, having all related services within a single project will allow you to use private networking for faster networking along with no egress fees for service-to-service communication.

- **Project clutter** - Deploying a new service or database as an entire project will quickly become overwhelming and clutter your dashboard.

## Use Reference variables

Reference variables allow you to reference another variable, either within the current service or from another service in the same project.

<Image src="https://res.cloudinary.com/railway/image/upload/v1725659271/docs/best-practices/use_reference_variables_h8qtik.png"
alt="screenshot of a service showing the use of reference variables"
layout="intrinsic"
width={1048} height={818} quality={100} />

<span style={{'font-size': "0.9em"}}>Screenshot showing a reference variable used to reference the Backend's domain.</span>

This is recommended over copying and pasting variables you need to access in another service, for example.

Using reference variables ensures your variable values are always in sync. Change your TCP proxy? The variable updates. Change your backend hostname? The variable updates.

For examples of how to use reference variables, please see our [reference variable guide](/guides/variables#reference-variables).