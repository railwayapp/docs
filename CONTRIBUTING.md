# Contributing to Railway Docs

Thank you for improving Railway's documentation! Open a pull request or create an issue on the [GitHub issues page](https://github.com/railwayapp/docs/issues).

## Repo structure

```
content/
├── docs/           # Product documentation (features, configuration, reference)
└── guides/         # How-to guides (deployment, setup tutorials)

src/
├── components/     # React components
├── data/
│   └── sidebar.ts  # Sidebar navigation configuration
└── ...
```

## Content types and frontmatter

### Docs (`content/docs/`)

Reference documentation organized by topic in the sidebar.

```yaml
---
title: Page Title
description: A brief description of the page content.
---
```

New doc pages also need a navigation entry in `src/data/sidebar.ts`.

### Guides (`content/guides/`)

Step-by-step tutorials. Guides appear automatically — no sidebar entry needed.

```yaml
---
title: Guide Title
description: A brief description of what this guide covers.
---
```

Optional fields for guides:

```yaml
---
title: Guide Title
description: A brief description of what this guide covers.
date: "2024-01-15"
author:
  name: Author Name
  avatar: https://example.com/avatar.png
  link: https://github.com/username
tags:
  - deployment
  - nodejs
---
```

## Writing and style

For the full style guide, component reference, and content type templates, see [`skills/docs-writing/`](skills/docs-writing/SKILL.md).

## Adding new content

### New docs page

1. Create a `.md` file in the appropriate `content/docs/` subdirectory.
2. Add required frontmatter (`title` and `description`).
3. Add a navigation entry in `src/data/sidebar.ts`.
4. Test locally with `pnpm dev`.

### New guide

1. Create a `.md` file in `content/guides/`.
2. Add required frontmatter (`title` and `description`).
3. Guides appear automatically — no sidebar entry needed.

## Pull request process

1. Fork the repository and create a branch.
2. Make your changes and test locally with `pnpm dev`.
3. Submit a pull request describing what you changed and why.
4. Address reviewer feedback if requested.

Pull requests are reviewed regularly. Once approved, changes are merged and automatically deployed.

## Questions?

Open an issue or reach out on [Central Station](https://station.railway.com).
