import React from "react";
import "twin.macro";
import { MobileNav, Nav } from "../components/Nav";
import { Props as SEOProps, SEO } from "../components/SEO";
import { Sidebar } from "../components/Sidebar";

export interface Props {
  seo?: SEOProps;
}

export const Page: React.FC<Props> = props => {
  return (
    <>
      <SEO {...props.seo} />

      <div tw="min-h-screen relative flex max-w-6xl mx-auto">
        <Sidebar />

        <div tw="flex flex-col flex-1">
          <Nav />
          <MobileNav />

          <main tw="flex justify-between px-4 md:px-8 pt-8 pb-24">
            {props.children}
          </main>
        </div>
      </div>
    </>
  );
};
