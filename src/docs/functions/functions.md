---
title: Functions
description: Write and deploy code from the Railway canvas without managing infrastructure or creating a git repository.
---

Write and deploy code from the Railway canvas without managing infrastructure or creating a git repository.
Functions are [Services](/reference/services) that run a single file of TypeScript code using the [Bun](https://bun.sh/) runtime.
Use them like any other Service, but without the overhead of a repository.

They are ideal for small tasks like handling webhooks, cron jobs, or simple APIs.

## Key features

- **Instant deploys**: Deploy code changes _in seconds_. No need to wait for a build step.
- **Import any NPM package**: Use any NPM package in your function. We will automatically install it for you when your code runs. Pin specific versions by using a `package@version` syntax in your imports, e.g. `import { Hono } from "hono@4"`
- **Use native Bun APIs**: Access [Bun APIs](https://bun.sh/docs/runtime/bun-apis) like `Bun.file()` and `Bun.serve()`.
- **Service variables**: Service [Variables](/reference/variables) are automatically available in the function editor via `import.meta.env`, `process.env`, or `Bun.env`
- **Attach volumes**: Persist data in your function using [Volumes](/reference/volumes).
- **Use Vim**: Enable Vim keybindings in the function editor by using the shortcut `Ctrl+Option+V` on a Mac or `Ctrl+Alt+V` on Windows.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1738958871/docs/railway-functions-2_vk0umf.png"
alt="Screenshot of pre-deploy command configuration"
layout="intrinsic"
width={589} height={366} quality={80} />

## Limitations

- 1 file per function
- Max file size of 96KB

## Edit and Deploy

If you're familiar with VSCode or other IDEs, you'll feel right at home with our built-in editor.

- **To edit** your function, open the "Source Code" tab in your service.
- **To stage** your changes, press ⌘+S (or Control+S if using Windows).
- **To deploy** staged changes, press Shift+Enter.

## Versioning

Railway automatically versions your function code. Each time you deploy, a new version is created and is available for rollback.
To rollback or redeploy a previous version, find the [Deployment](/reference/deployments) you want to rollback to in the "Deployments" tab
of your service. Then click the "Redeploy" button.

You can find the source code of a previous deployment by opening the deployment details.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1738960017/docs/railway-functions-versions_jqdhal.png"
alt="Screenshot of pre-deploy command configuration"
layout="intrinsic"
width={588} height={499} quality={80} />
