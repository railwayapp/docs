---
title: Monorepo Support
---

**Support for monorepos is still early. Please follow our
[roadmap item](https://feedback.railway.app/feature-requests/p/monorepo-root-directory-support)
for more details.**

A "monorepo" is roughly defined as a single repository that contains multiple
runnable components. For example, a web app may have both frontend and backend
component, which could be completely isolated from one another or share a subset
of common code between them.

Railway provides a few features to help improve support for deploying monorepos
and plan to make this even better in the future.

**[Isolated Monorepo](#isolated-monorepo)**<br/>
A repository that contains components that are completely isolated to the
directory they are within (eg. JS frontend and Python backend)

**[Shared Monorepo](#shared-monorepo)**<br/>
A repository that contains components that all share code or configuration from
the root directory (eg. Yarn workspace or Lerna project)

## Isolated Monorepo

The simplest form of a monorepo is a repository that contains two completely
isolated projects, meaning they do not reference any code or configuration
outside their respective directories. They may even be written in completely
different programming languages.

```
├── frontend/
│   ├── index.js
│   └── ...
└── backend/
    ├── server.py
    └── ...
```

To deploy this type of monorepo on Railway, define a specific subdirectory for
the application when setting up a Deployment Trigger for each project that
references the monorepo codebase. Setting this means that Railway will only look
at the files in that directory when creating new deployments.

<NextImage
src="https://res.cloudinary.com/railway/image/upload/v1637798659/docs/root-directory_achzga.png"
alt="Screenshot of root directory configuration"
layout="intrinsic"
width={980} height={380} quality={80} />

## Shared Monorepo

Perhaps most popular in the JavaScript ecosystem, shared monorepos contain
multiple components that all share a common root directory. All components are
built with a single command from the root directory (
eg. `npm run build`) and only differ in the way they are run (
eg. `npm run start:backend` and `npm run start:frontend`).

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
command in Deployment Settings for each project that references the monorepo
codebase.

<NextImage
src="https://res.cloudinary.com/railway/image/upload/v1637798815/docs/custom-start-command_a8vcxs.png"
alt="Screenshot of custom start command configuration"
layout="intrinsic"
width={1302} height={408} quality={80} />
