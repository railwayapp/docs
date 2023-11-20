import classNames from "classnames";
import { useRouter } from "next/router";
import React, { useMemo, useState } from "react";
import tw from "twin.macro";
import { sidebarContent } from "../data/sidebar";
import { Link } from "./Link";
import { Logo } from "./Logo";
import { ScrollArea } from "./ScrollArea";
import { OpenSearchModalButton } from "@/components/Search";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { IPage, ISubSection, IExternalLink, ISidebarSection } from "../types";

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
          <OpenSearchModalButton />
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

  const findContainingSubSectionSlug = (sections: ISidebarSection[], currentPageSlug: string): string | undefined => {
    for (const section of sections) {
      for (const item of section.content) {
        if ('subTitle' in item && item.pages.some(p => 'slug' in p && p.slug === currentPageSlug)) {
          return item.subTitle.slug;
        }
      }
    }
  };

  const initialExpandedSubSectionSlug = useMemo(() => {
    return findContainingSubSectionSlug(sidebarContent, prefixedSlug ?? pathname);
  }, [prefixedSlug, pathname]);

  const [expandedSubSections, setExpandedSubSections] = useState<string[]>(initialExpandedSubSectionSlug ? [initialExpandedSubSectionSlug] : []);

  const isCurrentPage = (pageSlug: string) =>
    (prefixedSlug ?? pathname) === pageSlug;

  const isCurrentSectionOrSubSection = (sectionOrSubSection: ISidebarSection | ISubSection) => {
    if ('content' in sectionOrSubSection) {
      // This is an ISidebarSection
      return sectionOrSubSection.content.some(item => {
        if ('subTitle' in item) {
            // This is a sub-section within the section
            return item.pages.some(p => 'slug' in p && isCurrentPage(p.slug));
        } else if ('slug' in item) {
            // This is a page directly under the section
            return isCurrentPage(item.slug);
        }
        return false;
      });
    } else {
        // This is an ISubSection
      return sectionOrSubSection.pages.some(p => 'slug' in p && isCurrentPage(p.slug));
    }
  };
    
  const toggleSubSection = (subTitle: string) => {
    setExpandedSubSections(prevState =>
      prevState.includes(subTitle)
        ? prevState.filter(t => t !== subTitle)
        : [...prevState, subTitle]
    );
  };

  const renderContentItem = (item: IPage | ISubSection | IExternalLink) => {
    if ('url' in item) {
      // This is an external link
      return (
        <li key={item.url} css={[
            tw`flex items-center`, 
            tw`px-4 py-2`, 
            tw`hover:bg-gray-100 hover:text-foreground`, 
            tw`border-r-2 border-transparent`
            ]}>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            css={[tw`text-gray-700 text-sm flex-grow`]}
          >
            {item.title}
          </a>
          <svg css={[tw`m-1 w-3 h-3 text-gray-700`]} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15 11v4.833A1.166 1.166 0 0 1 13.833 17H2.167A1.167 1.167 0 0 1 1 15.833V4.167A1.166 1.166 0 0 1 2.167 3h4.618m4.447-2H17v5.768M9.111 8.889l7.778-7.778"/>
          </svg>
        </li>
      );
    } else if ('subTitle' in item) {
      // these are the expandable sections
      const isExpanded = expandedSubSections.includes(item.subTitle.slug);

      const handleToggleClick = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent link navigation
        toggleSubSection(item.subTitle.slug);
      };

      const arrowSvg = isExpanded ? (
        <svg css={[tw`h-4 w-4 text-gray-700`]} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg css={[tw`h-4 w-4 text-gray-500`]} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 001.414 0L13.414 10l-4.707-4.707a1 1 0 00-1.414 1.414L10.586 10l-3.293 3.293a1 1 0 000 1.414z" clipRule="evenodd" />
        </svg>
      );

      return (
        // the first Link is the subTitle page, i.e. How To > Get Started
        <li key={item.subTitle.slug}>
          <div 
            className={classNames(isCurrentPage(item.subTitle.slug) && `current`)}
            css={[
              tw`flex items-center`,
              tw`px-4 py-2`,
              tw`text-gray-700 text-sm`,
              tw`hover:bg-gray-100 hover:text-foreground`,
              tw`focus:outline-none focus:bg-pink-100`,
              tw`border-r-2 border-transparent`,
              isCurrentPage(item.subTitle.slug) &&
                tw`bg-pink-100 text-pink-900 hover:bg-pink-100 border-r-2 border-pink-500`,
              ]}
            >
              <Link
                href={item.subTitle.slug}
                css={[
                  tw`text-gray-700 text-sm flex-grow hover:text-foreground`,
                  isCurrentPage(item.subTitle.slug) &&
                  tw`bg-pink-100 text-pink-900 hover:bg-pink-100 border-pink-500`,
                ]}
              >
                {item.subTitle.title}
              </Link>
              <div 
              onClick={handleToggleClick} 
              css={[tw`cursor-pointer mr-1 rounded hover:border hover:border-gray-300`]}
              >
                {arrowSvg}
              </div>
          </div>
          {isExpanded && (
            // these are the links in the expanded section
            <ul>
              {item.pages.map(page => (
                'slug' in page ? (
                  <li key={page.slug}>
                    <Link
                      href={page.slug}
                      className={classNames(isCurrentPage(page.slug) && `current`)}
                      css={[
                        tw`text-gray-700 text-sm`,
                        tw`block py-2`,
                        tw`ml-4`,
                        tw`pl-2`,
                        tw`hover:bg-gray-100 hover:text-foreground`,
                        tw`focus:outline-none focus:bg-pink-100`,
                        isCurrentPage(page.slug) &&
                          tw`bg-pink-100 text-pink-900 hover:bg-pink-100 border-r-2 border-pink-500`,
                      ]}
                    >
                      {page.title}
                    </Link>
                  </li>
                ) : (
                  <li key={page.url}>
                    <a
                      href={page.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      tw="text-gray-700 text-sm block px-4 py-2 pl-8 hover:bg-gray-100 hover:text-foreground"
                    >
                      {page.title}
                    </a>
                  </li>
                )
              ))}
            </ul>
          )}
        </li>
      );
    } else {
      // This is a page
      return (
        <li key={item.slug}>
          <Link
            href={item.slug}
            className={classNames(isCurrentPage(item.slug) && `current`)}
            css={[
              tw`text-gray-700 text-sm`,
              tw`block px-4 py-2`,
              tw`hover:bg-gray-100 hover:text-foreground`,
              tw`focus:outline-none focus:bg-pink-100`,
              isCurrentPage(item.slug) &&
                tw`bg-pink-100 text-pink-900 hover:bg-pink-100 border-r-2 border-pink-500`,
              ]}
            >
            {item.title}
          </Link>
        </li>
      );
    }
  };

  return (
    <>
      {sidebarContent.map((section, i) => (
        <React.Fragment key={i}>
          {section.title != null && (
            <h5
              tw="px-4 my-2 text-foreground text-sm font-bold"
              className={classNames(
                isCurrentSectionOrSubSection(section) && "current-section",
              )}
            >
              {section.title}
            </h5>
          )}

          <ul tw="mb-8">
            {section.content.map(renderContentItem)}
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
