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
      <div tw="pt-4 pb-12 px-4">
        <Link tw="w-full flex items-center space-x-4" href="/">
          <Logo tw="w-4 h-4" /> <span tw="font-bold">Railway</span>
        </Link>
      </div>

      {sidebarContent.map(section => (
        <React.Fragment key={section}>
          {section.title != null && (
            <SectionTitle>{section.title}</SectionTitle>
          )}
          <ul tw="mb-8">
            {section.pages.map(page => (
              <li key={page.slug}>
                <SidebarLink
                  href={page.slug}
                  active={pathname === `/docs/${page.slug}`}
                >
                  {page.title}
                </SidebarLink>
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

const SectionTitle = tw.h5`
  px-4 my-2 text-foreground
  text-sm font-semibold
`;

const SidebarLink = styled(Link)<{ active: boolean }>(props => [
  tw`text-gray-700 text-sm`,
  tw`block px-4 py-2`,
  tw`hover:bg-gray-100`,
  props.active && tw`bg-pink-100 text-pink-900 hover:bg-pink-100`,
]);
