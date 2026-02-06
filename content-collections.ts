import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import { z } from "zod";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkGfm from "remark-gfm";
import { rehypeCodeBlock } from "./src/plugins/rehype-code-block";
import { execSync } from "child_process";

const pages = defineCollection({
  name: "pages",
  directory: "content/docs",
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
    const filePath = `content/docs/${doc._meta.filePath}`;
    let lastModified: string;
    try {
      const result = execSync(`git log -1 --format=%cI -- "${filePath}"`, {
        encoding: "utf-8",
      }).trim();
      lastModified = result || new Date().toISOString();
    } catch {
      lastModified = new Date().toISOString();
    }

    return {
      ...doc,
      url: `/${doc._meta.path}`,
      lastModified,
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

const guides = defineCollection({
  name: "guides",
  directory: "content/guides",
  include: "**/*.md",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    content: z.string(),
    date: z.string().optional(),
    author: z
      .object({
        name: z.string(),
        avatar: z.string().optional(),
        link: z.string().optional(),
      })
      .optional(),
    tags: z.array(z.string()).optional(),
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
    const filePath = `content/guides/${doc._meta.filePath}`;
    let lastModified: string;
    try {
      const result = execSync(`git log -1 --format=%cI -- "${filePath}"`, {
        encoding: "utf-8",
      }).trim();
      lastModified = result || new Date().toISOString();
    } catch {
      lastModified = new Date().toISOString();
    }

    return {
      ...doc,
      url: `/guides/${doc._meta.path}`,
      lastModified,
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
  collections: [pages, guides],
});
