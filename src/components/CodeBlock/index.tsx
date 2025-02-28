import React, { useMemo } from "react";
import { CheckCircle, Copy } from "react-feather";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import bash from "react-syntax-highlighter/dist/cjs/languages/prism/bash";
import graphql from "react-syntax-highlighter/dist/cjs/languages/prism/graphql";
import javascript from "react-syntax-highlighter/dist/cjs/languages/prism/javascript";
import json from "react-syntax-highlighter/dist/cjs/languages/prism/json";
import toml from "react-syntax-highlighter/dist/cjs/languages/prism/toml";
import typescript from "react-syntax-highlighter/dist/cjs/languages/prism/typescript";
import go from "react-syntax-highlighter/dist/cjs/languages/prism/go";
import ruby from "react-syntax-highlighter/dist/cjs/languages/prism/ruby";
import php from "react-syntax-highlighter/dist/cjs/languages/prism/php";
import java from "react-syntax-highlighter/dist/cjs/languages/prism/java";
import elixir from "react-syntax-highlighter/dist/cjs/languages/prism/elixir";
import python from "react-syntax-highlighter/dist/cjs/languages/prism/python";
import rust from "react-syntax-highlighter/dist/cjs/languages/prism/rust";
import clojure from "react-syntax-highlighter/dist/cjs/languages/prism/clojure";
import scala from "react-syntax-highlighter/dist/cjs/languages/prism/scala";
import css from "react-syntax-highlighter/dist/cjs/languages/prism/css";
import docker from "react-syntax-highlighter/dist/cjs/languages/prism/docker";


import "twin.macro";
import { useCopy } from "../../hooks/useCopy";
import { darkCodeTheme, lightCodeTheme } from "../../styles/codeThemes";
import { useTheme } from "../../styles/theme";
import { Icon } from "../Icon";
import { normalize } from "./normalize";
import { useIsMounted } from "@/hooks/useIsMounted";

SyntaxHighlighter.registerLanguage("js", javascript);
SyntaxHighlighter.registerLanguage("javascript", javascript);
SyntaxHighlighter.registerLanguage("bash", bash);
SyntaxHighlighter.registerLanguage("toml", toml);
SyntaxHighlighter.registerLanguage("json", json);
SyntaxHighlighter.registerLanguage("graphql", graphql);
SyntaxHighlighter.registerLanguage("typescript", typescript);
SyntaxHighlighter.registerLanguage("go", go);
SyntaxHighlighter.registerLanguage("ruby", ruby);
SyntaxHighlighter.registerLanguage("php", php);
SyntaxHighlighter.registerLanguage("java", java);
SyntaxHighlighter.registerLanguage("elixir", elixir);
SyntaxHighlighter.registerLanguage("python", python);
SyntaxHighlighter.registerLanguage("rust", rust);
SyntaxHighlighter.registerLanguage("clojure", clojure);
SyntaxHighlighter.registerLanguage("scala", scala);
SyntaxHighlighter.registerLanguage("css", css);
SyntaxHighlighter.registerLanguage("docker", docker);


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
}) => {
  const [copied, copy] = useCopy();

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

  const isMounted = useIsMounted();

  const colorMode = !isMounted ? colorModeSSR || "light" : useTheme().colorMode;

  const theme = colorMode === "light" ? lightCodeTheme : darkCodeTheme;

  return (
    <div tw="relative" className="group">
      <SyntaxHighlighter
        language={lang}
        style={theme}
        data-colormode={colorMode}
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
