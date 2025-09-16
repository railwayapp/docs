import { Banner, PriorityBoardingBanner, DeprecationBanner } from "@/components/Banner";
import { Collapse } from "@/components/Collapse";
import { CodeBlock } from "@/components/CodeBlock";
import Layout from "@/mdxLayouts/index";
import { allPages, Page } from "contentlayer/generated";
import { useMDXComponent } from "next-contentlayer/hooks";
import Link from "next/link";
import { Image } from "@/components/Image";
import { InlineCode } from "@/components/InlineCode";
import { H2, H3, H4 } from "@/components/Header";
import { Anchor } from "@/components/Anchor";
import { GetStaticPaths, GetStaticProps } from "next";
import { Props as CodeBlockProps } from "@/components/CodeBlock";
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
};

export default function PostPage({
  page,
  colorModeSSR,
}: {
  page: Page;
  colorModeSSR: string | null;
}) {
  const MDXContent = useMDXComponent(page.body.code);

  // Create a new components object with the extra props
  const componentsWithProps = {
    ...components,
    pre: (props: CodeBlockProps) => (
      <CodeBlock {...props} colorModeSSR={colorModeSSR} />
    ),
    code: (props: InlineCodeProps) => (
      <InlineCode {...props} colorModeSSR={colorModeSSR} />
    ),
  };

  return (
    <Layout
      frontMatter={{
        title: page.title,
        description: page.description,
        url: page.url,
      }}
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

  return {
    props: {
      page,
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
