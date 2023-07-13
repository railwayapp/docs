---
title: CLI API Reference
---

The following commands are available in the CLI

## Add

*Add a plugin to your project*

```txt
~ railway add --help
Add a new plugin to your project

Usage: railway add [OPTIONS]

Options:
  -p, --plugin <PLUGIN>  The name of the plugin to add [possible values: postgresql, mysql, redis, mongodb]
      --json             Output in JSON format
  -h, --help             Print help
  -V, --version          Print version
```

## Completion

*Generate a shell-completions for the following shells: `bash`, `elvish`, `fish`, and `powershell`*
```txt
~ railway completion --help
Generate completion script

Usage: railway completion [OPTIONS] <SHELL>

Arguments:
  <SHELL>  [possible values: bash, elvish, fish, powershell, zsh]

Options:
      --json     Output in JSON format
  -h, --help     Print help
  -V, --version  Print version
```

## Connect

*Connect to a plugin's shell (`psql` for Postgres, `mongosh` for MongoDB, etc.)*

```txt
~ railway connect --help
Connect to a plugin's shell (psql for Postgres, mongosh for MongoDB, etc.)

Usage: railway connect [OPTIONS] [PLUGIN_NAME]

Arguments:
  [PLUGIN_NAME]  The name of the plugin to connect to

Options:
  -e, --environment <ENVIRONMENT>  Environment to pull variables from (defaults to linked environment)
      --json                       Output in JSON format
  -h, --help                       Print help
  -V, --version                    Print version
```

This requires you to have the plugin's appropriate shell/client installed in your `$PATH`:

