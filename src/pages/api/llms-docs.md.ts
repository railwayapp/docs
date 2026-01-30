import type { NextApiHandler } from "next";
import { sidebarContent } from "@/data/sidebar";
import { flattenSidebarContent } from "@/layouts/docs-layout";
import { IPage } from "@/types";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const handler: NextApiHandler = async (req, res) => {
  // Set the content type to text/plain
  res.setHeader("Content-Type", "text/plain");

  // Add caching headers for better LLM consumer performance
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=3600, stale-while-revalidate=86400",
  );

  // Get all pages from the sidebar content
  const allPages = flattenSidebarContent(sidebarContent);

  // Generate the llms.txt content
  let content = "# Railway Documentation\n\n";
  content +=
    "This file contains the complete Railway documentation structure and content for LLM consumption.\n\n";

  // Group pages by their top-level section
  const groupedPages = sidebarContent.reduce((acc, section) => {
    if (section.title) {
      acc[section.title] = [];
    }
    return acc;
  }, {} as Record<string, IPage[]>);

  // Populate the groups
  allPages.forEach((page: IPage) => {
    if ("url" in page || !page.slug) return;

    // Find which section this page belongs to
    for (const section of sidebarContent) {
      if (
        section.content.some(item => {
          if ("slug" in item && item.slug === page.slug) return true;
          if (
            "subTitle" in item &&
            item.pages.some(p => "slug" in p && p.slug === page.slug)
          )
            return true;
          return false;
        })
      ) {
        if (section.title) {
          groupedPages[section.title].push(page);
        }
        break;
      }
    }
  });

  // Generate content for each section
  for (const [sectionTitle, pages] of Object.entries(groupedPages)) {
    if (pages.length === 0) continue;

    content += `# ${sectionTitle}\n`;
    content += `Source: https://docs.railway.com/${sectionTitle.toLowerCase()}\n\n`;

    pages.forEach((page: IPage) => {
      try {
        // Read the markdown file content
        const filePath = path.join(
          process.cwd(),
          "src/docs",
          page.slug.replace(/^\//, "") + ".md",
        );
        const fileContent = fs.readFileSync(filePath, "utf8");
        const { data: frontMatter, content: markdownContent } =
          matter(fileContent);

        content += `# ${page.title}\n`;
        content += `Source: https://docs.railway.com${page.slug}\n\n`;

        if (frontMatter.description) {
          content += `${frontMatter.description}\n\n`;
        }

        // Extract main content sections
        const sections = markdownContent
          .split(/\n##\s+/)
          .filter(Boolean)
          .map(section => section.trim());

        if (sections.length > 0) {
          // Handle the first section (description/intro) without a heading
          const firstSection = sections[0];
          const firstContent = firstSection
            .split("\n")
            .slice(1)
            .join("\n")
            .trim();

          // Process the first section content
          const cleanFirstContent = firstContent
            .replace(/```[\s\S]*?```/g, "") // Remove code blocks
            .replace(/`([^`]+)`/g, "$1") // Remove inline code
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1") // Remove markdown links
            .split("\n\n")
            .filter(para => para.trim().length > 0)
            .join("\n\n");

          content += `${cleanFirstContent}\n\n`;

          // Handle remaining sections with headings
          sections.slice(1).forEach(section => {
            const title = section.split("\n")[0].trim();
            const sectionContent = section
              .split("\n")
              .slice(1)
              .join("\n")
              .trim();

            content += `## ${title}\n\n`;

            // Process the content, removing code blocks and keeping only the text
            const cleanContent = sectionContent
              .replace(/```[\s\S]*?```/g, "") // Remove code blocks
              .replace(/`([^`]+)`/g, "$1") // Remove inline code
              .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1") // Remove markdown links
              .split("\n\n")
              .filter(para => para.trim().length > 0)
              .join("\n\n");

            content += `${cleanContent}\n\n`;
          });
        }

        // Add code examples if they exist
        const codeBlocks = markdownContent.match(/```[\s\S]*?```/g);
        if (codeBlocks && codeBlocks.length > 0) {
          content += "## Code Examples\n\n";
          codeBlocks.forEach(block => {
            const cleanBlock = block
              .replace(/```\w*\n/, "") // Remove language identifier
              .replace(/```$/, "") // Remove closing backticks
              .trim();
            content += `${cleanBlock}\n\n`;
          });
        }

        content += "\n";
      } catch (error) {
        console.error(`Error processing ${page.slug}:`, error);
        // Still include basic information even if we can't read the file
        content += `# ${page.title}\n`;
        content += `Source: https://docs.railway.com${page.slug}\n\n`;
        content += "\n";
      }
    });

    content += "\n";
  }

  // Send the response
  res.status(200).send(content);
};

export default handler;
