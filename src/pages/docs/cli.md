---
title: CLI
---

Use the CLI to connect your code to your projects infrastructure without needing
to worry about environment variables or configuration.

## Installation

Install the Railway CLI as a [Homebrew](https://brew.sh/) tap

```shell:always
brew tap railwayapp/railway
brew install railway
```

from [NPM](https://www.npmjs.com/package/@railway/cli)

```shell:always
npm i -g @railway/cli
```

or with curl

```shell:always
sh -c "$(curl -sSL https://raw.githubusercontent.com/railwayapp/cli/master/install.sh)"
```

## Commands

The following commands are available

- [init](/docs/cli#init)
- [run](/docs/cli#run)
- [environment](/docs/cli#environment)
- [status](/docs/cli#status)
- [env](/docs/cli#env)
- [open](/docs/cli#open)
- [login](/docs/cli#login)
- [logout](/docs/cli#logout)
- [whoami](/docs/cli#whoami)

### Init

Connect to an existing project or create a new one

```shell:always
railway init [projectId]
```

Running init with no project ID will bring a menu that allows you to create a
new project, or select an existing project.

### Run

Run a command inside of the Railway environment.

```shell:always
railway run <cmd>
```

This injects all environment variables associated with the plugins you have
install in your project.

### Environment

Change which environment you are using. View [environment
docs](/docs/environments) for more information.

```shell:always
railway environment
```

### Status

View the status of your Railway project and user.

```shell:always
railway status
```

### Env

View all the environment variables associated with your project and environment.

```shell:always
railway env
```

### Open

Open your current Railway project in the browser.

```shell:always
railway open
```

### Login

Login to your Railway account.

```shell:always
railway login
```

This will open the browser to `https://railway.app/cli-login`.

### Logout

Logout of your Railway account.

```shell:always
railway logout
```

### Whoami

View what user is currently authenticated with Railway

```shell:always
railway whoami
```

### Up

Deploy the current directory to your Railway project. The currently selected
environment is used.

```shell:always
railway up
```
