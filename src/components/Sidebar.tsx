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
  const [expandedSubSections, setExpandedSubSections] = useState<string[]>([]);

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
        <li key={item.url}>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            tw="text-gray-700 text-sm block px-4 py-2 hover:bg-gray-100 hover:text-foreground"
          >
            {item.title}
          </a>
        </li>
      );
    } else if ('subTitle' in item) {
      const isExpanded = expandedSubSections.includes(item.subTitle.slug);

      const caretIcon = isExpanded ? '▼' : '►';

      return (
        <li key={item.subTitle.slug}>
          <div 
            onClick={() => toggleSubSection(item.subTitle.slug)}
            tw="cursor-pointer"
            >
              <Link
                href={item.subTitle.slug}
                css={[
                  tw`text-gray-700 text-sm`,
                  tw`block px-4 py-2`,
                  tw`hover:bg-gray-100 hover:text-foreground`,
                  tw`focus:outline-none focus:bg-pink-100`,
                  isCurrentPage(item.subTitle.slug) &&
                    tw`bg-pink-100 text-pink-900 hover:bg-pink-100 border-r-2 border-pink-500`,
                ]}
                className={classNames(isCurrentPage(item.subTitle.slug) && `current`)}
              >
                <span tw="mr-2">{caretIcon}</span>{item.subTitle.title}
              </Link>
          </div>
          {isExpanded && (
            <ul>
              {item.pages.map(page => (
                'slug' in page ? (
                  <li key={page.slug}>
                    <Link
                      href={page.slug}
                      className={classNames(isCurrentPage(page.slug) && `current`)}
                      css={[
                        tw`text-gray-700 text-sm`,
                        tw`block px-4 py-2`,
                        tw`pl-8`,
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
