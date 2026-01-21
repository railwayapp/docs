import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";

type LanguageLoader = () => Promise<{ default: unknown }>;

const languageLoaders: Record<string, LanguageLoader> = {
  javascript: () => import("react-syntax-highlighter/dist/cjs/languages/prism/javascript"),
  js: () => import("react-syntax-highlighter/dist/cjs/languages/prism/javascript"),
  typescript: () => import("react-syntax-highlighter/dist/cjs/languages/prism/typescript"),
  json: () => import("react-syntax-highlighter/dist/cjs/languages/prism/json"),
  toml: () => import("react-syntax-highlighter/dist/cjs/languages/prism/toml"),
  graphql: () => import("react-syntax-highlighter/dist/cjs/languages/prism/graphql"),
  go: () => import("react-syntax-highlighter/dist/cjs/languages/prism/go"),
  ruby: () => import("react-syntax-highlighter/dist/cjs/languages/prism/ruby"),
  php: () => import("react-syntax-highlighter/dist/cjs/languages/prism/php"),
  java: () => import("react-syntax-highlighter/dist/cjs/languages/prism/java"),
  elixir: () => import("react-syntax-highlighter/dist/cjs/languages/prism/elixir"),
  python: () => import("react-syntax-highlighter/dist/cjs/languages/prism/python"),
  rust: () => import("react-syntax-highlighter/dist/cjs/languages/prism/rust"),
  clojure: () => import("react-syntax-highlighter/dist/cjs/languages/prism/clojure"),
  scala: () => import("react-syntax-highlighter/dist/cjs/languages/prism/scala"),
  css: () => import("react-syntax-highlighter/dist/cjs/languages/prism/css"),
  docker: () => import("react-syntax-highlighter/dist/cjs/languages/prism/docker"),
};

const loadedLanguages = new Set<string>(["bash"]);

export async function loadLanguage(language: string): Promise<void> {
  if (loadedLanguages.has(language)) {
    return;
  }

  const loader = languageLoaders[language];
  if (!loader) {
    return;
  }

  try {
    const langModule = await loader();
    SyntaxHighlighter.registerLanguage(language, langModule.default as any);
    loadedLanguages.add(language);

    // Also register 'js' alias if javascript is loaded
    if (language === "javascript") {
      loadedLanguages.add("js");
    }
  } catch (error) {
    console.error(`Failed to load language: ${language}`, error);
  }
}

export function isLanguageLoaded(language: string): boolean {
  return loadedLanguages.has(language);
}
