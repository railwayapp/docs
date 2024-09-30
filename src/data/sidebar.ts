import { IPage, ISidebarContent } from "../types";
import { slugify } from "@/utils/slugify";

const makePage = (title: string, category?: string, slug?: string): IPage => ({
  title,
  category,
  slug: slug ?? `/${category != null ? category + "/" : ""}` + slugify(title),
});

export const sidebarContent: ISidebarContent = [
  // The goal is to have the docs be in a narrative structure
  {
    title: "",
    content: [
      makePage("Home", undefined, "/"),
      makePage("Quick Start", undefined),
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
          makePage("Fastify", "guides"),
          makePage("FastAPI", "guides"),
          makePage("Gin", "guides")
        ],
      },
      {
        subTitle: makePage("Networking", "guides"),
        pages: [
          makePage("Public Networking", "guides"),
          makePage("Private Networking", "guides"),
          makePage("Fixing Common Errors", "guides"),
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
          makePage("Start Command", "guides"),
          makePage("Deployment Actions", "guides"),
          makePage("GitHub Autodeploys", "guides"),
          makePage("Optimize Performance", "guides"),
          makePage("Healthchecks and Restarts", "guides"),
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
          makePage("Database Migration Guide", "guides"),
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
      {
        subTitle: makePage("Getting Started", "tutorials"),
        pages: [makePage("Migrate From Heroku", "tutorials")],
      },
      {
        subTitle: "Self Hosted Applications",
        pages: [
          {
            title: "Deploy Offen",
            url: "https://blog.railway.app/p/offen-web-analytics",
          },
        ],
      },
      {
        subTitle: "Technical Tutorials",
        pages: [
          {
            title: "Queues on Railway",
            url: "https://blog.railway.app/p/queues",
          },
          {
            title: "Gitlab CI/CD with Railway",
            url: "https://blog.railway.app/p/gitlab-ci-cd",
          },
          makePage("Set Up a Datadog Agent", "tutorials"),
          makePage("Deploy an Otel Collector Stack", "tutorials"),
          makePage("Deploy and Monitor Mongo", "tutorials"),
          makePage("Add a CDN using CloudFront", "tutorials"),
          makePage("Deploying a Monorepo", "tutorials"),
          makePage("Proximity Steering", "tutorials"),
          makePage("Set up a Tailscale Subnet Router", "tutorials"),
        ],
      },
      {
        subTitle: "Database Backup Tutorials",
        pages: [
          {
            title: "Backing Up Redis",
            url: "https://blog.railway.app/p/redis-backup",
          },
          {
            title: "Backing Up Postgres",
            url: "https://blog.railway.app/p/postgre-backup",
          },
        ],
      },
      {
        subTitle: "GitHub Tutorials",
        pages: [
          {
            title: "GitHub Actions",
            url: "https://blog.railway.app/p/github-actions",
          },
        ],
      },
    ],
  },
  {
    title: "Reference",
    content: [
      {
        subTitle: "Develop",
        pages: [
          makePage("Databases", "reference"),
          makePage("Environments", "reference"),
          makePage("Projects", "reference"),
          makePage("Services", "reference"),
          makePage("Variables", "reference"),
          makePage("Volumes", "reference"),
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
          makePage("Integrations", "reference"),
          makePage("Nixpacks", "reference"),
          makePage("Private Networking", "reference"),
          makePage("Public Networking", "reference"),
          makePage("Static Outbound IPs", "reference"),
          makePage("Scaling", "reference"),
          makePage("TCP Proxy", "reference"),
          makePage("Runtime", "reference"),
        ],
      },
      {
        subTitle: "Diagnose",
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
        ],
      },
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
    ],
  },
];
