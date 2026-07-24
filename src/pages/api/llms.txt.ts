import type { NextApiHandler } from "next";
import { allPages, allGuides } from "content-collections";
import { sidebarContent } from "@/data/sidebar";
import { ISidebarSection, ISubSection } from "@/types";

const BASE_URL = "https://docs.railway.com";

const SUMMARY =
  "Railway is an all-in-one intelligent cloud provider that makes it easy " +
  "to provision infrastructure, develop locally, and deploy to the cloud. " +
  "These docs cover deploying applications, configuring services, managing " +
  "data, networking, observability, the CLI, and integrating with Railway's API.";

type SourceDoc = {
  url: string;
  title: string;
  description?: string;
};

type LinkTarget = {
  title: string;
  slug: string;
};

function buildSourceMap(): Map<string, SourceDoc> {
  const map = new Map<string, SourceDoc>();
  for (const page of allPages) map.set(page.url, page);
  for (const guide of allGuides) map.set(guide.url, guide);
  return map;
}

function formatLink(
  page: LinkTarget,
  sources: Map<string, SourceDoc>,
  emitted: Set<string>,
): string {
  emitted.add(page.slug);
  const url = `${BASE_URL}${page.slug}.md`;
  const description = sources.get(page.slug)?.description;
  return description
    ? `- [${page.title}](${url}): ${description}`
    : `- [${page.title}](${url})`;
}

function renderSection(
  section: ISidebarSection,
  sources: Map<string, SourceDoc>,
  emitted: Set<string>,
): string[] {
  const lines: string[] = [];
  const subsections: ISubSection[] = [];

  for (const item of section.content) {
    if ("url" in item) continue;
    if ("subTitle" in item) {
      subsections.push(item);
    } else {
      lines.push(formatLink(item, sources, emitted));
    }
  }

  for (const sub of subsections) {
    const subTitle =
      typeof sub.subTitle === "string" ? sub.subTitle : sub.subTitle.title;
    lines.push("");
    lines.push(`### ${subTitle}`);
    lines.push("");
    if (typeof sub.subTitle !== "string") {
      lines.push(formatLink(sub.subTitle, sources, emitted));
    }
    for (const page of sub.pages) {
      if ("url" in page) continue;
      lines.push(formatLink(page, sources, emitted));
    }
  }

  return lines;
}

const topicLabel = (topic: string) =>
  topic === "ai" ? "AI" : topic.charAt(0).toUpperCase() + topic.slice(1);

const handler: NextApiHandler = (_req, res) => {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=3600, stale-while-revalidate=3600",
  );

  const sources = buildSourceMap();
  const emitted = new Set<string>();
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
      // Section hubs (e.g. /platform) are real pages, but the sidebar only
      // carries them as a section `slug`, so link them explicitly.
      const hub = section.slug ? sources.get(section.slug) : undefined;
      if (hub) {
        parts.push(formatLink({ title: hub.title, slug: hub.url }, sources, emitted));
      }
      parts.push(...renderSection(section, sources, emitted));
      parts.push("");
    } else {
      parts.push(...renderSection(section, sources, emitted));
      parts.push("");
    }
  }

  // The sidebar is a curated subset; anything it does not surface would
  // otherwise silently vanish from this index (49 of 85 guides at the time
  // of writing). Emit the remainder so coverage never depends on curation.
  const missedGuides = allGuides.filter((guide) => !emitted.has(guide.url));
  const missedPages = allPages.filter((page) => !emitted.has(page.url));

  if (missedGuides.length > 0) {
    parts.push("## More guides");
    parts.push("");
    const byTopic = new Map<string, typeof missedGuides>();
    for (const guide of missedGuides) {
      const topic = guide.topic || "other";
      byTopic.set(topic, [...(byTopic.get(topic) ?? []), guide]);
    }
    for (const topic of Array.from(byTopic.keys()).sort()) {
      parts.push(`### ${topicLabel(topic)}`);
      parts.push("");
      const guides = [...byTopic.get(topic)!].sort((a, b) =>
        a.title.localeCompare(b.title),
      );
      for (const guide of guides) {
        parts.push(
          formatLink({ title: guide.title, slug: guide.url }, sources, emitted),
        );
      }
      parts.push("");
    }
  }

  if (missedPages.length > 0) {
    parts.push("## More pages");
    parts.push("");
    const pages = [...missedPages].sort((a, b) => a.url.localeCompare(b.url));
    for (const page of pages) {
      parts.push(
        formatLink({ title: page.title, slug: page.url }, sources, emitted),
      );
    }
    parts.push("");
  }

  res.status(200).send(parts.join("\n"));
};

export default handler;
