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
      makePage("Quick Start", undefined, "/quick-start"),
      makePage("The Basics", "overview"),
      makePage("Best Practices", "overview"),
      makePage("Advanced Concepts", "overview"),
      makePage("Production Readiness Checklist", "overview"),
    ],
  },
  {
    title: "Platform",
    slug: "/platform",
    content: [
      makePage("Philosophy", "platform"),
      makePage("Use Cases", "platform"),
      makePage("Support", "platform"),
      makePage("Incident Management", "platform"),
      makePage("Railway Metal", "platform"),
      makePage("Priority Boarding", "platform"),
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
      makePage("Free Trial", "pricing"),
      makePage("Understanding Your Bill", "pricing"),
      makePage("FAQs", "pricing"),
      makePage("Refunds", "pricing"),
      makePage("Cost Control", "pricing"),
      makePage("Committed Spend", "pricing"),
      makePage("AWS Marketplace", "pricing"),
    ],
  },
  // Enterprise
  {
    title: "Enterprise",
    slug: "/enterprise",
    content: [
      makePage("Compliance", "enterprise"),
      makePage("Audit Logs", "enterprise"),
      makePage("SAML SSO", "enterprise", "/enterprise/saml"),
      makePage("Environment RBAC", "enterprise"),
    ],
  },
  {
    title: "AI",
    slug: "/ai",
    content: [makePage("Agent Skills", "ai"), makePage("MCP Server", "ai")],
  },
  {
    title: "Templates",
    slug: "/templates",
    content: [
      makePage("Deploy", "templates"),
      makePage("Create", "templates"),
      makePage("Best Practices", "templates", "/templates/best-practices"),
      makePage("Publish and Share", "templates"),
      makePage("Kickbacks", "templates"),
      makePage("Updates", "templates"),
      makePage("Partners", "templates"),
    ],
  },
  {
    title: "Languages & Frameworks",
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
      makePage("Global Options", "cli"),
      makePage("Deploying", "cli"),
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
      makePage("Project Members", "projects"),
      makePage("Project Usage", "projects"),
      makePage("Workspaces", "projects"),
    ],
  },
  {
    title: "Build & Deploy",
    slug: "/build-deploy",
    content: [
      makePage("Services", undefined, "/services"),
      makePage("Environments", undefined, "/environments"),
      {
        subTitle: makePage("Variables", undefined, "/variables"),
        pages: [makePage("Reference", "variables")],
      },
      makePage("Cron Jobs", undefined, "/cron-jobs"),
      makePage("Functions", undefined, "/functions"),
      {
        subTitle: makePage("Config as Code", undefined, "/config-as-code"),
        pages: [makePage("Reference", "config-as-code")],
      },
      {
        subTitle: makePage("Builds", undefined, "/builds"),
        pages: [
          makePage("Build Configuration", "builds"),
          makePage("Build and Start Commands", "builds"),
          makePage("Dockerfiles", "builds"),
          makePage("Private Registries", "builds"),
          makePage("Railpack", "builds"),
          makePage("Nixpacks", "builds"),
        ],
      },
      {
        subTitle: makePage("Deployments", undefined, "/deployments"),
        pages: [
          makePage("Pre-Deploy Command", "deployments"),
          makePage("Start Command", "deployments"),
          makePage("Deployment Actions", "deployments"),
          makePage("GitHub Autodeploys", "deployments"),
          makePage("Image Auto Updates", "deployments"),
          makePage("Optimize Performance", "deployments"),
          makePage("Healthchecks", "deployments"),
          makePage("Restart Policy", "deployments"),
          makePage("Deployment Teardown", "deployments"),
          makePage("Monorepo", "deployments"),
          makePage("Staged Changes", "deployments"),
          makePage("Serverless", "deployments"),
          makePage("Regions", "deployments"),
          makePage("Scaling", "deployments"),
          makePage("Reference", "deployments"),
        ],
      },
      {
        subTitle: "Troubleshooting",
        pages: [
          makePage("Slow Deployments", "deployments/troubleshooting"),
          makePage("NodeJS SIGTERM Handling", "deployments/troubleshooting"),
          makePage(
            "No Start Command Could be Found",
            "deployments/troubleshooting",
          ),
          makePage(
            "Nixpacks Was Unable to Generate a Build Plan",
            "builds/troubleshooting",
          ),
        ],
      },
    ],
  },
  {
    title: "Data & Storage",
    slug: "/data-storage",
    content: [
      {
        subTitle: makePage("Databases", undefined, "/databases"),
        pages: [
          makePage("Build a Database Service", "databases"),
          makePage("PostgreSQL", "databases"),
          makePage("MySQL", "databases"),
          makePage("Redis", "databases"),
          makePage("MongoDB", "databases"),
          makePage("Database View", "databases"),
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
        subTitle: makePage("Storage Buckets", undefined, "/storage-buckets"),
        pages: [
          makePage(
            "Uploading & Serving",
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
          "Public Networking",
          undefined,
          "/networking/public-networking",
        ),
        pages: [
          makePage(
            "Specs & Limits",
            "networking/public-networking",
            "/networking/public-networking/specs-and-limits",
          ),
        ],
      },
      {
        subTitle: makePage(
          "Private Networking",
          undefined,
          "/networking/private-networking",
        ),
        pages: [
          makePage("Library Configuration", "networking/private-networking"),
        ],
      },
      makePage("Domains", "networking"),
      makePage("TCP Proxy", "networking"),
      makePage("Outbound Networking", "networking"),
      makePage("Static Outbound IPs", "networking"),
      makePage("Edge Networking", "networking"),
      {
        subTitle: "Troubleshooting",
        pages: [
          makePage("SSL", "networking/troubleshooting"),
          makePage("Network Diagnostics", "networking/troubleshooting"),
          makePage(
            "Application Failed to Respond",
            "networking/troubleshooting",
          ),
          makePage("405 Method Not Allowed", "networking/troubleshooting"),
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
      makePage("Two-Factor Enforcement", "access"),
      makePage("Multi-Factor Authentication", "access"),
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
          makePage("Creating an App", "integrations/oauth"),
          makePage(
            "Login & Tokens",
            "integrations/oauth",
            "/integrations/oauth/login-and-tokens",
          ),
          makePage(
            "Scopes & User Consent",
            "integrations/oauth",
            "/integrations/oauth/scopes-and-user-consent",
          ),
          makePage("Fetching Workspaces or Projects", "integrations/oauth"),
          makePage("Managing an App", "integrations/oauth"),
          makePage("Authorized Apps", "integrations/oauth"),
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
          makePage("API Cookbook", "integrations/api"),
          makePage("Manage Projects", "integrations/api"),
          makePage("Manage Services", "integrations/api"),
          makePage("Manage Deployments", "integrations/api"),
          makePage("Manage Variables", "integrations/api"),
          makePage("Manage Environments", "integrations/api"),
          makePage("Manage Domains", "integrations/api"),
          makePage("Manage Volumes", "integrations/api"),
        ],
      },
    ],
  },
  {
    title: "Community",
    slug: "/community",
    content: [
      makePage("The Conductor Program", "community"),
      makePage("Affiliate Program", "community"),
      makePage("Bounties", "community"),
    ],
  },
];
