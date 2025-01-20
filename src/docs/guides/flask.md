---
title: Deploy a Flask App
description: Learn how to deploy a Flask app to Railway with this step-by-step guide. It covers quick setup, one-click deploys, Dockerfile and other deployment strategies.
---

[Flask](https://flask.palletsprojects.com/en/stable) is a Python micro framework for building web applications.

This guide covers how to deploy a Flask app to Railway in four ways:

1. [One-click deploy from a template](#one-click-deploy-from-a-template).
2. [Using the CLI](#deploy-from-the-cli).
3. [From a GitHub repository](#deploy-from-a-github-repo).
4. [Using a Dockerfile](#use-a-dockerfile).

Now, let's create a Flask app!

## Create a Flask App

**Note:** If you already have a Flask app locally or on GitHub, you can skip this step and go straight to the [Deploy Flask App to Railway](#deploy-flask-app-to-railway).

To create a new Flask app, ensure that you have [Python](https://www.python.org/downloads) and [Flask](https://flask.palletsprojects.com/en/stable/installation/#install-flask) installed on your machine.

Follow the steps blow to set up the project in a directory.

Create a project directory and `cd` into it.

```bash
mkdir flaskproject
cd flaskproject
````

Create a virtual environment
```bash
python -m venv env
```

Activate the virtual environment
```bash
source env/bin/activate
```

**Note:** For windows developers, run it as `env\Scripts\activate` in your terminal.

Install Flask
```bash
python -m pip install flask
```

Now create a new file, `helloworld.py` in the `flaskproject` directory. Add the following content to it:

```python
import os
from flask import Flask

app = Flask(__name__)


@app.route('/')
def hello():
    return 'Hello world, welcome to Railway!'
```

1. `from flask import Flask`: 
    - This line imports the Flask class from the Flask framework, which is used to create and manage a web application.
2. `app = Flask(__name__)`: 
    - This line creates an instance of the Flask class and assigns it to the app variable.
    - The `__name__` argument helps Flask identify the location of the application. It's useful for determining resource paths and error reporting.
3. `@app.route('/')`:
    - The `@app.route('/')` decorator sets up a URL route for the app. When the root URL `(/)` is accessed, Flask will execute the function immediately below this decorator.
4. `def hello():`
    - The `hello` function returns a plain text message, _"Hello world, welcome to Railway!"_, which is displayed in the browser when the root URL of the app is accessed.


### Run the Flask App Locally

To run the application, use the `flask` command.

```bash
flask --app helloworld run
```

Open your browser and go to `http://127.0.0.1:5000` to see the app running with a local development server.

### Prepare the Flask App for Deployment

1. Run the following command to install a production web server, [gunicorn](https://gunicorn.org):

```bash
pip install gunicorn
```

Next, run the following command to serve the app with gunicorn:

```bash
gunicorn main:app
```

2. Open your browser and go to `http://127.0.0.1:8000` to see the app running with a production server.

Create a `requirements.txt` file to store the dependencies of the packages needed to run the app. 

```bash
pip freeze > requirements.txt
```

**Note:** It's only safe to run the command above in a virtual environment, else it will freeze all python packages installed on your system. 

3. Finally, create a `nixpacks.toml` file in the root directory of the app. Add the following content to it:

```toml
# nixpacks.toml

[start]
cmd = "gunicorn main:app"
```

This setup instructs Railway to use Gunicorn as the server to start the application.

**Note:** The [nixpacks.toml file](https://nixpacks.com/docs/configuration/file) is a configuration file used by Nixpacks, a build system developed and used by Railway, to set up and deploy applications. 

In this file, you can specify the instructions for various build and deployment phases, along with environment variables and package dependencies.

With these changes, your Flask app is now ready to be deployed to Railway!

## Deploy Flask App to Railway

Railway offers multiple ways to deploy your Flask app, depending on your setup and preference. Choose any of the following methods:

1. [One-click deploy from a template](#one-click-deploy-from-a-template).
2. [Using the CLI](#deploy-from-the-cli).
3. [From a GitHub repository](#deploy-from-a-github-repo).

## One-Click Deploy From a Template

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/template/zUcpux)

We highly recommend that [you eject from the template after deployment](/guides/deploy#eject-from-template-repository) to create a copy of the repo on your GitHub account.

**Note:** You can also choose from a <a href="https://railway.com/templates?q=flask" target="_blank">variety of Flask app templates</a> created by the community.

## Deploy From the CLI

1. **Install the Railway CLI**:
    - <a href="/guides/cli#installing-the-cli" target="_blank">Install the CLI</a> and <a href="/guides/cli#authenticating-with-the-cli" target="_blank">authenticate it</a> using your Railway account.
2. **Initialize a Railway Project**:
    - Run the command below in your Flask app directory. 
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
4. **Verify the Deployment**:
    - Once the deployment completes, go to [**View logs**](/guides/logs#build--deploy-panel) to check if the server is running successfully.
6. **Set Up a Public URL**:
    - Navigate to the **Networking** section under the [Settings](/overview/the-basics#service-settings) tab of your new service.
    - Click [Generate Domain](/guides/public-networking#railway-provided-domain) to create a public URL for your app.

<Image src="https://res.cloudinary.com/railway/image/upload/f_auto,q_auto/v1730473731/docs/quick-start/flask_app_on_railway.png"
alt="screenshot of the deployed Flask service"
layout="responsive"
width={2164} height={1814} quality={100} />

## Deploy From a GitHub Repo

To deploy a Flask app to Railway directly from GitHub, follow the steps below:

1. **Create a New Project on Railway**:
    - Go to <a href="https://railway.com/new" target="_blank">Railway</a> to create a new project.
2. **Deploy from GitHub**: 
    - Select **Deploy from GitHub repo** and choose your repository.
        - If your Railway account isn’t linked to GitHub yet, you’ll be prompted to do so.
3. **Deploy the App Service**:
    - Click **Deploy** on the Railway project canvas to apply your changes.
4. **Verify the Deployment**:
    - Once the deployment completes, go to [**View logs**](/guides/logs#build--deploy-panel) to check if the server is running successfully.

    **Note:** During the deployment process, Railway will automatically [detect that it’s a Python app](https://nixpacks.com/docs/providers/python).
5. **Set Up a Public URL**:
    - Navigate to the **Networking** section under the [Settings](/overview/the-basics#service-settings) tab of your new service.
    - Click [Generate Domain](/guides/public-networking#railway-provided-domain) to create a public URL for your app.

## Use a Dockerfile

1. Create a `Dockerfile` in the app's root directory.
2. Add the content below to the `Dockerfile`:
    ```docker
    # Use the Python 3 official image
    # https://hub.docker.com/_/python
    FROM python:3

    # Run in unbuffered mode
    ENV PYTHONUNBUFFERED=1 

    # Create and change to the app directory.
    WORKDIR /app

    # Copy local code to the container image.
    COPY . ./

    # Install project dependencies
    RUN pip install --no-cache-dir -r requirements.txt

    # Run the web service on container startup.
    CMD ["gunicorn", "main:app"]
    ```
3. Either deploy via the CLI or from GitHub.

Railway automatically detects the `Dockerfile`, [and uses it to build and deploy the app.](/guides/dockerfiles)

**Note:** Railway supports also <a href="/guides/services#deploying-a-public-docker-image" target="_blank">deployment from public and private Docker images</a>.

## Next Steps

Explore these resources to learn how you can maximize your experience with Railway:

- [Add a Database Service](/guides/build-a-database-service)
- [Monitor your app](/guides/monitoring)
- [Running a Cron Job](/guides/cron-jobs)

