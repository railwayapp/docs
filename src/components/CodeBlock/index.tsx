import React, { useMemo, useEffect, useState } from "react";
import { CheckCircle, Copy } from "react-feather";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import bash from "react-syntax-highlighter/dist/cjs/languages/prism/bash";

import "twin.macro";
import { useCopy } from "../../hooks/useCopy";
import { darkCodeTheme, lightCodeTheme } from "../../styles/codeThemes";
import { useTheme } from "../../styles/theme";
import { Icon } from "../Icon";
import { normalize } from "./normalize";
import { useIsMounted } from "@/hooks/useIsMounted";
import { loadLanguage, isLanguageLoaded } from "./languages";

// Pre-register bash since it's the most common and needed for SSR
SyntaxHighlighter.registerLanguage("bash", bash);

export type SupportedLanguage =
  | "javascript"
  | "bash"
  | "json"
  | "toml"
  | "graphql"
  | "typescript"
  | "go"
  | "ruby"
  | "php"
  | "java"
  | "elixir"
  | "python"
  | "rust"
  | "clojure"
  | "scala"
  | "css"
  | "docker";

export interface Props {
  language?: string;
  className?: string;
  children?: any;
  colorModeSSR?: string | null;
  customStyle?: React.CSSProperties;
}

const getParams = (
  className = "",
): {
  language?: string;
  for?: string;
  always?: boolean;
} => {
  const [language, params = ""] = className.split(":");

  const splitParams = params
    .split("&")
    .reduce<Record<string, string>>((merged, param) => {
      const [key, value] = param.split("=");
      if (key !== "") {
        merged[key] = value ?? true;
      }

      return merged;
    }, {});

  return {
    language: language.split("language-")[1],
    ...splitParams,
  };
};

export const CodeBlock: React.FC<Props> = ({
  children,
  className = children.props ? children.props.className : "",
  language,
  colorModeSSR,
  customStyle,
}) => {
  const [copied, copy] = useCopy();
  const [isLanguageReady, setIsLanguageReady] = useState(false);

  const params = useMemo(() => getParams(className), [className]);

  const lang = useMemo(
    () => language ?? params.language ?? "bash",
    [language, params],
  );

  const { content } = useMemo(
    () =>
      normalize(
        children != null &&
          typeof children !== "string" &&
          children.props &&
          children.props.children
          ? children.props.children
          : children ?? "",
        className,
      ),
    [children],
  );

  // Dynamically load language if not already loaded
  useEffect(() => {
    if (lang === "bash" || isLanguageLoaded(lang)) {
      setIsLanguageReady(true);
      return;
    }

    loadLanguage(lang).then(() => {
      setIsLanguageReady(true);
    });
  }, [lang]);

  const isMounted = useIsMounted();

  const colorMode = !isMounted ? colorModeSSR || "light" : useTheme().colorMode;

  const theme = colorMode === "light" ? lightCodeTheme : darkCodeTheme;

  // Use bash as fallback while loading other languages
  const effectiveLang = isLanguageReady ? lang : "bash";

  return (
    <div tw="relative" className="group">
      <SyntaxHighlighter
        language={effectiveLang}
        style={theme}
        data-colormode={colorMode}
        customStyle={customStyle}
      >
        {content}
      </SyntaxHighlighter>
      <div tw="absolute top-0 right-0 mr-1 mt-1 text-gray-300 hover:text-gray-400 hidden group-hover:flex">
        {copied ? (
          <div tw="p-1">
            <Icon icon={CheckCircle} size="sm" />
          </div>
        ) : (
          <button
            tw="focus:ring-0 hover:bg-gray-200 p-1 rounded-md"
            type="button"
            onClick={() => copy(content)}
          >
            <Icon icon={Copy} size="sm" />
          </button>
        )}
      </div>
    </div>
  );
};
