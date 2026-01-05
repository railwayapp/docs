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
import { GetServerSidePropsContext } from "next";
import { getCookie } from "cookies-next";
import { Props as CodeBlockProps } from "@/components/CodeBlock";
import { Props as InlineCodeProps } from "@/components/InlineCode";
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
};

export default function PostPage({
  page,
  colorModeSSR,
  rawMarkdown,
}: {
  page: Page;
  colorModeSSR: string | null;
  rawMarkdown: string;
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
      rawMarkdown={rawMarkdown}
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

  if (!page) {
    return {
      notFound: true,
    };
  }

  // Return raw markdown if format=md
  if (context.query.format === "md") {
    const markdown = reconstructMarkdownWithFrontmatter(
      { title: page.title, description: page.description, url: page.url },
      page.body.raw
    );
    context.res.setHeader("Content-Type", "text/markdown; charset=utf-8");
    context.res.write(markdown);
    context.res.end();
    return { props: {} };
  }

  const themeCookie = getCookie("theme", { req: context.req }) as
    | string
    | undefined;

  return {
    props: {
      page,
      colorModeSSR: themeCookie ?? null,
      rawMarkdown: page.body.raw,
    },
  };
};
