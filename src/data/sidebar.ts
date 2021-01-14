import { IPage, ISidebarContent } from "../types";

const makePage = (title: string, subPath?: string, slug?: string): IPage => ({
  title,
  slug:
    slug ??
    `/${subPath != null ? subPath + "/" : ""}${title
      .toLowerCase()
      .replace(/\s+/g, "-")}`,
});

export const sidebarContent: ISidebarContent = [
  {
    title: "General",
    pages: [
      makePage("Introduction", undefined, "/"),
      makePage("Getting Started"),
      makePage("Environments"),
      makePage("Projects"),
    ],
  },
  {
    title: "CLI",
    pages: [
      makePage("Quick Start", "cli"),
      makePage("Installation", "cli"),
      makePage("API Reference", "cli"),
    ],
  },
  {
    title: "Deployments",
    pages: [
      makePage("Railway Up", "deployment", "/deployment/up"),
      makePage("GitHub Triggers", "deployment"),
      makePage("Builds", "deployment"),
      makePage("Serverless", "deployment"),
      makePage("Self Hosted Server", "deployment"),
      makePage("Project Tokens", "deployment"),
      makePage("Procfiles", "deployment"),
    ],
  },
  {
    title: "Plugins",
    pages: [
      makePage("EnvVars", "plugins"),
      makePage("PostgreSQL", "plugins"),
      makePage("MySQL", "plugins"),
      makePage("Redis", "plugins"),
      makePage("MongoDB", "plugins"),
      makePage("Elasticsearch", "plugins"),
    ],
  },
  {
    pages: [makePage("Examples")],
  },
];
