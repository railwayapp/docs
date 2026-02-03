import { ISidebarContent, IPage, ISubSection } from "@/types";
import { sidebarContent } from "@/data/sidebar";

export interface Header {
  level: number;
  title: string;
  id: string;
}

export function extractHeadersFromMarkdown(markdown: string): Header[] {
  const codeBlockRegex = /```[\s\S]*?```/g;
  const markdownWithoutCodeBlocks = markdown.replace(codeBlockRegex, "");

  const headerRegex = /^(#{1,6})\s+(.+)$/gm;
  const headers: Header[] = [];
  let match;

  while ((match = headerRegex.exec(markdownWithoutCodeBlocks)) !== null) {
    const level = match[1].length;
    const title = match[2].trim();
    const id = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

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
    { name: "Home", url: "https://docs.railway.com" },
  ];

  const normalizedUrl = currentUrl.startsWith("/")
    ? currentUrl
    : `/${currentUrl}`;

  function findPath(
    sections: ISidebarContent,
    path: Array<{ name: string; url: string }> = [],
  ): Array<{ name: string; url: string }> | null {
    for (const section of sections) {
      if (section.title) {
        const newPath = [...path, { name: section.title, url: "" }];
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
          return [...path, { name: item.title, url: `https://docs.railway.com${item.slug}` }];
        }
      } else if ("subTitle" in item) {
        const subTitleName =
          typeof item.subTitle === "string"
            ? item.subTitle
            : item.subTitle.title;
        const subTitleSlug =
          typeof item.subTitle === "string"
            ? ""
            : item.subTitle.slug;

        const newPath = subTitleSlug
          ? [...path, { name: subTitleName, url: `https://docs.railway.com${subTitleSlug}` }]
          : [...path, { name: subTitleName, url: "" }];

        if (subTitleSlug === normalizedUrl) {
          return newPath;
        }

        for (const page of item.pages) {
          if ("url" in page) {
            continue;
          }
          if (page.slug === normalizedUrl) {
            return [
              ...newPath,
              { name: page.title, url: `https://docs.railway.com${page.slug}` },
            ];
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


