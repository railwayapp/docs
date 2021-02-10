---
title: CLI API Reference
---

The following commands are available in the CLI

## Init

Connect to an existing project or create a new one

```bash
railway init [projectId]
```

Running init with no project ID will bring a menu that allows you to create a
new project, or select an existing project.

## Run

Run a command inside of the Railway environment.

```bash
railway run <cmd>
```

This injects all environment variables associated with the plugins you have
install in your project.

## Environment

Change which environment you are using. View [environment
docs](/environments) for more information.

```bash
railway environment
```

## Status

View the status of your Railway project and user.

```bash
railway status
```

## Env

View all the environment variables associated with your project and environment.

```bash
railway env
```

## Open

Open your current Railway project in the browser.

```bash
railway open
```

## Login

Login to your Railway account.

```bash
railway login
```

This will open the browser to `https://railway.app/cli-login`.

### Browserless

If you are in an environment where the terminal cannot open a web browser, (i.e.
SSH session or [Codespaces](https://github.com/features/codespaces)), you can perform a _browserless_ login.

```bash
railway login --browserless
```

This will prompt you to go to a URL (you can copy and paste) and present you
with a 4 word code that you need to verify. If the codes match, click "Verify"
and you will be logged in

## Logout

Logout of your Railway account.

```bash
railway logout
```

## Whoami

View what user is currently authenticated with Railway

```bash
railway whoami
```

## Up

Deploy the current directory to your Railway project. The currently selected
environment is used.

```bash
railway up
```
