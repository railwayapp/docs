import { defineDocumentType, makeSource } from "contentlayer/source-files";
import remarkAutoLinkHeadings from "remark-autolink-headings";
import remarkGfm from "remark-gfm";
import remarkSlug from "remark-slug";
import { execSync } from "child_process";

const Page = defineDocumentType(() => ({
  name: "Page",
  filePathPattern: `**/*.md`,
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      description: "The title of the page",
      required: true,
    },
    description: {
      type: "string",
      description: "The description of the page",
      required: true,
    },
  },
  computedFields: {
    url: {
      type: "string",
      resolve: doc => `/${doc._raw.flattenedPath}`,
    },
    lastModified: {
      type: "date",
      resolve: doc => {
        const filePath = `src/docs/${doc._raw.flattenedPath}.md`;
        try {
          const result = execSync(`git log -1 --format=%cI -- "${filePath}"`, {
            encoding: "utf-8",
          }).trim();
          return result || new Date().toISOString();
        } catch {
          return new Date().toISOString();
        }
      },
    },
  },
}));

export default makeSource({
  contentDirPath: "src/docs",
  documentTypes: [Page],
  mdx: { remarkPlugins: [remarkSlug, remarkAutoLinkHeadings, remarkGfm] },
});
