---
title: Staged Changes
description: Discover how to use staged changes in Railway to deploy updates gradually.
---

Changes made in your Railway project, like adding, removing, or making changes to components, will be staged in a changeset for you to review and apply.

It is important to be familiar with this flow as you explore the upcoming guides.

### What to Expect

As you create or update components within your project:

1. The number of staged changes will be displayed in a banner on the canvas
2. Staged changes will appear as purple in the UI

<Image src="https://res.cloudinary.com/railway/image/upload/v1743124823/docs/what-to-expect_geldie.png"
            alt="Staged changes on Railway canvas"
            layout="responsive"
            width={1400} height={720} quality={100} />

### Review and Deploy Changes

To review the staged changes, click the "Details" button in the banner.  Here, you will see a diff of old and new values.  You can discard a change by clicking the "x" to the right of the change.

You can optionally add a commit message that will appear in the [activity feed](/guides/projects#viewing-recent-activity).
 
<Image src="https://res.cloudinary.com/railway/image/upload/v1743123181/docs/changes_qn15ls.png"
            alt="Staged changes on Railway canvas"
            layout="responsive"
            width={1200} height={792} quality={100} />

Clicking "Deploy" will deploy all of the changes at once. Any services that are affected will be redeployed.

Holding the "Alt" key while clicking the "Deploy" button allows you to commit the changes without triggering a redeploy.

### Caveats

- Networking changes are not yet staged and are applied immediately
- Adding databases or templates will only affect the current environment. However, they do not yet create a commit in the history
