// SidebarLink.tsx
import React from 'react';
import classNames from 'classnames';
import { Link } from './Link';
import tw from 'twin.macro';
import { IPage, ISubSection, IExternalLink } from "../types";

interface SidebarLinkProps {
    item: IPage | ISubSection | IExternalLink;
    isCurrentPage: (pageSlug: string) => boolean;
    isExpanded: boolean;
    onToggleSubSection: (subTitleSlug: string, isTopLevelPageClick?: boolean, isDirectToggle?: boolean) => void;
  }

const SidebarLink: React.FC<SidebarLinkProps> = ({ item, isCurrentPage, isExpanded, onToggleSubSection }) => {
    
    const arrowSvg = isExpanded ? ( 
        <svg css={[tw`h-4 w-4 text-gray-700`]} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg> ) : (
        <svg css={[tw`h-4 w-4 text-gray-500`]} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 001.414 0L13.414 10l-4.707-4.707a1 1 0 00-1.414 1.414L10.586 10l-3.293 3.293a1 1 0 000 1.414z" clipRule="evenodd" />
        </svg>
    );

    const externalLinkSvg = 
        <svg css={[tw`w-3 h-3 text-gray-700`]} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15 11v4.833A1.166 1.166 0 0 1 13.833 17H2.167A1.167 1.167 0 0 1 1 15.833V4.167A1.166 1.166 0 0 1 2.167 3h4.618m4.447-2H17v5.768M9.111 8.889l7.778-7.778"/>
        </svg>

    if ('url' in item) {
        // This is an external link
        return (
          <li key={item.url} css={[
              tw`flex items-center`, 
              tw`px-4 py-2`,
              tw`hover:bg-gray-100 hover:text-foreground`, 
              tw`border-r-2 border-transparent`]}>
            <Link
              href={item.url}
              css={[
                tw`text-gray-700 text-sm flex-grow`
              ]}
            >
              {item.title}
            </Link>
            {externalLinkSvg}
          </li>
        );
      } else if ('subTitle' in item) {
        // these are the expandable sections
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
                  onClick={() => {
                    onToggleSubSection(item.subTitle.slug, true, false);
                  }}
                  css={[
                    tw`text-gray-700 text-sm flex-grow hover:text-foreground`,
                    isCurrentPage(item.subTitle.slug) &&
                      tw`bg-pink-100 text-pink-900 hover:bg-pink-100 border-pink-500`,
                  ]}
                >
                  {item.subTitle.title}
                </Link>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleSubSection(item.subTitle.slug, false, true);
                  }}
                  css={[
                    tw`cursor-pointer p-2 -m-2`,
                  ]}
                >
                  {arrowSvg}
                </div>
            </div>
            {isExpanded && (
              // these are the links in the expanded section
              <ul>
                {item.pages.map(page => (
                <li key={page.slug}>
                    <Link
                      href={page.slug}
                      className={classNames(isCurrentPage(page.slug) && `current`)}
                      css={[
                        tw`text-gray-700 text-sm`,
                        tw`block py-2 ml-4 pl-2`,
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

export default SidebarLink;
