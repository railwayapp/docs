---
title: Environment Variables
---

Railway provides the following additional system environment variables to all
builds and deployments.

| Name                         | Description |
|------------------------------|-------------|
| `RAILWAY_STATIC_URL`         | The public domain, of the form `example.up.railway.app` |
| `RAILWAY_GIT_COMMIT_SHA`     | The git [SHA](https://docs.github.com/en/github/getting-started-with-github/github-glossary#commit) of the commit that triggered the deployment. Example: `d0beb8f5c55b36df7d674d55965a23b8d54ad69b` |
| `RAILWAY_GIT_AUTHOR`         | The user of the commit that triggered the deployment. Example `gschier` |
| `RAILWAY_GIT_BRANCH`         | The branch that triggered the deployment. Example `main` |
| `RAILWAY_GIT_REPO_NAME`      | The name of the repository that triggered the deployment. Example `myproject` |
| `RAILWAY_GIT_REPO_OWNER`     | The name of the repository that triggered the deployment. Example `mycompany` |
| `RAILWAY_GIT_COMMIT_MESSAGE` | The message of the commit that triggered the deployment. Example `Fixed a few bugs` |

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
