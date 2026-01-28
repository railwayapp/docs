/**
 * Transform GraphQL queries to other formats (cURL, JavaScript, Python)
 */

const ENDPOINT = "https://backboard.railway.com/graphql/v2";

/**
 * Escape special characters for shell strings
 */
const escapeShell = (str: string): string => {
  return str.replace(/'/g, "'\\''");
};

/**
 * Format GraphQL query for display (trim and normalize indentation)
 */
const formatQuery = (query: string): string => {
  const lines = query.split("\n");

  // Find minimum indentation (ignoring empty lines)
  const minIndent = lines
    .filter((line) => line.trim().length > 0)
    .reduce((min, line) => {
      const indent = line.match(/^(\s*)/)?.[1].length ?? 0;
      return Math.min(min, indent);
    }, Infinity);

  // Remove common indentation and trim
  return lines
    .map((line) => line.slice(minIndent === Infinity ? 0 : minIndent))
    .join("\n")
    .trim();
};

/**
 * Convert GraphQL to cURL command
 */
export const toCurl = (query: string, variables?: object): string => {
  const formattedQuery = formatQuery(query);
  const body = JSON.stringify({
    query: formattedQuery,
    ...(variables && Object.keys(variables).length > 0 ? { variables } : {}),
  });

  return `curl -X POST ${ENDPOINT} \\
  -H "Authorization: Bearer $RAILWAY_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '${escapeShell(body)}'`;
};

/**
 * Convert GraphQL to JavaScript fetch
 */
export const toJavaScript = (query: string, variables?: object): string => {
  const formattedQuery = formatQuery(query);
  const hasVariables = variables && Object.keys(variables).length > 0;

  const bodyContent = hasVariables
    ? `{
      query: \`${formattedQuery}\`,
      variables: ${JSON.stringify(variables, null, 2).split("\n").join("\n      ")},
    }`
    : `{
      query: \`${formattedQuery}\`,
    }`;

  return `const response = await fetch("${ENDPOINT}", {
  method: "POST",
  headers: {
    "Authorization": \`Bearer \${process.env.RAILWAY_TOKEN}\`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(${bodyContent}),
});

const { data, errors } = await response.json();`;
};

/**
 * Convert GraphQL to Python requests
 */
export const toPython = (query: string, variables?: object): string => {
  const formattedQuery = formatQuery(query);
  const hasVariables = variables && Object.keys(variables).length > 0;

  const jsonContent = hasVariables
    ? `{
        "query": """${formattedQuery}""",
        "variables": ${JSON.stringify(variables, null, 2).split("\n").join("\n        ")},
    }`
    : `{
        "query": """${formattedQuery}""",
    }`;

  return `import os
import requests

response = requests.post(
    "${ENDPOINT}",
    headers={
        "Authorization": f"Bearer {os.environ['RAILWAY_TOKEN']}",
        "Content-Type": "application/json",
    },
    json=${jsonContent},
)

data = response.json()`;
};

export type Language = "graphql" | "curl" | "javascript" | "python";

export const LANGUAGE_LABELS: Record<Language, string> = {
  graphql: "GraphQL",
  curl: "cURL",
  javascript: "JavaScript",
  python: "Python",
};

export const LANGUAGE_SYNTAX: Record<Language, string> = {
  graphql: "graphql",
  curl: "bash",
  javascript: "javascript",
  python: "python",
};
