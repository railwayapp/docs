---
title: Projects
---

A Railway project contains all of your plugins, environments, and deployments. If you are logged in, all of your projects can be found on [your project dashboard](https://railway.app/dashboard).

All projects feature

- 80 GB outbound network bandwidth
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

## Project Dashboard 

The project dashboard is where you can perform administrative actions, view project metrics, set project variables, and view deployments.

<NextImage src="/images/project-dashboard.png"
alt="Screenshot of Project Dashboard"
layout="responsive"
width={841} height={548} quality={80} />

## Project Settings

You can manage project specific settings under the Settings page.
### General Actions

Under the Settings > General tab you can change the project's name and description as well as retrieve the `projectId`.

## Project Member Management

<NextImage src="/images/project-member-list.png"
alt="Screenshot of Project Team Members"
layout="responsive"
width={1345} height={933} quality={80} />

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

<NextImage src="/images/project-invite-member.png"
alt="Screenshot of Invite Links"
layout="responsive"
width={910} height={272} quality={80} />

### Transferring Projects

Users can transfer projects to other users. 

Under the members list in the members tab - click the 3 dots menu at the end of the user you'd like to transfer the project to.

<NextImage src="/images/project-transfer.png"
alt="Screenshot of Project Transfer Menu"
layout="intrinsic"
width={411} height={253} quality={80} />

The transferee receives an email with the current owner requesting to transfer the project to the user. Once that user accepts the transfer, they become the new owner of the project. 





