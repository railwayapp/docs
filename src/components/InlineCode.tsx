import React, { PropsWithChildren } from "react";
import tw from "twin.macro";
import { useTheme } from "../styles/theme";
import { darkCodeTheme, lightCodeTheme } from "../styles/codeThemes";
import { useIsMounted } from "@/hooks/useIsMounted";

type CodeTheme = {
  'pre[class*="language-"]': {
    background: string;
  };
  'code[class*="language-"]': {
    color: string;
  };
};

export const InlineCode: React.FC<PropsWithChildren> = ({ children }) => {
  const { colorMode } = useTheme();
  const theme = (
    colorMode == "light" ? lightCodeTheme : darkCodeTheme
  ) as CodeTheme;

  const isMounted = useIsMounted();

  return (
    <code
      css={tw`px-2 py-1 rounded font-mono whitespace-nowrap before:content-[''] after:content-['']`}
      style={{
        backgroundColor: theme['pre[class*="language-"]'].background,
        color: theme['code[class*="language-"]'].color,
      }}
      key={isMounted ? "mounted" : "unmounted"}
    >
      {children}
    </code>
  );
};
