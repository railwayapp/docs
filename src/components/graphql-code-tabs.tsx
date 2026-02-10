"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { Icon } from "./icon";
import { useCopyableCode } from "@/contexts/copyable-code-context";
import { codeToHtml, bundledLanguages, type BundledLanguage } from "shiki";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
  transformerRemoveLineBreak,
} from "@shikijs/transformers";

// Check if a language is supported by shiki
function isSupportedLanguage(lang: string): lang is BundledLanguage {
  return lang in bundledLanguages;
}

interface RequiredField {
  name: string; // Display name
  label: string; // Input placeholder
  path: string; // Dot-notation path in variables (e.g., "input.projectId")
}

interface OptionalField {
  name: string;
  type: string;
  description: string;
  apiDefault?: string;
}

interface GraphQLCodeTabsProps {
  query: string;
  variables?: Record<string, unknown>;
  requiredFields?: RequiredField[];
  optionalFields?: OptionalField[];
  className?: string;
}

type TabType = "graphql" | "curl" | "javascript" | "python";

const TABS: { id: TabType; label: string; lang: string }[] = [
  { id: "graphql", label: "GraphQL", lang: "graphql" },
  { id: "curl", label: "cURL", lang: "bash" },
  { id: "javascript", label: "JavaScript", lang: "javascript" },
  { id: "python", label: "Python", lang: "python" },
];

/**
 * An interactive code tabs component for GraphQL API documentation.
 * Features:
 * - 4 language tabs: GraphQL, cURL, JavaScript, Python
 * - Editable required fields that update code in real-time
 * - Collapsible optional fields documentation
 */
