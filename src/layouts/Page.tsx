import { Modal } from "@/components/Modal";
import { SearchModal } from "@/components/Search";
import { searchStore } from "@/store";
import { useStore } from "@nanostores/react";
import React, { PropsWithChildren, useEffect } from "react";
import tinykeys from "tinykeys";
import "twin.macro";
import { MobileNav, Nav } from "../components/Nav";
import { Props as SEOProps, SEO } from "../components/SEO";
import { Sidebar } from "../components/Sidebar";
import { Background } from "../pages";

export interface Props {
  seo?: SEOProps;
}

export const Page: React.FC<PropsWithChildren<Props>> = props => {
  const isSearchOpen = useStore(searchStore);

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      "$mod+K": e => {
        e.preventDefault();
        searchStore.set(!isSearchOpen);
      },
    });

    return () => unsubscribe();
  }, [isSearchOpen]);

  return (
    <>
      <SEO {...props.seo} />

      <div tw="min-h-screen relative flex">
        <Sidebar />

        <div tw="flex flex-col flex-1 max-w-[100vw] overflow-x-hidden">
          <Background />

          {/*This area would be perfect to add the bg image.*/}
          <Nav />
          <MobileNav />

          <main tw="flex justify-between px-4 w-full max-w-5xl mx-auto md:px-8 pt-8 pb-12 md:pb-24">
            {props.children}
          </main>
        </div>
      </div>

      <Modal
        title="Search Docs"
        isOpen={isSearchOpen}
        onClose={() => searchStore.set(false)}
      >
        <SearchModal closeModal={() => searchStore.set(false)} />
      </Modal>
    </>
  );
};
