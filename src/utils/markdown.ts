import { FrontMatter } from "@/types";

/**
 * Reconstructs a complete markdown file with YAML frontmatter
 * @param frontMatter - The frontmatter object containing title, description, etc.
 * @param rawMarkdown - The raw markdown content (without frontmatter)
 * @returns Complete markdown file as a string
 */
export const reconstructMarkdownWithFrontmatter = (
  frontMatter: FrontMatter,
  rawMarkdown: string,
): string => {
  const frontmatterLines: string[] = [];
  
  if (frontMatter.title) {
    frontmatterLines.push(`title: ${frontMatter.title}`);
  }
  
  if (frontMatter.description) {
    frontmatterLines.push(`description: ${frontMatter.description}`);
  }
  
  // Only add frontmatter if there are fields to include
  if (frontmatterLines.length === 0) {
    return rawMarkdown;
  }
  
  return `---\n${frontmatterLines.join('\n')}\n---\n${rawMarkdown}`;
};

