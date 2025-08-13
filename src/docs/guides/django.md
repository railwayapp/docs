---
title: Deploy a Django App
description: Learn how to deploy a Python Django app to Railway with this step-by-step guide. It covers quick setup, database integration, private networking, Celery, one-click deploys and other deployment strategies.
---

[Django](https://www.djangoproject.com) is a powerful Python web framework that simplifies web development by providing ready-to-use tools for rapid development and clean design.

It’s free, open-source, and comes with a range of features to streamline tasks like authentication, routing, and database management, so developers can focus on building their applications without handling everything from scratch.

## Create a Django App

**Note:** If you already have a Django app locally or on GitHub, you can skip this step and go straight to the [Deploy Django App on Railway](#deploy-django-app-on-railway).

To create a new Django app, ensure that you have [Python](https://www.python.org/downloads/) and [Django](https://docs.djangoproject.com/en/5.1/intro/install/) installed on your machine.

Follow the steps below to set up the project in a directory.

Create a virtual environment

```bash
python -m venv env
```

Activate the virtual environment

```bash
source env/bin/activate
```

**Note:** For windows developers, run it as `env\Scripts\activate` in your terminal.

Install Django

```bash
python -m pip install django
```

Once everything is set up, run the following command in your terminal to provision a new Django project:

```bash
django-admin startproject liftoff
```

This command will create a new Django project named `liftoff`.

Next, `cd` into the directory and run `python manage.py runserver` to start your project.

Open your browser and go to `http://127.0.0.1:8000` to see the project. You'll see the Django welcome page with a "The install worked successfully! Congratulations!" paragraph.

**Note:** You'll see a red notice about unapplied migration(s). You can ignore them for now. We'll run them when we deploy the project.

Now that your app is running locally, let’s move on to make some changes and install some dependencies before deployment.

## Configure Database, Static Files & Dependencies

1. Install the following packages within the `liftoff` directory, where you can see the `manage.py` file.

```bash
python -m pip install gunicorn whitenoise psycopg[binary,pool]
```

[whitenoise](https://whitenoise.readthedocs.io/en/stable/index.html) is a Python package for serving static files directly from your web app. It serves compressed content and sets far-future cache headers on content that won't change.

[gunicorn](https://gunicorn.org) is a production ready web server.

[pyscog](https://www.psycopg.org/psycopg3/docs) is python package that allows Django work with Postgresql.

2. Import the `os` module:

Open the `liftoff/settings.py` file located in the inner `liftoff` directory (the one containing the main project settings).

At the top of the file, add the following line to import the `os` module, placing it just before the `Path` import:

```python
import os
from pathlib import Path
```

3. Configure the database and run migrations:

A fresh Django project uses SQLite by default, but we need to switch to PostgreSQL.

Create a database named `liftoff_dev` in your local Postgres instance.

Open the `liftoff/settings.py` file. In the Database section, replace the existing configuration with:

```python

# Database
# https://docs.djangoproject.com/en/5.1/ref/settings/#databases

# Set default values for the environment variables if they’re not already set
os.environ.setdefault("PGDATABASE", "liftoff_dev")
os.environ.setdefault("PGUSER", "username")
os.environ.setdefault("PGPASSWORD", "")
os.environ.setdefault("PGHOST", "localhost")
os.environ.setdefault("PGPORT", "5432")

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ["PGDATABASE"],
        'USER': os.environ["PGUSER"],
        'PASSWORD': os.environ["PGPASSWORD"],
        'HOST': os.environ["PGHOST"],
        'PORT': os.environ["PGPORT"],
    }
}
```

Replace the values of `PGUSER`, `PGPASSWORD` with your local credentials.

Run `python manage.py migrate` in your terminal to apply the database migrations. Once it completes successfully, check your database. You should see the auth and other Django tables created.

4. Static files configuration:

We'll configure Django to serve static files using [WhiteNoise](https://whitenoise.readthedocs.io/en/stable/index.html).

Open `liftoff/settings.py` and configure the static files settings:

```python
STATIC_URL = 'static/'

STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")
STATICFILES_DIRS = [os.path.join(BASE_DIR, "static")]
```

Add the WhiteNoise middleware in the **MIDDLEWARE** section, just below the [security middleware](https://docs.djangoproject.com/en/5.1/ref/middleware/#module-django.middleware.security):

```python
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]
```

5. Update `ALLOWED_HOSTS` settings:

```python
ALLOWED_HOSTS = ["*"]
```

This setting represents the list of all the host/domain names our Django project can serve.

6. Create a **static** folder:

Inside your `liftoff` directory, create a static folder where all static assets will reside.

7. Create a `requirements.txt` file:

To track all the dependencies for deployment, create a `requirements.txt` file:

```bash
pip freeze > requirements.txt
```

**Note:** It's only safe to run the command above in a virtual environment, else it will freeze all python packages installed on your system.

With these changes, your Django app is now ready to be deployed to Railway!

## Deploy Django App on Railway

Railway offers multiple ways to deploy your Django app, depending on your setup and preference. Choose any of the following methods:

1. [One-click deploy from a template](#one-click-deploy-from-a-template).
2. [Using the CLI](#deploy-from-the-cli).
3. [From a GitHub repository](#deploy-from-a-github-repo).

## One-Click Deploy From a Template

If you’re looking for the fastest way to get started, the one-click deploy option is ideal. It sets up a Django app along with a Postgres database.

Click the button below to begin:

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/new/template/GB6Eki)

After deploying, we recommend that you [eject from the template](/guides/deploy#eject-from-template-repository) to create a copy of the repository under your own GitHub account. This will give you full control over the source code and project.

## Deploy From the CLI

To deploy the Django app using the Railway CLI, please follow the steps:

1. **Install the Railway CLI**:
   - <a href="/guides/cli#installing-the-cli" target="_blank">Install the CLI</a> and <a href="/guides/cli#authenticating-with-the-cli" target="_blank">authenticate it</a> using your Railway account.
2. **Initialize a Railway Project**:
   - Run the command below in your Django app directory.
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

   **Note:** You'll encounter an error about the PGDATABASE environment not set. Don't worry, we'll fix that in the next steps.

4. **Add a Database Service**:
   - Run `railway add`.
   - Select `PostgreSQL` by pressing space and hit **Enter** to add it to your project.
   - A database service will be added to your Railway project.
5. **Configure Environment Variables**:
   - Go to your app service <a href="/overview/the-basics#service-variables">**Variables**</a> section and add the following:
     - `PGDATABASE`: Set the value to `${{Postgres.PGDATABASE}}` (this references the Postgres database name). Learn more about [referencing service variables](/guides/variables#referencing-another-services-variable).
     - `PGUSER`: Set the value to `${{Postgres.PGUSER}}`
     - `PGPASSWORD`: Set the value to `${{Postgres.PGPASSWORD}}`
     - `PGHOST`: Set the value to `${{Postgres.PGHOST}}`
     - `PGPORT`: Set the value to `${{Postgres.PGPORT}}`
   - Use the **Raw Editor** to add any other required environment variables in one go.
6. **Redeploy the App Service**:
   - Click **Deploy** on the app service on the Railway dashboard to apply your changes.
7. **Verify the Deployment**:
   - Once the deployment completes, go to **View logs** to check if the server is running successfully.
8. **Set Up a Public URL**:
   - Navigate to the **Networking** section under the [Settings](/overview/the-basics#service-settings) tab of your new service.
   - Click [Generate Domain](/guides/public-networking#railway-provided-domain) to create a public URL for your app.

<Image src="https://res.cloudinary.com/railway/image/upload/v1729121823/docs/quick-start/django_app.png"
alt="screenshot of the deployed Django project"
layout="responsive"
width={2783} height={2135} quality={100} />

## Deploy From a GitHub Repo

To deploy the Django app to Railway, start by pushing the app to a GitHub repo. Once that’s set up, follow the steps below to complete the deployment process.

1. **Create a New Project on Railway**:
   - Go to <a href="https://railway.com/new" target="_blank">Railway</a> to create a new project.
2. **Deploy from GitHub**:
   - Select **Deploy from GitHub repo** and choose your repository.
     - If your Railway account isn’t linked to GitHub yet, you’ll be prompted to do so.
3. **Add Environment Variables**:

   - Click **Add Variables** and configure all the necessary environment variables for your app.
     - `PGDATABASE`: Set the value to `${{Postgres.PGDATABASE}}` (this references the Postgres database name). Learn more about [referencing service variables](/guides/variables#referencing-another-services-variable).
     - `PGUSER`: Set the value to `${{Postgres.PGUSER}}`
     - `PGPASSWORD`: Set the value to `${{Postgres.PGPASSWORD}}`
     - `PGHOST`: Set the value to `${{Postgres.PGHOST}}`
     - `PGPORT`: Set the value to `${{Postgres.PGPORT}}`

   **Note:** We don't have the Postgres Database service yet. We'll add that soon.

4. **Add a Database Service**:
   - Right-click on the Railway project canvas or click the **Create** button.
   - Select **Database**.
   - Select **Add PostgreSQL** from the available databases.
     - This will create and deploy a new Postgres database service for your project.
5. **Deploy the App**:
   - Click **Deploy** to start the deployment process and apply all changes.
   - Once deployed, a Railway [service](/guides/services) will be created for your app, but it won’t be publicly accessible by default.
6. **Verify the Deployment**:

   - Once the deployment completes, go to **View logs** to check if the server is running successfully.

   **Note:** During the deployment process, Railway will automatically [detect that it’s a Django app](https://nixpacks.com/docs/providers/python).

7. **Set Up a Public URL**:
   - Navigate to the **Networking** section under the [Settings](/overview/the-basics#service-settings) tab of your new service.
   - Click [Generate Domain](/guides/public-networking#railway-provided-domain) to create a public URL for your app.

This guide covers the main deployment options on Railway. Choose the approach that suits your setup, and start deploying your Django apps effortlessly!

**Note:** The next step shows how to configure and run your Django app along with Celery and Celery beat.

## Set Up Database, Migrations, Celery Beat and Celery

This setup deploys your Django app on Railway, ensuring that your database, scheduled tasks (crons)--Celery Beat, and queue workers (Celery) are all fully operational.

The deployment structure follows a "majestic monolith" architecture, where the entire Django app is managed as a single codebase but split into four separate services on Railway:

- **App Service**: Handles HTTP requests and user interactions.
- **Cron Service**: Manages scheduled tasks (e.g., sending emails or running reports) using Celery Beat.
- **Worker Service**: Processes background jobs from the queue using Celery.
- **Database Service**: Stores and retrieves your application's data.

<Image src="https://res.cloudinary.com/railway/image/upload/v1731604331/docs/quick-start/deployed_django_app_architecture.png"
alt="screenshot of the deploy architecture of the Django app"
layout="responsive"
width={3237} height={1951} quality={100} />
_My Monolith Django app_

**Note:** This guide follows the assumption that you have installed Celery and Celery Beat in your app, the broker uses Redis and you already have a Postgres database service provisioned for your app as shown earlier.

Please follow these steps to get it setup on Railway:

1. Create a Redis Database service on the <a href="/overview/the-basics#project--project-canvas" target="_blank">Project Canvas</a> by clicking the **Create** button. Then select **Database** and choose **Add Redis**.
   - Click on **Deploy**.
2. Create a new service on the <a href="/overview/the-basics#project--project-canvas" target="_blank">Project Canvas</a> by clicking the **Create** button. Then select **Empty service**.
   - Name the service **App Service**, and click on <a href="/overview/the-basics#service-settings">**Settings**</a> to configure it.
     - **Note:** If you followed the guide from the beginning, simply rename the existing service to **App Service**.
   - Connect your GitHub repo to the **Source Repo** in the **Source** section.
   - Go to the top of the service and click on <a href="/overview/the-basics#service-variables">**Variables**</a>.
   - Add all the necessary environment variables required for the Django app especially the ones listed below.
     - `REDIS_URL`: Set the value to `${{Postgres.REDIS_URL}}`
     - `PGUSER`: Set the value to `${{Postgres.PGUSER}}`
     - `PGPASSWORD`: Set the value to `${{Postgres.PGPASSWORD}}`
     - `PGHOST`: Set the value to `${{Postgres.PGHOST}}`
     - `PGPORT`: Set the value to `${{Postgres.PGPORT}}`
     - `PGDATABASE`: Set the value to `${{Postgres.PGDATABASE}}` (this references the Postgres database name). Learn more about [referencing service variables](/guides/variables#referencing-another-services-variable).
   - Click **Deploy**.
3. Create a new service on the <a href="/overview/the-basics#project--project-canvas" target="_blank">Project Canvas</a> by clicking the **Create** button. Then select **Empty service**.
   - Name the service **Cron Service**, and click on <a href="/overview/the-basics#service-settings">**Settings**</a>.
   - Connect your GitHub repo to the **Source Repo** in the **Source** section.
   - Add `celery -A liftoff beat -l info --concurrency=3` to the <a href="/guides/start-command">**Custom Start Command**</a> in the **Deploy** section.
     - _Note:_ `liftoff` is the name of the app. You can find the app name in your Django project’s main folder, typically in the directory containing `settings.py`.
     - The `--concurrency=3` option here means it can process up to 3 tasks in parallel. You can adjust the [concurrency level](https://docs.celeryq.dev/en/latest/userguide/workers.html#concurrency) based on your system resources. The higher the level, the more memory and resources it consumes.
   - Head back to the top of the service and click on <a href="/overview/the-basics#service-variables">**Variables**</a>.
   - Add all the necessary environment variables especially those highlighted already in step 2.
   - Click **Deploy**.
4. Create a new service again on the <a href="/overview/the-basics#project--project-canvas" target="_blank">Project Canvas</a>.
   - Name the service **Worker Service**, and click on <a href="/overview/the-basics#service-settings">**Settings**</a>.
   - Connect your GitHub repo to the **Source Repo** in the **Source** section.
   - Add `celery -A liftoff worker -l info --concurrency=3` to the <a href="/guides/start-command">**Custom Start Command**</a> in the **Deploy** section.
     - _Note:_ `liftoff` is the name of the app. You can find the app name in your Django project’s main folder, typically in the directory containing `settings.py`.
     - The `--concurrency=3` option here means it can process up to 3 tasks in parallel. You can adjust the [concurrency level](https://docs.celeryq.dev/en/latest/userguide/workers.html#concurrency) based on your system resources. The higher the level, the more memory and resources it consumes.
   - Head back to the top of the service and click on <a href="/overview/the-basics#service-variables">**Variables**</a>.
   - Add all the necessary environment variables especially those highlighted already in step 2.
   - Click **Deploy**.

At this point, you should have all services deployed and connected to the Postgres and Redis Database service:

<Image src="https://res.cloudinary.com/railway/image/upload/f_auto,q_auto/v1731604331/docs/quick-start/deployed_django_app_architecture.png"
alt="screenshot of the deploy architecture of the Django app"
layout="responsive"
width={3237} height={1951} quality={100} />

- **Cron Service**: This service should run Celery Beat Scheduler to manage scheduled tasks.

<Image src="https://res.cloudinary.com/railway/image/upload/f_auto,q_auto/v1731605926/docs/quick-start/django_cron_service.png"
alt="screenshot of the cron service of the Django app"
layout="responsive"
width={2766} height={2056} quality={100} />

- **Worker Service**: This service should be running Celery and ready to process jobs from the queue.

<Image src="https://res.cloudinary.com/railway/image/upload/f_auto,q_auto/v1731605981/docs/quick-start/django_worker_service.png"
alt="screenshot of the worker service of the Django app"
layout="responsive"

width={2752} height={2094} quality={100} />

- **App Service**: This service should be running and is the only one that should have a public domain, allowing users to access your application.

**Note:** There is a [community template](https://railway.com/template/yZDfUu) available that demonstrates this deployment approach. You can easily deploy this template and then connect it to your own GitHub repository for your application.

## Next Steps

Explore these resources to learn how you can maximize your experience with Railway:

- [Monitoring](/guides/monitoring)
- [Deployments](/guides/deployments)
