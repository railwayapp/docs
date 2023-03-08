import { Banner, PriorityBoardingBanner } from "@/components/Banner";
import { CodeBlock } from "@/components/CodeBlock";
import Layout from "@/mdxLayouts/index";
import { allPages, Page } from "contentlayer/generated";
import { GetStaticPaths, GetStaticProps } from "next";
import { useMDXComponent } from "next-contentlayer/hooks";
import { default as NextImage, ImageProps } from "next/legacy/image";
import Link from "next/link";

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
