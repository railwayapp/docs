import {
  ThemeProvider as NextThemeProvider,
  useTheme as useNextTheme,
} from "next-themes";
import Head from "next/head";
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { transformThemeToCustomProperties } from "theme-custom-properties";
import { GlobalStyles as TwinGlobalStyles } from "twin.macro";
import { ColorMode, colorThemes, defaultColorMode } from "./colors";
import { GlobalStyles } from "./GlobalStyles";
import { setCookie } from "cookies-next";

const themes = {
  light: { colors: colorThemes.light },
  dark: { colors: colorThemes.dark },
};

interface ThemeState {
  colorMode: ColorMode;
  setColorMode: (mode: string) => void;
}

const ThemeContext = createContext<ThemeState>({} as ThemeState);

export const useTheme = () => useContext(ThemeContext);

export const WrappedThemeProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const { bodyCSS } = useMemo(
    () =>
      transformThemeToCustomProperties(themes, {
        defaultTheme: defaultColorMode,
        attribute: "class",
      }),
    [defaultColorMode, themes],
  );

  const { resolvedTheme, setTheme } = useNextTheme();
  const colorMode = resolvedTheme as ColorMode;

  const themeState: ThemeState = {
    colorMode,
    setColorMode: value => {
      setCookie("theme", value, { maxAge: 60 * 60 * 24 * 365 * 100 });
      setTheme(value);
    },
  };

  useEffect(() => {
    setCookie("theme", colorMode, { maxAge: 60 * 60 * 24 * 365 * 100 });
  }, [colorMode]);

  return (
    <ThemeContext.Provider value={themeState}>
      <Head>
        <style>{bodyCSS}</style>
      </Head>
      <TwinGlobalStyles />
      <GlobalStyles />

      {children}
    </ThemeContext.Provider>
  );
};

export const ThemeProvider: React.FC<PropsWithChildren> = props => (
  <NextThemeProvider
    defaultTheme="system"
    enableSystem={true}
    disableTransitionOnChange={true}
    attribute="class"
  >
    <WrappedThemeProvider {...props} />
  </NextThemeProvider>
);
