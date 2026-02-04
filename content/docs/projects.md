---
title: Projects
description: Projects are containers for environments and services in Railway.
---

Projects are containers for environments and services in Railway.

If you are logged in, projects can be found on <a href="https://railway.com/dashboard" target="_blank">your project dashboard</a>.

## Project canvas

<Image src="https://res.cloudinary.com/railway/image/upload/v1644620884/docs/ProjectPage_new_pa52tp.png"
alt="Screenshot of Project Canvas"
layout="responsive"
width={1377} height={823} quality={100} />

The project canvas is the default view for a project. Within it, a user can manage services and environments or select a service to view its configuration.

Project settings can be managed through the `Settings` button at the top right of the project canvas.

## Project resources

- 100 GB outbound network bandwidth
- Ability to deploy multiple [services](/services)
- Unlimited inbound network bandwidth
- Unlimited database services

## Managing project info

A project's name and description can be changed from the General tab within a project's settings.

The project id can also be retrieved here.

## Inviting members

Invite members to access a project through the Members tab in your Project Settings.

You can invite a member by sending an invitation to their email address, or by generating an invite link to send to them directly.

Click [here](/projects/project-members#scope-of-permissions) to view the scope definitions for permissions.

### Invite by email

Invite a new member via email by specifying their email address and scope of permissions, then click `Invite`.

This will send an email to the address specified containing a link to join your project.

### Invite by link

Each project generates a project invite link. To invite someone via a link:

1. Select the desired invited member scope
2. Copy link and send to the invitee

## Transferring projects

Projects can be transferred to other users or to Teams, depending on subscription plan.

- Project transfers to other users are only allowed for users subscribed to the [Hobby Plan](/pricing/plans) (both the initiator and recipient of the transfer).

- Project transfers to [Workspaces](/projects/workspaces) are only allowed for users who are Admin members of an existing Workspace. Workspaces are a feature of the [Pro Plan](/pricing/plans).

### Hobby user to hobby user

To transfer a project to another user, you must first [add the user as a member](#inviting-members) of the project.

You can then transfer the project to the new member by selecting the three dots next to the user and choosing `Transfer Ownership`.

<Image src="https://res.cloudinary.com/railway/image/upload/v1631917785/docs/project-transfer_iz4myn.png"
alt="Screenshot of Project Transfer Menu"
layout="intrinsic"
width={411} height={253} quality={80} />

The recipient receives an email to confirm the transfer. They have 24 hours to accept.

### Hobby user to team or team to team

You can transfer a project to another workspace that you're a member of. Inside your project, visit the `Settings` page and click the `Transfer Project` button to view the project transfer modal.

<Image src="https://res.cloudinary.com/railway/image/upload/v1692378671/project-transfer_iukfwb.png" alt="Project Transfer" layout="responsive" height={968} width={1240} />

Note: If you do not see the Transfer Project section in your Project Settings, you may not be an Admin of the Workspace to which you wish to transfer the Project. See the [reference page for Workspaces](/projects/workspaces#inviting-members) for more information on workspace member permissions.

## Viewing recent activity

The activity feed shows all the changes that have been made to a project. This includes changes to services and volumes. You can click on a change to see everything that was committed.

<Image src="https://res.cloudinary.com/railway/image/upload/v1743121231/docs/recent-activity_g2hupm.png"
            alt="Commit activity feed"
            layout="responsive"
            width={1273} height={631} quality={100} />

## Project visibility

Projects are private by default and only accessible to members of the project.

Projects can be made public, to be shared in a read-only state with anyone on the internet.

Public visibility is helpful for educators who want to show students how their projects look before a user deploys their own.

- Viewers don't need a Railway account to see the project
- Environment variables are private from viewers
- Services and Deployment logs are public

To update your project's visibility, change the setting in your project settings:

<Image
src="https://res.cloudinary.com/railway/image/upload/v1743121306/docs/project-visiblity_ksafj3.png"
alt="Screenshot of Project Visibility Setting"
layout="intrinsic"
width={1273} height={451} quality={80} />

## Deleting a project

A project can be deleted by selecting the `Delete Project` button in the Danger tab. Deleting a project will delete all services, environments, and deployments associated with the project.

Specific services within a project can also be deleted from this page.
