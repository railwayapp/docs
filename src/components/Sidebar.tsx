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
        <div tw="pt-6 pb-6 px-4 sticky top-0 bg-background z-10">
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

  const [expandedSubSections, setExpandedSubSections] = useState<string[]>([]); 
  const activeLinkRef = React.useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    const newExpandedSubSections = findContainingSubSectionSlugs(sidebarContent, prefixedSlug ?? pathname);
    setExpandedSubSections(prevExpandedSubSections => Array.from(new Set([...prevExpandedSubSections, ...newExpandedSubSections])));
  }, [prefixedSlug]);
  
  useEffect(() => {
    if (activeLinkRef.current) {
      activeLinkRef.current.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [prefixedSlug]);
  

  const findContainingSubSectionSlugs = (sections: ISidebarSection[], currentPageSlug: string): string[] => {
    let slugs: string[] = [];
    for (const section of sections) {
      for (const item of section.content) {
        if ('subTitle' in item) {
          const subTitleSlug = typeof item.subTitle === 'string' ? item.subTitle : item.subTitle.slug;
          const hasMatchingChild = item.pages.some(p => 'slug' in p && p.slug === currentPageSlug);
          console.log('Checking subTitleSlug:', subTitleSlug, 'currentPageSlug:', currentPageSlug, 'childSlugs:', item.pages.filter(p => 'slug' in p).map(p => (p as IPage).slug));
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

  const isCurrentSection = (section: ISidebarSection ) => {
    const isDirectPageCurrent = section.content.some(item => 'slug' in item && isCurrentPage(item.slug));

    const isSubTitlePageCurrent = section.content.some(item => {
      if ('subTitle' in item) {
        const subTitleSlug = typeof item.subTitle === 'string' ? item.subTitle : item.subTitle.slug;
        return isCurrentPage(subTitleSlug);
      }
      return false;
    });

    const isSubSectionPageCurrent = section.content.some(item => 
      'subTitle' in item && item.pages.some(page => 'slug' in page && isCurrentPage(page.slug))
    );

    return isDirectPageCurrent || isSubTitlePageCurrent || isSubSectionPageCurrent;
  };
    
  const toggleSubSection = (subTitleSlug: string) => {
    setExpandedSubSections(prevState =>
      prevState.includes(subTitleSlug)
        ? prevState.filter(slug => slug !== subTitleSlug)
        : [...prevState, subTitleSlug]
    );
  };
  
  const renderContentItem = (item: IPage | ISubSection | IExternalLink) => {
    let itemSlug = '';

    if ('slug' in item) {
      itemSlug = item.slug;
     } else if ('subTitle' in item) {
      itemSlug = typeof item.subTitle === 'string' ? item.subTitle : item.subTitle.slug;
     } else if ('url' in item) {
      itemSlug = item.url;
     };
    
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
