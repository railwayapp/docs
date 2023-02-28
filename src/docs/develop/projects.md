---
title: Projects
---

<Image src="https://res.cloudinary.com/railway/image/upload/v1645132880/docs/project-page_ihrmaq.png"
alt="GIF of the CLI in Action"
layout="intrinsic"
width={779} height={442} quality={100} />

A Railway project contains any plugins, environments, and deployments that an app needs. If you are logged in, projects can be found on [your project dashboard](https://railway.app/dashboard).

All projects feature

- 100 GB outbound network bandwidth
- Ability to deploy multiple [services](/develop/services)
- Unlimited inbound network bandwidth
- Unlimited database services

Projects can contain one or multiple [services](/develop/services) to suit any application's architecture.

A new service can be spun up anywhere within the Project canvas.

## Project Canvas

<Image src="https://res.cloudinary.com/railway/image/upload/v1644620884/docs/ProjectPage_new_pa52tp.png"
alt="Screenshot of Project Canvas"
layout="responsive"
width={1377} height={823} quality={100} />

The project canvas is the default view for a project. Within it, a user can manage services and environments or select a service to view its configuration.

## Project Settings

Project specific settings can be managed through the button at the top right of the project canvas.

### General Actions

A project's name and description can be changed through this tab. The project id can also be retrieved here.

### Deleting Your Project

A project can be deleted by selecting the "Delete Project" button in the "Danger" tab. Deleting a project will delete all services, environments, and deployments associated with the project. Specific services within a project can also be deleted from this page.

## Project Member Management

<Image src="https://res.cloudinary.com/railway/image/upload/v1644620958/docs/MemberView_New_p0s3be.png"
alt="Screenshot of Project Team Members"
layout="responsive"
width={1377} height={823} quality={100} />

Under the Members tab, members can be invited to access the project.

There are three scopes for project members

- Owner: full administration of the project
- Editor: Can create deployments, change project settings and add Editor and Viewer members.
- Viewer: Read only access to the project. Viewers can not make deploys or see environment variables.

The Project Owner is charged for the project's usage.

### Project Invite Links

Each project generates a project invite link. To invite someone via a link:

1. Select the desired invited member scope
2. Copy link and send to the invitee

<Image src="https://res.cloudinary.com/railway/image/upload/v1631917785/docs/project-invite-member_kxmhtb.png"
alt="Screenshot of Invite Links"
layout="responsive"
width={910} height={272} quality={80} />

### Transferring Projects

Users can transfer projects to other users.
Note that project transfers are only allowed for users subscribed to the [Developer Plan](/reference/plans#developer-plan-offering) (both the initiator and recipient of the transfer).

In the member list under the members tab, select the three dots next to the user you want to transfer the project to.

<Image src="https://res.cloudinary.com/railway/image/upload/v1631917785/docs/project-transfer_iz4myn.png"
alt="Screenshot of Project Transfer Menu"
layout="intrinsic"
width={411} height={253} quality={80} />

The transferee receives an email with the current owner requesting to transfer the project to the user. Once that user accepts the transfer, they become the new owner of the project.

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

The activity feed can be opened by clicking the tab at the lower right of the project canvas. On Mobile Screens, the activity button is placed at the top bar.

For now, the activity feed doesn't include the team member who performed the action. [This is planned - track the request here.](https://feedback.railway.app/feature-requests/p/user-audit-logs)

## CLI Instructions

Upon Project creation, a button on the lower left opens a modal with instructions to set up projects locally. After setup, the button can by dismissed by selecting `Project setup is done`. [See our page on the CLI for more information.](/develop/cli/)

## Project Visibility

### Private Projects

Projects are private by default. Private projects:

- Are only accessible to members of the project

### Public Projects

<Image
src="https://res.cloudinary.com/railway/image/upload/v1663700589/docs/visible_vjqct8.png"
alt="Screenshot of Project Visibility Setting"
layout="intrinsic"
width={712} height={291} quality={80} />

Public projects allow you to share your project in a read-only state with anyone on the internet.

Public visibility is helpful for educators who want to show students how their projects look before a user deploys their own.

- Viewers don't need a Railway account to see the project
- Environment variables are private from viewers
- Services and Deployment logs are public
