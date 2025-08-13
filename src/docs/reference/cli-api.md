---
title: CLI Reference
description: Learn about the Railway CLI commands.
---

The Railway Command Line Interface (CLI) lets you interact with your
Railway project from the command line.

This document describes the commands available in the CLI.

For information on how to install the CLI and more examples of usage, see the [CLI guide](/guides/cli).

## Add

_Add a service to your project_

```txt
~ railway add --help
Add a service to your project

Usage: railway add [OPTIONS]

Options:
  -d, --database <DATABASE>
          The name of the database to add

          [possible values: postgres, mysql, redis, mongo]

  -s, --service [<SERVICE>]
          The name of the service to create (leave blank for randomly generated)

  -r, --repo <REPO>
          The repo to link to the service

  -i, --image <IMAGE>
          The docker image to link to the service

  -v, --variables <VARIABLES>
          The "{key}={value}" environment variable pair to set the service variables. Example:

          railway add --service --variables "MY_SPECIAL_ENV_VAR=1" --variables "BACKEND_PORT=3000"

      --json
          Output in JSON format

  -h, --help
          Print help (see a summary with '-h')

  -V, --version
          Print version
```

## Completion

_Generate a shell-completions for the following shells: `bash`, `elvish`, `fish`, and `powershell`_

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

_Connect to a database's shell (`psql` for Postgres, `mongosh` for MongoDB, etc.)_

```txt
~ railway connect --help
Connect to a database's shell (psql for Postgres, mongosh for MongoDB, etc.)

Usage: railway connect [OPTIONS] [SERVICE_NAME]

Arguments:
  [SERVICE_NAME]  The name of the database to connect to

Options:
  -e, --environment <ENVIRONMENT>  Environment to pull variables from (defaults to linked environment)
      --json                       Output in JSON format
  -h, --help                       Print help
  -V, --version                    Print version
```

This requires you to have the database's appropriate shell/client installed in your `$PATH`:

