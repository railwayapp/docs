import { Banner, PriorityBoardingBanner } from "@/components/Banner";
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
import { GetServerSidePropsContext } from "next";
import { getCookie } from "cookies-next";
import { Props as CodeBlockProps } from "@/components/CodeBlock";
import { Props as InlineCodeProps } from "@/components/InlineCode";

const components: Record<string, React.ElementType> = {
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
      }}
    >
      <MDXContent components={componentsWithProps} />
    </Layout>
  );
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const { slug } = context.params as { slug: string[] };
  const page = allPages.find(p => p.url === `/${slug.join("/")}`);
  const themeCookie = getCookie("theme", { req: context.req }) as
    | string
    | undefined;

  if (!page) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      page,
      colorModeSSR: themeCookie ?? null,
    },
  };
};
