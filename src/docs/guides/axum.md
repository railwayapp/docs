---
title: Deploy a Rust Axum App
description: Learn how to deploy an Axum app to Railway with this step-by-step guide. It covers quick setup, one-click deploys, GitHub, Dockerfile and other deployment strategies.
---

[Axum](https://docs.rs/axum/latest/axum) is a web framework for Rust that focuses on ergonomics and modularity. It is designed to work with [tokio](https://docs.rs/tokio/1.40.0/x86_64-unknown-linux-gnu/tokio/index.html) and [hyper](https://docs.rs/hyper/1.4.1/x86_64-unknown-linux-gnu/hyper/index.html).

This guide covers how to deploy an Axum app to Railway in four ways:

1. [One-click deploy from a template](#one-click-deploy-from-a-template).
2. [From a GitHub repository](#deploy-from-a-github-repo).
3. [Using the CLI](#deploy-from-the-cli).
4. [Using a Dockerfile](#use-a-dockerfile).

Now, let's create an Axum app! 🚀

## Create an Axum App

**Note:** If you already have an Axum app locally or on GitHub, you can skip this step and go straight to the [Deploy Axum App to Railway](#deploy-the-axum-app-to-railway).

To create a new Axum app, ensure that you have [Rust](https://www.rust-lang.org/tools/install) installed on your machine.

Run the following command in your terminal to create a new Axum app:

```bash
cargo new helloworld --bin
```

The command creates a new binary-based Cargo project in a `helloworld` directory.

Next, `cd` into the directory and add `axum` and `tokio` as dependencies by running the following command:

```bash
cargo add axum
cargo add tokio --features full
```

This will add `axum` and `tokio` as dependencies, with `tokio` configured to use the "full" feature, which includes its complete set of capabilities. You’ll find both dependencies listed in your `Cargo.toml` file.

These dependencies are required to create a bare minimum axum application.

### Modify the Application File

Next, open the app in your IDE and navigate to the `src/main.rs` file.

Replace the content with the code below:

```rust
use axum::{
    routing::get,
    Router,
};

#[tokio::main]
async fn main() {
    // build our application with a single route
    let app = Router::new().route("/", get(root));

    // Get the port number from the environment, default to 3000
    let port: u16 = std::env::var("PORT")
        .unwrap_or_else(|_| "3000".to_string()) // Get the port as a string or default to "3000"
        .parse() // Parse the port string into a u16
        .expect("Failed to parse PORT");

    // Create a socket address (IPv6 binding)
    let address = SocketAddr::from(([0, 0, 0, 0, 0, 0, 0, 0], port));
    let listener = tokio::net::TcpListener::bind(&address).await.unwrap();

    // Run the app with hyper, listening on the specified address
    axum::serve(listener, app).await.unwrap();
}

// basic handler that responds with a static string
async fn root() -> &'static str {
    "Hello World, from Axum!"
}
```

The code above sets up a simple web server using the Axum framework and the Tokio async runtime. The server listens on the port gotten from the environment variable, `PORT` and defaults to `3000` if there's none set. 

It defines one route, `/`, which is mapped to a handler function called `root`. When a GET request is made to the root path, the handler responds with the static string "Hello World, from Axum!". 

The Router from Axum is used to configure the route, and `tokio::net::TcpListener` binds the server to listen for connections on all available network interfaces (address `0.0.0.0`).

The asynchronous runtime, provided by the `#[tokio::main]` macro, ensures the server can handle requests efficiently. The `axum::serve` function integrates with the Hyper server to actually process requests.

### Run the Axum App Locally

Run the following command in the `helloworld` directory via the terminal:

```bash
cargo run
```

All the dependencies will be installed and your app will be launched.

Open your browser and go to `http://localhost:3000` to see your app.

## Deploy the Axum App to Railway

Railway offers multiple ways to deploy your Axum app, depending on your setup and preference. 

### One-Click Deploy From a Template

If you’re looking for the fastest way to get started, the one-click deploy option is ideal. 

Click the button below to begin:

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/new/template/5HAMxu)

We highly recommend that [you eject from the template after deployment](/guides/deploy#eject-from-template-repository) to create a copy of the repo on your GitHub account.

**Note:** You can also choose from a <a href="https://railway.com/templates?q=axum" target="_blank">variety of Axum templates</a> created by the community.

### Deploy From the CLI

1. **Install the Railway CLI**:
    - <a href="/guides/cli#installing-the-cli" target="_blank">Install the CLI</a> and <a href="/guides/cli#authenticating-with-the-cli" target="_blank">authenticate it</a> using your Railway account.
2. **Initialize a Railway Project**:
    - Run the command below in your Axum app directory. 
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
    - Once the deployment completes, go to **View logs** to check if the server is running successfully.

    **Note:** During the deployment process, Railway will automatically [detect that it’s a Rust app](https://nixpacks.com/docs/providers/rust).
5. **Set Up a Public URL**:
    - Navigate to the **Networking** section under the [Settings](/overview/the-basics#service-settings) tab of your new service.
    - Click [Generate Domain](/guides/public-networking#railway-provided-domain) to create a public URL for your app.

<Image src="https://res.cloudinary.com/railway/image/upload/f_auto,q_auto/v1729880417/docs/quick-start/axum_app_service.png"
alt="screenshot of the deployed Axum service"
layout="responsive"
width={1982} height={1822} quality={100} />

### Deploy From a GitHub Repo

To deploy an Axum app to Railway directly from GitHub, follow the steps below:

1. **Create a New Project on Railway**:
    - Go to <a href="https://railway.com/new" target="_blank">Railway</a> to create a new project.
2. **Deploy from GitHub**: 
    - Select **Deploy from GitHub repo** and choose your repository.
        - If your Railway account isn’t linked to GitHub yet, you’ll be prompted to do so.
3. **Deploy the App**: 
    - Click **Deploy** to start the deployment process.
    - Once the deployed, a Railway [service](/guides/services) will be created for your app, but it won’t be publicly accessible by default.
4. **Verify the Deployment**:
    - Once the deployment completes, go to **View logs** to check if the server is running successfully.

    **Note:** During the deployment process, Railway will automatically [detect that it’s a Rust app](https://nixpacks.com/docs/providers/rust).
5. **Set Up a Public URL**:
    - Navigate to the **Networking** section under the [Settings](/overview/the-basics#service-settings) tab of your new service.
    - Click [Generate Domain](/guides/public-networking#railway-provided-domain) to create a public URL for your app.

### Use a Dockerfile

1. Create a `Dockerfile` in the `helloworld` or Axum app's root directory.
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
4. Either deploy via the CLI or from GitHub.

Railway automatically detects the `Dockerfile`, [and uses it to build and deploy the app.](/guides/dockerfiles)

**Note:** Railway supports also <a href="/guides/services#deploying-a-public-docker-image" target="_blank">deployment from public and private Docker images</a>.

This guide covers the main deployment options on Railway. Choose the approach that suits your setup, and start deploying your Axum apps seamlessly!

## Next Steps

Explore these resources to learn how you can maximize your experience with Railway:

- [Add a Database Service](/guides/build-a-database-service)
- [Monitor your app](/guides/monitoring)
