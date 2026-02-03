import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { cn } from "@/lib/cn";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
  transformerRemoveLineBreak,
} from "@shikijs/transformers";
import * as React from "react";
import { Icon } from "../icon";
import { codeToHtml, bundledLanguages, type BundledLanguage } from "shiki";

// Check if a language is supported by shiki
function isSupportedLanguage(lang: string): lang is BundledLanguage {
  return lang in bundledLanguages;
}

// Language to icon mapping
const languageIcons: Record<string, string> = {
  typescript: "Typescript",
  ts: "Typescript",
  tsx: "React",
  javascript: "Typescript",
  js: "Typescript",
  jsx: "React",
  bash: "Bash",
  sh: "Bash",
  shell: "Bash",
  zsh: "Bash",
};

// Get icon name for a language
function getLanguageIcon(lang: string): string {
  return languageIcons[lang.toLowerCase()] || "File";
}

// Extract text content from code for copying
function extractTextFromCode(code: string): string {
  // Remove Shiki notation comments like [!code ++], [!code --], [!code highlight], etc.
  return code
    .split("\n")
    .map(line =>
      line
        .replace(
          /\s*\/\/\s*\[!code\s+(?:\+\+|--|highlight|word:\w+)(?::\d+)?\]\s*$/g,
          "",
        )
        .replace(
          /\s*\/\*\s*\[!code\s+(?:\+\+|--|highlight|word:\w+)(?::\d+)?\]\s*\*\/\s*/g,
          "",
        ),
    )
    .join("\n");
}

export interface CodeBlockProps {
  code?: string;
  lang?: string;
  filename?: string;
  showLineNumbers?: boolean;
  collapsible?: boolean;
  className?: string;
  children?: React.ReactNode;
}

// CodeTab component for tabbed code blocks
export interface CodeTabProps {
  label: string;
  children: React.ReactNode;
  lang?: string;
}

export function CodeTab({ children }: CodeTabProps) {
  // This component is just a marker - the actual rendering is handled by TabbedCodeBlock
  return <>{children}</>;
}

// Alias for CodeBlock when used with tabs - clearer intent in MDX
export const CodeTabs = CodeBlock;

// Type for extracted tab data
interface TabData {
  label: string;
  code: string;
  lang: string;
}

// Extract tab data from CodeTab children
function extractTabsFromChildren(children: React.ReactNode): TabData[] {
  const tabs: TabData[] = [];

  React.Children.forEach(children, child => {
    if (React.isValidElement(child) && child.type === CodeTab) {
      const props = child.props as CodeTabProps;
      // Extract code from children - could be a string, pre/code element, or CodeBlock
      let code = "";
      let lang = props.lang || "bash";

      // Try to extract code from the children
      code = extractCodeFromTabChildren(props.children);

      // Try to get language from the children's className
      const langFromChildren = extractLangFromChildren(props.children);
      if (langFromChildren) {
        lang = langFromChildren;
      }

      tabs.push({
        label: props.label,
        code: code.trim(),
        lang,
      });
    }
  });

  return tabs;
}

// Recursively extract code from tab children
function extractCodeFromTabChildren(children: React.ReactNode): string {
  if (typeof children === "string") {
    return children;
  }

  if (Array.isArray(children)) {
    return children.map(extractCodeFromTabChildren).join("");
  }

  if (React.isValidElement(children)) {
    const element = children as React.ReactElement;
    const props = element.props as {
      children?: React.ReactNode;
      className?: string;
      code?: string;
      "data-language"?: string;
    };

    // Check if this is a CodeBlock with code prop
    if (props.code) {
      return props.code;
    }

    // Check if this is a pre element with data-language (from our rehype plugin)
    if (
      element.type === "pre" ||
      (typeof element.type === "string" && element.type === "pre")
    ) {
      // Look for code element inside
      const codeChild = React.Children.toArray(props.children).find(
        c =>
          React.isValidElement(c) &&
          ((c as React.ReactElement).type === "code" || isCodeElement(c)),
      );
      if (codeChild && React.isValidElement(codeChild)) {
        return extractTextFromChildren(
          (codeChild as React.ReactElement).props.children,
        );
      }
      return extractTextFromChildren(props.children);
    }

    // Check if this is a code element
    if (
      element.type === "code" ||
      (typeof element.type === "string" && element.type === "code")
    ) {
      return extractTextFromChildren(props.children);
    }

    // Recursively check children
    if (props.children) {
      return extractCodeFromTabChildren(props.children);
    }
  }

  return "";
}

