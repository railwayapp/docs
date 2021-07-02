---
title: CLI API Reference
---

The following commands are available in the CLI

## Add

Add a plugin to your project

```bash
railway add
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

## Docs

Open the Railway documentation (this website) in the default browser

```bash
railway docs
```

## Environment

Change which environment you are using. View [environment docs](/environments)
for more information.

```bash
railway environment [name]
```

If you run `railway environment` without specifying a name, you will be prompted
with an environment selector that lists all your environments for the project.

## Help

Help about any command

```bash
railway help
```

## Init

Create a new Railway project.

```bash
railway init
```

Running `init` will prompt you to create a new project or a select from one of
our [Starter Templates](/starters).

## Link

Connect to an existing Railway project.

```bash
railway link [projectId]
```

Running `link` with no project ID will prompt you to select an existing project
from your Railway account.

## List

List all projects in your Railway account

```bash
railway list
```

## Login

Login to your Railway account.

```bash
railway login
```

This will open the browser to `https://railway.app/cli-login`.

### Browserless

If you are in an environment where the terminal cannot open a web browser, (i.e.
SSH session or [Codespaces](https://github.com/features/codespaces)), you can
perform a _browserless_ login.

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

## Logs

View logs for the most recent deployment

```bash
railway logs
```

## Open

Open your current Railway project in the browser.

```bash
railway open
```

## Run

Run a command using the Railway environment.

```bash
railway run [cmd]
```

This injects all environment variables associated with the plugins you have
installed in your project. If you run `railway run` without specifying a
command, it will try to run the Dockerfile in the current directory, if it can
find one.

## Status

View the status of your Railway project and user.

```bash
railway status
```

## Unlink

Disconnects the current directory from Railway. You will need to rerun
`railway init` to use railway in this directory again.

```bash
railway unlink
```

## Up

Deploy the current directory to your Railway project. The currently selected
environment is used.

```bash
railway up
```

## Variables

View all the environment variables associated with your project and environment.

```bash
railway variables
```

## Version

Get the current version of the Railway CLI

```bash
railway version
```

## Whoami

View what user is currently authenticated with Railway

```bash
railway whoami
```
