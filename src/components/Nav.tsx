import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { Home, Menu, X } from "react-feather";
import tw from "twin.macro";
import { Link } from "./Link";
import { Logo } from "./Logo";
import { OpenSearchModalButton } from "@/components/Search";
import { MobileSidebar } from "./Sidebar";
import { ThemeSwitcher } from "./ThemeSwitcher";

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
            <Home tw="w-4 h-4" />
            <span>Go to Railway</span>
          </Link>
        </li>
      </ul>
    </header>
  );
};

export const MobileNav: React.FC = () => {
  const router = useRouter();
  const [isNavOpen, setIsNavOpen] = useState(false);

  const hide = useCallback(() => {
    setIsNavOpen(false);
  }, [setIsNavOpen]);

  useEffect(() => {
    // subscribe
    router.events.on("routeChangeStart", hide);

    // unsubscribe
    return () => router.events.off("routeChangeStart", hide);
  }, [hide, router.events]);

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

        <div tw="w-full block">
          <OpenSearchModalButton />
        </div>

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

      <MobileSidebar isOpen={isNavOpen} />
    </>
  );
};
