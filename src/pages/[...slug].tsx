import { Banner, PriorityBoardingBanner } from "@/components/Banner";
import { CodeBlock } from "@/components/CodeBlock";
import Layout from "@/mdxLayouts/index";
import { allPages, Page } from "contentlayer/generated";
import { GetStaticPaths, GetStaticProps } from "next";
import { useMDXComponent } from "next-contentlayer/hooks";
import { default as NextImage, ImageProps } from "next/legacy/image";
import Link from "next/link";
import { IconProps, Link as FeatherLinkIcon } from "react-feather";
import styled from "styled-components";

const StyledHeading = styled.h2`
  display: flex;
  align-items: center;
`;

const StyledLink = styled.a`
  position: relative;
  text-decoration: none;
  font-weight: bold;
  &:hover{
    text-decoration: underline;
  }
  svg {
    position: absolute;
    left: -1.7rem;
    top: 20%;
    visibility: hidden;
    transition: visibility; 
  }
    @media (max-width: 767px) {
    & > svg {
      display: none;
    }
  }
  &:hover svg {
    visibility: visible;
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

const Heading = (props: IconProps) => {
  const { children, id } = props;
  return (
    <StyledHeading id={id} tw="flex items-center space-x-2">
      <StyledLink href={`#${id}`}>
        <FeatherLinkIcon size={20}/>
        {children}
      </StyledLink>
    </StyledHeading>
  );
};

const components: Record<string, React.ElementType> = {
  pre: CodeBlock,
  h2: Heading,
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
