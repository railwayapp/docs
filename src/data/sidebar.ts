import { IPage, ISidebarContent } from "../types";

const makePage = (title: string, category?: string, slug?: string): IPage => ({
  title,
  category,
  slug:
    slug ??
    `/${category != null ? category + "/" : ""}${title
      .toLowerCase()
      .replace(/\s+/g, "-")}`,
});

export const sidebarContent: ISidebarContent = [
  // The goal is to have the docs be in a narrative structure
  {
    title: "",
    pages: [
      makePage("Introduction", undefined, "/"),
      makePage("Getting Started", undefined),
    ],
  },
  {
    title: "Develop",
    pages: [
      makePage("Projects", "develop"),
      makePage("Services", "develop"),
      makePage("CLI", "develop"),
      makePage("Variables", "develop"),
      makePage("Environments", "develop"),
    ],
  },
  {
    title: "Deploy",
    pages: [
      makePage("Railway Up", "deploy"),
      makePage("Builds", "deploy"),
      makePage("Deployments", "deploy"),
      makePage("Healthchecks", "deploy"),
      makePage("Dockerfiles", "deploy"),
      makePage("Exposing Your App", "deploy"),
      makePage("Networking", "deploy"),
      makePage("Monorepo", "deploy"),
      makePage("Integrations", "deploy"),
      makePage("Config as Code", "deploy"),
      makePage("Deploy on Railway Button", "deploy"),
    ],
  },
  {
    title: "Diagnose",
    pages: [
      makePage("Metrics", "diagnose"),
      makePage("Webhooks", "diagnose"),
      makePage("Project Usage", "diagnose"),
    ],
  },
  {
    title: "Databases",
    pages: [
      makePage("Database View", "databases"),
      makePage("PostgreSQL", "databases"),
      makePage("MySQL", "databases"),
      makePage("Redis", "databases"),
      makePage("MongoDB", "databases"),
    ],
  },
  {
    title: "Troubleshoot",
    pages: [makePage("Fixing Common Errors", "troubleshoot")],
  },
  {
    title: "Reference",
    pages: [
      makePage("Private Networking", "reference"),
      makePage("Volumes", "reference"),
      makePage("Cron Jobs", "reference"),
      makePage("Pricing", "reference"),
      makePage("Accounts", "reference"),
      makePage("Teams", "reference"),
      makePage("CLI API", "reference"),
      makePage("Public API", "reference"),
      makePage("Templates", "reference"),
      makePage("Guides", "reference"),
      makePage("Usecases", "reference"),
      makePage("Support", "reference"),
      makePage("Priority Boarding", "reference"),
      makePage("Compare to Heroku", "reference"),
    ],
  },
];
