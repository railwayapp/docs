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

export default env;
