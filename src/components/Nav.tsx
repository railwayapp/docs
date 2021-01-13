import React from "react";
import { Link } from "./Link";
import { Logo } from "./Logo";
import tw from "twin.macro";
import { Sun, Moon } from "react-feather";
import { useTheme } from "../styles/theme";

export const Nav: React.FC = () => {
  const { colorMode, setColorMode } = useTheme();
  const toggleColorMode = () =>
    setColorMode(colorMode === "dark" ? "light" : "dark");

  return (
    <Header>
      <div />

      <div tw="flex items-center">
        <button
          tw="w-4 h-4 cursor-pointer focus:outline-none"
          onClick={toggleColorMode}
        >
          {colorMode === "dark" ? (
            <Sun width="100%" height="100%" />
          ) : (
            <Moon width="100%" height="100%" />
          )}
        </button>
      </div>
    </Header>
  );
};

const Header = tw.header`
  flex items-center justify-between
  px-3 py-6 text-center
  sticky top-0 z-10
`;
