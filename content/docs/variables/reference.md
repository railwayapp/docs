---
title: Variables Reference
description: Reference documentation for Railway variables, including template syntax and all available system variables.
---

## Template Syntax

Railway's templating syntax gives you flexibility in managing variables:

```plaintext
${{NAMESPACE.VAR}}
```

- `NAMESPACE` - The value for NAMESPACE is determined by the location of the variable being referenced. For a shared variable, the namespace is "shared". For a variable defined in another service, the namespace is the name of the service, e.g. "Postgres" or "backend-api".
- `VAR` - The value for VAR is the name, or key, of the variable being referenced.

You can also combine additional text or even other variables, to construct the values that you need:

```plaintext
DOMAIN=${{shared.DOMAIN}}
GRAPHQL_PATH=/v1/gql
GRAPHQL_ENDPOINT=https://${{DOMAIN}}/${{GRAPHQL_PATH}}
```

## Variable Functions

[Template variable functions](/templates/create#template-variable-functions) allow you to dynamically generate variables (or parts of a variable) on demand when the template is deployed.

## Railway-Provided Variables

Railway provides the following additional system environment variables to all
builds and deployments.

| Name                           | Description                                                                                                                                          |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `RAILWAY_PUBLIC_DOMAIN`        | The public service or customer domain, of the form `example.up.railway.app`                                                                          |
| `RAILWAY_PRIVATE_DOMAIN`       | The private DNS name of the service.                                                                                                                 |
| `RAILWAY_TCP_PROXY_DOMAIN`     | (see [TCP Proxy](/networking/tcp-proxy) for details) The public TCP proxy domain for the service, if applicable. Example: `roundhouse.proxy.rlwy.net` |
| `RAILWAY_TCP_PROXY_PORT`       | (see [TCP Proxy](/networking/tcp-proxy) for details) The external port for the TCP Proxy, if applicable. Example: `11105`                             |
| `RAILWAY_TCP_APPLICATION_PORT` | (see [TCP Proxy](/networking/tcp-proxy) for details) The internal port for the TCP Proxy, if applicable. Example: `25565`                             |
| `RAILWAY_PROJECT_NAME`         | The project name the service belongs to.                                                                                                             |
| `RAILWAY_PROJECT_ID`           | The project id the service belongs to.                                                                                                               |
| `RAILWAY_ENVIRONMENT_NAME`     | The environment name of the service instance.                                                                                                        |
| `RAILWAY_ENVIRONMENT_ID`       | The environment id of the service instance.                                                                                                          |
| `RAILWAY_SERVICE_NAME`         | The service name.                                                                                                                                    |
| `RAILWAY_SERVICE_ID`           | The service id.                                                                                                                                      |
| `RAILWAY_REPLICA_ID`           | The replica ID for the deployment.                                                                                                                   |
| `RAILWAY_REPLICA_REGION`       | The region where the replica is deployed. Example: `us-west2`                                                                                        |
| `RAILWAY_DEPLOYMENT_ID`        | The ID for the deployment.                                                                                                                           |
| `RAILWAY_SNAPSHOT_ID`          | The snapshot ID for the deployment.                                                                                                                  |
| `RAILWAY_VOLUME_NAME`          | The name of the attached volume, if any. Example: `foobar`                                                                                           |
| `RAILWAY_VOLUME_MOUNT_PATH`    | The mount path of the attached volume, if any. Example: `/data`                                                                                      |

### Git Variables

These variables are provided if the deploy originated from a GitHub trigger.

| Name                         | Description                                                                                                                                                                                          |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `RAILWAY_GIT_COMMIT_SHA`     | The git [SHA](https://docs.github.com/en/github/getting-started-with-github/github-glossary#commit) of the commit that triggered the deployment. Example: `d0beb8f5c55b36df7d674d55965a23b8d54ad69b` |
| `RAILWAY_GIT_AUTHOR`         | The user of the commit that triggered the deployment. Example: `gschier`                                                                                                                             |
| `RAILWAY_GIT_BRANCH`         | The branch that triggered the deployment. Example: `main`                                                                                                                                            |
| `RAILWAY_GIT_REPO_NAME`      | The name of the repository that triggered the deployment. Example: `myproject`                                                                                                                       |
| `RAILWAY_GIT_REPO_OWNER`     | The name of the repository owner that triggered the deployment. Example: `mycompany`                                                                                                                 |
| `RAILWAY_GIT_COMMIT_MESSAGE` | The message of the commit that triggered the deployment. Example: `Fixed a few bugs`                                                                                                                 |

### User-Provided Configuration Variables

Users can use the following environment variables to configure Railway's behavior.

| Name                                  | Description                                                                                                                                                                   |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `RAILWAY_DEPLOYMENT_OVERLAP_SECONDS`  | How long the old deploy will overlap with the newest one being deployed, its default value is `0`. Example: `20`                                                              |
| `RAILWAY_DOCKERFILE_PATH`             | The path to the Dockerfile to be used by the service, its default value is `Dockerfile`. Example: `Railway.dockerfile`                                                        |
| `RAILWAY_HEALTHCHECK_TIMEOUT_SEC`     | The timeout length (in seconds) of healthchecks. Example: `300`                                                                                                               |
| `RAILWAY_DEPLOYMENT_DRAINING_SECONDS` | The SIGTERM to SIGKILL buffer time (in seconds), its default value is 0. Example: `30`                                                                                        |
| `RAILWAY_RUN_UID`                     | The UID of the user which should run the main process inside the container. Set to `0` to explicitly run as root.                                                             |
| `RAILWAY_SHM_SIZE_BYTES`              | This variable accepts a value in binary bytes, with a default value of 67108864 bytes (64 MB)                                                                                 |
