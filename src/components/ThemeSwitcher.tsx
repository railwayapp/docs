import React from "react";
import { Moon, Sun } from "react-feather";
import "twin.macro";
import { useIsMounted } from "../hooks/useIsMounted";
import { useTheme } from "../styles/theme";

export const ThemeSwitcher: React.FC = () => {
  const { colorMode, setColorMode } = useTheme();
  const toggleColorMode = () =>
    setColorMode(colorMode === "dark" ? "light" : "dark");

  const isMounted = useIsMounted();

  return (
    <>
      {isMounted && (
        <button
          tw="w-5 h-5 md:w-4 md:h-4 cursor-pointer focus:outline-none"
          onClick={toggleColorMode}
        >
          {colorMode === "dark" ? (
            <Sun width="100%" height="100%" />
          ) : (
            <Moon width="100%" height="100%" />
          )}
        </button>
      )}
    </>
  );
};
