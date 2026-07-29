import type { GetServerSideProps } from "next";
import { allGuides } from "content-collections";

const BASE_URL = "https://docs.railway.com";
const FEED_LIMIT = 50;

const escapeXML = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  // Sort by lastModified descending (most recently updated first), cap at FEED_LIMIT
  const guides = [...allGuides]
    .sort((a, b) => {
      const da = a.lastModified ?? "";
      const db = b.lastModified ?? "";
      return db.localeCompare(da);
    })
    .slice(0, FEED_LIMIT);

  const items = guides
    .map((guide) => {
      const link = `${BASE_URL}${guide.url}`;
      const pubDate = guide.lastModified
        ? new Date(guide.lastModified).toUTCString()
        : new Date().toUTCString();
      const tags = (guide.tags ?? [])
        .map((tag) => `      <category>${escapeXML(tag)}</category>`)
        .join("\n");

      return `    <item>
      <title>${escapeXML(guide.title)}</title>
      <link>${escapeXML(link)}</link>
      <guid isPermaLink="true">${escapeXML(link)}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXML(guide.description)}</description>
${tags}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Railway Guides</title>
    <link>${BASE_URL}/guides</link>
    <description>In-depth guides, tutorials, and how-tos for deploying on Railway</description>
    <language>en</language>
    <atom:link href="${BASE_URL}/guides/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=3600, stale-while-revalidate=86400",
  );
  res.write(xml);
  res.end();

  return { props: {} };
};

const Noop = () => null;
export default Noop;
