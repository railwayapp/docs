---
title: Staged Changes
description: Review changes before applying them to your template, and roll back applied changes from the activity panel.
---

The template editor stages your edits as a change set that you review and apply, instead of saving every edit immediately. The activity panel keeps a history of applied change sets, and you can undo or revert any of them.

## How staging works

Edits you make in the template editor are staged into a single change set rather than applied right away. This includes changes to services, volumes, variables, storage buckets, and template details such as the name, description, and readme.

A banner appears at the top of the editor canvas showing how many changes are staged. Staged changes are shared: teammates editing the same template see and stage into the same change set.

Canvas layout is not part of the change set. Moving services around the canvas saves immediately and doesn't stage anything.

## Review staged changes

Click **Details** on the staged-changes banner to open the review modal. Changes are grouped by service, storage bucket, and template details, with the old and new value shown for each change.

From the banner or the review modal, you can:

- Click **Apply** to apply the change set to the template. You can also press `Shift + Enter` anywhere in the editor.
- Click **Discard Changes** to throw away all staged changes and return the editor to the template's live content.

Applying updates the template immediately. New deploys of the template use the updated configuration.

## Chat with the agent

The template editor includes the [Railway Agent](/ai/railway-agent) in a sidebar. Click **Agent** in the top-right corner of the editor to open it.

The agent edits your template by staging changes into the same change set as your manual edits, so nothing it does applies without your review. Ask it to:

- Add or configure services, databases, functions, and storage buckets
- Set up variables, generate secrets, and use reference variables and private networking between services
- Write or improve the template's description and overview
- Check the template against the publishing requirements and [best practices](/templates/best-practices)

While changes are staged, the chat shows a review card summarizing them. You can apply from the card, the staged-changes banner, or the review modal.

## Activity panel

The activity panel lists every change set applied to the template, newest first, with who applied it and when. The most recent entry is marked **Current**, which is what the template looks like now.

To open it, click the **Activity** icon in the top-right corner of the template editor. Click any entry to see exactly what it changed.

## Roll back a change

Open an entry in the activity panel to roll the template back. There are two ways to do it:

- **Undo** appears on the current entry. It reverses that change set and applies the reversal in one click.
- **Revert to this version** appears on older entries. It stages a change set that returns the template to how it looked right after that entry was applied. Review the staged revert and apply it to complete the rollback.
