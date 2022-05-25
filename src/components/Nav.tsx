import React, { useState } from "react";
import { useRouter } from "next/router";
import { ArrowRight, Menu, X } from "react-feather";
import tw from "twin.macro";
import { Link } from "./Link";
import { Logo } from "./Logo";

import { ThemeSwitcher } from "./ThemeSwitcher";
import { sidebarContent } from "../data/sidebar";

export const Nav: React.FC = () => {
  return (
    <header
      css={[tw`hidden md:flex`, tw`items-center justify-end`, tw`px-8 py-6`]}
    >
      <ul>
        <li>
          <Link
            href="https://railway.app/login"
            tw="flex items-center space-x-2 text-gray-400 text-sm hover:text-pink-500"
          >
            <span>Go to Railway</span>
            <ArrowRight tw="w-4 h-4" />
          </Link>
        </li>
      </ul>
    </header>
  );
};

export const MobileNav: React.FC = () => {
  const { pathname } = useRouter();
  const [isNavOpen, setIsNavOpen] = useState(true);

  return (
    <>
      <header
        css={[
          tw`flex items-center justify-between space-x-6 md:hidden`,
          tw`px-4 md:px-8 py-4 text-center`,
        ]}
      >
        <Link href="/">
          <Logo tw="w-10 h-10" />
        </Link>

        {/* <div tw="w-full block">
          <Search />
        </div> */}

        <div tw="flex items-center space-x-4 md:space-x-4">
          <button
            tw=" w-6 h-6 md:w-4 md:h-4 cursor-pointer focus:outline-none"
            onClick={() => setIsNavOpen(!isNavOpen)}
          >
            {isNavOpen ? (
              <X width="100%" height="100%" />
            ) : (
              <Menu width="100%" height="100%" />
            )}
          </button>

          <div tw="flex items-center">
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      <div
        css={[isNavOpen ? tw`block` : tw`hidden`, tw`w-full`, tw`md:hidden`]}
      >
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
                  <li key={page.slug} onClick={() => setIsNavOpen(!isNavOpen)}>
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
      </div>
    </>
  );
};
