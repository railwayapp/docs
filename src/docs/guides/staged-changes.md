---
title: Staged Changes
---

Changes made in your Railway project, like adding, removing, or making changes to components, will be staged in a changeset for you to review and apply.

It is important to be familiar with this flow as you explore the upcoming guides.

### What to Expect

As you create or update components within your project -

1. The number of staged changes will be displayed in a banner on the canvas
2. Staged changes will appear as purple in the UI

<Image src="https://res.cloudinary.com/railway/image/upload/v1702077687/docs/staged-changes/wl1qxxj8mpbej70i042r.png"
            alt="Staged changes on Railway canvas"
            layout="responsive"
            width={1423} height={826} quality={100} />

### Review and Deploy Changes

To review the staged changes, click the "Details" button in the banner.  Here, you will see a diff of old and new values.  You can discard a change by clicking the "x" to the right of the change.

You can optionally add a commit message that will appear in the [activity feed](/guides/projects#viewing-recent-activity).
 
<Image src="https://res.cloudinary.com/railway/image/upload/v1706310620/docs/staged-changes/details-modal_qbmujh.png"
            alt="Staged changes on Railway canvas"
            layout="responsive"
            width={1108} height={841} quality={100} />

Clicking "Deploy" will deploy all of the changes at once. Any services that are affected will be redeployed.

Holding the "Alt" key while clicking the "Deploy" button allows you to commit the changes without triggering a redeploy.