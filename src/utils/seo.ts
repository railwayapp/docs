import { ISidebarContent, IPage, ISubSection } from "@/types";
import { sidebarContent } from "@/data/sidebar";

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
  const seenIds = new Map<string, number>(); // Track ID occurrences for deduplication
  let match;

  while ((match = headerRegex.exec(markdownWithoutCodeBlocks)) !== null) {
    const level = match[1].length;
    const title = match[2].trim();
    let id = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

    // Handle duplicate IDs by appending a suffix
    const count = seenIds.get(id) || 0;
    if (count > 0) {
      id = `${id}-${count}`;
    }
    seenIds.set(id.replace(/-\d+$/, ""), count + 1);

    headers.push({ level, title, id });
  }

  return headers;
}

export function isQuestionHeader(header: Header): boolean {
  return header.title.trim().endsWith("?");
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

export function getLastModifiedDate(filePath?: string): string {
  return new Date().toISOString();
}
