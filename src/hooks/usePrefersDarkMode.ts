import { useMediaQuery } from "./useMediaQuery";

export const prefersDarkModeMediaQuery = "(prefers-color-scheme: dark)";

export const usePrefersDarkMode = (): boolean => {
  return useMediaQuery(prefersDarkModeMediaQuery);
};
