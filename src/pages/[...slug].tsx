import { Banner, PriorityBoardingBanner } from "@/components/Banner";
import { CodeBlock } from "@/components/CodeBlock";
import Layout from "@/mdxLayouts/index";
import { allPages, Page } from "contentlayer/generated";
import { GetStaticPaths, GetStaticProps } from "next";
import { useMDXComponent } from "next-contentlayer/hooks";
import { default as NextImage, ImageProps } from "next/legacy/image";
import Link from "next/link";
import { Link as FeatherLinkIcon } from "react-feather";
import styled from "styled-components";

const StyledLinkIcon = styled.a`
  text-decoration: none;
  position: absolute;
  width:3rem;
  height:2rem;
  display:none;
  align-items:center;
  left: -2rem;
  &:hover {
      text-decoration:underline;
  }
`;

const StyledLinkHeading = styled.a`
  text-decoration: none;
  position: absolute;
  font-weight:bold;
  &:hover {
      text-decoration:underline;
  }
`;

const StyledHeadingH2 = styled.h2`
  display: flex;
  align-items: center;
  position: relative;
  padding: 1.5rem 0 0;
  &:hover{
      ${StyledLinkIcon}{
        display:flex;
      }
      @media (max-width: 1300px) {
       ${StyledLinkIcon}{
        display: none;
    }
  }
`;

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

const components: Record<string, React.ElementType> = {
  pre: CodeBlock,
  Image,
  Banner,
  Link,
  PriorityBoardingBanner,
  h2: ({ id, children }) => (
    <StyledHeadingH2 id={id}>
      <StyledLinkIcon href={`#${id}`}>
        <FeatherLinkIcon className="icon" size={20} />
      </StyledLinkIcon>
      <StyledLinkHeading href={`#${id}`}>{children[1]}</StyledLinkHeading>
    </StyledHeadingH2>
  ),
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
    (page) =>
      page._raw.flattenedPath ===
      (params?.slug as string[] | undefined)?.join("/")
  );

  return {
    props: {
      page,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = allPages.map((page) => page.url);
  return {
    paths,
    fallback: false,
  };
};
