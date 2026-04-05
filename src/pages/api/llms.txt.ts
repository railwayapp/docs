import type { NextApiHandler } from "next";
import { sidebarContent } from "@/data/sidebar";
import { IPage, ISidebarSection, ISubSection } from "@/types";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BASE_URL =
  process.env.NEXT_PUBLIC_RAILWAY_DOCS_URL || "https://docs.railway.com";

/**
 * Reads the frontmatter description for a given page slug.
 */
function getPageDescription(slug: string): string | undefined {
  const possiblePaths = [
    path.join(process.cwd(), "content/docs", slug.replace(/^\//, "") + ".md"),
    path.join(
      process.cwd(),
      "content/guides",
      slug.replace(/^\/guides\//, "") + ".md",
    ),
  ];

  for (const filePath of possiblePaths) {
    try {
      const fileContent = fs.readFileSync(filePath, "utf8");
      const { data: frontMatter } = matter(fileContent);
      return frontMatter.description;
    } catch {
      continue;
    }
  }

  return undefined;
}

/**
 * Extracts all pages from a sidebar section, handling subsections.
 */
function getSectionPages(section: ISidebarSection): IPage[] {
  const pages: IPage[] = [];
  for (const item of section.content) {
    if ("url" in item) {
      continue; // Skip external links
    } else if ("subTitle" in item) {
      const sub = item as ISubSection;
      if (typeof sub.subTitle !== "string") {
        pages.push(sub.subTitle);
      }
      for (const page of sub.pages) {
        if (!("url" in page)) {
          pages.push(page);
        }
      }
    } else {
      pages.push(item);
    }
  }
  return pages;
}

const handler: NextApiHandler = async (_req, res) => {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=3600, stale-while-revalidate=86400",
  );

  let content = `# Railway Documentation\n\n`;
  content += `> Railway is a deployment platform that lets you provision infrastructure, develop locally with that infrastructure, and deploy to the cloud.\n\n`;
  content += `- [Full documentation](${BASE_URL}/llms-full.txt): The complete Railway documentation with all page content inlined\n\n`;

  for (const section of sidebarContent) {
    const sectionTitle = section.title || "Getting Started";
    const pages = getSectionPages(section);

    if (pages.length === 0) continue;

    content += `## ${sectionTitle}\n\n`;

    for (const page of pages) {
      const url = `${BASE_URL}${page.slug}`;
      const description = getPageDescription(page.slug);
      if (description) {
        content += `- [${page.title}](${url}): ${description}\n`;
      } else {
        content += `- [${page.title}](${url})\n`;
      }
    }

    content += "\n";
  }

  res.status(200).send(content.trimEnd() + "\n");
};

export default handler;
