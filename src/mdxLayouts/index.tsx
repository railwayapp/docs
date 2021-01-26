import React from "react";
import { Link } from "../components/Link";
import { FrontMatter } from "../types";
import { MDXProvider } from "@mdx-js/react";
import { DocsLayout } from "../layouts/DocsLayout";
import { CodeBlock } from "../components/CodeBlock";
import NextImage from "next/image";

const components = {
  a: Link,
  pre: CodeBlock,
  NextImage,
};

const Layout: React.FC<{ frontMatter: FrontMatter }> = props => (
  <MDXProvider components={components}>
    <DocsLayout {...props}>{props.children}</DocsLayout>
  </MDXProvider>
);

export default Layout;
