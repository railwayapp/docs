---
title: Skipped Builds
description: Save build time by reusing previously built images when the source code has already been built.
---

<Banner variant="primary">
  Skipped builds is an experimental feature. If you run into any issues or have
  feedback, we'd love to hear from you on{" "}
  <a href="https://station.railway.com/feedback/skip-redundant-builds-with-image-caching-4b36e070" target="_blank">Central Station</a>.
</Banner>

Railway can detect when the exact same code has already been built and skip the build entirely, deploying the cached image immediately instead. After you merge a Pull Request, your changes can be live instantly, without waiting for another build.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1774453968/docs/skipped-builds_nzflw5.png"
alt="Screenshot of Rollback Menu"
layout="responsive"
width={1920} height={1150} quality={100} />

This is different from [build layer caching](/builds/build-configuration#disable-build-layer-caching), which speeds up builds by reusing intermediate layers. With skipped builds, no build happens at all: the previously built image is deployed directly.

## How it works

When a new deployment is triggered, Railway checks whether an image has already been built from the same source code. If a cached image exists, Railway skips the build and deploys the image directly with the new environment's variables.

A common scenario is when using [PR environments](/environments#pr-environments):

1. You open a pull request.
2. Railway automatically creates a PR environment for you and builds the code.
3. You make changes to your pull request, and Railway continuously rebuilds and deploys your code to the PR environment.
4. You merge the pull request. Your PR was up to date, no other commits have landed on the target branch in the meantime.
5. Railway detects that the merged commit has already been built and deploys the cached image to production: no rebuild required.

This makes deployments feel virtually instant. Bugfixes can be live in seconds, and you can move faster without waiting for redundant builds.

## Enabling skipped builds

Skipped builds are disabled by default and can be enabled per service. To enable them, go to your Service Settings and toggle **Skipped Builds** under Feature Flags.

## When builds are not skipped

Certain actions always trigger a full rebuild, even when skipped builds are enabled:

- [**Redeploying**](/deployments/deployment-actions#redeploy) from the Deployments tab always rebuilds.
- **Deploying the latest commit** from the Command Palette (`CMD + K` → "Deploy Latest Commit") always rebuilds.
- [**`railway up`**](/cli/up) always uploads and builds your code.

## Environment variables and caching

<Banner variant="info">
  A build is skipped when the same source code was already built before.
  Changes to environment variables are not factored in.
</Banner>

When a cached image is reused, the new environment's [variables](/variables) are applied at runtime. For most applications, this works seamlessly: variables read at startup or from `process.env` at request time will reflect the correct environment.

However, if your build process inlines environment variable values into the output bundle (for example, `NEXT_PUBLIC_*` variables in Next.js or `VITE_*` variables in Vite), the cached image will still contain the values from the original build. This means variables from the previous environment, such as a PR environment, would carry over into production.

**Only enable skipped builds when your build output is independent of environment variables.** If your build inlines variables, either keep skipped builds disabled or restructure your application as described below.

## Optimizing your application for skipped builds

### Move build-time side effects to a pre-deploy command

If your build runs tasks that must execute before every deployment, such as database migrations or cache warming, move them to a [pre-deploy command](/deployments/pre-deploy-command). Pre-deploy commands run after the build but before the application starts, and they execute even when the build is skipped.

### Inject environment variables at runtime instead of build time

If you serve a frontend from your server, you can inject environment-specific values at runtime instead of inlining them during the build. This keeps the build output environment-independent.

For example, in Next.js, instead of using `NEXT_PUBLIC_API_URL` (which is inlined at build time), read the variable on the server and pass it to the client:

```tsx
// app/layout.tsx
export default function RootLayout({ children }) {
  const publicEnv = {
    apiUrl: process.env.API_URL,
  };

  return (
    <html>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__env = ${JSON.stringify(publicEnv)}`
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

Your client-side code then reads `window.__env.apiUrl` instead of `process.env.NEXT_PUBLIC_API_URL`. The same image works across all environments without rebuilding.

<Banner variant="warning">
  Do not pass secrets through <code>window.__env</code>. Anything injected this
  way is visible to the client. Only include values that are safe to expose
  publicly, such as API URLs, publishable Stripe keys, or analytics IDs.
</Banner>
