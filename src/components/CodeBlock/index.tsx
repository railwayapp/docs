import React, { useMemo } from "react";
import { CheckCircle, Copy } from "react-feather";
import javascript from "react-syntax-highlighter/dist/cjs/languages/prism/javascript";
import bash from "react-syntax-highlighter/dist/cjs/languages/prism/bash";
import json from "react-syntax-highlighter/dist/cjs/languages/prism/json";
import toml from "react-syntax-highlighter/dist/cjs/languages/prism/toml";
import graphql from "react-syntax-highlighter/dist/cjs/languages/prism/graphql";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";

import "twin.macro";
import { useCopy } from "../../hooks/useCopy";
import { useIsMounted } from "../../hooks/useIsMounted";
import { darkCodeTheme, lightCodeTheme } from "../../styles/codeThemes";
import { useTheme } from "../../styles/theme";
import { Icon } from "../Icon";
import { normalize } from "./normalize";

SyntaxHighlighter.registerLanguage("js", javascript);
SyntaxHighlighter.registerLanguage("javascript", javascript);
SyntaxHighlighter.registerLanguage("bash", bash);
SyntaxHighlighter.registerLanguage("toml", toml);
SyntaxHighlighter.registerLanguage("json", json);
SyntaxHighlighter.registerLanguage("graphql", graphql);

export type SupportedLanguage =
  | "javascript"
  | "bash"
  | "json"
  | "toml"
  | "graphql";

export interface Props {
  language?: string;
  className?: string;
  children?: any;
}

const getParams = (
  className = "",
): { language?: string; for?: string; always?: boolean } => {
  const [language, params = ""] = className.split(":");

  const splitParams: { [key: string]: string } = params
    .split("&")
    .reduce((merged, param) => {
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
}) => {
  const isMounted = useIsMounted();
  const [copied, copy] = useCopy();

  const { colorMode } = useTheme();
  const theme = colorMode === "light" ? lightCodeTheme : darkCodeTheme;

  const params = useMemo(() => getParams(className) as any, [className]);

  const lang = useMemo(
    () => language ?? params.language ?? "bash",
    [language, params],
  );

  const [content] = useMemo(
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

  if (!isMounted) {
    return null;
  }

  return (
    <div tw="relative" className="group">
      <SyntaxHighlighter language={lang} style={theme}>
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
