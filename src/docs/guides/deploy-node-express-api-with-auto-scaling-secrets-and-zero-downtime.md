---
title: Deploy Node.js & Express API with Autoscaling, Secrets, and Zero Downtime
description: Learn how to deploy Node.js and Express applications with automatic scaling, environment secrets, zero-downtime updates, and preview environments—all without managing servers or learning Kubernetes/container orchestration.
---

In this guide, you'll learn how to deploy a [Node.js](https://nodejs.org/) and [Express.js](https://expressjs.com/) API to production using Railway. You'll build and deploy an API with automatic scaling, environment secrets management, and preview environments.

## What is Railway?

Railway is a modern deployment platform that enables you to deploy applications without managing servers, configuring load balancers, or learning Kubernetes. It provides automatic scaling, zero-downtime deployments, and built-in CI/CD.

Learn more about Railway's [core components and foundations](/guides/foundations).

## Prerequisites

This is a beginner-friendly guide. However, it assumes basic knowledge of [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) or [TypeScript](https://www.typescriptlang.org/) (preferred). You'll also need to have Node.js installed on your machine.

To successfully complete this guide, you'll need:

- A Railway account
- A [GitHub](https://github.com/) account with [git](https://git-scm.com/) configured
- Node.js installed locally - you can use [nvm](https://github.com/nvm-sh/nvm) to manage your Node.js versions

You can find the final code on [GitHub](https://github.com/railway/nodejs-express-tutorial).

## Project setup

Let's create a new Node.js project from scratch with TypeScript support. First, create a new directory and initialize the project:

```bash
mkdir my-express-api
cd my-express-api
npm init -y
```

### Install TypeScript and dependencies

Install TypeScript, Express, and the necessary type definitions:

```bash
npm install express dotenv
npm install -D typescript @types/node @types/express tsx
```

- [Express](https://expressjs.com/) - Web framework for Node.js
- [dotenv](https://www.npmjs.com/package/dotenv) - Loads environment variables from `.env` files
- [TypeScript](https://www.typescriptlang.org/) - Typed superset of JavaScript
- [tsx](https://tsx.is/) - TypeScript execution engine

### Configure TypeScript

Create a `tsconfig.json` file in your project root. Learn more about [TypeScript configuration options](https://www.typescriptlang.org/tsconfig):

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Create the project structure

Create a `src` directory and the main application file:

```bash
mkdir src
```

Create `src/app.ts` with the following code:

```typescript
import express from 'express';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Express API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    appName: process.env.APP_NAME || 'My Express API'
  });
});

app.get('/api/users', (req, res) => {
  res.json([
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
  ]);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Set up environment variables

Create a `.env` file in your project root to store environment variables:

```bash
# .env
APP_NAME=My Express API
NODE_ENV=development
PORT=3000
```

**Important**: Create a `.gitignore` file in your project root and add the following entries to keep sensitive data and dependencies out of version control:

```gitignore
# Environment variables
.env

# Dependencies
node_modules/

# Build output
dist/

# Logs
*.log
```

This ensures that sensitive environment variables, installed dependencies, and build artifacts are not committed to your repository.

Learn more about [`.gitignore` patterns](https://git-scm.com/docs/gitignore) and [environment variable security best practices](https://12factor.net/config).

Learn more about [managing variables](/guides/variables) in Railway.

### Update package.json scripts

Update your `package.json` to include the necessary scripts. Learn more about [npm scripts](https://docs.npmjs.com/cli/v8/using-npm/scripts):

```json
{
  "scripts": {
    "dev": "tsx src/app.ts",
    "build": "tsc",
    "start": "node dist/app.js"
  }
}
```

### Run the development server

Now you can run your TypeScript application using [tsx](https://tsx.is/), which provides seamless TypeScript execution without worrying about configuration:

```bash
npm run dev
```

If you open your browser and navigate to `http://localhost:3000`, you'll see your Express API running with TypeScript support.

Learn more about [customizing builds](/guides/builds) and [build configuration](/guides/build-configuration) in Railway.


## Deploy to Railway from GitHub

Now let's deploy this API to Railway. First, create a Railway account by going to [railway.com/new](https://railway.com/new) and signing up with your [GitHub](https://github.com/) account.


1. **Create a GitHub repository**:
   - Go to [GitHub](https://github.com/) and click "New repository"
   - Name it `my-express-api` (or any name you prefer)
   - Make it public or private
   - Don't initialize with README, .gitignore, or license (we already have these)
   - Click "Create repository"

2. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial Express API"
   git remote add origin https://github.com/yourusername/my-express-api.git
   git push -u origin main
   ```
   
   Learn more about [Git basics](https://git-scm.com/book/en/v2/Getting-Started-Git-Basics) if you're new to version control.

3. **Deploy from Railway**:
   - In Railway, click "Deploy from GitHub repo"
   - Select your repository
   - Railway automatically detects it's a Node.js app

4. **Configure environment variables**:
   - Click on your deployed service
   - Go to the "Variables" tab
   - Add the following variables:
     - `NODE_ENV=production`
     - `APP_NAME=My Production API`
   - Apply the changes and deploy

5. **Generate a public URL**:
   - Go to "Settings" → "Networking"
   - Click "Generate Domain"
   - Your API is now live at `https://your-app.up.railway.app`. When you visit this URL, you should see your Express API running.

Learn more about [deploying applications](/guides/deploy), [public networking](/guides/public-networking), and [staged changes](/guides/staged-changes) in Railway.


## Scaling and pricing

Railway automatically manages your application's scaling without any configuration needed. Here's how it works:

### Vertical Scaling (Automatic)

Railway automatically scales your service vertically by increasing CPU and memory allocation as traffic grows. This happens seamlessly up to your plan's limits

Check out the Railway [pricing page](https://railway.com/pricing) for more details about the different plans and their limits.




### Horizontal Scaling (One-Click)

For high-traffic applications, you can scale horizontally by deploying multiple replicas:

1. In your Railway project, click on your service
2. Go to the "Settings" tab
3. Under "Scaling", increase the instance count
4. Railway automatically distributes traffic across all replicas

![Horizontal scaling](https://res.cloudinary.com/railway/image/upload/v1758247839/docs/horizontal_scaling_xil1q0.png)

Each replica runs with the full resource limits of your plan. So if you're on the Pro plan and deploy 3 replicas, you get a combined capacity of 96 vCPU and 96 GB RAM.

```bash
Total resources = number of replicas × maximum compute allocation per replica
```

### Multi-Region Deployment

Railway also supports multi-region deployments for global applications:

1. Deploy replicas in different geographical regions
2. Railway automatically routes traffic to the nearest region
3. Traffic is then distributed randomly across available replicas within that region

![Multi-region deployment](https://res.cloudinary.com/railway/image/upload/v1758247839/docs/multi-region_deployment_h5fxqz.png)

This gives you both high availability and low latency for users worldwide, all with just a few clicks.

Learn more about [scaling applications](/reference/scaling) and [optimizing performance](/guides/optimize-performance) in Railway.


### Usage-based pricing

Railway follows a usage-based pricing model that depends on how long your service runs and the amount of resources it consumes. You only pay for activce CPU and memory, not for idle time.

```
Active compute time x compute size (memory and CPU)
```

![railway usage-based pricing](https://res.cloudinary.com/railway/image/upload/v1753470546/docs/comparison-docs/railway-usage-based-pricing_efrrjn.png)

Pricing plans start at $5/month. You can check out the [pricing page](https://railway.com/pricing) for more details.


## Add healthcheck for zero-downtime deployments

To ensure zero-downtime deployments, you'll need to add a healthcheck endpoint that Railway can use to verify your application is running properly. Learn more about [health check patterns](https://microservices.io/patterns/observability/health-check.html) and [zero-downtime deployment strategies](https://martinfowler.com/bliki/BlueGreenDeployment.html).

### Add the healthcheck endpoint

Update your `src/app.ts` file to include a healthcheck endpoint:

```typescript
// Add this route before app.listen()
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

Your complete `src/app.ts` should now look like this:

```typescript
import express from 'express';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Express API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    appName: process.env.APP_NAME || 'My Express API'
  });
});

app.get('/api/users', (req, res) => {
  res.json([
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
  ]);
});

app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    appName: process.env.APP_NAME || 'My Express API'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Deploy the healthcheck

Push your changes to GitHub:

```bash
git add .
git commit -m "Add healthcheck endpoint"
git push origin main
```

### Configure healthcheck in Railway

1. **Go to your service settings**:
   - In your Railway project, click on your deployed service
   - Navigate to the "Settings" tab

2. **Configure the healthcheck**:
   - Scroll down to the "Healthcheck" section
   - Set the **Healthcheck Path** to `/health`

![Healthchecks](https://res.cloudinary.com/railway/image/upload/v1758247840/docs/healthchecks_dx1ipr.png)

With the healthcheck configured, Railway will:
- Check your application's health before routing traffic to new deployments
- Automatically rollback if the healthcheck fails
- Ensure zero-downtime deployments by only switching traffic when the new version is healthy

Learn more about [configuring healthchecks](/guides/healthchecks) in Railway.


## Set up preview environments

Railway can spin up temporary environments for every pull request. First, you need to enable PR environments. Learn more about [GitHub Pull Requests](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests):

1. Go to your Project Settings → Environments tab
2. Enable "PR Environments" 
3. Optionally enable "Bot PR Environments" for automated PRs from [Dependabot](https://docs.github.com/en/code-security/dependabot) or [Renovatebot](https://renovatebot.com/)

![PR Environments](https://res.cloudinary.com/railway/image/upload/v1758274258/docs/PR_environmetns_q4z0yy.png)

Once enabled, create a feature branch to test this:

```bash
git checkout -b feature/new-endpoint
```

Add a new endpoint to your TypeScript application by updating `src/app.ts`:

```typescript
// Add this route before app.listen()
app.get('/api/status', (req, res) => {
  res.json({
    status: 'Preview environment is working!',
    timestamp: new Date().toISOString(),
    appName: process.env.APP_NAME || 'My Express API',
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0-preview'
  });
});
```

Push the changes and create a pull request:

```bash
git add .
git commit -m "Add GET /api/status endpoint"
git push origin feature/new-endpoint
```

Railway will automatically create a temporary environment for your pull request, giving you a unique URL to test your changes. The environment is automatically deleted when the PR is merged or closed.

**Note**: Railway will only deploy PR branches from team members or users invited to your project. For automatic domain provisioning, ensure your base environment services use Railway-provided domains.

Learn more about [using environments](/guides/environments) and [PR environments](/guides/environments#enable-pr-environments) in the Railway documentation.

## Deploy multiple services

Railway makes it easy to deploy multiple lightweight Node.js microservices without learning [Kubernetes](https://kubernetes.io/) or [Docker](https://www.docker.com/) orchestration. You can deploy several services within a single project to achieve a [microservice architecture](https://microservices.io/).

To add more microservices to your project:

1. In your Railway project, click the "+" button
2. Choose "Deploy from GitHub repo"
3. Select another repository containing a different Node.js service
4. Railway automatically detects and deploys each service independently

![Deploy multiple services](https://res.cloudinary.com/railway/image/upload/v1758274862/microservice_cpul8g.png)

Each service runs in its own container with its own resources, but they can communicate with each other through Railway's [private networking](/guides/private-networking).

### Shared Variables Between Services

Railway supports shared variables across all services in a project, making it easy to share configuration like database URLs, API keys, and other common settings. Learn more about [configuration management patterns](https://12factor.net/config):

1. Go to your project's "Settings" → "Shared Variables"
2. Add variables that all services need (e.g., `DATABASE_URL`, `API_KEY`)
3. Each service can reference these shared variables using Railway's template syntax

For example, if you have a shared `DATABASE_URL` variable, any service can reference it with:
```bash
DATABASE_URL=${{shared.DATABASE_URL}}
```

This eliminates duplication and makes it easy to manage configuration across your entire microservice architecture.

Learn more about [managing services](/guides/services), [shared variables](/guides/variables#shared-variables), and [service communication](/reference/services) in the Railway documentation.

## Conclusion

In this guide, you learned how to deploy Node.js and Express applications to production using Railway's zero-configuration deployment platform. You built:

- A production-ready Express REST API with automatic scaling
- A TypeScript application with automated builds
- Preview environments for every pull request

Railway makes Node.js deployment simple by providing:

- **Zero configuration**: Deploy from GitHub without Dockerfiles or complex setup
- **Automatic scaling**: Handle traffic spikes without manual intervention
- **Built-in CI/CD**: Preview environments and zero-downtime deployments
- **Usage-based pricing**: Pay only for what you use. Check out the Railway [pricing page](https://railway.com/pricing) for more details.

## Next Steps

Now that you've deployed your Node.js applications, explore these resources:

- [Add a Database Service](/guides/build-a-database-service)
- [Monitor your application](/guides/monitoring)
- [View logs and metrics](/guides/logs) and [metrics](/guides/metrics)
- [Set up custom domains](/guides/public-networking)
- [Configure environment variables](/guides/variables)
- [Deploy with Docker](/guides/dockerfiles)
- [Customize builds](/guides/builds)
- [Manage deployments](/guides/manage-deployments)

## Need Help?

If you have any questions or run into issues, you can reach out in the [Railway Discord](http://discord.gg/railway) community or on [Central Station](https://station.railway.com/).
