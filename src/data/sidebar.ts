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
      makePage("Production Readiness Checklist", "overview"),
    ],
  },
  {
    title: "Platform",
    content: [
      makePage("About Railway", "platform"),
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
    content: [
      makePage("Plans", "pricing"),
      makePage("Free Trial", "pricing"),
      makePage("FAQs", "pricing"),
      makePage("Refunds", "pricing"),
      makePage("Cost Control", "pricing"),
      makePage("AWS Marketplace", "pricing"),
    ],
  },
  {
    title: "Templates",
    content: [
      makePage("Templates", undefined, "/templates"),
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
      makePage("AI", undefined, "/ai"),
      makePage("Agent Skills", "ai"),
      makePage("MCP Server", "ai"),
    ],
  },
  {
    title: "CLI",
    content: [makePage("CLI", undefined, "/cli"), makePage("Deploying", "cli")],
  },
  {
    title: "Access",
    content: [
      makePage("Accounts", "access"),
      makePage("Two-Factor Enforcement", "access"),
      makePage("Multi-Factor Authentication", "access"),
    ],
  },
  {
    title: "Enterprise",
    content: [
      makePage("Enterprise", undefined, "/enterprise"),
      makePage("Audit Logs", "enterprise"),
      makePage("Compliance", "enterprise"),
      makePage("SAML SSO", "enterprise", "/enterprise/saml"),
      makePage("Environment RBAC", "enterprise"),
    ],
  },
  {
    title: "Projects",
    content: [
      makePage("Projects", undefined, "/projects"),
      makePage("Project Members", "projects"),
      makePage("Project Usage", "projects"),
      makePage("Teams", "projects"),
    ],
  },
  {
    title: "Services",
    content: [makePage("Services", undefined, "/services")],
  },
  {
    title: "Variables",
    content: [makePage("Variables", undefined, "/variables")],
  },
  {
    title: "Deployments",
    content: [
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
    ],
  },
  {
    title: "Builds",
    content: [
      makePage("Builds", undefined, "/builds"),
      makePage("Build Configuration", "builds"),
      makePage("Dockerfiles", "builds"),
      makePage("Private Registries", "builds"),
      makePage("Railpack", "builds"),
      makePage("Nixpacks", "builds"),
    ],
  },
  {
    title: "Cron Jobs",
    content: [makePage("Cron Jobs", undefined, "/cron-jobs")],
  },
  {
    title: "Functions",
    content: [makePage("Functions", undefined, "/functions")],
  },
  {
    title: "Databases",
    content: [
      makePage("Databases", undefined, "/databases"),
      makePage("Build a Database Service", "databases"),
      makePage("PostgreSQL", "databases"),
      makePage("MySQL", "databases"),
      makePage("Redis", "databases"),
      makePage("MongoDB", "databases"),
      makePage("Database View", "databases"),
    ],
  },
  {
    title: "Volumes",
    content: [
      makePage("Volumes", undefined, "/volumes"),
      makePage("Backups", "volumes"),
    ],
  },
  {
    title: "Storage Buckets",
    content: [
      makePage("Storage Buckets", undefined, "/storage-buckets"),
      makePage(
        "Uploading & Serving",
        "storage-buckets",
        "/storage-buckets/uploading-serving",
      ),
      makePage("Billing", "storage-buckets"),
    ],
  },
  {
    title: "Public Networking",
    content: [
      makePage("Public Networking", undefined, "/public-networking"),
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
      makePage("Private Networking", undefined, "/private-networking"),
      makePage("Library Configuration", "private-networking"),
    ],
  },
  {
    title: "Networking",
    content: [
      makePage("Networking", undefined, "/networking"),
      makePage("Domains", "networking"),
      makePage("TCP Proxy", "networking"),
      makePage("Outbound Networking", "networking"),
      makePage("Static Outbound IPs", "networking"),
      makePage("Edge Networking", "networking"),
      makePage("Troubleshooting SSL", "networking"),
    ],
  },
  {
    title: "Observability",
    content: [
      makePage("Observability", undefined, "/observability"),
      makePage("Logs", "observability"),
      makePage("Metrics", "observability"),
      makePage("Webhooks", "observability"),
    ],
  },
  {
    title: "Environments",
    content: [makePage("Environments", undefined, "/environments")],
  },
  {
    title: "Config as Code",
    content: [makePage("Config as Code", undefined, "/config-as-code")],
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
      makePage("Public API", undefined, "/public-api"),
      makePage("Manage Projects", "public-api"),
      makePage("Manage Services", "public-api"),
      makePage("Manage Deployments", "public-api"),
      makePage("Manage Variables", "public-api"),
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
      makePage("Getting Started", "guides"),
      {
        subTitle: "Technical Tutorials",
        pages: [
          {
            title: "Queues on Railway",
            url: "https://blog.railway.com/p/queues",
          },
          makePage("Set Up a Datadog Agent", "guides"),
          makePage("Deploy an Otel Collector Stack", "guides"),
          makePage("Add a CDN using CloudFront", "guides"),
          makePage("Deploying a Monorepo", "guides"),
          makePage("Set up a Tailscale Subnet Router", "guides"),
          makePage("Bridge Railway to RDS with Tailscale", "guides"),
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
            "guides",
            "/guides/github-actions-post-deploy",
          ),
          makePage(
            "PR Environment",
            "guides",
            "/guides/github-actions-pr-environment",
          ),
          makePage(
            "Self Hosted Runners",
            "guides",
            "/guides/github-actions-runners",
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
      makePage("Troubleshooting", undefined, "/troubleshooting"),
      makePage("Application Failed to Respond", "troubleshooting"),
      makePage("No Start Command Could Be Found", "troubleshooting"),
      makePage("405 Method Not Allowed", "troubleshooting"),
      makePage(
        "Unable to Generate a Build Plan",
        "troubleshooting",
        "/troubleshooting/nixpacks-was-unable-to-generate-a-build-plan",
      ),
      makePage("ENOTFOUND redis.railway.internal", "troubleshooting"),
      makePage("Node.js SIGTERM", "troubleshooting"),
    ],
  },
];
