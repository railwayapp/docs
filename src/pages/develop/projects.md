---
title: Projects
---

A Railway project contains all of your plugins, environments, and deployments. If you are logged in, all of your projects can be found on [your project dashboard](https://railway.app/dashboard).

All projects feature

- 100 GB outbound network bandwidth
- GitHub repo deployment triggers
- Unlimited inbound network bandwidth
- Unique copy of your infra for each PR
- Multiple custom domains with SSL
- Unlimited plugins per project

There are two types of projects.

## Temporary Projects

Projects that are not created by a user that is logged in are considered temporary. These projects

- Are destroyed **7 days** after they are created
- Are readable and writable by anyone
- Can be **claimed** by any user to convert it into a private project

## Private Projects

Projects that are created by a user that is logged in or that have been claimed are considered private. These projects

- Are only accessible to members of the project
- Are private and require permission to access

## Project Canvas

The project canvas is where you can perform administrative actions, view services, manage environments, and spin up new services.

<NextImage src="https://res.cloudinary.com/railway/image/upload/v1644620884/docs/ProjectPage_new_pa52tp.png"
alt="Screenshot of Project Canvas"
layout="responsive"
width={1377} height={823} quality={100} />

## Project Settings

You can manage project specific settings under the Project Settings page accessible by the button on the top right in the project canvas.

### General Actions

Under the Settings > General page you can change the project's name and description as well as retrieve the `projectId`.

## Project Member Management

<NextImage src="https://res.cloudinary.com/railway/image/upload/v1644620958/docs/MemberView_New_p0s3be.png"
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

## Monorepo Support

Monorepos are a common and popular way to organize code that allows teams to maintain context for complex applications. Railway has limited support for Monorepos by offering the ability to Deploy from Subdirectory.

On project creation, below the branch selection menu, if a subdirectory is specified- Railway will clone into that project and deploy the directory.

<Image src="https://res.cloudinary.com/railway/image/upload/v1636424666/docs/deploy_subdirectory_xkrcq0.png"
alt="Screenshot of Deployment Modal Page"
layout="intrinsic"
width={809} height={563} quality={80} />
