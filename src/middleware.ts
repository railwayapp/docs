import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { allPages } from "contentlayer/generated";

const pageUrlSet = new Set(allPages.map(page => page.url));

// This middleware is used to rewrite the pathname to the SSR path during runtime as middleware is not ran during build
export function middleware(request: NextRequest) {
  if (!pageUrlSet.has(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = "/dynamic" + url.pathname;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: "/:path*",
};
