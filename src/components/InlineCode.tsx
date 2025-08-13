import React from "react";
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
      css={tw`rounded font-mono whitespace-nowrap inline-block before:content-[''] after:content-['']`}
      style={{
        backgroundColor: String(theme['pre[class*="language-"]'].background),
        color: theme['code[class*="language-"]'].color,
        padding: "0.15rem 0.50rem 0px 0.50rem",
      }}
      data-colormode={colorMode}
    >
      {children}
    </code>
  );
};
