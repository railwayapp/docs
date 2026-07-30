---
title: Handle Build-Time vs Runtime Secrets in Docker Builds
description: When Docker builds on Railway can see your variables, how to pass build secrets with ARG, and why runtime secrets should never be baked into the image.
date: "2026-07-29"
tags:
  - docker
  - secrets
  - builds
  - environment-variables
topic: infrastructure
---

A build-time secret is a value your Dockerfile needs while the image is being built, such as a private registry token or an npm auth token. A runtime secret is a value your application reads after the container starts, such as a database URL or a Stripe key. Mixing the two up causes one of two failure modes: a build that fails because a variable is `undefined`, or a secret permanently baked into image layers where anyone with the image can read it.

Avoiding both starts with knowing how Railway exposes variables to Docker builds, how to consume them at each phase, and how to keep runtime secrets out of the final image.

## How Railway injects variables

Railway makes your [service variables](/variables) available in two places:

- **The build process.** Every variable you define, plus [Railway-provided variables](/variables#railway-provided-variables) like `RAILWAY_ENVIRONMENT`, is available while your service builds.
- **The running deployment.** The same variables are injected as plain environment variables into the container at start.

There is one difference between build systems:

- **Railpack builds** (Railway's default builder) expose variables to the build automatically.
- **Dockerfile builds** do not. Docker isolates the build from the host environment by design. To use a Railway variable during a Dockerfile build, you must opt in with an `ARG` instruction.

At runtime there is no difference. Your process reads `process.env.DATABASE_URL` (or the equivalent in your language) regardless of how the image was built.

## Use a variable at build time with ARG

Declare the variable with `ARG` in your Dockerfile. Railway matches the `ARG` name against your service variables and passes the value in:

```dockerfile
FROM node:22-slim AS build

WORKDIR /app

# Opt in to the Railway variable for this build stage
ARG NPM_TOKEN

COPY package.json package-lock.json ./
RUN echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > .npmrc \
    && npm ci \
    && rm .npmrc

COPY . .
RUN npm run build

FROM node:22-slim

WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY package.json ./

CMD ["node", "dist/server.js"]
```

Two rules:

1. **`ARG` is scoped to a build stage.** In a multi-stage build, declare the `ARG` inside the stage that uses it. An `ARG` declared before the first `FROM` is not visible inside any stage unless you redeclare it.
2. **`ARG` values do not persist into the running container.** Unlike `ENV`, an `ARG` disappears when the build finishes. That is exactly what you want for build-only secrets.

```dockerfile
FROM node:22-slim

# Correct: declared inside the stage that needs it
ARG RAILWAY_ENVIRONMENT
RUN echo "Building for ${RAILWAY_ENVIRONMENT}"
```

## Keep secrets out of the final image

Docker image layers are an archive of everything that happened during the build. That's why a secret written to a file in one `RUN` instruction and deleted in a later one still exists in the earlier layer. The same holds for `ARG` values used in `RUN` commands: they're recorded in image metadata too, where `docker history` can show them.

To limit exposure:

- **Use multi-stage builds.** Do secret-dependent work (dependency installation, private git clones) in an early stage, then `COPY --from` only the artifacts you need into the final stage. Layers from earlier stages are not shipped with the final image.
- **Create and remove the secret in a single `RUN`.** Writing and deleting `.npmrc` in one instruction, as in the example above, keeps the token out of any committed layer in that stage.
- **Never promote a secret with `ENV`.** `ENV NPM_TOKEN=${NPM_TOKEN}` stores the value in the image config permanently. Use `ENV` only for non-sensitive configuration.

## Runtime secrets need no Dockerfile changes

Runtime secrets should not appear in your Dockerfile at all. Instead, Railway injects every service variable into the container environment when it starts, and your application reads them directly:

```js
// server.js
const http = require("http");

const port = process.env.PORT || 3000;
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ status: "ok" }));
});

server.listen(port, () => {
  console.log(`Listening on ${port}`);
});
```

Nothing needs to be declared in the Dockerfile, and nothing is baked into the image. This also means you can change a runtime secret and redeploy without rebuilding the image, and the same image works across environments because each environment supplies its own variable values.

## Volumes are not available at build time

A common mistake is trying to read or write persistent data during the build. [Volumes](/volumes), though, are mounted to your service's container only when it starts, not during the build, so anything written to the mount path in a `RUN` instruction lands in the image layer instead of the volume, and won't persist.

Volumes are also not mounted during the pre-deploy command. If a step needs volume data, run it as part of the start command.

The same logic applies to secrets stored as files: you cannot stage a credentials file on a volume and expect the build to read it. Pass build credentials through `ARG` instead.

## Sealed variables work in both phases

If a secret should never be readable again after you set it, seal it. [Sealed variables](/variables#sealed-variables) are provided to builds and deployments like any other variable, but their values can never be viewed in the dashboard or retrieved through the API afterward. Sealing changes visibility, not availability: a sealed `NPM_TOKEN` still flows into a Dockerfile `ARG` at build time.

Note the constraints: sealed variables cannot be un-sealed, and they are not copied when duplicating an environment or service.

## Quick reference

| Need | Mechanism | Where it lives |
| --- | --- | --- |
| Private package install during build | `ARG` in the build stage | Discarded after build |
| Value your app reads while running | Service variable, read from process env | Injected at container start |
| Non-sensitive config baked into image | `ENV` | Stored in image config |
| Persistent files | Volume | Mounted at container start, never during build |

## Common failure modes

**Variable is empty during the build.** You did not declare a matching `ARG`, or you declared it in a different build stage. Add `ARG MY_VAR` to the stage that uses it.

**Secret visible in the image.** You used `ENV` for a secret, or wrote it to a file and deleted it in a separate `RUN` instruction. Move the secret handling into a single `RUN` inside an early stage of a multi-stage build.

**Changed a variable but the app still sees the old value.** If the value was consumed at build time, it is frozen in the image until the next build. Deploy again to rebuild. Runtime variables do not have this problem; they are injected fresh at every start.

**Build writes to a volume path but data is missing at runtime.** Expected behavior. Volumes are attached only to the running container. Generate the data in your start command instead.

## Next steps

- [Dockerfiles on Railway](/builds/dockerfiles) covers custom Dockerfile paths, cache mounts, and build-time variables.
- [Using Variables](/variables) explains service, shared, reference, and sealed variables.
- [Managing Secrets on Railway](/guides/managing-secrets-on-railway) walks through choosing the right variable scope for each secret.
- [Frontend Environment Variables](/guides/frontend-environment-variables) covers the build-time vs runtime split in Vite, Next.js, and other frontend frameworks.
