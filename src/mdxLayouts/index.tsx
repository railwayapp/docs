import React, { PropsWithChildren } from "react";
import { DocsLayout } from "../layouts/docs-layout";
import { FrontMatter } from "../types";

const Layout: React.FC<
  PropsWithChildren<{ frontMatter: FrontMatter; rawMarkdown?: string }>
> = props => <DocsLayout {...props}>{props.children}</DocsLayout>;

export default Layout;
