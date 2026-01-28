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

export interface OptionalField {
  /** Field name in dot notation (e.g., "input.description") */
  name: string;
  /** GraphQL type (e.g., "String", "Int!") */
  type: string;
  /** Description of what this field does */
  description?: string;
  /** Default/placeholder value when added */
  defaultValue?: string;
}

export interface CodeTabsProps {
  /** The GraphQL query */
  query: string;
  /** Optional variables for the query - values are used as placeholders */
  variables?: Record<string, any>;
  /** Optional title displayed above the tabs */
  title?: string;
  /** Optional fields that can be added to the query (Option A) */
  optionalFields?: OptionalField[];
  /** Link to view the input type schema (Option B) */
  schemaLink?: string;
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
 * Get a default placeholder value based on GraphQL type
 */
const getDefaultForType = (type: string): string => {
  const baseType = type.replace(/[!\[\]]/g, "").trim();
  switch (baseType) {
    case "String":
      return "";
    case "Int":
      return "0";
    case "Float":
      return "0.0";
    case "Boolean":
      return "false";
    default:
      return "";
  }
};

/**
 * CodeTabs component that displays a GraphQL query in multiple formats.
 * Automatically generates cURL, JavaScript, and Python equivalents.
 */
export const CodeTabs: React.FC<CodeTabsProps> = ({
  query,
  variables,
  title,
  optionalFields,
  schemaLink,
}) => {
  const [activeTab, setActiveTab] = useState<Language>("graphql");
  const [showOptionalFields, setShowOptionalFields] = useState(false);

  // Track which fields are from the original variables vs added optional fields
  const initialValues = useMemo(
    () => (variables ? flattenVariables(variables) : {}),
    [variables]
  );
  const initialFieldKeys = useMemo(() => new Set(Object.keys(initialValues)), [initialValues]);

  const [editedValues, setEditedValues] = useState<Record<string, string>>(initialValues);

  const handleValueChange = useCallback((path: string, value: string) => {
    setEditedValues((prev) => ({ ...prev, [path]: value }));
  }, []);

  const handleAddField = useCallback((field: OptionalField) => {
    setEditedValues((prev) => ({
      ...prev,
      [field.name]: field.defaultValue ?? getDefaultForType(field.type),
    }));
  }, []);

  const handleRemoveField = useCallback((path: string) => {
    setEditedValues((prev) => {
      const next = { ...prev };
      delete next[path];
      return next;
    });
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

  // Variables JSON for GraphQL tab
  const variablesJson = useMemo(() => {
    if (!currentVariables || Object.keys(currentVariables).length === 0) return null;
    return JSON.stringify(currentVariables, null, 2);
  }, [currentVariables]);

  const languages: Language[] = ["graphql", "curl", "javascript", "python"];

  const variableEntries = Object.entries(editedValues);
  const hasVariables = variableEntries.length > 0;

  // Filter optional fields to only show ones not already added
  const availableOptionalFields = useMemo(() => {
    if (!optionalFields) return [];
    return optionalFields.filter((f) => !(f.name in editedValues));
  }, [optionalFields, editedValues]);

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
              {variableEntries.map(([path, value]) => {
                const isOptionalField = !initialFieldKeys.has(path);
                return (
                  <div key={path} tw="flex flex-col gap-1">
                    <label
                      htmlFor={`var-${path}`}
                      tw="text-xs font-medium text-gray-600 flex items-center gap-1"
                    >
                      {formatLabel(path)}
                      {isOptionalField && (
                        <button
                          type="button"
                          onClick={() => handleRemoveField(path)}
                          tw="text-gray-400 hover:text-red-500 transition-colors"
                          title="Remove field"
                        >
                          <svg style={{ width: 12, height: 12 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
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
                );
              })}
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
          {/* Schema link (Option B) */}
          {schemaLink && (
            <a
              href={schemaLink}
              target="_blank"
              rel="noopener noreferrer"
              tw="ml-auto px-4 py-2 text-sm text-gray-500 hover:text-pink-500 transition-colors flex items-center gap-1"
            >
              View schema
              <svg style={{ width: 12, height: 12 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>

        {/* Code content */}
        <div tw="[&>div]:rounded-none [&>div]:my-0">
          <CodeBlock language={LANGUAGE_SYNTAX[activeTab]}>
            {codeByLanguage[activeTab]}
          </CodeBlock>
        </div>

        {/* Variables block - only show for GraphQL tab when there are variables */}
        {activeTab === "graphql" && variablesJson && (
          <div tw="border-t border-gray-200">
            <div tw="bg-gray-100 px-4 py-2 text-xs font-medium text-gray-600">
              Variables
            </div>
            <div tw="[&>div]:rounded-none [&>div]:my-0">
              <CodeBlock language="json">
                {variablesJson}
              </CodeBlock>
            </div>
          </div>
        )}

        {/* Optional fields (Option A) - clickable to add */}
        {optionalFields && optionalFields.length > 0 && (
          <div tw="border-t border-gray-200">
            <button
              type="button"
              onClick={() => setShowOptionalFields(!showOptionalFields)}
              tw="w-full px-4 py-2 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <svg
                style={{
                  width: 12,
                  height: 12,
                  transition: "transform 0.2s",
                  transform: showOptionalFields ? "rotate(90deg)" : "rotate(0deg)"
                }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              {availableOptionalFields.length > 0
                ? `Additional options (${availableOptionalFields.length} more fields)`
                : "Additional options (all fields added)"}
            </button>
            {showOptionalFields && (
              <div tw="px-4 py-3 bg-gray-100 text-sm">
                {availableOptionalFields.length > 0 ? (
                  <table tw="w-full">
                    <thead>
                      <tr tw="text-left text-xs text-gray-500">
                        <th tw="pb-2 font-medium" style={{ width: 40 }}></th>
                        <th tw="pb-2 font-medium">Field</th>
                        <th tw="pb-2 font-medium">Type</th>
                        <th tw="pb-2 font-medium">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {availableOptionalFields.map((field) => (
                        <tr key={field.name} tw="border-t border-gray-200">
                          <td tw="py-2">
                            <button
                              type="button"
                              onClick={() => handleAddField(field)}
                              tw="text-pink-500 hover:text-pink-700 transition-colors"
                              title="Add this field"
                            >
                              <svg style={{ width: 16, height: 16 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                            </button>
                          </td>
                          <td tw="py-2 font-mono text-pink-600">{field.name.split('.').pop()}</td>
                          <td tw="py-2 font-mono text-gray-600">{field.type}</td>
                          <td tw="py-2 text-gray-600">{field.description || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div tw="text-gray-500 text-center py-2">
                    All optional fields have been added above.
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeTabs;
