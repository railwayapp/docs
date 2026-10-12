---
title: Functions
description: Write and deploy code from the Railway canvas without managing infrastructure or creating a git repository.
---

Write and deploy code from the Railway canvas without managing infrastructure or creating a git repository.
Functions are [Services](/services) that <a href="https://blog.railway.com/p/introducing-railway-functions" target="_blank">run a single file of TypeScript code</a> using the [Bun](https://bun.sh/) runtime.
Use them like any other Service, but without the overhead of a repository.

They are ideal for small tasks like handling webhooks, cron jobs, or simple APIs.

## Key features

- **Instant deploys**: Deploy code changes _in seconds_. No need to wait for a build step.
- **Import any NPM package**: Use any NPM package in your function. We will automatically install it for you when your code runs. Pin specific versions by using a `package@version` syntax in your imports, e.g. `import { Hono } from "hono@4"`
- **Use native Bun APIs**: Access [Bun APIs](https://bun.sh/docs/runtime/bun-apis) like `Bun.file()` and `Bun.serve()`.
- **Service variables**: Service [Variables](/variables) are automatically available in the function editor via `import.meta.env`, `process.env`, or `Bun.env`
- **Attach volumes**: Persist data in your function using [Volumes](/volumes).
- **Trace requests**: Export OpenTelemetry spans to the [Traces](/observability/tracing/functions) page from inside your function's file.
- **Manage with Infrastructure as Code**: Declare functions with `fn` in `.railway/railway.ts` and keep their source files in your repository. See [Infrastructure as Code](#infrastructure-as-code).
- **Use Vim**: Enable Vim keybindings in the function editor by using the shortcut `Ctrl+Option+V` on a Mac or `Ctrl+Alt+V` on Windows.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1738958871/docs/railway-functions-2_vk0umf.png"
alt="Screenshot of pre-deploy command configuration"
layout="intrinsic"
width={589} height={366} quality={80} />

## Limitations

- 1 file per function
- Max file size of 96KB

## Edit and deploy

If you're familiar with VSCode or other IDEs, you'll feel right at home with the built-in editor.

- **To edit** your function, open the "Source Code" tab in your service.
- **To stage** your changes, press ⌘+S (or Control+S if using Windows).
- **To deploy** staged changes, press Shift+Enter.

## Versioning

Railway automatically versions your function code. Each time you deploy, a new version is created and is available for rollback.
To rollback or redeploy a previous version, find the [Deployment](/deployments) you want to rollback to in the "Deployments" tab
of your service. Then click the "Redeploy" button.

You can find the source code of a previous deployment by opening the deployment details.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1738960017/docs/railway-functions-versions_jqdhal.png"
alt="Screenshot of pre-deploy command configuration"
layout="intrinsic"
width={588} height={499} quality={80} />

## Infrastructure as Code

You can declare functions in your [Infrastructure as Code](/infrastructure-as-code) file next to the rest of your project. The `fn` helper takes the path of the function's source file, reads it when the Railway CLI evaluates the config, and deploys it the same way the editor and `railway functions push` do.

Railway stores a function's code base64-encoded in the start command of a service that runs the function image. `fn` does that encoding for you, so the dashboard shows and edits the deployed source as usual.

<CodeBlock>
  <CodeTab label="TypeScript" lang="ts">
{`import { defineRailway, fn, postgres, project } from "railway/iac";

export default defineRailway(() => {
  const db = postgres("db");

  const hello = fn("hello", {
    codeFile: "./functions/hello.ts",
    domains: ["hello.example.com"],
  });

  const cleanup = fn("nightly-cleanup", {
    codeFile: "./functions/cleanup.ts",
    deploy: { cronSchedule: "0 2 * * *" },
    env: { DATABASE_URL: db.env.DATABASE_URL },
  });

  return project("my-app", {
    resources: [db, hello, cleanup],
  });
});`}
  </CodeTab>
  <CodeTab label="Python (beta)" lang="python">
{`from railway_sdk import define_railway, fn, postgres, project

@define_railway
def main(ctx=None):
    db = postgres("db")

    hello = fn(
        "hello",
        code_file="functions/hello.ts",
        domains=["hello.example.com"],
    )

    cleanup = fn(
        "nightly-cleanup",
        code_file="functions/cleanup.ts",
        deploy={"cronSchedule": "0 2 * * *"},
        env={"DATABASE_URL": db.env.DATABASE_URL},
    )

    return project("my-app", resources=[db, hello, cleanup])`}
  </CodeTab>
  <CodeTab label="Go (beta)" lang="go">
{`package main

import "github.com/railwayapp/railway-go-sdk"

func Railway() railway.Project {
  db := railway.Postgres("db")

  hello := railway.Fn("hello", railway.ServiceConfig{
    "codeFile": "functions/hello.ts",
    "domains":  []any{"hello.example.com"},
  })

  cleanup := railway.Fn("nightly-cleanup", railway.ServiceConfig{
    "codeFile": "functions/cleanup.ts",
    "deploy":   map[string]any{"cronSchedule": "0 2 * * *"},
    "env":      map[string]any{"DATABASE_URL": db.Env("DATABASE_URL")},
  })

  return railway.ProjectNamed("my-app", []any{db, hello, cleanup})
}`}
  </CodeTab>
</CodeBlock>

With this layout, the source files live next to the config file:

```txt
.railway/railway.ts
.railway/functions/hello.ts
.railway/functions/cleanup.ts
```

How `fn` handles the source file:

- `codeFile` (`code_file` in Python) is the path to the function's source. A relative path resolves against the directory of the config file, not the directory you run the CLI from. Absolute paths are used as is.
- The file is read every time the config is evaluated, so `railway config plan` and `railway config apply` always deploy what is on disk.
- The file must be at most 96 KB, the same limit as the editor. A larger file fails when the config is evaluated, before any plan runs.
- `codeFile` sets the start command. Passing `start` as well is an error.
- `runtime` picks the runtime image and defaults to `bun`, the only runtime. To pin a specific image version, pass `runtime="bun:1.2.16"` in Python, or `source: image("ghcr.io/railwayapp/function-bun:1.2.16")` in TypeScript and Go.

Everything else `service` accepts, such as `env`, `domains`, `deploy`, and volume attachments, works on `fn` too. See the [Infrastructure as Code reference](/infrastructure-as-code/reference) for the full list.

### Import existing functions

Run `railway config pull` to import functions you created in the dashboard or with the CLI. The CLI decodes each function's deployed source, writes it to `.railway/functions/<name>.ts`, and renders the function as an `fn` call that points at that file:

```ts
const hello = fn("hello", {
  codeFile: "functions/hello.ts",
  domains: ["hello.example.com"],
});
```

The CLI prints each source file it wrote. A function whose start command can't be decoded is rendered as a plain `service` with its raw start command, so nothing is lost.

### Preview code changes

`railway config plan` decodes the source on both sides and shows a diff of the code instead of the encoded start command. The diff is capped at 200 lines. Creating a function reports the line count of its source.

```txt
Plan: 0 to add, 1 to change, 0 to destroy
  ~ Update hello source code
    └ source code (+1 -1)
    └   export default {
    └ -   fetch: () => new Response("hello"),
    └ +   fetch: () => new Response("hello from a function"),
    └   };
```

If you declare a function without `codeFile`, the plan warns that applying removes the deployed source. Pass `codeFile`, or run `railway config pull` first to import the existing code into `functions/`.
