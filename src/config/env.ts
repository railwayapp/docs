import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_RAILWAY_DOCS_URL: z
    .string()
    .min(1, "NEXT_PUBLIC_RAILWAY_DOCS_URL is required"),
  NEXT_PUBLIC_MEILISEARCH_HOST: z
    .string()
    .min(1, "NEXT_PUBLIC_MEILISEARCH_HOST is required"),
  NEXT_PUBLIC_MEILISEARCH_READ_API_KEY: z
    .string()
    .min(1, "NEXT_PUBLIC_MEILISEARCH_READ_API_KEY is required"),
  NEXT_PUBLIC_MEILISEARCH_INDEX_NAME: z
    .string()
    .min(1, "NEXT_PUBLIC_MEILISEARCH_INDEX_NAME is required"),

  NEXT_PUBLIC_FATHOM_CODE: z.string().optional().default(""),
  NEXT_PUBLIC_POSTHOG_API_KEY: z.string().optional().default(""),
  NEXT_PUBLIC_POSTHOG_HOST: z
    .string()
    .optional()
    .default("https://app.posthog.com"),

  DISCORD_WEBHOOK: z.string().optional().default(""),
  EXPORT_ENDPOINT_PASSWORD: z.string().optional().default(""),
});

const env = envSchema.parse(process.env);

export type Environment = z.infer<typeof envSchema>;

export const RAILWAY_DOCS_URL = env.NEXT_PUBLIC_RAILWAY_DOCS_URL;

export const MEILISEARCH_HOST = env.NEXT_PUBLIC_MEILISEARCH_HOST;
export const MEILISEARCH_READ_API_KEY = env.NEXT_PUBLIC_MEILISEARCH_READ_API_KEY;
export const MEILISEARCH_INDEX_NAME = env.NEXT_PUBLIC_MEILISEARCH_INDEX_NAME;

export const FATHOM_CODE = env.NEXT_PUBLIC_FATHOM_CODE;
export const POSTHOG_API_KEY = env.NEXT_PUBLIC_POSTHOG_API_KEY;
export const POSTHOG_HOST = env.NEXT_PUBLIC_POSTHOG_HOST;

export const DISCORD_WEBHOOK = env.DISCORD_WEBHOOK;
export const EXPORT_ENDPOINT_PASSWORD = env.EXPORT_ENDPOINT_PASSWORD;

export default env;


