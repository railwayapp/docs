import Fuse from "fuse.js";
import { useRouter } from "next/router";
import React, { useEffect, useMemo } from "react";
import tinykeys from "tinykeys";
import "twin.macro";
import { Footer } from "../components/Footer";
import { Modal } from "../components/Modal";
import { MobileNav, Nav } from "../components/Nav";
import { SearchModal } from "../components/Search";
import { Props as SEOProps, SEO } from "../components/SEO";
import { Sidebar } from "../components/Sidebar";
import { sidebarContent } from "../data/sidebar";
import { useStore } from "../store";

export interface Props {
  seo?: SEOProps;
}

export const Page: React.FC<Props> = props => {
  const { isSearchOpen, setIsSearchOpen } = useStore();

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      "$mod+K": e => {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      },
    });

    return () => unsubscribe();
  }, [isSearchOpen]);

  const fuse = useMemo(() => {
    const pages = sidebarContent.map(section => section.pages).flat();
    const fuse = new Fuse(pages, {
      keys: ["title", "tags", "category"],
      includeScore: true,
    });

    return fuse;
  }, [sidebarContent]);

  return (
    <>
      <SEO {...props.seo} />

      <div tw="min-h-screen relative flex">
        <Sidebar />

        <div tw="flex flex-col flex-1 ">
          <Nav />
          <MobileNav />

          <main tw="flex justify-between px-4 max-w-4xl mx-auto md:px-8 pt-8 pb-12 md:pb-24">
            {props.children}
          </main>
        </div>
      </div>

      <Modal
        title="Search Docs"
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      >
        <SearchModal fuse={fuse} closeModal={() => setIsSearchOpen(false)} />
      </Modal>
    </>
  );
};
