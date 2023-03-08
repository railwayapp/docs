import { defineDocumentType, makeSource } from "contentlayer/source-files";
import remarkAutoLinkHeadings from "remark-autolink-headings";
import remarkGfm from "remark-gfm";
import remarkSlug from "remark-slug";

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
  },
  computedFields: {
    url: {
      type: "string",
      resolve: doc => `/${doc._raw.flattenedPath}`,
    },
  },
}));

export default makeSource({
  contentDirPath: "src/docs",
  documentTypes: [Page],
  mdx: { remarkPlugins: [remarkSlug, remarkAutoLinkHeadings, remarkGfm] },
});
