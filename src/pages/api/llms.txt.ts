import type { NextApiHandler } from "next";
import { allPages, allGuides } from "content-collections";
import { sidebarContent } from "@/data/sidebar";
import { IPage, ISidebarSection, ISubSection } from "@/types";

const BASE_URL = "https://docs.railway.com";

const SUMMARY =
  "Railway is an all-in-one intelligent cloud provider that makes it easy " +
  "to provision infrastructure, develop locally, and deploy to the cloud. " +
  "These docs cover deploying applications, configuring services, managing " +
  "data, networking, observability, the CLI, and integrating with Railway's API.";

function buildDescriptionMap(): Map<string, string> {
  const map = new Map<string, string>();
  for (const page of allPages) {
    if (page.description) map.set(page.url, page.description);
  }
  for (const guide of allGuides) {
    if (guide.description) map.set(guide.url, guide.description);
  }
  return map;
}

function formatLink(page: IPage, descriptions: Map<string, string>): string {
  const url = `${BASE_URL}${page.slug}.md`;
  const description = descriptions.get(page.slug);
  return description
    ? `- [${page.title}](${url}): ${description}`
    : `- [${page.title}](${url})`;
}

function renderSection(
  section: ISidebarSection,
  descriptions: Map<string, string>,
): string[] {
  const lines: string[] = [];
  const subsections: ISubSection[] = [];

  for (const item of section.content) {
    if ("url" in item) continue;
    if ("subTitle" in item) {
      subsections.push(item);
    } else {
      lines.push(formatLink(item, descriptions));
    }
  }

  for (const sub of subsections) {
    const subTitle =
      typeof sub.subTitle === "string" ? sub.subTitle : sub.subTitle.title;
    lines.push("");
    lines.push(`### ${subTitle}`);
    lines.push("");
    if (typeof sub.subTitle !== "string") {
      lines.push(formatLink(sub.subTitle, descriptions));
    }
    for (const page of sub.pages) {
      if ("url" in page) continue;
      lines.push(formatLink(page, descriptions));
    }
  }

  return lines;
}

const handler: NextApiHandler = (_req, res) => {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=3600, stale-while-revalidate=3600",
  );

  const descriptions = buildDescriptionMap();
  const parts: string[] = [];

  parts.push("# Railway Documentation");
  parts.push("");
  parts.push(`> ${SUMMARY}`);
  parts.push("");
  parts.push(
    "The full contents of these docs are also available as a single file at " +
      `${BASE_URL}/llms-full.txt. Individual pages are available as clean ` +
      "markdown by appending `.md` to any page URL.",
  );
  parts.push("");

  for (const section of sidebarContent) {
    if (section.title) {
      parts.push(`## ${section.title}`);
      parts.push("");
      parts.push(...renderSection(section, descriptions));
      parts.push("");
    } else {
      parts.push(...renderSection(section, descriptions));
      parts.push("");
    }
  }

  res.status(200).send(parts.join("\n"));
};

export default handler;
