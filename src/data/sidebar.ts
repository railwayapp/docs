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
    pages: [
      makePage("Home", undefined, "/"),
      makePage("Quick Start", undefined),
    ],
  },
  {
    title: "Overview",
    pages: [
      makePage("About Railway", "overview"),
      makePage("The Basics", "overview"),
      makePage("Advanced Concepts", "overview"),
    ],
  },
  {
    title: "Maturity",
    pages: [
      makePage("Philosophy", "maturity"),
      makePage("Use Cases", "maturity"),
      makePage("Compliance", "maturity"),
    ],
  },
  {
    title: "Databases",
    pages: [
      makePage("Bring Your Own Database", "databases"),
      makePage("PostgreSQL", "databases"),
      makePage("MySQL", "databases"),
      makePage("Redis", "databases"),
      makePage("MongoDB", "databases"),
      makePage("Database View", "databases"),
    ],
  },
  {
    title: "How To",
    pages: [
      makePage("Overview", "how-to"),
      makePage("Deploy a GitHub Repo", "how-to"),
      makePage("Configure Replicas", "how-to"),
      makePage("Setup Private Networking", "how-to"),
      makePage("Configure Health Checks", "how-to"),
    ],
  },
  {
    title: "Tutorials",
    pages: [
      makePage("Introduction to Tutorials", 'tutorials'),
      makePage("Migrate from Heroku", 'tutorials'),
      makePage("Database Migration Guide", 'tutorials'),
    ]
  },
  // {
  //   title: "Deploy",
  //   pages: [
  //     makePage("Railway Up", "deploy"),
  //     makePage("Builds", "deploy"),
  //     makePage("Deployments", "deploy"),
  //     makePage("Healthchecks", "deploy"),
  //     makePage("Dockerfiles", "deploy"),
  //     makePage("Exposing Your App", "deploy"),
  //     makePage("Networking", "deploy"),
  //     makePage("Monorepo", "deploy"),
  //     makePage("Logging", "deploy"),
  //     makePage("Integrations", "deploy"),
  //     makePage("Config as Code", "deploy"),
  //     makePage("Deploy on Railway Button", "deploy"),
  //   ],
  // },
  // {
  //   title: "Diagnose",
  //   pages: [
  //     makePage("Metrics", "diagnose"),
  //     makePage("Webhooks", "diagnose"),
  //     makePage("Project Usage", "diagnose"),
  //   ],
  // },
  // {
  //   title: "Troubleshoot",
  //   pages: [makePage("Fixing Common Errors", "troubleshoot")],
  // },

  {
    title: "Reference",
    pages: [
      makePage("Private Networking", "reference"),
      makePage("Volumes", "reference"),
      makePage("Cron Jobs", "reference"),
      makePage("Pricing", "reference"),
      makePage("App Sleeping", "reference"),
      makePage("Usage Limits", "reference"),
      makePage("Accounts", "reference"),
      makePage("Teams", "reference"),
      makePage("CLI API", "reference"),
      makePage("Public API", "reference"),
      makePage("Templates", "reference"),
      makePage("Guides", "reference"),
      makePage("Support", "reference"),
      makePage("Priority Boarding", "reference"),
      makePage("Compare to Heroku", "reference"),
    ],
  },

];
