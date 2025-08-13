---
title: Deploy a Rust Rocket App
description: Learn how to deploy a Rust Rocket app to Railway with this step-by-step guide. It covers quick setup, one-click deploys, Dockerfile and other deployment strategies.
---

[Rocket](https://rocket.rs) is a web framework for Rust that makes it simple to write fast, type-safe, secure web applications with incredible usability, productivity and performance.

This guide covers how to deploy a Rocket app to Railway in four ways:

1. [One-click deploy from a template](#one-click-deploy-from-a-template).
2. [From a GitHub repository](#deploy-from-a-github-repo).
3. [Using the CLI](#deploy-from-the-cli).
4. [Using a Dockerfile](#use-a-dockerfile).

Now, let's create a Rocket app! 🚀

## Create a Rocket App

**Note:** If you already have a Rocket app locally or on GitHub, you can skip this step and go straight to the [Deploy Rocket App to Railway](#deploy-the-rocket-app-to-railway).

To create a new Rocket app, ensure that you have [Rust](https://www.rust-lang.org/tools/install) installed on your machine.

Run the following command in your terminal to create a new Rust app:

```bash
cargo new helloworld --bin
```

The command creates a new binary-based Cargo project in a `helloworld` directory.

Next, `cd` into the directory and add Rocket as a dependency by running the following command:

```bash
cargo add rocket
```

This will add Rocket as a dependency, and you’ll see it listed in your `Cargo.toml` file.

### Modify the Application File

Next, open the app in your IDE and navigate to the `src/main.rs` file.

Replace the content with the code below:

```rust
#[macro_use]
extern crate rocket;

#[get("/")]
fn index() -> &'static str {
    "Hello world, Rocket!"
}

#[launch]
fn rocket() -> _ {
    rocket::build().mount("/", routes![index])
}
```

The code above uses the Rocket framework to create a basic web server that responds to HTTP requests. It defines a simple route using the `#[get("/")]` macro, which tells Rocket to handle GET requests to the root URL `(/)`.

The `index()` function is the handler for this route and returns a static string, **"Hello world, Rocket!"**, which will be sent as the response when the root URL is accessed.

The `#[launch]` attribute on the `rocket()` function marks it as the entry point to launch the application. Inside `rocket()`, the server is built with `rocket::build()` and the index route is mounted to the root path `/` using `mount()`.

When the application runs, it listens for incoming requests and serves the "Hello world, Rocket!" response for requests made to the root URL, demonstrating a simple routing and response mechanism in Rocket.

### Run the Rocket App locally

Run the following command in the `helloworld` directory via the terminal:

```bash
cargo run
```

All the dependencies will be installed and your app will be launched.

Open your browser and go to `http://localhost:8000` to see your app.

## Deploy the Rocket App to Railway

Railway offers multiple ways to deploy your Rocket app, depending on your setup and preference.

### One-Click Deploy from a Template

If you’re looking for the fastest way to get started, the one-click deploy option is ideal.

Click the button below to begin:

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/new/template/FkW8oU)

We highly recommend that [you eject from the template after deployment](/guides/deploy#eject-from-template-repository) to create a copy of the repo on your GitHub account.

**Note:** You can also choose from a <a href="https://railway.com/templates?q=rocket" target="_blank">variety of Rocket templates</a> created by the community.

### Deploy from the CLI

1. **Install the Railway CLI**:
   - <a href="/guides/cli#installing-the-cli" target="_blank">Install the CLI</a> and <a href="/guides/cli#authenticating-with-the-cli" target="_blank">authenticate it</a> using your Railway account.
2. **Initialize a Railway Project**:
   - Run the command below in your Rocket app directory.
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
4. **Set Up a Public URL**:

   - Navigate to the **Networking** section under the [Settings](/overview/the-basics#service-settings) tab of your new service.
   - Click [Generate Domain](/guides/public-networking#railway-provided-domain) to create a public URL for your app.

   **Note:** You'll come across a 502 error where your application doesn't respond. We'll fix that in the next step.

5. **Configure Rocket app to accept non-local connections**:
   - Rocket apps need to be configured to accept external connections by listening on the correct address, which is typically `0.0.0.0`. You can easily do this by setting the address through the environment variable.
     Run the following command to set the Rocket address to `0.0.0.0`:
     `bash
    railway variables --set "ROCKET_ADDRESS=0.0.0.0"
    `
6. **Redeploy the Service**:
   - Run `railway up` again to trigger a redeployment of the service.
7. **Verify the Deployment**:
   - Once the deployment completes, go to **View logs** to check if the server is running successfully. Access your public URL again and you should see your app working well.

<Image src="https://res.cloudinary.com/railway/image/upload/f_auto,q_auto/v1729858389/docs/quick-start/rocket_app_service.png"
alt="screenshot of the deployed Rocket service"
layout="responsive"
width={2038} height={1698} quality={100} />

### Deploy from a GitHub Repo

To deploy a Rocket app to Railway directly from GitHub, follow the steps below:

1. **Create a New Project on Railway**:
   - Go to <a href="https://railway.com/new" target="_blank">Railway</a> to create a new project.
2. **Deploy from GitHub**:
   - Select **Deploy from GitHub repo** and choose your repository.
     - If your Railway account isn’t linked to GitHub yet, you’ll be prompted to do so.
3. **Add Environment Variables**:
   - Click **Add Variables**, then add `ROCKET_ADDRESS` with the value `0.0.0.0`. This allows your Rocket app to accept external connections by listening on `0.0.0.0`.
4. **Deploy the App**:
   - Click **Deploy** to start the deployment process.
   - Once the deployed, a Railway [service](/guides/services) will be created for your app, but it won’t be publicly accessible by default.
5. **Verify the Deployment**:

   - Once the deployment completes, go to **View logs** to check if the server is running successfully.

   **Note:** During the deployment process, Railway will automatically [detect that it’s a Rust app](https://nixpacks.com/docs/providers/rust).

6. **Set Up a Public URL**:
   - Navigate to the **Networking** section under the [Settings](/overview/the-basics#service-settings) tab of your new service.
   - Click [Generate Domain](/guides/public-networking#railway-provided-domain) to create a public URL for your app.

### Use a Dockerfile

1. Create a `Dockerfile` in the `helloworld` or Rocket app's root directory.
2. Add the content below to the `Dockerfile`:

   ```docker
   FROM lukemathwalker/cargo-chef:latest-rust-1 AS chef

   # Create and change to the app directory.
   WORKDIR /app

   FROM chef AS planner
   COPY . ./
   RUN cargo chef prepare --recipe-path recipe.json

   FROM chef AS builder
   COPY --from=planner /app/recipe.json recipe.json

   # Build dependencies - this is the caching Docker layer!
   RUN cargo chef cook --release --recipe-path recipe.json

   # Build application
   COPY . ./
   RUN cargo build --release

   CMD ["./target/release/helloworld"]
   ```

3. Either deploy via the CLI or from GitHub.

Railway automatically detects the `Dockerfile`, [and uses it to build and deploy the app.](/guides/dockerfiles)

**Note:** Railway supports also <a href="/guides/services#deploying-a-public-docker-image" target="_blank">deployment from public and private Docker images</a>.

This guide covers the main deployment options on Railway. Choose the approach that suits your setup, and start deploying your Rocket apps seamlessly!

## Next Steps

Explore these resources to learn how you can maximize your experience with Railway:

- [Add a Database Service](/guides/build-a-database-service)
- [Monitor your app](/guides/monitoring)