* Postgres: `psql` (https://www.postgresql.org/docs/current/app-psql.html)
* Redis: `redis-cli` (https://redis.io/docs/ui/cli/)
* MongoDB: `mongosh` (https://www.mongodb.com/docs/mongodb-shell/)
* MySQL: `mysql` (https://dev.mysql.com/doc/refman/8.0/en/mysql.html)

## Delete

*Interactively delete a plugin*

```txt
~ railway delete --help
Delete plugins from a project

Usage: railway delete [OPTIONS]

Options:
      --json     Output in JSON format
  -h, --help     Print help
  -V, --version  Print version
```
You will be prompted to select a plugin to delete, and if you have 2FA enabled, you will be prompted to enter your 2FA code.

## Domain
*Create a domain for a service*
```txt
~ railway domain --help
Generates a domain for a service if there is not a railway provided domain

Usage: railway domain [OPTIONS]

Options:
      --json     Output in JSON format
  -h, --help     Print help
  -V, --version  Print version
```

## Docs

*Open the Railway documentation site in the default browser*

```txt
~ railway docs --help
Open Railway Documentation in default browser

Usage: railway docs [OPTIONS]

Options:
      --json     Output in JSON format
  -h, --help     Print help
  -V, --version  Print version```
```

## Down

*Remove the most recent deployment*

```txt
~ railway down --help
Remove the most recent deployment

Usage: railway down [OPTIONS]

Options:
  -y, --yes      Skip confirmation dialog
      --json     Output in JSON format
  -h, --help     Print help
  -V, --version  Print version
```

## Environment

*Change which environment you are using*

```txt
~ railway environment --help
Change the active environment

Usage: railway environment [OPTIONS] [ENVIRONMENT]

Arguments:
  [ENVIRONMENT]  The environment to link to

Options:
      --json     Output in JSON format
  -h, --help     Print help
  -V, --version  Print version
```
View [environment docs](/develop/environments) for more information.

If you run `railway environment` without specifying a name, you will be prompted
with an environment selector that lists all your environments for the project.

## Help

*Help command reference*

```txt
~ railway help
Interact with Railway via CLI

Usage: railway [OPTIONS] <COMMAND>

Commands:
  add          Add a new plugin to your project
  completion   Generate completion script
  delete       Delete plugins from a project
  domain       Generates a domain for a service if there is not a railway provided domain
  docs         Open Railway Documentation in default browser
  environment  Change the active environment
  init         Create a new project
  link         Associate existing project with current directory, may specify projectId as an argument
  list         List all projects in your Railway account
  login        Login to your Railway account
  logout       Logout of your Railway account
  logs         View the most-recent deploy's logs
  open         Open your project dashboard
  run          Run a local command using variables from the active environment
  service      Link a service to the current project
  shell        Open a subshell with Railway variables available
  status       Show information about the current project
  unlink       Disassociate project from current directory
  up           Upload and deploy project from the current directory
  variables    Show variables for active environment
  whoami       Get the current logged in user
  help         Print this message or the help of the given subcommand(s)

Options:
      --json     Output in JSON format
  -h, --help     Print help
  -V, --version  Print version
```

## Init
*Create a new Project from the CLI*

```txt
~ railway init --help
Create a new project

Usage: railway init [OPTIONS]

Options:
  -n, --name <NAME>  Project name
      --json         Output in JSON format
  -h, --help         Print help
  -V, --version      Print version
```

## Link

*Connect to an existing Railway project*

```txt
~ railway link --help
Associate existing project with current directory, may specify projectId as an argument

Usage: railway link [OPTIONS] [PROJECT_ID]

Arguments:
  [PROJECT_ID]  Project ID to link to

Options:
      --environment <ENVIRONMENT>  Environment to link to
      --json                       Output in JSON format
  -h, --help                       Print help
  -V, --version                    Print version
```

Running `link` with no project ID will prompt you to select a team and project.

## List

*List all projects in your Railway account*

```txt
~ railway list --help
List all projects in your Railway account

Usage: railway list [OPTIONS]

Options:
      --json     Output in JSON format
  -h, --help     Print help
  -V, --version  Print version
```

## Login

*Login to your Railway account*

```txt
~ railway login --help
Login to your Railway account

Usage: railway login [OPTIONS]

Options:
  -b, --browserless  Browserless login
      --json         Output in JSON format
  -h, --help         Print help
  -V, --version      Print version
```

This will open the browser to `https://railway.app/cli-login`.

### Browserless

If you are in an environment where the terminal cannot open a web browser, (i.e.
SSH session or [Codespaces](https://github.com/features/codespaces)), you can
perform a _browserless_ login.

```txt
~ railway login --browserless
Browserless Login
Please visit:
  https://railway.app/cli-login?d=SGVsbG8sIGtpbmQgc3RyYW5nZXIhIFRoYW5rcyBmb3IgcmVhZGluZyB0aGUgZG9jdW1lbnRhdGlvbiEgSSBob3BlIHlvdSdyZSBoYXZpbmcgYSB3b25kZXJmdWwgZGF5IDopCg==
Your pairing code is: friendly-malicious-electric-soup

Logged in as Nebula (nebula@railway.app)
```

This will prompt you to go to a URL (you can copy and paste) and present you
with a 4 word code that you need to verify. If the codes match, click "Verify"
and you will be logged in.

## Logout

*Logout of your Railway account*

```txt
~ railway logout --help
Logout of your Railway account

Usage: railway logout [OPTIONS]

Options:
      --json     Output in JSON format
  -h, --help     Print help
  -V, --version  Print version
```

## Logs

*View logs for the most recent deployment*

```txt
~ railway logs --help
View the most-recent deploy's logs

Usage: railway logs [OPTIONS]

Options:
  -d, --deployment  Show deployment logs
  -b, --build       Show build logs
      --json        Output in JSON format
  -h, --help        Print help
  -V, --version     Print version
```

## Open

*Open your current Railway project in the browser*

```txt
~ railway open --help
Open your project dashboard

Usage: railway open [OPTIONS]

Options:
      --json     Output in JSON format
  -h, --help     Print help
  -V, --version  Print version
```

## Run

*Run a command using the Railway environment*

```txt
~ railway run --help
Run a local command using variables from the active environment

Usage: railway run [OPTIONS] [ARGS]...

Arguments:
  [ARGS]...  Args to pass to the command

Options:
  -s, --service <SERVICE>          Service to pull variables from (defaults to linked service)
  -e, --environment <ENVIRONMENT>  Environment to pull variables from (defaults to linked environment)
      --json                       Output in JSON format
  -h, --help                       Print help
  -V, --version                    Print version
```

This also injects all environment variables associated with the plugins you have
installed in your project.

## Service
*Link a service to the current project*

```txt
~ railway service --help
Link a service to the current project

Usage: railway service [OPTIONS] [SERVICE]

Arguments:
  [SERVICE]  The service to link

Options:
      --json     Output in JSON format
  -h, --help     Print help
  -V, --version  Print version
```

## Shell

*Create a subshell (based on `$SHELL`) with all the variables from your project/environment/service loaded and accessible*

```txt
~ railway shell --help
Open a subshell with Railway variables available

Usage: railway shell [OPTIONS]

Options:
  -s, --service <SERVICE>  Service to pull variables from (defaults to linked service)
      --json               Output in JSON format
  -h, --help               Print help
  -V, --version            Print version
```

## Status

*View the status of your Railway project and user*

```txt
~ railway status --help
Show information about the current project

Usage: railway status [OPTIONS]

Options:
      --json     Output in JSON format
  -h, --help     Print help
  -V, --version  Print version
```

## Unlink

*Disconnects the current directory from Railway*

```txt
~ Disassociate project from current directory

Usage: railway unlink [OPTIONS]

Options:
  -s, --service  Unlink a service
      --json     Output in JSON format
  -h, --help     Print help
  -V, --version  Print version
```
You will need to rerun `railway link` to use `railway` in this directory again.

## Up

*Deploy a directory to your Railway project*

```txt
~ railway up --help
Upload and deploy project from the current directory

Usage: railway up [OPTIONS] [PATH]

Arguments:
  [PATH]

Options:
  -d, --detach             Don't attach to the log stream
  -s, --service <SERVICE>  Service to deploy to (defaults to linked service)
      --json               Output in JSON format
  -h, --help               Print help
  -V, --version            Print version
```
If no path is provided, the top linked directory is deployed. The currently selected environment is used.

## Variables

*View a table of all the environment variables associated with your project and environment*

```txt
~ railway variables --help
Show variables for active environment

Usage: railway variables [OPTIONS]

Options:
  -s, --service <SERVICE>  Service to show variables for
  -k, --kv                 Show variables in KV format
      --json               Output in JSON format
  -h, --help               Print help
  -V, --version            Print version
```

## Whoami

*View what user is currently authenticated with Railway*

```txt
~ railway whoami --help
Get the current logged in user

Usage: railway whoami [OPTIONS]

Options:
      --json     Output in JSON format
  -h, --help     Print help
  -V, --version  Print version
```