// Extract language from children's className
function extractLangFromChildren(children: React.ReactNode): string | null {
  if (React.isValidElement(children)) {
    const element = children as React.ReactElement;
    const props = element.props as {
      children?: React.ReactNode;
      className?: string;
      "data-language"?: string;
    };

    // Check for data-language attribute (from rehype plugin)
    if (props["data-language"]) {
      return props["data-language"];
    }

    // Check for language-* className
    if (props.className) {
      const match = props.className.match(/language-(\w+)/);
      if (match) return match[1];
    }

    // Recursively check children
    if (props.children) {
      const childArray = React.Children.toArray(props.children);
      for (const child of childArray) {
        const lang = extractLangFromChildren(child);
        if (lang) return lang;
      }
    }
  }

  return null;
}

// Tabbed code block component
function TabbedCodeBlock({
  tabs,
  className,
}: {
  tabs: TabData[];
  className?: string;
}) {
  const [activeTab, setActiveTab] = React.useState(0);
  const [htmlCache, setHtmlCache] = React.useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = React.useState(true);
  const { copied, copy } = useCopyToClipboard();

  const activeTabData = tabs[activeTab];
  const cleanCode = React.useMemo(
    () => extractTextFromCode(activeTabData?.code || ""),
    [activeTabData?.code],
  );

  // Highlight code for active tab
  React.useEffect(() => {
    if (!activeTabData) return;

    // Check cache first
    if (htmlCache[activeTab]) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    async function highlight() {
      try {
        // Normalize and validate language
        const normalizedLang = activeTabData.lang.toLowerCase();
        const effectiveLang = isSupportedLanguage(normalizedLang)
          ? normalizedLang
          : "plaintext";

        const result = await codeToHtml(activeTabData.code, {
          lang: effectiveLang,
          themes: {
            light: "one-light",
            dark: "one-dark-pro",
          },
          defaultColor: false,
          transformers: [
            transformerNotationDiff(),
            transformerNotationHighlight(),
            transformerNotationWordHighlight(),
            transformerRemoveLineBreak(),
          ],
        });

        if (!cancelled) {
          setHtmlCache(prev => ({
            ...prev,
            [activeTab]: result,
          }));
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Shiki highlighting error:", error);
        if (!cancelled) {
          const escapedCode = activeTabData.code
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
          const lines = escapedCode
            .split("\n")
            .map(line => `<span class="line">${line}</span>`)
            .join("\n");
          const fallback = `<pre class="shiki"><code>${lines}</code></pre>`;
          setHtmlCache(prev => ({ ...prev, [activeTab]: fallback }));
          setIsLoading(false);
        }
      }
    }

    highlight();

    return () => {
      cancelled = true;
    };
  }, [activeTab, activeTabData, htmlCache]);

  const iconName = getLanguageIcon(activeTabData?.lang || "text");

  return (
    <div
      className={cn(
        "group/code-block relative my-6 overflow-hidden rounded-lg border border-muted bg-muted-app-subtle",
        className,
      )}
    >
      {/* Header with tabs and copy button */}
      <div className="flex items-center justify-between border-b border-muted bg-muted-element/50 px-3 py-2 sm:px-4">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 overflow-x-auto">
          <CodeBlockIcon
            name={iconName}
            className="size-4 flex-shrink-0 text-muted-base sm:size-5"
          />
          {/* Tab buttons */}
          <div className="flex items-center rounded-md bg-muted-element p-0.5">
            {tabs.map((tab, index) => (
              <button
                key={tab.label}
                type="button"
                onClick={() => setActiveTab(index)}
                className={cn(
                  "px-2 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap sm:px-2.5",
                  activeTab === index
                    ? "bg-white dark:bg-muted-element-active text-muted-high-contrast shadow-sm"
                    : "text-muted-base hover:text-muted-high-contrast",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={() => copy(cleanCode)}
          className="flex size-7 flex-shrink-0 items-center justify-center rounded-md text-muted-base transition-all hover:bg-muted-element hover:text-muted-high-contrast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-solid"
          aria-label={copied ? "Copied!" : "Copy code"}
        >
          {copied ? (
            <Icon name="Check" className="size-4 text-success-base" />
          ) : (
            <Icon name="Copy" className="size-4" />
          )}
        </button>
      </div>

      {/* Code content */}
      <div className="overflow-x-auto text-sm">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Icon
              name="Spinner"
              className="size-5 animate-spin text-muted-base"
            />
          </div>
        ) : (
          <div
            className="shiki-wrapper"
            dangerouslySetInnerHTML={{ __html: htmlCache[activeTab] || "" }}
          />
        )}
      </div>
    </div>
  );
}

// Collapsed height: 10 lines * 1.5em line-height * 14px base font = ~210px + padding
const COLLAPSED_HEIGHT = 240;

export function CodeBlock({
  code,
  lang = "text",
  filename,
  showLineNumbers = false,
  collapsible = false,
  className,
  children,
}: CodeBlockProps) {
  // Check if we have CodeTab children for tabbed mode
  const tabs = React.useMemo(() => {
    if (children) {
      return extractTabsFromChildren(children);
    }
    return [];
  }, [children]);

  // If we have tabs, render the tabbed code block
  if (tabs.length > 0) {
    return <TabbedCodeBlock tabs={tabs} className={className} />;
  }

  // Otherwise, render the standard code block
  return (
    <StandardCodeBlock
      code={code || ""}
      lang={lang}
      filename={filename}
      showLineNumbers={showLineNumbers}
      collapsible={collapsible}
      className={className}
    />
  );
}

// Standard single code block (extracted from original CodeBlock)
function StandardCodeBlock({
  code,
  lang = "text",
  filename,
  showLineNumbers = false,
  collapsible = false,
  className,
}: {
  code: string;
  lang?: string;
  filename?: string;
  showLineNumbers?: boolean;
  collapsible?: boolean;
  className?: string;
}) {
  const [html, setHtml] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [isExpanded, setIsExpanded] = React.useState(!collapsible);
  const [contentHeight, setContentHeight] = React.useState<number | null>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const { copied, copy } = useCopyToClipboard();

  // Measure content height when HTML changes or loading completes
  React.useEffect(() => {
    if (!isLoading && contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [html, isLoading]);

  const cleanCode = React.useMemo(
    () => extractTextFromCode(code.trim()),
    [code],
  );

  React.useEffect(() => {
    let cancelled = false;

    async function highlight() {
      try {
        // Normalize and validate language
        const normalizedLang = lang.toLowerCase();
        const effectiveLang = isSupportedLanguage(normalizedLang)
          ? normalizedLang
          : "plaintext";

        const result = await codeToHtml(code.trim(), {
          lang: effectiveLang,
          themes: {
            light: "one-light",
            dark: "github-dark-default",
          },
          defaultColor: false,
          transformers: [
            transformerNotationDiff(),
            transformerNotationHighlight(),
            transformerNotationWordHighlight(),
            transformerRemoveLineBreak(),
          ],
        });

        if (!cancelled) {
          setHtml(result);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Shiki highlighting error:", error);
        if (!cancelled) {
          // Fallback to plain code block with proper line handling
          const escapedCode = code
            .trim()
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
          const lines = escapedCode
            .split("\n")
            .map(line => `<span class="line">${line}</span>`)
            .join("\n");
          setHtml(`<pre class="shiki"><code>${lines}</code></pre>`);
          setIsLoading(false);
        }
      }
    }

    highlight();

    return () => {
      cancelled = true;
    };
  }, [code, lang]);

  const iconName = getLanguageIcon(lang);

  return (
    <div
      className={cn(
        "group/code-block relative my-6 overflow-hidden rounded-lg border border-muted bg-muted-app-subtle",
        className,
      )}
    >
      {/* Header with filename and copy button */}
      <div className="flex items-center justify-between border-b border-muted bg-muted-element/50 px-3 py-2 sm:px-4">
        <div className="flex items-center gap-2 text-sm text-muted-base min-w-0">
          <CodeBlockIcon
            name={iconName}
            className="size-4 flex-shrink-0 sm:size-5"
          />
          {filename && (
            <span className="font-mono text-xs truncate">{filename}</span>
          )}
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {collapsible && (
            <button
              type="button"
              onClick={() => setIsExpanded(prev => !prev)}
              className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-muted-base transition-colors hover:bg-muted-element hover:text-muted-high-contrast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-solid"
              aria-label={isExpanded ? "Collapse code" : "Expand code"}
            >
              {isExpanded ? "Collapse" : "Expand"}
              {isExpanded ? (
                <Icon name="ChevronUp" className="size-3.5" />
              ) : (
                <Icon name="ChevronDown" className="size-3.5" />
              )}
            </button>
          )}
          <button
            type="button"
            onClick={() => copy(cleanCode)}
            className="flex size-7 items-center justify-center rounded-md text-muted-base transition-all hover:bg-muted-element hover:text-muted-high-contrast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-solid"
            aria-label={copied ? "Copied!" : "Copy code"}
          >
            {copied ? (
              <Icon name="Check" className="size-4 text-success-base" />
            ) : (
              <Icon name="Copy" className="size-4" />
            )}
          </button>
        </div>
      </div>

      {/* Code content */}
      <div
        ref={contentRef}
        className={cn(
          "overflow-x-auto text-sm transition-[max-height] duration-300 ease-in-out",
          showLineNumbers && "code-block-line-numbers",
          collapsible && !isExpanded && "overflow-y-hidden",
        )}
        style={
          collapsible
            ? {
                maxHeight: isExpanded
                  ? contentHeight ?? undefined
                  : COLLAPSED_HEIGHT,
              }
            : undefined
        }
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Icon
              name="Spinner"
              className="size-5 animate-spin text-muted-base"
            />
          </div>
        ) : (
          <div
            className="shiki-wrapper"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )}
      </div>

      {/* Expand overlay when collapsed */}
      {collapsible && !isExpanded && !isLoading && (
        <div className="absolute inset-x-0 bottom-0 flex h-16 items-end justify-center bg-gradient-to-t from-muted-app-subtle to-transparent pb-2">
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="flex items-center gap-1 rounded-md bg-muted-element px-3 py-1.5 text-xs font-medium text-muted-high-contrast transition-colors hover:bg-muted-element-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-solid"
          >
            Expand code
            <Icon name="ChevronDown" className="size-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

// Custom icon component for code block icons
function CodeBlockIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  // Use our Icon component for known icons
  if (["Typescript", "React", "Bash", "File"].includes(name)) {
    return (
      <Icon
        name={name as "Typescript" | "React" | "Bash" | "File"}
        className={className}
      />
    );
  }

  // Fallback to File icon
  return <Icon name="File" className={className} />;
}

// Helper to extract text content from React children recursively
function extractTextFromChildren(children: React.ReactNode): string {
  if (typeof children === "string") {
    return children;
  }
  if (typeof children === "number") {
    return String(children);
  }
  if (Array.isArray(children)) {
    return children.map(extractTextFromChildren).join("");
  }
  if (React.isValidElement(children)) {
    const childProps = children.props as { children?: React.ReactNode };
    if (childProps.children) {
      return extractTextFromChildren(childProps.children);
    }
  }
  return "";
}

// Check if a React element could be a code element
// MDX might transform `code` elements to use custom components, so we check multiple ways
function isCodeElement(child: unknown): child is React.ReactElement<{
  children?: React.ReactNode;
  className?: string;
}> {
  if (!React.isValidElement(child)) return false;

  const element = child as React.ReactElement;

  // Check if type is the string "code" (native element)
  if (element.type === "code") return true;

  // Check if it's a component with a displayName of "InlineCode" or similar
  if (typeof element.type === "function") {
    const fn = element.type as { displayName?: string; name?: string };
    if (fn.displayName === "InlineCode" || fn.name === "InlineCode")
      return true;
  }

  // Check if the rendered element has code-like className (language-*)
  const props = element.props as { className?: string };
  if (props.className?.includes("language-")) return true;

  // Check if there's only one child and it has children (likely a code wrapper)
  return false;
}

// Pre component for MDX - handles pre tags from markdown code blocks
export function Pre({
  children,
  className,
  ...props
}: React.ComponentProps<"pre"> & {
  "data-language"?: string;
  "data-title"?: string;
  "data-show-line-numbers"?: string;
  "data-collapsible"?: string;
}) {
  // Extract the code content and language from children
  // MDX might transform code elements, so we try multiple detection methods
  const childArray = React.Children.toArray(children);

  // Try to find a code element
  let codeElement = childArray.find(isCodeElement) as
    | React.ReactElement<{ children?: React.ReactNode; className?: string }>
    | undefined;

  // If we couldn't find a code element but have exactly one child, use it
  if (
    !codeElement &&
    childArray.length === 1 &&
    React.isValidElement(childArray[0])
  ) {
    codeElement = childArray[0] as React.ReactElement<{
      children?: React.ReactNode;
      className?: string;
    }>;
  }

  // If we have a data-language attribute, this is definitely a code block from our rehype plugin
  // Even if we can't find a proper code element, try to extract from children
  const hasCodeBlockData = props["data-language"] !== undefined;

  if (!codeElement && !hasCodeBlockData) {
    return (
      <pre className={className} {...props}>
        {children}
      </pre>
    );
  }

  // Extract code text from various possible child structures
  let code = "";
  if (codeElement) {
    code = extractTextFromChildren(codeElement.props.children);
  } else {
    // Fallback: try to extract from all children
    code = extractTextFromChildren(children);
  }

  // Get language from data attribute (from rehype plugin) or className
  const langMatch = codeElement?.props.className?.match(/language-(\w+)/);
  const lang = props["data-language"] || langMatch?.[1] || "text";

  // Get filename/title from data attribute (from rehype plugin)
  const filename = props["data-title"];

  // Check for options from data attributes (rehype plugin) or className (legacy)
  const showLineNumbers =
    props["data-show-line-numbers"] !== undefined ||
    className?.includes("line-numbers");
  const collapsible =
    props["data-collapsible"] !== undefined ||
    className?.includes("collapsible");

  return (
    <CodeBlock
      code={code}
      lang={lang}
      filename={filename}
      showLineNumbers={showLineNumbers}
      collapsible={collapsible}
      className={className}
    />
  );
}
