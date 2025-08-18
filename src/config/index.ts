const requireEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
};

const getEnv = (name: string, defaultValue = ""): string => {
  const value = process.env[name];
  return value && value.length > 0 ? value : defaultValue;
};

export const RAILWAY_DOCS_URL = requireEnv("NEXT_PUBLIC_RAILWAY_DOCS_URL");

export const MEILISEARCH_HOST = requireEnv("NEXT_PUBLIC_MEILISEARCH_HOST");
export const MEILISEARCH_READ_API_KEY = requireEnv(
  "NEXT_PUBLIC_MEILISEARCH_READ_API_KEY",
);
export const MEILISEARCH_INDEX_NAME = requireEnv(
  "NEXT_PUBLIC_MEILISEARCH_INDEX_NAME",
);

export const FATHOM_CODE = getEnv("NEXT_PUBLIC_FATHOM_CODE");
export const POSTHOG_API_KEY = getEnv("NEXT_PUBLIC_POSTHOG_API_KEY");
export const POSTHOG_HOST = getEnv(
  "NEXT_PUBLIC_POSTHOG_HOST",
  "https://app.posthog.com",
);

export const DISCORD_WEBHOOK = getEnv("DISCORD_WEBHOOK");
export const EXPORT_ENDPOINT_PASSWORD = getEnv("EXPORT_ENDPOINT_PASSWORD");
