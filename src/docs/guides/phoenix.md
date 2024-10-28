---
title: Deploy a Phoenix App
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

## Deploy Phoenix App to Railway

Railway offers multiple ways to deploy your Phoenix app, depending on your setup and preference. Choose any of the following methods:

1. [One-click deploy from a template](#one-click-deploy-from-a-template).
2. [Using the CLI](#deploy-from-the-cli).
3. [From a GitHub repository](#deploy-from-a-github-repo).

## One-Click Deploy from a Template

If you’re looking for the fastest way to get started, the one-click deploy option is ideal. It sets up a Phoenix app along with a Postgres database.

Click the button below to begin:

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template/0LSBzw)

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
        - `ECTO_IPV6`: Set the value to `true` to enable your Phoenix app to connect to the database through the IPv6 private network. 
    - Use the **Raw Editor** to add any other required environment variables in one go.
6. **Redeploy the Service**:
    - Click **Deploy** on the Railway dashboard to apply your changes.
7. **Verify the Deployment**:
    - Once the deployment completes, go to **View logs** to check if the server is running successfully.
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
    - Go to <a href="https://railway.app/new" target="_blank">Railway</a> to create a new project.
2. **Deploy from GitHub**: 
    - Select **Deploy from GitHub repo** and choose your repository.
        - If your Railway account isn’t linked to GitHub yet, you’ll be prompted to do so.
3. **Add Environment Variables**:
    - Click **Add Variables** and configure all the necessary environment variables for your app.
        - `SECRET_KEY_BASE` : Set the value to the your app's secret key. You can run `mix phx.gen.secret` locally to generate one.
        - `LANG`and `LC_CTYPE`: Set both values to `en_US.UTF-8`. This sets our app's locale and gets rid of the _native name encoding of latin1_ warning. 
4. **Deploy the App**: 
    - Click **Deploy** to start the deployment process.
    - Once the deployed, a Railway [service](/guides/services) will be created for your app, but it won’t be publicly accessible by default.
5. **Add a Database Service**:
    - Right-click on the Railway project canvas or click the **Create** button.
    - Select **Database**.
    - Select **Add PostgreSQL** from the available databases.
        - This will create and deploy a new Postgres database service for your project.
6. **Add Database Environment Variable**:
     - Click **Add Variables**.
        -  Add `DATABASE_URL`: Set the value to `${{Postgres.DATABASE_PUBLIC_URL}}` (this references the URL of your new Postgres database). Learn more about [referencing service variables](/guides/variables#referencing-another-services-variable). 
7. **Redeploy the Service**:
    - Click **Deploy** on the Railway dashboard to apply your changes.
8. **Verify the Deployment**:
    - Once the deployment completes, go to **View logs** to check if the server is running successfully.

**Note:** During the deployment process, Railway will automatically [detect that it’s an Elixir app](https://nixpacks.com/docs/providers/elixir).

9. **Set Up a Public URL**:
    - Navigate to the **Networking** section under the [Settings](/overview/the-basics#service-settings) tab of your new service.
    - Click [Generate Domain](/guides/public-networking#railway-provided-domain) to create a public URL for your app.

This guide covers the main deployment options on Railway. Choose the approach that suits your setup, and start deploying your Phoenix apps effortlessly!

## Want to Deploy Livebook?

[Livebook](https://livebook.dev), an interactive notebook tool built specifically for Elixir, provides a powerful and intuitive environment for exploring data, running code, and documenting insights, all in one place. It’s perfect for experimenting with Elixir code, prototyping, and sharing live documentation.

Click the button below to deploy an instance of Livebook quickly:

[![Deploy Livebook on Railway](https://railway.app/button.svg)](https://railway.app/new/template/4uLt1s)

Livebook allows developers to write and execute Elixir code in small, manageable chunks, making it easier to explore complex problems step by step. It's an excellent tool for learning Elixir, debugging, and brainstorming new ideas with others, transforming coding sessions into real-time, interactive, and shareable experiences.
 
## Next Steps

Explore these resources to learn how you can maximize your experience with Railway:

- [Monitoring](/guides/monitoring)
- [Deployments](/guides/deployments)