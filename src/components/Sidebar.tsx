import classNames from "classnames";
import { useRouter } from "next/router";
import React, { useMemo, useState, useEffect } from "react";
import tw from "twin.macro";
import { sidebarContent } from "../data/sidebar";
import { Link } from "./Link";
import { Logo } from "./Logo";
import { ScrollArea } from "./ScrollArea";
import { OpenSearchModalButton } from "@/components/Search";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { IPage, ISubSection, IExternalLink, ISidebarSection } from "../types";
import SidebarItem from "./SidebarItem";

export const Sidebar: React.FC = ({ ...props }) => {
  return (
    <nav
      css={[
        tw`hidden`,
        tw`md:h-screen md:sticky md:top-0 md:overflow-hidden md:block md:min-w-sidebar`,
        tw`md:border-r md:border-[rgba(0,0,0,0.1)] dark:md:border-gray-200 bg-[#EDEBE9] dark:bg-background`,
      ]}
      className="sidebar"
      {...props}
    >
      <ScrollArea>
        <div tw="pt-6 pb-6 px-4 sticky top-0 bg-[#EDEBE9] dark:bg-background z-10">
          <div tw="flex items-center justify-between">
            <Link tw="flex items-center" href="/">
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
    </nav>
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

  const [expandedSubSections, setExpandedSubSections] = useState<string[]>([]);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const activeLinkRef = React.useRef<HTMLAnchorElement | null>(null);

  // Find which section contains the current page
  const findContainingSectionTitle = (
    sections: ISidebarSection[],
    currentPageSlug: string,
  ): string | null => {
    for (const section of sections) {
      // Check section's own slug
      if (section.slug === currentPageSlug && section.title) {
        return section.title;
      }

      // Check direct pages
      const hasDirectPage = section.content.some(
        item => "slug" in item && item.slug === currentPageSlug,
      );
      if (hasDirectPage && section.title) return section.title;

      // Check subsection pages
      for (const item of section.content) {
        if ("subTitle" in item) {
          const subTitleSlug =
            typeof item.subTitle === "string"
              ? item.subTitle
              : item.subTitle.slug;
          if (subTitleSlug === currentPageSlug && section.title)
            return section.title;
          const hasMatchingChild = item.pages.some(
            p => "slug" in p && p.slug === currentPageSlug,
          );
          if (hasMatchingChild && section.title) return section.title;
        }
      }
    }
    return null;
  };

  useEffect(() => {
    const currentSlug = prefixedSlug ?? pathname;

    // Expand subsections containing the current page
    const newExpandedSubSections = findContainingSubSectionSlugs(
      sidebarContent,
      currentSlug,
    );
    setExpandedSubSections(prevExpandedSubSections =>
      Array.from(
        new Set([...prevExpandedSubSections, ...newExpandedSubSections]),
      ),
    );

    // Expand the section containing the current page
    const containingSection = findContainingSectionTitle(
      sidebarContent,
      currentSlug,
    );
    if (containingSection) {
      setExpandedSections(prevExpandedSections =>
        prevExpandedSections.includes(containingSection)
          ? prevExpandedSections
          : [...prevExpandedSections, containingSection],
      );
    }
  }, [prefixedSlug, pathname]);

  useEffect(() => {
    if (activeLinkRef.current) {
      activeLinkRef.current.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [prefixedSlug]);

  const findContainingSubSectionSlugs = (
    sections: ISidebarSection[],
    currentPageSlug: string,
  ): string[] => {
    let slugs: string[] = [];
    for (const section of sections) {
      for (const item of section.content) {
        if ("subTitle" in item) {
          const subTitleSlug =
            typeof item.subTitle === "string"
              ? item.subTitle
              : item.subTitle.slug;
          const hasMatchingChild = item.pages.some(
            p => "slug" in p && p.slug === currentPageSlug,
          );
          if (hasMatchingChild || subTitleSlug === currentPageSlug) {
            slugs.push(subTitleSlug);
          }
        }
      }
    }
    return slugs;
  };

  const isCurrentPage = (pageSlug: string) =>
    (prefixedSlug ?? pathname) === pageSlug;

  const isCurrentSection = (section: ISidebarSection) => {
    // Check if the section's own slug matches
    const isSectionSlugCurrent = section.slug && isCurrentPage(section.slug);

    const isDirectPageCurrent = section.content.some(
      item => "slug" in item && isCurrentPage(item.slug),
    );

    const isSubTitlePageCurrent = section.content.some(item => {
      if ("subTitle" in item) {
        const subTitleSlug =
          typeof item.subTitle === "string"
            ? item.subTitle
            : item.subTitle.slug;
        return isCurrentPage(subTitleSlug);
      }
      return false;
    });

    const isSubSectionPageCurrent = section.content.some(
      item =>
        "subTitle" in item &&
        item.pages.some(page => "slug" in page && isCurrentPage(page.slug)),
    );

    return (
      isSectionSlugCurrent ||
      isDirectPageCurrent ||
      isSubTitlePageCurrent ||
      isSubSectionPageCurrent
    );
  };

  const toggleSubSection = (subTitleSlug: string) => {
    setExpandedSubSections(prevState =>
      prevState.includes(subTitleSlug)
        ? prevState.filter(slug => slug !== subTitleSlug)
        : [...prevState, subTitleSlug],
    );
  };

  const toggleSection = (sectionTitle: string) => {
    setExpandedSections(prevState =>
      prevState.includes(sectionTitle)
        ? prevState.filter(title => title !== sectionTitle)
        : [...prevState, sectionTitle],
    );
  };

  const isSectionExpanded = (section: ISidebarSection) => {
    // Sections without titles are always expanded (like Quick Start at root level)
    if (!section.title) return true;
    return expandedSections.includes(section.title);
  };

  const renderContentItem = (item: IPage | ISubSection | IExternalLink) => {
    let itemSlug = "";

    if ("slug" in item) {
      itemSlug = item.slug;
    } else if ("subTitle" in item) {
      itemSlug =
        typeof item.subTitle === "string" ? item.subTitle : item.subTitle.slug;
    } else if ("url" in item) {
      itemSlug = item.url;
    }

    const isActive = isCurrentPage(itemSlug);
    return (
      <SidebarItem
        key={itemSlug}
        item={item}
        isCurrentPage={isCurrentPage}
        isExpanded={expandedSubSections.includes(itemSlug)}
        onToggleSubSection={() => toggleSubSection(itemSlug)}
        activeLinkRef={isActive ? activeLinkRef : undefined}
      />
    );
  };

  return (
    <>
      {sidebarContent.map((section, i) => {
        const isExpanded = isSectionExpanded(section);
        const isCurrent = isCurrentSection(section);
        const hasContent = section.content.length > 0;
        const isLinkOnly = section.slug && !hasContent;

        return (
          <React.Fragment key={i}>
            {section.title ? (
              isLinkOnly ? (
                // Render as simple link when slug exists but no nested content
                <Link
                  href={section.slug!}
                  css={[
                    tw`flex items-center px-4 my-2 py-1`,
                    tw`hover:bg-gray-100 cursor-pointer`,
                    tw`rounded-sm`,
                    tw`text-foreground text-sm font-medium`,
                    tw`hover:text-pink-700`,
                    isCurrent && tw`text-pink-700`,
                  ]}
                  className={classNames(isCurrent && "current-section")}
                >
                  {section.title}
                </Link>
              ) : (
                // Render as accordion when there's nested content
                <div
                  css={[
                    tw`flex justify-between items-center px-4 my-2`,
                    tw`hover:bg-gray-100 cursor-pointer`,
                    tw`rounded-sm`,
                  ]}
                  onClick={() => {
                    if (!section.slug) {
                      toggleSection(section.title!);
                    }
                  }}
                >
                  {section.slug ? (
                    <Link
                      href={section.slug}
                      css={[
                        tw`text-foreground text-sm font-medium py-1 flex-1`,
                        tw`hover:text-pink-700`,
                        isCurrent && tw`text-pink-700`,
                      ]}
                      className={classNames(isCurrent && "current-section")}
                    >
                      {section.title}
                    </Link>
                  ) : (
                    <h5
                      css={[
                        tw`text-foreground text-sm font-medium py-1`,
                        isCurrent && tw`text-pink-700`,
                      ]}
                      className={classNames(isCurrent && "current-section")}
                    >
                      {section.title}
                    </h5>
                  )}
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      toggleSection(section.title!);
                    }}
                    css={[
                      tw`p-1 hover:bg-gray-200 rounded`,
                      tw`text-gray-600 hover:text-foreground`,
                    ]}
                    aria-expanded={isExpanded}
                    aria-label={`Toggle ${section.title} section`}
                  >
                    <svg
                      css={[
                        tw`w-4 h-4 transition-transform duration-200`,
                        isExpanded && tw`transform rotate-90`,
                      ]}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              )
            ) : null}

            {isExpanded && hasContent && (
              <ul css={[tw`mb-4`, section.title && tw`mb-2`]}>
                {section.content.map(renderContentItem)}
              </ul>
            )}
          </React.Fragment>
        );
      })}
    </>
  );
};

export const MobileSidebar: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
  return (
    <nav css={[isOpen ? tw`block` : tw`hidden`, tw`w-full`, tw`md:hidden`]}>
      <SidebarContent />
    </nav>
  );
};
