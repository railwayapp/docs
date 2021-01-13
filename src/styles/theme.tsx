import {
  ThemeProvider as NextThemeProvider,
  useTheme as useNextTheme,
} from "next-themes";
import Head from "next/head";
import React, { createContext, useContext, useMemo } from "react";
import { transformThemeToCustomProperties } from "theme-custom-properties";
import { GlobalStyles as TwinGlobalStyles } from "twin.macro";
import { ColorMode, colorThemes, defaultColorMode } from "./colors";
import { GlobalStyles } from "./GlobalStyles";

const themes = {
  light: { colors: colorThemes.light },
  dark: { colors: colorThemes.dark },
};

interface ThemeState {
  colorMode: ColorMode;
}

interface ThemeActions {
  setColorMode: (mode: string) => void;
}

const ThemeContext = createContext<[ThemeState, ThemeActions]>(
  {} as [ThemeState, ThemeActions],
);

export const useTheme = () => useContext(ThemeContext)[0];

export const useSetColorMode = () => useContext(ThemeContext)[1].setColorMode;

export const WrappedThemeProvider: React.FC = ({ children }) => {
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
  };

  const themeActions: ThemeActions = {
    setColorMode: value => {
      setTheme(value);
    },
  };

  return (
    <ThemeContext.Provider value={[themeState, themeActions]}>
      <Head>
        <style>{bodyCSS}</style>
      </Head>
      <TwinGlobalStyles />
      <GlobalStyles />

      {children}
    </ThemeContext.Provider>
  );
};

export const ThemeProvider: React.FC = props => (
  <NextThemeProvider
    defaultTheme="dark"
    enableSystem={false}
    disableTransitionOnChange={true}
    attribute="class"
  >
    <WrappedThemeProvider {...props} />
  </NextThemeProvider>
);
