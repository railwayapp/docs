---
title: Variables
---

Service variables are provided whenever you build, deploy, or run `railway run`.

Together these variables form your Railway environment. Each
database service provides the necessary environment variables needed to use it (such as
`DATABASE_URL` for the PG plugin). You can also specify custom variables on the
project variables page.

<Image src="https://res.cloudinary.com/railway/image/upload/v1656640465/docs/variables-editor_rvhbim.png"
alt="Screenshot of Variables Pane"
layout="responsive"
width={1323} height={698} quality={100} />

You can view all variables for the current environment with `railway vars` and change the environment with `railway environment`.

## RAW Editor

<Image src="https://res.cloudinary.com/railway/image/upload/v1656640465/docs/raw-editor_r6mlmr.png"
alt="Screenshot of Raw Editor"
layout="responsive"
width={552} height={572} quality={100} />

Chances are you might already have a `.env` file laying around. You can import your existing environment variables via the RAW Editor.

You can click the `RAW Editor` link to open up a modal where you can paste in a list of variables separated by new line. This also allows you to bulk edit your variables in a familiar way like you would an `.env` file or even edit them via JSON notation.

## Automatic Detection of Environment Variables

If you initialize a new project from the CLI- and an .env file is detected, Railway will prompt to see if you'd like to import it into your new project.

## Multiline Variables

Railway supports multiline variables/object variables. Just type or paste in the value as you would normally.

## Railway Provided Variables

Railway provides the following additional system environment variables to all
builds and deployments.

| Name                              | Description                                                                                                                                                                                          |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `RAILWAY_STATIC_URL`              | The public domain, of the form `example.up.railway.app`                                                                                                                                              |
| `RAILWAY_GIT_COMMIT_SHA`          | The git [SHA](https://docs.github.com/en/github/getting-started-with-github/github-glossary#commit) of the commit that triggered the deployment. Example: `d0beb8f5c55b36df7d674d55965a23b8d54ad69b` |
| `RAILWAY_GIT_AUTHOR`              | The user of the commit that triggered the deployment. Example: `gschier`                                                                                                                             |
| `RAILWAY_GIT_BRANCH`              | The branch that triggered the deployment. Example: `main`                                                                                                                                            |
| `RAILWAY_GIT_REPO_NAME`           | The name of the repository that triggered the deployment. Example: `myproject`                                                                                                                       |
| `RAILWAY_GIT_REPO_OWNER`          | The name of the repository owner that triggered the deployment. Example: `mycompany`                                                                                                                 |
| `RAILWAY_GIT_COMMIT_MESSAGE`      | The message of the commit that triggered the deployment. Example: `Fixed a few bugs`                                                                                                                 |
| `RAILWAY_HEALTHCHECK_TIMEOUT_SEC` | The timeout length (in seconds) of healthchecks. Example: `300`                                                                                                                                      |
| `RAILWAY_ENVIRONMENT`             | The railway environment for the deployment. Example: `production`                                                                                                                                    |

## Templated Variables

Variables can reference other variables using the `${{ MY_VAR }}` templating
syntax. This can help reduce duplication if you need the same value in more than
one variable, or need to present a plugin-provided variable differently.

### Construct "Meta" Variables

If you find yourself needing the same value in more than one place, you can
create a template to avoid duplication. The following example constructs a URL
from an AWS S3 configuration:

```
S3_HOST    = us-west-2.amazonaws.com
S3_BUCKET  = mybucket
STATIC_URL = https://${{ S3_HOST }}/${{ S3_BUCKET }}/static/
```

### "Rename" Plugin Variables

Railway plugins provide a fixed set of variables. If your application requires a
variable to be under different name, create a new custom variable that uses a
template to reference the original:

```
DATABASE_URL = ${{ MYSQL_URL }}
```

## Import Variables from Heroku

You can import variables from an existing Heroku app using the command palette
on the service variables page. After connecting your Heroku account you can
select any of your Heroku apps and the config variables will be added to the current service and environment.

<Image src="/images/connect-heroku-account.png"
alt="Screenshot of connect Heroku account modal"
layout="responsive"
width={521} height={404} quality={100} />
