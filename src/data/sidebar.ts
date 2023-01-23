import { IPage, ISidebarContent } from "../types";

const makePage = (
  title: string,
  category?: string,
  tags?: string[],
  slug?: string,
): IPage => ({
  title,
  tags,
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
      makePage("Introduction", undefined, ["home", "railway", "index"], "/"),
      makePage("Getting Started", undefined, [
        "introduction",
        "tutorial",
        "getting started",
      ]),
    ],
  },
  {
    title: "Develop",
    pages: [
      makePage("Projects", "develop", [
        "project",
        "dashboard",
        "canvas",
        "invite",
      ]),
      makePage("Services", "develop", [
        "services",
        "monorepo",
        "repo",
        "domains",
        "databases",
      ]),
      makePage("CLI", "develop", ["CLI", "command", "line"]),
      makePage("Variables", "develop", ["railway run", "variables"]),
      makePage("Environments", "develop", [
        "staging",
        "create env",
        "environment",
      ]),
    ],
  },
  {
    title: "Deploy",
    pages: [
      makePage("Railway Up", "deploy", [
        "deploying from command line",
        "live",
        "deploy",
        "up",
      ]),
      makePage("Builds", "deploy", [
        "builds",
        "procfile",
        "buildpacks",
        "heroku",
        "paketo",
        "nixpacks",
      ]),
      makePage("Deployments", "deploy", ["logs", "singleton", "rollback"]),
      makePage("Healthchecks", "deploy", ["health", "healthcheck"]),
      makePage("Dockerfiles", "deploy", ["docker, compose"]),
      makePage("Exposing Your App", "deploy", [
        "port",
        "bad gateway",
        "internet",
        "custom domain",
        "cloudflare",
      ]),
      makePage("Monorepo", "deploy", ["start command", "yarn workspace"]),
      makePage("Integrations", "deploy", [
        "vercel",
        "netlify",
        "project tokens",
        "ci",
        "continuous integration",
        "aws",
        "gcp",
        "azure",
        "digital ocean",
        "doppler",
      ]),
      makePage("Config as Code", "deploy", ["CaC", "IaC", "service", "config"]),
    ],
  },
  {
    title: "Diagnose",
    pages: [
      makePage("Metrics", "diagnose", ["metrics", "logs"]),
      makePage("Webhooks", "diagnose", ["webhooks", "notifcations"]),
      makePage("Project Usage", "diagnose", ["usage", "pricing"]),
    ],
  },
  {
    title: "Databases",
    pages: [
      makePage("Database View", "databases", [
        "management view",
        "plugin view",
        "create table",
      ]),
      makePage("PostgreSQL", "databases", ["database", "sql"]),
      makePage("MySQL", "databases", ["database", "sql"]),
      makePage("Redis", "databases", ["key", "value", "store", "cache"]),
      makePage("MongoDB", "databases", ["database", "nosql"]),
    ],
  },
  {
    title: "Reference",
    pages: [
      makePage("Pricing", "reference", ["pricing"]),
      makePage("Plans", "reference", ["limits", "plans"]),
      makePage("Accounts", "reference", ["accounts"]),
      makePage("Teams", "reference", ["teams"]),
      makePage("CLI API", "reference", ["cli"]),
      makePage("Public API", "reference", ["api"]),
      makePage("Templates", "reference", ["templates"]),
      makePage("Guides", "reference", ["guides"]),
      makePage("Usecases", "reference", ["usecases"]),
      makePage("Priority Boarding", "reference", ["priority", "boarding"]),
      makePage("Compare to Heroku", "reference", ["heroku", "vs"]),
    ],
  },
];
