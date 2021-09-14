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
      makePage("CLI", "develop", ["CLI", "command", "line"]),
      makePage("Projects", "develop", ["project", "dashboard", "repo"]),
      makePage("Plugins", "develop", ["database", "plugin", "db"]),
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
      makePage("Deployments", "deploy", ["logs", "singleton", "rollback"]),
      makePage("Builds", "deploy", [
        "builds",
        "procfile",
        "buildpacks",
        "heroku",
      ]),
      makePage("NodeJS", "deploy", ["node", "javascript"]),
      makePage("Python", "deploy", ["python", "requirements.txt"]),
      makePage("Go", "deploy", ["go"]),
      makePage("Ruby", "deploy", ["ruby"]),
      makePage("Java", "deploy", ["java", "maven"]),
      makePage("Docker", "deploy", ["docker, compose"]),
      makePage("Exposing Your App", "deploy", [
        "port",
        "bad gateway",
        "internet",
        "custom domain",
        "cloudflare",
      ]),

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
      ]),
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
    title: "Plugins",
    pages: [
      makePage("PostgreSQL", "plugins", ["database", "sql"]),
      makePage("MySQL", "plugins", ["database", "sql"]),
      makePage("Redis", "plugins", ["key", "value", "store", "cache"]),
      makePage("MongoDB", "plugins", ["database", "nosql"]),
    ],
  },
  {
    title: "Reference",
    pages: [
      makePage("Accounts", "reference", ["accounts"]),
      makePage("Teams", "reference", ["teams"]),
      makePage("CLI API", "reference", ["cli"]),
      makePage("Starters", "reference", ["starters"]),
      makePage("Guides", "reference", ["guides"]),
      makePage("Limits", "reference", ["limits"]),
    ],
  },
];
