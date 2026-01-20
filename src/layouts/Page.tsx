import { Modal } from "@/components/Modal";
import { searchStore } from "@/store";
import { useStore } from "@nanostores/react";
import dynamic from "next/dynamic";
import React, { PropsWithChildren, useEffect } from "react";
import "twin.macro";
import { MobileNav, Nav } from "../components/Nav";
import { Props as SEOProps, SEO } from "../components/SEO";
import { Sidebar } from "../components/Sidebar";
import { Background } from "../pages";
import { GlobalBanners } from "@/components/GlobalBanner";

// Lazy load SearchModal to reduce initial bundle size
const SearchModal = dynamic(
  () => import("@/components/Search").then(mod => ({ default: mod.SearchModal })),
  { ssr: false }
);

export interface Props {
  seo?: SEOProps;
}

export const Page: React.FC<PropsWithChildren<Props>> = props => {
  const isSearchOpen = useStore(searchStore);

  useEffect(() => {
    // Dynamically import tinykeys to reduce initial bundle
    import("tinykeys").then(({ default: tinykeys }) => {
      const unsubscribe = tinykeys(window, {
        "$mod+K": e => {
          e.preventDefault();
          searchStore.set(!searchStore.get());
        },
      });

      return () => unsubscribe();
    });
  }, []);

  return (
    <>
      <SEO {...props.seo} />
      <GlobalBanners />
      <div tw="min-h-screen relative flex">
        <Sidebar />
        <div tw="flex flex-col flex-1 max-w-[100vw]">
          <Background />

          {/*This area would be perfect to add the bg image.*/}
          <Nav />
          <MobileNav />

          <main tw="flex justify-between px-4 w-full max-w-5xl mx-auto md:px-8 pt-8 pb-12 md:pb-24">
            {props.children}
          </main>
        </div>
      </div>
      {isSearchOpen && (
        <Modal
          title="Search Docs"
          isOpen={isSearchOpen}
          onClose={() => searchStore.set(false)}
        >
          <SearchModal closeModal={() => searchStore.set(false)} />
        </Modal>
      )}
    </>
  );
};
