import { useRouter } from "next/router";
import tw, { styled } from "twin.macro";
import { sidebarContent } from "../data/sidebar";
import { Link } from "./Link";
import { Logo } from "./Logo";
import React from "react";
import { ScrollArea } from "./ScrollArea";

export const Sidebar: React.FC = ({ ...props }) => {
  return (
    <Container
      css={[
        tw`hidden`,
        tw`md:h-screen md:sticky md:top-0 md:block md:min-w-sidebar overflow-hidden`,
        tw`md:border-r md:border-gray-200`,
      ]}
      className="sidebar"
      {...props}
    >
      <ScrollArea>
        <div tw="pt-6 pb-6 px-4 mb-8 sticky top-0 bg-background">
          <Link tw="w-full flex items-center space-x-6" href="/">
            <Logo /> <span tw="font-bold">Railway</span>
          </Link>
        </div>

        <SidebarContent />
      </ScrollArea>
    </Container>
  );
};

export const MobileNav: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
  return (
    <div css={[isOpen ? tw`block` : tw`hidden`, tw`w-full`, tw`md:hidden`]}>
      <SidebarContent />
    </div>
  );
};

const SidebarContent: React.FC = () => {
  const { pathname } = useRouter();

  return (
    <>
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
                    tw`focus:outline-none focus:bg-pink-100`,
                    pathname === page.slug &&
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

const Container = styled.div`
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
