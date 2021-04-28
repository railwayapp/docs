---
title: Environment Variables
---

Railway provides the following additional system environment variables to all 
builds and deployments.

| Name                         | Description |
|------------------------------|-------------|
| `RAILWAY_STATIC_URL`         | The public domain, of the form `example.up.railway.app` |
| `RAILWAY_GIT_COMMIT_SHA`     | The git [SHA](https://docs.github.com/en/github/getting-started-with-github/github-glossary#commit) of the commit that triggered the deployment. Example: d0beb8f5c55b36df7d674d55965a23b8d54ad69b |
| `RAILWAY_GIT_AUTHOR`         | The user of the commit that triggered the deployment. Example `gschier` |
| `RAILWAY_GIT_BRANCH`         | The branch that triggered the deployment. Example `main` |
| `RAILWAY_GIT_REPO_NAME`      | The name of the repository that triggered the deployment. Example `myproject` |
| `RAILWAY_GIT_REPO_OWNER`     | The name of the repository that triggered the deployment. Example `mycompany` |
| `RAILWAY_GIT_COMMIT_MESSAGE` | The message of the commit that triggered the deployment. Example `Fixed a few bugs` |
