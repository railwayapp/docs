// SidebarLink.tsx
import React from "react";
import classNames from "classnames";
import { Link } from "./Link";
import tw from "twin.macro";
import { IPage, ISubSection, IExternalLink } from "../types";
import { Arrow } from "@/components/Arrow";
import { slugify } from "@/utils/slugify";

interface SidebarItemProps {
  item: IPage | ISubSection | IExternalLink;
  isCurrentPage: (pageSlug: string) => boolean;
  isExpanded: boolean;
  onToggleSubSection: () => void;
  activeLinkRef?: React.MutableRefObject<HTMLAnchorElement | null>;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  item,
  isCurrentPage,
  isExpanded,
  onToggleSubSection,
  activeLinkRef,
}) => {
  const externalLinkSvg = (
    <svg
      css={[tw`w-3 h-3 text-gray-700`]}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 23 23"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1"
        d="M15 11v4.833A1.166 1.166 0 0 1 13.833 17H2.167A1.167 1.167 0 0 1 1 15.833V4.167A1.166 1.166 0 0 1 2.167 3h4.618m4.447-2H17v5.768M9.111 8.889l7.778-7.778"
      />
    </svg>
  );

  const renderExternalLink = (
    item: IExternalLink,
    isSubSectionItem = false,
  ) => {
    return (
      <li
        key={item.url}
        css={[
          tw`flex items-center`,
          tw`ml-2 pl-2`,
          tw`hover:bg-gray-100`,
          isSubSectionItem && tw`ml-6`,
        ]}
      >
        <Link
          href={item.url}
          css={[
            tw`text-gray-700 text-sm flex-grow`,
            tw`w-full py-2 hover:text-foreground`,
            tw`flex justify-between items-center`,
          ]}
        >
          <span>{item.title}</span>
          <span css={tw`mr-4 hover:svg:text-foreground`}>
            {externalLinkSvg}
          </span>
        </Link>
      </li>
    );
  };

  const renderPageLink = (item: IPage, isSubSectionItem = false) => {
    const isActive = isCurrentPage(item.slug);
    return (
      <li key={item.slug}>
        <Link
          href={item.slug}
          className={classNames(isActive && `current`)}
          ref={isActive ? activeLinkRef : undefined}
          css={[
            tw`text-gray-700 text-sm`,
            tw`block px-4 py-2`,
            tw`hover:bg-gray-100 hover:text-foreground`,
            tw`focus:outline-none focus:bg-pink-100`,
            isActive &&
              tw`bg-pink-100 text-pink-900 hover:bg-pink-100 border-r-2 border-pink-500`,
            isSubSectionItem && tw`py-2 ml-6 pl-2`,
          ]}
        >
          {item.title}
        </Link>
      </li>
    );
  };

  const renderSubSection = (item: ISubSection) => {
    const renderSubtitle = (subTitle: string | IPage) => {
      const hasLanding = typeof subTitle != "string";

      const subTitleContents =
        typeof subTitle === "string" ? (
          <span
            onClick={onToggleSubSection}
            css={[
              tw`text-gray-700 flex-grow`,
              tw`hover:cursor-pointer`,
              tw`text-sm`,
              tw`pl-4 py-2`,
            ]}
          >
            {subTitle}
          </span>
        ) : (
          <Link
            className={classNames(isCurrentPage(subTitle.slug) && `current`)}
            href={subTitle.slug}
            onClick={onToggleSubSection}
            ref={isCurrentPage(subTitle.slug) ? activeLinkRef : undefined}
            id={`sidebar-subtitle-${slugify(subTitle.slug)}`}
            css={[
              tw`text-gray-700 flex-grow text-sm hover:text-foreground`,
              tw`pl-4 py-2`,
              isCurrentPage(subTitle.slug) &&
                tw`bg-pink-100 text-pink-900 hover:bg-pink-100 border-pink-500`,
            ]}
          >
            {subTitle.title}
          </Link>
        );

      return (
        <div
          css={[
            tw`flex justify-between items-center`,
            tw`hover:bg-gray-100`,
            tw`focus:outline-none focus:bg-pink-100`,
            tw`border-r-2 border-transparent`,
            hasLanding &&
              isCurrentPage(subTitle.slug) &&
              tw`bg-pink-100 text-pink-900 hover:bg-pink-100 border-r-2 border-pink-500`,
          ]}
        >
          {subTitleContents}
          <button
            onClick={e => {
              e.stopPropagation();
              onToggleSubSection();
            }}
            css={[
              tw`pr-3 pl-2 py-2`,
              tw`hover:bg-gray-200 hover:border-y-2 hover:border-l-4 hover:border-gray-200`,
              tw`hover:svg:text-foreground text-gray-700`,
              hasLanding &&
                isCurrentPage(subTitle.slug) &&
                tw`hover:bg-pink-200 hover:border-y-2 hover:border-l-4 hover:border-pink-200`,
            ]}
            aria-labelledby={`sidebar-subtitle-${slugify(typeof subTitle === "string" ? subTitle : subTitle.slug)}`}
            aria-expanded={isExpanded}
          >
            <Arrow isExpanded={isExpanded} />
          </button>
        </div>
      );
    };

    return (
      <li
        key={
          typeof item.subTitle === "string"
            ? item.subTitle
            : item.subTitle.title
        }
      >
        {renderSubtitle(item.subTitle)}
        {isExpanded && (
          <ul>
            {item.pages.map(page => {
              if ("url" in page) {
                return renderExternalLink(page, true);
              } else {
                return renderPageLink(page, true);
              }
            })}
          </ul>
        )}
      </li>
    );
  };

  if ("url" in item) {
    return renderExternalLink(item);
  } else if ("subTitle" in item) {
    return renderSubSection(item);
  } else {
    return renderPageLink(item);
  }
};

export default SidebarItem;
