---
title: Host a Documentation Site with Astro Starlight
description: Build a documentation site with Astro Starlight and deploy it to Railway, with full-text search, a structured sidebar, and a custom domain.
date: "2026-07-29"
tags:
  - documentation
  - astro
  - static
  - deployment
topic: frameworks
---

[Starlight](https://starlight.astro.build) is a documentation theme built on [Astro](https://astro.build). It turns a folder of Markdown files into a complete documentation site: navigation sidebar, full-text search, dark mode, mobile layout, and internationalization are all built in. The output is static HTML, so hosting it requires nothing more than a static file server.

That simplicity still leaves the documentation-specific work: configuring the sidebar, getting search working, deploying the static output to Railway, and putting the site behind your own domain. This guide covers each one; for general Astro deployment patterns (SSR, Dockerfiles, one-click templates), see the [Astro guide](/guides/astro).

## Create a Starlight project

You need [Node.js](https://nodejs.org) installed. Scaffold a new project with the Starlight template:

```bash
npm create astro@latest my-docs -- --template starlight
```

Accept the defaults when prompted, then start the dev server:

```bash
cd my-docs
npm run dev
```

Open `http://localhost:4321` to see the site. Documentation pages live in `src/content/docs/` as Markdown or MDX files. Each file becomes a route: `src/content/docs/guides/install.md` is served at `/guides/install`.

Every page needs a `title` in its frontmatter:

```markdown
---
title: Installation
description: How to install the CLI.
---

Install the CLI with npm:

...
```

## Configure the sidebar

The sidebar is defined in `astro.config.mjs`. You can list pages explicitly, or point a group at a directory and let Starlight generate the entries from the files it finds.

```js
// astro.config.mjs
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

export default defineConfig({
  integrations: [
    starlight({
      title: "My Product Docs",
      sidebar: [
        {
          label: "Getting Started",
          items: [
            { label: "Installation", slug: "guides/install" },
            { label: "Quick Start", slug: "guides/quick-start" },
          ],
        },
        {
          label: "Reference",
          // Generate entries from every file in src/content/docs/reference/
          items: [{ autogenerate: { directory: "reference" } }],
        },
      ],
    }),
  ],
});
```

Explicit `items` give you full control over order and labels. `autogenerate` trades that control for less work as the docs grow: new files under the directory appear in the sidebar automatically, ordered by filename. Most docs sites split the difference: explicit entries for the getting-started path, autogeneration for reference sections.

## Search works without a server

Starlight ships with [Pagefind](https://pagefind.app), a static search library. When you run `astro build`, Pagefind indexes the rendered HTML and writes the index into the output directory. Search then runs entirely in the visitor's browser, with no search server to deploy and no per-query cost.

Two things to know:

- Search does not appear in `npm run dev`. The index only exists after a build. To test search locally, run `npm run build && npm run preview`.
- The index is rebuilt on every deploy, so search results match the published content with nothing to invalidate or resync.

## Deploy to Railway

Starlight produces static files, so the deployed service is just a file server in front of the `dist/` directory. Add the [serve](https://www.npmjs.com/package/serve) package to handle that:

```bash
npm install serve
```

Then add a start script to `package.json`:

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "start": "serve dist -l $PORT"
  }
}
```

Railway injects the `PORT` environment variable at runtime, and `serve` listens on it. `serve` resolves clean URLs to the `folder/index.html` files Starlight generates, so `/guides/install` works without any rewrite rules.

Push the project to GitHub, then:

1. Go to [railway.com/new](https://railway.com/new) and select **Deploy from GitHub repo**.
2. Choose your repository. Railway detects a Node.js project, runs `npm run build`, and starts the service with `npm start`.
3. In the service settings, under **Networking**, click **Generate Domain** to get a public `*.up.railway.app` URL.

Every push to the connected branch now rebuilds the site, including the search index, and deploys the new version.

## Add a custom domain

Documentation usually lives at a subdomain like `docs.example.com`:

1. Open your service, go to **Settings**, and find the **Networking** section.
2. Click **+ Custom Domain** and enter `docs.example.com`.
3. Railway shows two records: a CNAME record and a TXT record that verifies domain ownership. Add both at your DNS provider; the domain will not verify with only the CNAME in place.
4. Once both records are in place and verified, Railway provisions and renews the TLS certificate automatically.

See [working with domains](/networking/domains) for provider-specific DNS details, including the Cloudflare proxying caveats.

## Keep hosting costs near zero

Railway pricing is usage based, and a static file server uses very little. Two settings help for a low-traffic docs site:

- **Serverless**: enable it in the service settings and Railway puts the service to sleep after 10 minutes without outbound traffic, then wakes it on the next request. A static server makes no database connections or background calls, so it sleeps reliably. The first request after sleep pays a short cold-start delay. See [serverless](/deployments/serverless).
- **PR environments**: enable them in your project settings and every pull request gets its own preview deployment of the docs, torn down when the PR closes. Reviewers can read the rendered pages instead of raw Markdown diffs. See [environments](/environments).

## Next steps

- [Deploy an Astro app](/guides/astro) for SSR, CLI, and Dockerfile deployment options.
- [Deploy static sites](/guides/static-hosting) for multi-region replicas and CDN integration.
- [Working with domains](/networking/domains) for DNS setup details.
- [Serverless](/deployments/serverless) for how sleep and wake behavior works.
