import React, { PropsWithChildren } from "react";
import "twin.macro";
import { DocsLayout } from "../layouts/DocsLayout";
import { FrontMatter } from "../types";

const Layout: React.FC<
  PropsWithChildren<{ frontMatter: FrontMatter; rawMarkdown?: string }>
> = props => <DocsLayout {...props}>{props.children}</DocsLayout>;

export default Layout;
