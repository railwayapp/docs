---
title: CLI
---

Use the Railway CLI to connect your code to your projects infrastructure without
needing to worry about environment variables or configuration.

## Install

Install with [Brew](https://brew.sh), [NPM](https://www.npmjs.com/package/@railway/cli) or [Scoop](https://scoop.sh).

### Homebrew

```bash
brew install railwayapp/railway/railway
```
### NPM

```bash
npm i -g @railway/cli
```
### Shell Script

```bash
sh -c "$(curl -sSL https://raw.githubusercontent.com/railwayapp/cli/master/install.sh)"
```

### Scoop

Use this method if you prefer to interact with Railway using a native Windows binary.

```ps1
scoop bucket add cone https://github.com/railwayapp/scoop-railway; scoop install scoop-railway/railway
```

For additional documentation on Scoop, see [here](https://scoop-docs.vercel.app/).

### Source

You can also download the [prebuilt binary directly](https://github.com/railwayapp/cli/releases/latest) or [build from source](https://github.com/railwayapp/cli#from-source).

## Login

Login to your Railway account. Opens a browser tab which authenticates into an existing Railway session. 

```bash
railway login
```

If there are any issues with browser-based login you can use the `--browserless` flag to authenticate, or try it with a different browser. [Brave](https://brave.com) is known to have issues with browser-based login.

### Project Token

You can use Project tokens to authenticate in environments that prevent you to authenticate with browsers such as CI environments.

Project tokens allow the CLI to access all the environment variables associated
with a specific project and environment. Use the token by setting the
`RAILWAY_TOKEN` environment variable and then running `railway run`.

```bash
RAILWAY_TOKEN=XXXX railway run
```

## Link to a Project

Link to an existing Project under your Railway account or team.

<NextImage src="https://res.cloudinary.com/railway/image/upload/v1631917786/docs/railway-link_juslvt.png"
alt="Screenshot of Railway"
layout="intrinsic"
width={389} height={116} quality={80} />

```bash
railway link <projectId>
```

## Create a Project

Create a new project directly from the command line. 

```bash
railway init
```

## Run

Run code inside your Railway environment. We connect your code to your
infrastructure hosted on Railway by injecting environment variables.

```bash
railway run <cmd>
```

For example, to run your node project with Railway:

```bash
railway run npm start
```

If you have a Dockerfile in your project directory, you can just run
`railway run` with no arguments to build and run the Dockerfile.

## Environments

Projects might have multiple environments, by default the CLI points to the `production` environment. If you'd like to use a different set of environment variables and a different deployment environment you can change the setting by:

```bash
railway environment
```


## Deploy

Deploy current directory to Railway. Displays deployment logs from the project deploys.

```bash
railway up
```

## Add Plugin

Provision a plugin for a project.

```bash
railway add
```

## Connect to Plugin

Open an interactive shell to a database directly in the CLI.

```bash
railway connect
```

## Logout 

```bash
railway logout
```
