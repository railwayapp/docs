import "twin.macro";
import { Nav } from "../components/Nav";
import { PageNav } from "../components/PageNav";
import { Sidebar } from "../components/Sidebar";
import { Page, Props as PageProps } from "./Page";

export interface Props extends PageProps {}

export const DocsLayout: React.FC<Props> = props => {
  return (
    <Page {...props}>
      <div tw="min-h-screen flex flex-col max-w-7xl mx-auto">
        <Nav />

        <div tw="flex flex-1">
          <Sidebar tw="" />

          <main tw="flex-1 flex justify-between bg-red-200">
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
