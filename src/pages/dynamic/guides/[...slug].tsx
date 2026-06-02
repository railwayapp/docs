import {
  Banner,
  PriorityBoardingBanner,
  DeprecationBanner,
} from "@/components/banner";
import { Collapse } from "@/components/collapse";
import { Pre, CodeBlock, CodeTab } from "@/components/code-block";
import { GraphQLCodeTabs } from "@/components/graphql-code-tabs";
import { Frame } from "@/components/frame";
import { Steps, Step } from "@/components/steps";
import {
  Tree,
  TreeNode,
  TreeNodeTrigger,
  TreeNodeContent,
  TreeExpander,
  TreeIcon,
  TreeLabel,
} from "@/components/tree";
import { FileTree } from "@/components/file-tree";
import { Tooltip } from "@/components/tooltip";
import { GuidesLayout } from "@/layouts/guides-layout";
import { allGuides, Guide } from "content-collections";
import { useMDXComponent } from "@content-collections/mdx/react";
import Link from "next/link";
import { Image } from "@/components/image";
import { H2, H3, H4 } from "@/components/header";
import { Anchor } from "@/components/anchor";
import { GetServerSidePropsContext } from "next";
import { TallyButton } from "@/components/tally-button";
import { reconstructMarkdownWithFrontmatter } from "@/utils/markdown";

const components: Record<string, React.ElementType> = {
  Collapse,
  Image,
  img: Image,
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
  CodeBlock,
  CodeTab,
  GraphQLCodeTabs,
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

export default function DynamicGuidePage({
  guide,
  rawMarkdown,
}: {
  guide: Guide;
  rawMarkdown: string;
}) {
  const MDXContent = useMDXComponent(guide.body.code);

  return (
    <GuidesLayout
      frontMatter={{
        title: guide.title,
        description: guide.description,
        url: guide.url,
        author: guide.author,
        tags: guide.tags,
      }}
      rawMarkdown={rawMarkdown}
    >
      <MDXContent components={components} />
    </GuidesLayout>
  );
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const { slug } = context.params as { slug: string[] };
  const guide = allGuides.find(g => g.url === `/guides/${slug.join("/")}`);

  if (!guide) {
    return { notFound: true };
  }

  // Return raw markdown if format=md
  if (context.query.format === "md") {
    const markdown = reconstructMarkdownWithFrontmatter(
      { title: guide.title, description: guide.description, url: guide.url },
      guide.body.raw,
    );
    context.res.setHeader("Content-Type", "text/markdown; charset=utf-8");
    context.res.write(markdown);
    context.res.end();
    return { props: {} };
  }

  // Advertise markdown alternate via Link header for HTML responses
  const markdownUrl = `https://docs.railway.com${guide.url}.md`;
  context.res.setHeader(
    "Link",
    `<${markdownUrl}>; rel="alternate"; type="text/markdown"`,
  );

  return {
    props: {
      guide,
      rawMarkdown: guide.body.raw,
    },
  };
};
