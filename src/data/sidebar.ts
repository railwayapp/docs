import { IPage, ISidebarContent } from "../types";

const makePage = (title: string, category?: string, slug?: string): IPage => ({
  title,
  category,
  slug:
    slug ??
    `/${category != null ? category + "/" : ""}${title
      .toLowerCase()
      .replace(/[\s/]+/g, '-')}`,
});

export const sidebarContent: ISidebarContent = [
  // The goal is to have the docs be in a narrative structure
  {
    title: "",
    content: [
      makePage("Home", undefined, "/"),
      makePage("Quick Start", undefined),
      {title: "Open Source Kickback", url: "https://railway.app/open-source-kickback"},
    ],
  },
  {
    title: "Overview",
    content: [
      makePage("About Railway", "overview"),
      makePage("The Basics", "overview"),
      makePage("Advanced Concepts", "overview"),
    ],
  },
  {
    title: "Maturity",
    content: [
      makePage("Philosophy", "maturity"),
      makePage("Use Cases", "maturity"),
      makePage("Compliance", "maturity"),
    ],
  },
  {
    title: "How To Guides",
    content: [
      {
        subTitle: makePage("Get Started","how-to"),
        pages: [
          makePage("Create and Manage Projects", "how-to"),
          makePage("Create and Manage Services", "how-to"),
          makePage("Use Variables", "how-to"),
          makePage("Use Volumes", "how-to"),
          makePage("Use the CLI", "how-to"),
          makePage("Setup Environments", "how-to"),
        ]
      },
      {
        subTitle: makePage("Understand Networking", "how-to"),
        pages: [
          makePage("Exposing Your App", "how-to"),
          makePage("Use Private Networking", "how-to"),
        ]
      },
      {
        subTitle: makePage("Configure Builds", "how-to"),
        pages: [
          makePage("Build Controls", "how-to"),
          makePage("Build from a Dockerfile", "how-to"),
        ]
      },
      {
        subTitle: makePage("Configure Deployments", "how-to"),
        pages: [
          makePage("Optimize Deployments", "how-to"),
          makePage("Deploy a Monorepo", "how-to"),
          makePage("Deployment Actions", "how-to"),
          makePage("Configure Deployment Lifecycle", "how-to"),
        ]
      },
      {
        subTitle: makePage("Use Database Services", "how-to"),
        pages: [
          makePage("Build a Database Service", "how-to"),
          makePage("PostgreSQL", "how-to"),
          makePage("MySQL", "how-to"),
          makePage("Redis", "how-to"),
          makePage("MongoDB", "how-to"),
          makePage("Using the Database View", "how-to"),
        ]
      },
      {
        subTitle: makePage("Monitor Services", "how-to"),
        pages: [
          makePage("View Logs", "how-to"),
          makePage("View Metrics", "how-to"),
          makePage("Setup Webhooks", "how-to"),
        ]
      },
      {
        subTitle: makePage("Use the Public API", "how-to"),
        pages: [
          makePage("Manage Projects", "how-to"),
          makePage("Manage Services", "how-to"),
          makePage("Manage Deployments", "how-to"),
          makePage("Manage Variables", "how-to"),
        ]
      },
      {
        subTitle: makePage("Use Config as Code", "how-to"),
        pages: [
          makePage("Configurable Settings", "how-to"),
        ]
      },
      {
        subTitle: makePage("Use Templates", "how-to"),
        pages: [
          makePage("Create a Template", "how-to"),
          makePage("Deploy a Template", "how-to"),
        ]
      },
      makePage("Fixing Common Errors", "how-to"),
    ],
  },
  {
    title: "Tutorials",
    content: [
      makePage("Introduction to Tutorials", 'tutorials'),
      {title: "Deploy Cusdis", url: "https://blog.railway.app/p/cusdis"},
      {title: "Deploy Ghost", url: "https://blog.railway.app/p/ghost"},
      {title: "Deploy Website Analytics", url: "https://blog.railway.app/p/self-hosted-website-analytics"},
      {title: "ExpressJS with Postgres", url: "https://blog.railway.app/p/expressjs-with-postgresql"},
      makePage("Migrate from Heroku", 'tutorials'),
      makePage("Database Migration Guide", 'tutorials'),
    ]
  },
  {
    title: "Reference",
    content: [
      {
        subTitle: makePage("Develop", "reference"),
        pages: [
          makePage("Projects", "reference"),
          makePage("Services", "reference"),
          makePage("Variables", "reference"),
          makePage("Public API", "reference"),
          makePage("Templates", "reference"),
          makePage("Volumes", "reference"),
          makePage("Accounts", "reference"),
          makePage("Teams", "reference"),
          makePage("CLI API", "reference"),
        ]
      },
      {
        subTitle: makePage("Deploy", "reference"),
        pages: [
          makePage("Private Networking", "reference"),
          makePage("App Sleeping", "reference"),
          makePage("Cron Jobs", "reference"),
          makePage("Usage Limits", "reference"),
        ]
      },
      {
        subTitle: makePage("Diagnose", "reference"),
        pages: [
          makePage("Pricing", "reference"),
          makePage("Support", "reference"),
          makePage("Builds", "reference"),
          makePage("Project Members", "reference"),
        ]
      },
      {
        subTitle: makePage("Operations", "reference"),
        pages: [
          makePage("Pricing", "reference"),
          makePage("Support", "reference"),
          makePage("Priority Boarding", "reference"),
        ]
      },
    ],
  },

];
