import { allPages, allGuides } from "content-collections";

/**
 * Set of all page URL paths that have a corresponding `.md` representation.
 * Used by the proxy middleware (to gate rewrites) and the SEO component
 * (to gate the `<link rel="alternate" type="text/markdown">` tag so we
 * never advertise a `.md` URL that would 404).
 */
export const pageUrlSet = new Set([
  ...allPages.map(page => page.url),
  ...allGuides.map(guide => guide.url),
]);
