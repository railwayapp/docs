---
title: Monorepo Support
---

A "monorepo" is roughly defined as a single repository that contains multiple
runnable components. For example, a web app may have both a frontend and backend
component, which could be completely isolated from one another or share a subset
of common code between them.

## How it works

Railway enables you to define a Root directory and/or custom start command when configuring your services.

These controls are required to instruct Railway where the files are for the packages within your monorepo, and how to start them.

## Types of Monorepos

1. **[Isolated Monorepo](#isolated-monorepo)** → A repository that contains components that are completely isolated to the
directory they are contained in (eg. JS frontend and Python backend)

        ```
        ├── frontend/
        │   ├── index.js
        │   └── ...
        └── backend/
            ├── server.py
            └── ...
        ```

2. **[Shared Monorepo](#shared-monorepo)** → A repository that contains components that share code or configuration from the
root directory (eg. Yarn workspace or Lerna project)

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

## Support

For information on how to deploy a monorepo in Railway, visit [this guide](/guides/monorepo).