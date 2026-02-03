---
title: Managing Projects
description: A guide to managing projects on Railway.
---

A Railway project contains any services, environments, and deployments that an app needs. Projects can be found on <a href="https://railway.com/dashboard" target="_blank">your project dashboard</a>.

Click on a project card to go to the project canvas:

<Image src="https://res.cloudinary.com/railway/image/upload/v1644620884/docs/ProjectPage_new_pa52tp.png"
alt="Screenshot of Project Canvas"
layout="responsive"
width={1377} height={823} quality={100} />

Project settings can be managed through the `Settings` button at the top right of the project canvas.

## Managing Project Info

A project's name and description can be changed from the General tab within a project's settings.

The project id can also be retrieved here.

## Deleting a Project

A project can be deleted by selecting the `Delete Project` button in the Danger tab. Deleting a project will delete all services, environments, and deployments associated with the project.

Specific services within a project can also be deleted from this page.

## Inviting Members

Invite members to access a project through the Members tab in your Project Settings.

You can invite a member by sending an invitation to their email address, or by generating an invite link to send to them directly.

Click [here](/reference/project-members#scope-of-permissions) to view the scope definitions for permissions.

### Invite by Email

Invite a new member via email by specifying their email address and scope of permissions, then click `Invite`.

This will send an email to the address specified containing a link to join your project.

### Invite by Link

Each project generates a project invite link. To invite someone via a link:

1. Select the desired invited member scope
2. Copy link and send to the invitee

## Transferring Projects

Depending on your plan, you can transfer Projects to other users or Teams.

#### Hobby User to Hobby User

To transfer a project from one Hobby User to another Hobby User, you must first [add the user as a member](#inviting-members) in the project.

You can then transfer the project to the new member by selecting the three dots next to the user and choosing `Transfer Ownership`.

<Image src="https://res.cloudinary.com/railway/image/upload/v1631917785/docs/project-transfer_iz4myn.png"
alt="Screenshot of Project Transfer Menu"
layout="intrinsic"
width={411} height={253} quality={80} />

The transferee receives an email requesting to transfer the project.

#### Hobby User to Team || Team to Team

You can transfer a Project in your Hobby workspace to a Team (or between Teams) in which you are an Admin. Inside your project, visit the `Settings` page and click the `Transfer Project` button to view the project transfer modal.

<Image src="https://res.cloudinary.com/railway/image/upload/v1692378671/project-transfer_iukfwb.png" alt="Project Transfer" layout="responsive" height={968} width={1240} />

Note: If you do not see the Transfer Project section in your Project Settings, you may not be an Admin of the Team to which you wish to transfer the Project. See the [reference page for Teams](/reference/teams#inviting-members) for more information on team member permissions.

## Viewing Recent Activity

The activity feed shows all the changes that have been made to a project. This includes changes to services and volumes. You can click on a change to see everything that was committed.

<Image src="https://res.cloudinary.com/railway/image/upload/v1743121231/docs/recent-activity_g2hupm.png"
            alt="Commit activity feed"
            layout="responsive"
            width={1273} height={631} quality={100} />

## Updating Project Visibility

Projects are private by default and only accessible to members of the project. However, you can make your projects public to share in a read-only state by changing the visibility in project settings -

<Image
src="https://res.cloudinary.com/railway/image/upload/v1743121306/docs/project-visiblity_ksafj3.png"
alt="Screenshot of Project Visibility Setting"
layout="intrinsic"
width={1273} height={451} quality={80} />
