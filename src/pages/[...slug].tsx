import { Banner, PriorityBoardingBanner } from "@/components/Banner";
import { CodeBlock } from "@/components/CodeBlock";
import Layout from "@/mdxLayouts/index";
import { FrontMatter } from "@/types";
import { postFilePaths, POSTS_PATH } from "@/utils/mdxUtils";
import fs from "fs";
import matter from "gray-matter";
import { GetStaticProps } from "next";
import { MDXRemote, MDXRemoteProps } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import { default as NextImage, ImageProps } from "next/legacy/image";
import Link from "next/link";
import path from "path";
import remarkAutolinkHeadings from "remark-autolink-headings";
import remarkSlug from "remark-slug";

const Image = (props: ImageProps) => (
  <a
    tw="block xl:-mx-8"
    href={props.src as string}
    target="_blank"
    rel="noopener"
  >
    <NextImage {...props} />
  </a>
);

const components = {
  pre: CodeBlock,
  Image,
  Banner,
  Link,
  PriorityBoardingBanner,
};

export default function PostPage({
  source,
  frontMatter,
}: {
  source: Omit<MDXRemoteProps, "components">;
  frontMatter: FrontMatter;
}) {
  return (
    <Layout frontMatter={frontMatter}>
      <MDXRemote {...source} components={components} />
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const postFilePath = path.join(
    POSTS_PATH,
    `${(params?.slug as string[]).join("/")}.md`,
  );
  const source = fs.readFileSync(postFilePath);

  const { content, data } = matter(source);

  const mdxSource = await serialize(content, {
    // Optionally pass remark/rehype plugins
    mdxOptions: {
      remarkPlugins: [remarkAutolinkHeadings, remarkSlug],
      rehypePlugins: [],
    },
    scope: data,
  });
  return {
    props: {
      source: mdxSource,
      frontMatter: data,
    },
  };
};

export const getStaticPaths = async () => {
  const paths = postFilePaths.map(path => path.replace(/\.mdx?$/, ""));
  return { paths, fallback: false };
};
