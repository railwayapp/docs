import React from "react";
import { Link } from "../components/Link";
import { FrontMatter } from "../types";
import { MDXProvider } from "@mdx-js/react";
import { DocsLayout } from "../layouts/DocsLayout";
import { CodeBlock } from "../components/CodeBlock";
import NextImage from "next/image";
import "twin.macro";
import { Banner, PriorityBoardingBanner } from "../components/Banner";

const Image = props => (
  <a tw="block xl:-mx-8" href={props.src} target="_blank" rel="noopener">
    <NextImage {...props} />
  </a>
);

const components = {
  a: Link,
  pre: CodeBlock,
  Image,
  Banner,
  Link,
  PriorityBoardingBanner,
};

const Layout: React.FC<{ frontMatter: FrontMatter }> = props => (
  <MDXProvider components={components}>
    <DocsLayout {...props}>{props.children}</DocsLayout>
  </MDXProvider>
);

export default Layout;
