/**
 * Do11y — documentation observability.
 *
 * Builds the browser-side configuration consumed by the Do11y standalone
 * bundle (loaded from the CDN in `pages/_document.tsx`). The site does not
 * match any of Do11y's built-in framework presets, so it runs in `custom`
 * mode and every selector is pinned to a `data-do11y-*` hook that we add to
 * the relevant components.
 *
 * See: https://github.com/manototh/do11y
 */

/** Selector hooks. Each value must match a `data-do11y-*` attribute in the UI. */
export const DO11Y_SELECTORS = {
  searchSelector: "[data-do11y-search]",
  copyButtonSelector: "[data-do11y-copy]",
  codeBlockSelector: "[data-do11y-code-block]",
  navigationSelector: "[data-do11y-nav]",
  footerSelector: "[data-do11y-footer]",
  contentSelector: "[data-do11y-content]",
  tabContainerSelector: "[data-do11y-tabs]",
  tocSelector: "[data-do11y-toc]",
  feedbackSelector: "[data-do11y-feedback]",
} as const;

/** Hosts allowed to send events. Any other host disables tracking entirely. */
const DEFAULT_ALLOWED_DOMAINS = ["docs.railway.com"];

export interface Do11yClientConfig {
  destination: "supabase";
  supabaseUrl: string;
  supabaseKey: string;
  supabaseTable: string;
  framework: "custom";
  debug: boolean;
  trackSpaPathChanges: boolean;
  trackFeedback: boolean;
  allowedDomains: string[] | null;
  [key: string]: unknown;
}

const parseAllowedDomains = (raw: string | undefined): string[] | null => {
  // An explicitly empty value means "no restriction" (enables any host).
  if (raw === "") return null;
  const source = raw ?? DEFAULT_ALLOWED_DOMAINS.join(",");
  const domains = source
    .split(",")
    .map(domain => domain.trim())
    .filter(Boolean);
  return domains.length > 0 ? domains : null;
};

/**
export const isDo11yEnabled = (): boolean =>
  process.env.NEXT_PUBLIC_DO11Y_ENABLED !== "false" &&
  Boolean(
    process.env.NEXT_PUBLIC_DO11Y_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_DO11Y_SUPABASE_KEY,
  );

/**
 *
 * Credentials are read at build time: the docs pages are statically generated,
 * so these values must be present in the build environment.
 */
export const getDo11yConfig = (): Do11yClientConfig | null => {
  const supabaseUrl = process.env.NEXT_PUBLIC_DO11Y_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_DO11Y_SUPABASE_KEY;

  if (!isDo11yEnabled() || !supabaseUrl || !supabaseKey) return null;

  return {
    destination: "supabase",
    supabaseUrl,
    supabaseKey,
    supabaseTable: process.env.NEXT_PUBLIC_DO11Y_TABLE || "do11y_events",
    framework: "custom",
    // Only noisy in development; useless in the production console.
    debug:
      process.env.NEXT_PUBLIC_DO11Y_DEBUG === "true" ||
      process.env.NODE_ENV !== "production",
    // The Next.js router updates the DOM without a full page load; the
    // standalone build's path poll only resumes after a tab switch when this
    // is enabled.
    trackSpaPathChanges: true,
    // The tab buttons deliberately carry no aria-selected or `.active` marker:
    // Do11y skips a click when the clicked tab already reports either of those,
    // and React flushes the attribute update before Do11y's delegated document
    // listener runs, which would suppress every tab_switch event. Without the
    // marker, re-clicking the already-active tab also emits.
    trackTabSwitches: true,
    // No "was this helpful?" widget exists on the site.
    trackFeedback: false,
    allowedDomains: parseAllowedDomains(
      process.env.NEXT_PUBLIC_DO11Y_ALLOWED_DOMAINS,
    ),
    ...DO11Y_SELECTORS,
  };
};

export const DO11Y_CONFIG_SCRIPT_ID = "do11y-config";

export const DO11Y_SCRIPT_SRC =
  "https://cdn.jsdelivr.net/npm/@manototh/do11y@latest/dist/do11y.min.js";

/**
 * Serialises the config into an inline `<script>` body. The Do11y bundle reads
 * `window.Do11yConfig` on load, so this must be emitted before the bundle.
 */
export const buildDo11yConfigScript = (config: Do11yClientConfig): string => {
  const json = JSON.stringify(config).replace(/</g, "\\u003c");
  return `window.Do11yConfig=${json};`;
};
