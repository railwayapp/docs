---
title: Deploy a Ruby on Rails App
description: Learn how to deploy a Rails app to Railway with this step-by-step guide. It covers quick setup, database integration, cron and sidekiq setups, one-click deploys and other deployment strategies.
---

Rails is a Ruby full-stack framework designed to compress the complexity of modern web apps. It ships with all the tools needed to build amazing web apps on both the front and back end.

## Create a Rails App

**Note:** If you already have a Rails app locally or on GitHub, you can skip this step and go straight to the [Deploy Ruby on Rails App on Railway](#deploy-ruby-on-rails-app-on-railway).

To create a new Rails app, ensure that you have [Ruby](https://www.ruby-lang.org/en/documentation/installation) and [Rails](https://guides.rubyonrails.org/getting_started.html#creating-a-new-rails-project-installing-rails-installing-rails) installed on your machine. Once everything is set up, run the following command in your terminal:

```bash
rails new blog --database=postgresql
```

This command will create a new Rails app named `blog` with PostgreSQL as the database config. Now, let’s create a simple "Hello World" page to ensure everything is working correctly.

1. **Generate a Controller**: Run the following command to create a new controller named `HelloWorld` with an `index` action:

   ```bash
       rails g controller HelloWorld index
   ```

   This will generate the necessary files for the controller, along with a view, route, and test files.

2. **Update the Routes File**: Open the `config/routes.rb` file and modify it to set the root route to the `hello_world#index` action:

   ```ruby
   Rails.application.routes.draw do
       get "hello_world/index"
       # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

       # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
       # Can be used by load balancers and uptime monitors to verify that the app is live.
       get "up" => "rails/health#show", as: :rails_health_check

       # Render dynamic PWA files from app/views/pwa/*
       get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker
       get "manifest" => "rails/pwa#manifest", as: :pwa_manifest

       # Defines the root path route ("/")
       root "hello_world#index"
   end
   ```

3. **Modify the View**: Open the `app/views/hello_world/index.html.erb` file and replace its content with the following:

   ```ruby
   <h1>Hello World</h1>

   <p> This is a Rails app running on Railway</p>
   ```

4. **Run the Application Locally**: Start the Rails server by running:

   ```bash
       bin/rails server
   ```

   Open your browser and go to `http://localhost:3000` to see your "Hello World" page in action.

Now that your app is running locally, let’s move on to deploying it to Railway!

## Deploy Ruby on Rails App on Railway

Railway offers multiple ways to deploy your Rails app, depending on your setup and preference. Choose any of the following methods:

1. [One-click deploy from a template](#one-click-deploy-from-a-template).
2. [Using the CLI](#deploy-from-the-cli).
3. [From a GitHub repository](#deploy-from-a-github-repo).

## One-Click Deploy from a Template

If you’re looking for the fastest way to get started, the one-click deploy option is ideal. It sets up a Rails app along with a Postgres database and Redis.

Click the button below to begin:

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/new/template/sibk1f)

After deploying, we recommend that you [eject from the template](/guides/deploy#eject-from-template-repository) to create a copy of the repository under your own GitHub account. This will give you full control over the source code and project.

## Deploy from the CLI

To deploy the Rails app using the Railway CLI, please follow the steps:

1. **Install the Railway CLI**:
   - <a href="/guides/cli#installing-the-cli" target="_blank">Install the CLI</a> and <a href="/guides/cli#authenticating-with-the-cli" target="_blank">authenticate it</a> using your Railway account.
2. **Initialize a Railway Project**:
   - Run the command below in your Rails app directory.
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

- **Note:** If you see an error about a missing `secret_key_base` for the production environment, don’t worry. We’ll fix this in the next step.

4. **Add a Database Service**:
   - Run `railway add`.
   - Select `PostgreSQL` by pressing space and hit **Enter** to add it to your project.
   - A database service will be added to your Railway project.
5. **Configure Environment Variables**:
   - Go to your app service <a href="/overview/the-basics#service-variables">**Variables**</a> section and add the following:
     - `SECRET_KEY_BASE` or `RAILS_MASTER_KEY`: Set the value to the key from your local app's `config/master.key`.
     - `DATABASE_URL`: Set the value to `${{Postgres.DATABASE_PUBLIC_URL}}` (this references the URL of your new Postgres database). Learn more about [referencing service variables](/guides/variables#referencing-another-services-variable).
   - Use the **Raw Editor** to add any other required environment variables in one go.
6. **Redeploy the Service**:
   - Click **Deploy** on the Railway dashboard to apply your changes.
7. **Verify the Deployment**:
   - Once the deployment completes, go to **View logs** to check if the server is running successfully.

**Note:** If your app has a `Dockerfile` (which newer Rails apps typically include by default), Railway will [automatically detect and use it to build](/reference/dockerfiles) your app. If not, Railway will still handle the deployment process for you.

8. **Set Up a Public URL**:
   - Navigate to the **Networking** section under the [Settings](/overview/the-basics#service-settings) tab of your new service.
   - Click [Generate Domain](/guides/public-networking#railway-provided-domain) to create a public URL for your app.

<Image src="https://res.cloudinary.com/railway/image/upload/f_auto,q_auto/v1728049734/docs/quick-start/railsapp_on_railway.png"
alt="screenshot of the deployed Rails service showing the Hello world page"
layout="responsive"
width={2375} height={1151} quality={100} />

## Deploy from a GitHub Repo

To deploy the Rails app to Railway, start by pushing the app to a GitHub repo. Once that’s set up, follow the steps below to complete the deployment process.

1. **Create a New Project on Railway**:
   - Go to <a href="https://railway.com/new" target="_blank">Railway</a> to create a new project.
2. **Deploy from GitHub**:
   - Select **Deploy from GitHub repo** and choose your repository.
     - If your Railway account isn’t linked to GitHub yet, you’ll be prompted to do so.
3. **Add Environment Variables**:
   - Click **Add Variables** and configure all the necessary environment variables for your app.
     - E.g `RAILS_ENV`: Set the value to `production`.
     - E.g `SECRET_KEY_BASE` or `RAILS_MASTER_KEY`: Set the value to the key from your app's `config/master.key`.
4. **Deploy the App**:
   - Click **Deploy** to start the deployment process.
   - Once the deployed, a Railway [service](/guides/services) will be created for your app, but it won’t be publicly accessible by default.
5. **Add a Database Service**:
   - Right-click on the Railway project canvas or click the **Create** button.
   - Select **Database**.
   - Select **Add PostgreSQL** from the available databases.
     - This will create and deploy a new Postgres database service for your project.
6. **Configure Environment Variables**:
   - Go to your app service <a href="/overview/the-basics#service-variables">**Variables**</a> section and add the following:
     - `DATABASE_URL`: Set the value to `${{Postgres.DATABASE_URL}}` (this references the URL of your new Postgres database). Learn more about [referencing service variables](/guides/variables#referencing-another-services-variable).
   - Use the **Raw Editor** to add any other required environment variables in one go.
7. **Prepare Database and Start Server**:
   - Go to your app service <a href="/overview/the-basics#service-settings">**Settings**</a> section.
     - In the **Deploy** section, set `bin/rails db:prepare && bin/rails server -b ::` as the <a href="/guides/start-command">**Custom Start Command**</a>. This command will run your database migrations and start the server.
8. **Redeploy the Service**:
   - Click **Deploy** on the Railway dashboard to apply your changes.
9. **Verify the Deployment**:
   - Once the deployment completes, go to **View logs** to check if the server is running successfully.

**Note:** During the deployment process, Railway will automatically [detect that it’s a Rails app](https://nixpacks.com/docs/providers/ruby).

10. **Set Up a Public URL**:
    - Navigate to the **Networking** section under the [Settings](/overview/the-basics#service-settings) tab of your new service.
    - Click [Generate Domain](/guides/public-networking#railway-provided-domain) to create a public URL for your app.

This guide covers the main deployment options on Railway. Choose the approach that suits your setup, and start deploying your Rails apps effortlessly!

Next, we'll cover how to set up workers and cron jobs for your Rails app on Railway.

## Set Up Workers & Cron Jobs with Sidekiq

Sidekiq is a powerful and efficient background job processor for Ruby apps, and it integrates seamlessly with Rails. Follow the instructions below to configure and run Sidekiq in your Rails app on Railway:

1. **Install Sidekiq**
   - Start by adding `sidekiq` and `sidekiq-cron` to your Rails app. In your terminal, run the following command:
     ```bash
     bundle add sidekiq
     bundle add sidekiq-cron
     ```
2. **Add a Redis Database Service**
   - Sidekiq uses Redis as a job queue. To set this up:
     - Right-click on the Railway project canvas or click the **Create** button.
     - Select **Database**.
     - Select **Add Redis** from the available databases.
       - This will create and deploy a new Redis service for your app.
3. **Create and Configure a Worker Service**
   - Now, set up a <a href="/guides/services#creating-a-service">separate service</a> to run your Sidekiq workers.
     - Create a new <a href="/overview/the-basics#service-settings">**Empty Service**</a> and name it **Worker Service**.
     - Go to the <a href="/overview/the-basics#service-settings">**Settings**</a> tab of this service to configure it.
     - In the **Source** section, connect your GitHub repository to the **Source Repo**.
     - Under the <a href="/guides/build-configuration#customize-the-build-command">**Build**</a> section, set `bundle install` as the **Custom Build Command**. This installs the necessary dependencies.
     - In the **Deploy** section, set `bundle exec sidekiq` as the <a href="/guides/start-command">**Custom Start Command**</a>. This command will start Sidekiq and begin processing jobs.
     - Click on <a href="/overview/the-basics#service-variables">**Variables**</a> at the top of the service settings.
     - Add the following environment variables:
       - `RAILS_ENV`: Set the value to `production`.
       - `SECRET_KEY_BASE` or `RAILS_MASTER_KEY`: Set this to the value of your Rails app’s secret key.
       - `REDIS_URL`: Set this to `${{Redis.REDIS_URL}}` to reference the Redis database URL. This tells Sidekiq where to find the job queue. Learn more about [referencing service variables](/guides/variables#referencing-another-services-variable).
       - Include any other environment variables your app might need.
     - Click **Deploy** to apply the changes and start the deployment.
4. **Verify the Deployment**:

   - Once the deployment is complete, click on **View Logs**. If everything is set up correctly, you should see Sidekiq starting up and processing any queued jobs.

   <Image src="https://res.cloudinary.com/railway/image/upload/f_auto,q_auto/v1728065286/docs/quick-start/worker_service.png" alt="screenshot of the worker service running Sidekiq" 
   layout="responsive" width={2210} height={1696} quality={100} />

5. **Confirm All Services Are Connected**:
   - At this stage, your application should have the following services set up and connected:
     - **App Service**: Running the main Rails application.
     - **Worker Service**: Running Sidekiq to process background jobs.
     - **Postgres Service**: The database for your Rails app.
     - **Redis Service**: Used by Sidekiq to manage background jobs

Here’s how your setup should look:

<Image src="https://res.cloudinary.com/railway/image/upload/f_auto,q_auto/v1728065005/docs/quick-start/rails_all_services_connected.png" alt="Diagram showing all Rails services connected on Railway" layout="responsive" width={3308} height={1920} quality={100} />

By following these steps, you’ll have a fully functional Rails app with background job processing using Sidekiq on Railway. If you run into any issues or need to make adjustments, check the logs and revisit your environment variable configurations.

## Setting up TailwindCSS

[TailwindCSS](https://tailwindcss.com/docs/) is a utility-first CSS framework that ships with the latest version of Rails. It eliminates the need to write custom CSS from scratch.

You can add TailwindCSS to your Rails app in two ways:

1. **During app creation**: Add the `--css tailwind` flag when creating a new Rails app:
   ```bash
   rails new myapp --css tailwind
   ```

2. **To an existing app**: Add the `tailwindcss-rails` gem to your `Gemfile` and run the installer:
   ```bash
   bundle add tailwindcss-rails
   bin/rails tailwindcss:install
   ```

### Running TailwindCSS in Development

During development, you need the TailwindCSS watcher to automatically compile your styles as you make changes.

You can run it in two ways:

**Option 1**: As a standalone process alongside your Rails server:
```bash
bin/rails tailwindcss:watch
```

**Option 2**: Integrated with Puma by adding this to your `config/puma.rb` file:
```ruby
plugin :tailwindcss
```

This automatically starts the watcher when you run `bin/rails server`.

### Fixing TailwindCSS in Production

When deploying to Railway, you may encounter this error:

```
sh: 1: watchman: not found
Bun v1.2.20 (Linux x64 baseline)
    path: "/rails/app/assets/builds/tailwind.css",
    code: "EACCES"
 syscall: "open",
   errno: -13,
```

This happens because the compiled CSS file isn't available in production. The TailwindCSS watcher can't run during deployment due to file permission restrictions.

**The solution**: Precompile your assets before deployment.

Choose one of these two approaches:

**Option 1: Precompile in Dockerfile**

Add this line to your `Dockerfile` before the final `FROM base` stage (usually after building dependencies but before copying to the final image):

```dockerfile
RUN SECRET_KEY_BASE_DUMMY=1 ./bin/rails assets:precompile
```

This compiles your TailwindCSS during the Docker build process.

**Option 2: Precompile via railway.json**

Add a `preDeployCommand` to your `railway.json` file:

```json
{
  "$schema": "https://railway.com/railway.schema.json",
  "deploy": {
    "preDeployCommand": "bundle exec rails db:prepare && bundle exec rails assets:precompile"
  }
}
```

This runs asset compilation automatically before each deployment.

**Recommendation**: Option 1 (Dockerfile) is generally preferred because it includes compiled assets in your Docker image, making deployments faster and more reliable.

## Setting up SolidQueue

[SolidQueue](https://github.com/rails/solid_queue) is a database-backed queuing backend for Active Job. Unlike Sidekiq,
it doesn't require Redis or any additional infrastructure beyond your existing database.
This makes it an excellent choice for simplifying your deployment architecture.
For complete installation instructions, refer to the [official SolidQueue documentation](https://github.com/rails/solid_queue?tab=readme-ov-file#installation).

### Deployment Options

SolidQueue can be configured in three different ways on Railway:

#### Option 1: Separate Database (Recommended for High Volume)

Use a dedicated PostgreSQL database for SolidQueue jobs. This isolates job processing from your application data.

Setup steps:
1. Create a new service for SolidQueue (similar to the Sidekiq worker service)
2. Add a separate PostgreSQL database service
3. Connect the SolidQueue service to this database
4. Set the database URL in your SolidQueue service environment variables

This approach is identical to the [Sidekiq setup](#set-up-workers--cron-jobs-with-sidekiq), but you'll use `bin/jobs` instead of `bundle exec sidekiq` as your start command.

#### Option 2: Single Database Mode (Recommended for Most Apps)

Share your existing PostgreSQL database between your main app and SolidQueue. This is simpler and works well for most applications.

Setup steps:
1. Follow the [single database configuration guide](https://github.com/rails/solid_queue?tab=readme-ov-file#single-database-configuration)
2. Create a new empty service in your Railway project
3. Connect it to the same PostgreSQL database your main app uses
4. Set the start command to `bin/jobs`

**Note**: To use the `bin/jobs` command with a shared `railway.json` configuration file, see the [Using the same railway.json for multiple services](#using-the-same-railway-json-for-multiple-services) section.

#### Option 3: Run Within Puma (Simplest Setup)

Run SolidQueue in the same process as your main Rails application. This is the simplest option and requires no additional services.

Add this line to your `config/puma.rb` file:

```ruby
plugin :solid_queue
```

This starts SolidQueue automatically when Puma boots, similar to the TailwindCSS plugin.

**Trade-off**: While this is the easiest setup, running jobs in the same process as your web server can impact request performance under heavy job loads.
For production apps with significant background processing, consider using a separate service (Options 1 or 2).

## Using the same railway.json for multiple services

When running multiple services from the same repository (e.g., a web server and a worker service), you may encounter conflicts with the `startCommand` setting in `railway.json`.

### The Problem

If your `railway.json` specifies a start command like `bundle exec rails server`, every service will try to use that command.
This prevents worker services from running their own commands like `bundle exec sidekiq` or `bin/jobs`.

### The Solution

Remove the `startCommand` from your `railway.json` file and configure it individually for each service instead.

**Steps:**

1. Remove any `startCommand` entries from your `railway.json` file
2. For each service, manually set the start command in the Railway dashboard:
  - Go to the service's **Settings** tab
  - Navigate to the **Deploy** section
  - Set the **Custom Start Command**

This approach is explained in detail in step 3 of [Set Up Workers & Cron Jobs with Sidekiq](#set-up-workers--cron-jobs-with-sidekiq).

### Example Configuration

You can still use `railway.json` for shared settings like build configuration and pre-deploy commands.
Here's a recommended configuration that works across multiple services:

```json
{
  "$schema": "https://railway.com/railway.schema.json",
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "Dockerfile"
  },
  "deploy": {
    "preDeployCommand": "bundle exec rails db:prepare"
  }
}
```

**What this does:**

- `build`: Tells Railway to use your Dockerfile for all services
- `preDeployCommand`: Runs database migrations before deployment (useful for both web and worker services)
- No `startCommand`: Allows each service to define its own start command

**Service-specific start commands** (set in Railway dashboard):

- **Web Service**: `bin/rails server -b ::`
- **Worker Service (Sidekiq)**: `bundle exec sidekiq`
- **Worker Service (SolidQueue)**: `bin/jobs`

This setup gives you the flexibility to run different processes from the same codebase while sharing common configuration.

Explore these resources to learn how you can maximize your experience with Railway:

- [Monitoring](/guides/monitoring)
- [Deployments](/guides/deployments)