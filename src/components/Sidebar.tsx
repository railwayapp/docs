import classNames from "classnames";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import tw from "twin.macro";
import { sidebarContent } from "../data/sidebar";
import { Link } from "./Link";
import { Logo } from "./Logo";
import { ISidebarSection } from "@/types";
import { ScrollArea } from "./ScrollArea";
import { Search } from "./Search";
import { ThemeSwitcher } from "./ThemeSwitcher";

export const Sidebar: React.FC = ({ ...props }) => {
  return (
    <div
      css={[
        tw`hidden`,
        tw`md:h-screen md:sticky md:top-0 md:overflow-hidden md:block md:min-w-sidebar`,
        tw`md:border-r md:border-gray-200 bg-background`,
      ]}
      className="sidebar"
      {...props}
    >
      <ScrollArea>
        <div tw="pt-6 pb-6 px-4 sticky top-0 bg-background">
          <div tw="flex items-center justify-between">
            <Link tw="w-full flex items-center" href="/">
              <div tw="flex items-center">
                <Logo tw="w-8 h-8 mr-4" /> <span tw="font-bold">Docs</span>
              </div>
            </Link>

            <ThemeSwitcher />
          </div>
        </div>

        <div tw="mx-4 mb-6">
          <Search />
        </div>

        <SidebarContent />
      </ScrollArea>
    </div>
  );
};

const SidebarContent: React.FC = () => {
  const {
    query: { slug },
    pathname,
  } = useRouter();

  const prefixedSlug = useMemo(
    () => (slug ? `/${(slug as string[] | undefined)?.join("/")}` : undefined),
    [slug],
  );

  const isCurrentPage = (pageSlug: string) =>
    (prefixedSlug ?? pathname) === pageSlug;

  const isCurrentSection = (section: ISidebarSection) =>
    section.pages.some(p => isCurrentPage(p.slug));

  return (
    <>
      {sidebarContent.map((section, i) => (
        <React.Fragment key={i}>
          {section.title != null && (
            <h5
              tw="px-4 my-2 text-foreground text-sm font-bold"
              className={classNames(
                isCurrentSection(section) && "current-section",
              )}
            >
              {section.title}
            </h5>
          )}

          <ul tw="mb-8">
            {section.pages.map(page => (
              <li key={page.slug}>
                <Link
                  href={page.slug}
                  className={classNames(isCurrentPage(page.slug) && `current`)}
                  css={[
                    tw`text-gray-700 text-sm`,
                    tw`block px-4 py-2`,
                    tw`hover:bg-gray-100 hover:text-foreground`,
                    tw`focus:outline-none focus:bg-pink-100`,
                    isCurrentPage(page.slug) &&
                      tw`bg-pink-100 text-pink-900 hover:bg-pink-100 border-r-2 border-pink-500`,
                  ]}
                >
                  {page.title}
                </Link>
              </li>
            ))}
          </ul>
        </React.Fragment>
      ))}
    </>
  );
};

export const MobileSidebar: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
  return (
    <div css={[isOpen ? tw`block` : tw`hidden`, tw`w-full`, tw`md:hidden`]}>
      <SidebarContent />
    </div>
  );
};
