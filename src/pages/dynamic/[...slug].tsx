import {
  Banner,
  PriorityBoardingBanner,
  DeprecationBanner,
} from "@/components/Banner";
import { Collapse } from "@/components/Collapse";
import { Pre, CodeBlock, CodeTab } from "@/components/CodeBlock";
import { Frame } from "@/components/Frame";
import { Steps, Step } from "@/components/Steps";
import {
  Tree,
  TreeNode,
  TreeNodeTrigger,
  TreeNodeContent,
  TreeExpander,
  TreeIcon,
  TreeLabel,
} from "@/components/Tree";
import { FileTree } from "@/components/FileTree";
import { Tooltip } from "@/components/Tooltip";
import Layout from "@/mdxLayouts/index";
import { allPages, Page } from "content-collections";
import { useMDXComponent } from "@content-collections/mdx/react";
import Link from "next/link";
import { Image } from "@/components/Image";
import { InlineCode } from "@/components/InlineCode";
import { H2, H3, H4 } from "@/components/Header";
import { Anchor } from "@/components/Anchor";
import { GetServerSidePropsContext } from "next";
import { TallyButton } from "@/components/TallyButton";
import { reconstructMarkdownWithFrontmatter } from "@/utils/markdown";

const components: Record<string, React.ElementType> = {
  Collapse,
  Image,
  Banner,
  Link,
  PriorityBoardingBanner,
  DeprecationBanner,
  a: Anchor,
  h2: H2,
  h3: H3,
  h4: H4,
  TallyButton,
  pre: Pre,
  code: InlineCode,
  CodeBlock,
  CodeTab,
  Frame,
  Steps,
  Step,
  Tree,
  TreeNode,
  TreeNodeTrigger,
  TreeNodeContent,
  TreeExpander,
  TreeIcon,
  TreeLabel,
  FileTree,
  Tooltip,
};

export default function PostPage({
  page,
  rawMarkdown,
}: {
  page: Page;
  rawMarkdown: string;
}) {
  const MDXContent = useMDXComponent(page.body.code);

  return (
    <Layout
      frontMatter={{
        title: page.title,
        description: page.description,
        url: page.url,
      }}
      rawMarkdown={rawMarkdown}
    >
      <MDXContent components={components} />
    </Layout>
  );
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const { slug } = context.params as { slug: string[] };
  const page = allPages.find(p => p.url === `/${slug.join("/")}`);

  if (!page) {
    return {
      notFound: true,
    };
  }

  // Return raw markdown if format=md
  if (context.query.format === "md") {
    const markdown = reconstructMarkdownWithFrontmatter(
      { title: page.title, description: page.description, url: page.url },
      page.body.raw,
    );
    context.res.setHeader("Content-Type", "text/markdown; charset=utf-8");
    context.res.write(markdown);
    context.res.end();
    return { props: {} };
  }

  return {
    props: {
      page,
      rawMarkdown: page.body.raw,
    },
  };
};