export function GraphQLCodeTabs({
  query,
  variables,
  requiredFields,
  optionalFields,
  className,
}: GraphQLCodeTabsProps) {
  const [activeTab, setActiveTab] = React.useState<TabType>("graphql");
  const [inputValues, setInputValues] = React.useState<Record<string, string>>(
    {},
  );
  const [optionalExpanded, setOptionalExpanded] = React.useState(false);
  const [htmlCache, setHtmlCache] = React.useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = React.useState(true);
  const { copied, copy } = useCopyToClipboard();

  // Merge user input values into the variables object
  const dynamicVariables = React.useMemo(() => {
    if (!variables) return undefined;

    // Deep clone the variables
    const result = JSON.parse(JSON.stringify(variables));

    // Apply input values using path notation
    Object.entries(inputValues).forEach(([path, value]) => {
      if (value) {
        setNestedValue(result, path, value);
      }
    });

    return result;
  }, [variables, inputValues]);

  // Generate code for each tab
  const codeByTab = React.useMemo(() => {
    return {
      graphql: query,
      curl: generateCurl(query, dynamicVariables),
      javascript: generateJavaScript(query, dynamicVariables),
      python: generatePython(query, dynamicVariables),
    };
  }, [query, dynamicVariables]);

  const activeCode = codeByTab[activeTab];
  const activeLang = TABS.find(t => t.id === activeTab)?.lang || "text";

  // Register all language variants for page-level copy
  const copyableCode = useCopyableCode();
  const copyIdRef = React.useRef<number | null>(null);
  if (copyableCode && copyIdRef.current === null) {
    copyIdRef.current = copyableCode.claimId();
  }

  const variablesJson = dynamicVariables
    ? JSON.stringify(dynamicVariables, null, 2)
    : null;

  React.useEffect(() => {
    if (!copyableCode || copyIdRef.current === null) return;

    const parts: string[] = [];
    for (const tab of TABS) {
      parts.push("```" + tab.lang);
      parts.push(codeByTab[tab.id]);
      parts.push("```");
      parts.push("");
    }
    if (variablesJson) {
      parts.push("Variables:");
      parts.push("```json");
      parts.push(variablesJson);
      parts.push("```");
      parts.push("");
    }

    const id = copyIdRef.current;
    copyableCode.set(id, parts.join("\n"));
    return () => {
      copyableCode.remove(id);
    };
  }, [copyableCode, codeByTab, variablesJson]);

  // Highlight code when tab or code changes
  React.useEffect(() => {
    const cacheKey = `${activeTab}-${activeCode}`;

    if (htmlCache[cacheKey]) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    async function highlight() {
      try {
        const normalizedLang = activeLang.toLowerCase();
        const effectiveLang = isSupportedLanguage(normalizedLang)
          ? normalizedLang
          : "plaintext";

        const result = await codeToHtml(activeCode, {
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
          setHtmlCache(prev => ({ ...prev, [cacheKey]: result }));
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Shiki highlighting error:", error);
        if (!cancelled) {
          const escapedCode = activeCode
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
          const lines = escapedCode
            .split("\n")
            .map(line => `<span class="line">${line}</span>`)
            .join("\n");
          const fallback = `<pre class="shiki"><code>${lines}</code></pre>`;
          setHtmlCache(prev => ({ ...prev, [cacheKey]: fallback }));
          setIsLoading(false);
        }
      }
    }

    highlight();

    return () => {
      cancelled = true;
    };
  }, [activeTab, activeCode, activeLang, htmlCache]);

  const updateInput = (path: string, value: string) => {
    setInputValues(prev => ({ ...prev, [path]: value }));
  };

  // Get initial value for an input from the variables
  const getInitialValue = (path: string): string => {
    if (inputValues[path] !== undefined) {
      return inputValues[path];
    }
    if (!variables) return "";
    const value = getNestedValue(variables, path);
    return typeof value === "string" ? value : "";
  };

  const cacheKey = `${activeTab}-${activeCode}`;

  return (
    <div className={cn("my-6 space-y-3", className)}>
      {/* Required fields inputs */}
      {requiredFields && requiredFields.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-muted-high-contrast">
            Required
          </span>
          {requiredFields.map(field => (
            <input
              key={field.path}
              type="text"
              placeholder={field.label}
              value={getInitialValue(field.path)}
              onChange={e => updateInput(field.path, e.target.value)}
              className="h-8 rounded-md border border-muted bg-muted-app px-2.5 text-sm text-muted-high-contrast placeholder:text-muted-base focus:border-primary-base focus:outline-none focus:ring-1 focus:ring-primary-base"
            />
          ))}
        </div>
      )}

      {/* Code block with tabs */}
      <div className="overflow-hidden rounded-lg border border-muted bg-muted-app-subtle">
        {/* Header with tabs and copy button */}
        <div className="flex items-center justify-between border-b border-muted bg-muted-element/50 px-3 py-2 sm:px-4">
          <div className="flex items-center gap-1 overflow-x-auto">
            {TABS.map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "rounded-md px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap",
                  activeTab === tab.id
                    ? "bg-white dark:bg-muted-element-active text-muted-high-contrast shadow-sm"
                    : "text-muted-base hover:text-muted-high-contrast hover:bg-muted-element/50",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => copy(activeCode)}
            className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-base transition-all hover:bg-muted-element hover:text-muted-high-contrast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-solid"
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
              dangerouslySetInnerHTML={{ __html: htmlCache[cacheKey] || "" }}
            />
          )}
        </div>
      </div>

      {/* Variables section - only for GraphQL tab since other formats inline them */}
      {activeTab === "graphql" && dynamicVariables && <VariablesSection variables={dynamicVariables} />}

      {/* Optional fields collapsible */}
      {optionalFields && optionalFields.length > 0 && (
        <div className="rounded-lg border border-muted">
          <button
            type="button"
            onClick={() => setOptionalExpanded(prev => !prev)}
            className="flex w-full items-center justify-between px-3 py-2 text-sm font-medium text-muted-high-contrast hover:bg-muted-element/30"
          >
            <span>Optional fields ({optionalFields.length} available)</span>
            <Icon
              name={optionalExpanded ? "ChevronUp" : "ChevronDown"}
              className="size-4 text-muted-base"
            />
          </button>
          {optionalExpanded && (
            <div className="border-t border-muted px-3 py-2">
              <div className="space-y-1.5">
                {optionalFields.map(field => (
                  <div key={field.name} className="text-sm">
                    <code className="rounded bg-muted-element px-1 py-0.5 text-xs text-muted-high-contrast">
                      {field.name}
                    </code>{" "}
                    <span className="text-muted-base">({field.type})</span>
                    {field.description && (
                      <span className="text-muted-base">
                        {" "}
                        - {field.description}
                      </span>
                    )}
                    {field.apiDefault && (
                      <span className="text-muted-base">
                        . Default:{" "}
                        <code className="text-xs">{field.apiDefault}</code>
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Variables section with syntax highlighting
function VariablesSection({
  variables,
}: {
  variables: Record<string, unknown>;
}) {
  const [html, setHtml] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState(true);
  const code = JSON.stringify(variables, null, 2);

  React.useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    async function highlight() {
      try {
        const result = await codeToHtml(code, {
          lang: "json",
          themes: {
            light: "one-light",
            dark: "one-dark-pro",
          },
          defaultColor: false,
          transformers: [transformerRemoveLineBreak()],
        });

        if (!cancelled) {
          setHtml(result);
          setIsLoading(false);
        }
      } catch {
        if (!cancelled) {
          const escaped = code.replace(/</g, "&lt;").replace(/>/g, "&gt;");
          setHtml(`<pre class="shiki"><code>${escaped}</code></pre>`);
          setIsLoading(false);
        }
      }
    }

    highlight();

    return () => {
      cancelled = true;
    };
  }, [code]);

  return (
    <div>
      <span className="text-sm font-medium text-muted-high-contrast">
        Variables
      </span>
      <div className="mt-1 overflow-hidden rounded-lg border border-muted bg-muted-app-subtle">
        <div className="overflow-x-auto text-sm">
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <Icon
                name="Spinner"
                className="size-4 animate-spin text-muted-base"
              />
            </div>
          ) : (
            <div
              className="shiki-wrapper"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Helper: Set a nested value using dot notation path
function setNestedValue(
  obj: Record<string, unknown>,
  path: string,
  value: unknown,
): void {
  const keys = path.split(".");
  let current: Record<string, unknown> = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in current) || typeof current[key] !== "object") {
      current[key] = {};
    }
    current = current[key] as Record<string, unknown>;
  }

  current[keys[keys.length - 1]] = value;
}

// Helper: Get a nested value using dot notation path
function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  const keys = path.split(".");
  let current: unknown = obj;

  for (const key of keys) {
    if (current === null || current === undefined) return undefined;
    if (typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[key];
  }

  return current;
}

// Code generators
function generateCurl(
  query: string,
  variables?: Record<string, unknown>,
): string {
  const body: { query: string; variables?: Record<string, unknown> } = {
    query,
  };
  if (variables) {
    body.variables = variables;
  }

  const jsonBody = JSON.stringify(body);

  return `curl -X POST https://backboard.railway.com/graphql/v2 \\
  -H "Authorization: Bearer $RAILWAY_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '${jsonBody}'`;
}

function generateJavaScript(
  query: string,
  variables?: Record<string, unknown>,
): string {
  const varsStr = variables
    ? `\n    variables: ${JSON.stringify(variables, null, 2)
        .split("\n")
        .join("\n    ")},`
    : "";

  return `const response = await fetch("https://backboard.railway.com/graphql/v2", {
  method: "POST",
  headers: {
    "Authorization": \`Bearer \${process.env.RAILWAY_TOKEN}\`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: \`${query}\`,${varsStr}
  }),
});

const data = await response.json();
console.log(data);`;
}

function generatePython(
  query: string,
  variables?: Record<string, unknown>,
): string {
  const varsStr = variables
    ? `\n        "variables": ${JSON.stringify(variables, null, 2)
        .split("\n")
        .join("\n        ")},`
    : "";

  return `import requests
import os

response = requests.post(
    "https://backboard.railway.com/graphql/v2",
    headers={
        "Authorization": f"Bearer {os.environ['RAILWAY_TOKEN']}",
        "Content-Type": "application/json",
    },
    json={
        "query": """${query}""",${varsStr}
    },
)

data = response.json()
print(data)`;
}
