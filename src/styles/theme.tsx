import {
  ThemeProvider as NextThemeProvider,
  useTheme as useNextTheme,
} from "next-themes";
import React, { PropsWithChildren } from "react";

export type ThemePreference = "system" | "light" | "dark";
export type ResolvedTheme = "light" | "dark";

// Re-export useTheme from next-themes with a simpler interface
export const useTheme = () => {
  const { theme, resolvedTheme, setTheme } = useNextTheme();
  return {
    // The user's preference: "system", "light", or "dark"
    theme: theme as ThemePreference | undefined,
    // The actual resolved theme: always "light" or "dark"
    resolvedTheme: resolvedTheme as ResolvedTheme | undefined,
    // Legacy alias for resolvedTheme (backward compatibility)
    colorMode: resolvedTheme as ResolvedTheme | undefined,
    // Set the theme preference
    setTheme,
    // Legacy alias for setTheme (backward compatibility)
    setColorMode: setTheme,
  };
};

export const ThemeProvider: React.FC<PropsWithChildren> = ({ children }) => (
  <NextThemeProvider
    defaultTheme="system"
    disableTransitionOnChange
    attribute="data-theme"
  >
    {children}
  </NextThemeProvider>
);
