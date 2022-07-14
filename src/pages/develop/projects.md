---
title: Projects
---

<Image src="https://res.cloudinary.com/railway/image/upload/v1645132880/docs/project-page_ihrmaq.png"
alt="Gif of the CLI in Action"
layout="intrinsic"
width={779} height={442} quality={100} />

A Railway project contains all of your plugins, environments, and deployments. If you are logged in, all of your projects can be found on [your project dashboard](https://railway.app/dashboard).

All projects feature

- 100 GB outbound network bandwidth
- Ability to deploy multiple [services](/develop/services)
- Unlimited inbound network bandwidth
- Unique copy of your infra for each PR
- Unlimited database services per project

Projects can contain one or multiple [services](/develop/services) to suit your application's architecture.

A new service can be spun up anywhere within the Project canvas.

## Project Canvas

The project canvas is the default view for a project. Within it, you can perform administrative actions, view services, manage environments, select a service to view more information, and spin up new services.

<Image src="https://res.cloudinary.com/railway/image/upload/v1644620884/docs/ProjectPage_new_pa52tp.png"
alt="Screenshot of Project Canvas"
layout="responsive"
width={1377} height={823} quality={100} />

You can click and drag anywhere within the project canvas to focus on different areas of your infrastructure.

## Project Settings

You can manage project specific settings under the Project Settings page accessible by the button on the top right in the project canvas.

### General Actions

Under the Settings > General page you can change the project's name and description as well as retrieve the `projectId`.

### Deleting Your Project

You can delete the project within the Settings > Danger page. Deleting a project will delete all running deploys of the service(s) within a project. Within this menu you may also delete any specific service.

## Project Member Management

<Image src="https://res.cloudinary.com/railway/image/upload/v1644620958/docs/MemberView_New_p0s3be.png"
alt="Screenshot of Project Team Members"
layout="responsive"
width={1377} height={823} quality={100} />

Under the Members tab, you can invite members to access the project.

There are three scopes for project members

- Owner: full administration of the project
- Editor: adminstration and can make deployments to the project, sans the ability to remove the Owner from the project
- Viewer: Read only access to the project. Viewers can not make deploys.

Only project owners are charged for project usage.

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

Under the members list in the members tab - click the 3 dots menu at the end of the user you'd like to transfer the project to.

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

- Variable upserts
- Deployment status
- Service creation/removal

The activity feed can be opened by clicking the tab at the lower right of the project canvas. On Mobile Screens, the activity button is placed at the top bar.

For now, the activity feed doesn't include the team member who performed the action. [This is planned - track the request here.](https://feedback.railway.app/feature-requests/p/user-audit-logs)

## CLI Instructions

Upon Project creation, a button on the lower left opens a modal with instructions to set up your project locally. After setup, you can dismiss the button entirely by pressing `Project setup is done`. [See our page on the CLI for more information.](/develop/cli/)

## Project Visibility

### Temporary Projects

Projects that are not created by a user that is logged in are considered temporary. These projects

- Are destroyed **1 day** after they are created
- Are readable and writable by anyone
- Can be **claimed** by any user to convert it into a private project

### Private Projects

Projects that are created by a user that is logged in or that have been claimed are considered private. These projects

- Are only accessible to members of the project
- Are private and require permission to access
