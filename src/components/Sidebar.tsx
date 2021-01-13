import { useRouter } from "next/router";
import tw, { styled } from "twin.macro";
import { sidebarContent } from "../data/sidebar";
import { Link } from "./Link";
import { Logo } from "./Logo";
import React from "react";

export interface Props {}

export const Sidebar: React.FC<Props> = props => {
  const { pathname } = useRouter();

  return (
    <Container className="sidebar" {...props}>
      <div tw="py-4 px-4 mb-8 sticky top-0 bg-background">
        <Link tw="w-full flex items-center space-x-4" href="/">
          <Logo tw="w-4 h-4" /> <span tw="font-bold">Railway</span>
        </Link>
      </div>

      {sidebarContent.map((section, i) => (
        <React.Fragment key={i}>
          {section.title != null && (
            <h5 tw="px-4 my-2 text-foreground text-sm font-bold">
              {section.title}
            </h5>
          )}
          <ul tw="mb-8">
            {section.pages.map(page => (
              <li key={page.slug}>
                <Link
                  href={page.slug}
                  css={[
                    tw`text-gray-700 text-sm`,
                    tw`block px-4 py-2`,
                    tw`hover:bg-gray-100 hover:text-foreground`,
                    pathname === `/docs/${page.slug}` &&
                      tw`bg-pink-100 text-pink-900 hover:bg-pink-100`,
                  ]}
                >
                  {page.title}
                </Link>
              </li>
            ))}
          </ul>
        </React.Fragment>
      ))}
    </Container>
  );
};

const Container = styled.div`
  ${tw`h-screen sticky top-0 overflow-y-scroll`}

  min-width: 220px;

  /* width */
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    ${tw`bg-background`}
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    ${tw`bg-gray-200 rounded-full`}
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    ${tw`bg-gray-300`}
  }
`;
