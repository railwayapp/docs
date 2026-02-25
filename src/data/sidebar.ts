import { IPage, ISidebarContent } from "../types";
import { slugify } from "@/utils/slugify";

const makePage = (title: string, category?: string, slug?: string): IPage => ({
  title,
  category,
  slug: (() => {
    if (slug) {
      return slug.startsWith("/") ? slug : "/" + slug;
    }

    return "/" + (category ? category + "/" : "") + slugify(title);
  })(),
});

const makeCliCommand = (commandName: string): IPage => ({
  title: commandName,
  commandName,
  category: "cli",
  slug: "/cli/" + commandName,
});

export const sidebarContent: ISidebarContent = [
  {
    content: [
      makePage("Quick start", undefined, "/quick-start"),
      makePage("The basics", "overview"),
      makePage("Best practices", "overview"),
      makePage("Advanced concepts", "overview"),
      makePage("Production readiness checklist", "overview"),
    ],
  },
  {
    title: "Platform",
    slug: "/platform",
    content: [
      makePage("Philosophy", "platform"),
      makePage("Use cases", "platform"),
      makePage("Support", "platform"),
      makePage("Incident management", "platform"),
      makePage("Railway Metal", "platform"),
      makePage("Priority boarding", "platform"),
      {
        subTitle: "Compare to Railway",
        pages: [
          makePage("Compare to Heroku", "platform"),
          makePage("Compare to Render", "platform"),
          makePage("Compare to Fly", "platform"),
          makePage("Compare to Vercel", "platform"),
          makePage("Compare to DigitalOcean", "platform"),
          makePage("Compare to VPS", "platform"),
        ],
      },
    ],
  },

  {
    title: "Pricing",
    slug: "/pricing",
    content: [
      makePage("Plans", "pricing"),
      makePage("Free trial", "pricing"),
      makePage("Understanding your bill", "pricing"),
      makePage("FAQs", "pricing"),
      makePage("Refunds", "pricing"),
      makePage("Cost control", "pricing"),
      makePage("Committed spend", "pricing"),
      makePage("AWS Marketplace", "pricing"),
      makePage("Credits", "pricing"),
    ],
  },
  // Enterprise
  {
    title: "Enterprise",
    slug: "/enterprise",
    content: [
      makePage("Compliance", "enterprise"),
      makePage("Audit logs", "enterprise"),
      makePage("SAML SSO", "enterprise", "/enterprise/saml"),
      makePage("Environment RBAC", "enterprise"),
    ],
  },
  {
    title: "AI",
    slug: "/ai",
    content: [makePage("Agent skills", "ai"), makePage("MCP server", "ai")],
  },
  {
    title: "Templates & open source",
    slug: "/templates",
    content: [
      {
        subTitle: "Using templates",
        pages: [
          makePage("Deploy", "templates"),
          makePage("Create", "templates"),
          makePage("Updates", "templates"),
          makePage("Best practices", "templates", "/templates/best-practices"),
          makePage("Publish and share", "templates"),
        ],
      },
      {
        subTitle: "Monetizing templates",
        pages: [
          makePage("Kickbacks", "templates"),
          makePage("Private Docker images", "templates"),
          makePage("Metrics", "templates"),
        ],
      },
      makePage("Open source technology partners", "templates", "/templates/partners"),
    ],
  },
  {
    title: "Languages & frameworks",
    slug: "/languages-frameworks",
    content: [
      {
        subTitle: "JavaScript / TypeScript",
        pages: [
          makePage("Next.js", undefined, "/quick-start"),
          makePage("Express", "guides", "/guides/express"),
          makePage("Fastify", "guides", "/guides/fastify"),
          makePage("Nest.js", "guides", "/guides/nest"),
          makePage("Remix", "guides", "/guides/remix"),
          makePage("Nuxt", "guides", "/guides/nuxt"),
          makePage("Astro", "guides", "/guides/astro"),
          makePage("SvelteKit", "guides", "/guides/sveltekit"),
          makePage("React", "guides", "/guides/react"),
          makePage("Vue", "guides", "/guides/vue"),
          makePage("Angular", "guides", "/guides/angular"),
          makePage("Solid", "guides", "/guides/solid"),
          makePage("Sails", "guides", "/guides/sails"),
        ],
      },
      {
        subTitle: "Python",
        pages: [
          makePage("FastAPI", "guides", "/guides/fastapi"),
          makePage("Flask", "guides", "/guides/flask"),
          makePage("Django", "guides", "/guides/django"),
        ],
      },
      {
        subTitle: "PHP",
        pages: [
          makePage("Laravel", "guides", "/guides/laravel"),
          makePage("Symfony", "guides", "/guides/symfony"),
        ],
      },
      {
        subTitle: "Ruby",
        pages: [makePage("Rails", "guides", "/guides/rails")],
      },
      {
        subTitle: "Go",
        pages: [
          makePage("Gin", "guides", "/guides/gin"),
          makePage("Beego", "guides", "/guides/beego"),
        ],
      },
      {
        subTitle: "Rust",
        pages: [
          makePage("Axum", "guides", "/guides/axum"),
          makePage("Rocket", "guides", "/guides/rocket"),
        ],
      },
      {
        subTitle: "Java",
        pages: [makePage("Spring Boot", "guides", "/guides/spring-boot")],
      },
      {
        subTitle: "Scala",
        pages: [makePage("Play", "guides", "/guides/play")],
      },
      {
        subTitle: "Elixir",
        pages: [
          makePage("Phoenix", "guides", "/guides/phoenix"),
          makePage(
            "Phoenix + Distillery",
            "guides",
            "/guides/phoenix-distillery",
          ),
        ],
      },
      {
        subTitle: "Clojure",
        pages: [makePage("Luminus", "guides", "/guides/luminus")],
      },
    ],
  },
  {
    title: "CLI",
    slug: "/cli",
    content: [
      makePage("Global options", "cli"),
      makePage("Deploying", "cli"),
      makePage("Telemetry", "cli"),
      makeCliCommand("add"),
      makeCliCommand("completion"),
      makeCliCommand("connect"),
      makeCliCommand("delete"),
      makeCliCommand("deploy"),
      makeCliCommand("deployment"),
      makeCliCommand("dev"),
      makeCliCommand("docs"),
      makeCliCommand("domain"),
      makeCliCommand("down"),
      makeCliCommand("environment"),
      makeCliCommand("functions"),
      makeCliCommand("init"),
      makeCliCommand("link"),
      makeCliCommand("list"),
      makeCliCommand("login"),
      makeCliCommand("logout"),
      makeCliCommand("logs"),
      makeCliCommand("open"),
      makeCliCommand("project"),
      makeCliCommand("redeploy"),
      makeCliCommand("restart"),
      makeCliCommand("run"),
      makeCliCommand("scale"),
      makeCliCommand("service"),
      makeCliCommand("shell"),
      makeCliCommand("ssh"),
      makeCliCommand("starship"),
      makeCliCommand("status"),
      makeCliCommand("unlink"),
      makeCliCommand("up"),
      makeCliCommand("upgrade"),
      makeCliCommand("variable"),
      makeCliCommand("volume"),
      makeCliCommand("whoami"),
    ],
  },
  {
    title: "Projects",
    slug: "/projects",
    content: [
      makePage("Project members", "projects"),
      makePage("Project usage", "projects"),
      makePage("Workspaces", "projects"),
    ],
  },
  {
    title: "Build & deploy",
    slug: "/build-deploy",
    content: [
      makePage("Services", undefined, "/services"),
      makePage("Environments", undefined, "/environments"),
      {
        subTitle: makePage("Variables", undefined, "/variables"),
        pages: [makePage("Reference", "variables")],
      },
      makePage("Cron jobs", undefined, "/cron-jobs"),
      makePage("Functions", undefined, "/functions"),
      {
        subTitle: makePage("Config as code", undefined, "/config-as-code"),
        pages: [makePage("Reference", "config-as-code")],
      },
      {
        subTitle: makePage("Builds", undefined, "/builds"),
        pages: [
          makePage("Build configuration", "builds"),
          makePage("Build and start commands", "builds"),
          makePage("Dockerfiles", "builds"),
          makePage("Private registries", "builds"),
          makePage("Railpack", "builds"),
          makePage("Nixpacks", "builds"),
        ],
      },
      {
        subTitle: makePage("Deployments", undefined, "/deployments"),
        pages: [
          makePage("Pre-deploy command", "deployments"),
          makePage("Start command", "deployments"),
          makePage("Deployment actions", "deployments"),
          makePage("GitHub autodeploys", "deployments"),
          makePage("Image auto updates", "deployments"),
          makePage("Optimize performance", "deployments"),
          makePage("Healthchecks", "deployments"),
          makePage("Restart policy", "deployments"),
          makePage("Deployment teardown", "deployments"),
          makePage("Monorepo", "deployments"),
          makePage("Staged changes", "deployments"),
          makePage("Serverless", "deployments"),
          makePage("Regions", "deployments"),
          makePage("Scaling", "deployments"),
          makePage("Reference", "deployments"),
        ],
      },
      {
        subTitle: "Troubleshooting",
        pages: [
          makePage("Slow deployments", "deployments/troubleshooting"),
          makePage("NodeJS SIGTERM handling", "deployments/troubleshooting"),
          makePage(
            "No start command could be found",
            "deployments/troubleshooting",
          ),
          makePage(
            "Nixpacks was unable to generate a build plan",
            "builds/troubleshooting",
          ),
        ],
      },
    ],
  },
  {
    title: "Data & storage",
    slug: "/data-storage",
    content: [
      {
        subTitle: makePage("Databases", undefined, "/databases"),
        pages: [
          makePage("Build a database service", "databases"),
          makePage("PostgreSQL", "databases"),
          makePage("MySQL", "databases"),
          makePage("Redis", "databases"),
          makePage("MongoDB", "databases"),
          makePage("Database view", "databases"),
          makePage("Reference", "databases"),
        ],
      },
      {
        subTitle: makePage("Volumes", undefined, "/volumes"),
        pages: [
          makePage("Backups", "volumes"),
          makePage("Reference", "volumes"),
        ],
      },
      {
        subTitle: makePage("Storage buckets", undefined, "/storage-buckets"),
        pages: [
          makePage(
            "Uploading & serving",
            "storage-buckets",
            "/storage-buckets/uploading-serving",
          ),
          makePage("Billing", "storage-buckets"),
        ],
      },
      {
        subTitle: "Troubleshooting",
        pages: [
          makePage(
            "ENOTFOUND redis.railway.internal",
            "databases/troubleshooting",
          ),
        ],
      },
    ],
  },
  {
    title: "Networking",
    slug: "/networking",
    content: [
      {
        subTitle: makePage(
          "Public networking",
          undefined,
          "/networking/public-networking",
        ),
        pages: [
          makePage(
            "Specs & limits",
            "networking/public-networking",
            "/networking/public-networking/specs-and-limits",
          ),
        ],
      },
      {
        subTitle: makePage(
          "Private networking",
          undefined,
          "/networking/private-networking",
        ),
        pages: [
          makePage("Library configuration", "networking/private-networking"),
        ],
      },
      {
        subTitle: makePage("Domains", undefined, "/networking/domains"),
        pages: [
          makePage("Working with Domains", "networking/domains"),
          makePage("Railway Domains", "networking/domains"),
        ],
      },
      makePage("TCP proxy", "networking"),
      makePage("Outbound networking", "networking"),
      makePage("Static outbound IPs", "networking"),
      makePage("Edge networking", "networking"),
      {
        subTitle: "Troubleshooting",
        pages: [
          makePage("SSL", "networking/troubleshooting"),
          makePage("Network diagnostics", "networking/troubleshooting"),
          makePage(
            "Application failed to respond",
            "networking/troubleshooting",
          ),
          makePage("405 method not allowed", "networking/troubleshooting"),
        ],
      },
    ],
  },
  {
    title: "Observability",
    slug: "/observability",
    content: [
      makePage("Logs", "observability"),
      makePage("Metrics", "observability"),
      makePage("Webhooks", "observability"),
    ],
  },
  {
    title: "Access",
    slug: "/access",
    content: [
      makePage("Accounts", "access"),
      makePage("Two-factor enforcement", "access"),
      makePage("Multi-factor authentication", "access"),
    ],
  },
  {
    title: "Integrations",
    slug: "/integrations",
    content: [
      {
        subTitle: makePage("OAuth", undefined, "/integrations/oauth"),
        pages: [
          makePage("Quickstart", "integrations/oauth"),
          makePage("Creating an app", "integrations/oauth"),
          makePage(
            "Login & tokens",
            "integrations/oauth",
            "/integrations/oauth/login-and-tokens",
          ),
          makePage(
            "Scopes & user consent",
            "integrations/oauth",
            "/integrations/oauth/scopes-and-user-consent",
          ),
          makePage("Fetching workspaces or projects", "integrations/oauth"),
          makePage("Managing an app", "integrations/oauth"),
          makePage("Authorized apps", "integrations/oauth"),
          makePage("Troubleshooting", "integrations/oauth"),
        ],
      },
      {
        subTitle: makePage("API", undefined, "/integrations/api"),
        pages: [
          makePage(
            "Introduction to GraphQL",
            "integrations/api",
            "/integrations/api/graphql-overview",
          ),
          makePage("API cookbook", "integrations/api"),
          makePage("Manage projects", "integrations/api"),
          makePage("Manage services", "integrations/api"),
          makePage("Manage deployments", "integrations/api"),
          makePage("Manage variables", "integrations/api"),
          makePage("Manage environments", "integrations/api"),
          makePage("Manage domains", "integrations/api"),
          makePage("Manage volumes", "integrations/api"),
        ],
      },
    ],
  },
  {
    title: "Community",
    slug: "/community",
    content: [
      makePage("The Conductor program", "community"),
      makePage("Affiliate program", "community"),
      makePage("Bounties", "community"),
    ],
  },
];
