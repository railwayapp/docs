import { SearchModal } from "@/components/search";
import {
  Dialog,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/dialog";
import { searchStore } from "@/store";
import { cn } from "@/lib/cn";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { useStore } from "@nanostores/react";
import React, { PropsWithChildren, useEffect } from "react";
import tinykeys from "tinykeys";
import { TopNav, MobileTopNav } from "../components/top-nav";
import { Props as SEOProps, SEO } from "../components/seo";
import { Sidebar } from "../components/sidebar";
import { Background } from "../pages";
import { GlobalBanners } from "@/components/global-banner";

export interface Props {
  seo?: SEOProps;
  hideSidebar?: boolean;
}

export const Page: React.FC<PropsWithChildren<Props>> = props => {
  const isSearchOpen = useStore(searchStore);
  const hideSidebar = props.hideSidebar;

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      "$mod+K": e => {
        e.preventDefault();
        searchStore.set(!isSearchOpen);
      },
    });

    return () => unsubscribe();
  }, [isSearchOpen]);

  const handleOpenChange = (open: boolean) => {
    searchStore.set(open);
  };

  return (
    <>
      <SEO {...props.seo} />
      <GlobalBanners />
      <div className="min-h-screen relative flex flex-col">
        <TopNav />
        <MobileTopNav />

        {/* Spacer for fixed nav height */}
        <div className="h-[53px] shrink-0" />

        {/* Sidebar + Content Area */}
        <div className="flex flex-1">
          {/* Sidebar */}
          {!hideSidebar && <Sidebar />}

          {/* Main Content Area */}
          <div className="flex flex-col flex-1 max-w-[100vw]">
            <Background />

            <main
              className={cn(
                "flex justify-between px-4 w-full mx-auto md:px-12 lg:px-16 pt-24 pb-12 md:pb-24",
                hideSidebar ? "max-w-5xl" : "max-w-6xl",
              )}
            >
              {props.children}
            </main>
          </div>
        </div>
      </div>
      <Dialog open={isSearchOpen} onOpenChange={handleOpenChange}>
        <DialogPortal>
          <DialogOverlay />
          <DialogPrimitive.Popup
            className={cn(
              "fixed inset-0 z-50 overflow-auto",
              "focus:outline-hidden",
            )}
          >
            <DialogTitle className="sr-only">Search Docs</DialogTitle>
            <div
              className="flex min-h-full items-start justify-center px-4 pt-[10vh] pb-12"
              onPointerDown={e => {
                // Close if clicking on the backdrop (not the modal content)
                if (e.target === e.currentTarget) {
                  handleOpenChange(false);
                }
              }}
            >
              <SearchModal
                open={isSearchOpen}
                onOpenChange={handleOpenChange}
              />
            </div>
          </DialogPrimitive.Popup>
        </DialogPortal>
      </Dialog>
    </>
  );
};
