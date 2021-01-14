import { useEffect, useState, useMemo } from "react";

const onBrowser = typeof window !== "undefined" && window.matchMedia != null;

export const useMediaQuery = (query: string): boolean => {
  const mediaQuery: MediaQueryList | null = useMemo(
    () => (onBrowser ? window.matchMedia(query) : null),
    [query],
  );

  const [value, setValue] = useState(mediaQuery?.matches);

  useEffect(() => {
    const handler = () => {
      setValue(mediaQuery?.matches);
    };

    mediaQuery?.addListener(handler);
    return () => mediaQuery?.removeListener(handler);
  }, [mediaQuery]);

  return value ?? false;
};
