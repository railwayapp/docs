import "twin.macro";
import { Nav } from "../components/Nav";
import { PageNav } from "../components/PageNav";
import { Sidebar } from "../components/Sidebar";
import { FrontMatter } from "../types";
import { Page, Props as PageProps } from "./Page";

export interface Props extends PageProps {
  frontMatter: FrontMatter;
}

export const DocsLayout: React.FC<Props> = props => {
  return (
    <Page {...props}>
      <div tw="min-h-screen relative flex max-w-7xl mx-auto">
        <Sidebar />

        <div tw="flex flex-col flex-1">
          <Nav />

          <main tw="flex justify-between bg-red-200">
            <div tw="max-w-prose flex-auto px-4 sm:px-6 xl:px-8 pt-10 pb-24 lg:pb-16 bg-red-400">
              {props.children}
            </div>

            <PageNav />
          </main>
        </div>
      </div>
    </Page>
  );
};
