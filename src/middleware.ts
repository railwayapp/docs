import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { allPages } from "contentlayer/generated";

const pageUrlSet = new Set(allPages.map(page => page.url));

function prefersMarkdown(acceptHeader: string): boolean {
  const types = acceptHeader.split(",");
  const mdIdx = types.findIndex(t => t.includes("text/markdown") || t.includes("text/plain"));
  const htmlIdx = types.findIndex(t => t.includes("text/html"));
  return mdIdx !== -1 && (htmlIdx === -1 || mdIdx < htmlIdx);
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
    prefersMarkdown(request.headers.get("accept") || "");

  const url = request.nextUrl.clone();
  url.pathname = "/dynamic" + pagePath;
  if (wantsMarkdown) {
    url.searchParams.set("format", "md");
  }
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: "/:path*",
};