- Postgres: `psql` (https://www.postgresql.org/docs/current/app-psql.html)
- Redis: `redis-cli` (https://redis.io/docs/ui/cli/)
- MongoDB: `mongosh` (https://www.mongodb.com/docs/mongodb-shell/)
- MySQL: `mysql` (https://dev.mysql.com/doc/refman/8.0/en/mysql.html)

## Deploy

_Deploy a template into your project_

```txt
railway deploy --help
Provisions a template into your project

Usage: railway deploy [OPTIONS]

Options:
  -t, --template <TEMPLATE>  The code of the template to deploy
  -v, --variable <VARIABLE>  The "{key}={value}" environment variable pair to set the template variables
          To specify the variable for a single service prefix it with "{service}." Example:
          bash railway deploy -t postgres -v "MY_SPECIAL_ENV_VAR=1" -v "Backend.Port=3000"

      --json                 Output in JSON format
  -h, --help                 Print help (see a summary with '-h')
  -V, --version              Print version

```

## Domain

_Create a domain for a service_

```txt
~ railway domain --help
Add a custom domain or generate a railway provided domain for a service

Usage: railway domain [OPTIONS] [DOMAIN]

Arguments:
  [DOMAIN]  Optionally, specify a custom domain to use. If not specified, a domain will be generated

Options:
  -p, --port <PORT>        The port to connect to the domain
  -s, --service <SERVICE>  The name of the service to generate the domain for
      --json               Output in JSON format
  -h, --help               Print help (see more with '--help')
  -V, --version            Print version
```

## Docs

_Open the Railway documentation site in the default browser_

````txt
~ railway docs --help
Open Railway Documentation in default browser

Usage: railway docs [OPTIONS]

Options:
      --json     Output in JSON format
  -h, --help     Print help
  -V, --version  Print version```
````

## Down

_Remove the most recent deployment_

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

_Create, delete or link an environment_

```txt
~ railway [env]ironment --help
Create, delete or link an environment

Usage: railway environment [OPTIONS] [ENVIRONMENT] [COMMAND]

Commands:
  new     Create a new environment
  delete  Delete an environment [aliases: remove, rm]
  help    Print this message or the help of the given subcommand(s)

Arguments:
  [ENVIRONMENT]  The environment to link to

Options:
      --json     Output in JSON format
  -h, --help     Print help
  -V, --version  Print version
```

View [environment docs](/reference/environments) for more information.

If you run `railway environment` without specifying a name, you will be prompted
with an environment selector that lists all your environments for the project.

### railway environment new

_Create a new environment_

```txt
~ railway [env]ironment new --help
Create a new environment

Usage: railway environment new [OPTIONS] [NAME]

Arguments:
  [NAME]
          The name of the environment to create

Options:
  -d, --duplicate <DUPLICATE>
          The name of the environment to duplicate

          [aliases: copy]
          [short aliases: c]

  -v, --service-variable <SERVICE> <VARIABLE>
          Variables to assign in the new environment

          Note: This will only work if the environment is being duplicated, and that the service specified is present in the original environment

          Examples:

          railway environment new foo --duplicate bar --service-variable <service name/service uuid> BACKEND_PORT=3000

      --json
          Output in JSON format

  -h, --help
          Print help (see a summary with '-h')

  -V, --version
          Print version
```

### railway environment delete

_Delete an environment_

```txt
~ railway [env]ironment delete --help
Delete an environment

Usage: railway environment delete [OPTIONS] [ENVIRONMENT]

Arguments:
  [ENVIRONMENT]  The environment to delete

Options:
  -y, --yes      Skip confirmation dialog
      --json     Output in JSON format
  -h, --help     Print help
  -V, --version  Print version
```

**Note**: `railway environment delete` will not work if an account has 2FA and the terminal is not being run interactively.

## Init

_Create a new Project from the CLI_

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

_Connect to an existing Railway project_

```txt
~ railway link --help
Associate existing project with current directory, may specify projectId as an argument

Usage: railway link [OPTIONS]

Options:
  -e, --environment <ENVIRONMENT>  Environment to link to
  -p, --project <PROJECT>          Project to link to
  -s, --service <SERVICE>          The service to link to
  -t, --team <TEAM>                The team to link to. Use "personal" for your personal account
      --json                       Output in JSON format
  -h, --help                       Print help
  -V, --version                    Print version
```

Running `link` with no project ID will prompt you to select a team and project.

## List

_List all projects in your Railway account_

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

_Login to your Railway account_

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

This will open the browser to `https://railway.com/cli-login`.

### Browserless

If you are in an environment where the terminal cannot open a web browser, (i.e.
SSH session or [Codespaces](https://github.com/features/codespaces)), you can
perform a _browserless_ login.

```txt
~ railway login --browserless
Browserless Login
Please visit:
  https://railway.com/cli-login?d=SGVsbG8sIGtpbmQgc3RyYW5nZXIhIFRoYW5rcyBmb3IgcmVhZGluZyB0aGUgZG9jdW1lbnRhdGlvbiEgSSBob3BlIHlvdSdyZSBoYXZpbmcgYSB3b25kZXJmdWwgZGF5IDopCg==
Your pairing code is: friendly-malicious-electric-soup

Logged in as Nebula (nebula@railway.com)
```

This will prompt you to go to a URL (you can copy and paste) and present you
with a 4 word code that you need to verify. If the codes match, click "Verify"
and you will be logged in.

## Logout

_Logout of your Railway account_

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

_View logs for the most recent deployment_

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

_Open your current Railway project in the browser_

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

_Run a command using the Railway environment_

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

This also injects all environment variables associated with the databases you have
installed in your project.

## Service

_Link a service to the current project_

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

_Create a subshell (based on `$SHELL`) with all the variables from your project/environment/service loaded and accessible_

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

## SSH

_SSH into a project/service_

```txt
~ railway ssh --help
Connect to a service via SSH

Usage: railway ssh [OPTIONS] [COMMAND]...

Arguments:
  [COMMAND]...  Command to execute instead of starting an interactive shell

Options:
  -p, --project <PROJECT>
          Project to connect to (defaults to linked project)
  -s, --service <SERVICE>
          Service to connect to (defaults to linked service)
  -e, --environment <ENVIRONMENT>
          Environment to connect to (defaults to linked environment)
  -d, --deployment-instance <deployment-instance-id>
          Deployment instance ID to connect to (defaults to first active instance)
      --json
          Output in JSON format
  -h, --help
          Print help
  -V, --version
          Print version
```

## Status

_View the status of your Railway project and user_

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

_Disconnects the current directory from Railway_

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

_Deploy a directory to your Railway project_

```txt
~ railway up --help
Upload and deploy project from the current directory

Usage: railway up [OPTIONS] [PATH]

Arguments:
  [PATH]

Options:
  -d, --detach                     Don't attach to the log stream
  -c, --ci                         Only stream build logs and exit after it's done
  -s, --service <SERVICE>          Service to deploy to (defaults to linked service)
  -e, --environment <ENVIRONMENT>  Environment to deploy to (defaults to linked environment)
      --no-gitignore               Don't ignore paths from .gitignore
      --verbose                    Verbose output
      --json                       Output in JSON format
  -h, --help                       Print help
  -V, --version                    Print version
```

If no path is provided, the top linked directory is deployed. The currently selected environment is used.

## Variables

_View a table of all the environment variables associated with your project and environment_

```txt
~ railway variables --help
Show variables for active environment

Usage: railway variables [OPTIONS]

Options:
  -s, --service <SERVICE>          The service to show/set variables for
  -e, --environment <ENVIRONMENT>  The environment to show/set variables for
  -k, --kv                         Show variables in KV format
      --set <SET>                  The "{key}={value}" environment variable pair to set the service variables. Example:
                                      railway variables --set "MY_SPECIAL_ENV_VAR=1" --set "BACKEND_PORT=3000"
      --json                       Output in JSON format
  -h, --help                       Print help (see a summary with '-h')
  -V, --version                    Print version
```

## Whoami

_View what user is currently authenticated with Railway_

```txt
~ railway whoami --help
Get the current logged in user

Usage: railway whoami [OPTIONS]

Options:
      --json     Output in JSON format
  -h, --help     Print help
  -V, --version  Print version
```

## Volume

_Manage project volumes with options to list, add, delete, update, attach, and detach volumes_

```txt
~ railway volume --help
Manage project volumes

Usage: railway volume [OPTIONS] <COMMAND>

Commands:
  list    List volumes
  add     Add a new volume
  delete  Delete a volume
  update  Update a volume
  detach  Detach a volume from a service
  attach  Attach a volume to a service
  help    Print this message or the help of the given subcommand(s)

Options:
  -s, --service <SERVICE>          Service ID
  -e, --environment <ENVIRONMENT>  Environment ID
      --json                       Output in JSON format
  -h, --help                       Print help
  -V, --version                    Print version
```

## Redeploy

_Redeploy the currently deployed version of a service_

```txt
~ railway redeploy --help
Redeploy the latest deployment of a service

Usage: railway redeploy [OPTIONS]

Options:
  -s, --service <SERVICE>  The service ID/name to redeploy from
  -y, --yes                Skip confirmation dialog
      --json               Output in JSON format
  -h, --help               Print help
  -V, --version            Print version
```

## Help

_Help command reference_

```txt
~ railway help
Interact with Railway via CLI

Usage: railway [OPTIONS] <COMMAND>

Commands:
  add          Add a service to your project
  completion   Generate completion script
  connect      Connect to a database's shell (psql for Postgres, mongosh for MongoDB, etc.)
  deploy       Provisions a template into your project
  domain       Generates a domain for a service if there is not a railway provided domain
  docs         Open Railway Documentation in default browser
  down         Remove the most recent deployment
  environment  Change the active environment
  init         Create a new project
  link         Associate existing project with current directory, may specify projectId as an argument
  list         List all projects in your Railway account
  login        Login to your Railway account
  logout       Logout of your Railway account
  logs         View a deploy's logs
  open         Open your project dashboard
  run          Run a local command using variables from the active environment
  service      Link a service to the current project
  shell        Open a local subshell with Railway variables available
  status       Show information about the current project
  unlink       Disassociate project from current directory
  up           Upload and deploy project from the current directory
  variables    Show variables for active environment
  whoami       Get the current logged in user
  volume       Manage project volumes
  redeploy     Redeploy the latest deployment of a service
  help         Print this message or the help of the given subcommand(s)

Options:
      --json     Output in JSON format
  -h, --help     Print help
  -V, --version  Print version
```
