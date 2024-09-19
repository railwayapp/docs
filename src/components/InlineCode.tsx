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

export interface Props {
  children?: any;
  colorModeSSR?: string | null;
}

export const InlineCode: React.FC<Props> = ({ children, colorModeSSR }) => {
  const isMounted = useIsMounted();

  const colorMode = !isMounted ? colorModeSSR || "light" : useTheme().colorMode;

  const theme = colorMode === "light" ? lightCodeTheme : darkCodeTheme;

  return (
    <code
      css={tw`px-2 py-1 rounded font-mono whitespace-nowrap before:content-[''] after:content-['']`}
      style={{
        backgroundColor: String(theme['pre[class*="language-"]'].background),
        color: theme['code[class*="language-"]'].color,
      }}
      data-colorMode={colorMode}
    >
      {children}
    </code>
  );
};
