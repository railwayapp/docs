import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { allPages, allGuides } from "content-collections";

const pageUrlSet = new Set([
  ...allPages.map(page => page.url),
  ...allGuides.map(guide => guide.url),
]);

function prefersMarkdown(acceptHeader: string): boolean {
  const types = acceptHeader.split(",");
  const mdIdx = types.findIndex(t => t.includes("text/markdown") || t.includes("text/plain"));
  const htmlIdx = types.findIndex(t => t.includes("text/html"));
  return mdIdx !== -1 && (htmlIdx === -1 || mdIdx < htmlIdx);
}

// Known AI agent / crawler user-agent patterns
const AI_UA_RE =
  /claudebot|claude-web|anthropic|gptbot|chatgpt|oai-searchbot|openai|perplexitybot|perplexity|cohere|gemini|googlebot-richsnippets|meta-externalagent|bingbot.*ai|bingpreview|duckassistbot/i;

function isAIAgent(uaHeader: string): boolean {
  return AI_UA_RE.test(uaHeader);
}

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const hasMdExtension = pathname.endsWith(".md");
  const pagePath = hasMdExtension ? pathname.slice(0, -3) : pathname;

  if (!pageUrlSet.has(pagePath)) {
    return NextResponse.next();
  }

  const wantsMarkdown =
    hasMdExtension ||
    searchParams.get("format") === "md" ||
    prefersMarkdown(request.headers.get("accept") || "") ||
    isAIAgent(request.headers.get("user-agent") || "");

  // Only rewrite to /dynamic (SSR) when markdown is actually needed;
  // otherwise let the request fall through to SSG pages for CDN caching.
  if (wantsMarkdown) {
    const url = request.nextUrl.clone();
    url.pathname = "/dynamic" + pagePath;
    url.searchParams.set("format", "md");
    const response = NextResponse.rewrite(url);
    response.headers.set("Vary", "Accept, User-Agent");
    return response;
  }

  // HTML path: pass through to SSG with CDN-friendly cache headers
  const response = NextResponse.next();
  response.headers.set("Vary", "Accept, User-Agent");
  response.headers.set(
    "Link",
    `<https://docs.railway.com${pagePath}.md>; rel="alternate"; type="text/markdown"`,
  );
  return response;
}

export const config = {
  matcher: "/:path*",
};
