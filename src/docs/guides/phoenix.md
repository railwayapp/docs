---
title: Deploy a Phoenix App
description: Learn how to deploy a Phoenix app to Railway with this step-by-step guide. It covers quick setup, ecto setup, database integration, one-click deploys and other deployment strategies.
---

[Phoenix](https://phoenixframework.org) is popular Elixir framework designed for building scalable, maintainable, and high-performance web applications. It is known for its ability to handle real-time features efficiently, like WebSockets, while leveraging Elixir's concurrency model, which is built on the Erlang Virtual Machine (BEAM).

## Create a Phoenix App

**Note:** If you already have a Phoenix app locally or on GitHub, you can skip this step and go straight to the [Deploy Phoenix App on Railway](#deploy-phoenix-app-on-railway).

To create a new Phoenix app, ensure that you have [Elixir](https://elixir-lang.org/install.html) and [Hex package manager](https://hexdocs.pm/phoenix/installation.html) installed on your machine. Once everything is set up, run the following command in your terminal to install the Phoenix application generator:

```bash
mix archive.install hex phx_new
```

Next, run the following command:

```bash
mix phx.new helloworld
```

Select `Y` to install all dependencies.

This command will create a new Phoenix app named `helloworld` with some optional dependencies such as:

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

### Run the Phoenix App locally

Start the app by running the following command:

```bash
mix phx.server
```

By default, Phoenix accepts requests on port `4000`.

Open your browser and go to `http://localhost:4000` to see your app.

Now that your app is running locally, let’s move on to deploying it to Railway!

### Prepare our Phoenix App for deployment

Go ahead and create a `nixpacks.toml` file in the root directory of our Phoenix app. 

The [nixpacks.toml file](https://nixpacks.com/docs/configuration/file) is a configuration file used by Nixpacks, a build system developed and used by Railway, to set up and deploy applications. 

In this file, you can specify the instructions for various build and deployment phases, along with environment variables and package dependencies.

Add the following content to the file:

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
  'mix assets.deploy'
]

[start]
cmd = "mix ecto.setup && mix phx.server"
```

1. `[variables]` This section contains the list of env variables you want to set for the app.
    - `MIX_ENV = 'prod'`: It sets the Elixir environment to prod. 
2. `[phases.setup]`: This defines a list of Nix packages to be installed during the setup phase. The placeholder `'...'` should be replaced with any additional packages needed for your application. The inclusion of erlang indicates that the Erlang runtime is required for the Elixir application.
3. `[phases.install]`: This section contains a list of commands to run during the installation phase. 
    - `mix local.hex --force`: Installs the Hex package manager for Elixir, which is necessary for managing dependencies.
    - `mix local.rebar --force`: Installs Rebar, a build tool for Erlang.
    - `mix deps.get --only prod`: Fetches only the production dependencies defined in the `mix.exs` file.
4. `[phases.build]`: This section contains commands to run during the build phase.
    - `mix compile`: Compiles the Elixir application.
    - `mix assets.deploy`: This is a command to handle the deployment of static assets (e.g., JavaScript, CSS) for our app.
5. `[start]`: This section contains commands to run when starting the application.
    - `mix ecto.setup`: This command is used to set up the database by running migrations and seeding it. It prepares the database for the application to connect.
    - `mix phx.server`: This starts the Phoenix server, allowing the application to begin accepting requests.

Now, we are ready to deploy!

## Deploy Phoenix App to Railway

Railway offers multiple ways to deploy your Phoenix app, depending on your setup and preference. Choose any of the following methods:

1. [One-click deploy from a template](#one-click-deploy-from-a-template).
2. [Using the CLI](#deploy-from-the-cli).
3. [From a GitHub repository](#deploy-from-a-github-repo).

## One-Click Deploy from a Template

If you’re looking for the fastest way to get started, the one-click deploy option is ideal. It sets up a Phoenix app along with a Postgres database.

Click the button below to begin:

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/new/template/0LSBzw)

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

<Image src="https://res.cloudinary.com/railway/image/upload/f_auto,q_auto/v1730139857/docs/quick-start/phoenix_elixir_app.png"
alt="screenshot of the deployed Phoenix service showing the welcome page"
layout="responsive"
width={2757} height={2111} quality={100} />

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
        -  `DATABASE_URL`: Set the value to `${{Postgres.DATABASE_URL}}` (this references the URL of your new Postgres database). Learn more about [referencing service variables](/guides/variables#referencing-another-services-variable).
        - `ECTO_IPV6`: Set the value to `true` to enable your Phoenix app to connect to the database through the [IPv6 private network](/guides/private-networking#listen-on-ipv6).
4. **Deploy the App Service**:
    - Click **Deploy** on the Railway project canvas to apply your changes.
5. **Verify the Deployment**:
    - Once the deployment completes, go to [**View logs**](/guides/logs#build--deploy-panel) to check if the server is running successfully.

    **Note:** During the deployment process, Railway will automatically [detect that it’s an Elixir app](https://nixpacks.com/docs/providers/elixir).
6. **Set Up a Public URL**:
    - Navigate to the **Networking** section under the [Settings](/overview/the-basics#service-settings) tab of your new service.
    - Click [Generate Domain](/guides/public-networking#railway-provided-domain) to create a public URL for your app.

This guide covers the main deployment options on Railway. Choose the approach that suits your setup, and start deploying your Phoenix apps effortlessly!

## Want to Deploy Livebook?

[Livebook](https://livebook.dev), an interactive notebook tool built specifically for Elixir, provides a powerful and intuitive environment for exploring data, running code, and documenting insights, all in one place. It’s perfect for experimenting with Elixir code, prototyping, and sharing live documentation.

Click the button below to deploy an instance of Livebook quickly.

[![Deploy Livebook on Railway](https://railway.com/button.svg)](https://railway.com/new/template/4uLt1s)
 
## Next Steps

Explore these resources to learn how you can maximize your experience with Railway:

- [Deploy Phoenix with Distillery](/guides/phoenix-distillery)
- [Monitoring](/guides/monitoring)
- [Deployments](/guides/deployments)