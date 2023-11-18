---
title: Projects
---

<Image src="https://res.cloudinary.com/railway/image/upload/v1645132880/docs/project-page_ihrmaq.png"
alt="GIF of the CLI in Action"
layout="intrinsic"
width={779} height={442} quality={100} />

A Railway project contains any plugins, environments, and deployments that an app needs. If you are logged in, projects can be found on [your project dashboard](https://railway.app/dashboard).

## Project Resources

- 100 GB outbound network bandwidth
- Ability to deploy multiple [services](/reference/services)
- Unlimited inbound network bandwidth
- Unlimited database services

## Project Activity Feed

<Image
src="https://res.cloudinary.com/railway/image/upload/v1644302072/docs/activity_ctz3yb.png"
alt="Screenshot of Activity Pane"
layout="intrinsic"
width={387} height={297} quality={80} />

The activity feed displays a chronological feed of administrative actions performed within all or the current environment.

Currently, the activity feed tracks the following events.

- Environment variable updates
- Deployment status
- Service creation/removal

For now, the activity feed doesn't include the team member who performed the action. [This is planned - track the request here.](https://feedback.railway.app/feature-requests/p/user-audit-logs)

## Project Visibility

Projects are private by default and only accessible to members of the project.

You have the ability to update a project's visibility to public.  Public projects allow you to share your project in a read-only state with anyone on the internet.

Public visibility is helpful for educators who want to show students how their projects look before a user deploys their own.

- Viewers don't need a Railway account to see the project
- Environment variables are private from viewers
- Services and Deployment logs are public

Find instructions for updating your project's visibility [here](/how-to/projects#updating-project-visibility).

## Transferring Projects

Users can transfer projects to other users or to Teams if they have just signed up for Pro.

- Project transfers to other users are only allowed for users subscribed to the [Hobby Plan](/reference/pricing#plans) (both the initiator and recipient of the transfer).

- Project transfers to [Teams]() are only allowed for users who are members of an existing Team.