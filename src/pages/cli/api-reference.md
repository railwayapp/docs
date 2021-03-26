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

Run a command using the Railway environment.

```bash
railway run [cmd]
```

This injects all environment variables associated with the plugins you have
installed in your project. If you run `railway run` without specifying a command,
it will try to run the Dockerfile in the current directory, if it can find one.

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

## Disconnect

Disconnects the current directory from Railway. You will need to rerun
`railway init` to use railway in this directory again 

```bash
railway disconnect
```

## Connect

Lets you connect to your Railway plugins. 

```bash
railway connect [plugin]
```

If you don't specify a plugin, you will be prompted to select a plugin to
connect to.

Supported:
- `postgresql`/`postgres`/`psql`
- `mysql`
- `redis`
- `mongodb`/`mongo`
