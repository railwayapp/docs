import { IPage, ISidebarContent } from "../types";
import { slugify } from "@/utils/slugify";

const makePage = (title: string, category?: string, slug?: string): IPage => ({
  title,
  category,
  slug: (() => {
    if (slug) {
      return slug.startsWith('/') ? slug : '/' + slug;
    }

    return '/' + (category ? category + '/' : '') + slugify(title);
  })(),
});

export const sidebarContent: ISidebarContent = [
  // The goal is to have the docs be in a narrative structure
  {
    title: "",
    content: [
      makePage("Home", undefined, "/"),
      makePage("Quick Start", undefined),
      makePage("Railway Metal", undefined),
    ],
  },
  {
    title: "Overview",
    content: [
      makePage("About Railway", "overview"),
      makePage("The Basics", "overview"),
      makePage("Best Practices", "overview"),
      makePage("Advanced Concepts", "overview"),
    ],
  },
  {
    title: "Guides",
    content: [
      {
        subTitle: makePage("Foundations", "guides"),
        pages: [
          makePage("Projects", "guides"),
          makePage("Staged Changes", "guides"),
          makePage("Services", "guides"),
          makePage("Variables", "guides"),
          makePage("Volumes", "guides"),
          makePage("Environments", "guides"),
          makePage("CLI", "guides"),
          makePage("Join Priority Boarding!", "guides"),
        ],
      },
      {
        subTitle: makePage("Languages & Frameworks", "guides"),
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
      {
        subTitle: makePage("Networking", "guides"),
        pages: [
          makePage("Public Networking", "guides"),
          makePage("Private Networking", "guides"),
        ],
      },
      {
        subTitle: makePage("Builds", "guides"),
        pages: [
          makePage("Build Configuration", "guides"),
          makePage("Dockerfiles", "guides"),
        ],
      },
      {
        subTitle: makePage("Deployments", "guides"),
        pages: [
          makePage("Pre-Deploy Command", "guides"),
          makePage("Start Command", "guides"),
          makePage("Deployment Actions", "guides"),
          makePage("GitHub Autodeploys", "guides"),
          makePage("Optimize Performance", "guides"),
          makePage("Healthchecks", "guides"),
          makePage("Restart Policy", "guides"),
          makePage("Deployment Teardown", "guides"),
          makePage("Monorepo", "guides"),
          makePage("Cron Jobs", "guides"),
          makePage("Optimize Usage", "guides"),
        ],
      },
      {
        subTitle: makePage("Databases", "guides"),
        pages: [
          makePage("Build a Database Service", "guides"),
          makePage("PostgreSQL", "guides"),
          makePage("MySQL", "guides"),
          makePage("Redis", "guides"),
          makePage("MongoDB", "guides"),
          makePage("Database View", "guides"),
        ],
      },
      {
        subTitle: makePage("Monitoring", "guides"),
        pages: [
          makePage("Logs", "guides"),
          makePage("Observability", "guides"),
          makePage("Metrics", "guides"),
          makePage("Webhooks", "guides"),
        ],
      },
      {
        subTitle: makePage("Templates", "guides"),
        pages: [
          makePage("Create", "guides"),
          makePage("Best Practices", "guides", "/guides/templates-best-practices"),
          makePage("Publish and Share", "guides"),
          makePage("Deploy", "guides"),
        ],
      },
      {
        subTitle: makePage("Public API", "guides"),
        pages: [
          makePage("Manage Projects", "guides"),
          makePage("Manage Services", "guides"),
          makePage("Manage Deployments", "guides"),
          makePage("Manage Variables", "guides"),
        ],
      },
      makePage("Config as Code", "guides"),
    ],
  },
  {
    title: "Tutorials",
    content: [
      makePage("Getting Started", "tutorials"),
      {
        subTitle: "Self Hosted Applications",
        pages: [
          {
            title: "Deploy Offen",
            url: "https://blog.railway.com/p/offen-web-analytics",
          },
        ],
      },
      {
        subTitle: "Technical Tutorials",
        pages: [
          {
            title: "Queues on Railway",
            url: "https://blog.railway.com/p/queues",
          },
          makePage("Set Up a Datadog Agent", "tutorials"),
          makePage("Deploy an Otel Collector Stack", "tutorials"),
          makePage("Deploy and Monitor Mongo", "tutorials"),
          makePage("Add a CDN using CloudFront", "tutorials"),
          makePage("Deploying a Monorepo", "tutorials"),
          makePage("Proximity Steering", "tutorials"),
          makePage("Set up a Tailscale Subnet Router", "tutorials"),
          makePage("Bridge Railway to RDS with Tailscale", "tutorials"),
        ],
      },
      {
        subTitle: "Database Backup Tutorials",
        pages: [
          {
            title: "Backing Up Redis",
            url: "https://blog.railway.com/p/redis-backup",
          },
          {
            title: "Backing Up Postgres",
            url: "https://blog.railway.com/p/postgre-backup",
          },
        ],
      },
      {
        subTitle: "GitHub Actions",
        pages: [
          {
            title: "Deploy with Railway",
            url: "https://blog.railway.com/p/github-actions",
          },
          makePage("Post-Deploy", "tutorials", "tutorials/github-actions-post-deploy"),
          makePage("PR Environment", "tutorials", "tutorials/github-actions-pr-environment"),
          makePage("Self Hosted Runners", "tutorials", "tutorials/github-actions-runners"),
          {
            title: "Implementing a Testing Suite",
            url: "https://blog.railway.com/p/implementing-gh-actions-testing",
          },
        ],
      },
      {
        subTitle: "Gitlab",
        pages: [
          {
            title: "Gitlab CI/CD with Railway",
            url: "https://blog.railway.com/p/gitlab-ci-cd",
          }
        ],
      },
    ],
  },
  {
    title: "Reference",
    content: [
      {
        subTitle: makePage("Errors", "/reference/errors", "/reference/errors"),
        pages: [
          makePage("Application Failed to Respond", "reference/errors"),
          makePage("No Start Command Could Be Found", "reference/errors"),
          makePage("405 Method Not Allowed", "reference/errors"),
          makePage(
            "Unable to Generate a Build Plan",
            "reference/errors",
            "reference/errors/nixpacks-was-unable-to-generate-a-build-plan",
          ),
          makePage(
            "ENOTFOUND redis.railway.internal",
            "reference/errors",
            "reference/errors/enotfound-redis-railway-internal",
          ),
        ],
      },
      {
        subTitle: "Develop",
        pages: [
          makePage("Databases", "reference"),
          makePage("Environments", "reference"),
          makePage("Projects", "reference"),
          makePage("Services", "reference"),
          makePage("Variables", "reference"),
          makePage("Volumes", "reference"),
          makePage("Functions", "reference"),
        ],
      },
      {
        subTitle: "Deploy",
        pages: [
          makePage("App Sleeping", "reference"),
          makePage("Build and Start Commands", "reference"),
          makePage("Config as Code", "reference"),
          makePage("Cron Jobs", "reference"),
          makePage("Deployments", "reference"),
          makePage("Deployment Regions", "reference"),
          makePage("Dockerfiles", "reference"),
          makePage("Healthchecks", "reference"),
          makePage("Backups", "reference"),
          makePage("Integrations", "reference"),
          makePage("Nixpacks", "reference"),
          makePage("Private Networking", "reference"),
          makePage("Public Networking", "reference"),
          makePage("Static Outbound IPs", "reference"),
          makePage("Scaling", "reference"),
          makePage("TCP Proxy", "reference"),
        ],
      },
      {
        subTitle: "Monitoring",
        pages: [
          makePage("Logging", "reference"),
          makePage("Metrics", "reference"),
          makePage("Webhooks", "reference"),
        ],
      },
      {
        subTitle: "Operations",
        pages: [
          makePage("Accounts", "reference"),
          makePage("Priority Boarding", "reference"),
          makePage("Project Members", "reference"),
          makePage("Project Usage", "reference"),
          makePage("Support", "reference"),
          makePage("Teams", "reference"),
          makePage("Usage Limits", "reference"),
        ],
      },
      makePage("CLI API", "reference"),
      makePage("Public API", "reference"),
      makePage("Templates", "reference"),
      {
        subTitle: "Pricing",
        pages: [
          makePage("Plans", "reference/pricing"),
          makePage("Free Trial", "reference/pricing"),
          makePage("FAQs", "reference/pricing"),
          makePage("Refunds", "reference/pricing"),
          makePage("AWS Marketplace", "reference/pricing"),
        ],
      },
      makePage("Migrate to Railway Metal", "reference"),
      makePage("Production Readiness Checklist", "reference"),
    ],
  },
  {
    title: "Maturity",
    content: [
      makePage("Philosophy", "maturity"),
      makePage("Use Cases", "maturity"),
      makePage("Compliance", "maturity"),
      makePage("Incident Management", "maturity"),
      makePage("Compare to Heroku", "maturity"),
      makePage("Compare to Render", "maturity"),
      makePage("Compare to Fly", "maturity"),
      makePage("Compare to Vercel", "maturity"),
      makePage("Compare to DigitalOcean", "maturity"),
    ],
  },
  {
    title: "Migration",
    content: [
      makePage("Migrate from Render", "migration"),
      makePage("Migrate from Fly", "migration"),
      makePage("Migrate from Vercel", "migration"),
      makePage("Migrate from DigitalOcean", "migration"),
    ],
  },
  {
    title: "Community",
    content: [
      makePage("The Conductor Program", "community"),
      makePage("Affiliate Program", "community"),
    ],
  },
];
