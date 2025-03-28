---
title: Deploying a Monorepo
description: Learn how to deploy monorepos on Railway.
---

Railway provides a few features to help improve support for deploying monorepos
of various types:
1. **[Isolated Monorepo](#deploying-an-isolated-monorepo)** → A repository that contains components that are completely isolated to the
directory they are contained in (eg. JS frontend and Python backend)
2. **[Shared Monorepo](#deploying-a-shared-monorepo)** → A repository that contains components that share code or configuration from the
root directory (eg. Yarn workspace or Lerna project)

For a full step by step walk through on deploying an isolated Monorepo see our <a href="/tutorials/deploying-a-monorepo" target="_blank">tutorial</a> on the subject.

## Deploying an Isolated Monorepo

The simplest form of a monorepo is a repository that contains two completely
isolated projects that do not share any code or configuration.

```
├── frontend/
│   ├── index.js
│   └── ...
└── backend/
    ├── server.py
    └── ...
```

To deploy this type of monorepo on Railway, define a root directory for the service. 
1. Select the service within the project canvas to open up the service view. 
2. Click on the Settings tab.
3. Set the root directory option. Setting this means that Railway will only pull down files from that directory when creating new deployments.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1637798659/docs/root-directory_achzga.png"
alt="Screenshot of root directory configuration"
layout="intrinsic"
width={980} height={380} quality={80} />

**Note:** The **Railway Config File** does not follow the **Root Directory** path. You have to specify the absolute path for the `railway.json` or `railway.toml` file.

## Deploying a Shared Monorepo

Popular in the JavaScript ecosystem, shared monorepos contain multiple components that all share a common root directory. 

By default, all components are built with a single command from the root directory (e.g. `npm run build`). However, if you are using Nixpacks, then you can override the build command in the service settings.

```
├── package.json
└── packages
    ├── backend
    │   └── index.js
    ├── common
    │   └── index.js
    └── frontend
        └── index.jsx
```

To deploy this type of monorepo in Railway, define a separate custom start
command in Service Settings for each project that references the monorepo
codebase.
1. Select the service within the project canvas to open the service view.
2. Click on the Settings tab.
3. Set the start command, e.g. `npm run start:backend` and `npm run start:frontend`

<Image
src="https://res.cloudinary.com/railway/image/upload/v1637798815/docs/custom-start-command_a8vcxs.png"
alt="Screenshot of custom start command configuration"
layout="intrinsic"
width={1302} height={408} quality={80} />

## Watch paths

To prevent code changes in one service from triggering a rebuild of other services in your monorepo, you should configure watch paths.

Watch paths are <a href="https://git-scm.com/docs/gitignore#_pattern_format" target="_blank">gitignore-style</a> patterns that can be used to trigger a new deployment based on what file paths have changed. 

<Image
src="https://res.cloudinary.com/railway/image/upload/v1743192841/docs/watch-paths_zv62py.png"
alt="Screenshot of Railway Watch Paths"
layout="responsive"
width={1200} height={456} quality={80} />

A monorepo might want to only trigger builds if files are changed in the `/packages/backend` directory, for example.

## Using the CLI

When interacting with your services deployed from a monorepo using the CLI, always ensure you are "linked" to the appropriate service when executing commands.

To link to a specific service from the CLI, use `railway link` and follow the prompts.
