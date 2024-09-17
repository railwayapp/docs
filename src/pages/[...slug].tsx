import { Banner, PriorityBoardingBanner } from "@/components/Banner";
import { Collapse } from "@/components/Collapse";
import { CodeBlock } from "@/components/CodeBlock";
import Layout from "@/mdxLayouts/index";
import { allPages, Page } from "contentlayer/generated";
import { GetStaticPaths, GetStaticProps } from "next";
import { useMDXComponent } from "next-contentlayer/hooks";
import Link from "next/link";
import { Image } from "@/components/Image";
import { InlineCode } from '@/components/InlineCode';
import { H2, H3, H4 } from "@/components/Header";
import { Anchor } from "@/components/Anchor";

const components: Record<string, React.ElementType> = {
  pre: CodeBlock,
  code: InlineCode,
  Collapse,
  Image,
  Banner,
  Link,
  PriorityBoardingBanner,
  a: Anchor,
  h2: H2,
  h3: H3,
  h4: H4,
};

export default function PostPage({ page }: { page: Page }) {
  const MDXContent = useMDXComponent(page.body.code);

  return (
    <Layout
      frontMatter={{
        title: page.title,
      }}
    >
      <MDXContent components={components} />
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
