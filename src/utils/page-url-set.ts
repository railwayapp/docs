import pageUrls from "@/generated/page-urls.json";

/**
 * Set of all page URL paths that have a corresponding `.md` representation.
 * Used by the proxy middleware (to gate rewrites) and the SEO component
 * (to gate the `<link rel="alternate" type="text/markdown">` tag so we
 * never advertise a `.md` URL that would 404).
 *
 * Reads the build-generated URL list (src/plugins/page-urls.ts) instead of
 * content-collections: importing the collections here inlined every
 * document's compiled body into the client bundle (~7.6 MB), since the SEO
 * component renders on every page.
 */
export const pageUrlSet = new Set<string>(pageUrls);
