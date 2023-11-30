---
title: Deploying a Monorepo
---

Railway provides a few features to help improve support for deploying monorepos
of various types:
1. **[Isolated Monorepo](#deploying-an-isolated-monorepo)** → A repository that contains components that are completely isolated to the
directory they are contained in (eg. JS frontend and Python backend)
2. **[Shared Monorepo](#deploying-a-shared-monorepo)** → A repository that contains components that share code or configuration from the
root directory (eg. Yarn workspace or Lerna project)

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

## Deploying a Shared Monorepo

Popular in the JavaScript ecosystem, shared monorepos contain multiple components that all share a common root directory. 

By default, all components are built with a single command from the root directory (eg. `npm run build`). However, if you are using Nixpacks, then you can override the build command in the service settings.

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
3. Set the start command, eg. `npm run start:backend` and `npm run start:frontend`

<Image
src="https://res.cloudinary.com/railway/image/upload/v1637798815/docs/custom-start-command_a8vcxs.png"
alt="Screenshot of custom start command configuration"
layout="intrinsic"
width={1302} height={408} quality={80} />