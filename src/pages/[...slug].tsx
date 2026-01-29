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
import { GetStaticPaths, GetStaticProps } from "next";
import { Props as InlineCodeProps } from "@/components/InlineCode";
import { TallyButton } from "@/components/TallyButton";

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
