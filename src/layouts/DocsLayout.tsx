import { useState } from "react";
import "twin.macro";
import { Nav } from "../components/Nav";
import { PageNav } from "../components/PageNav";
import { Sidebar } from "../components/Sidebar";
import { FrontMatter } from "../types";
import { Page, Props as PageProps } from "./Page";

export interface Props extends PageProps {
  frontMatter: FrontMatter;
}

export const DocsLayout: React.FC<Props> = ({
  frontMatter,
  children,
  ...props
}) => {
  return (
    <Page {...props}>
      <div tw="min-h-screen relative flex max-w-7xl mx-auto">
        <Sidebar />

        <div tw="flex flex-col flex-1">
          <Nav />

          <main tw="flex justify-between ">
            <div tw="max-w-prose flex-auto px-4 sm:px-6 xl:px-8 pt-8 pb-24 lg:pb-16 prose">
              <h1>{frontMatter.title}</h1>

              {children}
            </div>

            <PageNav />
          </main>
        </div>
      </div>
    </Page>
  );
};
