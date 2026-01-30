---
title: Deploy a Phoenix App with Distillery
description: Learn how to deploy a Phoneix app with Distillery to Railway with this step-by-step guide. It covers quick setup, ecto setup, database integration, one-click deploys and other deployment strategies.
---

[Phoenix](https://phoenixframework.org) is popular Elixir framework designed for building scalable, maintainable, and high-performance web applications. It is known for its ability to handle real-time features efficiently, like WebSockets, while leveraging Elixir's concurrency model, which is built on the Erlang Virtual Machine (BEAM).

In this guide, you'll learn how to deploy Phoenix apps with [Distillery](https://hexdocs.pm/distillery/home.html) to Railway.

## Create a Phoenix App with Distillery

**Note:** If you already have a Phoenix app locally or on GitHub, you can skip this step and go straight to the [Deploy Phoenix App with Distillery to Railway](#deploy-phoenix-app-on-railway).

To create a new Phoenix app, ensure that you have [Elixir](https://elixir-lang.org/install.html) and [Hex package manager](https://hexdocs.pm/phoenix/installation.html) installed on your machine. Once everything is set up, run the following command in your terminal to install the Phoenix application generator:

```bash
mix archive.install hex phx_new
```

Next, run the following command:

```bash
mix phx.new helloworld_distillery
```

Select `Y` to install all dependencies.

This command will create a new Phoenix app named `helloworld_distillery` with some optional dependencies such as:

- [Ecto](https://hexdocs.pm/phoenix/ecto.html) for communicating with a database such as PostgreSQL, MySQL etc
- [Phoenix live view](https://hexdocs.pm/phoenix_live_view) for building realtime & interactive web apps.
- [Phoenix HTML and Tailwind CSS](https://hexdocs.pm/phoenix_html/Phoenix.HTML.html) for HTML apps.

### Configure Database

Next, navigate into the `helloworld` directory using the `cd` command.

Open up the `config/dev.exs` file. You'll notice that a new Phoenix app is already set up with PostgreSQL settings. It assumes the database has a `postgres` user with the right permissions and a default password of `postgres`. Update the username and password to match your local PostgreSQL account credentials.

**Note**: If you prefer using a different database, like MySQL, you can easily switch the database adapter in the `mix.exs` file. Simply remove the `Postgrex` dependency and add `MyXQL` instead. For detailed instructions, check out this [guide on using other databases](https://hexdocs.pm/phoenix/ecto.html#using-other-databases) in Phoenix.

The default database name is set to `helloworld_dev`, but feel free to change it to whatever you'd prefer.

Next, create the database for our app by running the following command:

```bash
mix ecto.create
```

A database will be created for our app.

### Add and Configure Distillery

1. Open up the `mix.exs` file and add Distillery to the deps function:

```elixir
  defp deps do
    [ ...,
     {:distillery, "~> 2.1"},
      ...,
    ]
  end
```

Now, run `mix deps.get` to update your dependencies.

2. Open up `config/prod.exs` file and update the endpoint section to the following:

```elixir
config :helloworld_distillery, HelloworldDistilleryWeb.Endpoint,
  cache_static_manifest: "priv/static/cache_manifest.json",
  server: true,
  root: ".",
  version: Application.spec(:phoenix_distillery, :vsn)
```

`server` configures the endpoint to boot the Cowboy application http endpoint on start.
`root` configures the application root for serving static files
`version` ensures that the asset cache will be busted on versioned application upgrades.

3. Initialize your Distillery release by running the following command:

```bash
mix distillery.init
```

This will create the `rel/config.exs` and `rel/vm.args` files. A `rel/plugins` directory will be created too.

4. Create a Mix config file at `rel/config/config.exs`. Here, we are creating a mix config provider. Add the following to it:

```elixir
import Config

port = String.to_integer(System.get_env("PORT") || "4000")
default_secret_key_base = :crypto.strong_rand_bytes(43) |> Base.encode64

config :helloworld_distillery, HelloworldDistilleryWeb.Endpoint,
  http: [port: port],
  url: [host: "localhost", port: port],
  secret_key_base: System.get_env("SECRET_KEY_BASE") || default_secret_key_base
```

Now, update the `rel/config.exs` file to use our new provider. In the `environment :prod` part of the file, replace with the following:

```elixir
environment :prod do
  set include_erts: true
  set include_src: false
  set cookie: :"Jo2*~U0C1x!*E}!o}W*(mx=pzd[XWG[bW)T~_Kjy3eJuEJ;M&!eqj7AUR1*9Vw]!"
  set config_providers: [
    {Distillery.Releases.Config.Providers.Elixir, ["${RELEASE_ROOT_DIR}/etc/config.exs"]}
  ]
  set overlays: [
    {:copy, "rel/config/config.exs", "etc/config.exs"}
  ]
end
```

5. Finally, let's configure Ecto to fetch the database credentials from the runtime environment variables.

Open the `lib/helloworld_distillery/repo.ex` file and modify it to this:

```elixir
defmodule HelloworldDistillery.Repo do
  use Ecto.Repo,
    otp_app: :helloworld_distillery,
    adapter: Ecto.Adapters.Postgres,
    pool_size: 10
  def init(_type, config) do
    {:ok, Keyword.put(config, :url, System.get_env("DATABASE_URL"))}
  end
end
```

### Build the Release with Distillery

To build the release, run the following command:

```bash
npm run deploy --prefix assets && MIX_ENV=prod mix do phx.digest, distillery.release --env=prod
```

#### Handling Errors

If you encounter the following error after running the command:

```bash
==> Invalid application `:sasl`! The file sasl.app does not exist or cannot be loaded.
```

You need to modify your `mix.exs` file to include `:sasl`. Open the file and add `:sasl` to the `extra_applications` list in the `application` function:

```elixir
def application do
    [
      mod: {HelloworldDistillery.Application, []},
      extra_applications: [:logger, :runtime_tools, :sasl]
    ]
  end
```

After saving your changes, try running the command again as a super user to prevent access errors:

```bash
sudo npm run deploy --prefix assets && MIX_ENV=prod mix do phx.digest, distillery.release --env=prod
```

**Additional Errors**

If you encounter this error:

```bash
Failed to archive release: _build/prod/rel/helloworld_distillery/releases/RELEASES: no such file or directory
```

You’ll need to create the `RELEASES` directory manually. Once created, run the command again.

#### Successful Build

Upon a successful build, you should see output similar to the following:

```bash
...
==> Packaging release..
Release successfully built!
To start the release you have built, you can use one of the following tasks:

    # start a shell, like 'iex -S mix'
    > _build/prod/rel/helloworld_distillery/bin/helloworld_distillery console

    # start in the foreground, like 'mix run --no-halt'
    > _build/prod/rel/helloworld_distillery/bin/helloworld_distillery foreground

    # start in the background, must be stopped with the 'stop' command
    > _build/prod/rel/helloworld_distillery/bin/helloworld_distillery start

If you started a release elsewhere, and wish to connect to it:

    # connects a local shell to the running node
    > _build/prod/rel/helloworld_distillery/bin/helloworld_distillery remote_console

    # connects directly to the running node's console
    > _build/prod/rel/helloworld_distillery/bin/helloworld_distillery attach

For a complete listing of commands and their use:

    > _build/prod/rel/helloworld_distillery/bin/helloworld_distillery help
```

### Test the Release with Distillery locally

Now, let's test our release locally. First, create your database by running the following command:

```bash
mix ecto.create
```

Next, export the necessary environment variables by running:

```bash
export DATABASE_URL=postgresql://username:password@127.0.0.1:5432/helloworld_distillery
export SECRET_KEY_BASE=<your-secret-key-base>
```

With the environment set up, you can start the release with:

```bash
_build/prod/rel/helloworld_distillery/bin/helloworld_distillery foreground
```

Once your app is running, open your browser and visit `http://localhost:4000` to see it in action.

With your app up and running locally, let's move on to deploying the release to Railway!

### Prepare App for Deployment

Create a `nixpacks.toml` file in the root of your app directory and add the following content:

```toml
# nixpacks.toml
[variables]
MIX_ENV = 'prod'

[phases.setup]
nixPkgs = ['...', 'erlang']

[phases.install]
cmds = [
  'mix local.hex --force',
  'mix local.rebar --force',
  'mix deps.get --only prod'
]

[phases.build]
cmds = [
  'mix compile',
  'mkdir -p _build/prod/rel/helloworld_distillery/releases/RELEASES',
  'mix do phx.digest, distillery.release --env=prod',
]

[start]
cmd = "mix ecto.setup && _build/prod/rel/helloworld_distillery/bin/helloworld_distillery foreground"
```

This [`nixpacks.toml` file](/reference/config-as-code#nixpacks-config-path) instructs Railway to execute specific commands during the setup, install, build, and start phases of the deployment. It ensures your app is compiled, assets are digested, and the release is created correctly using Distillery.

## Deploy Phoenix App to Railway

Railway offers multiple ways to deploy your Phoenix app, depending on your setup and preference. Choose any of the following methods:

1. [One-click deploy from a template](#one-click-deploy-from-a-template).
2. [Using the CLI](#deploy-from-the-cli).
3. [From a GitHub repository](#deploy-from-a-github-repo).

## One-Click Deploy from a Template

If you’re looking for the fastest way to get started, the one-click deploy option is ideal. It sets up a Phoenix app with Distillery along with a Postgres database.

Click the button below to begin:

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/new/template/_qWFnI)

After deploying, we recommend that you [eject from the template](/guides/deploy#eject-from-template-repository) to create a copy of the repository under your own GitHub account. This will give you full control over the source code and project.

## Deploy from the CLI

To deploy the Phoenix app using the Railway CLI, please follow the steps:

1. **Install the Railway CLI**:
   - <a href="/guides/cli#installing-the-cli" target="_blank">Install the CLI</a> and <a href="/guides/cli#authenticating-with-the-cli" target="_blank">authenticate it</a> using your Railway account.
2. **Initialize a Railway Project**:
   - Run the command below in your Phoenix app directory.
     ```bash
     railway init
     ```
   - Follow the prompts to name your project.
   - After the project is created, click the provided link to view it in your browser.
3. **Deploy the Application**:

   - Use the command below to deploy your app:
     ```bash
     railway up
     ```
   - This command will scan, compress and upload your app's files to Railway. You’ll see real-time deployment logs in your terminal.

   **Note:** You might encounter an error––`warning: the VM is running with native name encoding of latin1 which` `may cause Elixir to malfunction as it expects utf8....`. Don’t worry, we’ll address this in the next step.

4. **Add a Database Service**:
   - Run `railway add`.
   - Select `PostgreSQL` by pressing space and hit **Enter** to add it to your project.
   - A database service will be added to your Railway project.
5. **Configure Environment Variables**:
   - Go to your app service <a href="/overview/the-basics#service-variables">**Variables**</a> section and add the following:
     - `SECRET_KEY_BASE` : Set the value to the your app's secret key. You can run `mix phx.gen.secret` locally to generate one.
     - `LANG`and `LC_CTYPE`: Set both values to `en_US.UTF-8`. This sets your app's locale and gets rid of the _native name encoding of latin1_ warning.
     - `DATABASE_URL`: Set the value to `${{Postgres.DATABASE_URL}}` (this references the URL of your new Postgres database). Learn more about [referencing service variables](/guides/variables#referencing-another-services-variable).
     - `ECTO_IPV6`: Set the value to `true` to enable your Phoenix app to connect to the database through the [IPv6 private network](/guides/private-networking#listen-on-ipv6).
   - Use the **Raw Editor** to add any other required environment variables in one go.
6. **Redeploy the Service**:
   - Click **Deploy** on the Railway Project Canvas to apply your changes.
7. **Verify the Deployment**:
   - Once the deployment completes, go to [**View logs**](/guides/logs#build--deploy-panel) to check if the server is running successfully.
8. **Set Up a Public URL**:
   - Navigate to the **Networking** section under the [Settings](/overview/the-basics#service-settings) tab of your new service.
   - Click [Generate Domain](/guides/public-networking#railway-provided-domain) to create a public URL for your app.

<Image src="https://res.cloudinary.com/railway/image/upload/f_auto,q_auto/v1730309171/docs/quick-start/phoenix_distillery.png"
alt="screenshot of the deployed Phoenix with Distillery service"
layout="responsive"
width={2667} height={2177} quality={100} />

## Deploy from a GitHub Repo

To deploy the Phoenix app to Railway, start by pushing the app to a GitHub repo. Once that’s set up, follow the steps below to complete the deployment process.

1. **Create a New Project on Railway**:
   - Go to <a href="https://railway.com/new" target="_blank">Railway</a> to create a new project.
2. **Deploy from GitHub**:
   - Select **Deploy from GitHub repo** and choose your repository.
     - If your Railway account isn’t linked to GitHub yet, you’ll be prompted to do so.
3. **Add Environment Variables and Provision a Database Service**:
   - Click **Add Variables**, but hold off on adding anything just yet. First, proceed with the next step.
   - Right-click on the Railway project canvas or click the **Create** button, then select **Database** and choose **Add PostgreSQL**. This will create and deploy a new PostgreSQL database for your project.
   - Once the database is deployed, you can return to adding the necessary environment variables:
     - `SECRET_KEY_BASE` : Set the value to the your app's secret key. You can run `mix phx.gen.secret` locally to generate one.
     - `LANG`and `LC_CTYPE`: Set both values to `en_US.UTF-8` to ensure proper locale settings and avoid the _native name encoding of latin1 warning_.
     - `DATABASE_URL`: Set the value to `${{Postgres.DATABASE_URL}}` (this references the URL of your new Postgres database). Learn more about [referencing service variables](/guides/variables#referencing-another-services-variable).
     - `ECTO_IPV6`: Set the value to `true` to enable your Phoenix app to connect to the database through the [IPv6 private network](/guides/private-networking#listen-on-ipv6).
4. **Deploy the App Service**:
   - Click **Deploy** on the Railway project canvas to apply your changes.
5. **Verify the Deployment**:

   - Once the deployment completes, go to [**View logs**](/guides/logs#build--deploy-panel) to check if the server is running successfully.

   **Note:** During the deployment process, Railway will automatically [detect that it’s an Elixir app](https://nixpacks.com/docs/providers/elixir).

6. **Set Up a Public URL**:
   - Navigate to the **Networking** section under the [Settings](/overview/the-basics#service-settings) tab of your new service.
   - Click [Generate Domain](/guides/public-networking#railway-provided-domain) to create a public URL for your app.

This guide covers the main deployment options on Railway. Choose the approach that suits your setup, and start deploying your Phoenix apps with Distillery effortlessly!

## Next Steps

Explore these resources to learn how you can maximize your experience with Railway:

- [Monitoring](/guides/monitoring)
- [Deployments](/guides/deployments)
