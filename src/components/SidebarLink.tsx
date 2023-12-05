// SidebarLink.tsx
import React from 'react';
import classNames from 'classnames';
import { Link } from './Link';
import tw from 'twin.macro';
import { IPage, ISubSection, IExternalLink } from "../types";

interface SidebarLinkProps {
    slug: string,
    item: IPage | ISubSection | IExternalLink;
    isCurrentPage: (pageSlug: string) => boolean;
    isExpanded: boolean;
    onToggleSubSection: (isDirectToggle: boolean) => void;
  }

const SidebarLink: React.FC<SidebarLinkProps> = ({ slug, item, isCurrentPage, isExpanded, onToggleSubSection }) => {
    
    const arrowSvg = isExpanded ? ( 
        <svg css={[tw`h-4 w-4`]} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg> ) : (
        <svg css={[tw`h-4 w-4`]} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 001.414 0L13.414 10l-4.707-4.707a1 1 0 00-1.414 1.414L10.586 10l-3.293 3.293a1 1 0 000 1.414z" clipRule="evenodd" />
        </svg>
    );

    const externalLinkSvg = 
        <svg css={[tw`w-3 h-3 text-gray-700`]} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 23 23">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15 11v4.833A1.166 1.166 0 0 1 13.833 17H2.167A1.167 1.167 0 0 1 1 15.833V4.167A1.166 1.166 0 0 1 2.167 3h4.618m4.447-2H17v5.768M9.111 8.889l7.778-7.778"/>
        </svg>

    if ('url' in item) {
        // This is an external link
        return (
          <li key={item.url} 
              css={[
                tw`flex items-center`, 
                tw`ml-2 pl-2`,
                tw`hover:bg-gray-100`, 
                ]}>
            <Link
              href={item.url}
              css={[
                tw`text-gray-700 text-sm flex-grow`, 
                tw`w-full py-2 hover:text-foreground`, 
                tw`flex justify-between items-center`
                ]}>
                <span>{item.title}</span>
                <span css={tw`mr-4 hover:svg:text-foreground`}>
                  {externalLinkSvg}
                </span>
            </Link>
          </li>
        );
      } else if ('subTitle' in item) {
        // these are the expandable sections
        return (
          // the first Link is the subTitle page, i.e. How To > Get Started
          <li key={slug}>
            <div 
              css={[
                tw`flex justify-between items-center`,
                tw`hover:bg-gray-100`,
                tw`focus:outline-none focus:bg-pink-100`,
                tw`border-r-2 border-transparent`,
                isCurrentPage(slug) &&
                  tw`bg-pink-100 text-pink-900 hover:bg-pink-100 border-r-2 border-pink-500`,
                ]}
              >
                { typeof item.subTitle === 'string' ? (
                    <span
                      onClick={(e) => {
                        onToggleSubSection(true);
                      }} 
                      css={[
                        tw`text-gray-700 flex-grow`,
                        tw`hover:cursor-pointer`,
                        tw`text-sm`,
                        tw`pl-4 py-2`]}>
                      {item.subTitle}
                    </span>
                  ) : (
                    <Link
                      className={classNames(isCurrentPage(slug) && `current`)}
                      href={slug}
                      onClick={(e) => {
                        onToggleSubSection(false);
                      }}
                      css={[
                        tw`text-gray-700 flex-grow text-sm hover:text-foreground`,
                        tw`pl-4 py-2`,
                        isCurrentPage(slug) &&
                          tw`bg-pink-100 text-pink-900 hover:bg-pink-100 border-pink-500`,
                      ]}
                    >
                      {item.subTitle.title}
                    </Link>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleSubSection(true);
                  }}
                  css={[
                    tw`pr-3 pl-2 py-2`,
                    tw`hover:bg-gray-200 hover:border-y-2 hover:border-l-4 hover:border-gray-200`,
                    tw`hover:svg:text-foreground text-gray-700`,
                    isCurrentPage(slug) &&
                          tw`hover:bg-pink-200 hover:border-y-2 hover:border-l-4 hover:border-pink-200`,
                  ]}
                >
                  {arrowSvg}
                </button>
            </div>
            {isExpanded && (
              <ul>
                {item.pages.map(page => {
                  // Check if the page is an external link
                  if ('url' in page) {
                    return (
                      <li key={page.url} 
                        css={[
                          tw`flex items-center`, 
                          tw`ml-6 pl-2`,
                          tw`hover:bg-gray-100`, 
                        ]}>
                        <Link
                          href={page.url}
                          css={[tw`text-gray-700 text-sm flex-grow`, 
                                tw`py-2 w-full hover:text-foreground`, 
                                tw`flex justify-between items-center`
                              ]}
                        >
                          <span>{page.title}</span>
                          <span css={tw`mr-4 hover:svg:text-foreground`}>
                            {externalLinkSvg}
                          </span>
                        </Link>
                      </li>
                    );
                  } else {
                    // Handle as IPage
                    return (
                      <li key={page.slug}>
                          <Link
                            href={page.slug}
                            className={classNames(isCurrentPage(page.slug) && `current`)}
                            css={[
                              tw`text-gray-700 text-sm`,
                              tw`block py-2 ml-6 pl-2`,
                              tw`hover:bg-gray-100 hover:text-foreground`,
                              tw`focus:outline-none focus:bg-pink-100`,
                                isCurrentPage(page.slug) &&
                              tw`bg-pink-100 text-pink-900 hover:bg-pink-100 border-r-2 border-pink-500`,
                            ]}
                          >
                            {page.title}
                          </Link>
                      </li>
                    );
                  }
                })}
              </ul>
            )}

          </li>
        );
      } else {
        // This is a page
        return (
          <li key={slug}>
            <Link
              href={slug}
              className={classNames(isCurrentPage(slug) && `current`)}
              css={[
                tw`text-gray-700 text-sm`,
                tw`block px-4 py-2`,
                tw`hover:bg-gray-100 hover:text-foreground`,
                tw`focus:outline-none focus:bg-pink-100`,
                isCurrentPage(slug) &&
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
