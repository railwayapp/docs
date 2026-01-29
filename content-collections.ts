import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import { z } from "zod";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkGfm from "remark-gfm";
import { rehypeCodeBlock } from "./src/plugins/rehype-code-block";

const pages = defineCollection({
  name: "pages",
  directory: "src/docs",
  include: "**/*.md",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    content: z.string(),
  }),
  transform: async (doc, ctx) => {
    const code = await compileMDX(ctx, doc, {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        rehypeSlug,
        [rehypeAutolinkHeadings, { behavior: "prepend" }],
        rehypeCodeBlock,
      ],
    });
    return {
      ...doc,
      url: `/${doc._meta.path}`,
      body: {
        code,
        raw: doc.content,
      },
      _raw: {
        flattenedPath: doc._meta.path,
        sourceFilePath: doc._meta.filePath,
        sourceFileName: doc._meta.fileName,
        sourceFileDir: doc._meta.directory,
      },
    };
  },
});

export default defineConfig({
  collections: [pages],
});
