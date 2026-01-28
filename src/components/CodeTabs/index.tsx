import React, { useState, useMemo, useCallback } from "react";
import "twin.macro";
import { CodeBlock } from "../CodeBlock";
import {
  toCurl,
  toJavaScript,
  toPython,
  Language,
  LANGUAGE_LABELS,
  LANGUAGE_SYNTAX,
} from "./transforms";

export interface CodeTabsProps {
  /** The GraphQL query */
  query: string;
  /** Optional variables for the query - values are used as placeholders */
  variables?: Record<string, any>;
  /** Optional title displayed above the tabs */
  title?: string;
}

/**
 * Flatten nested objects into dot-notation paths for input fields
 * e.g., { input: { projectId: "x" } } -> { "input.projectId": "x" }
 */
const flattenVariables = (
  obj: Record<string, any>,
  prefix = ""
): Record<string, string> => {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      Object.assign(result, flattenVariables(value, path));
    } else {
      result[path] = String(value);
    }
  }
  return result;
};

/**
 * Unflatten dot-notation paths back to nested object
 * e.g., { "input.projectId": "x" } -> { input: { projectId: "x" } }
 */
const unflattenVariables = (flat: Record<string, string>): Record<string, any> => {
  const result: Record<string, any> = {};
  for (const [path, value] of Object.entries(flat)) {
    const keys = path.split(".");
    let current = result;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!(keys[i] in current)) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
  }
  return result;
};

/**
 * Format a variable path as a human-readable label
 * e.g., "input.projectId" -> "Project ID"
 */
const formatLabel = (path: string): string => {
  const key = path.split(".").pop() || path;
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .replace(/Id$/, "ID")
    .trim();
};

/**
 * CodeTabs component that displays a GraphQL query in multiple formats.
 * Automatically generates cURL, JavaScript, and Python equivalents.
 */
export const CodeTabs: React.FC<CodeTabsProps> = ({
  query,
  variables,
  title,
}) => {
  const [activeTab, setActiveTab] = useState<Language>("graphql");

  // Initialize editable values from the variables prop (flattened for easy input binding)
  const initialValues = useMemo(
    () => (variables ? flattenVariables(variables) : {}),
    [variables]
  );
  const [editedValues, setEditedValues] = useState<Record<string, string>>(initialValues);

  const handleValueChange = useCallback((path: string, value: string) => {
    setEditedValues((prev) => ({ ...prev, [path]: value }));
  }, []);

  // Reconstruct nested variables object from edited flat values
  const currentVariables = useMemo(
    () => (Object.keys(editedValues).length > 0 ? unflattenVariables(editedValues) : undefined),
    [editedValues]
  );

  const codeByLanguage = useMemo(() => {
    const trimmedQuery = query.trim();
    return {
      graphql: trimmedQuery,
      curl: toCurl(trimmedQuery, currentVariables),
      javascript: toJavaScript(trimmedQuery, currentVariables),
      python: toPython(trimmedQuery, currentVariables),
    };
  }, [query, currentVariables]);

  const languages: Language[] = ["graphql", "curl", "javascript", "python"];

  const variableEntries = Object.entries(editedValues);
  const hasVariables = variableEntries.length > 0;

  return (
    <div tw="my-4">
      {title && (
        <div tw="text-sm font-medium text-gray-700 mb-2">
          {title}
        </div>
      )}
      <div tw="border border-gray-200 rounded-lg overflow-hidden">
        {/* Variable input fields */}
        {hasVariables && (
          <div tw="bg-gray-100 px-4 py-3 border-b border-gray-200">
            <div tw="grid gap-2" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
              {variableEntries.map(([path, value]) => (
                <div key={path} tw="flex flex-col gap-1">
                  <label
                    htmlFor={`var-${path}`}
                    tw="text-xs font-medium text-gray-600"
                  >
                    {formatLabel(path)}
                  </label>
                  <input
                    id={`var-${path}`}
                    type="text"
                    value={value}
                    onChange={(e) => handleValueChange(path, e.target.value)}
                    tw="px-2 py-1 text-sm border border-gray-300 rounded font-mono focus:outline-none focus:ring-1"
                    css="focus:ring-color: var(--colors-pink-500); focus:border-color: var(--colors-pink-500);"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab buttons */}
        <div tw="flex border-b border-gray-200 bg-gray-100">
          {languages.map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setActiveTab(lang)}
              tw="px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-0"
              css={[
                activeTab === lang
                  ? "color: var(--colors-pink-500); border-bottom: 2px solid var(--colors-pink-500); margin-bottom: -1px; background: var(--colors-background);"
                  : "color: var(--colors-gray-600); border-bottom: 2px solid transparent; &:hover { color: var(--colors-gray-900); }",
              ]}
            >
              {LANGUAGE_LABELS[lang]}
            </button>
          ))}
        </div>

        {/* Code content */}
        <div tw="[&>div]:rounded-none [&>div]:my-0">
          <CodeBlock language={LANGUAGE_SYNTAX[activeTab]}>
            {codeByLanguage[activeTab]}
          </CodeBlock>
        </div>
      </div>
    </div>
  );
};

export default CodeTabs;
