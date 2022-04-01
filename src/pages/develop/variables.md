---
title: Variables
---

Service variables are provided whenever you build, deploy, or run `railway run`.

Together these variables form your Railway environment. Each
database service provides the necessary environment variables needed to use it (such as
`DATABASE_URL` for the PG plugin). You can also specify custom variables on the
project variables page.

<Image src="https://res.cloudinary.com/railway/image/upload/v1644622035/docs/VariablesView_avvpds.png"
alt="Screenshot of Project Canvas"
layout="responsive"
width={1377} height={823} quality={100} />

You can view all variables for the current environment with `railway vars` and change the environment with `railway environment`.

## Bulk Import

Chances are you might already have a `.env` file laying around. You can import your existing environment variables via Bulk Import.

You can click the `Bulk Import` link to open up a modal where you can paste in a list of variables separated by new line.

### Automatic Detection of Environment Variables

If you initialize the a new project from the CLI- if a .env file is detected, Railway will now prompt to see if you'd like to import it into your new project.

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

**Note:** The above `RAILWAY_*` variables aren't yet supported in templates

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
