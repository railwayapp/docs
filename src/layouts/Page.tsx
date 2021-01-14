import GoogleFonts from "next-google-fonts";
import React from "react";
import "twin.macro";
import { Nav } from "../components/Nav";
import { Props as SEOProps, SEO } from "../components/SEO";
import { Sidebar } from "../components/Sidebar";

export interface Props {
  seo?: SEOProps;
}

export const Page: React.FC<Props> = props => {
  return (
    <>
      <SEO {...props.seo} />
      <GoogleFonts href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" />

      <div tw="min-h-screen relative flex max-w-6xl mx-auto">
        <Sidebar />

        <div tw="flex flex-col flex-1">
          <Nav />

          <main tw="flex justify-between px-4 md:px-8 pt-8 pb-24">
            {props.children}
          </main>
        </div>
      </div>
    </>
  );
};
