---
title: Template Updates
description: Learn how template updates work for authors and consumers.
---

Railway supports automatic update notifications for templates, allowing template authors to push changes to users who have deployed their templates.

## For Template Authors

As a template author, you can push updates to all users who have deployed your template. When you merge changes to the root branch (typically `main` or `master`) of your template's GitHub repository, Railway will automatically detect these changes and notify users who have deployed your template that an update is available.

Users will receive a notification about the update and can choose to apply it to their deployment when they're ready.

<Banner variant="info">
**Best Practice**: Keep your template's changelog up to date and document breaking changes clearly so that consumers understand what's changing when they receive update notifications.
</Banner>

### Requirements

- Your template must be based on a GitHub repository
- Updates are triggered when changes are merged to the root branch (`main` or `master`)
- Docker image-based templates cannot be automatically updated through this mechanism

### Update Workflow

1. Make changes to your template's GitHub repository
2. Merge changes to the root branch
3. Railway detects the changes automatically
4. Users who deployed your template receive an update notification
5. Users can choose when to apply the update

## For Template Consumers

When you deploy any services from a template based on a GitHub repo, Railway will check to see if the template has been updated by its creator.

If an upstream update is available, you will receive a notification. You can then choose to apply the update to your deployment when you're ready.

### How Updates Work

- Railway monitors the template's source repository for changes
- When updates are detected, you'll see a notification in your project
- Updates are opt-in, you control when to apply them
- Review the template author's changelog before updating to understand what's changing

### Limitations

- This feature only works for services based on GitHub repositories
- At this time, there is no mechanism to check for updates to Docker images from which services may be sourced

<Banner variant="info">
If you're curious, you can read more about how we built updatable templates in this <Link href="https://blog.railway.com/p/updatable-starters" target="_blank">blog post</Link>.
</Banner>
