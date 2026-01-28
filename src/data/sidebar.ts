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

export const sidebarContent: ISidebarContent = [
  {
    title: "",
    content: [makePage("Quick Start", undefined)],
  },
  {
    title: "Overview",
    content: [
      makePage("The Basics", "overview"),
      makePage("Best Practices", "overview"),
      makePage("Advanced Concepts", "overview"),
      makePage(
        "Production Readiness Checklist",
        "overview",
        "/reference/production-readiness-checklist",
      ),
    ],
  },
  {
    title: "Platform",
    content: [
      makePage("About Railway", "platform"),
      makePage("Philosophy", "platform"),
      makePage("Use Cases", "platform"),
      makePage("Support", "platform", "/reference/support"),
      makePage("Incident Management", "platform"),
      makePage("Railway Metal", "platform", "/railway-metal"),
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
    content: [
      makePage("Plans", "pricing", "/reference/pricing/plans"),
      makePage("Free Trial", "pricing", "/reference/pricing/free-trial"),
      makePage("FAQs", "pricing", "/reference/pricing/faqs"),
      makePage("Refunds", "pricing", "/reference/pricing/refunds"),
      makePage("Cost Control", "pricing"),
      makePage(
        "AWS Marketplace",
        "pricing",
        "/reference/pricing/aws-marketplace",
      ),
    ],
  },
  {
    title: "Templates",
    content: [
      makePage("Templates", "templates"),
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
    title: "AI",
    content: [
      makePage("AI", "ai"),
      makePage("Agent Skills", "ai"),
      makePage("MCP Server", "ai", "/reference/mcp-server"),
    ],
  },
  {
    title: "CLI",
    content: [makePage("CLI", "cli"), makePage("Deploying", "cli")],
  },
  {
    title: "Access",
    content: [
      makePage("Accounts", "access", "/reference/accounts"),
      makePage(
        "Two-Factor Enforcement",
        "access",
        "/reference/two-factor-enforcement",
      ),
      makePage("Multi-Factor Authentication", "access"),
    ],
  },
  {
    title: "Enterprise",
    content: [
      makePage("Enterprise", "enterprise", "/platform/enterprise"),
      makePage("Audit Logs", "enterprise", "/reference/audit-logs"),
      makePage("Compliance", "enterprise", "/platform/compliance"),
      makePage("SAML SSO", "enterprise", "/reference/saml"),
      makePage("Environment RBAC", "enterprise"),
    ],
  },
  {
    title: "Projects",
    content: [
      makePage("Projects", "projects"),
      makePage("Project Members", "projects", "/reference/project-members"),
      makePage("Project Usage", "projects", "/reference/project-usage"),
      makePage("Teams", "projects", "/reference/teams"),
    ],
  },
  {
    title: "Services",
    content: [makePage("Services", "services")],
  },
  {
    title: "Variables",
    content: [makePage("Variables", "variables")],
  },
  {
    title: "Deployments",
    content: [
      makePage(
        "Pre-Deploy Command",
        "deployments",
        "/guides/pre-deploy-command",
      ),
      makePage("Start Command", "deployments", "/guides/start-command"),
      makePage("Deployment Actions", "deployments"),
      makePage("GitHub Autodeploys", "deployments"),
      makePage(
        "Image Auto Updates",
        "deployments",
        "/guides/image-auto-updates",
      ),
      makePage(
        "Optimize Performance",
        "deployments",
        "/guides/optimize-performance",
      ),
      makePage("Healthchecks", "deployments"),
      makePage("Restart Policy", "deployments", "/guides/restart-policy"),
      makePage("Deployment Teardown", "deployments"),
      makePage("Monorepo", "deployments", "/builds/monorepo"),
      makePage("Staged Changes", "deployments", "/guides/staged-changes"),
      makePage("Serverless", "deployments"),
      makePage("Regions", "deployments"),
      makePage("Scaling", "deployments", "/reference/scaling"),
    ],
  },
  {
    title: "Builds",
    content: [
      makePage("Build Configuration", "builds", "/guides/build-configuration"),
      makePage("Dockerfiles", "builds"),
      makePage("Private Registries", "builds", "/guides/private-registries"),
      makePage("Railpack", "builds", "/reference/railpack"),
      makePage("Nixpacks", "builds", "/reference/nixpacks"),
    ],
  },
  {
    title: "Cron Jobs",
    content: [makePage("Cron Jobs", "cron-jobs")],
  },
  {
    title: "Functions",
    content: [makePage("Functions", "functions", "/reference/functions")],
  },
  {
    title: "Databases",
    content: [
      makePage("Databases", "databases", "/reference/databases"),
      makePage(
        "Build a Database Service",
        "databases",
        "/guides/build-a-database-service",
      ),
      makePage("PostgreSQL", "databases", "/guides/postgresql"),
      makePage("MySQL", "databases", "/guides/mysql"),
      makePage("Redis", "databases", "/guides/redis"),
      makePage("MongoDB", "databases", "/guides/mongodb"),
      makePage("Database View", "databases", "/guides/database-view"),
    ],
  },
  {
    title: "Volumes",
    content: [
      makePage("Volumes", "volumes", "/guides/volumes"),
      makePage("Backups", "volumes", "/reference/backups"),
    ],
  },
  {
    title: "Storage Buckets",
    content: [
      makePage("Storage Buckets", "storage-buckets"),
      makePage(
        "Uploading & Serving",
        "storage-buckets",
        "/storage-buckets/uploading-serving",
      ),
      makePage("Billing", "storage-buckets", "/storage-buckets/billing"),
    ],
  },
  {
    title: "Public Networking",
    content: [
      makePage("Public Networking", "public-networking"),
      makePage(
        "Specs & Limits",
        "public-networking",
        "/public-networking/specs-and-limits",
      ),
    ],
  },
  {
    title: "Private Networking",
    content: [
      makePage("Private Networking", "private-networking"),
      makePage("Library Configuration", "private-networking"),
    ],
  },
  {
    title: "Networking",
    content: [
      makePage("Domains", "networking"),
      makePage("TCP Proxy", "networking"),
      makePage(
        "Outbound Networking",
        "networking",
        "/reference/outbound-networking",
      ),
      makePage(
        "Static Outbound IPs",
        "networking",
        "/reference/static-outbound-ips",
      ),
      makePage("Edge Networking", "networking", "/reference/edge-networking"),
      makePage(
        "Troubleshooting SSL",
        "networking",
        "/guides/troubleshooting-ssl",
      ),
    ],
  },
  {
    title: "Observability",
    content: [
      makePage("Logs", "observability"),
      makePage("Metrics", "observability"),
      makePage("Webhooks", "observability"),
    ],
  },
  {
    title: "Environments",
    content: [makePage("Environments", "environments")],
  },
  {
    title: "Config as Code",
    content: [
      makePage("Config as Code", "config-as-code", "/guides/config-as-code"),
    ],
  },
  {
    title: "Community",
    content: [
      makePage("The Conductor Program", "community"),
      makePage("Affiliate Program", "community"),
      makePage("Bounties", "community"),
    ],
  },
  {
    title: "Public API",
    content: [
      makePage("Public API", "public-api"),
      makePage("Manage Projects", "public-api", "/guides/manage-projects"),
      makePage("Manage Services", "public-api", "/guides/manage-services"),
      makePage(
        "Manage Deployments",
        "public-api",
        "/guides/manage-deployments",
      ),
      makePage("Manage Variables", "public-api", "/guides/manage-variables"),
    ],
  },
  {
    title: "Guides",
    content: [
      makePage("Static Hosting", "guides"),
      {
        subTitle: "Languages & Frameworks",
        pages: [
          makePage("Express", "guides"),
          makePage("Nest", "guides"),
          makePage("Fastify", "guides"),
          makePage("FastAPI", "guides"),
          makePage("Flask", "guides"),
          makePage("Beego", "guides"),
          makePage("Gin", "guides"),
          makePage("Rails", "guides"),
          makePage("Axum", "guides"),
          makePage("Rocket", "guides"),
          makePage("Laravel", "guides"),
          makePage("Symfony", "guides"),
          makePage("Luminus", "guides"),
          makePage("Play", "guides"),
          makePage("Sails", "guides"),
          makePage("Django", "guides"),
          makePage("Angular", "guides"),
          makePage("React", "guides"),
          makePage("Remix", "guides"),
          makePage("Vue", "guides"),
          makePage("Nuxt", "guides"),
          makePage("Spring Boot", "guides"),
          makePage("Astro", "guides"),
          makePage("SvelteKit", "guides"),
          makePage("Solid", "guides"),
          makePage("Phoenix", "guides"),
          makePage("Phoenix Distillery", "guides"),
        ],
      },
    ],
  },
  {
    title: "Tutorials",
    content: [
      makePage("Getting Started", "tutorials"),
      {
        subTitle: "Technical Tutorials",
        pages: [
          {
            title: "Queues on Railway",
            url: "https://blog.railway.com/p/queues",
          },
          makePage("Set Up a Datadog Agent", "tutorials"),
          makePage("Deploy an Otel Collector Stack", "tutorials"),
          makePage("Add a CDN using CloudFront", "tutorials"),
          makePage("Deploying a Monorepo", "tutorials"),
          makePage("Set up a Tailscale Subnet Router", "tutorials"),
          makePage("Bridge Railway to RDS with Tailscale", "tutorials"),
        ],
      },
      {
        subTitle: "GitHub Actions",
        pages: [
          {
            title: "Deploy with Railway",
            url: "https://blog.railway.com/p/github-actions",
          },
          makePage(
            "Post-Deploy",
            "tutorials",
            "tutorials/github-actions-post-deploy",
          ),
          makePage(
            "PR Environment",
            "tutorials",
            "tutorials/github-actions-pr-environment",
          ),
          makePage(
            "Self Hosted Runners",
            "tutorials",
            "tutorials/github-actions-runners",
          ),
          {
            title: "Implementing a Testing Suite",
            url: "https://blog.railway.com/p/implementing-gh-actions-testing",
          },
        ],
      },
      {
        subTitle: "GitLab",
        pages: [
          {
            title: "GitLab CI/CD with Railway",
            url: "https://blog.railway.com/p/gitlab-ci-cd",
          },
        ],
      },
    ],
  },
  {
    title: "Troubleshooting",
    content: [
      makePage("Troubleshooting", "troubleshooting", "/troubleshooting"),
      makePage(
        "Application Failed to Respond",
        "troubleshooting",
        "/reference/errors/application-failed-to-respond",
      ),
      makePage(
        "No Start Command Could Be Found",
        "troubleshooting",
        "/reference/errors/no-start-command-could-be-found",
      ),
      makePage(
        "405 Method Not Allowed",
        "troubleshooting",
        "/reference/errors/405-method-not-allowed",
      ),
      makePage(
        "Unable to Generate a Build Plan",
        "troubleshooting",
        "/reference/errors/nixpacks-was-unable-to-generate-a-build-plan",
      ),
      makePage(
        "ENOTFOUND redis.railway.internal",
        "troubleshooting",
        "/reference/errors/enotfound-redis-railway-internal",
      ),
      makePage("Node.js SIGTERM", "troubleshooting", "/guides/nodejs-sigterm"),
    ],
  },
];
