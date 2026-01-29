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
    title: "Enterprise",
    slug: "/enterprise",
    content: [
      makePage("Audit Logs", "enterprise"),
      makePage("Compliance", "enterprise"),
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
    title: "CLI",
    slug: "/cli",
    content: [makePage("Deploying", "cli")],
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
    title: "Access",
    content: [
      makePage("Accounts", "access"),
      makePage("Two-Factor Enforcement", "access"),
      makePage("Multi-Factor Authentication", "access"),
    ],
  },

  {
    title: "Projects",
    slug: "/projects",
    content: [
      makePage("Project Members", "projects"),
      makePage("Project Usage", "projects"),
      makePage("Teams", "projects"),
    ],
  },
  {
    title: "Services",
    slug: "/services",
    content: [],
  },
  {
    title: "Variables",
    slug: "/variables",
    content: [makePage("Reference", "variables")],
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
      {
        subTitle: "Troubleshooting",
        pages: [
          makePage("Slow Deployments", "deployments/troubleshooting"),
          makePage("NodeJS SIGTERM Handling", "deployments/troubleshooting"),
          makePage(
            "No Start Command Could be Found",
            "deployments/troubleshooting",
          ),
        ],
      },
    ],
  },
  {
    title: "Builds",
    slug: "/builds",
    content: [
      makePage("Build Configuration", "builds"),
      makePage("Dockerfiles", "builds"),
      makePage("Private Registries", "builds"),
      makePage("Railpack", "builds"),
      makePage("Nixpacks", "builds"),
      {
        subTitle: "Troubleshooting",
        pages: [
          makePage(
            "Nixpacks Was Unable to Generate a Build Plan",
            "builds/troubleshooting",
          ),
        ],
      },
    ],
  },
  {
    title: "Cron Jobs",
    slug: "/cron-jobs",
    content: [],
  },
  {
    title: "Functions",
    slug: "/functions",
    content: [],
  },
  {
    title: "Databases",
    slug: "/databases",
    content: [
      makePage("Build a Database Service", "databases"),
      makePage("PostgreSQL", "databases"),
      makePage("MySQL", "databases"),
      makePage("Redis", "databases"),
      makePage("MongoDB", "databases"),
      makePage("Database View", "databases"),
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
    title: "Volumes",
    slug: "/volumes",
    content: [makePage("Backups", "volumes")],
  },
  {
    title: "Storage Buckets",
    slug: "/storage-buckets",
    content: [
      makePage(
        "Uploading & Serving",
        "storage-buckets",
        "/storage-buckets/uploading-serving",
      ),
      makePage("Billing", "storage-buckets"),
    ],
  },
  {
    title: "Networking",
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
    title: "Environments",
    slug: "/environments",
    content: [],
  },
  {
    title: "Config as Code",
    slug: "/config-as-code",
    content: [makePage("Reference", "reference", "/config-as-code/reference")],
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
    slug: "/public-api",
    content: [
      makePage("Manage Projects", "public-api"),
      makePage("Manage Services", "public-api"),
      makePage("Manage Deployments", "public-api"),
      makePage("Manage Variables", "public-api"),
    ],
  },
];
