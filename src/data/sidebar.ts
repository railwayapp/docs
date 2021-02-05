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
  {
    title: "General",
    pages: [
      makePage("Introduction", undefined, ["what", "railway"], "/"),
      makePage("Getting Started", undefined, ["start"]),
      makePage("Environments", undefined, ["plugins", "containers"]),
      makePage("Projects"),
      makePage("Starters"),
    ],
  },
  {
    title: "CLI",
    pages: [
      makePage("Quick Start", "cli"),
      makePage("Installation", "cli", ["install"]),
      makePage("API Reference", "cli"),
    ],
  },
  {
    title: "Deployments",
    pages: [
      makePage("Railway Up", "deployment", ["deploy"], "/deployment/up"),
      makePage("GitHub Triggers", "deployment", ["git"]),
      makePage("Builds", "deployment", [
        "node",
        "python",
        "ruby",
        "golang",
        "java",
        "procfile",
        "deploy",
      ]),
      makePage("Serverless", "deployment", ["vercel", "netlify"]),
      makePage("Self Hosted Server", "deployment", [
        "aws",
        "digital ocean",
        "gcp",
      ]),
      makePage("Project Tokens", "deployment", ["ci", "testing"]),
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
];
