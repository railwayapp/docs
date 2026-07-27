import { ISidebarContent, IPage, ISubSection } from "@/types";
import { sidebarContent } from "@/data/sidebar";
import { Slugger } from "./slugger";

export interface Header {
  level: number;
  title: string;
  id: string;
}

export function extractHeadersFromMarkdown(markdown: string): Header[] {
  // Remove both triple-backtick and tilde-fenced code blocks
  const codeBlockRegex = /```[\s\S]*?```|~~~[\s\S]*?~~~/g;
  const markdownWithoutCodeBlocks = markdown.replace(codeBlockRegex, "");

  const headerRegex = /^(#{1,6})\s+(.+)$/gm;
  const headers: Header[] = [];
  const slugger = new Slugger();
  let match;

  while ((match = headerRegex.exec(markdownWithoutCodeBlocks)) !== null) {
    const level = match[1].length;
    const title = match[2].trim();
    const id = slugger.slug(title);

    headers.push({ level, title, id });
  }

  return headers;
}

export function isQuestionHeader(header: Header): boolean {
  return header.title.trim().endsWith("?");
}

export interface FAQItem {
  question: string;
  answer: string;
}

/**
 * Extracts FAQ question-answer pairs from raw markdown.
 * Finds headings that end with "?" and slices the content between
 * that heading and the next heading at the same or higher level.
 * Strips code blocks, MDX/JSX components, images, and HTML tags.
 */
export function extractFAQsFromMarkdown(markdown: string): FAQItem[] {
  // Remove fenced code blocks before processing
  const codeBlockRegex = /```[\s\S]*?```|~~~[\s\S]*?~~~/g;
  const cleaned = markdown.replace(codeBlockRegex, "");

  const lines = cleaned.split("\n");
  const faqs: FAQItem[] = [];
  const headingRegex = /^(#{1,6})\s+(.+)$/;

  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(headingRegex);
    if (!match) continue;

    const level = match[1].length;
    const title = match[2].trim();
    if (!title.endsWith("?")) continue;

    // Collect lines until the next heading at the same or higher level
    const contentLines: string[] = [];
    for (let j = i + 1; j < lines.length; j++) {
      const nextMatch = lines[j].match(headingRegex);
      if (nextMatch && nextMatch[1].length <= level) break;
      contentLines.push(lines[j]);
    }

    const answer = stripMarkdownForSchema(contentLines.join("\n")).trim();
    if (answer.length > 0) {
      faqs.push({ question: title, answer });
    }
  }

  return faqs;
}

/**
 * Strips MDX/JSX components, images, HTML tags, and link syntax
 * to produce plain text suitable for JSON-LD schema.
 */
function stripMarkdownForSchema(text: string): string {
  return (
    text
      // Remove JSX/MDX component blocks (self-closing and paired)
      .replace(/<[A-Z][\s\S]*?\/>/g, "")
      .replace(/<[A-Z][^>]*>[\s\S]*?<\/[A-Z][^>]*>/g, "")
      // Remove markdown images ![alt](url)
      .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
      // Convert markdown links [text](url) to just text
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      // Remove HTML tags
      .replace(/<[^>]+>/g, "")
      // Remove bold/italic markers
      .replace(/\*{1,3}([^*]+)\*{1,3}/g, "$1")
      .replace(/_{1,3}([^_]+)_{1,3}/g, "$1")
      // Remove inline code backticks
      .replace(/`([^`]+)`/g, "$1")
      // Collapse multiple newlines/whitespace
      .replace(/\n{2,}/g, " ")
      .replace(/\s+/g, " ")
  );
}

export function buildBreadcrumbs(
  currentUrl: string,
  sidebar: ISidebarContent = sidebarContent,
): Array<{ name: string; url: string }> {
  const breadcrumbs: Array<{ name: string; url: string }> = [
    { name: "Home", url: "/" },
  ];

  const normalizedUrl = currentUrl.startsWith("/")
    ? currentUrl
    : `/${currentUrl}`;

  // Helper to get the first page slug from content array
  function getFirstPageSlug(
    content: (IPage | ISubSection | { title: string; url: string })[],
  ): string {
    for (const item of content) {
      if ("url" in item) {
        // Skip external links
        continue;
      } else if ("slug" in item) {
        // This is an IPage
        return item.slug;
      } else if ("subTitle" in item) {
        // This is a subsection, check its pages
        for (const page of item.pages) {
          if (!("url" in page)) {
            return page.slug;
          }
        }
      }
    }
    return "";
  }

  // Helper to get the first page slug from a subsection's pages
  function getFirstSubsectionPageSlug(
    pages: (IPage | { title: string; url: string })[],
  ): string {
    for (const page of pages) {
      if (!("url" in page)) {
        return page.slug;
      }
    }
    return "";
  }

  function findPath(
    sections: ISidebarContent,
    path: Array<{ name: string; url: string }> = [],
  ): Array<{ name: string; url: string }> | null {
    for (const section of sections) {
      if (section.title) {
        // Use section.slug if defined, otherwise fall back to first page's slug
        const sectionUrl =
          section.slug || getFirstPageSlug(section.content) || "";
        const newPath = [...path, { name: section.title, url: sectionUrl }];
        const result = findPathInContent(section.content, newPath);
        if (result) return result;
      } else {
        const result = findPathInContent(section.content, path);
        if (result) return result;
      }
    }
    return null;
  }

  function findPathInContent(
    content: (IPage | ISubSection | { title: string; url: string })[],
    path: Array<{ name: string; url: string }>,
  ): Array<{ name: string; url: string }> | null {
    for (const item of content) {
      if ("url" in item) {
        continue;
      } else if ("slug" in item) {
        if (item.slug === normalizedUrl) {
          return [...path, { name: item.title, url: item.slug }];
        }
      } else if ("subTitle" in item) {
        const subTitleName =
          typeof item.subTitle === "string"
            ? item.subTitle
            : item.subTitle.title;
        // Use subTitle.slug if it's an IPage, otherwise fall back to first page's slug
        const subTitleSlug =
          typeof item.subTitle === "string"
            ? getFirstSubsectionPageSlug(item.pages)
            : item.subTitle.slug;

        const newPath = [...path, { name: subTitleName, url: subTitleSlug }];

        if (
          typeof item.subTitle !== "string" &&
          item.subTitle.slug === normalizedUrl
        ) {
          return newPath;
        }

        for (const page of item.pages) {
          if ("url" in page) {
            continue;
          }
          if (page.slug === normalizedUrl) {
            return [...newPath, { name: page.title, url: page.slug }];
          }
        }
      }
    }
    return null;
  }

  const foundPath = findPath(sidebar);
  if (foundPath) {
    return [...breadcrumbs, ...foundPath];
  }

  return breadcrumbs;
}