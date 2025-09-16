---
title: Build Configuration
description: Learn how to configure Railpack, optimize build caching, and set up watchpaths.
---

Railway will build and deploy your code with zero configuration, but when necessary, there are several ways to configure this behavior to suit your needs.

## Railpack

Railway uses <a href="https://railpack.com" target="_blank">Railpack</a> to build your code. It works with zero configuration but can be customized using [environment variables](/guides/variables#service-variables) or a [Railpack config file](https://railpack.com/config/file). Configuration options include:

- Install/build/start commands
- Package installation requirements  
- Directories to cache

For a full list of configuration options, please view the <a href="https://railpack.com/config/environment-variables" target="_blank">Railpack docs</a>.

You can find a complete list of languages we support out of the box [here](/reference/railpack#supported-languages).

## Nixpacks

<DeprecationBanner />

Existing services will continue to work with Nixpacks. To migrate to Railpack, update your service settings or set `"builder": "RAILPACK"` in your railway.json file.

For services still using Nixpacks, it can be configured with [environment variables](/guides/variables#service-variables). For a full list of options, view the <a href="https://nixpacks.com/docs/guides/configuring-builds" target="_blank">Nixpacks docs</a>.

You can find a complete list of languages we support out of the box [here](/reference/nixpacks#supported-languages).

## Customize the Build Command

Railpack automatically detects and configures build commands based on your project structure. If you need to override the detected build command, you can customize it from within your service settings.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1743192207/docs/build-command_bwdprb.png"
alt="Screenshot of Railway Build Command"
layout="responsive"
width={1200} height={373} quality={80} />

## Set the Root Directory

The root directory defaults to `/` but can be changed for various use-cases like
[monorepo](/guides/monorepo) projects.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1743192841/docs/root-directory_nfzkfi.png"
alt="Screenshot of Root Directory"
layout="responsive"
width={1200} height={421} quality={80} />

When specified, all build and deploy
commands will operate within the defined root directory.

**Note:** The **Railway Config File** does not follow the **Root Directory** path. You have to specify the absolute path for the `railway.json` or `railway.toml` file.

## Configure Watch Paths

Watch paths are <a href="https://git-scm.com/docs/gitignore#_pattern_format" target="_blank">gitignore-style</a> patterns
that can be used to trigger a new deployment based on what file paths have
changed.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1743192841/docs/watch-paths_zv62py.png"
alt="Screenshot of Railway Watch Paths"
layout="responsive"
width={1200} height={456} quality={80} />

For example, a monorepo might want to only trigger builds if files are
changed in the `/packages/backend` directory.

When specified, any changes that
don't match the patterns will skip creating a new deployment. Multiple patterns
can be combined, one per line.

_Note, if a Root Directory is provided, patterns still operate from `/`. For a root directory of `/app`, `/app/**.js` would be used as a pattern to match files in the new root._

Here are a few examples of common use-cases:

```gitignore
# Match all TypeScript files under src/
/src/**/*.ts
```

```gitignore
# Match Go files in the root, but not in subdirectories
/*.go
```

```gitignore
# Ignore all Markdown files
**
!/*.md
```

_Note, negations will only work if you include files in a preceding rule._

## Install a Specific Package Using Nixpacks (Legacy)

For services still using Nixpacks, you can install specific packages by defining them in a nixpacks configuration file. For example:

```toml
[phases.setup]
    aptPkgs = ['wget']
```

See the [Nixpacks docs](https://nixpacks.com/docs/configuration/file) for more information. For new services using Railpack, package installation is handled automatically.

## Build Providers (Nixpacks Legacy)

For services using Nixpacks, you can specify which language providers to use for builds. This is useful if you have code that calls libraries from multiple languages within your repo.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1668662436/docs/multi-providers_lrxdbp.png"
alt="Screenshot of Railway Build Providers"
layout="responsive"
width={745} height={238} quality={80} />

Railpack automatically handles multi-language detection and doesn't require manual provider configuration.

## Procfiles (Nixpacks Legacy)

For services using Nixpacks, you can override the start command with a <a href="https://nixpacks.com/docs/configuration/procfile" target="_blank">Procfile</a> at the root of your app.

Railpack automatically detects start commands and doesn't require Procfiles for most applications.

## Specify a Custom Install Command (Nixpacks Legacy)

For services using Nixpacks, you can control custom install commands using [config as code](/reference/config-as-code#nixpacks-plan). Railpack handles installation automatically based on your project's dependency files.

## Disable Build Layer Caching

By default, Railway will cache build layers to provide faster build times. If you have a need to disable this behavior, set the following environment variable in your service:

```plaintext
NO_CACHE=1
```

## Why Isn't My Build Using Cache?

Since Railway's build system scales up and down in response to demand, cache hit on builds is not guaranteed.

If you have a need for faster builds and rely on build cache to satisfy that requirement, you should consider creating a pipeline to build your own image and deploy your image directly.
