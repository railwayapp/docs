import type { NextApiHandler } from "next";
import { allPages, allGuides } from "content-collections";
import { sidebarContent } from "@/data/sidebar";
import { IPage, ISidebarSection } from "@/types";

const BASE_URL = "https://docs.railway.com";

const SUMMARY =
  "Railway is an all-in-one intelligent cloud provider that makes it easy " +
  "to provision infrastructure, develop locally, and deploy to the cloud. " +
  "This file contains the full text of the Railway documentation, intended " +
  "for LLM consumption.";

type SourcePage = {
  url: string;
  description?: string;
  body: { raw: string };
};

function buildSourceMap(): Map<string, SourcePage> {
  const map = new Map<string, SourcePage>();
  for (const page of allPages) map.set(page.url, page);
  for (const guide of allGuides) map.set(guide.url, guide);
  return map;
}

function demoteHeadings(markdown: string, levels: number): string {
  const lines = markdown.split("\n");
  let inFence = false;
  const out: string[] = [];
  for (const line of lines) {
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      out.push(line);
      continue;
    }
    if (!inFence) {
      const match = line.match(/^(#{1,6})(\s)/);
      if (match) {
        const newLevel = Math.min(6, match[1].length + levels);
        out.push("#".repeat(newLevel) + line.slice(match[1].length));
        continue;
      }
    }
    out.push(line);
  }
  return out.join("\n");
}

function renderPage(
  page: IPage,
  sources: Map<string, SourcePage>,
): string[] {
  const lines: string[] = [];
  const source = sources.get(page.slug);
  const url = `${BASE_URL}${page.slug}.md`;

  lines.push(`### ${page.title}`);
  lines.push("");
  lines.push(`Source: ${url}`);
  lines.push("");

  if (!source) {
    return lines;
  }

  if (source.description) {
    lines.push(source.description);
    lines.push("");
  }

  lines.push(demoteHeadings(source.body.raw.trim(), 2));
  lines.push("");

  return lines;
}

function renderSection(
  section: ISidebarSection,
  sources: Map<string, SourcePage>,
): string[] {
  const lines: string[] = [];
  for (const item of section.content) {
    if ("url" in item) continue;
    if ("subTitle" in item) {
      const label =
        typeof item.subTitle === "string"
          ? item.subTitle
          : item.subTitle.title;
      lines.push(`---`, `<!-- ${label} -->`, "");
      if (typeof item.subTitle !== "string") {
        lines.push(...renderPage(item.subTitle, sources));
      }
      for (const page of item.pages) {
        if ("url" in page) continue;
        lines.push(...renderPage(page, sources));
      }
    } else {
      lines.push(...renderPage(item, sources));
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

  const sources = buildSourceMap();
  const parts: string[] = [];

  parts.push("# Railway Documentation");
  parts.push("");
  parts.push(`> ${SUMMARY}`);
  parts.push("");

  for (const section of sidebarContent) {
    if (section.title) {
      parts.push(`## ${section.title}`);
      parts.push("");
    }
    parts.push(...renderSection(section, sources));
  }

  res.status(200).send(parts.join("\n"));
};

export default handler;
