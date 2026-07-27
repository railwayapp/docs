import type { Element, Root } from "hast";
import { visit } from "unist-util-visit";

/**
 * Rehype plugin that provides a great DX for code blocks in MDX.
 *
 * Instead of the verbose JSX syntax:
 * ```jsx
 * <CodeBlock code={`const x = 1`} lang="ts" filename="example.ts" />
 * ```
 *
 * You can now write standard markdown with metadata:
 * ```ts title="example.ts"
 * const x = 1
 * ```
 *
 * Supported metadata options:
 * - title="..." or filename="..." - Shows a title/filename in the header
 * - showLineNumbers - Enables line numbers
 * - collapsible - Makes long code blocks collapsible
 *
 * This plugin parses the code fence metadata and adds data attributes
 * to the pre element. The client-side CodeBlock component then reads
 * these attributes to render the enhanced code block.
 */

function isElement(node: unknown): node is Element {
  return (
    !!node &&
    typeof node === "object" &&
    "type" in node &&
    node.type === "element"
  );
}

function isBlockCode(element: Element): boolean {
  return (
    element.tagName === "pre" &&
    Array.isArray(element.children) &&
    element.children.length === 1 &&
    isElement(element.children[0]) &&
    element.children[0].tagName === "code"
  );
}

interface ParsedMeta {
  title: string | null;
  showLineNumbers: boolean;
  collapsible: boolean;
  lang: string;
}

function parseMetaString(element: Element, defaultLang: string): ParsedMeta {
  // Get meta from data.meta (remark) or properties.metastring (some processors)
  const rawMeta = ((element.data as Record<string, unknown>)?.meta ??
    element.properties?.metastring ??
    "") as string;

  // Parse title="..." or filename="..."
  const titleMatch =
    rawMeta.match(/(?:title|filename)=["']([^"']+)["']/) ||
    rawMeta.match(/(?:title|filename)=(\S+)/);
  const title = titleMatch?.[1] ?? null;

  // Parse boolean flags
  const showLineNumbers =
    rawMeta.includes("showLineNumbers") || rawMeta.includes("line-numbers");
  const collapsible = rawMeta.includes("collapsible");

  // Get language from className
  let lang = defaultLang;
  if (
    element.properties &&
    Array.isArray(element.properties.className) &&
    typeof element.properties.className[0] === "string" &&
    element.properties.className[0].startsWith("language-")
  ) {
    lang = element.properties.className[0].replace("language-", "");
  }

  return { title, showLineNumbers, collapsible, lang };
}

export function rehypeCodeBlock() {
  return (tree: Root) => {
    visit(tree, "element", element => {
      if (!isBlockCode(element)) return;

      const codeElement = element.children[0];
      if (!isElement(codeElement)) return;

      const { title, showLineNumbers, collapsible, lang } = parseMetaString(
        codeElement,
        "plaintext",
      );

      // Add data attributes to the pre element
      // The Pre component will read these and pass them to CodeBlock
      element.properties = element.properties || {};
      element.properties["data-language"] = lang;

      if (title) {
        element.properties["data-title"] = title;
      }
      if (showLineNumbers) {
        element.properties["data-show-line-numbers"] = "";
      }
      if (collapsible) {
        element.properties["data-collapsible"] = "";
      }
    });
  };
}
