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
    title: "Guides",
    content: [
      {
        subTitle: makePage("Get Started","guides"),
        pages: [
          makePage("Create and Manage Projects", "guides"),
          makePage("Create and Manage Services", "guides"),
          makePage("Use Variables", "guides"),
          makePage("Use Volumes", "guides"),
          makePage("Setup Environments", "guides"),
          makePage("Use the CLI", "guides"),
        ]
      },
      {
        subTitle: makePage("Understand Networking", "guides"),
        pages: [
          makePage("Exposing Your App", "guides"),
          makePage("Use Private Networking", "guides"),
        ]
      },
      {
        subTitle: makePage("Configure Builds", "guides"),
        pages: [
          makePage("Build Controls", "guides"),
          makePage("Build from a Dockerfile", "guides"),
        ]
      },
      {
        subTitle: makePage("Configure Deployments", "guides"),
        pages: [
          makePage("Set a Start Command", "guides"),
          makePage("Deployment Actions", "guides"),
          makePage("Control Github Autodeploys", "guides"),
          makePage("Optimize Performance", "guides"),
          makePage("Healthchecks and Restart Policy", "guides"),
          makePage("Deploy a Monorepo", "guides"),
          makePage("Run a Cron Job", "guides"),
          makePage("Optimize Usage", "guides"),
        ]
      },
      {
        subTitle: makePage("Use Database Services", "guides"),
        pages: [
          makePage("Build a Database Service", "guides"),
          makePage("PostgreSQL", "guides"),
          makePage("MySQL", "guides"),
          makePage("Redis", "guides"),
          makePage("MongoDB", "guides"),
          makePage("Using the Database View", "guides"),
        ]
      },
      {
        subTitle: makePage("Monitor Services", "guides"),
        pages: [
          makePage("View Logs", "guides"),
          makePage("View Metrics", "guides"),
          makePage("Setup Webhooks", "guides"),
        ]
      },
      {
        subTitle: makePage("Use the Public API", "guides"),
        pages: [
          makePage("Manage Projects", "guides"),
          makePage("Manage Services", "guides"),
          makePage("Manage Deployments", "guides"),
          makePage("Manage Variables", "guides"),
        ]
      },
      makePage("Use Config as Code", "guides"),
      {
        subTitle: makePage("Use Templates", "guides"),
        pages: [
          makePage("Create a Template", "guides"),
          makePage("Publish and Share Templates", "guides"),
          makePage("Deploy a Template", "guides"),
        ]
      },
      makePage("Fixing Common Errors", "guides"),
    ],
  },
  {
    title: "Tutorials",
    content: [
      makePage("Introduction to Tutorials", 'tutorials'),
      {title: "Deploy Cusdis", url: "https://blog.railway.app/p/cusdis"},
      {title: "Gitlab CI/CD with Railway", url: "https://blog.railway.app/p/gitlab-ci-cd"},
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
        subTitle: "Develop",
        pages: [
          makePage("Databases", "reference"),
          makePage("Environments", "reference"),
          makePage("Projects", "reference"),
          makePage("Services", "reference"),
          makePage("Variables", "reference"),
          makePage("Volumes", "reference"),
        ]
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
          makePage("Monorepo", "reference"),
          makePage("Nixpacks", "reference"),
          makePage("Private Networking", "reference"),
          makePage("Public Domains", "reference"),
          makePage("Scaling", "reference"),
          makePage("TCP Proxy", "reference"),
        ]
      },
      {
        subTitle: "Diagnose",
        pages: [
          makePage("Logging", "reference"),
          makePage("Metrics", "reference"),
          makePage("Webhooks", "reference"),
        ]
      },
      {
        subTitle: "Operations",
        pages: [
          makePage("Accounts", "reference"),
          makePage("Priority Boarding", "reference"),
          makePage("Project Usage", "reference"),
          makePage("Support", "reference"),
          makePage("Teams", "reference"),
          makePage("Usage Limits", "reference"),
        ]
      },
      makePage("CLI API", "reference"),
      makePage("Public API", "reference"),
      makePage("Templates", "reference"),
      makePage("Pricing", "reference"),
    ], 
  },
  {
    title: "Maturity",
    content: [
      makePage("Philosophy", "maturity"),
      makePage("Use Cases", "maturity"),
      makePage("Compliance", "maturity"),
      makePage("Compare to Heroku", "maturity"),
    ],
  },
];
