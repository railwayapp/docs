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
import Layout from "@/mdxLayouts/index";
import { allPages, Page } from "content-collections";
import { useMDXComponent } from "@content-collections/mdx/react";
import Link from "next/link";
import { Image } from "@/components/image";
import { InlineCode } from "@/components/inline-code";
import { H2, H3, H4 } from "@/components/header";
import { Anchor } from "@/components/anchor";
import { GetStaticPaths, GetStaticProps } from "next";
import { Props as InlineCodeProps } from "@/components/inline-code";
import { TallyButton } from "@/components/tally-button";

const components: Record<string, React.ElementType> = {
  Collapse,
  Image,
  img: Image, // Standard markdown images ![](url) also use Image component
  Banner,
  Link,
  PriorityBoardingBanner,
  DeprecationBanner,
  a: Anchor,
  h2: H2,
  h3: H3,
  h4: H4,
  TallyButton,
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

export default function PostPage({
  page,
  rawMarkdown,
}: {
  page: Page;
  rawMarkdown: string;
}) {
  const MDXContent = useMDXComponent(page.body.code);

  // Create a new components object with the extra props
  // Note: Don't override `code` globally - it breaks code blocks inside `pre`
  // Inline code styling is handled by prose.css via .prose code:not(pre code)
  const componentsWithProps = {
    ...components,
    pre: Pre,
  };

  return (
    <Layout
      frontMatter={{
        title: page.title,
        description: page.description,
        url: page.url,
        lastModified: page.lastModified,
      }}
      rawMarkdown={rawMarkdown}
    >
      <MDXContent components={componentsWithProps} />
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const page = allPages.find(
    page =>
      page._raw.flattenedPath ===
      (params?.slug as string[] | undefined)?.join("/"),
  );

  if (!page) {
    return { notFound: true };
  }

  return {
    props: {
      page,
      rawMarkdown: page.body.raw,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = allPages.map(page => page.url);
  return {
    paths,
    fallback: false,
  };
};
