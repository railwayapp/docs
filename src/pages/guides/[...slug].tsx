import {
  Banner,
  PriorityBoardingBanner,
  DeprecationBanner,
} from "@/components/banner";
import { Collapse } from "@/components/collapse";
import { Pre, CodeBlock, CodeTab } from "@/components/code-block";
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
import { GetStaticPaths, GetStaticProps } from "next";
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

export default function GuidePage({
  guide,
  rawMarkdown,
}: {
  guide: Guide;
  rawMarkdown: string;
}) {
  const MDXContent = useMDXComponent(guide.body.code);

  const componentsWithProps = {
    ...components,
    pre: Pre,
  };

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
      <MDXContent components={componentsWithProps} />
    </GuidesLayout>
  );
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const guide = allGuides.find(
    guide =>
      guide._raw.flattenedPath ===
      (params?.slug as string[] | undefined)?.join("/"),
  );

  if (!guide) {
    return { notFound: true };
  }

  return {
    props: {
      guide,
      rawMarkdown: guide.body.raw,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = allGuides.map(guide => guide.url);
  return {
    paths,
    fallback: false,
  };
};
