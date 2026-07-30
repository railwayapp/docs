import { mkdirSync, readdirSync, statSync, writeFileSync } from "fs";
import { join, relative, sep } from "path";

/**
 * Emits src/generated/page-urls.json: the URL of every page that has a `.md`
 * representation. Mirrors the url fields computed in content-collections.ts
 * (`/${_meta.path}` for content/docs, `/guides/${_meta.path}` for
 * content/guides) without importing the collections, so consumers like the
 * SEO component don't pull every document's compiled body into the client
 * bundle.
 */
function mdPaths(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) out.push(...mdPaths(p));
    else if (entry.endsWith(".md")) out.push(p);
  }
  return out;
}

const toUrl = (base: string, prefix: string) => (p: string) =>
  prefix + relative(base, p).split(sep).join("/").replace(/\.md$/, "");

const urls = [
  ...mdPaths("content/docs").map(toUrl("content/docs", "/")),
  ...mdPaths("content/guides").map(toUrl("content/guides", "/guides/")),
].sort();

mkdirSync("src/generated", { recursive: true });
writeFileSync(
  "src/generated/page-urls.json",
  JSON.stringify(urls, null, 2) + "\n",
);
console.log(`page-urls: wrote ${urls.length} urls`);
